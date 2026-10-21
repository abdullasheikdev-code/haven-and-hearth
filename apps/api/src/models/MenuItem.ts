import mongoose, { Schema, Document } from 'mongoose';

export interface IMenuItemDocument extends Document {
  restaurantId: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  category: string;
  description: string;
  price: number;
  imageUrl: string;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  isAvailable: boolean;
  calories?: number;
  preparationTimeMinutes: number;
  allergens: string[];
  modifiers: {
    name: string;
    options: {
      name: string;
      price: number;
    }[];
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const MenuItemSchema = new Schema<IMenuItemDocument>(
  {
    restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true, index: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, lowercase: true },
    category: { type: String, required: true, trim: true, index: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    imageUrl: { type: String, required: true },
    isVegetarian: { type: Boolean, default: false },
    isVegan: { type: Boolean, default: false },
    isGlutenFree: { type: Boolean, default: false },
    isAvailable: { type: Boolean, default: true, index: true },
    calories: { type: Number },
    preparationTimeMinutes: { type: Number, default: 15 },
    allergens: [{ type: String }],
    modifiers: [
      {
        name: { type: String, required: true },
        options: [
          {
            name: { type: String, required: true },
            price: { type: Number, default: 0 },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

MenuItemSchema.index({ restaurantId: 1, slug: 1 }, { unique: true });

export const MenuItem = mongoose.model<IMenuItemDocument>('MenuItem', MenuItemSchema);
