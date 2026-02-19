import { Schema, model, models, type InferSchemaType } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    company: { type: String, required: true, trim: true }, // The company name they signed up with
    companyId: { type: Schema.Types.ObjectId, ref: "Company" }, // The actual assigned company
    phone: { type: String, required: true, trim: true },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true },
);

const User = models.User || model("User", userSchema);

export type UserDocument = InferSchemaType<typeof userSchema>;

export default User;
