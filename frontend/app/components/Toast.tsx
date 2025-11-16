import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';


export function Toast({ message, onClose }: { message: string; onClose?: () => void }) {
    useEffect(() => {
        const t = setTimeout(() => onClose && onClose(), 3000);
        return () => clearTimeout(t);
    }, [onClose]);


    return (
        <div className="fixed bottom-6 right-6 z-50">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="bg-panel border border-accent px-4 py-3 rounded-lg shadow-xl">
                {message}
            </motion.div>
        </div>
    );
}

(function () {
    if (typeof window === 'undefined') return;
    function showToast(text) {
        const rootId = 'jubelio-toast-root';
        let root = document.getElementById(rootId);
        if (!root) {
            root = document.createElement('div');
            root.id = rootId;
            document.body.appendChild(root);
        }
        const el = document.createElement('div');
        el.className = 'bg-panel border border-accent px-4 py-3 rounded-lg shadow-xl text-sm text-text mb-2';
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.innerText = text;
        root.appendChild(el);

        requestAnimationFrame(() => {
            el.style.transition = 'opacity 240ms ease, transform 240ms ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        });

        setTimeout(() => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            setTimeout(() => root.removeChild(el), 260);
        }, 3000);
    }


    // attach logout confirmation
    document.addEventListener('DOMContentLoaded', function () {
        const btn = document.getElementById('logoutBtn');
        if (!btn) return;
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            const ok = confirm('Are you sure you want to logout?');
            if (!ok) return showToast('Logout cancelled');

            localStorage.removeItem('token');
            showToast('You have been logged out');
            setTimeout(() => { window.location.href = '/login'; }, 700);
        });
    });
})();