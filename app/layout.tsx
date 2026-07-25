import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ký ức tuổi thơ",
  description: "Bộ sưu tập những khoảnh khắc tuổi thơ và lời nhắn gửi",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
