"use client";

import { useEffect, useRef } from "react";

export default function NotifyOnLoad() {
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current) return;
    sent.current = true;

    fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: window.location.pathname }),
    }).catch(() => {
      // Bỏ qua lỗi mạng - không ảnh hưởng đến trải nghiệm hiển thị ảnh
    });
  }, []);

  return null;
}
