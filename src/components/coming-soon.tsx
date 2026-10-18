"use client";

import Image from "next/image";
import Link from "next/link";
import { BrandLogo } from "./brand-logo";
import { COMING_SOON_ROOT_ID, ThemeControls, ThemeScript } from "./theme-controls";
import { ArrowDownRight, ArrowUpRight, X } from "lucide-react";
import {
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

/* Where a modal's light comes from: the point (viewport px) of the click that opened it. */
type BeamOrigin = { x: number; y: number };

/* Each card is a cloth patch; the cloths cycle through the site's patch tokens (globals.css). */
const cloths = ["var(--color-lp-patch-indigo)", "var(--color-lp-patch-olive)", "var(--color-lp-patch-madder)", "var(--color-lp-brand)"];

/* The click's own coordinates, or the control's centre when it was activated from the keyboard. */
function pointOf(event: ReactMouseEvent<HTMLElement>): BeamOrigin {
  const bounds = event.currentTarget.getBoundingClientRect();
  return event.detail === 0
    ? { x: bounds.left + bounds.width / 2, y: bounds.top + bounds.height / 2 }
    : { x: event.clientX, y: event.clientY };
}

/* Aims a modal's beam (globals.css `.ree-beam`): the torch sits at `origin`, written in the panel's
   own pixels, and points at the panel's centre. Conic angles run clockwise from the top. */
function aimBeam(panel: HTMLElement, origin: BeamOrigin) {
  const bounds = panel.getBoundingClientRect();
  const x = origin.x - bounds.left;
  const y = origin.y - bounds.top;
  const angle = Math.atan2(bounds.width / 2 - x, -(bounds.height / 2 - y)) * (180 / Math.PI);
  panel.style.setProperty("--flash-x", `${x}px`);
  panel.style.setProperty("--flash-y", `${y}px`);
  panel.style.setProperty("--beam-angle", `${angle}deg`);
}

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
    title: <>ঋ - Ree<br /><em>COMING SOON</em></>,
    navTitle: "The first arrival",
    subtitle: "An independent clothing label shaped in Bengal.",
    image: "/coming-soon/arrival-street.jpg",
    imageAlt: "A man in a relaxed T-shirt and sunglasses walking down a city street",
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
    image: "/coming-soon/silhouette-walk.jpg",
    imageAlt: "Two women in flowing dresses and tailoring walking together through a sunlit street",
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
    image: "/coming-soon/hands-weaving.jpg",
    imageAlt: "Hands weaving striped cloth on a traditional loom",
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
    image: "/coming-soon/material-rack.jpg",
    imageAlt: "Garments in earthy colours and natural fabrics hanging on a rail",
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
    image: "/coming-soon/collection-window.jpg",
    imageAlt: "A boutique window announcing a new collection, with garments on rails inside",
    hotspots: [
      { label: "Lookbook", eyebrow: "A first glimpse", title: "Collection 01", body: "The complete lookbook will be revealed ahead of launch to members of our private list.", x: 10, y: 28 },
      { label: "Editions", eyebrow: "Small runs, considered pieces", title: "Limited by intention", body: "We produce in focused quantities so every garment receives the time and attention it deserves.", x: 31, y: 62 },
      { label: "Journal", eyebrow: "Behind the garment", title: "Notes from the studio", body: "Materials, fittings, maker stories, and the evolving ideas behind ঋ - Ree.", x: 72, y: 30, align: "end" },
      { label: "Join the list", eyebrow: "Early access", title: "Meet ঋ - Ree before anyone else", body: "Receive the launch date, private previews, and first access to Collection 01.", x: 80, y: 66, align: "end" },
    ],
  },
];

