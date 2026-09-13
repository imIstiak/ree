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
    title: <>ঋ - Ree IS <em>COMING SOON</em></>,
    navTitle: "The first arrival",
    subtitle: "An independent clothing label shaped in Bengal.",
    image: "/scenes/collection-arrival-urban-v4.png",
    imageAlt: "A model in an oversized drop-shoulder T-shirt and cap in urban Dhaka",
    hotspots: [
      { label: "First drop", eyebrow: "Collection 01", title: "The beginning of ঋ - Ree", body: "A considered wardrobe of fluid layers, quiet tailoring, and everyday pieces made to stay with you.", x: 8, y: 25 },
      { label: "Our language", eyebrow: "Clothes with feeling", title: "Soft form. Clear intention.", body: "We design for movement, repetition, and the private rituals that make clothing feel like your own.", x: 28, y: 58 },
      { label: "Our roots", eyebrow: "Designed in Bengal", title: "Rooted here", body: "The name ঋ - Ree comes from ঋ, a symbol of season, rhythm, and return. Our clothes begin with the same idea.", x: 72, y: 51, align: "end" },
      { label: "Early access", eyebrow: "Before the first release", title: "Be first to wear ঋ - Ree", body: "Join the private list for the collection reveal, launch date, and first access to limited pieces.", x: 52, y: 70 },
    ],
  },
  {
    kicker: "02 / SILHOUETTE",
    title: <>FORM FOLLOWS <em>FEELING</em></>,
    navTitle: "Form follows feeling",
    subtitle: "Clothes designed around the body, never against it.",
    image: "/scenes/collection-silhouette-urban-v4.png",
    imageAlt: "Two models in oversized drop-shoulder T-shirts and caps walking through urban Dhaka",
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
    image: "/scenes/collection-makers-v2.png",
    imageAlt: "An artisan weaving indigo cloth by hand on a wooden loom",
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
    image: "/scenes/collection-materials-v2.png",
    imageAlt: "Handwoven natural fabrics and botanical dyes arranged beside water",
    hotspots: [
      { label: "Natural fibres", eyebrow: "Chosen by touch", title: "Materials that breathe", body: "Cotton, linen, and other considered fibres bring softness, structure, and ease to the collection.", x: 8, y: 42 },
      { label: "Colour", eyebrow: "Drawn from the landscape", title: "A grounded palette", body: "Moss, silt, night, and undyed ivory form the quiet colour language of our first release.", x: 31, y: 67 },
      { label: "Finish", eyebrow: "The beauty of detail", title: "Made to reveal itself slowly", body: "Subtle seams, tactile surfaces, and careful finishing reward a closer look.", x: 68, y: 31, align: "end" },
      { label: "Care", eyebrow: "Wear longer", title: "Keep what you love", body: "Simple care guidance and repair-minded construction help every ঋ - Ree piece remain in your wardrobe.", x: 82, y: 68, align: "end" },
    ],
  },
  {
    kicker: "05 / COLLECTION 01",
    title: <>THE FIRST <em>CIRCLE</em></>,
    navTitle: "Collection 01",
    subtitle: "Our opening collection arrives soon in limited quantities.",
    image: "/scenes/collection-lookbook-v2.png",
    imageAlt: "Three models wearing Collection 01 inside an earthen pavilion at blue hour",
    hotspots: [
      { label: "Lookbook", eyebrow: "A first glimpse", title: "Collection 01", body: "The complete lookbook will be revealed ahead of launch to members of our private list.", x: 10, y: 28 },
      { label: "Editions", eyebrow: "Small runs, considered pieces", title: "Limited by intention", body: "We produce in focused quantities so every garment receives the time and attention it deserves.", x: 31, y: 62 },
      { label: "Journal", eyebrow: "Behind the garment", title: "Notes from the studio", body: "Materials, fittings, maker stories, and the evolving ideas behind ঋ - Ree.", x: 72, y: 30, align: "end" },
      { label: "Join the list", eyebrow: "Early access", title: "Meet ঋ - Ree before anyone else", body: "Receive the launch date, private previews, and first access to Collection 01.", x: 80, y: 66, align: "end" },
    ],
  },
];

function Mark({ compact = false }: { compact?: boolean }) {
  return (
    <span className={compact ? "brand-mark brand-mark--compact" : "brand-mark"} aria-label="ঋ - Ree">
      <Image
        className="brand-logo"
        src="/ree-mark.svg"
        alt=""
        width={compact ? 30 : 38}
        height={compact ? 30 : 38}
        priority
      />
      {!compact && <span className="brand-word">ঋ - Ree</span>}
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
  onContact,
  mobile = false,
}: {
  hotspot: Hotspot;
  open: boolean;
  onClose: () => void;
  onContact: () => void;
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
      <button className="card-contact" onClick={onContact}>Join the list <span aria-hidden="true">↗</span></button>
    </div>
  );
}

