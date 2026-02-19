import { Schema, model, models, type InferSchemaType } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    company: { type: String, trim: true }, // The company name they signed up with (optional now)
    companyId: { type: Schema.Types.ObjectId, ref: "Company" }, // The actual assigned company
    phone: { type: String, trim: true },
    role: {
      type: String,
      enum: ["user", "admin", "staff"],
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

// Force delete to handle HMR with schema changes
if (models.User) {
  delete models.User;
}

const User = model("User", userSchema);

export type UserDocument = InferSchemaType<typeof userSchema>;

export default User;
