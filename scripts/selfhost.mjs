// ============================================================
//  Stelarith · 本地自托管管理脚本（方案 C）
//  用法：
//    node scripts/selfhost.mjs build   → DEPLOY_TARGET=local 构建到 .output
//    node scripts/selfhost.mjs start    → 后台启动 node .output/server/index.mjs
//    node scripts/selfhost.mjs stop     → 停止
//    node scripts/selfhost.mjs restart  → 重启
//    node scripts/selfhost.mjs status   → 状态/健康检查
//  PID 记录在 .data/selfhost.pid
// ============================================================
import { spawn, execSync, spawnSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync, mkdirSync, rmSync, createWriteStream } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PID_FILE = resolve(root, ".data", "selfhost.pid");
const SERVER = resolve(root, ".output", "server", "index.mjs");
const PORT = process.env.PORT || "3000";
const HOST = process.env.HOST || "0.0.0.0";

// 定位 node（Windows 下 npm 可能不在 PATH）
function nodeBin() {
  return process.execPath;
}

function readPid() {
  try {
    if (existsSync(PID_FILE)) {
      const pid = parseInt(readFileSync(PID_FILE, "utf8").trim(), 10);
      return Number.isFinite(pid) ? pid : null;
    }
  } catch {}
  return null;
}

function isRunning(pid) {
  if (!pid) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch (e) {
    return e.code === "EPERM";
  }
}

async function build() {
  console.log("[selfhost] 构建 local 模式（DEPLOY_TARGET=local）…");
  mkdirSync(resolve(root, ".data"), { recursive: true });
  const r = spawnSync(nodeBin(), ["scripts/build-content.mjs"], { cwd: root, shell: process.platform === "win32", stdio: "inherit", env: { ...process.env } });
  if (r.status !== 0) { console.error("[selfhost] 内容预生成失败"); process.exit(1); }
  const b = spawnSync(nodeBin(), [resolve(root, "node_modules", "nuxt", "bin", "nuxt.mjs"), "build"], {
    cwd: root, shell: process.platform === "win32", stdio: "inherit",
    env: { ...process.env, DEPLOY_TARGET: "local" },
  });
  if (b.status !== 0) { console.error("[selfhost] 构建失败"); process.exit(1); }
  console.log("[selfhost] 构建完成 → .output/");
}

async function start() {
  const pid = readPid();
  if (pid && isRunning(pid)) {
    console.log(`[selfhost] 已在运行 (PID ${pid})，无需重复启动。`);
    return;
  }
  if (!existsSync(SERVER)) {
    console.error("[selfhost] 未找到 .output/server/index.mjs，请先执行 build。");
    process.exit(1);
  }
  mkdirSync(dirname(PID_FILE), { recursive: true });
  const LOG = resolve(root, ".data", "server.log");
  // 等待日志流打开（fd 就绪）后再作为 stdio 传入，否则 spawn 会抛 ERR_INVALID_ARG_VALUE
  const logOut = createWriteStream(LOG, { flags: "a" });
  await new Promise((resolveOpen) => {
    if (logOut.writableEnded) return resolveOpen();
    logOut.once("open", resolveOpen);
    logOut.once("error", resolveOpen);
  });
  const child = spawn(nodeBin(), [SERVER], {
    cwd: root,
    env: { ...process.env, PORT, HOST, DEPLOY_TARGET: "local", NITRO_PORT: PORT, NITRO_HOST: HOST },
    detached: true,          // 独立进程组，父进程退出不带走
    stdio: ["ignore", logOut, logOut],
  });
  child.unref();             // 父进程可直接退出
  writeFileSync(PID_FILE, String(child.pid), "utf8");
  console.log(`[selfhost] 已启动 (PID ${child.pid}) → http://localhost:${PORT}/`);
  console.log(`[selfhost] 局域网访问：http://${lanIP()}:${PORT}/`);
  console.log(`[selfhost] 健康检查：http://localhost:${PORT}/api/health`);
  console.log(`[selfhost] 日志：${LOG}`);
}

function lanIP() {
  try {
    const out = execSync("ipconfig", { encoding: "utf8" });
    const m = out.match(/IPv4[^\d]*([\d.]+)/);
    return m ? m[1] : "127.0.0.1";
  } catch {
    return "127.0.0.1";
  }
}

function stop() {
  const pid = readPid();
  if (!pid) { console.log("[selfhost] 未在运行。"); return; }
  try { process.kill(pid); } catch (e) { console.warn(`[selfhost] 无法结束 ${pid}: ${e.message}`); }
  // Windows 下可能残留，尝试 taskkill
  if (process.platform === "win32") {
    try { execSync(`taskkill /F /T /PID ${pid}`, { stdio: "ignore" }); } catch {}
  }
  try { rmSync(PID_FILE, { force: true }); } catch {}
  console.log(`[selfhost] 已停止 (PID ${pid})。`);
}

function status() {
  const pid = readPid();
  if (pid && isRunning(pid)) {
    console.log(`[selfhost] ● 运行中 (PID ${pid}) → http://localhost:${PORT}/`);
    try {
      const r = execSync(`node -e "fetch('http://localhost:${PORT}/api/health').then(r=>r.json()).then(j=>{console.log(JSON.stringify(j))}).catch(()=>console.log('ERR'))"`, { encoding: "utf8", timeout: 5000 });
      console.log(`[selfhost] 健康: ${r.trim()}`);
    } catch {
      console.log("[selfhost] 健康: 未响应");
    }
  } else {
    console.log("[selfhost] ○ 未运行");
  }
}

const cmd = process.argv[2] || "status";
switch (cmd) {
  case "build": await build(); break;
  case "start": await start(); break;
  case "stop": stop(); break;
  case "restart": stop(); await new Promise((r) => setTimeout(r, 800)); await start(); break;
  default: status();
}
