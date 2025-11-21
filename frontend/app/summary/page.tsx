"use client";

import Card from './../components/Card';
import Loader from './../components/Loader';
import { useEffect } from 'react';
import { useStore } from '../lib/store';
import Protected from './../components/Protected';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import AnimatedPage from "./../AnimatedPage";

export default function SummaryPage() {
  const summary = useStore((s: any) => s.summary);
  const loadSummary = useStore((s: any) => s.loadSummary);

  useEffect(() => { loadSummary(); }, [loadSummary]);

  const data = Array.isArray(summary) ? summary.map((r) => ({ month: r.month, total_amount: Number(r.total_amount) })) : [];

  return (
    <AnimatedPage>
      <Protected>
        <div className="grid gap-6">
          <Card title="Monthly Summary">
            {data.length === 0 ? (
              <Loader />
            ) : (
              <div className="w-full h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="total_amount" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </Card>
        </div>
      </Protected>
    </AnimatedPage>
  );
}