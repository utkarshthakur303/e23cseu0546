import "./globals.css";

export const metadata = {
  title: "Affordmed Notification System | Campus Hiring Evaluation",
  description:
    "A priority-based notification system built with Next.js — Affordmed Campus Hiring Evaluation Project.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#0a0a0f] text-[#f0f0f5] font-['Inter',system-ui,sans-serif] antialiased">
        {children}
      </body>
    </html>
  );
}
