import Quote from "@/models/Quote";

function parseQuoteSequence(quoteId?: string | null) {
  if (!quoteId) return 0;
  const match = quoteId.match(/(\d+)$/);
  if (!match) return 0;
  return Number.parseInt(match[1], 10) || 0;
}

const QUOTE_PREFIX = "Q";

const buildQuoteId = (sequence: number) => `${QUOTE_PREFIX}${sequence}`;

export async function generateNextQuoteId() {
  const lastQuote = await Quote.findOne({}, { quoteId: 1 })
    .sort({ createdAt: -1 })
    .lean();

  let nextNumber = parseQuoteSequence(lastQuote?.quoteId) + 1;
  if (nextNumber < 1000) {
    nextNumber = 1000 + nextNumber;
  }

  let candidate = buildQuoteId(nextNumber);
  while (true) {
    const existing = await Quote.exists({ quoteId: candidate });
    if (!existing) break;
    nextNumber += 1;
    candidate = buildQuoteId(nextNumber);
  }

  return candidate;
}

export function isQuoteEditable(status?: string | null) {
  return status === "draft" || status === "pending";
}

export function deriveQuoteTotals(input: {
  items?: Array<{ totalPrice?: number; netPrice?: number; priceBreakdown?: { total?: number } }>;
  netTotal?: number;
  taxTotal?: number;
  grossTotal?: number;
  financials?: { netTotal?: number; taxTotal?: number; grossTotal?: number };
}) {
  const items = Array.isArray(input.items) ? input.items : [];
  const sumFromItems = items.reduce((sum, item) => {
    const lineTotal = item?.totalPrice ?? item?.netPrice ?? item?.priceBreakdown?.total ?? 0;
    return sum + (typeof lineTotal === "number" ? lineTotal : 0);
  }, 0);

  const netTotal = input.netTotal ?? input.financials?.netTotal ?? sumFromItems;
  const taxTotal = input.taxTotal ?? input.financials?.taxTotal ?? 0;
  const grossTotal = input.grossTotal ?? input.financials?.grossTotal ?? netTotal + taxTotal;

  return { netTotal, taxTotal, grossTotal };
}
