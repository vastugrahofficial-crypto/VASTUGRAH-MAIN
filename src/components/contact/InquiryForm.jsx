import React, { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import WaButton from "@/components/site/WaButton";
import { createInquiry } from "@/lib/server-fns";
import { SERVICES, serviceOf } from "@/lib/site";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLang } from "@/lib/i18n";

const empty = { name: "", phone: "", email: "", service: "", message: "" };

export default function InquiryForm() {
  const { t, lang } = useLang();
  const [f, setF] = useState(empty);
  const [sent, setSent] = useState(null);
  const send = useServerFn(createInquiry);
  const m = useMutation({
    mutationFn: (data) => send({ data }),
    onSuccess: (_, data) => { setSent(data); setF(empty); toast.success(t("form.toastOk")); },
    onError: () => toast.error(t("form.toastErr")),
  });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  if (sent) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <h3 className="text-3xl">{t("form.thanks")}, {sent.name}</h3>
        <p className="my-4 text-muted-foreground">{t("form.thanksSub")}</p>
        <WaButton text={`Namaste Vastugrah, I am ${sent.name}. I just sent an enquiry${sent.service ? ` about ${sent.service}` : ""}.`}>{t("form.continueWa")}</WaButton>
      </div>
    );
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); m.mutate(f); }} className="space-y-4 rounded-2xl border border-border bg-card p-8">
      <Input required placeholder={t("form.name")} value={f.name} onChange={set("name")} maxLength={100} className="rounded-full" />
      <Input required type="tel" placeholder={t("form.phone")} value={f.phone} onChange={set("phone")} minLength={7} maxLength={20} className="rounded-full" />
      <Input type="email" placeholder={t("form.email")} value={f.email} onChange={set("email")} maxLength={200} className="rounded-full" />
      <Select value={f.service} onValueChange={(v) => setF({ ...f, service: v })}>
        <SelectTrigger className="h-10 w-full rounded-full">
          <SelectValue placeholder={t("form.service")} />
        </SelectTrigger>
        <SelectContent className="rounded-2xl">
          {SERVICES.map((s) => (
            <SelectItem key={s.title} value={s.title} className="rounded-xl">{serviceOf(s, lang).title}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Textarea placeholder={t("form.message")} rows={4} value={f.message} onChange={set("message")} maxLength={1500} className="rounded-2xl" />
      <Button type="submit" disabled={m.isPending} className="btn-caps h-12 w-full rounded-full">{m.isPending ? t("form.sending") : t("form.send")}</Button>
    </form>
  );
}