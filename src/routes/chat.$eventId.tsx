import { useState, useRef, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, Send, Users } from "lucide-react";

export const Route = createFileRoute("/chat/$eventId")({
  component: ChatPage,
});

/* ─── Dummy data ─── */

interface ChatMessage {
  id: string;
  sender: string;
  initial: string;
  gradient: string;
  text: string;
  time: string;
  isMe: boolean;
  isHost?: boolean;
}

const MEMBERS = [
  { gradient: "#7c6ee7, #b47ee7" },
  { gradient: "#e76e9a, #e7a87e" },
  { gradient: "#6eb5e7, #6ee7c4" },
  { gradient: "#e7d16e, #e7926e" },
  { gradient: "#9a6ee7, #e76eb5" },
];

const DUMMY_MESSAGES: ChatMessage[] = [
  {
    id: "1",
    sender: "M",
    initial: "M",
    gradient: "#7c6ee7, #b47ee7",
    text: "Hey everyone! Excited for this event 🎉",
    time: "2:30 PM",
    isMe: false,
    isHost: true,
  },
  {
    id: "2",
    sender: "J",
    initial: "J",
    gradient: "#e76e9a, #e7a87e",
    text: "Same here! Does anyone know the exact meeting spot?",
    time: "2:32 PM",
    isMe: false,
  },
  {
    id: "3",
    sender: "P",
    initial: "P",
    gradient: "#9a6ee7, #e76eb5",
    text: "I think we're meeting at the main entrance. Let me double check",
    time: "2:33 PM",
    isMe: true,
  },
  {
    id: "4",
    sender: "K",
    initial: "K",
    gradient: "#6eb5e7, #6ee7c4",
    text: "Yeah it says the main entrance in the description. Should we get there 10 min early?",
    time: "2:35 PM",
    isMe: false,
  },
  {
    id: "5",
    sender: "Y",
    initial: "Y",
    gradient: "#e7d16e, #e7926e",
    text: "Good idea! I'll be coming from Tsim Sha Tsui so might be a few minutes late 😅",
    time: "2:36 PM",
    isMe: false,
  },
  {
    id: "6",
    sender: "P",
    initial: "P",
    gradient: "#9a6ee7, #e76eb5",
    text: "No worries, we'll wait for you! See everyone there 👋",
    time: "2:38 PM",
    isMe: true,
  },
  {
    id: "7",
    sender: "M",
    initial: "M",
    gradient: "#7c6ee7, #b47ee7",
    text: "Perfect, see you all soon!",
    time: "2:40 PM",
    isMe: false,
    isHost: true,
  },
];

/* ─── Page ─── */

