import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback, useRef } from "react";
import { getImagesByCategory, getAllImages } from "../services/api";

const GalleryUnit = () => {
  const { category } = useParams();
  const navigate = useNavigate();

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const observerRef = useRef(null);

  // Fetch images
  const fetchImages = useCallback(async (pageNum = 1, append = false) => {
    try {
      if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError("");

      let res;
      if (category) {
        // Get by category (no pagination for category view)
        res = await getImagesByCategory(category);
        setImages(Array.isArray(res.images) ? res.images : []);
        setHasMore(false);
      } else {
        // Get all with pagination
        res = await getAllImages({ page: pageNum, limit: 20, category: "" });
        const newImages = Array.isArray(res.images) ? res.images : [];
        
        if (append) {
          setImages((prev) => [...prev, ...newImages]);
        } else {
          setImages(newImages);
        }
        
        setHasMore(
          res.pagination && pageNum < res.pagination.pages
        );
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load images. Please try again.");
      setImages([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [category]);

  // Initial load
  useEffect(() => {
    fetchImages(1, false);
    setPage(1);
    setImages([]);
  }, [category, fetchImages]);

  // Intersection Observer for infinite scroll
  const lastImageElementRef = useCallback(
    (node) => {
      if (loading || loadingMore) return;
      if (observerRef.current) observerRef.current.disconnect();
      
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && !category) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchImages(nextPage, true);
        }
      });
      
      if (node) observerRef.current.observe(node);
    },
    [loading, loadingMore, hasMore, page, category, fetchImages]
  );

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "100px" }}>
        <p>Loading images...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "80px 60px", minHeight: "80vh" }}>
      {/* 🔙 Back Button */}
      <button
        onClick={() => navigate(-1)}
        style={{
          marginBottom: "30px",
          padding: "10px 18px",
          borderRadius: "8px",
          border: "none",
          background: "#111",
          color: "#fff",
          cursor: "pointer",
          fontWeight: "600",
          transition: "background 0.2s",
        }}
        onMouseOver={(e) => (e.target.style.background = "#333")}
        onMouseOut={(e) => (e.target.style.background = "#111")}
      >
        ← Back
      </button>

      {/* Title */}
      <h1
        style={{
          textTransform: "capitalize",
          marginBottom: "30px",
          fontSize: "2rem",
        }}
      >
        {category ? `${category} Gallery` : "Gallery"}
      </h1>

      {/* Error Message */}
      {error && (
        <div
          style={{
            padding: "12px",
            background: "#fee2e2",
            color: "#991b1b",
            borderRadius: "6px",
            marginBottom: "20px",
          }}
        >
          {error}
        </div>
      )}

      {/* Images */}
      {images.length === 0 && !loading ? (
        <p style={{ textAlign: "center", padding: "40px", color: "#666" }}>
          No images uploaded {category ? `for ${category}` : "yet"}.
        </p>
      ) : (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              gap: "24px",
            }}
          >
            {images.map((img, index) => (
              <div
                key={img._id}
                ref={
                  index === images.length - 1 && hasMore && !category
                    ? lastImageElementRef
                    : null
                }
                style={{
                  borderRadius: "14px",
                  overflow: "hidden",
                  background: "#fff",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  cursor: "pointer",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 15px 40px rgba(0,0,0,0.15)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.12)";
                }}
              >
                <img
                  src={img.optimizedUrl || img.imageUrl}
                  alt={img.title || img.description || category || "Gallery Image"}
                  loading="lazy"
                  style={{
                    width: "100%",
                    height: "220px",
                    objectFit: "cover",
                    display: "block",
                  }}
                />

                {/* Title and Description */}
                <div
                  style={{
                    padding: "12px",
                    borderTop: "1px solid #eee",
                  }}
                >
                  {img.title && (
                    <h3
                      style={{
                        fontSize: "16px",
                        fontWeight: "600",
                        marginBottom: "6px",
                        color: "#111",
                      }}
                    >
                      {img.title}
                    </h3>
                  )}
                  {img.description && (
                    <p
                      style={{
                        fontSize: "14px",
                        color: "#666",
                        margin: 0,
                        lineHeight: "1.4",
                      }}
                    >
                      {img.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Loading More Indicator */}
          {loadingMore && (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <p>Loading more images...</p>
            </div>
          )}

          {/* End of Results */}
          {!hasMore && images.length > 0 && !category && (
            <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
              <p>No more images to load.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default GalleryUnit;
