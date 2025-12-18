// src/Admin/Admin.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import AdminGallery from "./AdminGallery";

const Admin = () => {
  const navigate = useNavigate();
  const [queries, setQueries] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("queries"); // "queries" or "gallery"

  const fetchQueries = async () => {
    try {
      const res = await api.get("/contact");
      // Contact API returns array directly or wrapped in data
      setQueries(Array.isArray(res.data) ? res.data : res.data.contacts || []);
    } catch (err) {
      console.error(err);
      setQueries([]);
    }
  };

  const fetchImages = async () => {
    try {
      const res = await api.get("/gallery", { params: { limit: 50 } });
      setImages(res.data.images || []);
    } catch (err) {
      console.error(err);
      setImages([]);
    }
  };

  const refreshGallery = () => {
    fetchImages();
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchQueries(), fetchImages()]);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return <p style={{ padding: "50px", textAlign: "center" }}>Loading...</p>;
  }

  return (
    <div style={{ padding: "40px", maxWidth: "1400px", margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <h1>Admin Dashboard</h1>
        <button
          style={{
            padding: "10px 20px",
            borderRadius: "6px",
            background: "#470068ff",
            color: "#fff",
            cursor: "pointer",
            border: "none",
            fontWeight: "600",
          }}
          onClick={() => navigate("/admin/gallery-upload")}
        >
          + Upload Image
        </button>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "30px",
          borderBottom: "2px solid #e5e7eb",
        }}
      >
        <button
          onClick={() => setActiveTab("queries")}
          style={{
            padding: "12px 24px",
            background: "transparent",
            border: "none",
            borderBottom:
              activeTab === "queries" ? "3px solid #470068ff" : "3px solid transparent",
            color: activeTab === "queries" ? "#470068ff" : "#666",
            cursor: "pointer",
            fontWeight: activeTab === "queries" ? "600" : "400",
            transition: "all 0.2s",
          }}
        >
          Contact Queries ({queries.length})
        </button>
        <button
          onClick={() => setActiveTab("gallery")}
          style={{
            padding: "12px 24px",
            background: "transparent",
            border: "none",
            borderBottom:
              activeTab === "gallery" ? "3px solid #470068ff" : "3px solid transparent",
            color: activeTab === "gallery" ? "#470068ff" : "#666",
            cursor: "pointer",
            fontWeight: activeTab === "gallery" ? "600" : "400",
            transition: "all 0.2s",
          }}
        >
          Gallery ({images.length})
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "queries" ? (

        <>
          {queries.length === 0 ? (
            <p style={{ marginTop: "20px", color: "#666" }}>No queries yet.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  background: "#fff",
                  borderRadius: "8px",
                  overflow: "hidden",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              >
                <thead>
                  <tr>
                    <th style={th}>Name</th>
                    <th style={th}>Email</th>
                    <th style={th}>Phone</th>
                    <th style={th}>Message</th>
                    <th style={th}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {queries.map((q) => (
                    <tr key={q._id}>
                      <td style={td}>{q.name}</td>
                      <td style={td}>{q.email}</td>
                      <td style={td}>{q.phone || "N/A"}</td>
                      <td style={td}>{q.message}</td>
                      <td style={td}>
                        {q.createdAt
                          ? new Date(q.createdAt).toLocaleDateString()
                          : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      ) : (
        <>
          {images.length === 0 ? (
            <p style={{ marginTop: "20px", color: "#666" }}>
              No images uploaded yet.
            </p>
          ) : (
            <AdminGallery images={images} refresh={refreshGallery} />
          )}
        </>
      )}
    </div>
  );
};

const th = {
  border: "1px solid #ccc",
  padding: "8px",
  background: "#f0f0f0",
  textAlign: "left",
};

const td = {
  border: "1px solid #ccc",
  padding: "8px",
};

export default Admin;
