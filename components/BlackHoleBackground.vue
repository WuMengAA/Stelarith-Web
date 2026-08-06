<template>
  <div class="galaxy-bg" aria-hidden="true" ref="root">
    <canvas ref="canvas"></canvas>
    <div ref="fallback" class="starfield">
      <span class="star" style="left:12%;top:20%;width:2px;height:2px;opacity:.7;--twinkle-dur:3.4s;"></span>
      <span class="star" style="left:78%;top:15%;width:1.5px;height:1.5px;opacity:.5;--twinkle-dur:4.2s;--twinkle-delay:1s;"></span>
      <span class="star" style="left:85%;top:60%;width:2.5px;height:2.5px;opacity:.8;--twinkle-dur:3.8s;--twinkle-delay:.5s;"></span>
      <span class="star" style="left:35%;top:80%;width:1.5px;height:1.5px;opacity:.6;--twinkle-dur:4.6s;--twinkle-delay:2s;"></span>
      <span class="star" style="left:60%;top:40%;width:1px;height:1px;opacity:.5;--twinkle-dur:5s;--twinkle-delay:.8s;"></span>
      <span class="star" style="left:20%;top:65%;width:2px;height:2px;opacity:.7;--twinkle-dur:3.6s;--twinkle-delay:1.6s;"></span>
      <span class="star" style="left:92%;top:30%;width:1.5px;height:1.5px;opacity:.55;--twinkle-dur:4.4s;--twinkle-delay:2.4s;"></span>
      <span class="star" style="left:5%;top:45%;width:1px;height:1px;opacity:.4;--twinkle-dur:4.9s;--twinkle-delay:3s;"></span>
      <span class="star" style="left:45%;top:10%;width:2px;height:2px;opacity:.6;--twinkle-dur:4s;--twinkle-delay:.2s;"></span>
      <span class="star" style="left:70%;top:85%;width:1.5px;height:1.5px;opacity:.5;--twinkle-dur:4.7s;--twinkle-delay:1.2s;"></span>
      <span class="fx-meteor" style="--meteor-delay:0s;top:6%;"></span>
      <span class="fx-meteor fx-meteor-2" style="--meteor-delay:3.2s;top:12%;"></span>
      <svg class="fx-emblem" viewBox="0 0 100 100" aria-hidden="true">
        <g stroke="rgba(245,217,143,0.55)" stroke-width="2" stroke-linecap="round">
          <line x1="50" y1="50" x2="50" y2="6" />
          <line x1="50" y1="50" x2="88" y2="28" />
          <line x1="50" y1="50" x2="88" y2="72" />
          <line x1="50" y1="50" x2="50" y2="94" />
          <line x1="50" y1="50" x2="12" y2="72" />
          <line x1="50" y1="50" x2="12" y2="28" />
        </g>
        <circle cx="50" cy="50" r="9" fill="#F5D98F" />
        <circle cx="50" cy="50" r="16" fill="none" stroke="rgba(155,123,255,0.6)" stroke-width="1.5" />
      </svg>
      <span class="fx-crystal" style="left:22%;top:62%;--crystal-delay:0s;--crystal-rot:45deg;width:16px;height:16px;"></span>
      <span class="fx-crystal" style="left:78%;top:18%;--crystal-delay:1.4s;--crystal-rot:110deg;width:12px;height:12px;"></span>
      <span class="fx-crystal" style="left:62%;top:74%;--crystal-delay:2.6s;--crystal-rot:-30deg;width:14px;height:14px;"></span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";

const root = ref<HTMLElement | null>(null);
const canvas = ref<HTMLCanvasElement | null>(null);
const fallback = ref<HTMLElement | null>(null);

let raf = 0;
let running = false;

