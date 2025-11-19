// client/src/pages/Dashboard/DashboardPage.jsx
import { useEffect, useState } from "react";
import {
  fetchDashboardStats,
  fetchMyAssets,
  deleteAsset,
} from "../../api/assetApi";
import "./dashboard.css";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalAssets: 0,
    downloads: 0,
    likes: 0,
    views: 0,
    revenue: 0,
  });
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [statsRes, assetsRes] = await Promise.all([
          fetchDashboardStats(),
          fetchMyAssets(),
        ]);
        if (cancelled) return;

        const s = statsRes.data || {};
        const list = assetsRes.data || [];

        const totalDownloads = s.downloads || 0;
        const totalViews = totalDownloads * 3; // fake multiplier
        const totalLikes = Math.round(totalDownloads * 0.2);
        const totalRevenue = list.reduce(
          (sum, a) => sum + (a.price || 0) * (a.downloads || 0),
          0
        );

        setStats({
          totalAssets: s.totalAssets || list.length || 0,
          downloads: totalDownloads,
          likes: totalLikes,
          views: totalViews,
          revenue: totalRevenue,
        });
        setAssets(list);
      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // use axiosClient via deleteAsset helper (same baseURL + auth)
  const handleDelete = async (assetId) => {
    if (!assetId) return;

    try {
      await deleteAsset(assetId);

      // Recompute assets + stats from remaining list
      setAssets((prev) => {
        const next = prev.filter((a) => a._id !== assetId);

        const totalDownloads = next.reduce(
          (sum, a) => sum + (a.downloads || 0),
          0
        );
        const totalViews = totalDownloads * 3;
        const totalLikes = Math.round(totalDownloads * 0.2);
        const totalRevenue = next.reduce(
          (sum, a) => sum + (a.price || 0) * (a.downloads || 0),
          0
        );

        setStats((old) => ({
          ...old,
          totalAssets: next.length,
          downloads: totalDownloads,
          likes: totalLikes,
          views: totalViews,
          revenue: totalRevenue,
        }));

        return next;
      });
    } catch (err) {
      console.error("Delete asset error:", err);
    }
  };

  const formatNumber = (n) =>
    typeof n === "number"
      ? n.toLocaleString("en-IN")
      : n || "0";

  const formatCurrency = (n) =>
    typeof n === "number"
      ? `$${n.toFixed(2)}`
      : "$0.00";

  const formatDate = (iso) => {
    if (!iso) return "-";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "-";
    return d.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <div className="dashboard-root">
      <header className="dashboard-header">
        <h2 className="dashboard-title">Developer Dashboard</h2>
        <p className="dashboard-subtitle">
          Track your asset performance and manage your uploads.
        </p>
      </header>

      {/* Summary cards */}
      <section className="dashboard-metrics">
        <MetricCard
          label="Total Downloads"
          value={formatNumber(stats.downloads)}
          delta="+12.5% this month"
          icon="⬇"
        />
        <MetricCard
          label="Total Likes"
          value={formatNumber(stats.likes)}
          delta="+8.3% this month"
          icon="♥"
        />
        <MetricCard
          label="Total Views"
          value={formatNumber(stats.views)}
          delta="+15.2% this month"
          icon="👁"
        />
        <MetricCard
          label="Total Revenue"
          value={formatCurrency(stats.revenue)}
          delta="+21.7% this month"
          icon="↗"
        />
      </section>

      {/* Published assets table */}
      <section className="dashboard-table-section">
        <div className="dashboard-table-header">
          <h3>My Published Assets</h3>
          <span className="dashboard-table-count">
            {stats.totalAssets} assets
          </span>
        </div>

        <div className="dashboard-table-wrapper">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th className="col-asset">Asset</th>
                <th>Downloads</th>
                <th>Views</th>
                <th>Revenue</th>
                <th>Status</th>
                <th className="col-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={6} className="dashboard-table-empty">
                    Loading…
                  </td>
                </tr>
              )}

              {!loading && assets.length === 0 && (
                <tr>
                  <td colSpan={6} className="dashboard-table-empty">
                    You haven&apos;t published any assets yet.
                  </td>
                </tr>
              )}

              {!loading &&
                assets.map((asset) => {
                  const downloads = asset.downloads || 0;
                  const views = downloads * 3;
                  const revenue = (asset.price || 0) * downloads;

                  return (
                    <tr key={asset._id}>
                      <td className="asset-cell">
                        <div className="asset-name">
                          {asset.title || "(Untitled asset)"}
                        </div>
                        <div className="asset-meta-line">
                          Published {formatDate(asset.createdAt)}
                        </div>
                      </td>
                      <td>{formatNumber(downloads)}</td>
                      <td>{formatNumber(views)}</td>
                      <td>{formatCurrency(revenue)}</td>
                      <td>
                        <span className="status-pill">Published</span>
                      </td>
                      <td className="asset-actions">
                        <button
                          type="button"
                          className="icon-btn"
                          title="Edit (not implemented)"
                        >
                          ✏
                        </button>
                        <button
                          type="button"
                          className="icon-btn"
                          title="Delete"
                          onClick={() => handleDelete(asset._id)}
                        >
                          🗑
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function MetricCard({ label, value, delta, icon }) {
  return (
    <div className="metric-card">
      <div className="metric-top">
        <span className="metric-label">{label}</span>
        <span className="metric-icon">{icon}</span>
      </div>
      <div className="metric-value">{value}</div>
      <div className="metric-delta">{delta}</div>
    </div>
  );
}
