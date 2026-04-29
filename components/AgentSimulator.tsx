"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Rocket, Sparkles, Wand2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type Stage = "Planning" | "Tool Selection" | "Execution" | "Review & Output";

type SimulationStep = {
  stage: Stage;
  title: string;
  description: string;
  artifacts: string[];
};

type GoalPreset = {
  label: string;
  goal: string;
};

const GOAL_PRESETS: GoalPreset[] = [
  {
    label: "Coding",
    goal: "Build a full-stack productivity dashboard and deploy it",
  },
  {
    label: "Workflow",
    goal: "Automate weekly content planning from Notion → Calendar → Slack",
  },
  {
    label: "Personal",
    goal: "Triage my inbox daily and schedule follow-ups automatically",
  },
];

function detectGoalType(goal: string) {
  // Lightweight intent detection to vary the mock workflow for coding vs automation vs personal goals.
  const g = goal.toLowerCase();
  const coding =
    g.includes("deploy") ||
    g.includes("repo") ||
    g.includes("api") ||
    g.includes("next") ||
    g.includes("react") ||
    g.includes("dashboard") ||
    g.includes("code") ||
    g.includes("pr") ||
    g.includes("bug");
  const workflow =
    g.includes("zapier") ||
    g.includes("n8n") ||
    g.includes("notion") ||
    g.includes("slack") ||
    g.includes("calendar") ||
    g.includes("automation") ||
    g.includes("workflow");
  const personal =
    g.includes("inbox") ||
    g.includes("email") ||
    g.includes("schedule") ||
    g.includes("meetings") ||
    g.includes("tasks") ||
    g.includes("follow-up") ||
    g.includes("personal");

  if (coding && !workflow) return "coding";
  if (workflow && !coding) return "workflow";
  if (personal && !coding) return "personal";
  if (coding) return "coding";
  if (workflow) return "workflow";
  return "personal";
}

function buildMockSteps(goal: string): SimulationStep[] {
  const normalized = goal.trim();
  const goalLabel = normalized.length > 0 ? normalized : "your goal";
  const goalType = detectGoalType(goalLabel);

  const toolHints =
    goalType === "coding"
      ? ["Cursor", "Claude Code", "Windsurf", "GitHub", "CI"]
      : goalType === "workflow"
        ? ["n8n", "Zapier Agents", "Make.com", "Slack", "Notion"]
        : ["Lindy", "Manus", "Notion AI", "Calendar", "Email"];

  return [
    {
      stage: "Planning",
      title: "Break the goal into an executable plan",
      description: `Agent decomposes "${goalLabel}" into milestones, constraints, and success criteria.`,
      artifacts: ["Milestones", "Constraints", "Success criteria", "Risk checkpoints"],
    },
    {
      stage: "Tool Selection",
      title: "Choose the smallest reliable toolchain",
      description:
        "Agent picks tools, validates permissions, and defines guardrails (what can run unattended vs. requires approval).",
      artifacts: ["Tool shortlist", ...toolHints.slice(0, 3), "Approval gates"],
    },
    {
      stage: "Execution",
      title: "Execute with guardrails",
      description:
        "Agent runs the steps, captures outputs, and pauses only for high-impact decisions.",
      artifacts:
        goalType === "coding"
          ? ["Branch created", "Changes applied", "Tests executed", "PR opened"]
          : goalType === "workflow"
            ? ["Connections validated", "Automation configured", "Dry run passed", "Monitoring enabled"]
            : ["Inbox triaged", "Draft replies", "Follow-ups scheduled", "Daily summary"],
    },
    {
      stage: "Review & Output",
      title: "Review, ship, and summarize",
      description:
        "Agent provides a concise review: what shipped, what changed, and what to do next to keep it healthy.",
      artifacts: ["Outcome delivered", "Change log", "Next actions", "1-click rerun"],
    },
  ];
}

function stageMeta(stage: Stage) {
  switch (stage) {
    case "Planning":
      return { icon: Sparkles, accent: "text-[color:var(--primary)]", badge: "cyan" as const };
    case "Tool Selection":
      return { icon: Wand2, accent: "text-[color:var(--secondary)]", badge: "orange" as const };
    case "Execution":
      return { icon: Rocket, accent: "text-[color:var(--primary)]", badge: "cyan" as const };
    case "Review & Output":
      return { icon: CheckCircle2, accent: "text-[color:var(--secondary)]", badge: "orange" as const };
  }
}

