// ES module model for assets (with upload + search support)
import mongoose from 'mongoose';

const assetSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },

    // simple category label: "Characters", "Environments", "UI/UX", etc.
    category: { type: String },

    // comma-separated in UI, stored as single string
    fileFormats: { type: String, default: '' },

    // full list of compatible engines
    engines: {
      type: [String],
      default: [], // e.g. ["Unity","Godot"]
    },

    // primary engine, handy for filters
    engine: { type: String },

    // tags from the create form
    tags: {
      type: [String],
      default: [],
    },

    // original external source if ever used (Unity Store, Kenney, itch.io, etc.)
    sourceStore: { type: String },

    // optional external link (if the pack lives elsewhere)
    externalUrl: { type: String },

    // price in USD
    price: { type: Number, default: 0 },

    // thumbnail URL if you later wire preview upload
    thumbnail: { type: String },

    // **uploaded asset file** – relative path served from /uploads
    fileUrl: { type: String },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    downloads: { type: Number, default: 0 },

    rating: { type: Number, default: 0 },
    ratingsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// text search support for Search page
assetSchema.index({
  title: 'text',
  description: 'text',
  tags: 'text',
});

const Asset = mongoose.model('Asset', assetSchema);
export default Asset;
