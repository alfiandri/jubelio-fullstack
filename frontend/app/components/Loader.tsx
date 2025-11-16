import React from 'react';


export default function Loader() {
    return (
        <div className="flex items-center justify-center py-6">
            <div className="w-10 h-10 border-4 border-accent border-dashed rounded-full animate-spin" />
        </div>
    );
}