import {spawn} from 'node:child_process';
import {existsSync, writeFileSync} from 'node:fs';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const browserPath = existsSync(edge) ? edge : chrome;

const port = 9565;
const url = `file:///${join(root, 'index.html').replace(/\\/g, '/')}`;

console.log('Đang mở browser trích xuất đường viền từ assets/artwork.jpg...');

const proc = spawn(browserPath, [
  '--headless=new',
  '--allow-file-access-from-files',
  `--remote-debugging-port=${port}`,
  '--remote-debugging-address=127.0.0.1',
  url
]);

await new Promise(r => setTimeout(r, 2000));

try {
  const res = await fetch(`http://127.0.0.1:${port}/json/list`);
  const list = await res.json();
  const target = list.find(t => t.type === 'page');
  if (!target) {
    console.error('Không tìm thấy page target.');
    process.exit(1);
  }

  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise(r => { ws.onopen = r; });

  let resultPaths = null;
  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id === 42) {
      if (msg.result?.result?.value) {
        resultPaths = JSON.parse(msg.result.result.value);
      } else if (msg.result?.exceptionDetails) {
        console.error('Lỗi JS:', msg.result.exceptionDetails);
      }
    }
  };

  const code = `
    (() => {
      const art = document.querySelector('.artwork');
      const paths = window.imageSettings.extractContours(art);
      return JSON.stringify(paths);
    })()
  `;

  ws.send(JSON.stringify({
    id: 42,
    method: 'Runtime.evaluate',
    params: { expression: code, returnByValue: true }
  }));

  for (let i = 0; i < 50; i++) {
    if (resultPaths) break;
    await new Promise(r => setTimeout(r, 100));
  }

  ws.close();

  if (Array.isArray(resultPaths) && resultPaths.length > 0) {
    console.log(`ĐÃ TẠO THÀNH CÔNG ${resultPaths.length} ĐƯỜNG NÉT CONTOURS TỪ ARTWORK MỚI!`);
    const outputJs = `window.CONTOUR_PATHS=${JSON.stringify(resultPaths)};\n`;
    writeFileSync(join(root, 'assets', 'contours.js'), outputJs, 'utf8');
    console.log('Đã cập nhật assets/contours.js thành công!');
  } else {
    console.error('Không trích xuất được contours (kết quả rỗng).');
  }
} catch (err) {
  console.error('Lỗi:', err.message);
} finally {
  proc.kill();
}
