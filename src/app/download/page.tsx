import type { Metadata } from "next";
import InfoPage, { PillLink } from "@/components/web/InfoPage";
import { InstallAppButton } from "@/components/InstallApp";

export const metadata: Metadata = {
  title: "Get the app | Vex",
  description: "Install Vex on iPhone, Android, PC or Mac straight from your browser, plus the Chrome extension.",
};

export default function DownloadPage() {
  return (
    <InfoPage
      eyebrow="Get the app"
      title={<>Vex on every device. <span className="italic text-[#faf6ed]/80">No app store.</span></>}
      lead="Install Vex straight from your browser. It opens full-screen like a normal app, gets its own icon, and keeps working when your connection drops."
      image="/images/michelangelo-hands.jpg"
      actions={
        <>
          <InstallAppButton variant="onDark" target="ios" />
          <InstallAppButton variant="onDark" target="android" />
          <InstallAppButton variant="onDark" target="desktop" />
        </>
      }
      sections={[
        {
          eyebrow: "Choose your device",
          title: "Two taps on phone, one click on PC",
          layout: "list",
          items: [
            { icon: "phone", title: "iPhone & iPad", text: "In Safari: Share → Add to Home Screen → Add." },
            { icon: "phone", title: "Android", text: "In Chrome: ⋮ menu → Install app." },
            { icon: "laptop", title: "Windows, Mac & Linux", text: "In Chrome or Edge: click the install icon in the address bar." },
            { icon: "puzzle", title: "Chrome extension", text: "Fill job forms on your computer. Desktop Chrome & Edge only.", tag: "Desktop" },
          ],
        },
        {
          eyebrow: "Why install",
          title: "Faster than a browser tab",
          tone: "dark",
          items: [
            { icon: "spark", title: "Opens instantly", text: "Its own icon and window — no searching through tabs." },
            { icon: "lock", title: "Works offline", text: "Your last pages stay available without a connection." },
            { icon: "shield", title: "Always up to date", text: "No updates to download — you always get the latest version." },
          ],
        },
      ]}
      closing={{
        title: "Need the extension too?",
        text: "Install the app on your phone to prepare on the go, and the extension on your computer to apply.",
        actions: (
          <>
            <InstallAppButton variant="dark" />
            <PillLink href="/extension" variant="outline">Chrome extension</PillLink>
          </>
        ),
      }}
    />
  );
}