function startBlackHole() {
  if (running) return;
  running = true;
  if (root.value) root.value.style.display = "block";
  if (fallback.value) fallback.value.style.opacity = "0";
  initBlackHole();
  console.info("[Stelarith BH] 🌌 黑洞彩蛋已开启");
}
function stopBlackHole() {
  if (!running) return;
  running = false;
  cancelAnimationFrame(raf);
  if (root.value) root.value.style.display = "none";
  console.info("[Stelarith BH] 黑洞彩蛋已关闭");
}
function toggleBlackHole() {
  running ? stopBlackHole() : startBlackHole();
}

const VERT_SRC = `
  attribute vec2 a_position;
  void main() { gl_Position = vec4(a_position, 0.0, 1.0); }
`;

const FRAG_SRC = `
  precision highp float;
  uniform vec2 u_resolution;
  uniform float u_time;
  uniform vec2 u_mouse;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p *= 2.03;
      a *= 0.5;
    }
    return v;
  }
  vec3 starSky2D(vec2 p) {
    float rot = u_time * 0.02;
    float cs = cos(rot), sn = sin(rot);
    vec2 r = vec2(p.x * cs + p.y * sn, -p.x * sn + p.y * cs);
    vec3 col = vec3(0.0);
    col += mix(vec3(0.032, 0.024, 0.085), vec3(0.02, 0.022, 0.07), r.y * 0.5 + 0.5);
    for (int layer = 0; layer < 3; layer++) {
      float scale = 22.0 + float(layer) * 18.0;
      vec2 cell = r * scale;
      vec2 id = floor(cell);
      vec2 f = fract(cell) - 0.5;
      float h = hash(id + float(layer) * 7.7);
      float isStar = step(0.94, h);
      float size = 0.06 + h * 0.09;
      float d = length(f);
      float s = smoothstep(size, 0.0, d);
      float tw = 0.6 + 0.4 * sin(u_time * (1.0 + h * 3.0) + h * 40.0);
      vec3 sc = mix(vec3(0.9, 0.92, 1.0), vec3(1.0, 0.9, 0.7), step(0.97, h));
      col += sc * s * isStar * tw * 1.2;
    }
    return col;
  }
  vec2 lensUV(vec2 uv, vec2 bh, float horizon) {
    vec2 toBH = uv - bh;
    float dist = length(toBH);
    float lensStr = min(horizon * horizon / max(dist * dist, 0.01), 1.8);
    vec2 tangent = vec2(-toBH.y, toBH.x) / max(dist, 0.001);
    vec2 warp = tangent * lensStr * 0.18;
    float zoom = 1.0 + lensStr * 1.2;
    return bh + (uv - bh) * zoom + warp;
  }
  vec3 disk2D(vec2 uv, vec2 bh, float horizon, float t) {
    vec2 toBH = uv - bh;
    vec2 tilt = vec2(toBH.x, toBH.y * 0.32);
    float dist = length(tilt);
    float ang = atan(tilt.y, tilt.x);
    float diskIn = horizon * 1.3;
    float diskOut = horizon * 9.0;
    float mask = smoothstep(diskOut, diskOut - 0.4, dist) * smoothstep(diskIn, diskIn + 0.25, dist);
    float w = 1.6 / pow(dist / diskIn, 1.5);
    float flow = t * 0.3;
    float n = fbm(vec2(ang * 2.5 + flow * 2.0, dist * 1.2 - flow * 0.5));
    n += 0.5 * fbm(vec2(ang * 6.0 - flow * 1.5, dist * 2.4 + flow * 0.8));
    float doppler = 1.0 + 0.55 * sin(ang - flow * 2.0);
    float u = (dist - diskIn) / (diskOut - diskIn);
    vec3 cInner = vec3(1.0, 0.95, 0.85);
    vec3 cGold  = vec3(0.961, 0.851, 0.561);
    vec3 cPurple = vec3(0.608, 0.482, 1.0);
    vec3 cBlue  = vec3(0.373, 0.435, 0.8);
    vec3 col = mix(cInner, cGold, smoothstep(0.0, 0.3, u));
    col = mix(col, cPurple, smoothstep(0.3, 0.65, u));
    col = mix(col, cBlue, smoothstep(0.65, 1.0, u));
    float edge = exp(-(dist - diskIn) * 0.5);
    float bright = (0.35 + 0.65 * n) * edge * doppler;
    return col * mask * bright * 1.5;
  }
  vec3 starEaten2D(vec2 uv, vec2 bh, float horizon, float t) {
    float period = 26.0;
    float ph = fract(t / period);
    float starR = mix(horizon * 4.0, horizon * 1.12, ph);
    float ang = ph * 14.0 + t * 0.12;
    vec2 sp = bh + vec2(cos(ang), sin(ang) * 0.32) * starR;
    vec2 d = uv - sp;
    float dd = length(d);
    vec2 dirBH = (bh - sp) / max(starR, 0.001);
    float along = dot(d, dirBH);
    vec2 perp = d - dirBH * along;
    float stretch = 0.05 + 0.35 * (1.0 - ph);
    float width = 0.03 + 0.02 * ph;
    float dShape = length(perp) / width + abs(along) / stretch;
    vec3 col = vec3(0.0);
    if (dShape < 1.0) { col += vec3(3.5, 3.0, 2.3); }
    col += vec3(1.0, 0.8, 0.5) * exp(-dd * 3.0) * 1.3;
    vec2 streamEnd = bh + dirBH * (starR + 0.5);
    vec2 sdir = (streamEnd - sp) / max(length(streamEnd - sp), 0.001);
    float streamDist = abs(d.x * sdir.y - d.y * sdir.x);
    float streamAlong = dot(d, sdir);
    float streamMask = smoothstep(0.03, 0.0, streamDist) * smoothstep(0.0, 0.08, streamAlong);
    col += vec3(1.3, 0.95, 0.6) * streamMask * 0.9 * (1.0 - ph);
    col *= (1.0 + 0.2 * sin(t * 4.0 + ang * 6.0));
    return col;
  }
  void main() {
    vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution) / u_resolution.y;
    uv *= 1.1;
    float tiltA = 0.5;
    float tc = cos(tiltA), ts = sin(tiltA);
    vec2 bh = vec2(0.0, 0.12);
    float horizon = 0.34;
    uv += (u_mouse - 0.5) * 0.03;
    vec2 ruv = vec2(uv.x * tc - uv.y * ts, uv.x * ts + uv.y * tc);
    vec2 rbh = vec2(bh.x * tc - bh.y * ts, bh.x * ts + bh.y * tc);
    vec2 toBH = ruv - rbh;
    float dist = length(toBH);
    vec3 col = vec3(0.0);
    vec2 lensCoord = lensUV(ruv, rbh, horizon);
    col = starSky2D(lensCoord);
    col += disk2D(ruv, rbh, horizon, u_time);
    float horizonEdge = smoothstep(horizon, horizon - 0.02, dist);
    col *= (1.0 - horizonEdge);
    float photonRing = exp(-abs(dist - horizon) * 26.0);
    col += photonRing * vec3(1.0, 0.9, 0.7) * 1.0;
    col += photonRing * vec3(0.7, 0.55, 1.0) * 0.4;
    float outerGlow = exp(-abs(dist - horizon * 1.5) * 5.0);
    col += outerGlow * vec3(0.96, 0.85, 0.56) * 0.3;
    col += starEaten2D(ruv, rbh, horizon, u_time);
    float halo = exp(-dist * 2.0);
    col += vec3(0.45, 0.37, 0.85) * halo * 0.4;
    col += vec3(0.9, 0.75, 0.5) * halo * 0.12;
    float lum = dot(col, vec3(0.299, 0.587, 0.114));
    vec3 bloom = max(col - 0.45, 0.0) * 1.6;
    float bloomFade = exp(-dist * 1.1);
    col += bloom * 1.5 * bloomFade;
    col += mix(vec3(0.61, 0.48, 1.0), vec3(0.96, 0.85, 0.56), 0.5 + 0.5 * sin(u_time * 0.3)) * bloomFade * 0.25;
    col = pow(col, vec3(0.85));
    col = col / (1.0 + col * 0.4);
    gl_FragColor = vec4(col, 1.0);
  }
`;

