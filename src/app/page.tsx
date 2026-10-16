import { CopyPromptButton } from "@/components/CopyPromptButton";

const steps = [
  {
    number: "01",
    title: "Connect your inbox",
    text: "In ChatGPT Work, connect Gmail or Outlook Email. Your account stays yours; this project never asks for your password.",
  },
  {
    number: "02",
    title: "Choose your boundaries",
    text: "Copy the setup prompt, choose what needs a reply, and set a daily check time that fits your day.",
  },
  {
    number: "03",
    title: "Review every draft",
    text: "Suggested replies wait in your mailbox Drafts. Edit or send them yourself whenever you’re ready.",
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
            A personal inbox assistant for ChatGPT Work. Find the messages waiting on you, draft a considered reply, and come back to a calmer inbox.
          </p>
          <div className="hero-actions">
            <CopyPromptButton className="button button-primary" />
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
          <p>Start with the prompt, then make the assistant’s boundaries and schedule your own.</p>
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
            <p>The assistant can read messages and create reply drafts. It never sends, forwards, deletes, archives, or marks messages as read.</p>
            <p>This is an open setup kit for ChatGPT Work, not a separate email service. Each person connects their own inbox and checks that scheduled tasks are available in their account.</p>
          </div>
        </div>
      </section>

      <section className="final-cta page-width">
        <div>
          <p className="eyebrow">OPEN SOURCE · MIT LICENSE</p>
          <h2>Ready for a calmer<br /><span>way to reply?</span></h2>
        </div>
        <div className="cta-action">
          <p>Copy the prompt and start your personal setup in ChatGPT Work.</p>
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
