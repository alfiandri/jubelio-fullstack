"use client";

import { useEffect, useState } from "react";
import Card from "../components/Card";
import Table from "../components/Table";
import Loader from "../components/Loader";
import Protected from "../components/Protected";
import Modal from "../components/Modal";
import { useStore } from "../lib/store";

export default function ItemsPage() {
  const items = useStore((s) => s.items);
  const loadItems = useStore((s) => s.loadItems);
  const createItem = useStore((s) => s.createItem);
  const updateItem = useStore((s) => s.updateItem);
  const deleteItem = useStore((s) => s.deleteItem);

  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    loadItems();
  }, []);

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
            className="text-blue-400 hover:text-blue-300"
          >
            Edit
          </button>
          <button
            onClick={() => deleteItem(r.item_id)}
            className="text-red-400 hover:text-red-300"
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
        <Card>
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-semibold">Items</h2>
            <button
              onClick={openCreate}
              className="px-4 py-2 bg-accent rounded hover:bg-cyan-600 text-sm"
            >
              + Add Item
            </button>
          </div>

          {items.length === 0 ? (
            <Loader />
          ) : (
            <Table columns={columns} rows={items} />
          )}
        </Card>

        {/* Modal */}
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
              className="w-full bg-accent py-2 rounded hover:bg-cyan-600"
            >
              Save
            </button>
          </form>
        </Modal>
      </div>
    </Protected>
  );
}
