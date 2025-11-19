// client/src/pages/Home/HomePage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchHomeSummary } from "../../api/assetApi";
import "./home.css";

const FILE_BASE = "http://localhost:5000";

export default function HomePage() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalAssets: 0,
    totalDownloads: 0,
  });
  const [latest, setLatest] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetchHomeSummary();
        if (cancelled) return;

        const data = res?.data || {};
        setStats({
          totalAssets: data.totalAssets || 0,
          totalDownloads: data.totalDownloads || 0,
        });
        setLatest(Array.isArray(data.latest) ? data.latest : []);
      } catch (err) {
        console.error("Home summary error:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleStartSearch = () => navigate("/search");
  const handleUploadAssets = () => navigate("/assets/new");

  return (
    <div className="home-root">
      {/* HERO */}
      <section className="home-hero">
        <h1 className="home-title">Unified Game Asset Platform</h1>
        <p className="home-subtitle">
          Stop wasting hours browsing multiple asset stores. Search, discover, and manage
          game assets from Unity, Unreal, Kenney, and more — all in one place.
        </p>

        <div className="home-hero-actions">
          <button
            type="button"
            className="home-primary-btn"
            onClick={handleStartSearch}
          >
            Start Searching
          </button>
          <button
            type="button"
            className="home-secondary-btn"
            onClick={handleUploadAssets}
          >
            Upload Assets
          </button>
        </div>

        <div className="home-hero-meta">
          Currently tracking{" "}
          <span className="home-emphasis">{stats.totalAssets}</span> assets.
        </div>
      </section>

      {/* FEATURE CARDS */}
      <section className="home-features">
        <div className="home-feature-card">
          <div className="home-feature-icon">⚡</div>
          <h3 className="home-feature-title">Fast Search</h3>
          <p className="home-feature-text">
            Search across multiple asset stores simultaneously. Find what you need in
            seconds, not hours.
          </p>
        </div>
        <div className="home-feature-card">
          <div className="home-feature-icon">🗂</div>
          <h3 className="home-feature-title">Organize Library</h3>
          <p className="home-feature-text">
            Save and organize your favorite assets in one unified library. No more
            scattered bookmarks.
          </p>
        </div>
        <div className="home-feature-card">
          <div className="home-feature-icon">🤝</div>
          <h3 className="home-feature-title">Share Assets</h3>
          <p className="home-feature-text">
            Upload and share your own asset packs with the community. Build your
            portfolio.
          </p>
        </div>
      </section>

      {/* RECENTLY ADDED */}
      <section className="home-recent">
        <h2 className="home-recent-title">Recently added</h2>

        {loading && <p className="home-recent-status">Loading…</p>}
        {!loading && latest.length === 0 && (
          <p className="home-recent-status">No assets uploaded yet.</p>
        )}

        {!loading && latest.length > 0 && (
          <div className="home-recent-grid">
            {latest.map((asset) => {
              const imagePath = asset.thumbnail || asset.fileUrl || null;
              const imageUrl = imagePath
                ? imagePath.startsWith("http")
                  ? imagePath
                  : `${FILE_BASE}${imagePath}`
                : null;

              return (
                <div className="home-recent-card" key={asset._id}>
                  {/* preview image (same idea as Search page) */}
                  <div className="home-recent-thumb">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={asset.title || "Asset preview"}
                        className="home-recent-thumb-img"
                      />
                    ) : (
                      <div className="home-recent-thumb-placeholder">
                        No preview
                      </div>
                    )}
                  </div>

                  {/* text area */}
                  <div className="home-recent-body">
                    <div className="home-recent-meta-top">
                      <span className="home-recent-category">
                        {asset.category || "Uncategorized"}
                      </span>
                      <span className="home-recent-engine">
                        {asset.engine || "Engine"}
                      </span>
                    </div>

                    <div className="home-recent-title-block">
                      <div className="home-recent-name">
                        {asset.title || "(Untitled)"}
                      </div>
                      <div className="home-recent-desc">
                        {asset.description || "No description"}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
