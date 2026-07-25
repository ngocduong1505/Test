"use client";

import { useEffect, useRef, useState } from "react";

type Status = "idle" | "sending" | "sent" | "error";

export default function MessageBox() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const disabled = status === "sending" || message.trim().length === 0;

  // Tự động focus vào ô nhập khi vừa mở ra
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => textareaRef.current?.focus(), 250);
      return () => clearTimeout(t);
    }
  }, [open]);

  async function handleSend() {
    if (message.trim().length === 0 || status === "sending") return;

    setStatus("sending");
    try {
      const res = await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: window.location.pathname,
          message: message.trim(),
        }),
      });

      if (!res.ok) throw new Error("Request failed");

      setStatus("sent");
      setMessage("");
      setTimeout(() => setStatus("idle"), 2500);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    // Enter để gửi, Shift+Enter để xuống dòng
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    // Esc để đóng lại
    if (e.key === "Escape") {
      setOpen(false);
    }
  }

  const statusText: Record<Status, string> = {
    idle: "",
    sending: "Đang gửi...",
    sent: "✓ Đã gửi thành công",
    error: "✕ Gửi thất bại, vui lòng thử lại",
  };

  const statusColor: Record<Status, string> = {
    idle: "transparent",
    sending: "rgba(255, 255, 255, 0.6)",
    sent: "#4ade80",
    error: "#f87171",
  };

  return (
    <div style={{ width: "100%", maxWidth: 520, margin: "0 auto", position: "relative" }}>
      {/* Nút ban đầu */}
      <button
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-label="Mở ô gửi tin nhắn"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          width: "100%",
          height: 52,
          borderRadius: 14,
          border: "none",
          cursor: "pointer",
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
          color: "#fff",
          fontSize: 16,
          fontWeight: 600,
          boxShadow: "0 8px 24px rgba(99, 102, 241, 0.35)",
          // Ẩn/hiện mượt bằng cách thu nhỏ & mờ dần
          opacity: open ? 0 : 1,
          transform: open ? "scale(0.96)" : "scale(1)",
          pointerEvents: open ? "none" : "auto",
          transition: "opacity 0.25s ease, transform 0.25s ease",
          position: open ? "absolute" : "relative",
          inset: open ? 0 : undefined,
        }}
      >
        <span aria-hidden style={{ fontSize: 18 }}>✉️</span>

      </button>

      {/* Ô nhập tin nhắn (mở ra bằng hiệu ứng) */}
      <div
        style={{
          overflow: "hidden",
          maxHeight: open ? 500 : 0,
          opacity: open ? 1 : 0,
          transform: open ? "translateY(0)" : "translateY(-8px)",
          transition:
            "max-height 0.35s ease, opacity 0.3s ease, transform 0.3s ease",
        }}
      >
        <div
          style={{
            background: "rgba(255, 255, 255, 0.06)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            borderRadius: 16,
            padding: 16,
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.35)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
            <label
              htmlFor="message-input"
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "rgba(255, 255, 255, 0.7)",
                letterSpacing: 0.2,
              }}
            >
              Bình luận về tđbn
            </label>
            <button
              onClick={() => setOpen(false)}
              aria-label="Đóng"
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                background: "rgba(255, 255, 255, 0.08)",
                color: "rgba(255, 255, 255, 0.7)",
                fontSize: 16,
                lineHeight: 1,
              }}
            >
              ✕
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "flex-end", gap: 10 }}>
            <textarea
              ref={textareaRef}
              id="message-input"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nhập bình luận của bạn..."
              rows={1}
              style={{
                flex: 1,
                resize: "none",
                minHeight: 44,
                maxHeight: 140,
                padding: "12px 14px",
                borderRadius: 12,
                border: "1px solid rgba(255, 255, 255, 0.15)",
                background: "rgba(0, 0, 0, 0.3)",
                color: "#fff",
                fontSize: 15,
                lineHeight: 1.4,
                outline: "none",
                fontFamily: "inherit",
              }}
            />

            <button
              onClick={handleSend}
              disabled={disabled}
              aria-label="Gửi"
              style={{
                flexShrink: 0,
                height: 44,
                padding: "0 20px",
                borderRadius: 12,
                border: "none",
                cursor: disabled ? "not-allowed" : "pointer",
                background: disabled
                  ? "rgba(255, 255, 255, 0.15)"
                  : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                color: "#fff",
                fontSize: 15,
                fontWeight: 600,
                transition: "opacity 0.2s ease",
                opacity: disabled ? 0.6 : 1,
              }}
            >
              {status === "sending" ? "..." : "Gửi"}
            </button>
          </div>

          <div
            style={{
              minHeight: 18,
              marginTop: 10,
              fontSize: 13,
              fontWeight: 500,
              color: statusColor[status],
              transition: "color 0.2s ease",
            }}
          >
            {statusText[status]}
          </div>
        </div>
      </div>
    </div>
  );
}
