import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

interface Bank {
  bankId: string;
  url: string;
  name: string;
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

function parseBanksFromCsv(): Bank[] {
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
    const leverandorIdIndex = headers.indexOf("leverandorId");
    const leverandorUrlIndex = headers.indexOf("leverandorUrl");
    const leverandorVisningsnavnIndex = headers.indexOf(
      "leverandorVisningsnavn",
    );

    if (leverandorIdIndex === -1 || leverandorVisningsnavnIndex === -1) {
      throw new Error("Required columns not found in CSV");
    }

    // Extract unique banks
    const banksMap = new Map<string, Bank>();

    for (let i = 1; i < lines.length; i++) {
      const columns = parseCsvLine(lines[i]);

      const leverandorId = columns[leverandorIdIndex]?.trim();
      const leverandorUrl = columns[leverandorUrlIndex]?.trim() || "";
      const leverandorVisningsnavn =
        columns[leverandorVisningsnavnIndex]?.trim();

      // Skip if missing required data
      if (!leverandorId || !leverandorVisningsnavn) {
        continue;
      }

      // Use leverandorId as key to avoid duplicates
      banksMap.set(leverandorId, {
        bankId: leverandorId,
        url: leverandorUrl,
        name: leverandorVisningsnavn,
      });
    }

    // Convert to array and sort by name
    const bankList = Array.from(banksMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name, "no", { sensitivity: "base" }),
    );

    return bankList;
  } catch (error) {
    console.error("Error parsing CSV:", error);
    throw error;
  }
}

function main(): void {
  try {
    console.log("Parsing banks from CSV...");

    const banks = parseBanksFromCsv();

    // Write to JSON file
    const outputPath = join(process.cwd(), "bank.json");
    writeFileSync(outputPath, JSON.stringify(banks, null, 2), "utf-8");

    console.log(`✅ Created bank.json with ${banks.length} unique banks`);

    // Print first few banks as preview
    console.log("\n📋 First 5 banks:");
    banks.slice(0, 5).forEach((bank, index) => {
      console.log(`  ${index + 1}. ${bank.name} (ID: ${bank.bankId})`);
    });

    // Print some statistics
    const banksWithUrls = banks.filter((bank) => bank.url).length;
    console.log(`\n📊 Statistics:`);
    console.log(`  Total banks: ${banks.length}`);
    console.log(`  Banks with URLs: ${banksWithUrls}`);
    console.log(`  Banks without URLs: ${banks.length - banksWithUrls}`);
  } catch (error) {
    console.error("❌ Failed to parse banks:", error);
    process.exit(1);
  }
}

// Run the script if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { parseBanksFromCsv, type Bank };
