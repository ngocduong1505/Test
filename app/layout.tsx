import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Static Image Viewer",
  description: "Displays a static image and notifies Telegram on page view",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
