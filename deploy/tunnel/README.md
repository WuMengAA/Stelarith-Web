# Stelarith · Cloudflare Tunnel（本地节点接入）

把本地自托管节点（`start-selfhost.bat` 启动的 3000 端口）通过 Cloudflare Tunnel
安全暴露到公网，作为双重站点架构中「本地侧」的对外入口。

## 前置条件

- Cloudflare 账号，且域名（如 `stelarith.dev`）已托管在 Cloudflare
- 已下载 `cloudflared`（[官方下载](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/)）
  并加入 PATH，或放本目录下

## 一次性初始化

```bash
# 1. 登录（会打开浏览器授权）
cloudflared tunnel login

# 2. 创建隧道
cloudflared tunnel create stelarith-local

# 3. 把生成的 ~/.cloudflared/stelarith-local.json 复制到本目录
copy %USERPROFILE%\.cloudflared\stelarith-local.json .\stelarith-local.json

# 4. 配置 DNS 路由（域名指向隧道）
cloudflared tunnel route dns stelarith-local stelarith.dev
```

## 启动 / 停止

```bash
# 启动（保持窗口开启；建议用任务计划开机自启）
cloudflared tunnel --config deploy/tunnel/config.yml run stelarith-local

# 停止
Ctrl+C
```

## 健康检查验证

隧道连通后，公网访问：

```
https://stelarith.dev/api/health
```

应返回：

```json
{ "ok": true, "service": "stelarith", "target": "local", "time": "..." }
```

## 与 Load Balancer 配合

- 把 `stelarith.dev` 的 DNS 记录改为 **CNAME → Load Balancer 的 CNAME**（`<lb-name>.cloudflare.net`）
- Load Balancer 下配置两个 origin：
  1. Cloudflare Pages（`stelarith.pages.dev`）
  2. 本地隧道（`<tunnel-id>.cfargotunnel.com`）
- 健康检查路径设为 `/api/health`，两个池都能响应即为分流生效

> 详见根目录 `DEPLOY.md` 的「双重站点分流分压」章节。
