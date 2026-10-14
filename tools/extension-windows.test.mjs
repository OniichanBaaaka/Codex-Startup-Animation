import test from 'node:test';
import assert from 'node:assert/strict';
import {dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {findCodexExecutable, freePort} from '../extension/run-windows.mjs';
import {buildInjection} from '../extension/payload.mjs';

const root = dirname(dirname(fileURLToPath(import.meta.url)));

test('Windows: Tìm thấy ứng dụng Codex/ChatGPT chính xác trên hệ thống', async () => {
  const exe = await findCodexExecutable();
  if (process.platform === 'win32') {
    assert.ok(exe !== null, 'Phải tìm thấy đường dẫn ứng dụng ChatGPT/Codex trên Windows');
    assert.match(exe.toLowerCase(), /chatgpt\.exe|codex\.exe/);
  } else {
    assert.equal(exe, null);
  }
});

test('Windows: Cấp phát cổng TCP rảnh trên 127.0.0.1', async () => {
  const port = await freePort();
  assert.ok(typeof port === 'number');
  assert.ok(port > 1024 && port < 65536);
});

test('Windows: Đóng gói payload không bị lỗi đường dẫn hay thiếu tài nguyên', async () => {
  const payloadCode = await buildInjection(root);
  assert.ok(typeof payloadCode === 'string');
  assert.ok(payloadCode.length > 50000);
  assert.match(payloadCode, /data:image\/jpeg;base64,/);
  assert.match(payloadCode, /installRenderer/);
});
