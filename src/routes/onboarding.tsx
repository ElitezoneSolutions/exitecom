import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { Logo } from "@/components/ex/Logo";
import { SectionLabel } from "@/components/ex/SectionLabel";
import { ScoreRing } from "@/components/ex/ScoreRing";
import { ProgressBar } from "@/components/ex/ProgressBar";
import { useAuth } from "@/hooks/useAuth";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { toast } from "sonner";

export const Route = createFileRoute("/onboarding")({ component: Onboarding });

interface OnboardingData {
  businessName: string;
  industry: string;
  primaryChannel: string;
  country: string;
  monthlyRevenue: string;
  businessAge: string;
  connectedSources: string[];
  paidAdManager: string;
  supplierRelationshipManager: string;
  hasDocumentedSops: string;
  exitTimeframe: string;
}

function Onboarding() {
  const [step, setStep] = useState(1);
  const total = 4;

  const [formData, setFormData] = useState<OnboardingData>({
    businessName: "",
    industry: "Beauty & Skincare",
    primaryChannel: "Shopify",
    country: "",
    monthlyRevenue: "< £10k",
    businessAge: "Under 12 months",
    connectedSources: [],
    paidAdManager: "Me",
    supplierRelationshipManager: "Me",
    hasDocumentedSops: "Yes, fully documented",
    exitTimeframe: "3 months",
  });

  const updateFields = (fields: Partial<OnboardingData>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <header className="border-b border-[var(--border-warm)]">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
          <Logo />
          <div className="text-xs text-[var(--text-muted)]">
            Step {step} of {total}
          </div>
        </div>
      </header>

      <div className="max-w-[1200px] mx-auto px-6 lg:px-10 pt-8">
        <Stepper step={step} total={total} />
      </div>

      <main className="max-w-[680px] mx-auto px-6 lg:px-0 py-12 lg:py-16">
        {step === 1 && (
          <Step1
            data={formData}
            onChange={updateFields}
            onNext={() => setStep(2)}
          />
        )}
        {step === 2 && (
          <Step2
            data={formData}
            onChange={updateFields}
            onNext={() => setStep(3)}
          />
        )}
        {step === 3 && (
          <Step3
            data={formData}
            onChange={updateFields}
            onNext={() => setStep(4)}
          />
        )}
        {step === 4 && <Step4 data={formData} />}
      </main>
    </div>
  );
}

function Stepper({ step, total }: { step: number; total: number }) {
  const labels = [
    "Business Basics",
    "Connect Data",
    "Founder Context",
    "Generate Score",
  ];
  return (
    <div className="flex items-center gap-3">
      {Array.from({ length: total }).map((_, i) => {
        const idx = i + 1;
        const active = idx <= step;
        return (
          <div key={i} className="flex-1 flex items-center gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium border transition-colors"
                style={{
                  backgroundColor: active ? "var(--accent)" : "transparent",
                  color: active
                    ? "var(--accent-foreground)"
                    : "var(--text-muted)",
                  borderColor: active ? "var(--accent)" : "var(--border-warm)",
                }}
              >
                {idx}
              </div>
              <div className="hidden md:block text-xs text-[var(--text-secondary)]">
                {labels[i]}
              </div>
            </div>
            {i < total - 1 && (
              <div className="flex-1 h-px bg-[var(--border-warm)]" />
            )}
          </div>
        );
      })}
    </div>
  );
}

function StepCard({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="card-light p-8 md:p-10"
    >
      {children}
    </motion.div>
  );
}

interface StepProps {
  data: OnboardingData;
  onChange: (fields: Partial<OnboardingData>) => void;
  onNext: () => void;
}

