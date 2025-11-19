import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createAssetApi } from "../../api/assetApi";
import "./createAsset.css";

export default function CreateAssetPage() {
  const [step, setStep] = useState(1);

  const [basic, setBasic] = useState({
    title: "",
    description: "",
    category: "",
  });

  const [details, setDetails] = useState({
    fileFormats: "",
    engines: {
      Unity: false,
      "Unreal Engine": false,
      Godot: false,
      GameMaker: false,
      Blender: false,
    },
    tags: [],
    tagInput: "",
    price: "0",
  });

  const [previewFile, setPreviewFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  // **actual asset file** to upload
  const [assetFile, setAssetFile] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!previewFile) {
      setPreviewUrl("");
      return;
    }
    const url = URL.createObjectURL(previewFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [previewFile]);

  const categoryOptions = [
    "Characters",
    "Environments",
    "UI/UX",
    "Audio",
    "VFX",
    "3D Models",
    "Textures",
    "Animations",
  ];

  const handleBasicChange = (e) => {
    const { name, value } = e.target;
    setBasic((prev) => ({ ...prev, [name]: value }));
  };

  const handleDetailsChange = (e) => {
    const { name, value } = e.target;
    setDetails((prev) => ({ ...prev, [name]: value }));
  };

  const toggleEngine = (engine) => {
    setDetails((prev) => ({
      ...prev,
      engines: { ...prev.engines, [engine]: !prev.engines[engine] },
    }));
  };

  const handleTagInputChange = (e) => {
    setDetails((prev) => ({ ...prev, tagInput: e.target.value }));
  };

  const addTag = () => {
    const val = details.tagInput.trim();
    if (!val) return;
    if (details.tags.includes(val)) return;
    setDetails((prev) => ({
      ...prev,
      tags: [...prev.tags, val],
      tagInput: "",
    }));
  };

  const removeTag = (tag) => {
    setDetails((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handlePreviewChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreviewFile(file);
  };

  const handleAssetFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAssetFile(file);
  };

  const goNext = () => {
    if (step === 1) {
      if (!basic.title.trim() || !basic.description.trim() || !basic.category) {
        alert("Fill title, description, and category");
        return;
      }
    }
    if (step === 2) {
      if (!details.fileFormats.trim()) {
        alert("File formats are required");
        return;
      }
      if (!assetFile) {
        alert("Please choose an asset file to upload.");
        return;
      }
    }
    setStep((s) => Math.min(3, s + 1));
  };

  const goBack = () => setStep((s) => Math.max(1, s - 1));

  const handlePublish = async (e) => {
    e.preventDefault();

    const enginesSelected = Object.keys(details.engines).filter(
      (k) => details.engines[k]
    );

    const formData = new FormData();
    formData.append("title", basic.title);
    formData.append("description", basic.description);
    formData.append("category", basic.category);
    formData.append("fileFormats", details.fileFormats);
    formData.append("price", details.price);

    enginesSelected.forEach((engine) =>
      formData.append("engines", engine)
    );
    details.tags.forEach((tag) => formData.append("tags", tag));

    if (assetFile) {
      formData.append("assetFile", assetFile);
    }

    try {
      const res = await createAssetApi(formData);
      if (res.status === 201) {
        alert("Asset published!");
        navigate("/library");
      } else {
        alert("Unexpected response from server");
      }
    } catch (err) {
      console.error("Publish asset error:", err);
      alert(err.response?.data?.message || "Failed to publish asset.");
    }
  };

  return (
    <div className="create-root">
      <h2 className="create-title">Create Asset Pack</h2>
      <p className="create-subtitle">
        Share your game assets with the indie dev community.
      </p>

      <div className="create-stepper">
        <StepIndicator label="Basic Info" number={1} active={step >= 1} current={step === 1} />
        <StepIndicator label="Details"   number={2} active={step >= 2} current={step === 2} />
        <StepIndicator label="Review"    number={3} active={step >= 3} current={step === 3} />
      </div>

      <form className="create-card" onSubmit={handlePublish}>
        {step === 1 && (
          <section>
            <h3 className="section-title">Basic Information</h3>

            <label className="field-label">
              Asset Pack Title *
              <input
                name="title"
                type="text"
                placeholder="e.g., Pixel Art Character Pack"
                value={basic.title}
                onChange={handleBasicChange}
              />
            </label>

            <label className="field-label">
              Description *
              <textarea
                name="description"
                rows={4}
                placeholder="Describe your asset pack, what's included, and how it can be used..."
                value={basic.description}
                onChange={handleBasicChange}
              />
            </label>

            <label className="field-label">
              Category *
              <select
                name="category"
                value={basic.category}
                onChange={handleBasicChange}
              >
                <option value="">Select category</option>
                {categoryOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>

            <div className="field-label">
              Preview Image
              <div
                className="preview-dropzone"
                onClick={() =>
                  document.getElementById("preview-input")?.click()
                }
              >
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="preview-image"
                  />
                ) : (
                  <div className="preview-placeholder">
                    <span className="preview-icon">⬆</span>
                    <p>Click to upload preview image</p>
                    <p className="preview-hint">PNG, JPG up to 10MB</p>
                  </div>
                )}
              </div>
              <input
                id="preview-input"
                type="file"
                accept="image/*"
                onChange={handlePreviewChange}
                style={{ display: "none" }}
              />
            </div>
          </section>
        )}

        {step === 2 && (
          <section>
            <h3 className="section-title">Asset Details</h3>

            <label className="field-label">
              File Formats (comma separated) *
              <input
                name="fileFormats"
                type="text"
                placeholder="e.g., PNG, PSD, FBX"
                value={details.fileFormats}
                onChange={handleDetailsChange}
              />
            </label>

            <div className="field-label">
              Compatible Engines *
              <div className="engine-grid">
                {Object.keys(details.engines).map((engine) => (
                  <button
                    type="button"
                    key={engine}
                    className={
                      details.engines[engine]
                        ? "engine-pill engine-pill-active"
                        : "engine-pill"
                    }
                    onClick={() => toggleEngine(engine)}
                  >
                    {engine}
                  </button>
                ))}
              </div>
            </div>

            <div className="field-label">
              Asset File *
              <input
                type="file"
                onChange={handleAssetFileChange}
              />
              <p className="preview-hint">
                Upload the actual pack (zip, unitypackage, etc.).
              </p>
            </div>

            <div className="field-label">
              Tags
              <div className="tags-row">
                <input
                  type="text"
                  placeholder="Add tags..."
                  value={details.tagInput}
                  onChange={handleTagInputChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                />
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={addTag}
                >
                  +
                </button>
              </div>
              <div className="tag-chip-row">
                {details.tags.map((t) => (
                  <span
                    key={t}
                    className="tag-chip"
                    onClick={() => removeTag(t)}
                  >
                    {t} ✕
                  </span>
                ))}
              </div>
            </div>

            <label className="field-label">
              Price (USD) *
              <input
                name="price"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00 (enter 0 for free)"
                value={details.price}
                onChange={handleDetailsChange}
              />
            </label>
          </section>
        )}

        {step === 3 && (
          <section>
            <h3 className="section-title">Review &amp; Publish</h3>

            <div className="review-preview">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="review-image"
                />
              ) : (
                <div className="review-image placeholder-block" />
              )}
            </div>

            <div className="review-meta">
              <h4>{basic.title || "(No title)"}</h4>
              <p className="review-desc">
                {basic.description || "(No description)"}
              </p>

              <div className="review-grid">
                <div>
                  <div className="review-label">Category</div>
                  <div>{basic.category || "-"}</div>
                </div>
                <div>
                  <div className="review-label">Price</div>
                  <div>
                    {Number(details.price) > 0 ? `₹ ${details.price}` : "Free"}
                  </div>
                </div>
                <div>
                  <div className="review-label">Formats</div>
                  <div>{details.fileFormats || "-"}</div>
                </div>
                <div>
                  <div className="review-label">Compatible Engines</div>
                  <div>
                    {Object.keys(details.engines)
                      .filter((k) => details.engines[k])
                      .join(", ") || "-"}
                  </div>
                </div>
              </div>

              <div className="review-tags">
                {details.tags.map((t) => (
                  <span key={t} className="tag-chip">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </section>
        )}

        <div className="create-footer">
          {step > 1 && (
            <button
              type="button"
              className="secondary-btn"
              onClick={goBack}
            >
              Back
            </button>
          )}

          {step < 3 && (
            <button
              type="button"
              className="primary-btn"
              onClick={goNext}
            >
              Next: {step === 1 ? "Details" : "Review"}
            </button>
          )}

          {step === 3 && (
            <button type="submit" className="primary-btn">
              Publish Asset Pack
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

function StepIndicator({ label, number, active, current }) {
  return (
    <div className="step-item">
      <div
        className={
          current
            ? "step-circle step-circle-current"
            : active
            ? "step-circle step-circle-active"
            : "step-circle"
        }
      >
        {number}
      </div>
      <span className="step-label">{label}</span>
    </div>
  );
}
