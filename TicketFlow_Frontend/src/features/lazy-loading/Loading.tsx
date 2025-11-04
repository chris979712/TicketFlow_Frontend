import { motion } from "framer-motion";
import "./Loading.css";

export function Loading() {
    return (
        <div className="loading-container">
        <motion.div
            className="loading-spinner"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        />
        <motion.p
            className="loading-text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
        >
            Cargando...
        </motion.p>
        </div>
    );
}
