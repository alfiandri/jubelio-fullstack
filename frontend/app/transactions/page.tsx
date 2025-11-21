"use client";

import { useEffect, useState } from "react";
import Card from "../components/Card";
import Table from "../components/Table";
import Loader from "../components/Loader";
import Protected from "../components/Protected";
import AnimatedPage from "./../AnimatedPage";
import Modal from "../components/Modal";
import { useStore } from "../lib/store";

export default function TransactionsPage() {
  const [page, setPage] = useState(1);
  const limit = 20;
  const transactions = useStore((s: any) => s.transactions);
  const items = useStore((s: any) => s.items);
  const loadTransactions = useStore((s: any) => s.loadTransactions);
  const loadItems = useStore((s: any) => s.loadItems);

  const createTrx = useStore((s: any) => s.createTransaction);
  const updateTrx = useStore((s: any) => s.updateTransaction);
  const deleteTrx = useStore((s: any) => s.deleteTransaction);

  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    loadItems(1, 200);
    loadTransactions(page, limit);
  }, [page]);

  const openCreate = () => {
    setEditData(null);
    setModalOpen(true);
  };

  const openEdit = (row: any) => {
    setEditData(row);
    setModalOpen(true);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const form = new FormData(e.target);

    const payload = {
      item_id: Number(form.get("item_id")),
      qty: Number(form.get("qty")),
    };

    if (editData) {
      await updateTrx(editData.trx_id, payload);
    } else {
      await createTrx(payload);
    }

    setModalOpen(false);
  };

  const columns = [
    { key: "trx_id", title: "ID" },
    {
      key: "created_date",
      title: "Date",
      render: (r: any) => new Date(r.created_date).toLocaleString(),
    },
    { key: "item_name", title: "Item" },
    { key: "qty", title: "QTY" },
    {
      key: "amount",
      title: "Total",
      render: (r: any) => `Rp ${Number(r.amount).toLocaleString()}`,
    },
    {
      key: "actions",
      title: "Actions",
      render: (r: any) => (
        <div className="flex gap-3">
          <button
            onClick={() => openEdit(r)}
            className="
            px-3 py-1.5 rounded-lg text-xs font-medium
            bg-blue-500/10 text-blue-400
            hover:bg-blue-500/20 hover:text-blue-300
            transition-all duration-200"
          >
            Edit
          </button>

          <button
            onClick={() => deleteTrx(r.trx_id)}
            className="
            px-3 py-1.5 rounded-lg text-xs font-medium
            bg-red-500/10 text-red-400
            hover:bg-red-500/20 hover:text-red-300
            transition-all duration-200
            "
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <Protected>
      <AnimatedPage>
        <div className="space-y-6">
          <Card title="Transactions">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-semibold">Transactions</h2>
              <button
                onClick={openCreate}
                className="
                relative overflow-hidden
                bg-gradient-to-r from-blue-500 to-indigo-600
                text-white font-semibold text-sm
                px-5 py-2.5 rounded-xl
                shadow-lg shadow-blue-500/30
                hover:shadow-xl hover:shadow-blue-500/40
                transition-all duration-300
                "
              >
                <span className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-10 transition-opacity duration-300"></span>
                <span className="relative z-10">+ Add Transaction</span>
              </button>
            </div>

            {transactions.length === 0 ? (
              <Loader />
            ) : (
              <>
                <Table columns={columns} rows={transactions} />
                {/* Pagination */}
                <div className="flex justify-between items-center mt-4">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="
                  px-4 py-2 rounded-lg text-sm font-medium
                  bg-gray-800 text-gray-200
                  disabled:opacity-30 disabled:cursor-not-allowed
                  hover:bg-gray-700 transition
                  "
                  >
                    ← Prev
                  </button>

                  <span className="text-gray-300 text-sm">
                    Page {page}
                  </span>

                  <button
                    onClick={() => setPage(page + 1)}
                    className="
                  px-4 py-2 rounded-lg text-sm font-medium
                  bg-gray-800 text-gray-200
                  hover:bg-gray-700 transition
                  "
                  >
                    Next →
                  </button>
                </div>
              </>
            )}
          </Card>
        </div>

        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editData ? "Edit Transaction" : "Add Transaction"}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <select
              name="item_id"
              defaultValue={editData?.item_id || ""}
              className="input"
              required
            >
              <option value="">Select Item</option>
              {items.map((it: any) => (
                <option key={it.item_id} value={it.item_id}>
                  {it.item_name} — Rp {Number(it.price).toLocaleString()}
                </option>
              ))}
            </select>

            <input
              type="number"
              name="qty"
              placeholder="Quantity"
              defaultValue={editData?.qty || ""}
              className="input"
              required
            />

            {editData && (
              <div className="p-2 bg-gray-800 rounded text-sm">
                Auto-calculated total:
                <span className="font-semibold">
                  Rp {Number(editData.amount).toLocaleString()}
                </span>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-green-500 py-2 rounded shadow-lg hover:bg-green-600 active:bg-green-700 transition-all"
            >
              Save
            </button>
          </form>
        </Modal>

      </AnimatedPage>
    </Protected>
  );
}
