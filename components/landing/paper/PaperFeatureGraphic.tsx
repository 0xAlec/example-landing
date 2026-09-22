import Image from "next/image";
import {
  Binoculars,
  CheckCircle,
  ClockCountdown,
  Compass,
  CurrencyDollar,
  Database,
  FileText,
  GitDiff,
  MagnifyingGlass,
  Monitor,
  ShieldCheck,
  ShootingStar,
  UserCircleCheck,
} from "@phosphor-icons/react/ssr";
import {
  CpuIcon as ModelCategoryIcon,
  GaugeIcon as ReasoningCategoryIcon,
  Layers3Icon as SkillsCategoryIcon,
} from "lucide-react";

import mossPortrait from "@/public/portraits/agents/moss-loose-ink-v1.webp";
import noriPortrait from "@/public/portraits/agents/nori-loose-ink-v1.webp";
import piperPortrait from "@/public/portraits/agents/piper-loose-ink-v1.webp";

import styles from "./PaperFeatureGraphic.module.css";
import { PaperFeatureMotion } from "./PaperFeatureMotion";
import { PaperImprovementGraphic } from "./PaperImprovementGraphic";
import { CloudSandboxesGraphic, SubscriptionGraphic } from "./PaperCloudFeatureGraphic";
import { CoworkerToolsGraphic, LocalOrchestrationGraphic } from "./PaperCrewFeatureGraphic";

export type PaperFeatureGraphicVariant =
  | "automations"
  | "customization"
  | "improvement"
  | "mcp"
  | "orchestration"
  | "sandboxes"
  | "subscription"
  | "tools"
  | "visibility";

type PaperFeatureGraphicProps = {
  variant: PaperFeatureGraphicVariant;
};

const graphicLabels: Record<PaperFeatureGraphicVariant, string> = {
  automations:
    "A weekday release automation collects Linear issues, checks Datadog, opens tested GitHub work, and posts a verified Slack summary",
  customization:
    "Three controls combine model, reasoning, and skill settings into a custom agent profile",
  improvement:
    "A small green point marks an ascent across layered contour lines",
  mcp:
    "A carousel of Codex, Claude Code, Slack, Poke, Instinct, and Grok Bot logos acts as a remote control for a cloud crew through MCP. Piper handles a billing fix, Moss runs API tests, and Quill writes release notes. Highlights trace work to the agents and results back to the connected tools. With reduced motion, all six logos remain still",
  orchestration:
    "Nori assigns a backend fix to Piper, Moss reviews it in a nested reply, and Nori tags Alec for approval",
  sandboxes:
    "A carousel shows Piper, Moss, and Kiko in turn. Each agent takes on three tasks in parallel. Lines connect the same agent to each task and its own isolated cloud sandbox, with separate files and a terminal",
  subscription:
    "A carousel of Codex, Claude Code, Cursor, and Devin logos connects to the full Desa crew below: Nori, Moss, Quill, Piper, and Kiko. With reduced motion, all four logos remain still",
  tools:
    "Tools and skill cards attach to a central coworker, with plus signs changing to check marks and a custom instruction added below. The graphic cycles through Piper with API design and testing, Moss with code review and security, and Kiko with UI polish and accessibility",
  visibility:
    "Release run 248 shows its repository permission, budget use, verification evidence, and Alec's approval",
};

