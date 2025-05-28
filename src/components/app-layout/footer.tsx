import Link from "next/link";
import { LathansLogo } from "./lathans-logo";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-8 md:flex-row">
          <div className="flex flex-1 flex-col items-start gap-2">
            <LathansLogo href="/" />
            <p className="text-primary-foreground mb-4 max-w-md text-sm text-balance">
              Vi overvåker alle banker til en hver tid og putter deg automatisk
              over på det billigste med laveste renter.
            </p>
          </div>

          <div className="flex flex-col gap-8 md:flex-row md:gap-16">
            <div>
              <h3 className="mb-3 font-medium">Finn frem</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-primary-foreground text-sm">
                    Blogg
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-primary-foreground text-sm">
                    Karriere
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-primary-foreground text-sm">
                    Priser
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-3 font-medium">Ressurser</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-primary-foreground text-sm">
                    Dokumentasjon
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-primary-foreground text-sm">
                    Artikler
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-primary-foreground text-sm">
                    Pressekonferanser
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-3 font-medium">Info</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-primary-foreground text-sm">
                    Tjenestevilkår
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-primary-foreground text-sm">
                    Personvern
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-primary-foreground text-sm">
                    Cookie-policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-primary-foreground text-sm">
                    Databehandling
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-primary-foreground mt-8 flex flex-col items-center justify-between border-t pt-8 md:flex-row">
          <p className="text-primary-foreground text-sm">
            © 2023 Lathans App AS.
          </p>
          <p className="text-primary-foreground text-sm">
            Alle rettigheter reservert.
          </p>
        </div>
      </div>
    </footer>
  );
}
