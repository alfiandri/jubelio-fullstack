"use client";

import Card from './components/Card';
import AnimatedPage from "./AnimatedPage";


export default function Home() {
  return (
    <AnimatedPage>
      <div className="grid gap-6">
        <div className="grid grid-cols-2 gap-6">
          <Card>
            <h3 className="text-lg font-semibold">Total Items</h3>
            <p className="mt-2 text-3xl">—</p>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold">Monthly Revenue</h3>
            <p className="mt-2 text-3xl">—</p>
          </Card>
        </div>

        <Card>
          <h3 className="text-lg font-semibold">Recent Transactions</h3>
          <p className="small mt-2">Check Transactions page for data</p>
        </Card>
      </div>
    </AnimatedPage>
  );
}