function AutomationsGraphic() {
  return (
    <div
      aria-hidden="true"
      className={styles.canvas}
      data-variant="automations"
    >
      <div className={styles.automationOrbit}>
        <span className={styles.automationOrbitRing} />
        <span className={styles.automationOrbiters}>
          <span
            className={styles.automationOrbiter}
            data-automation-brand="linear"
          >
            <i>
              <Image alt="" height={24} src="/logos/linear.svg" width={24} />
            </i>
          </span>
          <span
            className={styles.automationOrbiter}
            data-automation-brand="datadog"
          >
            <i>
              <Image alt="" height={24} src="/logos/datadog.svg" width={24} />
            </i>
          </span>
          <span
            className={styles.automationOrbiter}
            data-automation-brand="github"
          >
            <i>
              <Image alt="" height={24} src="/logos/github.svg" width={24} />
            </i>
          </span>
          <span
            className={styles.automationOrbiter}
            data-automation-brand="slack"
          >
            <i>
              <Image alt="" height={24} src="/logos/slack.svg" width={24} />
            </i>
          </span>
        </span>
      </div>

      <span className={styles.automationHub}>
        <svg
          aria-hidden="true"
          className={styles.automationHubProgress}
          viewBox="0 0 100 100"
        >
          <circle
            className={styles.automationHubProgressTrack}
            cx="50"
            cy="50"
            r="47"
          />
          <circle
            className={styles.automationHubProgressFill}
            cx="50"
            cy="50"
            pathLength="1"
            r="47"
          />
        </svg>

        <span className={styles.automationHubDial}>
          <span className={styles.automationHubSchedule}>
            <small>Mon–Fri</small>
            <span className={styles.automationHubTime}>
              <ClockCountdown weight="duotone" />
              <b>09:00</b>
            </span>
            <em>Release check</em>
          </span>

          <CheckCircle className={styles.automationHubComplete} weight="fill" />
        </span>
      </span>
    </div>
  );
}