function Step1({ data, onChange, onNext }: StepProps) {
  return (
    <StepCard>
      <SectionLabel>Step 01</SectionLabel>
      <h2 className="font-display mt-3 text-3xl">
        Tell us about your business
      </h2>
      <p className="text-sm text-[var(--text-secondary)] mt-2">
        A few baseline details so we can benchmark against comparable
        acquisitions.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onNext();
        }}
        className="mt-8 grid md:grid-cols-2 gap-5"
      >
        <Input
          label="Business Name"
          value={data.businessName}
          onChange={(val) => onChange({ businessName: val })}
        />
        <Select
          label="Industry"
          value={data.industry}
          onChange={(val) => onChange({ industry: val })}
          options={[
            "Beauty & Skincare",
            "Fashion",
            "Health",
            "Electronics",
            "Home",
            "Food",
            "Other",
          ]}
        />
        <Select
          label="Primary Sales Channel"
          value={data.primaryChannel}
          onChange={(val) => onChange({ primaryChannel: val })}
          options={[
            "Shopify",
            "Amazon",
            "WooCommerce",
            "Etsy",
            "Multi-channel",
          ]}
        />
        <Input
          label="Country of Operation"
          value={data.country}
          onChange={(val) => onChange({ country: val })}
        />
        <Select
          label="Monthly Revenue"
          value={data.monthlyRevenue}
          onChange={(val) => onChange({ monthlyRevenue: val })}
          options={["< £10k", "£10k–£25k", "£25k–£50k", "£50k–£100k", "£100k+"]}
        />
        <Select
          label="Business Age"
          value={data.businessAge}
          onChange={(val) => onChange({ businessAge: val })}
          options={[
            "Under 12 months",
            "1–2 years",
            "2–3 years",
            "3–5 years",
            "5+ years",
          ]}
        />
        <div className="md:col-span-2 flex justify-end mt-2">
          <button className="btn-primary" type="submit">
            Continue <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </StepCard>
  );
}

