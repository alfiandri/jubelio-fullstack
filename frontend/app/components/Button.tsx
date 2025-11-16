import React from 'react';
import { motion } from 'framer-motion';


export default function Button({ children, onClick, className = '' }) {
    return (
        <motion.button
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.04 }}
            onClick={onClick}
            className={`px-3 py-2 rounded-md font-medium ${className}`}
        >
            {children}
        </motion.button>
    );
}