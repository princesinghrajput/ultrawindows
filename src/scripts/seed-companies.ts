import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import Company from "../models/Company";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in environment variables.");
}

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGODB_URI!);
    console.log("Database connected");
  }
}

function cleanValue(value?: string) {
  if (!value) return "";
  return value.replace(/>/g, "").trim();
}

function parseLine(line: string) {
  // 1. Try Tab Split (preferred if file truly has tabs)
  const tabParts = line.split("\t");
  // If we have at least 4 tabs, assume it's tab-separated (even if valid empty cols exist)
  if (tabParts.length >= 5) {
    return {
      name: cleanValue(tabParts[0]),
      address: cleanValue(tabParts[1]),
      postcode: cleanValue(tabParts[2]),
      phone: cleanValue(tabParts[3]),
      email: cleanValue(tabParts[4]),
      hasOwnPricing: cleanValue(tabParts[5]),
    };
  }

  // 2. Fallback: Split by multiple spaces
  const parts = line.split(/\s{2,}/).map((p) => p.trim()).filter((p) => p);

  // Identify fields by pattern
  const email = parts.find((p) => /@/.test(p));
  const pricing = parts.find((p) => /^(yes|no)$/i.test(p));

  // Phone: starts with + or 0, mostly digits/spaces, length > 9, not email
  const phone = parts.find((p) =>
    !p.includes("@") &&
    /^(\+44|0)[\d\s\(\)\-\.]*$/.test(p) &&
    p.replace(/\D/g, "").length >= 9
  );

  // Postcode: UK format roughly (or just short alphanumeric at end if not found)
  // strict regex: ^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$
  const postcode = parts.find((p) =>
    !p.includes("@") &&
    p !== phone &&
    p !== pricing &&
    /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i.test(p)
  );

  const name = parts[0]; // Name is always first

  // Address is tricky. It's whatever is left that isn't identified.
  // We iterate parts, if not matched to above, append to address.
  // Skipping index 0 (Name).
  let addressParts: string[] = [];
  for (let i = 1; i < parts.length; i++) {
    const p = parts[i];
    if (p !== email && p !== phone && p !== pricing && p !== postcode) {
      addressParts.push(p);
    }
  }
  const address = addressParts.join(", ");

  return {
    name: cleanValue(name),
    address: cleanValue(address),
    postcode: cleanValue(postcode),
    phone: cleanValue(phone),
    email: cleanValue(email),
    hasOwnPricing: cleanValue(pricing),
  };
}

async function seedCompanies() {
  try {
    await connectDB();

    const filePath = path.join(process.cwd(), "company.md");

    if (!fs.existsSync(filePath)) {
      throw new Error("company.md file not found in project root.");
    }

    const fileContent = fs.readFileSync(filePath, "utf-8");

    const lines = fileContent
      .split("\n")
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .slice(1); // remove header

    console.log(`Found ${lines.length} entries`);

    let created = 0;
    let updated = 0;
    let skipped = 0;

    for (const line of lines) {
      const { name, address, postcode, phone, email } = parseLine(line);
      // console.log(`Parsed: ${name} | Email: ${email}`); // Debug logging

      if (!name || name.toLowerCase() === "company" || name === "Not to be Used") {
        skipped++;
        continue;
      }

      const result = await Company.findOneAndUpdate(
        { name },
        {
          name,
          address: address || undefined,
          postcode: postcode || undefined,
          phone: phone || undefined,
          email: email || undefined,
          pricingType: "Trade",
          $setOnInsert: {
            markups: {
              allProducts: 0,
              aluminium: 0,
              roofProducts: 0,
              glass: 0,
            },
          },
        },
        { upsert: true, new: false }
      );

      if (result) {
        updated++;
      } else {
        created++;
      }
    }

    console.log("Seeding completed");
    console.log(`Created: ${created}`);
    console.log(`Updated: ${updated}`);
    console.log(`Skipped: ${skipped}`);

    await mongoose.connection.close();
    process.exit(0);

  } catch (error) {
    console.error("Seeding failed:", error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

seedCompanies();