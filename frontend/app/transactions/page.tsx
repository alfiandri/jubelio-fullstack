"use client";

import Card from './../components/Card';
import Table from './../components/Table';
import Loader from './../components/Loader';
import { useEffect } from 'react';
import { useStore } from '../lib/store';
import Protected from './../components/Protected';
import AnimatedPage from "./../AnimatedPage";

export default function TransactionsPage() {
  const trx = useStore((s: any) => s.transactions);
  const loadTransactions = useStore((s: any) => s.loadTransactions);


  useEffect(() => { loadTransactions(); }, [loadTransactions]);


  const columns = [
    { key: 'trx_id', title: 'ID' },
    { key: 'date', title: 'Date', render: (r) => new Date(r.created_date).toLocaleString() },
    { key: 'item_name', title: 'Item' },
    { key: 'qty', title: 'QTY' },
    { key: 'total', title: 'Total', render: (r) => `Rp ${r.amount.toLocaleString()}` },
  ];


  return (
    <AnimatedPage>
      <Protected>
        <div className="space-y-6">
          <Card>
            <h2 className="text-xl font-semibold mb-4">Transactions</h2>
            {trx.length === 0 ? (
              <Loader />
            ) : (
              <Table columns={columns} rows={trx} />
            )}
          </Card>
        </div>
      </Protected>
    </AnimatedPage>
  );
}