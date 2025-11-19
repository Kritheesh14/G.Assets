import { useEffect, useState } from "react";
import { fetchMyAssets } from "../../api/assetApi";
import "./library.css";

const FILE_BASE = "http://localhost:5000"; // backend origin

export default function LibraryPage() {
  const [assets, setAssets] = useState([]);
  const [activeTab, setActiveTab] = useState("All");

  useEffect(() => {
    fetchMyAssets()
      .then((res) => setAssets(res.data || []))
      .catch((err) => {
        console.error("Fetch my assets error:", err);
      });
  }, []);

  const categories = ["All", "Characters", "Environments", "UI/UX", "Audio"];

  const filteredAssets =
    activeTab === "All"
      ? assets
      : assets.filter((a) => a.category === activeTab);

  const handleDownload = (asset) => {
    if (!asset.fileUrl) {
      alert("No file uploaded for this asset.");
      return;
    }
    const url = FILE_BASE + asset.fileUrl;
    window.open(url, "_blank");
  };

  return (
    <div className="library-root">
      <h2 className="library-title">My Asset Library</h2>
      <p className="library-subtitle">
        {assets.length} assets in your collection
      </p>

      <div className="library-tabs">
        {categories.map((cat) => {
          const count =
            cat === "All"
              ? assets.length
              : assets.filter((a) => a.category === cat).length;
          return (
            <button
              key={cat}
              className={
                activeTab === cat
                  ? "library-tab library-tab-active"
                  : "library-tab"
              }
              onClick={() => setActiveTab(cat)}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      <div className="library-grid">
        {filteredAssets.map((asset) => (
          <div className="library-card" key={asset._id}>
            <div className="library-card-header">
              <span className="badge">User Created</span>
              <span className="category-label">{asset.category}</span>
            </div>

            <h3 className="asset-title">{asset.title}</h3>
            <p className="asset-desc">{asset.description}</p>

            <div className="library-meta">
              <div>
                <span className="meta-label">Formats</span>
                <span className="meta-value">
                  {asset.fileFormats || "-"}
                </span>
              </div>
              <div>
                <span className="meta-label">Price</span>
                <span className="meta-value">
                  {asset.price > 0 ? `$${asset.price}` : "Free"}
                </span>
              </div>
              <div>
                <span className="meta-label">Engines</span>
                <span className="meta-value">
                  {(asset.engines || []).join(", ") || "-"}
                </span>
              </div>
            </div>

            <button
              className="library-download-btn"
              onClick={() => handleDownload(asset)}
            >
              Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