function PlusIcon() {
  return <span className="hotspot-icon lp-patch" aria-hidden="true"><span /></span>;
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
  cloth,
  open,
  onClose,
  onContact,
  mobile = false,
  origin,
  panelId,
}: {
  hotspot: Hotspot;
  cloth: string;
  open: boolean;
  onClose: () => void;
  onContact: (event: ReactMouseEvent<HTMLButtonElement>) => void;
  mobile?: boolean;
  origin: BeamOrigin | null;
  panelId?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const base = mobile ? "mobile-hotspot-card" : "hotspot-card";

  // Aim the beam before the open state paints, so the reveal starts from the right point.
  useLayoutEffect(() => {
    if (open && origin && ref.current) aimBeam(ref.current, origin);
  }, [open, origin]);

  return (
    <div className={mobile ? "mobile-hotspot-panel" : "hotspot-panel"} id={panelId}>
      <div
        ref={ref}
        className={`${base} lp-patch ree-beam ${open ? `${base}--open` : ""}`}
        style={{ "--cloth": cloth } as CSSProperties}
        role="region"
        aria-label={hotspot.title}
      >
        <button className="card-close lp-patch" onClick={onClose} aria-label="Close details">
          <X size={15} strokeWidth={1.5} aria-hidden="true" />
        </button>
        <span className="card-eyebrow lp-patch">{hotspot.eyebrow}</span>
        <h3>{hotspot.title}</h3>
        <p>{hotspot.body}</p>
        <button className="card-contact lp-patch" onClick={onContact}>Join the list <ArrowUpRight size={13} strokeWidth={1.5} aria-hidden="true" /></button>
      </div>
    </div>
  );
}

