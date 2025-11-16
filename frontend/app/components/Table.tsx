import React from 'react';


export default function Table({ columns, rows }) {
    return (
        <table className="w-full text-left border-collapse">
            <thead>
                <tr>
                    {columns.map((c) => (
                        <th key={c.key} className="px-4 py-2 border-b border-glass">{c.title}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {rows.map((r, idx) => (
                    <tr key={idx} className="hover:bg-glass transition">
                        {columns.map((c) => (
                            <td key={c.key} className="px-4 py-2 border-b border-glass">
                                {c.render ? c.render(r) : r[c.key]}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}