function initBlackHole() {
  const cv = canvas.value as HTMLCanvasElement;
  const fb = fallback.value;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const gl = cv.getContext("webgl", { antialias: false, alpha: true, powerPreference: "high-performance" });
  if (!gl) {
    cv.style.display = "none";
    if (fb) fb.style.opacity = "1";
    console.warn("[Stelarith BG] Falling back to CSS starfield (WebGL unsupported).");
    return;
  }

  const compile = (type: number, src: string) => {
    const sh = gl.createShader(type)!;
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      console.error("Shader compile error:", gl.getShaderInfoLog(sh));
      gl.deleteShader(sh);
      return null;
    }
    return sh;
  };

  const vs = compile(gl.VERTEX_SHADER, VERT_SRC)!;
  const fs = compile(gl.FRAGMENT_SHADER, FRAG_SRC)!;
  if (!vs || !fs) {
    cv.style.display = "none";
    if (fb) fb.style.opacity = "1";
    return;
  }

  const prog = gl.createProgram()!;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.error("Program link error:", gl.getProgramInfoLog(prog));
    cv.style.display = "none";
    if (fb) fb.style.opacity = "1";
    return;
  }
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const posLoc = gl.getAttribLocation(prog, "a_position");
  gl.enableVertexAttribArray(posLoc);
  gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

  const uRes = gl.getUniformLocation(prog, "u_resolution");
  const uTime = gl.getUniformLocation(prog, "u_time");
  const uMouse = gl.getUniformLocation(prog, "u_mouse");

  let mouseX = 0.5, mouseY = 0.5;
  const onPointer = (e: PointerEvent) => {
    mouseX = e.clientX / window.innerWidth;
    mouseY = 1.0 - e.clientY / window.innerHeight;
  };
  window.addEventListener("pointermove", onPointer);

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.floor(window.innerWidth * dpr);
    const h = Math.floor(window.innerHeight * dpr);
    cv.width = w;
    cv.height = h;
    cv.style.width = "100%";
    cv.style.height = "100%";
    gl.viewport(0, 0, w, h);
  };
  resize();
  window.addEventListener("resize", resize);

  const render = (t: number) => {
    gl.uniform2f(uRes, cv.width, cv.height);
    gl.uniform1f(uTime, t / 1000);
    gl.uniform2f(uMouse, mouseX, mouseY);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    raf = requestAnimationFrame(render);
  };

  const drawOnce = () => {
    gl.uniform2f(uRes, cv.width, cv.height);
    gl.uniform1f(uTime, 0);
    gl.uniform2f(uMouse, 0.5, 0.5);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  if (reducedMotion) drawOnce();
  else raf = requestAnimationFrame(render);

  const onVisibility = () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else if (!reducedMotion && running) raf = requestAnimationFrame(render);
  };
  document.addEventListener("visibilitychange", onVisibility);
}

