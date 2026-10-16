import { CopyPromptButton } from "@/components/CopyPromptButton";

const steps = [
  {
    number: "01",
    title: "Connect your inbox",
    text: "Connect Microsoft Outlook securely, or explore the sample inbox without signing in.",
  },
  {
    number: "02",
    title: "Choose your boundaries",
    text: "Review incoming messages and edit a suggested reply before saving it as a draft.",
  },
  {
    number: "03",
    title: "Review every draft",
    text: "Replies are saved as drafts in Outlook. You decide if and when to send them.",
  },
];

export default function Home() {
  return (
    <main>
      <header className="topbar">
        <a className="brand" href="/" aria-label="Inbox Assistant home">
          <span className="brand-mark" aria-hidden="true">i</span>
          <span>inbox assistant</span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#how-it-works">How it works</a>
          <a className="github-link" href="https://github.com/Nathan200000000/inbox-assistant" target="_blank" rel="noreferrer">
            GitHub <span aria-hidden="true">↗</span>
          </a>
        </nav>
      </header>

      <section className="hero page-width">
        <div className="hero-copy">
          <p className="eyebrow"><span className="live-dot" /> YOUR INBOX, ON YOUR TERMS</p>
          <h1>Thoughtful replies.<br /><span>On your time.</span></h1>
          <p className="lead">
            A focused email workspace with a live Outlook connection and a sample inbox you can explore instantly. Find messages, edit thoughtful replies, and save drafts for your review.
          </p>
          <div className="hero-actions">
            <CopyPromptButton className="button button-primary" />
            <a className="button button-secondary" href="/app">Try the interactive demo ↗</a>
            <a className="button button-secondary" href="#how-it-works">See how it works <span aria-hidden="true">↓</span></a>
          </div>
          <p className="privacy-line"><span aria-hidden="true">✓</span> Drafts only. Nothing is sent without your approval.</p>
        </div>

        <div className="inbox-preview" aria-label="Illustration of a reply draft waiting for review">
          <div className="preview-head">
            <div><span className="eyebrow">INBOX ASSISTANT</span><h2>Your review queue</h2></div>
            <span className="queue-count">1 draft</span>
          </div>
          <div className="message">
            <div className="avatar" aria-hidden="true">JL</div>
            <div className="message-main">
              <div className="message-meta"><strong>Jordan Lee</strong><span>Today, 9:14 AM</span></div>
              <p className="subject">Revised project timeline</p>
              <p className="excerpt">Could you take a look at the revised timeline and let me know if Friday still works?</p>
            </div>
            <span className="needs-reply">Needs reply</span>
          </div>
          <div className="draft">
            <div className="draft-heading"><span>REPLY DRAFT</span><span className="saved"><i /> Saved in Drafts</span></div>
            <p>Friday works for me. I’ll review the timeline before our check-in and flag anything that needs discussion.</p>
            <div className="draft-footer"><span>Review or edit in your mailbox</span><span className="arrow">↗</span></div>
          </div>
          <div className="preview-note"><span aria-hidden="true">↳</span> Nothing gets sent automatically</div>
        </div>
      </section>

      <section className="promise-bar" aria-label="How it works">
        <div><span>01</span> Your own connected inbox</div>
        <div><span>02</span> Replies saved as drafts</div>
        <div><span>03</span> Schedule you choose</div>
      </section>

      <section className="how page-width" id="how-it-works">
        <div className="section-intro">
          <p className="eyebrow">SIMPLE TO SET UP</p>
          <h2>More focus.<br /><span>Less inbox.</span></h2>
          <p>Try the portfolio demo first, then configure Outlook to use your own inbox.</p>
        </div>
        <div className="steps">
          {steps.map((step) => (
            <article className="step" key={step.number}>
              <span className="step-number">{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="safety">
        <div className="page-width safety-inner">
          <div>
            <p className="eyebrow">BUILT AROUND YOUR APPROVAL</p>
            <h2>Your inbox stays<br /><span>in your hands.</span></h2>
          </div>
          <div className="safety-copy">
            <p>The Outlook integration reads inbox messages and saves reply drafts only. There is no send endpoint or send button; your approval stays the final step.</p>
            <p>Sample emails are fictional. Live Outlook access requires your own Microsoft app registration and private environment variables. This portfolio starter is designed for a single-user demo, not a public multi-user email service.</p>
          </div>
        </div>
      </section>

      <section className="final-cta page-width">
        <div>
          <p className="eyebrow">OPEN SOURCE · MIT LICENSE</p>
          <h2>Ready for a calmer<br /><span>way to reply?</span></h2>
        </div>
        <div className="cta-action">
          <p>Explore the sample inbox or connect Outlook after configuring Microsoft credentials.</p>
          <CopyPromptButton className="button button-primary" />
          <a className="repo-cta" href="https://github.com/Nathan200000000/inbox-assistant" target="_blank" rel="noreferrer">Explore the project on GitHub ↗</a>
        </div>
      </section>

      <footer className="footer">
        <a className="brand" href="/"><span className="brand-mark" aria-hidden="true">i</span><span>inbox assistant</span></a>
        <span>Made to help, built to wait for your approval.</span>
        <a href="https://github.com/Nathan200000000/inbox-assistant/blob/main/LICENSE">MIT License</a>
      </footer>
    </main>
  );
}
