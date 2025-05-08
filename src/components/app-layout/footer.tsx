import Link from "next/link";
import { LathansLogo } from "./lathans-logo";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 flex flex-col items-start gap-2">
            <LathansLogo href="/" />
            <p className="text-sm text-primary-foreground mb-4">
              Vi overvåker alle banker til en hver tid og putter deg automatisk
              over på det billigste med laveste renter.
            </p>
          </div>

          <div className="col-span-1">
            <h3 className="font-medium mb-3">Finn frem</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-primary-foreground">
                  Blogg
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-primary-foreground">
                  Karriere
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-primary-foreground">
                  Priser
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="font-medium mb-3">Ressurser</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-primary-foreground">
                  Dokumentasjon
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-primary-foreground">
                  Artikler
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-primary-foreground">
                  Pressekonferanser
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="font-medium mb-3">Info</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-primary-foreground">
                  Tjenestevilkår
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-primary-foreground">
                  Personvern
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-primary-foreground">
                  Cookie-policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-primary-foreground">
                  Databehandling
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-primary-foreground">
            © 2023 Lathans App AS.
          </p>
          <p className="text-sm text-primary-foreground">
            Alle rettigheter reservert.
          </p>
        </div>
      </div>
    </footer>
  );
}
