import {spawn} from 'node:child_process';
import {existsSync} from 'node:fs';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const exe = existsSync(edge) ? edge : chrome;

export async function runBenchmark(options = {}) {
  const port = options.port || 9444;
  const proc = spawn(exe, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--allow-file-access-from-files',
    '--disable-gpu'
  ]);

  try {
    await new Promise(r => setTimeout(r, 800));
    const res = await fetch(`http://127.0.0.1:${port}/json/list`);
    const targets = await res.json();
    const page = targets.find(t => t.type === 'page') || targets[0];
    const ws = new WebSocket(page.webSocketDebuggerUrl);

    return await new Promise((resolve, reject) => {
      let id = 1;
      const send = (method, params) => new Promise((resCall, rejCall) => {
        const curId = id++;
        const onMsg = (ev) => {
          const d = JSON.parse(ev.data);
          if (d.id === curId) {
            ws.removeEventListener('message', onMsg);
            if (d.error) rejCall(new Error(d.error.message));
            else resCall(d.result);
          }
        };
        ws.addEventListener('message', onMsg);
        ws.send(JSON.stringify({id: curId, method, params}));
      });

      ws.onopen = async () => {
        try {
          await send('Page.enable');
          const fileUrl = 'file:///' + join(root, 'index.html').replace(/\\/g, '/');
          await send('Page.navigate', {url: fileUrl});
          await new Promise(r => setTimeout(r, 600));

          // Inject benchmarking harness that records rAF deltas and render execution times
          const benchScript = `
            (() => {
              return new Promise((resolve) => {
                // Pause existing animation
                const pauseBtn = document.querySelector('#pause');
                if (pauseBtn && pauseBtn.textContent.includes('Tạm dừng') || pauseBtn.textContent.includes('Pause')) {
                  pauseBtn.click();
                }

                // Seek slider to s = 3.5 to warm up and test transition to s = 8.5
                const slider = document.querySelector('#timeline');
                slider.value = "3.5";
                slider.dispatchEvent(new Event('input'));

                const records = [];
                let lastTime = performance.now();
                let startTime = performance.now();
                let reachedEnd = false;

                const measureTick = () => {
                  const now = performance.now();
                  const delta = now - lastTime;
                  lastTime = now;

                  const elapsed = (window.__aemeathElapsed || 0) / 1000;
                  const renderMs = window.__aemeathRenderMs || 0;
                  const windowEl = document.querySelector('.window');
                  const stage = windowEl?.dataset?.stage || '';

                  records.push({
                    t: elapsed,
                    delta,
                    renderMs,
                    stage
                  });

                  if (elapsed >= 8.5 || (now - startTime > 7000)) {
                    pauseBtn.click();
                    resolve(records);
                    return;
                  }
                  requestAnimationFrame(measureTick);
                };

                // Click play and begin measuring
                setTimeout(() => {
                  lastTime = performance.now();
                  startTime = performance.now();
                  pauseBtn.click();
                  requestAnimationFrame(measureTick);
                }, 100);
              });
            })()
          `;

          const evalRes = await send('Runtime.evaluate', {
            expression: benchScript,
            awaitPromise: true,
            returnByValue: true
          });

          const records = evalRes.result?.value || [];
          resolve(records);
        } catch (err) {
          reject(err);
        } finally {
          ws.close();
          proc.kill();
        }
      };

      ws.onerror = (err) => {
        proc.kill();
        reject(err);
      };
    });
  } finally {
    try { proc.kill(); } catch {}
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  console.log('Đang chạy benchmark chuyển cảnh artwork/contours (s=3.5s -> 8.5s)...');
  const records = await runBenchmark();
  const deltas = records.map(r => r.delta).slice(1); // skip first frame seek delta
  if (!deltas.length) {
    console.error('Không thu thập được dữ liệu frame.');
    process.exit(1);
  }

  deltas.sort((a, b) => a - b);
  const median = deltas[Math.floor(deltas.length * 0.5)];
  const p95 = deltas[Math.floor(deltas.length * 0.95)];
  const max = deltas[deltas.length - 1];
  const over16 = deltas.filter(d => d > 16.7).length;
  const over33 = deltas.filter(d => d > 33.3).length;
  const over50 = deltas.filter(d => d > 50.0).length;

  const renderTimes = records.map(r => r.renderMs).slice(1);
  renderTimes.sort((a, b) => a - b);
  const renderMedian = renderTimes[Math.floor(renderTimes.length * 0.5)];
  const renderP95 = renderTimes[Math.floor(renderTimes.length * 0.95)];
  const renderMax = renderTimes[renderTimes.length - 1];

  console.log(`\n=== KẾT QUẢ ĐO FRAME (Tổng số frame: ${deltas.length}) ===`);
  console.log(`[Khoảng cách Frame (rAF delta)]`);
  console.log(`  Trung vị (Median):            ${median.toFixed(2)} ms`);
  console.log(`  P95:                          ${p95.toFixed(2)} ms`);
  console.log(`  Dài nhất (Max):               ${max.toFixed(2)} ms`);
  console.log(`  Số frame > 16.7ms (rớt 60FPS): ${over16} (${((over16/deltas.length)*100).toFixed(1)}%)`);
  console.log(`  Số frame > 33.3ms (rớt 30FPS): ${over33} (${((over33/deltas.length)*100).toFixed(1)}%)`);
  console.log(`  Số frame > 50.0ms (khựng rõ):  ${over50}`);

  console.log(`\n[Thời gian thực thi JavaScript (renderMs)]`);
  console.log(`  JS Trung vị (Median):         ${renderMedian.toFixed(2)} ms`);
  console.log(`  JS P95:                       ${renderP95.toFixed(2)} ms`);
  console.log(`  JS Dài nhất (Max):            ${renderMax.toFixed(2)} ms`);

  // Find longest frames and their timestamps
  const worst = [...records].sort((a, b) => b.delta - a.delta).slice(0, 5);
  console.log('\nTop 5 frame rAF delta dài nhất:');
  worst.forEach((w, i) => {
    console.log(`  ${i+1}. delta: ${w.delta.toFixed(2)} ms (render: ${w.renderMs.toFixed(2)} ms) tại s=${w.t.toFixed(2)}s (stage: ${w.stage})`);
  });
}
