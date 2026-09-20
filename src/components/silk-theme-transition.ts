// Theme switch transition: a sheet of silk is drawn across the page, top-right to
// bottom-left, and the new theme is revealed underneath its opaque centre.
//
// The cloth is a WebGL fragment shader rather than an image. Its folds are a moving
// height field that is re-lit every frame, so the highlights slide across the pleats
// the way they do on real satin — a warped photo or GIF keeps its highlights baked in
// and reads as matte. It also renders at display refresh rate and at any resolution.
//
// The reveal is a clip-path animation on the view-transition snapshot. The cloth reads
// that same animation's progress each frame, so seam and fabric share one clock.

// Close to linear, like cloth carried on a steady breeze: it has to be visibly moving
// within a few frames of the click, and still moving as it leaves.
const DURATION = 2800;
const EASING = "cubic-bezier(0.3, 0.12, 0.68, 0.88)";
// Satin is smooth, so the canvas can stay well under retina resolution.
const MAX_PIXELS = 1_600_000;
const MAX_SCALE = 1.5;

// Cloth reach ahead of / behind the theme seam, in units of sqrt(viewport area).
const FRONT = 0.22;
const BACK = 0.4;
// How much further the hem waves and drop shadow reach (see `lead`, `trail`, `shadow`
// in the shader). Used to park the cloth fully off-screen at both ends of the sweep.
const OVERHANG = 0.15;

const VERTEX = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";

const FRAGMENT = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec2 uRes;    // canvas size, device px
uniform float uScale; // device px per CSS px
uniform float uSlope; // seam slope in CSS px space (y down)
uniform float uSeam;  // seam intercept, CSS px
uniform float uLen;   // reference length, CSS px
uniform float uTime;  // seconds
uniform float uTone;  // 0 = ivory silk, 1 = dark silk

const float FRONT = ${FRONT.toFixed(3)};
const float BACK = ${BACK.toFixed(3)};
const float RELIEF = 0.10;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}

// p.x runs along the pull (travel) direction, p.y across it. Pleats run along the
// pull and sway sideways, so the cloth visibly waves as it crosses the page.
float height(vec2 p, float t, float flutter) {
  // Slow, long-wavelength bends only: they curve the pleats without closing them
  // into rings, which is what makes a height field look like liquid.
  float drift = noise(vec2(p.x * 0.9 - t * 0.22, p.y * 1.6 + t * 0.15)) - 0.5;
  float sway = 0.34 * sin(p.x * 2.3 - t * 1.4) + 0.16 * sin(p.x * 5.1 + p.y * 1.7 + t * 1.1);
  float u = p.y * 9.0 + p.x * 2.6 + sway * 2.2 + drift * 4.5;
  float s1 = sin(u - t * 1.7);
  float h = s1 + 0.28 * s1 * abs(s1);
  h += 0.50 * sin(u * 1.93 + 1.3 + t * 1.2 + 0.8 * sin(p.x * 3.7 - t));
  h += 0.27 * sin(u * 3.3 - t * 2.6 + p.x * 4.0);
  // The flag-like billow rolls down the cloth; kept shallow and skewed along the pleats.
  h += 0.42 * sin(p.x * 3.2 + p.y * 2.6 - t * 2.4 + drift * 1.5);
  h += 0.16 * (noise(vec2(p.x * 5.0, p.y * 12.0) + vec2(t * 0.6, -t * 0.4)) - 0.5);
  h += 0.09 * flutter * sin(p.x * 21.0 - p.y * 13.0 + t * 4.2);
  return h * flutter;
}

// Rolls highlights off softly instead of clipping them to flat white.
vec3 shoulder(vec3 c) {
  vec3 over = max(c - 0.78, 0.0);
  return min(c, 0.78) + 0.22 * (1.0 - exp(-over / 0.22));
}

