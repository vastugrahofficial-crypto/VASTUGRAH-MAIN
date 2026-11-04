import { createFileRoute } from "@tanstack/react-router";
import SectionTitle from "@/components/site/SectionTitle";
import ServiceCard from "@/components/site/ServiceCard";
import CtaBand from "@/components/home/CtaBand";
import { SERVICES } from "@/lib/site";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/services")({
    head: () => ({ meta: [{ title: "Services | Vastugrah" }] }),
    component: Services,
});

function Services() {
    const { t } = useLang();

    return (
        <>
            <div className="mx-auto max-w-7xl px-5 pt-20 pb-12">
                <SectionTitle eyebrow={t("services.eyebrow")} title={t("services.title")} sub={t("services.sub")} />
                <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {SERVICES.map((s, i) => <ServiceCard key={s.title} s={s} i={i} />)}
                </div>
            </div>
            <CtaBand />
        </>
    );
}