import { Loader2, ShieldCheck } from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";

const authHeaders = () => ({});

const loginRedirect = (loginPath, ctx) => {
  const returnTo = window.location.pathname + "?ctx=" + encodeURIComponent(ctx);
  const encoded = encodeURIComponent(returnTo);
  window.location.href = (loginPath || "/login") + "?returnTo=" + encoded + "&from_url=" + encoded;
};

const OPERATION_VERBS = { read: "view", create: "create", update: "edit", delete: "delete" };
const COLLAPSED_DATA_ROWS = 6;

function groupTools(tools) {
  const operationsByEntity = new Map();
  const agents = [];
  const actions = [];
  for (const tool of tools) {
    if (tool.kind === "entity" && tool.entity) {
      if (!operationsByEntity.has(tool.entity)) operationsByEntity.set(tool.entity, []);
      operationsByEntity.get(tool.entity).push(tool.operation);
    } else if (tool.kind === "agent") {
      agents.push(tool);
    } else {
      actions.push(tool);
    }
  }
  const data = [...operationsByEntity].map(([entity, operations]) => ({
    entity,
    operations: Object.keys(OPERATION_VERBS).filter((op) => operations.includes(op)),
  }));
  return { data, agents, actions };
}

const humanize = (name) =>
  name.split(/[_-]+/).filter(Boolean).map((word) => word[0].toUpperCase() + word.slice(1)).join(" ") || name;

function OperationSummary({ operations }) {
  return (
    <>
      {operations.map((op, i) => {
        const verb = OPERATION_VERBS[op];
        const separator = i === 0 ? "" : i === operations.length - 1 ? " and " : ", ";
        return (
          <Fragment key={op}>
            {separator}
            <span className={op === "delete" ? "font-medium text-destructive" : undefined}>
              {i === 0 ? verb[0].toUpperCase() + verb.slice(1) : verb}
            </span>
          </Fragment>
        );
      })}{" "}
      records
    </>
  );
}

function ToolSection({ title, children }) {
  return (
    <section>
      <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">{title}</h3>
      <ul className="divide-y divide-border rounded-lg border border-border">{children}</ul>
    </section>
  );
}

function ToolRow({ title, children }) {
  return (
    <li className="flex flex-col gap-0.5 px-3 py-2">
      <span className="font-medium text-foreground">{title}</span>
      {children && <span className="text-muted-foreground">{children}</span>}
    </li>
  );
}

export function ConsentPage() {
  const ctx = new URLSearchParams(window.location.search).get("ctx");
  const [info, setInfo] = useState(null);
  const [checking, setChecking] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [decided, setDecided] = useState("");
  const [error, setError] = useState("");
  const [reconnect, setReconnect] = useState("");
  const [showAllData, setShowAllData] = useState(false);

  useEffect(() => {
    let redirecting = false;
    (async () => {
      try {
        if (!ctx) {
          setError("This authorization link is invalid or has expired.");
          return;
        }
        setError("OAuth consent is not configured.");
      } catch {
        setError("Could not load this authorization request. Please try again.");
      } finally {
        if (!redirecting) setChecking(false);
      }
    })();
  }, [ctx]);

  const respond = async (action) => {
    setSubmitting(true);
    setError("OAuth consent is not configured.");
    setSubmitting(false);
  };

  if (checking) {
    return (
      <AuthLayout icon={ShieldCheck} title="Authorize access">
        <div className="flex items-center justify-center py-6 text-muted-foreground">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
          Loading…
        </div>
      </AuthLayout>
    );
  }

  if (decided) {
    return <AuthLayout icon={ShieldCheck} title={decided === "approve" ? "Access granted" : "Access denied"} subtitle="You can return to your AI client and close this window." />;
  }
  if (reconnect) {
    return (
      <AuthLayout icon={ShieldCheck} title="Reconnect required">
        <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{reconnect}</div>
      </AuthLayout>
    );
  }
  if (error && !info) {
    return (
      <AuthLayout icon={ShieldCheck} title="Authorize access">
        <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
      </AuthLayout>
    );
  }

  const tools = Array.isArray(info?.tools) ? info.tools : [];
  const { data, agents, actions } = groupTools(tools);
  return (
    <AuthLayout icon={ShieldCheck} title="Authorize access" subtitle="An AI client wants to access this app on your behalf">
      {error && <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
      <div className="flex gap-3">
        <Button variant="outline" className="h-12 flex-1 font-medium" disabled={submitting} onClick={() => respond("deny")}>
          Deny
        </Button>
        <Button className="h-12 flex-1 font-medium" disabled={submitting} onClick={() => respond("approve")}>
          {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" /> : null}
          Approve
        </Button>
      </div>
    </AuthLayout>
  );
}