export function AgentSimulator({ initialGoal }: { initialGoal?: string }) {
  const [goal, setGoal] = React.useState(() => initialGoal ?? GOAL_PRESETS[0].goal);
  const [steps, setSteps] = React.useState<SimulationStep[]>([]);
  const [isRunning, setIsRunning] = React.useState(false);
  const [isComplete, setIsComplete] = React.useState(false);

  async function runSimulation() {
    if (isRunning) return;
    setIsRunning(true);
    setSteps([]);
    setIsComplete(false);

    const built = buildMockSteps(goal);
    for (let i = 0; i < built.length; i += 1) {
      await new Promise((r) => setTimeout(r, 260));
      setSteps((prev) => [...prev, built[i]]);
    }

    setIsRunning(false);
    setIsComplete(true);
    window.setTimeout(() => setIsComplete(false), 1100);
  }

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(to_right,transparent,rgba(255,107,0,0.70),rgba(0,240,255,0.72),transparent)]" />
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <CardTitle className="text-xl">Try the Agent Simulator</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              A premium, feel-good demo of how agentic workflows plan → use tools → execute → ship results.
            </p>
          </div>
          <Badge variant="default" className="w-fit">
            Mock demo • no sign-in
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-3">
            <label className="text-sm font-medium" htmlFor="goal">
              Your goal
            </label>
            <div className="flex flex-col gap-3">
              <textarea
                id="goal"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g., Build a full-stack productivity dashboard and deploy it"
                className={cn(
                  "min-h-[90px] w-full resize-none rounded-xl bg-transparent px-4 py-3 text-sm shadow-[inset_0_0_0_1px_var(--color-input)] outline-none transition focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                )}
              />
              <div className="flex flex-wrap gap-2">
                {GOAL_PRESETS.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => setGoal(p.goal)}
                    className="rounded-full bg-white/5 px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-[inset_0_0_0_1px_rgba(255,255,255,0.14)] transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {p.label} example
                  </button>
                ))}
              </div>
              <Button
                onClick={runSimulation}
                disabled={goal.trim().length === 0 || isRunning}
                className="h-11"
              >
                {isRunning ? "Simulating…" : "Simulate Agent Workflow"}
              </Button>
            </div>

            <div className="rounded-[var(--radius)] bg-white/[0.03] p-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.10)]">
              <div className="flex flex-wrap gap-2">
                <Badge variant="cyan">Planning</Badge>
                <Badge variant="default">Tool Selection</Badge>
                <Badge variant="cyan">Execution</Badge>
                <Badge variant="default">Review & Output</Badge>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                Pro tip: great agents are boringly reliable. They keep autonomy high, but move risk into checkpoints.
              </p>
            </div>
          </div>

          <div className="relative rounded-[var(--radius)] bg-white/[0.03] p-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.10)]">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Workflow Timeline</p>
              <p className="text-xs text-muted-foreground tabular-nums">
                {steps.length}/4
              </p>
            </div>
            <Separator className="my-4 opacity-80" />

            <AnimatePresence>
              {isComplete ? (
                <motion.div
                  key="boom"
                  initial={{ opacity: 0, scale: 0.96, y: 6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 1.02, y: -8 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  className="pointer-events-none absolute inset-0 grid place-items-center"
                  aria-hidden
                >
                  <div className="relative">
                    <div className="absolute inset-[-38px] rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(0,240,255,0.35),transparent_60%),radial-gradient(circle_at_70%_70%,rgba(255,107,0,0.28),transparent_60%)] blur-2xl" />
                    <div className="relative rounded-3xl bg-card/70 px-6 py-3 text-center shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]">
                      <div className="text-3xl font-semibold tracking-tight">
                        Boom<span className="text-[color:var(--secondary)]">!</span>
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        Workflow completed
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>

            <div className="space-y-3">
              <AnimatePresence initial={false}>
                {steps.map((s) => {
                  const meta = stageMeta(s.stage);
                  const Icon = meta.icon;
                  return (
                    <motion.div
                      key={s.stage}
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.98 }}
                      transition={{ duration: 0.22, ease: "easeOut" }}
                      className="rounded-2xl bg-card/70 p-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.10)]"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div
                            className={cn(
                              "mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.14)]",
                              meta.accent
                            )}
                            aria-hidden
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-semibold tracking-tight">{s.stage}</p>
                              <Badge variant={meta.badge}>{s.title}</Badge>
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">{s.description}</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {s.artifacts.map((a) => (
                          <Badge key={a} variant="default" className="bg-white/[0.04]">
                            {a}
                          </Badge>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {steps.length === 0 ? (
                <div className="rounded-2xl bg-card/40 p-5 text-sm text-muted-foreground shadow-[inset_0_0_0_1px_rgba(255,255,255,0.10)]">
                  Enter a goal and hit “Simulate Agent Workflow” to watch the steps appear.
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
