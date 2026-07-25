import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const botToken = '7381679407:AAEmSxdl_S59R5c1U1YG1MbZqSovljSmlUs'; //process.env.TELEGRAM_BOT_TOKEN;
  const chatId = '5254574879'; //process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    return NextResponse.json(
      { ok: false, error: "Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID" },
      { status: 500 }
    );
  }

  const body = await req.json().catch(() => ({ path: "/" }));
  const path: string = body?.path ?? "/";
  const message: string | undefined =
    typeof body?.message === "string" ? body.message.trim() : undefined;
  const timestamp = new Date().toISOString();

  // Escape ký tự đặc biệt của Markdown để tránh lỗi định dạng khi gửi
  const escapeMd = (s: string) =>
    s.replace(/([_*`\[\]])/g, "\\$1");

  const text = message
    ? [
        "💬 *Tin nhắn mới từ người dùng*",
        "",
        escapeMd(message),
        "",
        `📄 Trang: \`${path}\``,
        `🕒 Thời gian: \`${timestamp}\``,
      ].join("\n")
    : [
        "Thông báo: *Website vừa được mở*",
        `📄 Trang: \`${path}\``,
        `🕒 Thời gian: \`${timestamp}\``,
      ].join("\n");

  const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

  const res = await fetch(telegramUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "Markdown",
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    return NextResponse.json({ ok: false, error }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