function Step2({ data, onChange, onNext }: StepProps) {
  const toggleSource = (source: string) => {
    const isConnected = data.connectedSources.includes(source);
    const updated = isConnected
      ? data.connectedSources.filter((s) => s !== source)
      : [...data.connectedSources, source];
    onChange({ connectedSources: updated });
  };

  const calculateProgress = () => {
    let score = 20; // base financials upload slot
    if (data.connectedSources.includes("shopify")) score += 30;
    if (data.connectedSources.includes("meta")) score += 15;
    if (data.connectedSources.includes("google")) score += 15;
    if (data.connectedSources.includes("tiktok")) score += 10;
    if (data.connectedSources.includes("snap")) score += 10;
    return Math.min(score, 100);
  };

  const progress = calculateProgress();

  return (
    <StepCard>
      <SectionLabel>Step 02</SectionLabel>
      <h2 className="font-display mt-3 text-3xl">Connect your data sources</h2>
      <p className="text-sm text-[var(--text-secondary)] mt-2">
        The more data you connect, the more accurate your Exit Score.
      </p>

      <div className="mt-8 space-y-6">
        <div>
          <SectionLabel>Store Platform</SectionLabel>
          <div className="mt-3 flex items-center justify-between border border-[var(--border-warm)] rounded-lg px-5 py-4">
            <div>
              <div className="font-medium text-[var(--text-primary)]">
                Shopify
              </div>
              <div className="text-xs text-[var(--text-muted)] mt-1">
                Pulls revenue, orders, products, customers
              </div>
            </div>
            <button
              onClick={() => toggleSource("shopify")}
              className={`btn-ghost-light text-sm ${data.connectedSources.includes("shopify") ? "border-[var(--accent)] text-[var(--accent)]" : ""}`}
            >
              {data.connectedSources.includes("shopify")
                ? "Connected"
                : "Connect"}
            </button>
          </div>
          <p className="mt-2 text-xs text-[var(--text-muted)]">
            Amazon, WooCommerce & others coming soon.
          </p>
        </div>

        <div>
          <SectionLabel>Marketing</SectionLabel>
          <div className="mt-3 grid sm:grid-cols-2 gap-3">
            {[
              { id: "meta", label: "Meta Ads" },
              { id: "google", label: "Google Ads" },
              { id: "tiktok", label: "TikTok Ads" },
              { id: "snap", label: "Snapchat Ads" },
            ].map((p) => {
              const connected = data.connectedSources.includes(p.id);
              return (
                <div
                  key={p.id}
                  className="flex items-center justify-between border border-[var(--border-warm)] rounded-lg px-4 py-3"
                >
                  <span className="text-sm text-[var(--text-primary)]">
                    {p.label}
                  </span>
                  <button
                    onClick={() => toggleSource(p.id)}
                    className={`text-xs ${connected ? "text-[var(--accent)] font-semibold" : "text-[var(--text-secondary)] hover:text-[var(--accent)]"}`}
                  >
                    {connected ? "Connected" : "Connect"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <SectionLabel>Financials</SectionLabel>
          <div className="mt-3 border border-dashed border-[var(--border-warm)] rounded-lg p-8 text-center">
            <p className="text-sm text-[var(--text-secondary)]">
              Drop P&L (CSV / PDF) or{" "}
              <span className="text-[var(--accent)] cursor-pointer">
                browse
              </span>
            </p>
          </div>
        </div>

        <div>
          <SectionLabel>Data Completeness</SectionLabel>
          <div className="mt-3 flex items-center gap-4">
            <ProgressBar value={progress} />
            <span className="font-display text-[var(--accent)] text-xl">
              {progress}%
            </span>
          </div>
          <p className="mt-2 text-xs text-[var(--text-muted)]">
            More connections = more accurate score.
          </p>
        </div>
      </div>

      <div className="mt-10 flex justify-between">
        <button onClick={onNext} className="btn-ghost-light">
          Skip for Now
        </button>
        <button onClick={onNext} className="btn-primary">
          Continue <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </StepCard>
  );
}

function Step3({ data, onChange, onNext }: StepProps) {
  return (
    <StepCard>
      <SectionLabel>Step 03</SectionLabel>
      <h2 className="font-display mt-3 text-3xl">A few final questions</h2>
      <p className="text-sm text-[var(--text-secondary)] mt-2">
        These help our AI assess founder dependency — a key buyer concern.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onNext();
        }}
        className="mt-8 space-y-5"
      >
        <Select
          label="Who currently manages your paid advertising?"
          value={data.paidAdManager}
          onChange={(val) => onChange({ paidAdManager: val })}
          options={["Me", "A team member", "An agency", "No paid ads"]}
        />
        <Select
          label="Who handles supplier relationships?"
          value={data.supplierRelationshipManager}
          onChange={(val) => onChange({ supplierRelationshipManager: val })}
          options={["Me", "A team member", "Automated", "Not applicable"]}
        />
        <Select
          label="Do you have documented SOPs?"
          value={data.hasDocumentedSops}
          onChange={(val) => onChange({ hasDocumentedSops: val })}
          options={["Yes, fully documented", "Partially", "No"]}
        />
        <Select
          label="Are you looking to exit within:"
          value={data.exitTimeframe}
          onChange={(val) => onChange({ exitTimeframe: val })}
          options={["3 months", "6 months", "12 months", "Just exploring"]}
        />
        <div className="flex justify-end pt-2">
          <button className="btn-primary" type="submit">
            Generate My Exit Score <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </StepCard>
  );
}

function Step4({ data }: { data: OnboardingData }) {
  const { user } = useAuth();
  const messages = [
    "Analyzing revenue quality...",
    "Assessing buyer risk factors...",
    "Calculating valuation range...",
    "Building your Exit Score...",
  ];
  const messageCount = messages.length;
  const [i, setI] = useState(0);
  const [done, setDone] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % messageCount), 1500);
    const d = setTimeout(() => setDone(true), 5500);
    return () => {
      clearInterval(t);
      clearTimeout(d);
    };
  }, [messageCount]);

  // Sync to database in background
  useEffect(() => {
    const syncData = async () => {
      if (!isSupabaseConfigured || !user) {
        console.log("Supabase not active, skipping onboarding DB save.");
        return;
      }

      try {
        // Fetch the user's active business record (seeded automatically)
        const { data: businessRecord, error: fetchErr } = await supabase
          .from("businesses")
          .select("id")
          .eq("owner_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (fetchErr) throw fetchErr;

        if (businessRecord) {
          // Update the existing record with real details
          const { error: updateErr } = await supabase
            .from("businesses")
            .update({
              name: data.businessName || "My Business",
              industry: data.industry,
              primary_channel: data.primaryChannel,
              country: data.country || "United Kingdom",
              age: data.businessAge,
              paid_ad_manager: data.paidAdManager,
              supplier_relationship_manager: data.supplierRelationshipManager,
              has_documented_sops: data.hasDocumentedSops,
              exit_timeframe: data.exitTimeframe,
            })
            .eq("id", businessRecord.id);

          if (updateErr) throw updateErr;

          // Parse mapped revenue bounds and exit score
          let exitScoreVal = 62;
          let multiple = 1.6;
          let low = 180000;
          let mid = 220000;
          let high = 260000;

          if (data.monthlyRevenue === "£100k+") {
            exitScoreVal = 75;
            multiple = 2.8;
            low = 1000000;
            mid = 1200000;
            high = 1400000;
          } else if (data.monthlyRevenue === "£50k–£100k") {
            exitScoreVal = 68;
            multiple = 2.2;
            low = 500000;
            mid = 600000;
            high = 700000;
          } else if (data.monthlyRevenue === "< £10k") {
            exitScoreVal = 50;
            multiple = 1.2;
            low = 50000;
            mid = 70000;
            high = 90000;
          }

          // Update valuation metrics in DB
          const { error: valErr } = await supabase
            .from("valuation_data")
            .update({
              exit_score: exitScoreVal,
              current_multiple: multiple,
              valuation_low: low,
              valuation_mid: mid,
              valuation_high: high,
              fair_market: mid,
              optimised: Math.round(mid * 1.5),
              value_gap: Math.round(mid * 1.5 - mid),
            })
            .eq("business_id", businessRecord.id);

          if (valErr) throw valErr;
        }
      } catch (err) {
        console.error("Failed to sync onboarding details in background:", err);
      }
    };

    syncData();
  }, [
    user,
    data.businessAge,
    data.businessName,
    data.country,
    data.exitTimeframe,
    data.hasDocumentedSops,
    data.industry,
    data.monthlyRevenue,
    data.paidAdManager,
    data.primaryChannel,
    data.supplierRelationshipManager,
  ]);

  return (
    <div className="card-dark p-12 md:p-16 text-center">
      {!done ? (
        <>
          <div className="flex justify-center">
            <ScoreRing score={62} size={160} />
          </div>
          <p className="mt-10 text-[var(--text-on-dark)] text-lg font-display">
            {messages[i]}
          </p>
          <p className="mt-3 text-xs text-[var(--text-on-dark-secondary)] tracking-[0.18em] uppercase">
            This usually takes 5–10 seconds
          </p>
        </>
      ) : (
        <>
          <h3 className="font-display text-3xl text-[var(--text-on-dark)]">
            Your Exit Score is ready.
          </h3>
          <p className="mt-3 text-sm text-[var(--text-on-dark-secondary)]">
            We've identified £80k of value left on the table.
          </p>
          <button
            onClick={() => navigate({ to: "/app/dashboard" })}
            className="btn-primary mt-8"
          >
            View My Dashboard <ArrowRight className="w-4 h-4" />
          </button>
        </>
      )}
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="label-caps" style={{ fontSize: 10 }}>
        {label}
      </span>
      <input
        type={type}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full bg-transparent border border-[var(--border-warm)] rounded-md px-3.5 py-2.5 text-sm focus:outline-none focus:border-[var(--accent)] text-[var(--text-primary)]"
      />
    </label>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: string[];
}) {
  return (
    <label className="block">
      <span className="label-caps" style={{ fontSize: 10 }}>
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full bg-transparent border border-[var(--border-warm)] rounded-md px-3.5 py-2.5 text-sm focus:outline-none focus:border-[var(--accent)] text-[var(--text-primary)]"
      >
        {options.map((o) => (
          <option key={o} value={o} className="bg-[var(--bg-primary)]">
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}
