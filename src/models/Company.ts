import { Schema, model, models, type InferSchemaType } from "mongoose";

const companySchema = new Schema(
    {
        name: { type: String, required: true, trim: true, unique: true },
        contactName: { type: String, trim: true },
        email: { type: String, trim: true, lowercase: true },
        phone: { type: String, trim: true },
        address: { type: String, trim: true },
        postcode: { type: String, trim: true },
        pricingType: {
            type: String,
            enum: ["Trade", "Partner", "Retailer"],
            default: "Trade",
        },
        markups: {
            allProducts: { type: Number, default: 0 },
            aluminium: { type: Number, default: 0 },
            roofProducts: { type: Number, default: 0 },
            glass: { type: Number, default: 0 },
        },
        customGlassPrices: [
            {
                name: { type: String, required: true },
                price: { type: Number, required: true },
            },
        ],
        priceOverrides: [
            {
                key: { type: String, required: true },
                value: { type: Number, required: true },
            },
        ],
    },
    { timestamps: true },
);

const Company = models.Company || model("Company", companySchema);

export type CompanyDocument = InferSchemaType<typeof companySchema>;

export default Company;
