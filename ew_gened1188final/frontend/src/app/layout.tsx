// The root layout for your Next.js “app router” setup
import "../styles/globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-black text-white">
      {/* `overflow-hidden` prevents scrollbars when text fills the screen */}
      <body className="min-h-screen overflow-hidden">{children}</body>
    </html>
  );
}
