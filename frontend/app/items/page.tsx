"use client";

import { useEffect, useState } from "react";
import Card from "../components/Card";
import Table from "../components/Table";
import Loader from "../components/Loader";
import Protected from "../components/Protected";
import Modal from "../components/Modal";
import { useStore } from "../lib/store";

export default function ItemsPage() {
  const [page, setPage] = useState(1);
  const limit = 20;
  const items = useStore((s) => s.items);
  const loadItems = useStore((s) => s.loadItems);
  const createItem = useStore((s) => s.createItem);
  const updateItem = useStore((s) => s.updateItem);
  const deleteItem = useStore((s) => s.deleteItem);

  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    loadItems(page, limit);
  }, [page]);

  const openCreate = () => {
    setEditData(null);
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditData(item);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);

    const payload = {
      item_code: form.get("item_code"),
      item_name: form.get("item_name"),
      price: Number(form.get("price")),
      description: form.get("description"),
      image: form.get("image"),
    };

    if (editData) {
      await updateItem(editData.item_id, payload);
    } else {
      await createItem(payload);
    }

    setModalOpen(false);
  };

  const columns = [
    { key: "item_code", title: "Code" },
    { key: "item_name", title: "Name" },
    {
      key: "price",
      title: "Price",
      render: (r) => `Rp ${Number(r.price).toLocaleString()}`,
    },
    { key: "description", title: "Description" },
    {
      key: "actions",
      title: "Actions",
      render: (r) => (
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
            onClick={() => deleteItem(r.item_id)}
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
      <div className="space-y-6">
        <Card title="Items">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-semibold">Items</h2>
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
              <span className="relative z-10">+ Add Item</span>
            </button>
          </div>

          {items.length === 0 ? (
            <Loader />
          ) : (
            <>
              <Table columns={columns} rows={items} />

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
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editData ? "Edit Item" : "Add Item"}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="item_code"
              defaultValue={editData?.item_code || ""}
              placeholder="Item Code"
              className="input"
              required
            />

            <input
              name="item_name"
              defaultValue={editData?.item_name || ""}
              placeholder="Item Name"
              className="input"
              required
            />

            <input
              name="price"
              type="number"
              defaultValue={editData?.price || ""}
              placeholder="Price"
              className="input"
              required
            />

            <input
              name="image"
              defaultValue={editData?.image || ""}
              placeholder="Image URL"
              className="input"
            />

            <textarea
              name="description"
              defaultValue={editData?.description || ""}
              placeholder="Description"
              className="input h-24"
            />

            <button
              type="submit"
              className="w-full bg-green-500 py-2 rounded shadow-lg hover:bg-green-600 active:bg-green-700 transition-all"
            >
              Save
            </button>
          </form>
        </Modal>
      </div>
    </Protected>
  );
}
