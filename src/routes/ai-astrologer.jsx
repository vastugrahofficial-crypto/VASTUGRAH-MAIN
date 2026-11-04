import { createFileRoute } from "@tanstack/react-router";
import AiAstrologerWindow from "@/components/ai/AiAstrologerWindow";

export const Route = createFileRoute("/ai-astrologer")({
  validateSearch: (search) => ({
    specialist: typeof search.specialist === "string" ? search.specialist : undefined,
  }),
  head: () => ({
    meta: [
      { title: "AI Astrologer | Vastugrah" },
      { name: "description", content: "Ask a Vedic AI astrologer about career, wealth, marriage, health or Vastu — grounded in your kundli." },
    ],
  }),
  component: AiPage,
});

function AiPage() {
  const { specialist } = Route.useSearch();
  return <AiAstrologerWindow initialId={specialist} />;
}