// client/src/pages/Search/SearchPage.jsx
import { useEffect, useState } from "react";
import { fetchAssets } from "../../api/assetApi";
import "./search.css";

const FILE_BASE = "http://localhost:5000"; // for /uploads paths

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [engine, setEngine] = useState("");
  const [source, setSource] = useState("");
  const [price, setPrice] = useState("");          // "" | "free" | "paid"
  const [sort, setSort] = useState("downloads");   // "downloads" | "newest" | "top"
  const [format, setFormat] = useState("");        // optional file-format filter

  const [assets, setAssets] = useState([]);        // always array
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function runSearch() {
    setLoading(true);
    setError("");

    try {
      const params = {};
      if (query) params.search = query;
      if (category) params.category = category;
      if (engine) params.engine = engine;
      if (source) params.source = source;
      if (price) params.price = price;
      if (sort) params.sort = sort;
      if (format) params.format = format;

      const res = await fetchAssets(params);

      const data = res?.data;
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.items)
        ? data.items
        : [];

      setAssets(list);
    } catch (err) {
      console.error("Search error", err);
      setAssets([]);
      setError(err.response?.data?.message || "Failed to load assets");
    } finally {
      setLoading(false);
    }
  }

  // initial load
  useEffect(() => {
    runSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatNumber = (n) =>
    typeof n === "number" ? n.toLocaleString("en-IN") : n || "0";

  const formatCurrency = (n) =>
    typeof n === "number" ? `$${n.toFixed(2)}` : "$0.00";

  return (
    <div className="search-root">
      <h2 className="search-title">Search Assets</h2>

      {/* Search Bar */}
      <div className="search-bar-box">
        <input
          type="text"
          placeholder="Search for pixel art, 3D models, sound effects..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
          onKeyDown={(e) => {
            if (e.key === "Enter") runSearch();
          }}
        />
      </div>

      {/* Filters */}
      <div className="filter-box">
        <h3 className="filter-title">Filters</h3>

        <div className="filter-row">
          {/* Category */}
          <div className="filter-select-wrapper">
            <select
              className="filter-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="3D Models">3D Models</option>
              <option value="Characters">Characters</option>
              <option value="Environments">Environments</option>
              <option value="UI/UX">UI / UX</option>
              <option value="Textures">Textures</option>
              <option value="Audio">Audio</option>
            </select>
          </div>

          {/* Engine */}
          <div className="filter-select-wrapper">
            <select
              className="filter-select"
              value={engine}
              onChange={(e) => setEngine(e.target.value)}
            >
              <option value="">All Engines</option>
              <option value="Unity">Unity</option>
              <option value="Unreal Engine">Unreal Engine</option>
              <option value="Godot">Godot</option>
              <option value="GameMaker">GameMaker</option>
              <option value="Blender">Blender</option>
            </select>
          </div>

          {/* Source store */}
          <div className="filter-select-wrapper">
            <select
              className="filter-select"
              value={source}
              onChange={(e) => setSource(e.target.value)}
            >
              <option value="">All Sources</option>
              <option value="User">User Created</option>
              <option value="Kenney">Kenney</option>
              <option value="itch.io">itch.io</option>
              <option value="Unity Asset Store">Unity Asset Store</option>
              <option value="Unreal Marketplace">Unreal Marketplace</option>
            </select>
          </div>

          {/* Price bucket */}
          <div className="filter-select-wrapper">
            <select
              className="filter-select"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            >
              <option value="">All Prices</option>
              <option value="free">Free</option>
              <option value="paid">Paid</option>
            </select>
          </div>

          {/* Sort order */}
          <div className="filter-select-wrapper">
            <select
              className="filter-select"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="downloads">Most Downloads</option>
              <option value="newest">Newest</option>
              <option value="top">Top Rated</option>
            </select>
          </div>

          {/* Optional file-format text filter */}
          <input
            type="text"
            placeholder="Format (png, blend, wav...)"
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="search-input"
            style={{
              maxWidth: "200px",
              padding: "0.55rem 0.8rem",
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") runSearch();
            }}
          />

          <button
            type="button"
            className="primary-btn"
            style={{ marginLeft: "auto" }}
            onClick={runSearch}
          >
            Apply
          </button>
        </div>
      </div>

      {/* Found count / status */}
      {loading && <p className="asset-count">Loading…</p>}
      {!loading && !error && (
        <p className="asset-count">
          Found {Array.isArray(assets) ? assets.length : 0} assets
        </p>
      )}
      {error && <p className="error-text">{error}</p>}

      {/* Asset Grid */}
      <div className="search-grid">
        {Array.isArray(assets) &&
          assets.map((asset) => {
            // ---------- preview image: thumbnail preferred, fallback to fileUrl if image ----------
            let imagePath = null;

            if (asset.thumbnail) {
              imagePath = asset.thumbnail;
            } else if (asset.fileUrl) {
              const lower = asset.fileUrl.toLowerCase();
              if (
                lower.endsWith(".png") ||
                lower.endsWith(".jpg") ||
                lower.endsWith(".jpeg") ||
                lower.endsWith(".webp") ||
                lower.endsWith(".gif")
              ) {
                imagePath = asset.fileUrl;
              }
            }

            const imageUrl = imagePath
              ? imagePath.startsWith("http")
                ? imagePath
                : `${FILE_BASE}${imagePath}`
              : null;

            const fileUrl = asset.fileUrl
              ? asset.fileUrl.startsWith("http")
                ? asset.fileUrl
                : `${FILE_BASE}${asset.fileUrl}`
              : null;

            return (
              <div className="search-card" key={asset._id}>
                {/* cover image */}
                <div className="search-card-thumb">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={asset.title || "Asset preview"}
                      className="search-card-thumb-img"
                    />
                  ) : (
                    <div className="search-card-thumb-placeholder">
                      No preview
                    </div>
                  )}
                </div>

                {/* text content */}
                <div className="search-card-badge">
                  <span>{asset.sourceStore || "User Created"}</span>
                </div>

                <div className="search-card-body">
                  <div className="search-card-header">
                    <span className="category">
                      {asset.category || "Uncategorized"}
                    </span>
                    <span className="price-tag">
                      {asset.price > 0 ? "PAID" : "FREE"}
                    </span>
                  </div>

                  <h3 className="asset-title">{asset.title}</h3>
                  <p className="asset-desc">
                    {asset.description || "No description"}
                  </p>

                  <div className="tag-row">
                    {asset.tags?.map((t) => (
                      <span key={t} className="tag">
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Download button */}
                  {fileUrl && (
                    <div className="download-row">
                      <a
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="download-btn"
                      >
                        Download
                      </a>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

        {!loading &&
          !error &&
          Array.isArray(assets) &&
          assets.length === 0 && (
            <p style={{ gridColumn: "1 / -1" }}>
              No assets match these filters.
            </p>
          )}
      </div>
    </div>
  );
}
