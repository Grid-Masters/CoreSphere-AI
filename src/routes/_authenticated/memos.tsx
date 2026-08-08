import { createFileRoute } from "@tanstack/react-router";
import { StickyNote, AlertTriangle, Clock } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PanelCard } from "@/components/ui-bits/Card";
import { AckButton } from "@/components/governance/AckButton";
import { useAcknowledged } from "@/lib/ack-store";
import { memos } from "@/lib/mock-data";

export const Route = createFileRoute("/_authenticated/memos")({
  head: () => ({
    meta: [
      { title: "Operations Memos — UBA CoreSphere" },
      { name: "description", content: "Operational notices, compliance alerts and memos for the UBA Customer Fulfillment Group — acknowledge to confirm read." },
      { property: "og:title", content: "Operations Memos — UBA CoreSphere" },
      { property: "og:description", content: "Operational notices, compliance alerts and memos for the UBA Customer Fulfillment Group — acknowledge to confirm read." },
      { property: "og:url", content: "https://ubacoresphere-pulse.lovable.app/memos" },
    ],
    links: [{ rel: "canonical", href: "https://ubacoresphere-pulse.lovable.app/memos" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Operations Memos",
          description: "Notices, compliance alerts, and operational memos for UBA Customer Fulfillment.",
          mainEntity: {
            "@type": "ItemList",
            itemListElement: memos.map((m, i) => ({
              "@type": "ListItem",
              position: i + 1,
              item: {
                "@type": "Article",
                headline: m.title,
                articleSection: m.category,
                dateModified: m.expires,
                publisher: { "@type": "Organization", name: "United Bank for Africa" },
              },
            })),
          },
        }),
      },
    ],
  }),
  component: Memos,
});

function Memos() {
  return (
    <AppShell>
      <div className="mb-6">
        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Communication</div>
        <h1 className="text-2xl font-semibold tracking-tight mt-1">Operations Memo Board</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Notices, compliance alerts, and operational memos. Acknowledge to confirm read.
        </p>
      </div>

      <PanelCard title="Active Memos">
        <ul className="grid md:grid-cols-2 gap-3">
          {memos.map((m) => (
            <MemoCard key={m.id} memo={m} />
          ))}
        </ul>
      </PanelCard>
    </AppShell>
  );
}

function MemoCard({ memo: m }: { memo: (typeof memos)[number] }) {
  const [acked] = useAcknowledged(String(m.id));
  return (
    <li className="border rounded-lg p-4 flex flex-col gap-3 bg-background hover:border-primary/40 transition-colors">
      <div className="flex items-start gap-3">
        <div
          className={`h-9 w-9 rounded-md flex items-center justify-center ${
            m.category === "Compliance"
              ? "bg-destructive/10 text-destructive"
              : "bg-primary/10 text-primary"
          }`}
        >
          {m.category === "Compliance" ? <AlertTriangle className="h-4 w-4" /> : <StickyNote className="h-4 w-4" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium">{m.title}</div>
          <div className="text-[11px] text-muted-foreground mt-0.5 inline-flex items-center gap-2">
            {m.category} <span>•</span> <Clock className="h-3 w-3" /> Expires {m.expires}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between pt-2 border-t">
        {!acked && <span className="text-[11px] text-[color:var(--warning)]">Pending acknowledgement</span>}
        <AckButton targetId={String(m.id)} targetKind="memo" className="ml-auto" />
      </div>
    </li>
  );
}