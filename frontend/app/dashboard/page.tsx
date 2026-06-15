import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dashboard | Aurent",
  description:
    "Your Aurent command center for inbox triage, calendar planning, and AI agent work.",
};

const inboxItems = [
  {
    sender: "Mira Chen",
    subject: "Pricing review before launch",
    summary: "Needs a final decision on enterprise tiers and rollout language.",
    priority: "High",
    time: "9:42 AM",
  },
  {
    sender: "Arjun Mehta",
    subject: "Calendar conflict for investor sync",
    summary: "Two attendees declined. Aurent found a cleaner window tomorrow.",
    priority: "Medium",
    time: "8:16 AM",
  },
  {
    sender: "Design Ops",
    subject: "Workspace handoff checklist",
    summary: "Assets are ready. Waiting on your approval for the onboarding flow.",
    priority: "Low",
    time: "Yesterday",
  },
];

const calendarItems = [
  ["10:00", "Product standup", "AI notes enabled"],
  ["12:30", "Partner follow-up", "Draft reply prepared"],
  ["15:00", "Roadmap review", "Agenda condensed"],
];

const taskItems = [
  ["Running", "Draft replies for the launch thread"],
  ["Queued", "Find open times for the investor sync"],
  ["Done", "Summarize unread emails from finance"],
];

const metrics = [
  ["Unread priority", "12", "4 need action"],
  ["Hours recovered", "6.4", "This week"],
  ["Agent success", "98%", "42 tasks"],
  ["Connected tools", "2", "Google + Corsair"],
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

  if (name === "spark") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3ZM19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15Z" />
      </svg>
    );
  }

  if (name === "send") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m4 12 16-8-5 16-3-7-8-1Z" />
        <path d="m12 13 8-9" />
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

export default function DashboardPage() {
  return (
    <main className="dashboard-page">
      <div className="noise-layer" aria-hidden="true" />
      <aside className="dashboard-sidebar" aria-label="Workspace navigation">
        <Link className="brand dashboard-brand" href="/" aria-label="Aurent home">
          <AurentMark />
          <span>AURENT</span>
        </Link>

        <nav className="dashboard-nav">
          {["Command", "Inbox", "Calendar", "Agent", "Integrations"].map((item, index) => (
            <a className={index === 0 ? "active" : ""} href={`#${item.toLowerCase()}`} key={item}>
              {item}
            </a>
          ))}
        </nav>

        <div className="sidebar-health">
          <span>System</span>
          <strong>All workflows live</strong>
        </div>
      </aside>

      <section className="dashboard-shell">
        <header className="dashboard-header">
          <div>
            <span>Good morning</span>
            <h1>Your work is already organized.</h1>
          </div>
          <div className="header-actions">
            <button type="button">Connect tool</button>
            <button className="primary-action" type="button">New task</button>
          </div>
        </header>

        <section className="command-center" id="command" aria-label="AI command center">
          <div className="command-copy">
            <span>Ask Aurent</span>
            <h2>Turn one instruction into inbox, calendar, and follow-up actions.</h2>
          </div>
          <div className="command-input">
            <Icon name="spark" />
            <input
              aria-label="Ask Aurent"
              placeholder="Reschedule the investor sync and send a concise update to everyone."
            />
            <button type="button" aria-label="Send command">
              <Icon name="send" />
            </button>
          </div>
        </section>

        <section className="metric-grid" aria-label="Workspace metrics">
          {metrics.map(([label, value, note]) => (
            <article className="metric-card" key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
              <p>{note}</p>
            </article>
          ))}
        </section>

        <section className="dashboard-grid">
          <div className="dashboard-panel inbox-panel" id="inbox">
            <div className="panel-heading">
              <div>
                <span>AI Inbox</span>
                <h2>Priority threads</h2>
              </div>
              <button type="button">Triage all</button>
            </div>

            <div className="inbox-stack">
              {inboxItems.map((item) => (
                <article className="inbox-item" key={item.subject}>
                  <div className="inbox-meta">
                    <strong>{item.sender}</strong>
                    <span>{item.time}</span>
                  </div>
                  <h3>{item.subject}</h3>
                  <p>{item.summary}</p>
                  <div className="inbox-footer">
                    <span className={`priority priority-${item.priority.toLowerCase()}`}>
                      {item.priority}
                    </span>
                    <button type="button">Draft reply</button>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="dashboard-panel calendar-panel" id="calendar">
            <div className="panel-heading">
              <div>
                <span>Today</span>
                <h2>Calendar</h2>
              </div>
              <Icon name="calendar" />
            </div>

            <div className="calendar-list">
              {calendarItems.map(([time, title, note]) => (
                <article key={title}>
                  <time>{time}</time>
                  <div>
                    <strong>{title}</strong>
                    <span>{note}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="dashboard-panel agent-panel" id="agent">
            <div className="panel-heading">
              <div>
                <span>Agent queue</span>
                <h2>Active work</h2>
              </div>
              <strong className="live-pill">Live</strong>
            </div>

            <div className="task-list">
              {taskItems.map(([status, title]) => (
                <article key={title}>
                  <span>{status}</span>
                  <strong>{title}</strong>
                </article>
              ))}
            </div>
          </div>

          <div className="dashboard-panel integrations-panel" id="integrations">
            <div className="panel-heading">
              <div>
                <span>Integrations</span>
                <h2>Connected tools</h2>
              </div>
            </div>
            <div className="integration-map">
              <span>Gmail</span>
              <span>Google Calendar</span>
              <span>Corsair</span>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
