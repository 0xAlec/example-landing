import { PaperFeatureGraphic, type PaperFeatureGraphicVariant } from "./PaperFeatureGraphic";
import section from "./PaperSections.module.css";
import styles from "./PaperFeatures.module.css";

type Feature = {
  title: string;
  body: string;
  graphic: PaperFeatureGraphicVariant;
};

const features: readonly Feature[] = [
  {
    title: "Cloud sandboxes that scale with you",
    body: "Each agent can take on multiple tasks at once. As you add work across your crew, Desa adds an isolated cloud sandbox for every task, so your agents can build and test in parallel.",
    graphic: "sandboxes",
  },
  {
    title: "Bring your own subscription",
    body: "Use the subscription you already pay for to run your AI coworkers in the cloud. One connected account can support multiple agents working together.",
    graphic: "subscription",
  },
  {
    title: "Tools and skills for every coworker",
    body: "Give each coworker the tools, skills, and instructions it needs. Shape your crew around the way your team works.",
    graphic: "tools",
  },
  {
    title: "A remote control for your crew",
    body: "Connect your tools to Desa through MCP. Ask Codex, Grok Bot, or another connected assistant to start cloud runs, check progress, and bring back the results.",
    graphic: "mcp",
  },
];

export function PaperFeatures() {
  return (
    <section aria-labelledby="paper-features-title" className={section.section} id="features">
      <header className={section.heading}>
        <h2 id="paper-features-title">Features</h2>
      </header>
      <ul aria-label="Desa capabilities" className={styles.grid}>
        {features.map(({ title, body, graphic }) => (
          <li className={styles.feature} key={title}>
            <div className={styles.graphic}>
              <PaperFeatureGraphic variant={graphic} />
            </div>
            <div className={styles.featureHeading}>
              <h3>{title}</h3>
            </div>
            <p>{body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default PaperFeatures;
