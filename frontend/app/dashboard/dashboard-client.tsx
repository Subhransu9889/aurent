"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { authClient } from "@/lib/auth-client";

type DashboardTab = "command" | "inbox" | "calendar" | "agent" | "integrations";
type ConnectionKey = "gmail" | "calendar";

const tabs: Array<{ id: DashboardTab; label: string }> = [
  { id: "command", label: "Command" },
  { id: "inbox", label: "Inbox" },
  { id: "calendar", label: "Calendar" },
  { id: "agent", label: "Agent" },
  { id: "integrations", label: "Integrations" },
];

const googleConnectionScopes: Record<ConnectionKey, string[]> = {
  gmail: [
    "openid",
    "profile",
    "email",
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/gmail.send",
  ],
  calendar: [
    "openid",
    "profile",
    "email",
    "https://www.googleapis.com/auth/calendar.readonly",
    "https://www.googleapis.com/auth/calendar.events",
  ],
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
  ["Connected tools", "2", "Gmail + Calendar ready"],
];

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 5) return "Good night";
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  if (hour < 21) return "Good evening";
  return "Good night";
}

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

export default function DashboardClient() {
  const [activeTab, setActiveTab] = useState<DashboardTab>("command");
  const [greeting, setGreeting] = useState("Hello");
  const [connectedTools, setConnectedTools] = useState<ConnectionKey[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<string | null>(null);
  const [connectingTool, setConnectingTool] = useState<ConnectionKey | null>(null);

  const calendarLocked = !connectedTools.includes("gmail");

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setGreeting(getGreeting());

      const params = new URLSearchParams(window.location.search);
      const tab = params.get("tab");
      const connected = params.get("connected");

      if (tabs.some((item) => item.id === tab)) {
        setActiveTab(tab as DashboardTab);
      }

      if (connected === "gmail" || connected === "calendar") {
        setConnectedTools((current) =>
          current.includes(connected) ? current : [...current, connected],
        );
        setConnectionStatus(`${connected === "gmail" ? "Gmail" : "Calendar"} connected.`);
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  const activeTitle = useMemo(
    () => tabs.find((tab) => tab.id === activeTab)?.label ?? "Command",
    [activeTab],
  );

  async function connectGoogleTool(tool: ConnectionKey) {
    if (tool === "calendar" && calendarLocked) {
      setConnectionStatus("Connect Gmail first so Calendar can attach to the same Google workspace.");
      return;
    }

    setConnectingTool(tool);
    setConnectionStatus(null);

    try {
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: `/dashboard?tab=integrations&connected=${tool}`,
        errorCallbackURL: "/dashboard?tab=integrations",
        scopes: googleConnectionScopes[tool],
      });

      if (result.error) {
        setConnectionStatus(result.error.message || "Google connection could not be started.");
        setConnectingTool(null);
      }
    } catch {
      setConnectionStatus("Google connection could not be started.");
      setConnectingTool(null);
    }
  }

  return (
    <main className="dashboard-page">
      <div className="noise-layer" aria-hidden="true" />
      <aside className="dashboard-sidebar" aria-label="Workspace navigation">
        <Link className="brand dashboard-brand" href="/" aria-label="Aurent home">
          <AurentMark />
          <span>AURENT</span>
        </Link>

        <nav className="dashboard-nav" aria-label="Dashboard tabs">
          {tabs.map((item) => (
            <button
              aria-current={activeTab === item.id ? "page" : undefined}
              className={activeTab === item.id ? "active" : ""}
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-health">
          <span>System</span>
          <strong>{activeTitle} workspace</strong>
        </div>
      </aside>

      <section className="dashboard-shell">
        <header className="dashboard-header">
          <div>
            <span>{greeting}</span>
            <h1>{activeTab === "command" ? "Your work is already organized." : activeTitle}</h1>
          </div>
          <div className="header-actions">
            <button type="button" onClick={() => setActiveTab("integrations")}>
              Connect tool
            </button>
            <button className="primary-action" type="button" onClick={() => setActiveTab("agent")}>
              New task
            </button>
          </div>
        </header>

        <section className="dashboard-view" aria-live="polite">
          {activeTab === "command" ? (
            <>
              <section className="command-center" aria-label="AI command center">
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
            </>
          ) : null}

          {activeTab === "inbox" ? (
            <div className="dashboard-panel inbox-panel">
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
          ) : null}

          {activeTab === "calendar" ? (
            <div className="dashboard-panel calendar-panel">
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
          ) : null}

          {activeTab === "agent" ? (
            <div className="dashboard-panel agent-panel">
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
          ) : null}

          {activeTab === "integrations" ? (
            <div className="dashboard-panel integrations-panel">
              <div className="panel-heading">
                <div>
                  <span>Connected tools</span>
                  <h2>Google workflow</h2>
                </div>
              </div>

              <div className="connection-flow">
                <article className="connection-step">
                  <div>
                    <span>Step 1</span>
                    <h3>Connect Gmail</h3>
                    <p>Grant Aurent access to read priority threads and send approved drafts.</p>
                  </div>
                  <button
                    type="button"
                    disabled={connectingTool === "gmail" || connectedTools.includes("gmail")}
                    onClick={() => connectGoogleTool("gmail")}
                  >
                    {connectedTools.includes("gmail")
                      ? "Connected"
                      : connectingTool === "gmail"
                        ? "Opening Google..."
                        : "Connect Gmail"}
                  </button>
                </article>

                <article className={`connection-step ${calendarLocked ? "locked" : ""}`}>
                  <div>
                    <span>Step 2</span>
                    <h3>Connect Calendar</h3>
                    <p>Allow Aurent to read availability and create calendar events from agent tasks.</p>
                  </div>
                  <button
                    type="button"
                    disabled={calendarLocked || connectingTool === "calendar" || connectedTools.includes("calendar")}
                    onClick={() => connectGoogleTool("calendar")}
                  >
                    {connectedTools.includes("calendar")
                      ? "Connected"
                      : connectingTool === "calendar"
                        ? "Opening Google..."
                        : "Connect Calendar"}
                  </button>
                </article>

                <article className="connection-step corsair-step">
                  <div>
                    <span>Step 3</span>
                    <h3>Corsair logic</h3>
                    <p>Reserved for your custom Corsair workflow after Google is connected.</p>
                  </div>
                  <button type="button" disabled>
                    Coming next
                  </button>
                </article>
              </div>

              {connectionStatus ? (
                <p className="connection-status" role="status">
                  {connectionStatus}
                </p>
              ) : null}
            </div>
          ) : null}
        </section>
      </section>
    </main>
  );
}
