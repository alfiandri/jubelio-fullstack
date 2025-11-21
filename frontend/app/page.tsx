"use client";

import { useEffect } from "react";
import { useStore } from "./lib/store";
import Card from "./components/Card";
import AnimatedPage from "./AnimatedPage";
import Loader from "./components/Loader";

export default function Home() {
  const totalItems = useStore((s: any) => s.totalItems);
  const monthlyRevenue = useStore((s: any) => s.monthlyRevenue);
  const recentTransactions = useStore((s: any) => s.recentTransactions);

  const loadDashboard = useStore((s: any) => s.loadDashboard);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const isLoading =
    totalItems === null ||
    monthlyRevenue === null ||
    !Array.isArray(recentTransactions);

  return (
    <AnimatedPage>
      <div className="grid gap-6">

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <Card title="Total Items">
            {isLoading ? (
              <Loader />
            ) : (
              <p className="mt-2 text-4xl font-bold text-green-400">
                {totalItems}
              </p>
            )}
          </Card>

          <Card title="Monthly Revenue">
            {isLoading ? (
              <Loader />
            ) : (
              <p className="mt-2 text-4xl font-bold text-blue-400">
                Rp {monthlyRevenue.toLocaleString()}
              </p>
            )}
          </Card>

        </div>

        {/* RECENT TRANSACTIONS */}
        <Card title="Recent Transactions">
          {isLoading ? (
            <Loader />
          ) : recentTransactions.length === 0 ? (
            <p className="text-gray-400">No recent transactions</p>
          ) : (
            <div className="space-y-2">
              {recentTransactions.map((t: any) => (
                <div
                  key={t.trx_id}
                  className="flex justify-between border-b border-white/10 pb-2"
                >
                  <div>
                    <p className="font-medium">{t.item_name}</p>
                    <p className="text-sm text-gray-400">
                      {new Date(t.created_date).toLocaleString()}
                    </p>
                  </div>

                  <p className="font-semibold">
                    Rp {t.amount.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>

      </div>
    </AnimatedPage>
  );
}
