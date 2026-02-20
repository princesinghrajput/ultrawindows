import { Schema, model, models, type InferSchemaType } from "mongoose";
import { ProductType } from "@/types/product";

const quoteItemSchema = new Schema(
  {
    productType: {
      type: String,
      enum: Object.values(ProductType),
      required: true,
    },
    configuration: { type: Schema.Types.Mixed, required: true },
    priceBreakdown: { type: Schema.Types.Mixed },
    quantity: { type: Number, default: 1 },
    location: { type: String, trim: true },
    netPrice: { type: Number },
    totalPrice: { type: Number },
  },
  { _id: false },
);

const quoteSchema = new Schema(
  {
    quoteId: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    customerDetails: {
      name: { type: String, trim: true },
      email: { type: String, trim: true, lowercase: true },
      phone: { type: String, trim: true },
      address: { type: String, trim: true },
    },
    company: { type: Schema.Types.ObjectId, ref: "Company" },
    // Flattened single-item fields for backwards compatibility / quick access
    productType: {
      type: String,
      enum: Object.values(ProductType),
    },
    configuration: { type: Schema.Types.Mixed },
    priceBreakdown: { type: Schema.Types.Mixed },
    quantity: { type: Number, default: 1 },
    location: { type: String, trim: true },
    netPrice: { type: Number },
    totalPrice: { type: Number },
    // Items array to support configurable multi-product quotes
    items: {
      type: [quoteItemSchema],
      default: [],
    },
    financials: { type: Schema.Types.Mixed },
    netTotal: { type: Number },
    taxTotal: { type: Number },
    grossTotal: { type: Number },
    status: {
      type: String,
      enum: ["draft", "pending", "ordered", "archived"],
      default: "draft",
    },
    expiryDate: { type: Date },
    archivedAt: { type: Date },
  },
  { timestamps: true },
);

const Quote = models.Quote || model("Quote", quoteSchema);

export type QuoteDocument = InferSchemaType<typeof quoteSchema>;

export default Quote;
