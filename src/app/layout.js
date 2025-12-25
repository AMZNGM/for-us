import "./globals.css";
import AppWrapper from "@/components/app-components/AppWrapper";

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  title: "For Us <3",
  description: "Just Yassira and Abdelrahman page, nothing more nothing less.",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`relative w-screen min-h-screen overflow-x-hidden! bg-bg text-text font-main selection:bg-main/50 selection:text-text scroll-smooth antialiased`}
      >
        {children}
        <AppWrapper></AppWrapper>
      </body>
    </html>
  );
}
