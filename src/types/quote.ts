import { ProductType, type ProductConfig } from "./product";
import { type PriceBreakdown } from "@/utils/pricing";

export type QuoteStatus = "draft" | "pending" | "ordered" | "archived";

export interface QuoteCustomerDetails {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface QuoteItem {
  _id?: string;
  productType: ProductType;
  configuration: ProductConfig | Record<string, unknown>;
  priceBreakdown: PriceBreakdown | Record<string, unknown> | null;
  quantity: number;
  location?: string;
  netPrice?: number;
  totalPrice?: number;
}

export interface QuoteFinancials {
  netTotal?: number;
  taxTotal?: number;
  grossTotal?: number;
  [key: string]: unknown;
}

export interface Quote {
  _id: string;
  quoteId: string;
  user: string;
  customerDetails?: QuoteCustomerDetails;
  company?: string;
  productType?: ProductType;
  configuration?: ProductConfig | Record<string, unknown> | null;
  priceBreakdown?: PriceBreakdown | Record<string, unknown> | null;
  quantity?: number;
  location?: string;
  netPrice?: number;
  totalPrice?: number;
  items: QuoteItem[];
  financials?: QuoteFinancials;
  netTotal?: number;
  taxTotal?: number;
  grossTotal?: number;
  status: QuoteStatus;
  expiryDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateQuotePayload {
  customerDetails?: QuoteCustomerDetails;
  companyId?: string;
  items: QuoteItem[];
  status?: QuoteStatus;
  expiryDate?: string;
  financials?: QuoteFinancials;
}

export type UpdateQuotePayload = Partial<CreateQuotePayload> & {
  productType?: ProductType;
  configuration?: ProductConfig | Record<string, unknown> | null;
  priceBreakdown?: PriceBreakdown | Record<string, unknown> | null;
  quantity?: number;
  location?: string;
  netPrice?: number;
  totalPrice?: number;
};
