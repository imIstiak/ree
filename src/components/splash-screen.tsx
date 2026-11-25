import type { CSSProperties } from "react";

// The splash screen: the logo alone on a full screen of its own colour, after cookspace.co's (the
// user asked for it): the mark's outline draws itself, fills, the REÉ wordmark rises in under it,
// the two settle together, and the screen fades to the page. Rendered first in the root layout, so
// it is in the first paint; the timing is CSS (.ree-splash in globals.css).
//
// The script before it decides, before anything paints:
// - when it plays: on every full load of the front pages, / and /landing (the user asked for it on
//   /landing too), on the first page of a visit anywhere else (sessionStorage), never in the
//   backroom; otherwise it marks the page done at once and the splash is never shown. Moving
//   between pages inside the site keeps the root layout, so the splash does not replay;
// - the screen's colours from the saved theme (emerald for dark, the default; cream for light);
// - `data-splash-run` holds the page's own CSS entrance under it until `data-splash-done`, when the
//   splash has gone. Without JavaScript nothing is held and the splash still fades by itself.

const SCRIPT = `(function(){var r=document.documentElement,p=location.pathname;function done(){r.setAttribute("data-splash-done","")}if(p.indexOf("/backroom")===0)return done();var entry=p==="/"||p==="/landing";try{if(!entry&&sessionStorage.getItem("ree-splash"))return done();sessionStorage.setItem("ree-splash","1")}catch(e){}var t;try{t=localStorage.getItem("ree-theme")}catch(e){}r.setAttribute("data-splash-tone",t==="light"?"light":"dark");r.setAttribute("data-splash-run","");setTimeout(done,matchMedia("(prefers-reduced-motion: reduce)").matches?1400:4400)})()`;

// The mark's three shapes (public/ree-logo.svg, #ree-mark), drawn one after another.
const mark = [
  { d: "M53 30c0 12-6 18-18 18 12 0 18 6 18 18 0-12 6-18 18-18-12 0-18-6-18-18Z", delay: "0s" },
  { d: "M97 36C81 62 62 81 40 96c-4 2-4 6 0 8 23 15 42 36 57 60 10-21 10-39 2-57-13-26-13-47-2-71Z", delay: ".14s" },
  { d: "M103 36c16 26 35 45 57 60 4 2 4 6 0 8-23 15-42 36-57 60 12-23 12-41 3-61-13-26-14-45-3-67Z", delay: ".28s" },
];

// The wordmark (#ree-wordmark), acute included.
const wordmark = [
  "M0 0h25c14 0 20 5 20 13 0 7-6 11-15 12 10 1 13 6 13 15v8c0 3 2 4 6 2l1 1c-3 2-5 2-8 2-8 0-11-4-11-12v-7c0-6-3-8-10-8h-3v25h7v1H0v-1h7V1H0V0Zm18 1v24h5c8 0 10-4 10-12S30 1 23 1h-5Z",
  "M82 0h40v15h-1C118 5 114 1 105 1h-5v24h2c7 0 10-3 11-10h1v21h-1c-1-7-4-10-11-10h-2v25h5c10 0 15-5 18-17h1v18H82v-1h7V1h-7V0Z",
  "M158 0h40v15h-1c-3-10-7-14-16-14h-5v24h2c7 0 10-3 11-10h1v21h-1c-1-7-4-10-11-10h-2v25h5c10 0 15-5 18-17h1v18h-42v-1h7V1h-7V0Z",
  "M172.6-1.85 180.9-13A2.2 2.2 0 0 1 184.1-10L173.4-1.15A.55.55 0 0 1 172.6-1.85Z",
];

export function SplashScreen() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />
      <div className="ree-splash" aria-hidden="true">
        <div className="ree-splash-logo">
          <svg className="ree-splash-mark" viewBox="30 26 140 142" focusable="false">
            {mark.map((shape) => (
              <path key={shape.delay} d={shape.d} pathLength={1} style={{ "--draw-delay": shape.delay } as CSSProperties} />
            ))}
          </svg>
          <svg className="ree-splash-word" viewBox="0 -14 200 68" focusable="false">
            {wordmark.map((d, index) => (
              <path key={d.slice(0, 12)} d={d} fillRule={index === 0 ? "evenodd" : undefined} />
            ))}
          </svg>
        </div>
      </div>
    </>
  );
}
