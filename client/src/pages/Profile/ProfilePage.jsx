// client/src/pages/Profile/ProfilePage.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { fetchMyAssets } from "../../api/assetApi";
import "./profile.css";

export default function ProfilePage() {
  const { user } = useAuth() || {};
  const [libraryCount, setLibraryCount] = useState(0);
  const [loadingLibrary, setLoadingLibrary] = useState(true);

  const [fullName, setFullName] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [bio, setBio] = useState("");
  const [website, setWebsite] = useState("");

  const [engines, setEngines] = useState([
    { id: "unity", name: "Unity", version: "2022.3 LTS", connected: true },
    { id: "unreal", name: "Unreal Engine", version: "5.3", connected: false },
    { id: "godot", name: "Godot", version: "4.2", connected: true },
  ]);

  useEffect(() => {
    let cancelled = false;

    async function loadLibraryCount() {
      try {
        const res = await fetchMyAssets();
        if (cancelled) return;
        const list = Array.isArray(res?.data) ? res.data : [];
        setLibraryCount(list.length);
      } catch (_) {}
      finally {
        if (!cancelled) setLoadingLibrary(false);
      }
    }

    loadLibraryCount();
    return () => { cancelled = true; };
  }, []);

  const handleSaveProfile = (e) => {
    e.preventDefault();
  };

  const toggleEngine = (id) => {
    setEngines((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, connected: !e.connected } : e
      )
    );
  };

  const joinedLabel =
    user?.createdAt
      ? new Date(user.createdAt).toLocaleDateString("en-IN", {
          year: "numeric",
          month: "long",
        })
      : "March 2024";

  const usernameLabel = user?.username || "username";
  const emailLabel = email || user?.email || "user@example.com";

  return (
    <div className="profile-root">
      <section className="profile-header">
        <div className="profile-header-left">
          <div className="profile-avatar">
            <span className="profile-avatar-icon">👤</span>
          </div>

          <div className="profile-header-text">
            <div className="profile-username">{usernameLabel}</div>
            <div className="profile-email">{emailLabel}</div>
            <div className="profile-meta-row">
              <span>Joined {joinedLabel}</span>
              <span className="profile-dot">•</span>
              <span>
                {loadingLibrary ? "…" : `${libraryCount} Assets in Library`}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="profile-main-grid">
        <div className="profile-card">
          <h3 className="profile-card-title">Profile Information</h3>

          <form className="profile-form" onSubmit={handleSaveProfile}>
            <label className="profile-field">
              <span className="profile-label">Full Name</span>
              <input
                type="text"
                className="profile-input"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </label>

            <label className="profile-field">
              <span className="profile-label">Email</span>
              <input
                type="email"
                className="profile-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>

            <label className="profile-field">
              <span className="profile-label">Bio</span>
              <textarea
                className="profile-textarea"
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </label>

            <label className="profile-field">
              <span className="profile-label">Website</span>
              <input
                type="url"
                className="profile-input"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </label>

            <div className="profile-form-actions">
              <button type="submit" className="profile-save-btn">
                Save Changes
              </button>
            </div>
          </form>
        </div>

        <div className="profile-card">
          <h3 className="profile-card-title">Connected Game Engines</h3>
          <p className="profile-card-subtitle">
            Connect your game engines to enable direct asset importing.
          </p>

          <div className="engine-list">
            {engines.map((engine) => (
              <div key={engine.id} className="engine-item">
                <div className="engine-left">
                  <span
                    className={
                      "engine-status-dot " +
                      (engine.connected ? "engine-status-on" : "engine-status-off")
                    }
                  />
                  <div className="engine-text">
                    <div className="engine-name">{engine.name}</div>
                    <div className="engine-version">{engine.version}</div>
                  </div>
                </div>

                <button
                  type="button"
                  className={
                    "engine-action-btn " +
                    (engine.connected ? "engine-action-connected" : "engine-action-connect")
                  }
                  onClick={() => toggleEngine(engine.id)}
                >
                  {engine.connected ? "Connected" : "Connect"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