function ChatPage() {
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  return (
    <div
      className="flex flex-col"
      style={{ height: "100dvh", backgroundColor: "var(--color-bg-primary)" }}
    >
      {/* ─── Top bar ─── */}
      <div
        style={{
          padding: "16px 20px",
          paddingTop: "20px",
          borderBottom: "1px solid rgba(174, 177, 231, 0.08)",
          backgroundColor: "var(--color-bg-primary)",
          animation: "slideUp 400ms cubic-bezier(0.16, 1, 0.3, 1) backwards",
        }}
      >
        <div className="flex items-center" style={{ gap: "12px" }}>
          {/* Back */}
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center cursor-pointer"
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              border: "1px solid rgba(174, 177, 231, 0.15)",
              backgroundColor: "rgba(174, 177, 231, 0.08)",
              flexShrink: 0,
              transition: "transform 250ms cubic-bezier(0.16, 1, 0.3, 1)",
            }}
            onPointerDown={(e) => {
              e.currentTarget.style.transform = "scale(0.88)";
            }}
            onPointerUp={(e) => {
              e.currentTarget.style.transform = "";
            }}
            onPointerLeave={(e) => {
              e.currentTarget.style.transform = "";
            }}
            aria-label="Go back"
          >
            <ArrowLeft size={18} color="#fff" strokeWidth={2} />
          </button>

          {/* Title area */}
          <div className="flex flex-col flex-1" style={{ minWidth: 0 }}>
            <span
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "16px",
                fontWeight: 600,
                color: "var(--color-text-white)",
                letterSpacing: "0.3px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Event Group Chat
            </span>
            <div className="flex items-center" style={{ gap: "4px" }}>
              <Users
                size={10}
                color="var(--color-text-primary)"
                strokeWidth={2}
              />
              <span
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "11px",
                  color: "var(--color-text-primary)",
                  opacity: 0.6,
                }}
              >
                {MEMBERS.length} members
              </span>
            </div>
          </div>

          {/* Avatar stack */}
          <div className="flex" style={{ marginRight: "2px" }}>
            {MEMBERS.slice(0, 4).map((m, i) => (
              <div
                key={i}
                style={{
                  width: "26px",
                  height: "26px",
                  borderRadius: "50%",
                  border: "2px solid var(--color-bg-primary)",
                  marginLeft: i === 0 ? "0" : "-8px",
                  background: `linear-gradient(135deg, ${m.gradient})`,
                  zIndex: 4 - i,
                }}
              />
            ))}
            {MEMBERS.length > 4 && (
              <div
                style={{
                  width: "26px",
                  height: "26px",
                  borderRadius: "50%",
                  border: "2px solid var(--color-bg-primary)",
                  marginLeft: "-8px",
                  backgroundColor: "rgba(174, 177, 231, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 0,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "9px",
                    fontWeight: 600,
                    color: "var(--color-text-primary)",
                  }}
                >
                  +{MEMBERS.length - 4}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── Messages ─── */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto hide-scrollbar"
        style={{ padding: "16px 16px 8px" }}
      >
        {/* Date separator */}
        <div
          className="flex items-center justify-center"
          style={{
            marginBottom: "16px",
            animation:
              "fadeIn 400ms cubic-bezier(0.16, 1, 0.3, 1) backwards 100ms",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "10px",
              fontWeight: 500,
              color: "var(--color-text-primary)",
              opacity: 0.4,
              letterSpacing: "0.8px",
              textTransform: "uppercase",
              backgroundColor: "rgba(174, 177, 231, 0.06)",
              padding: "4px 14px",
              borderRadius: "100px",
            }}
          >
            Today
          </span>
        </div>

        {DUMMY_MESSAGES.map((msg, index) => {
          const prevMsg = index > 0 ? DUMMY_MESSAGES[index - 1] : null;
          const sameSender = prevMsg?.sender === msg.sender;

          return (
            <div
              key={msg.id}
              className="flex"
              style={{
                justifyContent: msg.isMe ? "flex-end" : "flex-start",
                marginBottom: sameSender ? "3px" : "12px",
                animation: `slideUp 400ms cubic-bezier(0.16, 1, 0.3, 1) backwards ${150 + index * 50}ms`,
              }}
            >
              {!msg.isMe && (
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: sameSender
                      ? "transparent"
                      : `linear-gradient(135deg, ${msg.gradient})`,
                    flexShrink: 0,
                    marginRight: "8px",
                    alignSelf: "flex-end",
                  }}
                />
              )}

              <div
                style={{
                  maxWidth: "75%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: msg.isMe ? "flex-end" : "flex-start",
                }}
              >
                {/* Host label (anonymous — no names shown) */}
                {!msg.isMe && !sameSender && msg.isHost && (
                  <span
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "10px",
                      fontWeight: 600,
                      color: "var(--color-accent-yellow)",
                      opacity: 0.8,
                      letterSpacing: "0.3px",
                      marginBottom: "3px",
                      marginLeft: "4px",
                    }}
                  >
                    Host
                  </span>
                )}

                {/* Bubble */}
                <div
                  style={{
                    padding: "9px 14px",
                    borderRadius: msg.isMe
                      ? "16px 16px 4px 16px"
                      : "16px 16px 16px 4px",
                    backgroundColor: msg.isMe
                      ? "var(--color-accent-yellow)"
                      : "rgba(59, 60, 97, 0.6)",
                    border: msg.isMe
                      ? "none"
                      : "1px solid rgba(174, 177, 231, 0.08)",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "13px",
                      lineHeight: 1.5,
                      color: msg.isMe
                        ? "#090b3b"
                        : "var(--color-text-white)",
                      letterSpacing: "0.1px",
                      margin: 0,
                    }}
                  >
                    {msg.text}
                  </p>
                </div>

                {/* Timestamp */}
                <span
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "9px",
                    color: "var(--color-text-primary)",
                    opacity: 0.35,
                    marginTop: "3px",
                    padding: msg.isMe ? "0 4px 0 0" : "0 0 0 4px",
                  }}
                >
                  {msg.time}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── Input bar ─── */}
      <div
        style={{
          padding: "12px 16px",
          paddingBottom: "20px",
          borderTop: "1px solid rgba(174, 177, 231, 0.06)",
          backgroundColor: "var(--color-bg-primary)",
          animation:
            "slideUp 400ms cubic-bezier(0.16, 1, 0.3, 1) backwards 500ms",
        }}
      >
        <div
          className="flex items-center"
          style={{
            gap: "10px",
            padding: "6px 6px 6px 16px",
            borderRadius: "100px",
            backgroundColor: "rgba(59, 60, 97, 0.45)",
            border: "1px solid rgba(174, 177, 231, 0.1)",
          }}
        >
          <input
            type="text"
            placeholder="Type a message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              backgroundColor: "transparent",
              fontFamily: "var(--font-body)",
              fontSize: "13px",
              color: "var(--color-text-white)",
              letterSpacing: "0.1px",
              caretColor: "var(--color-accent-yellow)",
            }}
          />
          <button
            className="flex items-center justify-center cursor-pointer"
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "50%",
              border: "none",
              backgroundColor: inputValue.trim()
                ? "var(--color-accent-yellow)"
                : "rgba(174, 177, 231, 0.12)",
              transition: "all 250ms cubic-bezier(0.16, 1, 0.3, 1)",
              flexShrink: 0,
            }}
            onPointerDown={(e) => {
              e.currentTarget.style.transform = "scale(0.88)";
            }}
            onPointerUp={(e) => {
              e.currentTarget.style.transform = "";
            }}
            onPointerLeave={(e) => {
              e.currentTarget.style.transform = "";
            }}
            aria-label="Send message"
          >
            <Send
              size={15}
              color={inputValue.trim() ? "#090b3b" : "var(--color-text-primary)"}
              strokeWidth={2.2}
              style={{ marginLeft: "1px" }}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