onMounted(() => {
  // 触发方式 1：URL 参数
  const params = new URLSearchParams(window.location.search);
  if (params.get("bh") === "1" || window.location.hash === "#blackhole") startBlackHole();

  // 触发方式 2：键盘 B
  const onKey = (e: KeyboardEvent) => {
    if (e.key.toLowerCase() !== "b" || e.ctrlKey || e.metaKey || e.altKey) return;
    const t = e.target as HTMLElement;
    if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;
    toggleBlackHole();
  };
  document.addEventListener("keydown", onKey);

  // 触发方式 3：自定义事件
  const onToggle = () => toggleBlackHole();
  window.addEventListener("stelarith:toggle-blackhole", onToggle);

  onBeforeUnmount(() => {
    document.removeEventListener("keydown", onKey);
    window.removeEventListener("stelarith:toggle-blackhole", onToggle);
    cancelAnimationFrame(raf);
  });
});
</script>

<style scoped>
.galaxy-bg {
  position: fixed;
  inset: 0;
  z-index: -2;
  pointer-events: none;
  display: none;
}
.galaxy-bg :deep(canvas) {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
}
.galaxy-bg :deep(.starfield) {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.4s ease;
  background:
    radial-gradient(ellipse 80% 60% at 50% -10%, rgba(155, 123, 255, 0.22) 0%, transparent 60%),
    radial-gradient(ellipse 60% 50% at 85% 20%, rgba(43, 45, 107, 0.5) 0%, transparent 55%),
    radial-gradient(ellipse 50% 40% at 10% 75%, rgba(245, 217, 143, 0.08) 0%, transparent 55%),
    #0a0a12;
}
.galaxy-bg :deep(.star) {
  position: absolute;
  border-radius: 50%;
  background: #fff;
  animation: twinkle var(--twinkle-dur, 4s) ease-in-out infinite;
  animation-delay: var(--twinkle-delay, 0s);
}
@keyframes twinkle {
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 0.9; transform: scale(1.3); }
}
.galaxy-bg :deep(.fx-meteor) {
  position: absolute;
  left: 100%;
  width: 190px;
  height: 2px;
  border-radius: 2px;
  background: linear-gradient(90deg, transparent, rgba(245, 217, 143, 0.95));
  filter: drop-shadow(0 0 6px rgba(245, 217, 143, 0.9)) drop-shadow(0 0 14px rgba(155, 123, 255, 0.6));
  transform: rotate(-28deg);
  transform-origin: right center;
  opacity: 0;
  animation: fx-meteor-fly 7s linear infinite;
  animation-delay: var(--meteor-delay, 0s);
}
.galaxy-bg :deep(.fx-meteor-2) {
  width: 120px;
  height: 1.5px;
}
@keyframes fx-meteor-fly {
  0% { transform: rotate(-28deg) translateX(0); opacity: 0; }
  4% { opacity: 1; }
  42% { transform: rotate(-28deg) translateX(-130vw); opacity: 0.95; }
  55%, 100% { opacity: 0; transform: rotate(-28deg) translateX(-130vw); }
}
.galaxy-bg :deep(.fx-emblem) {
  position: absolute;
  left: 12%;
  bottom: 14%;
  width: 120px;
  height: 120px;
  opacity: 0.9;
  animation: fx-emblem-pulse 3.5s ease-in-out infinite;
  filter: drop-shadow(0 0 10px rgba(245, 217, 143, 0.7));
}
@keyframes fx-emblem-pulse {
  0%, 100% { opacity: 0.65; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.06); }
}
.galaxy-bg :deep(.fx-crystal) {
  position: absolute;
  background: linear-gradient(135deg, rgba(155, 123, 255, 0.85), rgba(245, 217, 143, 0.85), rgba(43, 45, 107, 0.85));
  border: 1px solid rgba(248, 244, 237, 0.35);
  box-shadow: 0 0 12px rgba(155, 123, 255, 0.5), 0 0 4px rgba(245, 217, 143, 0.6);
  transform: rotate(var(--crystal-rot, 45deg));
  animation: fx-crystal-float 9s ease-in-out infinite;
  animation-delay: var(--crystal-delay, 0s);
}
@keyframes fx-crystal-float {
  0%, 100% { transform: translateY(0) rotate(var(--crystal-rot, 45deg)) scale(1); opacity: 0.75; }
  50% { transform: translateY(-22px) rotate(calc(var(--crystal-rot, 45deg) + 90deg)) scale(1.12); opacity: 1; }
}
</style>