export function LandingExperience() {
  const [introState, setIntroState] = useState<"visible" | "leaving" | "gone">("visible");
  const [activeScene, setActiveScene] = useState(0);
  const [openHotspot, setOpenHotspot] = useState<number | null>(null);
  const [soundOn, setSoundOn] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const stageRef = useRef<HTMLElement>(null);
  const contactDialogRef = useRef<HTMLDialogElement>(null);
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
      if (contactOpen) return;
      if (event.key === "Escape") setOpenHotspot(null);
      if (event.key === "ArrowRight") goTo(activeScene + 1);
      if (event.key === "ArrowLeft") goTo(activeScene - 1);
    };
    const onWheel = (event: WheelEvent) => {
      if (contactOpen) return;
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
  }, [activeScene, contactOpen, goTo, introState]);

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

  const openContact = () => {
    setOpenHotspot(null);
    setContactOpen(true);
    contactDialogRef.current?.showModal();
  };

  const closeContact = () => {
    contactDialogRef.current?.close();
    setContactOpen(false);
  };

  const activeHotspot = openHotspot === null
    ? null
    : scenes[activeScene].hotspots[openHotspot];

  return (
    <main className="experience-shell">
      {introState !== "gone" && (
        <section className={`intro-gate ${introState === "leaving" ? "intro-gate--leaving" : ""}`} aria-label="Welcome to ঋ - Ree">
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
            <h1 className="intro-title">ঋ - Ree · COMING SOON</h1>
            <p className="intro-subtitle">Not everything old belongs in the past.</p>
            <p className="intro-copy">We’re bringing stories, symbols, and heritage forward, shaping them into something made for now.</p>
            <button className="enter-button" onClick={enter}>
              <span>Explore</span><span aria-hidden="true">↘</span>
            </button>
          </div>
          <p className="intro-edition">DHAKA · BANGLADESH · COLLECTION 01</p>
        </section>
      )}

      <section
        ref={stageRef}
        tabIndex={-1}
        className="scene-stage"
        aria-label="ঋ - Ree immersive landscape"
        aria-hidden={introState !== "gone"}
        inert={introState !== "gone"}
        onPointerMove={handlePointerMove}
        style={{ "--scene-index": activeScene } as CSSProperties}
      >
        <header className="stage-header">
          <Mark compact />
          <span className="stage-location">DHAKA · COLLECTION 01</span>
          <button className="primary-action" onClick={openContact}>Join the list <span aria-hidden="true">↗</span></button>
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
                          <HotspotDetails hotspot={hotspot} open={isOpen} onClose={() => setOpenHotspot(null)} onContact={openContact} />
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
          <HotspotDetails hotspot={activeHotspot} open onClose={() => setOpenHotspot(null)} onContact={openContact} mobile />
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
            <button className="round-control" aria-label="Open the ঋ - Ree lookbook" onClick={() => { goTo(4); window.setTimeout(() => setOpenHotspot(0), 0); }}>
              <BookIcon /><span className="control-tooltip">Lookbook</span>
            </button>
            <button className="round-control" onClick={openContact} aria-label="Open contact options for ঋ - Ree">
              <MailIcon /><span className="control-tooltip">+880 17 8989 1616 · info@ree.bd</span>
            </button>
          </div>
        </div>
        <div className="scene-counter" aria-live="polite">0{activeScene + 1}<span>/</span>05</div>
      </section>

      <dialog
        ref={contactDialogRef}
        className="contact-dialog"
        aria-labelledby="contact-title"
        aria-describedby="contact-description"
        onCancel={() => setContactOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeContact();
        }}
      >
        <div className="contact-dialog__inner">
          <button className="contact-dialog__close" onClick={closeContact} aria-label="Close contact window" autoFocus>×</button>
          <span className="contact-dialog__eyebrow">CONTACT · ঋ - Ree</span>
          <h2 id="contact-title">Let&apos;s stay in touch.</h2>
          <p id="contact-description">For Collection 01, collaborations, press, or anything else, choose how you&apos;d like to reach us.</p>
          <div className="contact-dialog__actions">
            <a href="mailto:info@ree.bd">
              <span><small>Email</small>info@ree.bd</span>
              <span aria-hidden="true">↗</span>
            </a>
            <a href="tel:+8801789891616">
              <span><small>Call</small>+880 17 8989 1616</span>
              <span aria-hidden="true">↗</span>
            </a>
          </div>
          <span className="contact-dialog__location">DHAKA · BANGLADESH</span>
        </div>
      </dialog>
    </main>
  );
}
