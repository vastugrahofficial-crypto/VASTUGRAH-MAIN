import { createFileRoute } from "@tanstack/react-router";
import { Facebook, Instagram, Mail, MapPin, Phone, Youtube } from "lucide-react";
import SectionTitle from "@/components/site/SectionTitle";
import WaButton from "@/components/site/WaButton";
import InquiryForm from "@/components/contact/InquiryForm";
import { ADDRESS, EMAIL, PHONE_TEL, SOCIALS } from "@/lib/site";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: "Contact | Vastugrah" }] }),
  component: Contact,
});

function Contact() {
  const { t } = useLang();
  const rows = [
    [Mail, EMAIL, `mailto:${EMAIL}`],
    [Phone, t("footer.call"), `tel:${PHONE_TEL}`],
    [MapPin, ADDRESS, null],
  ];
  const soc = [[Instagram, "Instagram", SOCIALS.instagram], [Facebook, "Facebook", SOCIALS.facebook], [Youtube, "YouTube", SOCIALS.youtube]];

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 md:py-16">
      <SectionTitle eyebrow={t("contact.eyebrow")} title={t("contact.title")} sub={t("contact.sub")} />
      <div className="grid gap-10 md:grid-cols-2">
        <div className="space-y-5">
          {rows.map(([Icon, text, href]) => (
            <div key={text} className="flex items-start gap-4">
              <Icon className="mt-1 shrink-0 text-primary" />
              {href ? <a href={href} className="break-all hover:text-primary">{text}</a> : <span>{text}</span>}
            </div>
          ))}
          <WaButton text="Namaste Vastugrah, I would like to talk to you.">{t("contact.chat")}</WaButton>
          <div className="flex gap-3 pt-2">
            {soc.map(([Icon, label, href]) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-primary transition hover:bg-primary hover:text-primary-foreground"><Icon size={18} /></a>
            ))}
          </div>
        </div>
        <InquiryForm />
      </div>
    </div>
  );
}