import { BanksMarquee } from "./components/banks-marquee";
import { Hero } from "./components/hero";
import { Pitch } from "./components/pitch";

export default function HomePage() {
  return (
    <main className="flex w-full grow flex-col items-center gap-12 py-16">
      <Hero />
      <BanksMarquee />
      <Pitch />
    </main>
  );
}
