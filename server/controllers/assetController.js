import mongoose from 'mongoose';
import Asset from '../models/Asset.js';

// Create a new asset
export async function createAsset(req, res) {
  try {
    const payload = {
      ...req.body,
      price: Number(req.body.price) || 0,
      createdBy: req.user.id,
    };

    // if a file was uploaded, store its URL
    if (req.file) {
      // served from http://localhost:5000/uploads/<filename>
      payload.fileUrl = `/uploads/${req.file.filename}`;
    }

    // normalise tags (can come as array or comma-separated string)
    if (Array.isArray(payload.tags)) {
      payload.tags = payload.tags
        .map((t) => String(t).trim())
        .filter(Boolean);
    } else if (typeof payload.tags === 'string') {
      payload.tags = payload.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
    } else {
      payload.tags = [];
    }

    // normalise engines (optional)
    if (Array.isArray(payload.engines)) {
      payload.engines = payload.engines.map((e) => String(e).trim()).filter(Boolean);
    } else if (typeof payload.engines === 'string') {
      payload.engines = payload.engines
        .split(',')
        .map((e) => e.trim())
        .filter(Boolean);
    }

    const asset = await Asset.create(payload);
    return res.status(201).json(asset);
  } catch (err) {
    console.error('Create asset error:', err);
    return res.status(500).json({ message: 'Server error while creating asset' });
  }
}

// Public list/search assets  —— returns a PLAIN ARRAY for SearchPage
export async function listAssets(req, res) {
  try {
    const {
      search,
      category,
      engine,
      source,
      price,
      sort,
    } = req.query;

    const filter = {};

    // category filter
    if (category) {
      filter.category = category;
    }

    // engine filter: match primary engine OR engines array
    if (engine) {
      filter.$or = [{ engine }, { engines: engine }];
    }

    // source filter: UI sends "source", DB field is sourceStore
    if (source) {
      filter.sourceStore = source;
    }

    // price filter: "free" | "paid"
    if (price === 'free') {
      filter.price = 0;
    } else if (price === 'paid') {
      filter.price = { $gt: 0 };
    }

    // base query
    let query = Asset.find(filter);

    // text / keyword search
    if (search && search.trim()) {
      // prefer text index if present
      query = query.find({
        $text: { $search: search.trim() },
      });
    }

    // sort
    let sortSpec = { downloads: -1 }; // default: most downloads
    if (sort === 'newest') {
      sortSpec = { createdAt: -1 };
    } else if (sort === 'top') {
      sortSpec = { rating: -1 };
    }

    const assets = await query.sort(sortSpec).exec();

    // IMPORTANT: SearchPage expects an array, not {items,total,...}
    return res.json(assets);
  } catch (err) {
    console.error('List assets error:', err);
    return res.status(500).json({ message: 'Server error while listing assets' });
  }
}

// Assets for the current user
export async function myAssets(req, res) {
  try {
    const userId = req.user.id;
    const assets = await Asset.find({ createdBy: userId }).sort({ createdAt: -1 });
    return res.json(assets);
  } catch (err) {
    console.error('My assets error:', err);
    return res.status(500).json({ message: 'Server error while fetching user assets' });
  }
}

// Dashboard stats for current user
export async function dashboardStats(req, res) {
  try {
    const userId = req.user.id;
    const assets = await Asset.find({ createdBy: userId });

    const totalDownloads = assets.reduce((sum, a) => sum + (a.downloads || 0), 0);

    // placeholder views, if you later add a field use that instead
    const totalViews = 0;

    const totalRevenue = assets.reduce(
      (sum, a) => sum + (a.price || 0) * (a.downloads || 0),
      0
    );

    return res.json({
      totalDownloads,
      totalLikes: 0, // no likes field yet, keep 0
      totalViews,
      totalRevenue,
      assets,
    });
  } catch (err) {
    console.error('Dashboard stats error:', err);
    return res.status(500).json({ message: 'Server error while fetching stats' });
  }
}

// Home summary for landing / hero
export async function homeSummary(req, res) {
  try {
    const latest = await Asset.find({})
      .sort({ createdAt: -1 })
      .limit(6);

    const totalAssets = await Asset.countDocuments({});
    const totalDownloads = await Asset.aggregate([
      {
        $group: {
          _id: null,
          downloads: { $sum: '$downloads' },
        },
      },
    ]);

    const downloadsCount =
      totalDownloads.length > 0 ? totalDownloads[0].downloads : 0;

    return res.json({
      totalAssets,
      totalDownloads: downloadsCount,
      latest,
    });
  } catch (err) {
    console.error('Home summary error:', err);
    return res.status(500).json({ message: 'Server error while fetching home summary' });
  }
}

// Delete asset by id (creator only)
export async function deleteAsset(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid asset id' });
    }

    const asset = await Asset.findById(id);
    if (!asset) {
      return res.status(404).json({ message: 'Asset not found' });
    }

    if (asset.createdBy?.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not allowed to delete this asset' });
    }

    await asset.deleteOne();

    return res.json({ message: 'Asset deleted successfully' });
  } catch (err) {
    console.error('Delete asset error:', err);
    return res.status(500).json({ message: 'Server error while deleting asset' });
  }
}
