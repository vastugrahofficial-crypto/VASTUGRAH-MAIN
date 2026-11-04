import { createFileRoute } from "@tanstack/react-router";
import { Image } from "@/components/ui/image";
import Reveal from "@/components/site/Reveal";
import SectionTitle from "@/components/site/SectionTitle";
import CtaBand from "@/components/home/CtaBand";
import { FEATURED, LOGO } from "@/lib/site";
import { useLang } from "@/lib/i18n";

const TIMELINE = [
  { yKey: "about.t1y", tKey: "about.t1", dKey: "about.t1d" },
  { yKey: "about.t2y", tKey: "about.t2", dKey: "about.t2d" },
  { yKey: "about.t3y", tKey: "about.t3", dKey: "about.t3d" },
];

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{ title: "About | Vastugrah" }] }),
  component: About,
});

function About() {
  const { t } = useLang();

  return (
    <>
      <section className="mx-auto grid max-w-7xl items-center gap-8 px-5 py-10 md:gap-12 md:py-16 lg:grid-cols-2">
        <Reveal><Image src={FEATURED[2].img} alt="Brass compass and Kundli chart" className="aspect-[4/3] w-full rounded-2xl border border-border" /></Reveal>
        <Reveal delay={0.15}>
          <p className="btn-caps mb-3 text-primary">{t("about.eyebrow")}</p>
          <h1 className="text-5xl">{t("about.title")}</h1>
          <p className="mt-5 text-muted-foreground">{t("about.sub")}</p>
          <ol className="mt-8 space-y-6 border-l border-primary pl-6">
            {TIMELINE.map((x) => (
              <li key={x.yKey}>
                <p className="btn-caps text-primary">{t(x.yKey)}</p>
                <h3 className="text-2xl">{t(x.tKey)}</h3>
                <p className="text-muted-foreground">{t(x.dKey)}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      </section>
      <section className="mx-auto max-w-3xl px-5 pb-10 text-center">
        <SectionTitle eyebrow={t("about.emblemEyebrow")} title={t("about.emblemTitle")} sub={t("about.emblemSub")} />
        <div className="mx-auto w-fit rounded-[2rem] border border-border bg-card p-4">
          <Image src={LOGO} alt="Vastugrah emblem" fittingType="fit" className="h-56 w-56 sm:h-64 sm:w-64" />
        </div>
      </section>
      <CtaBand />
    </>
  );
}