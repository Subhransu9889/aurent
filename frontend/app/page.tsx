const features = [
  {
    label: "AI Inbox",
    title: "Summarize, draft, and prioritize every thread.",
    detail:
      "Aurent turns dense inboxes into crisp next steps, surfaced before the work piles up.",
    icon: "inbox",
  },
  {
    label: "Smart Calendar",
    title: "Create and update events naturally.",
    detail:
      "Say what needs to happen and Aurent handles availability, invites, and changes.",
    icon: "calendar",
  },
  {
    label: "Agent Actions",
    title: "One request can move across every connected tool.",
    detail:
      "Schedule a meeting, draft the email, and send the follow-up without changing context.",
    icon: "agent",
  },
  {
    label: "Keyboard First",
    title: "Cmd+K everything from a single command center.",
    detail:
      "Search, triage, automate, and compose at the speed of thought.",
    icon: "command",
  },
];

const reasons = [
  ["AI Native", "Built around intelligence from the first interaction."],
  ["Keyboard First", "Every core workflow is one shortcut away."],
  ["Unified Workspace", "Email, calendar, and automation in one calm surface."],
];

const emails = [
  ["Project Update", "Meeting Friday", "Active"],
  ["Corsair Demo", "Reply required", ""],
  ["Hackathon Team", "Calendar added", ""],
];

function AurentMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <svg viewBox="0 0 46 46" role="img">
        <path d="M23 4 41 42H31.8l-3.2-7.5H17.1L13.9 42H5L23 4Z" />
        <path d="M20.1 27.4h5.8L23 20.2l-2.9 7.2Z" />
      </svg>
    </span>
  );
}

function Icon({ name }: { name: string }) {
  if (name === "calendar") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="5" width="16" height="15" rx="2" />
        <path d="M8 3v4M16 3v4M4 10h16" />
      </svg>
    );
  }

  if (name === "agent") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 4v3M7 8h10a4 4 0 0 1 4 4v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-3a4 4 0 0 1 4-4Z" />
        <path d="M9 13h.01M15 13h.01M10 17h4" />
      </svg>
    );
  }

  if (name === "command") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M9 9H7a3 3 0 1 1 3-3v12a3 3 0 1 1-3-3h10a3 3 0 1 1-3 3V6a3 3 0 1 1 3 3H9Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 7h16v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Z" />
      <path d="m4 7 8 6 8-6M8 4h8" />
    </svg>
  );
}

function ProductMockup() {
  return (
    <div className="mockup-shell" aria-label="Aurent product interface preview">
      <div className="mockup-topbar">
        <div className="window-dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div className="mockup-search">Search inbox, calendar, and agent actions</div>
        <div className="mockup-status">AI live</div>
      </div>

      <div className="mockup-grid">
        <aside className="mockup-sidebar">
          <div className="hub-title">AI Hub</div>
          {["Inbox", "Calendar", "Agent"].map((item) => (
            <div className="sidebar-row" key={item}>
              <span />
              {item}
            </div>
          ))}
        </aside>

        <section className="mail-list" aria-label="Inbox list">
          <div className="panel-title">Inbox</div>
          {emails.map(([subject, note, active]) => (
            <article className={`email-row ${active ? "active" : ""}`} key={subject}>
              <div>
                <strong>{subject}</strong>
                <span>{note}</span>
              </div>
              <i />
            </article>
          ))}
        </section>

        <section className="mail-preview" aria-label="Email preview">
          <div className="preview-header">
            <span>Subject</span>
            <strong>Product Demo Tomorrow</strong>
          </div>
          <div className="message-lines" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </div>
          <div className="preview-actions">
            <button>Reply</button>
            <button>AI Draft</button>
            <button>Create Event</button>
          </div>
        </section>

        <aside className="ai-panel" aria-label="AI summary panel">
          <div className="panel-title">AI Summary</div>
          <ul>
            <li>Meeting Friday</li>
            <li>Reply Required</li>
            <li>Calendar Added</li>
          </ul>
          <div className="agent-pill">Ready to act</div>
        </aside>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="landing-page">
      <div className="noise-layer" aria-hidden="true" />
      <nav className="site-nav" aria-label="Primary navigation">
        <a className="brand" href="#top" aria-label="Aurent home">
          <AurentMark />
          <span>AURENT</span>
        </a>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#agent">AI Agent</a>
          <a href="#workflow">Docs</a>
          <a href="https://github.com" target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
        <a className="nav-cta" href="#join">
          Join Beta
        </a>
      </nav>

      <section className="hero-section" id="top">
        <div className="hero-glow" aria-hidden="true" />
        <div className="hero-copy">
          <div className="intro-line">
            What if email and calendar worked the way you think?
          </div>
          <h1>The Intelligence Behind Your Workflow.</h1>
          <p>
            Aurent transforms email and calendar management into a seamless
            AI-powered workflow. Search instantly, schedule effortlessly, and
            let your personal AI assistant handle the busywork.
          </p>
          <div className="hero-actions">
            <a className="primary-button" href="#join">
              Get Started
            </a>
            <a className="secondary-button" href="#agent">
              Watch Demo
            </a>
          </div>
        </div>
        <ProductMockup />
      </section>

      <section className="section-shell" id="features">
        <div className="section-heading">
          <span>Built For Momentum</span>
          <h2>Everything important, gathered into one command center.</h2>
        </div>
        <div className="bento-grid">
          {features.map((feature) => (
            <article className="feature-card" key={feature.label}>
              <div className="feature-icon">
                <Icon name={feature.icon} />
              </div>
              <p>{feature.label}</p>
              <h3>{feature.title}</h3>
              <span>{feature.detail}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="agent-section section-shell" id="agent">
        <div className="agent-card">
          <div className="agent-window">
            <div className="agent-title">Ask Aurent</div>
            <div className="prompt-box">
              Schedule a meeting with Piyush tomorrow at 5 PM and send him a
              confirmation email.
            </div>
            <div className="result-list">
              <span>Calendar event created.</span>
              <span>Invitation sent.</span>
              <span>Email drafted and delivered.</span>
            </div>
          </div>
          <div className="agent-copy">
            <span>One command. Multiple actions. Zero friction.</span>
            <h2>Your assistant should finish the workflow, not just suggest it.</h2>
            <p>
              Aurent understands intent, coordinates the right tools, and leaves
              you with the result already handled.
            </p>
          </div>
        </div>
      </section>

      <section className="workflow-section section-shell" id="workflow">
        <div className="section-heading">
          <span>How It Works</span>
          <h2>Natural language becomes completed work.</h2>
        </div>
        <div className="workflow-map">
          <div className="flow-node">You</div>
          <div className="flow-line" />
          <div className="flow-node">Natural Language</div>
          <div className="flow-line" />
          <div className="flow-node agent-node">Aurent AI Agent</div>
          <div className="integrations">
            <span>Gmail</span>
            <span>Google Calendar</span>
            <span>Corsair Integrations</span>
          </div>
          <div className="flow-line" />
          <div className="flow-node done-node">Done</div>
        </div>
      </section>

      <section className="section-shell why-section">
        {reasons.map(([title, text]) => (
          <article className="reason-card" key={title}>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </section>

      <section className="final-cta" id="join">
        <span>Ready to work differently?</span>
        <h2>Aurent is the AI command center for email, calendar, and everything between.</h2>
        <a className="primary-button" href="mailto:hello@aurent.ai">
          Join the Beta
        </a>
      </section>
    </main>
  );
}
