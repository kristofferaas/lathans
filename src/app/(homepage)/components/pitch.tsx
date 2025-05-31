import {
  LoanContent,
  LoanItem,
  Loans,
  LoanTrigger,
} from "@/components/loan-list/loan-list";
import { Badge } from "@/components/loan-list/badge";
import { DetailItem, Details } from "@/components/loan-list/details";

// Dummy loan data
const dummyLoans = [
  {
    id: "1",
    name: "Sparebank 1 Boliglån",
    bank: "Sparebank 1",
    nominalRate: "4,20%",
    effectiveRate: "4,35%",
    term: "25 år",
    totalAmount: "3 000 000 kr",
    monthlyPayment: "15 850 kr",
    yearlyPayment: "190 200 kr",
    badge: { text: "-7 800 kr/år", color: "green" },
    savings: 7800,
  },
  {
    id: "2",
    name: "Nordea Boliglån Plus",
    bank: "Nordea Bank",
    nominalRate: "4,25%",
    effectiveRate: "4,40%",
    term: "25 år",
    totalAmount: "3 000 000 kr",
    monthlyPayment: "15 950 kr",
    yearlyPayment: "191 400 kr",
    badge: { text: "-6 600 kr/år", color: "green" },
    savings: 6600,
  },
  {
    id: "3",
    name: "Bulder Bank Boliglån",
    bank: "Bulder Bank",
    nominalRate: "4,30%",
    effectiveRate: "4,45%",
    term: "25 år",
    totalAmount: "3 000 000 kr",
    monthlyPayment: "16 100 kr",
    yearlyPayment: "193 200 kr",
    badge: { text: "-4 800 kr/år", color: "green" },
    savings: 4800,
  },
  {
    id: "4",
    name: "DNB Boliglån",
    bank: "DNB Bank",
    nominalRate: "4,50%",
    effectiveRate: "4,65%",
    term: "25 år",
    totalAmount: "3 000 000 kr",
    monthlyPayment: "16 500 kr",
    yearlyPayment: "198 000 kr",
    badge: { text: "Min avtale", color: "gray" },
    savings: null,
  },
  {
    id: "5",
    name: "Handelsbanken Boliglån",
    bank: "Handelsbanken",
    nominalRate: "4,60%",
    effectiveRate: "4,75%",
    term: "25 år",
    totalAmount: "3 000 000 kr",
    monthlyPayment: "16 700 kr",
    yearlyPayment: "200 400 kr",
    badge: { text: "+2 400 kr/år", color: "red" },
    savings: -2400,
  },
] as const;

export function Pitch() {
  return (
    <section className="grid w-full max-w-7xl grid-cols-1 gap-8 px-6 text-left md:grid-cols-3 md:gap-12">
      {/* Left: Pitches (2/3 width) */}
      <div className="flex flex-col gap-12 md:col-span-2">
        {/* Pitch 1 */}
        <div className="flex flex-col items-start gap-4">
          <Badge variant="orange">Sparegaranti</Badge>
          <h2 className="text-foreground text-4xl font-bold">
            Du vil alltid spare penger
          </h2>
          <p className="text-muted-foreground text-lg leading-8">
            Første måned er gratis. Deretter er kostnaden for å bruke Lathans 99
            kr/mnd. Da sørger vi for at du alltid er på den billigste avtalen
            med banken. Dette er en avgift som tillater at vi kan være en
            uavhengig og selvstendig part, som ikke er eid av banker. Hvis du
            ikke sparer mer enn 99 kr/mnd på å bytte bank, så betaler vi tilbake
            beløpet. Du vil altså alltid spare penger.
          </p>
        </div>
        {/* Pitch 2 */}
        <div className="flex flex-col items-start gap-4">
          <Badge variant="orange">3 min så er du klar</Badge>
          <h2 className="text-foreground text-4xl font-bold">
            Så enkelt er det
          </h2>
          <p className="text-muted-foreground text-lg leading-8">
            Du kan komme i gang rett fra nettleser, du trenger ingen app. Logg
            inn med Vipps, og gi oss info om ditt nåværende lån. Deretter søker
            vi automatisk på bedre lån i andre banker. Til slutt kan du velge og
            vrake fra din boliglånsliste. Dette tar deg ikke mer enn 3 minutter
            før du er i gang.
          </p>
        </div>
      </div>

      {/* Right: Illustration (1/3 width) */}
      <div className="flex w-full flex-col justify-center md:col-span-1">
        <Loans type="single" collapsible>
          {dummyLoans.map((loan, index) => (
            <LoanItem key={loan.id} value={loan.id}>
              <LoanTrigger>
                <div className="min-w-0 flex-grow text-left">
                  <p className="text-secondary-foreground text-lg font-semibold">
                    {index + 1}. {loan.name}
                  </p>
                  <p className="text-muted-foreground text_ellipsis overflow-hidden text-sm font-normal whitespace-nowrap md:text-base">
                    {loan.bank}
                  </p>
                </div>
                <Badge variant={loan.badge.color}>{loan.badge.text}</Badge>
              </LoanTrigger>
              <LoanContent>
                <Details>
                  <DetailItem label="Nominell rente" value={loan.nominalRate} />
                  <DetailItem
                    label="Effektiv rente"
                    value={loan.effectiveRate}
                  />
                  <DetailItem label="Nedbetalingstid" value={loan.term} />
                  <DetailItem
                    label="Totalt lånebeløp"
                    value={loan.totalAmount}
                  />
                  <DetailItem
                    label="Total månedlig betaling"
                    value={loan.monthlyPayment}
                  />
                  <DetailItem
                    label="Total årlig betaling"
                    value={loan.yearlyPayment}
                  />
                </Details>
              </LoanContent>
            </LoanItem>
          ))}
        </Loans>
      </div>
    </section>
  );
}
