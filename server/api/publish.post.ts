// 内容发布 API：POST /api/publish
//  body: { message?: string }
//  对当前仓库执行 git add -A && git commit && git push（SSH 远程）
//  身份用临时 -c 参数（不改 git config）
import { execFileSync } from "node:child_process";

const GIT_USER = "WuMengAA";
const GIT_EMAIL = "WuMengAA@users.noreply.github.com";

function run(args: string[], cwd: string): string {
  return execFileSync("git", args, { cwd, encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] });
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const cwd = process.cwd();
  const message = String(body?.message || "chore: 内容更新（Stelarith Admin）").trim();

  // 1) 检查是否有改动
  const status = run(["status", "--porcelain"], cwd).trim();
  if (!status) {
    return { ok: true, pushed: false, note: "无内容改动，无需发布" };
  }

  // 2) add + commit（临时身份）
  run(["add", "-A"], cwd);
  run(["-c", `user.name=${GIT_USER}`, "-c", `user.email=${GIT_EMAIL}`, "commit", "-m", message], cwd);

  // 3) push
  try {
    run(["push", "origin", "HEAD"], cwd);
    return { ok: true, pushed: true, message, files: status.split("\n").length };
  } catch (e: any) {
    // push 失败（如远程领先）时返回错误，但不回滚本地 commit
    return {
      ok: false,
      pushed: false,
      message,
      error: e.message || "push 失败",
    };
  }
});
