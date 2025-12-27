// src/Admin/Admin.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { deleteReview } from "../services/api";
import AdminGallery from "./AdminGallery";
import "./Admin.css";

// Admin Reviews Component
const AdminReviews = ({ reviews, refresh }) => {
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      const res = await deleteReview(id);
      if (res.success) {
        refresh();
      } else {
        alert("Failed to delete review: " + (res.message || "Unknown error"));
      }
    } catch (error) {
      alert("Failed to delete review: " + (error.response?.data?.message || "Please try again"));
      console.error("Delete review error:", error);
    }
  };

  return (
    <div className="admin-reviews-grid">
      {reviews.map((review) => (
        <div key={review._id} className="admin-review-card">
          <button
            onClick={() => handleDelete(review._id)}
            className="admin-review-delete-btn"
            aria-label="Delete review"
          >
            ×
          </button>

          <div className="admin-review-content">
            <div className="admin-review-stars">
              {"⭐ ".repeat(Math.round(review.rating || 0))}
            </div>
            <div className="admin-review-message">
              "{review.message}"
            </div>
            <div className="admin-review-name">
              - {review.name}
            </div>
            {review.createdAt && (
              <div className="admin-review-date">
                {new Date(review.createdAt).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

const Admin = () => {
  const navigate = useNavigate();
  const [queries, setQueries] = useState([]);
  const [images, setImages] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("queries"); // "queries", "gallery", or "reviews"

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

  const fetchReviews = async () => {
    try {
      const res = await api.get("/reviews");
      setReviews(Array.isArray(res.data?.reviews) ? res.data.reviews : []);
    } catch (err) {
      console.error(err);
      setReviews([]);
    }
  };

  const refreshGallery = () => {
    fetchImages();
  };

  const refreshReviews = () => {
    fetchReviews();
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchQueries(), fetchImages(), fetchReviews()]);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return <p style={{ padding: "50px", textAlign: "center" }}>Loading...</p>;
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <button className="admin-upload-btn" onClick={() => navigate("/admin/gallery-upload")}>
          + Upload Image
        </button>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        <button
          onClick={() => setActiveTab("queries")}
          className={`admin-tab-btn ${activeTab === "queries" ? "active" : ""}`}
        >
          Contact Queries ({queries.length})
        </button>
        <button
          onClick={() => setActiveTab("gallery")}
          className={`admin-tab-btn ${activeTab === "gallery" ? "active" : ""}`}
        >
          Gallery ({images.length})
        </button>
        <button
          onClick={() => setActiveTab("reviews")}
          className={`admin-tab-btn ${activeTab === "reviews" ? "active" : ""}`}
        >
          Reviews ({reviews.length})
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
      ) : activeTab === "gallery" ? (
        <>
          {images.length === 0 ? (
            <p style={{ marginTop: "20px", color: "#666" }}>
              No images uploaded yet.
            </p>
          ) : (
            <AdminGallery images={images} refresh={refreshGallery} />
          )}
        </>
      ) : (
        <>
          {reviews.length === 0 ? (
            <p style={{ marginTop: "20px", color: "#666" }}>
              No reviews yet.
            </p>
          ) : (
            <AdminReviews reviews={reviews} refresh={refreshReviews} />
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
