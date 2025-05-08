import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <h2 className="text-xl font-bold mb-4">Lathans.</h2>
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
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-primary-foreground">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-primary-foreground">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="font-medium mb-3">Ressurser</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-primary-foreground">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-primary-foreground">
                  Papers
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-primary-foreground">
                  Press Conferences
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="font-medium mb-3">Info</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-primary-foreground">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-primary-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-primary-foreground">
                  Cookies Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-primary-foreground">
                  Data Processing
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
            All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
