// 健康检查：用于 Cloudflare Load Balancer / Tunnel 探活
// 返回当前部署目标与存活状态
import { getDeployTarget } from "../utils/storage";

export default defineEventHandler(() => ({
  ok: true,
  service: "stelarith",
  target: getDeployTarget(),
  time: new Date().toISOString(),
}));
