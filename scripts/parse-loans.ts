import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

interface PrincipalMortgageLoan {
  id: string;
  bankId: string;
  name: string;
  nominalRate: number;
  effectiveRate: number;
  type: string;
  requireMembership: boolean;
  union?: string;
  requirePackage: boolean;
}

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ";" && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

function parseLoansFromCsv(): PrincipalMortgageLoan[] {
  try {
    // Read the CSV file
    const csvPath = join(process.cwd(), "data.csv");
    const csvData = readFileSync(csvPath, "utf-8");
    const lines = csvData.split("\n").filter((line) => line.trim());

    if (lines.length === 0) {
      throw new Error("CSV file is empty");
    }

    // Parse header row
    const headers = parseCsvLine(lines[0]);

    // Find column indices for required fields
    const productIdIndex = headers.indexOf("product id");
    const navnIndex = headers.indexOf("navn");
    const nominellRenteIndex = headers.indexOf("nominellRente");
    const effectivRenteIndex = headers.indexOf("effectivRente");
    const leverandorIdIndex = headers.indexOf("leverandorId");
    const debetaingIndex = headers.indexOf("Debetaing");
    const forutsettermedlemskapIndex = headers.indexOf("forutsettermedlemskap");
    const medlemskapNavnIndex = headers.indexOf("medlemskapNavn");
    const trengerIkkePakkeIndex = headers.indexOf("trenger_ikke_pakke");

    // Validate required columns exist
    const requiredColumns = [
      { name: "product id", index: productIdIndex },
      { name: "navn", index: navnIndex },
      { name: "nominellRente", index: nominellRenteIndex },
      { name: "effectivRente", index: effectivRenteIndex },
      { name: "leverandorId", index: leverandorIdIndex },
      { name: "Debetaing", index: debetaingIndex },
      { name: "forutsettermedlemskap", index: forutsettermedlemskapIndex },
      { name: "trenger_ikke_pakke", index: trengerIkkePakkeIndex },
    ];

    for (const col of requiredColumns) {
      if (col.index === -1) {
        throw new Error(`Required column "${col.name}" not found in CSV`);
      }
    }

    // Extract loans
    const loans: PrincipalMortgageLoan[] = [];

    for (let i = 1; i < lines.length; i++) {
      const columns = parseCsvLine(lines[i]);

      const productId = columns[productIdIndex]?.trim();
      const navn = columns[navnIndex]?.trim();
      const nominellRente = columns[nominellRenteIndex]?.trim();
      const effectivRente = columns[effectivRenteIndex]?.trim();
      const leverandorId = columns[leverandorIdIndex]?.trim();
      const debetaing = columns[debetaingIndex]?.trim();
      const forutsettermedlemskap = columns[forutsettermedlemskapIndex]?.trim();
      const medlemskapNavn = columns[medlemskapNavnIndex]?.trim();
      const trengerIkkePakke = columns[trengerIkkePakkeIndex]?.trim();

      // Skip if missing required data
      if (
        !productId ||
        !navn ||
        !nominellRente ||
        !effectivRente ||
        !leverandorId ||
        !debetaing
      ) {
        continue;
      }

      // Use leverandorId directly as bankId
      const bankId = leverandorId;

      // Parse numeric values
      const nominalRate = parseFloat(nominellRente.replace(",", "."));
      const effectiveRate = parseFloat(effectivRente.replace(",", "."));

      if (isNaN(nominalRate) || isNaN(effectiveRate)) {
        console.warn(
          `Invalid rates for product ${productId}: nominal=${nominellRente}, effective=${effectivRente}`,
        );
        continue;
      }

      // Parse boolean values
      const requireMembership = forutsettermedlemskap?.toUpperCase() === "TRUE";
      const requirePackage = trengerIkkePakke?.toUpperCase() !== "TRUE"; // Reverse the boolean

      const loan: PrincipalMortgageLoan = {
        id: productId,
        bankId: bankId,
        name: navn,
        nominalRate: nominalRate,
        effectiveRate: effectiveRate,
        type: debetaing,
        requireMembership: requireMembership,
        requirePackage: requirePackage,
      };

      // Add union if membership is required and union name exists
      if (requireMembership && medlemskapNavn) {
        loan.union = medlemskapNavn;
      }

      loans.push(loan);
    }

    return loans;
  } catch (error) {
    console.error("Error parsing CSV:", error);
    throw error;
  }
}

function main(): void {
  try {
    console.log("Parsing principal mortgage loans from CSV...");

    const loans = parseLoansFromCsv();

    // Write to JSON file
    const outputPath = join(process.cwd(), "principal-mortgage-loans.json");
    writeFileSync(outputPath, JSON.stringify(loans, null, 2), "utf-8");

    console.log(
      `✅ Created principal-mortgage-loans.json with ${loans.length} loans`,
    );

    // Print first few loans as preview
    console.log("\n📋 First 5 loans:");
    loans.slice(0, 5).forEach((loan, index) => {
      console.log(
        `  ${index + 1}. ${loan.name} (ID: ${loan.id}, Bank: ${loan.bankId})`,
      );
      console.log(
        `     Nominal: ${loan.nominalRate}%, Effective: ${loan.effectiveRate}%`,
      );
      console.log(
        `     Type: ${loan.type}, Membership: ${loan.requireMembership}, Package: ${loan.requirePackage}`,
      );
      if (loan.union) {
        console.log(`     Union: ${loan.union}`);
      }
      console.log("");
    });

    // Print some statistics
    const loansWithMembership = loans.filter(
      (loan) => loan.requireMembership,
    ).length;
    const loansWithPackage = loans.filter((loan) => loan.requirePackage).length;
    const uniqueBanks = new Set(loans.map((loan) => loan.bankId)).size;

    console.log(`📊 Statistics:`);
    console.log(`  Total loans: ${loans.length}`);
    console.log(`  Unique banks: ${uniqueBanks}`);
    console.log(`  Loans requiring membership: ${loansWithMembership}`);
    console.log(`  Loans requiring package: ${loansWithPackage}`);

    // Show rate ranges
    const nominalRates = loans.map((l) => l.nominalRate);
    const effectiveRates = loans.map((l) => l.effectiveRate);
    console.log(
      `  Nominal rate range: ${Math.min(...nominalRates)}% - ${Math.max(...nominalRates)}%`,
    );
    console.log(
      `  Effective rate range: ${Math.min(...effectiveRates)}% - ${Math.max(...effectiveRates)}%`,
    );
  } catch (error) {
    console.error("❌ Failed to parse loans:", error);
    process.exit(1);
  }
}

// Run the script if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { parseLoansFromCsv, type PrincipalMortgageLoan };