void main() {
  vec2 px = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y) / uScale;
  float inv = inversesqrt(1.0 + uSlope * uSlope);
  vec2 axisA = vec2(-uSlope, 1.0) * inv; // travel direction, toward bottom-left
  vec2 axisB = vec2(1.0, uSlope) * inv;  // along the seam
  float a = (dot(px, axisA) - uSeam * inv) / uLen;
  float b = dot(px, axisB) / uLen;
  float t = uTime * 1.25;

  float lead = FRONT + 0.040 * sin(b * 5.0 + t * 1.6) + 0.024 * sin(b * 11.0 - t * 2.4 + 1.0)
    + 0.010 * sin(b * 23.0 + t * 3.3);
  float trail = -BACK + 0.050 * sin(b * 4.2 - t * 1.3 + 2.0) + 0.030 * sin(b * 9.5 + t * 2.1)
    + 0.012 * sin(b * 19.0 - t * 3.0);
  float edge = min(lead - a, a - trail);
  if (edge < -0.055) {
    gl_FragColor = vec4(0.0);
    return;
  }
  float aa = 1.5 / uLen;

  float free = 1.0 - smoothstep(0.0, 0.14, edge);
  float flutter = 1.0 + 0.45 * free;
  vec2 p = vec2(a, b);
  float e = 0.0025;
  float h = height(p, t, flutter);
  float ha = (height(p + vec2(e, 0.0), t, flutter) - h) / e;
  float hb = (height(p + vec2(0.0, e), t, flutter) - h) / e;
  vec3 n = normalize(vec3(-RELIEF * ha, -RELIEF * hb, 1.0));

  vec2 lightXY = vec2(-0.52, -0.60);
  vec3 l = normalize(vec3(dot(lightXY, axisA), dot(lightXY, axisB), 0.62));
  vec3 hv = normalize(l + vec3(0.0, 0.0, 1.0));
  float diff = dot(n, l) * 0.5 + 0.5;
  diff *= diff;
  float nh = max(dot(n, hv), 0.0);
  float sheen = pow(nh, 10.0);
  float glint = pow(nh, 64.0);
  // Thread-direction highlights (Kajiya-Kay) give satin its long streaks.
  vec3 warp = normalize(vec3(1.0, 0.0, RELIEF * ha));
  vec3 weft = normalize(vec3(0.0, 1.0, RELIEF * hb));
  float tw = dot(warp, hv);
  float tf = dot(weft, hv);
  float streak = 0.5 * pow(max(1.0 - tw * tw, 0.0), 28.0) + 0.5 * pow(max(1.0 - tf * tf, 0.0), 28.0);
  float rim = pow(1.0 - n.z, 1.5);
  float valley = smoothstep(-1.7, 0.9, h);

  vec3 base = mix(vec3(0.90, 0.82, 0.68), vec3(0.23, 0.085, 0.075), uTone);
  vec3 deep = mix(vec3(0.36, 0.26, 0.18), vec3(0.022, 0.010, 0.014), uTone);
  vec3 spec = mix(vec3(1.0, 0.97, 0.91), vec3(1.0, 0.83, 0.60), uTone);
  vec3 col = mix(deep, base, diff * mix(0.58, 1.0, valley));
  col += spec * (0.10 * sheen + 0.56 * glint + 0.20 * streak * diff);
  col += spec * rim * mix(0.08, 0.13, uTone);
  col = shoulder(col);

  // Rolled hem: a thin bright line right at each edge.
  float hem = smoothstep(0.0055, 0.0015, edge) * smoothstep(0.0, aa * 2.0, edge);
  col = mix(col, mix(base, spec, 0.5), hem * 0.55);
  // Dither, so the long gradients never band.
  col += (hash(gl_FragCoord.xy) - 0.5) * 0.012;

  // Opaque over the theme seam (a = 0), sheer toward both hems. Tilted cloth packs
  // more thread per pixel, so folds read denser than flat areas. The dark silk stays
  // denser overall: sheer black over a light page only looks grey.
  float solid = 1.0 - smoothstep(0.07, 0.23, abs(a));
  float cover = smoothstep(0.0, aa, edge);
  float alpha = clamp(mix(mix(0.56, 0.88, uTone), 1.0, solid) + 0.55 * rim + 0.3 * hem, 0.0, 1.0) * cover;
  // Soft shadow the cloth throws on the page just outside its hems.
  float shadow = 0.24 * smoothstep(0.05, 0.0, -edge) * (1.0 - cover);
  gl_FragColor = vec4(clamp(col, 0.0, 1.0) * alpha, alpha + shadow);
}
`;

const UNIFORMS = ["uRes", "uScale", "uSlope", "uSeam", "uLen", "uTime", "uTone"] as const;

type Silk = {
  canvas: HTMLCanvasElement;
  gl: WebGLRenderingContext;
  at: Record<(typeof UNIFORMS)[number], WebGLUniformLocation | null>;
};

// One context for the page's lifetime: undefined = not tried yet, null = unavailable.
let silk: Silk | null | undefined;
// The canvas is shared, so only one sweep can run; a new one ends the previous first.
let finishActive: (() => void) | undefined;

function createSilk(): Silk | null {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1;
  // Software-rendered WebGL would turn a three-second sweep into a slideshow;
  // those visitors get the plain theme change instead.
  const gl = canvas.getContext("webgl", {
    alpha: true,
    premultipliedAlpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    failIfMajorPerformanceCaveat: true,
  });
  if (!gl) return null;

  const program = gl.createProgram();
  for (const [type, source] of [[gl.VERTEX_SHADER, VERTEX], [gl.FRAGMENT_SHADER, FRAGMENT]] as const) {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    gl.attachShader(program, shader);
  }
  gl.bindAttribLocation(program, 0, "p");
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  gl.useProgram(program);

  // A single triangle that covers the viewport.
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  const at = Object.fromEntries(
    UNIFORMS.map((name) => [name, gl.getUniformLocation(program, name)]),
  ) as Silk["at"];
  // Drivers tend to finish compiling on first use; pay for that here, not mid-sweep.
  gl.drawArrays(gl.TRIANGLES, 0, 3);

  canvas.addEventListener("webglcontextlost", () => {
    silk = undefined;
  });
  return { canvas, gl, at };
}

function getSilk() {
  if (silk === undefined) silk = createSilk();
  return silk;
}

/** Compiles the shader while the page is idle, so the first toggle starts instantly. */
export function preloadSilkTransition() {
  if (silk !== undefined) return;
  if (typeof window.requestIdleCallback === "function") {
    window.requestIdleCallback(() => void getSilk(), { timeout: 2000 });
  } else {
    window.setTimeout(getSilk, 600);
  }
}

/** Sweeps the silk across the page and changes the theme beneath it. Returns a cancel. */
export function startSilkThemeTransition(
  next: "light" | "dark",
  changeTheme: () => void,
  onComplete: () => void,
) {
  finishActive?.();
  const renderer = getSilk();
  const veil = document.createElement("div");
  veil.className = "silk-veil";
  veil.setAttribute("aria-hidden", "true");
  document.body.appendChild(veil);
  const { width, height } = veil.getBoundingClientRect();
  // No WebGL, or the veil is not rendered (reduced motion): just change the theme.
  if (!renderer || !width || !height) {
    veil.remove();
    changeTheme();
    // Deferred so the caller has stored the returned cancel before it is cleared.
    queueMicrotask(onComplete);
    return () => {};
  }

  const { canvas, gl, at } = renderer;
  const html = document.documentElement;
  veil.appendChild(canvas);
  const scale = Math.min(window.devicePixelRatio || 1, MAX_SCALE, Math.sqrt(MAX_PIXELS / (width * height)));
  const slope = Math.min(Math.max(height / width, 0.55), 1);
  const length = Math.sqrt(width * height);
  // The seam is the line y = slope * x + seam. It starts beyond the top-right corner
  // and ends beyond the bottom-left one, far enough that no cloth is left on screen.
  const stretch = Math.sqrt(1 + slope * slope);
  const from = -slope * width - (FRONT + OVERHANG) * length * stretch;
  const to = height + (BACK + OVERHANG) * length * stretch;
  const reveal = (seam: number) =>
    `polygon(0px 0px, ${width}px 0px, ${width}px ${seam + slope * width}px, 0px ${seam}px)`;

  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.uniform2f(at.uRes, canvas.width, canvas.height);
  gl.uniform1f(at.uScale, scale);
  gl.uniform1f(at.uSlope, slope);
  gl.uniform1f(at.uLen, length);
  gl.uniform1f(at.uTone, next === "dark" ? 1 : 0);

  let stopped = false;
  let changed = false;
  let transition: ViewTransition | undefined;
  let clock: Animation | undefined;
  let frame = 0;
  // A different stretch of the wave field each time, so no two sweeps fold alike.
  const phase = Math.random() * 40;
  const startedAt = performance.now();
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function applyTheme() {
    if (changed || stopped) return;
    changed = true;
    changeTheme();
  }

  function cleanup() {
    if (stopped) return;
    stopped = true;
    window.clearTimeout(timeout);
    cancelAnimationFrame(frame);
    document.removeEventListener("visibilitychange", handleVisibility);
    window.removeEventListener("resize", finish);
    motion.removeEventListener("change", finish);
    canvas.removeEventListener("webglcontextlost", finish);
    transition?.skipTransition();
    veil.remove();
    // Hand the drawing buffer's memory back until the next toggle.
    canvas.width = canvas.height = 1;
    delete html.dataset.silkTransition;
    if (finishActive === finish) finishActive = undefined;
  }

  function finish() {
    if (stopped) return;
    applyTheme();
    cleanup();
    onComplete();
  }

  function handleVisibility() {
    if (document.hidden) finish();
  }

  function draw() {
    if (stopped) return;
    const progress = clock?.effect?.getComputedTiming().progress ?? 1;
    gl.uniform1f(at.uSeam, from + (to - from) * progress);
    gl.uniform1f(at.uTime, phase + (performance.now() - startedAt) / 1000);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    frame = requestAnimationFrame(draw);
  }

  // `pseudoElement` set: the clock is the reveal itself. Otherwise it only keeps time.
  function run(pseudoElement?: string) {
    if (stopped) return;
    const timing = { duration: DURATION, easing: EASING, fill: "both" as const };
    try {
      clock = pseudoElement
        ? html.animate({ clipPath: [reveal(from), reveal(to)] }, { ...timing, pseudoElement })
        : veil.animate({ opacity: [1, 1] }, timing);
    } catch {
      finish();
      return;
    }
    clock.finished.then(finish, () => {});
    draw();
  }

  function runWithoutSnapshots() {
    if (stopped) return;
    html.dataset.silkTransition = "fallback";
    applyTheme();
    run();
  }

  finishActive = finish;
  document.addEventListener("visibilitychange", handleVisibility);
  // A resize would leave the seam and the cloth disagreeing about the viewport.
  window.addEventListener("resize", finish);
  motion.addEventListener("change", finish);
  canvas.addEventListener("webglcontextlost", finish);
  // Whatever happens, the theme button must not stay locked.
  const timeout = window.setTimeout(finish, DURATION + 1500);

  if (typeof document.startViewTransition === "function") {
    html.dataset.silkTransition = "native";
    try {
      const started = document.startViewTransition(applyTheme);
      transition = started;
      started.ready.then(() => {
        run("::view-transition-new(root)");
        // Covers the browser ending the transition early, e.g. for a newer one.
        started.finished.then(finish, finish);
      }, runWithoutSnapshots);
    } catch {
      runWithoutSnapshots();
    }
  } else {
    runWithoutSnapshots();
  }
  return cleanup;
}
