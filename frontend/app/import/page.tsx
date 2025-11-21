"use client";

import Card from './../components/Card';
import Button from './../components/Button';
import Loader from './../components/Loader';
import { useState } from 'react';
import Protected from './../components/Protected';
import { api } from '../lib/api';
import AnimatedPage from "./../AnimatedPage";

export default function ImportPage() {
    const [loading, setLoading] = useState(false);
    const [res, setRes] = useState(null);


    async function doImport() {
        setLoading(true);
        try {
            const r = await api.importDummy();
            setRes(r);
        } catch (e) { setRes({ error: String(e) }); }
        finally { setLoading(false); }
    }


    return (
        <AnimatedPage>
            <Protected>
                <div className="space-y-6">
                    <Card title="Import DummyJSON">
                        <Button
                            onClick={() => { if (!loading) doImport(); }}
                            aria-disabled={loading}
                            className={`relative overflow-hidden bg-gradient-to-r 
        from-blue-500 to-indigo-600 text-white 
        px-5 py-2.5 rounded-xl font-semibold 
        shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 
        transition-all duration-300 ${loading ? 'opacity-60 cursor-not-allowed pointer-events-none' : ''}`}
                        >
                            <span className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-10 transition-opacity duration-300"></span>
                            <span className="relative z-10">{loading ? 'Importing…' : 'Import now'}</span>
                        </Button>

                        {res && <pre className="mt-4 text-sm">{JSON.stringify(res, null, 2)}</pre>}
                    </Card>
                </div>
            </Protected>
        </AnimatedPage>
    );
}