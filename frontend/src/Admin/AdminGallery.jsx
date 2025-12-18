import { deleteImage as deleteImageAPI } from "../services/api";

const AdminGallery = ({ images, refresh }) => {
  const deleteImage = async (id) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;

    try {
      const res = await deleteImageAPI(id);
      if (res.success) {
        refresh();
      } else {
        alert("Failed to delete image: " + (res.message || "Unknown error"));
      }
    } catch (error) {
      alert("Failed to delete image: " + (error.response?.data?.message || "Please try again"));
      console.error("Delete error:", error);
    }
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginTop: "30px" }}>
      {images.map((img) => (
        <div key={img._id} style={{ position: "relative", borderRadius: "8px", overflow: "hidden", boxShadow: "0 4px 10px rgba(0,0,0,0.1)", background: "#fff" }}>
              <img
                src={img.optimizedUrl || img.imageUrl}
                alt={img.title || img.description || "Gallery Image"}
                style={{ width: "100%", height: "200px", objectFit: "cover" }}
              />

          <button onClick={() => deleteImage(img._id)} style={{ position: "absolute", top: "8px", right: "8px", background: "red", color: "#fff", border: "none", borderRadius: "50%", width: "30px", height: "30px", cursor: "pointer", fontWeight: "bold" }}>×</button>

          <div style={{ padding: "8px 10px", fontSize: "14px", color: "#333", borderTop: "1px solid #eee" }}>
            {img.title && (
              <div style={{ fontWeight: "600", marginBottom: "4px" }}>
                {img.title}
              </div>
            )}
            {img.category && (
              <div style={{ fontSize: "12px", color: "#666", marginBottom: "4px" }}>
                Category: {img.category}
              </div>
            )}
            {img.description && (
              <div style={{ fontSize: "12px", color: "#666" }}>
                {img.description}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminGallery;
