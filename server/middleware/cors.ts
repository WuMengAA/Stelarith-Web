// 全局 CORS：允许本地管理面板（Stelarith-Admin）跨源调用 API
// 管理面板由桌面应用内置服务器托管（http://localhost:9000），需要跨源访问 localhost:3000/api
export default defineEventHandler((event) => {
  setResponseHeaders(event, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, DELETE, PUT, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  });
  if (event.method === "OPTIONS") {
    event.node.res.statusCode = 204;
    event.node.res.end();
  }
});