export function ComingSoon() {
  const [introState, setIntroState] = useState<"visible" | "leaving" | "gone">("visible");
  const [activeScene, setActiveScene] = useState(0);
  const [openHotspot, setOpenHotspot] = useState<number | null>(null);
  // The card last opened stays mounted (the phone card too) so it can close with the beam reversed.
  const [shownHotspot, setShownHotspot] = useState(0);
  const [beamOrigin, setBeamOrigin] = useState<BeamOrigin | null>(null);
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

  const openHotspotFrom = (hotspotIndex: number, origin: BeamOrigin) => {
    setBeamOrigin(origin);
    setShownHotspot(hotspotIndex);
    setOpenHotspot(hotspotIndex);
  };

  const toggleHotspot = (event: ReactMouseEvent<HTMLButtonElement>, sceneIndex: number, hotspotIndex: number) => {
    if (sceneIndex === activeScene && openHotspot === hotspotIndex) setOpenHotspot(null);
    else openHotspotFrom(hotspotIndex, pointOf(event));
  };

  // The contact window beams from the button that opened it, once it is in the top layer.
  const openContact = (event: ReactMouseEvent<HTMLButtonElement>) => {
    const origin = pointOf(event);
    setOpenHotspot(null);
    setContactOpen(true);
    const dialog = contactDialogRef.current;
    dialog?.showModal();
    const panel = dialog?.querySelector<HTMLElement>(".contact-dialog__inner");
    if (panel) aimBeam(panel, origin);
  };

  // The window leaves the way it came (.ree-pop in globals.css): mark it closing, let the exit
  // animations finish, then close it. `onClose` keeps the state in step however it was shut.
  const closeContact = () => {
    const dialog = contactDialogRef.current;
    if (!dialog?.open || dialog.hasAttribute("data-closing")) return;
    dialog.setAttribute("data-closing", "");
    Promise.allSettled(dialog.getAnimations({ subtree: true }).map((animation) => animation.finished)).then(() => dialog.close());
  };

  const mobileHotspot = scenes[activeScene].hotspots[shownHotspot] ?? scenes[activeScene].hotspots[0];

  return (
    <main
      id={COMING_SOON_ROOT_ID}
      data-lp-theme="dark"
      suppressHydrationWarning
      className="experience-shell group/theme"
    >
      <ThemeScript rootId={COMING_SOON_ROOT_ID} />
      <ThemeControls rootId={COMING_SOON_ROOT_ID} />
      {introState !== "gone" && (
        <section className={`intro-gate ${introState === "leaving" ? "intro-gate--leaving" : ""}`} aria-label="Welcome to ঋ - Ree">
          <div className="intro-top"><BrandLogo className="intro-logo" /></div>
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
            <h1 className="intro-title">
              <BrandLogo variant="wordmark" className="intro-title__brand" />
              <span className="intro-title__status">COMING SOON</span>
            </h1>
            <p className="intro-subtitle">Not everything old belongs in the past.</p>
            <p className="intro-copy">We’re bringing stories, symbols, and heritage forward, shaping them into something made for now.</p>
            <button className="enter-button" onClick={enter}>
              <span>Explore</span><span aria-hidden="true"><ArrowDownRight size={14} strokeWidth={1.75} /></span>
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
          <Link href="/" aria-label="REE home"><BrandLogo className="stage-logo" decorative /></Link>
          <span className="stage-location">DHAKA · COLLECTION 01</span>
          <button className="primary-action" onClick={openContact}>Join the list <span aria-hidden="true"><ArrowUpRight size={13} strokeWidth={1.75} /></span></button>
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
                          className="hotspot lp-patch"
                          aria-expanded={isOpen}
                          aria-controls={`panel-${sceneIndex}-${hotspotIndex}`}
                          onClick={(event) => toggleHotspot(event, sceneIndex, hotspotIndex)}
                          tabIndex={sceneIndex === activeScene ? 0 : -1}
                        >
                          <PlusIcon />
                          <span>{hotspot.label}</span>
                        </button>
                        <HotspotDetails
                          hotspot={hotspot}
                          cloth={cloths[hotspotIndex % cloths.length]}
                          open={isOpen}
                          onClose={() => setOpenHotspot(null)}
                          onContact={openContact}
                          origin={beamOrigin}
                          panelId={`panel-${sceneIndex}-${hotspotIndex}`}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </article>
          ))}
        </div>

        <HotspotDetails
          hotspot={mobileHotspot}
          cloth={cloths[shownHotspot % cloths.length]}
          open={openHotspot !== null && openHotspot === shownHotspot}
          onClose={() => setOpenHotspot(null)}
          onContact={openContact}
          mobile
          origin={beamOrigin}
        />

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
            <button className="round-control" aria-label="Open the ঋ - Ree lookbook" onClick={(event) => {
              // Open the card once the scene track has arrived (650 ms), so the beam is aimed from where the card settles.
              const origin = pointOf(event);
              const delay = activeScene === 4 ? 0 : 660;
              goTo(4);
              window.setTimeout(() => openHotspotFrom(0, origin), delay);
            }}>
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
        onCancel={(event) => {
          event.preventDefault();
          closeContact();
        }}
        onClose={(event) => {
          event.currentTarget.removeAttribute("data-closing");
          setContactOpen(false);
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeContact();
        }}
      >
        <div className="contact-dialog__inner lp-patch ree-beam">
          <button className="contact-dialog__close lp-patch" onClick={closeContact} aria-label="Close contact window" autoFocus>
            <X size={17} strokeWidth={1.5} aria-hidden="true" />
          </button>
          <span className="contact-dialog__eyebrow ree-pop-row" style={{ "--i": 0 } as CSSProperties}>CONTACT · ঋ - Ree</span>
          <h2 id="contact-title" className="ree-pop-row" style={{ "--i": 1 } as CSSProperties}>Let&apos;s stay in touch.</h2>
          <p id="contact-description" className="ree-pop-row" style={{ "--i": 2 } as CSSProperties}>For Collection 01, collaborations, press, or anything else, choose how you&apos;d like to reach us.</p>
          <div className="contact-dialog__actions ree-pop-row" style={{ "--i": 3 } as CSSProperties}>
            <a href="mailto:info@ree.bd" className="lp-patch">
              <span><small>Email</small>info@ree.bd</span>
              <ArrowUpRight size={18} strokeWidth={1.25} aria-hidden="true" />
            </a>
            <a href="tel:+8801789891616" className="lp-patch">
              <span><small>Call</small>+880 17 8989 1616</span>
              <ArrowUpRight size={18} strokeWidth={1.25} aria-hidden="true" />
            </a>
          </div>
          <span className="contact-dialog__location ree-pop-row" style={{ "--i": 4 } as CSSProperties}>DHAKA · BANGLADESH</span>
        </div>
      </dialog>
    </main>
  );
}
