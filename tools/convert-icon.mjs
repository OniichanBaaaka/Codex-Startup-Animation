import {spawn} from 'node:child_process';
import {existsSync, readFileSync, writeFileSync} from 'node:fs';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const jpgPath = join(root, 'assets', 'codex-pink.jpg');
const icnsPath = join(root, 'assets', 'codex-pink.icns');
const icoPath = join(root, 'assets', 'codex-pink.ico');

async function convertFromJpg() {
  const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const exe = existsSync(edge) ? edge : existsSync(chrome) ? chrome : null;
  if (!exe) return false;

  const port = 9338;
  const proc = spawn(exe, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--allow-file-access-from-files',
    '--disable-gpu'
  ]);

  return new Promise((resolve) => {
    setTimeout(async () => {
      try {
        const res = await fetch(`http://127.0.0.1:${port}/json/list`);
        const targets = await res.json();
        const page = targets.find(t => t.type === 'page') || targets[0];
        const ws = new WebSocket(page.webSocketDebuggerUrl);

        ws.onopen = async () => {
          let id = 1;
          const send = (method, params) => new Promise(r => {
            const curId = id++;
            const onMsg = (ev) => {
              const d = JSON.parse(ev.data);
              if (d.id === curId) { ws.removeEventListener('message', onMsg); r(d.result); }
            };
            ws.addEventListener('message', onMsg);
            ws.send(JSON.stringify({id: curId, method, params}));
          });

          await send('Page.enable');
          await send('Page.navigate', {url: 'file:///' + jpgPath.replace(/\\/g, '/')});
          await new Promise(r => setTimeout(r, 600));

          const script = `
            (() => {
              const img = document.querySelector('img');
              const sizes = [256, 128, 64, 48, 32, 16];
              const results = {};

              for (const size of sizes) {
                const canvas = document.createElement('canvas');
                canvas.width = size;
                canvas.height = size;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, size, size);

                const imgData = ctx.getImageData(0, 0, size, size);
                const data = imgData.data;

                for (let y = 0; y < size; y++) {
                  for (let x = 0; x < size; x++) {
                    const idx = (y * size + x) * 4;
                    const r = data[idx], g = data[idx+1], b = data[idx+2];
                    const cornerDistTL = Math.hypot(x, y);
                    const cornerDistTR = Math.hypot(size - 1 - x, y);
                    const cornerDistBL = Math.hypot(x, size - 1 - y);
                    const cornerDistBR = Math.hypot(size - 1 - x, size - 1 - y);
                    const minCornerDist = Math.min(cornerDistTL, cornerDistTR, cornerDistBL, cornerDistBR);
                    const cornerThreshold = size * 0.28;

                    if (minCornerDist < cornerThreshold && r < 35 && g < 35 && b < 35) {
                      if (minCornerDist > cornerThreshold - 2) {
                        data[idx+3] = Math.round(((minCornerDist - (cornerThreshold - 2)) / 2) * 255);
                      } else {
                        data[idx+3] = 0;
                      }
                    }
                  }
                }
                ctx.putImageData(imgData, 0, 0);
                results[size] = canvas.toDataURL('image/png').split(',')[1];
              }
              return JSON.stringify(results);
            })()
          `;

          const evalRes = await send('Runtime.evaluate', {expression: script, returnByValue: true});
          const pngMap = JSON.parse(evalRes.result.value);

          const sizes = [256, 128, 64, 48, 32, 16];
          const entries = [];
          const pngBuffers = [];
          let offset = 6 + sizes.length * 16;

          for (const size of sizes) {
            const buf = Buffer.from(pngMap[size], 'base64');
            pngBuffers.push(buf);

            const entry = Buffer.alloc(16);
            entry.writeUInt8(size >= 256 ? 0 : size, 0);
            entry.writeUInt8(size >= 256 ? 0 : size, 1);
            entry.writeUInt8(0, 2);
            entry.writeUInt8(0, 3);
            entry.writeUInt16LE(1, 4);
            entry.writeUInt16LE(32, 6);
            entry.writeUInt32LE(buf.length, 8);
            entry.writeUInt32LE(offset, 12);
            entries.push(entry);

            offset += buf.length;
          }

          const icoHeader = Buffer.alloc(6);
          icoHeader.writeUInt16LE(0, 0);
          icoHeader.writeUInt16LE(1, 2);
          icoHeader.writeUInt16LE(sizes.length, 4);

          const icoBuffer = Buffer.concat([icoHeader, ...entries, ...pngBuffers]);
          writeFileSync(icoPath, icoBuffer);
          console.log(`Đã xuất icon Windows đa độ phân giải: ${icoPath} (${icoBuffer.length} bytes)`);

          ws.close();
          proc.kill();
          resolve(true);
        };
      } catch {
        proc.kill();
        resolve(false);
      }
    }, 800);
  });
}

function convertFromIcns() {
  if (!existsSync(icnsPath)) return false;
  const buf = readFileSync(icnsPath);
  let offset = 8;
  const picked = [];

  while (offset < buf.length) {
    const tag = buf.subarray(offset, offset + 4).toString();
    const len = buf.readUInt32BE(offset + 4);
    const data = buf.subarray(offset + 8, offset + len);
    if (data.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
      if (tag === 'ic08' || tag === 'ic07' || tag === 'ic12') {
        picked.push({tag, data, width: tag === 'ic08' ? 256 : (tag === 'ic07' ? 128 : 64)});
      }
    }
    offset += len;
  }

  if (!picked.length) return false;

  const count = picked.length;
  let headerLen = 6 + count * 16;
  let currentOffset = headerLen;
  const dirEntries = [];

  for (const p of picked) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(p.width >= 256 ? 0 : p.width, 0);
    entry.writeUInt8(p.width >= 256 ? 0 : p.width, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(p.data.length, 8);
    entry.writeUInt32LE(currentOffset, 12);
    dirEntries.push(entry);
    currentOffset += p.data.length;
  }

  const iconDir = Buffer.alloc(6);
  iconDir.writeUInt16LE(0, 0);
  iconDir.writeUInt16LE(1, 2);
  iconDir.writeUInt16LE(count, 4);

  const ico = Buffer.concat([iconDir, ...dirEntries, ...picked.map(p => p.data)]);
  writeFileSync(icoPath, ico);
  console.log(`Đã xuất icon Windows từ ICNS: ${icoPath} (${ico.length} bytes)`);
  return true;
}

async function main() {
  if (existsSync(jpgPath)) {
    const ok = await convertFromJpg();
    if (ok) return;
  }
  if (!convertFromIcns()) {
    console.error('Không tìm thấy ảnh gốc codex-pink.jpg hoặc codex-pink.icns để tạo icon.');
    process.exit(1);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
