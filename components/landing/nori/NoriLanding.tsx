import Image from "next/image";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { XLogo } from "@phosphor-icons/react/ssr";

import crewArtwork from "@/assets/nori/crew-row-slate.webp";
import heading from "../HeadingAccent.module.css";
import { InvitationWaitlistForm } from "../paper/InvitationWaitlistForm";
import { PaperCrew } from "../paper/PaperCrew";
import { PaperFeatures } from "../paper/PaperFeatures";
import { LandingStudioCrew } from "./LandingCrewAccents";
import { LandingChatSection } from "./LandingChatSection";
import { LandingHeroScene } from "./LandingHeroScene";
import { LandingSectionScene } from "./LandingSectionScene";
// import { LandingMessagesPreview } from "./LandingMessagesPreview";
import { LandingTownDemo } from "./LandingTownDemo";
import { LandingWorkflowRail } from "./LandingWorkflowRail";
import { LandingNavigation } from "./LandingNavigation";
import styles from "./NoriLanding.module.css";

const workflowTools = [
  { name: "Slack", logo: "slack.svg" },
  { name: "Datadog", logo: "datadog.svg" },
  { name: "Linear", logo: "linear.svg" },
  { name: "GitHub", logo: "github.svg" },
  { name: "AWS", logo: "aws.svg" },
  { name: "Google Cloud", logo: "google-cloud.svg" },
  { name: "Cloudflare", logo: "cloudflare.svg" },
];

function Brand() {
  return (
    <a aria-label="Desa home" className={styles.brand} href="/">
      <Image alt="" src="/brand/desa-horizontal-light-512.webp" width={512} height={183} sizes="144px" />
    </a>
  );
}

export function NoriLanding() {
  return (
    <>
      <LandingNavigation brand={<Brand />} />

      <main id="main-content" tabIndex={-1}>
        <section aria-labelledby="hero-title" className={styles.hero}>
          <div className={styles.heroIntro}>
            <LandingHeroScene />
            <div className={styles.heroCopy}>
              <h1 id="hero-title">A town for your coding agents.<br /><span className={heading.accent}>From anywhere.</span></h1>
              <p className={styles.heroLead}>Run <span className={styles.inlineAgent}><Image alt="" src="/logos/openai.svg" width={14} height={14} unoptimized />Codex</span>, <span className={styles.inlineAgent}><Image alt="" src="/logos/claude.svg" width={14} height={14} unoptimized />Claude Code</span>, or <span className={styles.inlineAgent}><Image alt="" className={styles.piLogo} src="/logos/pi.svg" width={14} height={14} unoptimized />Pi</span> in a managed cloud workspace configured for your repo and tools.<br />Start and steer work from the apps you already use.</p>
              <div aria-label="Start and steer from" className={styles.integrationItems} role="group">
                <span aria-label="Slack" className={styles.integrationIcon} role="img"><Image alt="" src="/logos/slack.svg" width={20} height={20} unoptimized /></span>
                <span aria-label="Grok Bot" className={styles.integrationIcon} data-integration="Grok Bot" role="img"><Image alt="" src="/logos/grok-bot.png" width={20} height={20} /></span>
                <span aria-label="Instinct" className={styles.integrationIcon} data-integration="Instinct" role="img"><Image alt="" src="/logos/instinct.svg" width={20} height={20} unoptimized /></span>
                <span aria-label="Muse" className={styles.integrationIcon} data-integration="Muse" role="img"><Image alt="" src="/logos/muse.webp" width={20} height={20} unoptimized /></span>
              </div>
              <div className={styles.heroActions}>
                <a className={styles.button} href="#waitlist">Request early access <ArrowUpRight aria-hidden="true" size={20} /></a>
                <a className={styles.textLink} href="#workflow-overview">See how it works <ArrowDown aria-hidden="true" size={17} /></a>
              </div>
            </div>
          </div>
          <div className={styles.productFrame}><LandingTownDemo /></div>
        </section>

        <section aria-labelledby="workflow-overview-title" className={styles.workflowOverview} id="workflow-overview" tabIndex={-1}>
          <h2 id="workflow-overview-title">
            An <span className={heading.accent}>interactive map</span> of your <span className={heading.accent}>cloud workspace</span>.<br />
            A town for your <span className={heading.accent}>agents</span>.
          </h2>
          <LandingWorkflowRail tools={workflowTools} />
        </section>

        <div className={styles.featureSections}>
          {/* Messages section is temporarily disabled.
          <section aria-labelledby="messages-title" className={styles.messagesSection} id="messages">
            <header className={styles.messagesHeading}>
              <h2 id="messages-title">Message your agents<br />like coworkers.</h2>
              <p>Give Nori a task or work with any crewmate directly. Return to the same conversation to review results and ask for changes.</p>
            </header>
            <LandingMessagesPreview />
          </section>
          */}
          <LandingSectionScene scene="crew"><PaperCrew /></LandingSectionScene>
          <LandingChatSection />
          <LandingSectionScene scene="features"><PaperFeatures /></LandingSectionScene>
        </div>

        <section aria-labelledby="invitation-title" className={styles.invitation} id="waitlist" tabIndex={-1}>
          <div className={styles.invitationCopy}>
            <h2 id="invitation-title">Your town is waiting.</h2>
            <p>Private beta access is rolling out in waves. We’ll email you next steps.</p>
            <InvitationWaitlistForm appearance="nori" />
          </div>
          <div aria-hidden="true" className={`${styles.invitationArtwork} ${styles.slateCrew}`}>
            <Image alt="" draggable={false} sizes="(max-width: 1312px) 100vw, 1216px" src={crewArtwork} />
          </div>
          <LandingStudioCrew />
        </section>
      </main>

      <LandingSectionScene scene="harbor">
        <footer className={styles.footer}>
          <div className={styles.footerTop}><Brand /><a className={styles.textLink} href="#main-content">Back to top <ArrowUpRight aria-hidden="true" size={17} /></a></div>
          <div className={styles.footerBottom}>
            <small>© 2026 Desa</small>
            <nav aria-label="Footer navigation">
              <a href="mailto:alec@joindesa.com">Contact <ArrowUpRight aria-hidden="true" size={15} /></a>
              <a aria-label="Desa on X" className={styles.socialLink} href="https://x.com/joindesa" rel="noreferrer" target="_blank" title="Desa on X">
                <XLogo aria-hidden="true" focusable="false" size={20} />
              </a>
            </nav>
          </div>
        </footer>
      </LandingSectionScene>
    </>
  );
}
