"use client";

import Image from "next/image";
import {
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

type Hotspot = {
  label: string;
  eyebrow: string;
  title: string;
  body: string;
  x: number;
  y: number;
  align?: "start" | "end";
};

type Scene = {
  kicker: string;
  title: React.ReactNode;
  navTitle: string;
  subtitle: string;
  image: string;
  imageAlt: string;
  hotspots: Hotspot[];
};

const scenes: Scene[] = [
  {
    kicker: "01 / ARRIVAL",
    title: <>REE IS <em>COMING SOON</em></>,
    navTitle: "The first arrival",
    subtitle: "An independent clothing label shaped in Bengal.",
    image: "/scenes/meadow.png",
    imageAlt: "A monsoon-green meadow of white kash flowers at first light",
    hotspots: [
      { label: "First drop", eyebrow: "Collection 01", title: "The beginning of Ree", body: "A considered wardrobe of fluid layers, quiet tailoring, and everyday pieces made to stay with you.", x: 8, y: 25 },
      { label: "Our language", eyebrow: "Clothes with feeling", title: "Soft form. Clear intention.", body: "We design for movement, repetition, and the private rituals that make clothing feel like your own.", x: 28, y: 58 },
      { label: "Our roots", eyebrow: "Designed in Bengal", title: "Rooted here", body: "Ree takes its name from ঋ — a mark of season, rhythm, and return. Our clothes begin from the same idea.", x: 72, y: 51, align: "end" },
      { label: "Early access", eyebrow: "Before the first release", title: "Be first to wear Ree", body: "Join the private list for the collection reveal, launch date, and first access to limited pieces.", x: 52, y: 70 },
    ],
  },
  {
    kicker: "02 / SILHOUETTE",
    title: <>FORM FOLLOWS <em>FEELING</em></>,
    navTitle: "Form follows feeling",
    subtitle: "Clothes designed around the body, never against it.",
    image: "/scenes/river.png",
    imageAlt: "Sculptural river silt shaped into broad concentric ripples",
    hotspots: [
      { label: "Silhouette", eyebrow: "Cut with ease", title: "Space for the body", body: "Relaxed proportions and precise lines create pieces that feel composed without feeling constrained.", x: 10, y: 32 },
      { label: "Movement", eyebrow: "Made to be lived in", title: "Designed in motion", body: "Every shape is tested through walking, sitting, working, and the rhythm of an ordinary day.", x: 47, y: 60 },
      { label: "Layers", eyebrow: "One wardrobe, many moods", title: "Wear it your way", body: "Lightweight separates shift across seasons and build an expressive wardrobe without excess.", x: 76, y: 38, align: "end" },
    ],
  },
  {
    kicker: "03 / HANDS",
    title: <>MADE WITH <em>MANY HANDS</em></>,
    navTitle: "Made with many hands",
    subtitle: "A collection is only as meaningful as the people behind it.",
    image: "/scenes/field.png",
    imageAlt: "A dark meadow gathered around a warm field of fireflies",
    hotspots: [
      { label: "Makers", eyebrow: "People before product", title: "Made at human scale", body: "We work closely with small workshops and skilled makers, building trust into every garment.", x: 13, y: 53 },
      { label: "Process", eyebrow: "Considered at every step", title: "Nothing without purpose", body: "From first pattern to final stitch, each decision earns its place through function, feel, and longevity.", x: 47, y: 32 },
      { label: "Origin", eyebrow: "Transparent by design", title: "Know what you wear", body: "We will share where our materials come from, who makes each piece, and why we chose every process.", x: 78, y: 62, align: "end" },
    ],
  },
  {
    kicker: "04 / MATERIAL",
    title: <>THE CRAFT OF <em>SLOWNESS</em></>,
    navTitle: "The craft of slowness",
    subtitle: "Natural texture, thoughtful construction, and fewer better things.",
    image: "/scenes/path.png",
    imageAlt: "A straight rain-darkened path through a lush tropical sanctuary",
    hotspots: [
      { label: "Natural fibres", eyebrow: "Chosen by touch", title: "Materials that breathe", body: "Cotton, linen, and other considered fibres bring softness, structure, and ease to the collection.", x: 8, y: 42 },
      { label: "Colour", eyebrow: "Drawn from the landscape", title: "A grounded palette", body: "Moss, silt, night, and undyed ivory form the quiet colour language of our first release.", x: 31, y: 67 },
      { label: "Finish", eyebrow: "The beauty of detail", title: "Made to reveal itself slowly", body: "Subtle seams, tactile surfaces, and careful finishing reward a closer look.", x: 68, y: 31, align: "end" },
      { label: "Care", eyebrow: "Wear longer", title: "Keep what you love", body: "Simple care guidance and repair-minded construction help every Ree piece remain in your wardrobe.", x: 82, y: 68, align: "end" },
    ],
  },
  {
    kicker: "05 / COLLECTION 01",
    title: <>THE FIRST <em>CIRCLE</em></>,
    navTitle: "Collection 01",
    subtitle: "Our opening collection arrives soon in limited quantities.",
    image: "/scenes/circle.png",
    imageAlt: "A circular earthen pavilion glowing at blue hour in a water meadow",
    hotspots: [
      { label: "Lookbook", eyebrow: "A first glimpse", title: "Collection 01", body: "The complete lookbook will be revealed ahead of launch to members of our private list.", x: 10, y: 28 },
      { label: "Editions", eyebrow: "Small runs, considered pieces", title: "Limited by intention", body: "We produce in focused quantities so every garment receives the time and attention it deserves.", x: 31, y: 62 },
      { label: "Journal", eyebrow: "Behind the garment", title: "Notes from the studio", body: "Materials, fittings, maker stories, and the evolving ideas behind Ree.", x: 72, y: 30, align: "end" },
      { label: "Join the list", eyebrow: "Early access", title: "Meet Ree before anyone else", body: "Receive the launch date, private previews, and first access to Collection 01.", x: 80, y: 66, align: "end" },
    ],
  },
];

function Mark({ compact = false }: { compact?: boolean }) {
  return (
    <span className={compact ? "brand-mark brand-mark--compact" : "brand-mark"} aria-label="Ree">
      <span className="brand-glyph">ঋ</span>
      {!compact && <span className="brand-word">REE</span>}
    </span>
  );
}

function PlusIcon() {
  return <span className="hotspot-icon" aria-hidden="true"><span /></span>;
}

function SoundIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={active ? "wave wave--active" : "wave"}>
      <path d="M4 13v-2M8 16V8M12 18V6M16 15V9M20 13v-2" />
    </svg>
  );
}

function BookIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5c2.8-.8 5.4-.2 8 1.6v12c-2.6-1.8-5.2-2.4-8-1.6zM20 5.5c-2.8-.8-5.4-.2-8 1.6v12c2.6-1.8 5.2-2.4 8-1.6z" /></svg>;
}

function MailIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 6.5h17v11h-17zM4 7l8 6 8-6" /></svg>;
}

function HotspotDetails({
  hotspot,
  open,
  onClose,
  mobile = false,
}: {
  hotspot: Hotspot;
  open: boolean;
  onClose: () => void;
  mobile?: boolean;
}) {
  return (
    <div
      className={`${mobile ? "mobile-hotspot-card" : "hotspot-card"} ${open ? `${mobile ? "mobile-hotspot-card" : "hotspot-card"}--open` : ""}`}
      role="region"
      aria-label={hotspot.title}
    >
      <button className="card-close" onClick={onClose} aria-label="Close details">×</button>
      <span className="card-eyebrow">{hotspot.eyebrow}</span>
      <h3>{hotspot.title}</h3>
      <p>{hotspot.body}</p>
      <a href="mailto:hello@ree.place?subject=Join%20the%20Ree%20launch%20list">Join the list <span aria-hidden="true">↗</span></a>
    </div>
  );
}

export function LandingExperience() {
  const [introState, setIntroState] = useState<"visible" | "leaving" | "gone">("visible");
  const [activeScene, setActiveScene] = useState(0);
  const [openHotspot, setOpenHotspot] = useState<number | null>(null);
  const [soundOn, setSoundOn] = useState(false);
  const stageRef = useRef<HTMLElement>(null);
  const wheelLock = useRef(false);
  const audioRef = useRef<{ context: AudioContext; gain: GainNode; oscillators: OscillatorNode[] } | null>(null);

  const goTo = useCallback((index: number, historyMode: "push" | "replace" | "none" = "push") => {
    const next = Math.max(0, Math.min(scenes.length - 1, index));
    setActiveScene(next);
    setOpenHotspot(null);
    if (historyMode !== "none") {
      const method = historyMode === "push" ? "pushState" : "replaceState";
      window.history[method](null, "", `#room${next + 1}`);
    }
  }, []);

  const enter = () => {
    setIntroState("leaving");
    window.history.replaceState(null, "", `#room${activeScene + 1}`);
    window.setTimeout(() => {
      setIntroState("gone");
      stageRef.current?.focus();
    }, 760);
  };

  useEffect(() => {
    const fromHash = () => {
      const match = window.location.hash.match(/^#room([1-5])$/);
      if (match) goTo(Number(match[1]) - 1, "none");
    };
    fromHash();
    window.addEventListener("popstate", fromHash);
    window.addEventListener("hashchange", fromHash);
    return () => {
      window.removeEventListener("popstate", fromHash);
      window.removeEventListener("hashchange", fromHash);
    };
  }, [goTo]);

  useEffect(() => {
    if (introState !== "gone") return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenHotspot(null);
      if (event.key === "ArrowRight") goTo(activeScene + 1);
      if (event.key === "ArrowLeft") goTo(activeScene - 1);
    };
    const onWheel = (event: WheelEvent) => {
      if (wheelLock.current || Math.max(Math.abs(event.deltaX), Math.abs(event.deltaY)) < 20) return;
      event.preventDefault();
      wheelLock.current = true;
      const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      goTo(activeScene + (delta > 0 ? 1 : -1));
      window.setTimeout(() => { wheelLock.current = false; }, 760);
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("wheel", onWheel);
    };
  }, [activeScene, goTo, introState]);

  useEffect(() => () => { void audioRef.current?.context.close(); }, []);

  const toggleSound = () => {
    if (!audioRef.current) {
      const context = new window.AudioContext();
      const gain = context.createGain();
      const filter = context.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 280;
      gain.gain.value = 0;
      filter.connect(gain).connect(context.destination);
      const oscillators = [55, 82.4].map((frequency, index) => {
        const oscillator = context.createOscillator();
        const voiceGain = context.createGain();
        oscillator.type = index ? "sine" : "triangle";
        oscillator.frequency.value = frequency;
        voiceGain.gain.value = index ? 0.25 : 0.16;
        oscillator.connect(voiceGain).connect(filter);
        oscillator.start();
        return oscillator;
      });
      audioRef.current = { context, gain, oscillators };
    }
    const { context, gain } = audioRef.current;
    void context.resume();
    const next = !soundOn;
    gain.gain.cancelScheduledValues(context.currentTime);
    gain.gain.linearRampToValueAtTime(next ? 0.07 : 0, context.currentTime + 0.45);
    setSoundOn(next);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.pointerType === "touch") return;
    const x = (event.clientX / window.innerWidth - 0.5) * -28;
    const y = (event.clientY / window.innerHeight - 0.5) * -18;
    stageRef.current?.style.setProperty("--parallax-x", `${x}px`);
    stageRef.current?.style.setProperty("--parallax-y", `${y}px`);
  };

  const activeHotspot = openHotspot === null
    ? null
    : scenes[activeScene].hotspots[openHotspot];

  return (
    <main className="experience-shell">
      {introState !== "gone" && (
        <section className={`intro-gate ${introState === "leaving" ? "intro-gate--leaving" : ""}`} aria-label="Welcome to Ree">
          <div className="intro-top"><Mark /></div>
          <div className="intro-center">
            <div className="intro-thumbnails" aria-hidden="true">
              {scenes.map((scene, index) => (
                <div className="intro-thumbnail" style={{ "--i": index } as CSSProperties} key={scene.image}>
                  <Image src={scene.image} alt="" fill sizes="160px" />
                </div>
              ))}
              <svg className="intro-line" viewBox="0 0 800 120" preserveAspectRatio="none">
                <path d="M0 82 C78 20 128 102 214 57 S351 23 417 68 S551 111 628 50 S739 22 800 69" />
              </svg>
            </div>
            <p className="intro-kicker">AN INDEPENDENT CLOTHING LABEL</p>
            <h1>Coming soon.</h1>
            <p className="intro-copy">Thoughtful clothing shaped by movement, natural texture, and the quiet rhythms of Bengal.</p>
            <button className="enter-button" onClick={enter}>
              <span>Preview Ree</span><span aria-hidden="true">↘</span>
            </button>
          </div>
          <p className="intro-edition">DHAKA · COLLECTION 01</p>
        </section>
      )}

      <section
        ref={stageRef}
        tabIndex={-1}
        className="scene-stage"
        aria-label="Ree immersive landscape"
        aria-hidden={introState !== "gone"}
        inert={introState !== "gone"}
        onPointerMove={handlePointerMove}
        style={{ "--scene-index": activeScene } as CSSProperties}
      >
        <header className="stage-header">
          <Mark compact />
          <span className="stage-location">DHAKA · COLLECTION 01</span>
          <a className="primary-action" href="mailto:hello@ree.place?subject=Join%20the%20Ree%20launch%20list">Join the list <span aria-hidden="true">↗</span></a>
        </header>

        <div className="scene-track">
          {scenes.map((scene, sceneIndex) => (
            <article className={`scene ${sceneIndex === activeScene ? "scene--active" : ""}`} id={`room${sceneIndex + 1}`} aria-hidden={sceneIndex !== activeScene} key={scene.navTitle}>
              <div className="scene-media">
                <Image src={scene.image} alt={scene.imageAlt} fill sizes="100vw" priority={sceneIndex === 0} />
              </div>
              <div className="scene-wash" />
              <div className="scene-content">
                <div className="scene-heading-wrap">
                  <span className="scene-kicker">{scene.kicker}</span>
                  <h2>{scene.title}</h2>
                  <p>{scene.subtitle}</p>
                </div>

                <div className="hotspot-layer">
                  {scene.hotspots.map((hotspot, hotspotIndex) => {
                    const isOpen = sceneIndex === activeScene && openHotspot === hotspotIndex;
                    return (
                      <div className={`hotspot-wrap hotspot-wrap--${hotspot.align ?? "start"} ${isOpen ? "hotspot-wrap--open" : ""}`} style={{ "--x": `${hotspot.x}%`, "--y": `${hotspot.y}%` } as CSSProperties} key={hotspot.label}>
                        <button
                          className="hotspot"
                          aria-expanded={isOpen}
                          aria-controls={`panel-${sceneIndex}-${hotspotIndex}`}
                          onClick={() => setOpenHotspot(isOpen ? null : hotspotIndex)}
                          tabIndex={sceneIndex === activeScene ? 0 : -1}
                        >
                          <PlusIcon />
                          <span>{hotspot.label}</span>
                        </button>
                        <div id={`panel-${sceneIndex}-${hotspotIndex}`}>
                          <HotspotDetails hotspot={hotspot} open={isOpen} onClose={() => setOpenHotspot(null)} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </article>
          ))}
        </div>

        {activeHotspot ? (
          <HotspotDetails hotspot={activeHotspot} open onClose={() => setOpenHotspot(null)} mobile />
        ) : null}

        <div className="bottom-controls">
          <button className="round-control sound-control" onClick={toggleSound} aria-label={soundOn ? "Turn atmosphere off" : "Turn atmosphere on"} aria-pressed={soundOn}>
            <SoundIcon active={soundOn} />
            <span className="control-tooltip">{soundOn ? "Atmosphere on" : "Atmosphere off"}</span>
          </button>

          <nav className="scene-nav" aria-label="Explore the five landscapes">
            <span className="nav-word">COLLECTION</span>
            <div className="nav-markers">
              {scenes.map((scene, index) => (
                <button key={scene.navTitle} className={index === activeScene ? "nav-marker nav-marker--active" : "nav-marker"} onClick={() => goTo(index)} aria-label={`Scene ${index + 1}: ${scene.navTitle}`} aria-current={index === activeScene ? "page" : undefined}>
                  <span className="marker-dot" />
                  <span className="marker-tooltip">{scene.navTitle}</span>
                </button>
              ))}
            </div>
            <span className="nav-word">01</span>
            <span className="nav-hint">scroll or use arrow keys</span>
          </nav>

          <div className="action-controls">
            <button className="round-control" aria-label="Open the Ree lookbook" onClick={() => { goTo(4); window.setTimeout(() => setOpenHotspot(0), 0); }}>
              <BookIcon /><span className="control-tooltip">Lookbook</span>
            </button>
            <a className="round-control" href="mailto:hello@ree.place" aria-label="Email Ree">
              <MailIcon /><span className="control-tooltip">Write to us</span>
            </a>
          </div>
        </div>
        <div className="scene-counter" aria-live="polite">0{activeScene + 1}<span>/</span>05</div>
      </section>
    </main>
  );
}