function OrchestrationGraphic() {
  return (
    <div
      aria-hidden="true"
      className={styles.canvas}
      data-variant="orchestration"
    >
      <svg
        className={styles.orchestrationRail}
        preserveAspectRatio="none"
        viewBox="0 0 488 271"
      >
        <path d="M287 42h35v45" data-rail-step="build" pathLength="1" />
        <path d="M201 110h-42v44" data-rail-step="review" pathLength="1" />
        <path d="M297 178h40v33" data-rail-step="resolve" pathLength="1" />
      </svg>

      <div className={styles.threadWindow}>
        <div className={styles.threadBody}>
          <div
            className={styles.threadMessage}
            data-role="coordinator"
            data-turn="brief"
          >
            <span className={styles.agentAvatar} data-agent="nori">
              <Image alt="" height={64} src={noriPortrait} width={64} />
            </span>
            <span className={styles.threadCopy}>
              <span className={styles.threadMeta}>
                <b>Nori</b>
                <em>
                  <Compass aria-hidden="true" />
                  Mayor
                </em>
                <time>9:41</time>
              </span>
              <span className={styles.threadText}>
                Piper, ship the billing fix. Moss, verify it.
              </span>
            </span>
          </div>

          <div className={styles.threadReplies} data-thread-branch="root">
            <div className={styles.threadReply} data-reply="build">
              <div
                className={styles.threadMessage}
                data-role="backend"
                data-turn="build"
              >
                <span className={styles.agentAvatar} data-agent="piper">
                  <Image alt="" height={64} src={piperPortrait} width={64} />
                </span>
                <span className={styles.threadCopy}>
                  <span className={styles.threadMeta}>
                    <b>Piper</b>
                    <em>
                      <Database aria-hidden="true" />
                      Backend
                    </em>
                    <time>9:46</time>
                  </span>
                  <span className={styles.threadText}>
                    Patch is ready. Tests are green.
                  </span>
                </span>
              </div>

              <div className={styles.threadReplies} data-thread-branch="review">
                <div className={styles.threadReply} data-reply="review">
                  <div
                    className={styles.threadMessage}
                    data-role="reviewer"
                    data-turn="review"
                  >
                    <span className={styles.agentAvatar} data-agent="moss">
                      <Image alt="" height={64} src={mossPortrait} width={64} />
                    </span>
                    <span className={styles.threadCopy}>
                      <span className={styles.threadMeta}>
                        <b>Moss</b>
                        <em>
                          <ShieldCheck aria-hidden="true" />
                          Reviewer
                        </em>
                        <time>9:49</time>
                      </span>
                      <span className={styles.threadText}>
                        Reviewed. Evidence is attached.
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.threadReply} data-reply="resolve">
              <div
                className={styles.threadMessage}
                data-role="coordinator"
                data-turn="resolve"
              >
                <span className={styles.agentAvatar} data-agent="nori">
                  <Image alt="" height={64} src={noriPortrait} width={64} />
                </span>
                <span className={styles.threadCopy}>
                  <span className={styles.threadMeta}>
                    <b>Nori</b>
                    <em>
                      <Compass aria-hidden="true" />
                      Mayor
                    </em>
                    <CheckCircle className={styles.threadDone} weight="fill" />
                  </span>
                  <span className={styles.threadText}>
                    <span className={styles.humanMention}>@Alec</span>, the
                    release is ready for approval.
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function VisibilityGraphic() {
  return (
    <div aria-hidden="true" className={styles.canvas} data-variant="visibility">
      <svg
        className={styles.scenarioRail}
        preserveAspectRatio="none"
        viewBox="0 0 488 271"
      >
        <g className={styles.visibilityRailBase}>
          <path d="M244 75v16H127v12" pathLength="1" />
          <path d="M244 75v16h117v12" pathLength="1" />
          <path d="M127 157v33" pathLength="1" />
          <path d="M361 157v33" pathLength="1" />
        </g>
        <g className={styles.visibilityRailFlow}>
          <path
            d="M244 75v16H127v12"
            data-visibility-step="permissions"
            pathLength="1"
          />
          <path
            d="M244 75v16h117v12"
            data-visibility-step="cost"
            pathLength="1"
          />
          <path
            d="M127 157v33"
            data-visibility-step="evidence"
            pathLength="1"
          />
          <path
            d="M361 157v33"
            data-visibility-step="decision"
            pathLength="1"
          />
        </g>
      </svg>

      <span className={`${styles.scenarioCard} ${styles.runRecordCard}`}>
        <i>
          <FileText weight="duotone" />
        </i>
        <span>
          <small>Release run · #248</small>
          <b>Billing fix ready</b>
        </span>
        <CheckCircle weight="fill" />
      </span>
      <span
        className={`${styles.scenarioCard} ${styles.visibilityScenarioCard}`}
        data-visibility-step="permissions"
      >
        <i>
          <ShieldCheck weight="duotone" />
        </i>
        <span>
          <small>Permissions</small>
          <b>Repo write · 1 hour</b>
        </span>
        <CheckCircle weight="fill" />
      </span>
      <span
        className={`${styles.scenarioCard} ${styles.visibilityScenarioCard}`}
        data-visibility-step="cost"
      >
        <i>
          <CurrencyDollar weight="duotone" />
        </i>
        <span>
          <small>Cost</small>
          <b>$1.84 of $5.00</b>
        </span>
        <CheckCircle weight="fill" />
      </span>
      <span
        className={`${styles.scenarioCard} ${styles.visibilityScenarioCard}`}
        data-visibility-step="evidence"
      >
        <i>
          <FileText weight="duotone" />
        </i>
        <span>
          <small>Evidence</small>
          <b>3 checks passed</b>
        </span>
        <CheckCircle weight="fill" />
      </span>
      <span
        className={`${styles.scenarioCard} ${styles.visibilityScenarioCard}`}
        data-visibility-step="decision"
      >
        <i>
          <UserCircleCheck weight="duotone" />
        </i>
        <span>
          <small>Decision</small>
          <b>Alec approved</b>
        </span>
        <CheckCircle weight="fill" />
      </span>
    </div>
  );
}

function CustomizationReasoningIcon({ label }: { label: string }) {
  if (label === "Medium") return <Compass weight="duotone" />;
  if (label === "High") return <Binoculars weight="duotone" />;
  return <ShootingStar weight="duotone" />;
}

function CustomizationSkillIcon({ label }: { label: string }) {
  if (label === "review.md") return <MagnifyingGlass weight="duotone" />;
  if (label === "parallel.md") return <GitDiff weight="duotone" />;
  return <Monitor weight="regular" />;
}

function CustomizationGraphic() {
  const reels = [
    {
      icon: ModelCategoryIcon,
      id: "model",
      items: [
        {
          detail: "Efficient, high-volume work",
          label: "GPT-5.6 Luna",
          model: "gpt-5.6-luna",
        },
        {
          detail: "Balances intelligence and cost",
          label: "GPT-5.6 Terra",
          model: "gpt-5.6-terra",
        },
        {
          detail: "Complex reasoning and coding",
          label: "GPT-5.6 Sol",
          model: "gpt-5.6-sol",
        },
      ],
      label: "Model",
    },
    {
      icon: ReasoningCategoryIcon,
      id: "reasoning",
      items: [
        { detail: "Balanced depth and speed", label: "Medium", model: null },
        { detail: "Complex implementation", label: "High", model: null },
        {
          detail: "Difficult or ambiguous tasks",
          label: "Extra high",
          model: null,
        },
      ],
      label: "Reasoning",
    },
    {
      icon: SkillsCategoryIcon,
      id: "skill",
      items: [
        {
          detail: "Review changes against standards",
          label: "review.md",
          model: null,
        },
        {
          detail: "Delegate focused work",
          label: "parallel.md",
          model: null,
        },
        {
          detail: "Polish layout and interaction",
          label: "ui-craft.md",
          model: null,
        },
      ],
      label: "Skill",
    },
  ] as const;

  return (
    <div
      aria-hidden="true"
      className={styles.canvas}
      data-variant="customization"
    >
      <div className={styles.customizationCarousel}>
        <div className={styles.customizationReels}>
          {reels.map((reel) => {
            const CategoryIcon = reel.icon;
            const items = [...reel.items, ...reel.items, ...reel.items];

            return (
              <div
                className={styles.customizationReel}
                data-customization-reel={reel.id}
                key={reel.id}
              >
                <span className={styles.customizationReelLabel}>
                  <i>
                    <CategoryIcon aria-hidden="true" />
                  </i>
                  <b>{reel.label}</b>
                </span>
                <div className={styles.customizationReelWindow}>
                  <div className={styles.customizationReelTrack}>
                    {items.map((item, index) => (
                      <span
                        className={styles.customizationReelItem}
                        key={`${reel.id}-${item.label}-${index}`}
                      >
                        <span
                          className={styles.customizationItemMark}
                          data-kind={reel.id}
                          data-reasoning-level={
                            reel.id === "reasoning" ? item.label : undefined
                          }
                          data-skill={
                            reel.id === "skill" ? item.label : undefined
                          }
                        >
                          {item.model ? (
                            <span
                              className={styles.modelProviderMark}
                              data-model={item.model}
                              data-provider="openai"
                            />
                          ) : reel.id === "reasoning" ? (
                            <CustomizationReasoningIcon label={item.label} />
                          ) : (
                            <CustomizationSkillIcon label={item.label} />
                          )}
                        </span>
                        <span>
                          <b>{item.label}</b>
                          <small>{item.detail}</small>
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const graphicByVariant = {
  automations: AutomationsGraphic,
  customization: CustomizationGraphic,
  improvement: PaperImprovementGraphic,
  mcp: LocalOrchestrationGraphic,
  orchestration: OrchestrationGraphic,
  sandboxes: CloudSandboxesGraphic,
  subscription: SubscriptionGraphic,
  tools: CoworkerToolsGraphic,
  visibility: VisibilityGraphic,
} satisfies Record<PaperFeatureGraphicVariant, () => React.ReactNode>;

export function PaperFeatureGraphic({ variant }: PaperFeatureGraphicProps) {
  const Graphic = graphicByVariant[variant];

  return (
    <PaperFeatureMotion
      className={styles.graphic}
      label={graphicLabels[variant]}
    >
      <Graphic />
    </PaperFeatureMotion>
  );
}

export default PaperFeatureGraphic;
