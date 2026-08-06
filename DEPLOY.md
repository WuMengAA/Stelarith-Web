# Stelarith · 双重站点部署手册（B 云全栈 + C 自托管）

星璃官网采用 **一套代码、双部署目标** 的架构：

- **云侧节点（B）**：Cloudflare Pages 全栈 → 面向公网，全球 CDN
- **本地节点（C）**：本机 node-server → 局域网 / 自托管 / 重负载分流
- **入口**：Cloudflare Load Balancer 加权分流 + 健康检查 + 故障转移

```
                      用户流量
                         │
                 ┌───────▼────────┐
                 │  Cloudflare    │
                 │  Load Balancer │  ← 加权轮询 / 健康检查 / 自动故障转移
                 └───────┬────────┘
          ┌──────────────┴──────────────┐
          ▼                             ▼
┌─────────────────────┐       ┌─────────────────────┐
│  云侧 · Cloudflare  │       │  本地 · 自托管        │
│  Pages 全栈          │       │  node-server :3000   │
│  stelarith.pages.dev│       │  cloudflared Tunnel  │
│  R2 / D1 / KV        │       │  本地磁盘 .data/     │
└─────────────────────┘       └─────────────────────┘
```

## 一、三种部署模式

| 模式 | 环境变量 `DEPLOY_TARGET` | 构建命令 | 部署到 | 动态 API |
|------|------------------------|----------|--------|----------|
| GitHub Pages | `github`（默认） | `npm run build:gh` | GitHub Pages | 无（纯静态） |
| 云全栈 | `cloudflare` | `npm run build:cf` | Cloudflare Pages | R2 / D1 |
| 本地自托管 | `local` | `npm run build:local` | 本机 `.output/` | 本地磁盘 |

### 模式切换原理

`nuxt.config.ts` 读取 `DEPLOY_TARGET` 自动切换：

- `github` → `nitro preset: static`，`baseURL` 注入 `/Stelarith-Web/`
- `cloudflare` → `nitro preset: cloudflare_pages`，`baseURL=/`
- `local` → `nitro preset: node-server`，`baseURL=/`

`server/utils/storage.ts` 在运行时按模式选择存储后端：
`local` 用 `node:fs` 写 `.data/uploads/`，`cloudflare` 用 R2 binding。

## 二、本地自托管节点（方案 C）

```bat
start-selfhost.bat    :: 一键构建 + 启动（端口 3000）
stop-selfhost.bat     :: 停止
node scripts/selfhost.mjs status    :: 查看状态
node scripts/selfhost.mjs restart   :: 重启
```

- 局域网访问：`http://<本机IP>:3000/`
- 健康检查：`http://localhost:3000/api/health`
- 上传目录：`.data/uploads/`（已 gitignore，不提交）
- 开机自启建议：任务计划程序 → 登录时运行 `start-selfhost.bat`

## 三、云侧节点（方案 B）

### 1. Cloudflare Pages 项目

```bash
npx wrangler login
npx wrangler pages project create stelarith --production-branch main
```

### 2. R2 / D1 资源

```bash
npx wrangler r2 bucket create stelarith-assets
npx wrangler d1 create stelarith-db
npx wrangler kv namespace create stelarith-kv
```

将返回的 ID 填入 `wrangler.toml`（D1 database_id / KV id）。

### 3. 部署

自动：push 到 `main` 触发 `.github/workflows/deploy-cf.yml`
（需 GitHub Secrets：`CLOUDFLARE_API_TOKEN`、`CLOUDFLARE_ACCOUNT_ID`）

手动：

```bash
npm run build:cf
npx wrangler pages deploy dist --project-name stelarith --branch main
```

### 4. 绑定自定义域名

在 Cloudflare 控制台 Pages 项目中绑定 `stelarith.dev`（或子域）。

## 四、双重站点分流分压（核心）

### 步骤 1：启动本地节点并接入 Tunnel

见 `deploy/tunnel/README.md`。要点：

```bash
cloudflared tunnel create stelarith-local
cloudflared tunnel route dns stelarith-local stelarith-local.dev
cloudflared tunnel --config deploy/tunnel/config.yml run stelarith-local
```

本地隧道对外地址：`https://<tunnel-id>.cfargotunnel.com`（Load Balancer 可直接用此地址）。

### 步骤 2：创建 Load Balancer

Cloudflare 控制台 → **Traffic → Load Balancing**：

1. **Origin Pool 1（云侧）**：
   - Origin：`stelarith.pages.dev`
   - 健康检查：`GET /api/health`，间隔 30s
   - 权重：默认
2. **Origin Pool 2（本地）**：
   - Origin：`<tunnel-id>.cfargotunnel.com`
   - 健康检查：`GET /api/health`
   - 权重：默认
3. **Load Balancer**：
   - 主机名：`stelarith.dev`（或 `www`）
   - 池选择：**按比例分配（Weighted）**，例如云 70% / 本地 30%
   - 会话保持：开启（可选）
   - 故障转移：云侧挂自动切本地，反之亦然

### 步骤 3：验证分流

```bash
# 反复请求，观察返回的 target 字段交替/按比例出现
curl https://stelarith.dev/api/health
# → { "target": "cloudflare" | "local", ... }
```

### 分压收益

- **云侧**：CDN 缓存静态资源（CSS/JS/图片），扛公开流量大头
- **本地侧**：承担动态 API（上传 / 统计 / 大文件），局域网内零延迟
- **故障转移**：任一侧宕机，Load Balancer 自动把全部流量切到存活侧

## 五、内容管理（Pages CMS）

内容后台统一交给 **Pages CMS**（`https://app.pagescms.org`，Git 驱动开源 CMS）：

1. 打开 <https://app.pagescms.org>，用 GitHub 登录
2. 选择 `WuMengAA/Stelarith-Web` 仓库（首次授权 Pages CMS GitHub App）
3. 左侧编辑文章/笔记/项目/软件/图库等集合 → 保存即 commit + 触发部署

配置文件为仓库根目录 `.pages.yml`，已映射全部 `content/` 集合。图库图片经媒体上传到 `public/images/`。

> **软件分发注意**：软件二进制文件（zip）不交给 Pages CMS（它只写 Git，不托管大文件）。流程：先在站内 `/api/upload` 上传拿 key → 在 Pages CMS 里把 key 填到软件记录的 `file` 字段 → 前端下载按钮走 `/api/download?key=...`（含下载计数）。

## 六、静态资源说明

- 图库图片/上传文件：本地在 `.data/uploads/`，云在 R2 `stelarith-assets`
- 构建产物：`dist/`（静态 / CF）、`.output/`（本地 node-server）
- Pagefind 搜索索引：`npm run build:*` 均已包含 postbuild 生成

## 七、回退方案

- 只要 GitHub Pages：`npm run build:gh` + 现有 `deploy.yml`
- 只要本地：`start-selfhost.bat` 即可，完全离线可用
- 只要云全栈：忽略本地节点，Load Balancer 只配云侧池
