import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadImage } from "../services/api";

const GalleryUpload = () => {
  const navigate = useNavigate();

  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Image preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedImage || !category) {
      setStatus("❌ Image and category are required");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedImage);
    formData.append("category", category);
    formData.append("title", title);
    formData.append("description", description);

    try {
      setLoading(true);
      setStatus("");
      setUploadProgress(0);

      const res = await uploadImage(formData, (progress) => {
        setUploadProgress(progress);
      });

      if (res.success) {
        setStatus("✅ Image uploaded successfully!");
        // Reset form
        setSelectedImage(null);
        setPreview(null);
        setTitle("");
        setCategory("");
        setDescription("");
        setUploadProgress(0);
        
        // Optionally redirect after 1 second
        setTimeout(() => {
          navigate("/admin");
        }, 1500);
      } else {
        setStatus("❌ Upload failed: " + (res.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Upload error:", err);
      setStatus(
        "❌ Upload failed: " +
          (err.response?.data?.message || "Please try again")
      );
      setUploadProgress(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <button style={styles.backButton} onClick={() => navigate("/admin")}>
          ← Back to Dashboard
        </button>

        <h2 style={styles.title}>Gallery Upload</h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={styles.input}
          />

          {preview && (
            <img
              src={preview}
              alt="Preview"
              style={{
                width: "100%",
                maxHeight: "200px",
                marginTop: "10px",
                objectFit: "contain",
                borderRadius: "8px",
              }}
            />
          )}

          <input
            type="text"
            placeholder="Image title (optional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={styles.input}
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={styles.input}
            required
          >
            <option value="">Select category *</option>
            <option value="kitchen">Kitchen</option>
            <option value="living">Living</option>
            <option value="wardrobe">Wardrobe</option>
            <option value="tv">TV</option>
            <option value="ceiling">Ceiling</option>
            <option value="study">Study</option>
          </select>

          <textarea
            placeholder="Image description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ ...styles.input, minHeight: "80px", resize: "vertical" }}
            rows={3}
          />

          {/* Upload Progress */}
          {loading && uploadProgress > 0 && (
            <div style={{ width: "100%" }}>
              <div
                style={{
                  width: "100%",
                  height: "8px",
                  background: "#e5e7eb",
                  borderRadius: "4px",
                  overflow: "hidden",
                  marginTop: "8px",
                }}
              >
                <div
                  style={{
                    width: `${uploadProgress}%`,
                    height: "100%",
                    background: "#470068ff",
                    transition: "width 0.3s ease",
                  }}
                />
              </div>
              <p
                style={{
                  fontSize: "12px",
                  color: "#666",
                  marginTop: "4px",
                  textAlign: "center",
                }}
              >
                Uploading: {uploadProgress}%
              </p>
            </div>
          )}

          <button
            type="submit"
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload Image"}
          </button>
        </form>

        {status && (
          <p
            style={{
              marginTop: "12px",
              padding: "8px",
              borderRadius: "6px",
              background: status.includes("✅")
                ? "#d1fae5"
                : "#fee2e2",
              color: status.includes("✅") ? "#065f46" : "#991b1b",
              fontSize: "14px",
              textAlign: "center",
            }}
          >
            {status}
          </p>
        )}
      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#f4f6f8", padding: "40px" },
  card: { width: "100%", maxWidth: "400px", background: "#fff", padding: "30px", borderRadius: "12px", boxShadow: "0 10px 30px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column", alignItems: "center" },
  backButton: { alignSelf: "flex-start", padding: "8px 14px", borderRadius: "6px", border: "none", background: "#e5e7eb", color: "#111", fontWeight: "600", cursor: "pointer", marginBottom: "10px" },
  title: { fontSize: "22px", fontWeight: "700", marginBottom: "20px" },
  form: { width: "100%", display: "flex", flexDirection: "column", gap: "12px" },
  input: { padding: "10px", borderRadius: "6px", border: "1px solid #ccc" },
  button: { padding: "12px", borderRadius: "6px", border: "none", background: "#470068ff", color: "#fff", fontWeight: "600", cursor: "pointer" },
};

export default GalleryUpload;
