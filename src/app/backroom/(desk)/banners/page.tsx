import { deleteSlide } from "../../catalog-actions";
import { DeleteButton } from "../../../../components/backroom/delete-button";
import { SlideForm } from "../../../../components/backroom/slide-form";
import { Notice, PageHead } from "../../../../components/backroom/ui";
import { listHeroSlides } from "../../../../lib/backroom-data";
import { supabaseConfigured } from "../../../../lib/supabase";

// The landing page's hero slides, in order: each one a full-screen photograph whose card leads to a
// page. The slideshow moves with three or more shown slides.
export default async function BannersPage({ searchParams }: PageProps<"/backroom/banners">) {
  const { saved, deleted } = await searchParams;
  const slides = await listHeroSlides();
  const live = supabaseConfigured();
  const shown = slides.filter((slide) => slide.status === "published").length;
  return (
    <>
      <PageHead kicker={`Landing hero · ${shown} shown · ${slides.length} in all`} title="Banners" />
      <div className="mb-6 space-y-3">
        {shown < 3 && <Notice tone="warn">The hero slideshow needs at least three shown slides to move; with fewer it stands still on the first.</Notice>}
        {deleted && <Notice tone="good">The slide was deleted.</Notice>}
        <Notice>Collection and season banners are set on each collection&apos;s and season&apos;s own page (Collections).</Notice>
      </div>
      <ul className="space-y-5">
        {slides.map((slide, index) => (
          <li key={slide.id}>
            <p className="pb-2 text-[10px] tracking-[.16em] text-lp-muted uppercase">
              Slide {index + 1}
              {slide.status === "hidden" && " · hidden"}
            </p>
            <SlideForm key={slide.updated_at} slide={slide} readOnly={!live} saved={saved === slide.id}>
              {live && (
                <form action={deleteSlide} className="mt-4 border-t border-dashed border-lp-border pt-4">
                  <input type="hidden" name="id" value={slide.id} />
                  <DeleteButton name={`slide ${index + 1}`} what="its photograph" />
                </form>
              )}
            </SlideForm>
          </li>
        ))}
        {live && (
          <li>
            <p className="pb-2 text-[10px] tracking-[.16em] text-lp-muted uppercase">Add a slide</p>
            <SlideForm />
          </li>
        )}
      </ul>
    </>
  );
}
