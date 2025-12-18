import "./Gallery.css";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Gallery = () => {
  const items = [
    { src: "/Images/About/gallery-img-1.jpg", text: "Kitchen", path: "kitchen" },
    { src: "/Images/About/gallery-img-2.jpg", text: "Living", path: "living" },
    { src: "/Images/About/gallery-img-3.jpg", text: "Wardrobe", path: "wardrobe" },
    { src: "/Images/About/gallery-img-4.jpg", text: "TV", path: "tv" },
    { src: "/Images/About/gallery-img-5.jpg", text: "Ceiling", path: "ceiling" },
    { src: "/Images/About/gallery-img-6.jpg", text: "Study", path: "study" }
  ];

  return (
    <div className="gallery-container">
      <motion.h1
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
      >
        Our <span className="yellow">gallery.</span>
      </motion.h1>

      <div className="gallery-images">
        {items.map((item, i) => (
          <Link
            key={i}
            to={`/gallery/${item.path}`}
            className="hover-card"
            style={{ textDecoration: "none" }}
          >
            <img src={item.src} alt={item.text} />
            <div className="hover-text">{item.text}</div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
