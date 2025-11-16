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
                    <Card>
                        <h2 className="text-xl font-semibold mb-4">Import DummyJSON</h2>
                        <Button className="bg-accent text-bg" onClick={doImport}>{loading ? 'Importing...' : 'Import now'}</Button>
                        {res && <pre className="mt-4 text-sm">{JSON.stringify(res, null, 2)}</pre>}
                    </Card>
                </div>
            </Protected>
        </AnimatedPage>
    );
}