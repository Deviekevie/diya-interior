import "./Bio.css";
import { motion } from "framer-motion";

const Bio = () => {
  return (
    <div className="bio-container">
      <div className="bio-wrapper">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="bio-p"
        />
      </div>
    </div>
  );
};

export default Bio;
