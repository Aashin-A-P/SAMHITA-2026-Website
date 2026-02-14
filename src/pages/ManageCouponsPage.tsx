import React, { useEffect, useState } from 'react';
import API_BASE_URL from '../Config';
import ThemedModal from '../components/ThemedModal';

interface Coupon {
  id: number;
  name: string;
  limit: number;
  discountPercent: number;
  createdAt: string;
}

const ManageCouponsPage: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [name, setName] = useState('');
  const [limit, setLimit] = useState('');
  const [discountPercent, setDiscountPercent] = useState('');
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '' });

  const showModal = (title: string, message: string) => {
    setModal({ isOpen: true, title, message });
  };

  const fetchCoupons = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/coupons`);
      if (response.ok) {
        const data = await response.json();
        setCoupons(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Failed to fetch coupons:', error);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/coupons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, limit: Number(limit), discountPercent: Number(discountPercent) }),
      });
      if (!response.ok) {
        const err = await response.json();
        showModal('Error', err.message || 'Failed to create coupon.');
        return;
      }
      setName('');
      setLimit('');
      setDiscountPercent('');
      fetchCoupons();
      showModal('Success', 'Coupon created successfully.');
    } catch (error) {
      console.error('Failed to create coupon:', error);
      showModal('Error', 'Failed to create coupon.');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    try {
      const response = await fetch(`${API_BASE_URL}/coupons/${editing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editing.name,
          limit: Number(editing.limit),
          discountPercent: Number(editing.discountPercent),
        }),
      });
      if (!response.ok) {
        const err = await response.json();
        showModal('Error', err.message || 'Failed to update coupon.');
        return;
      }
      setEditing(null);
      fetchCoupons();
      showModal('Success', 'Coupon updated successfully.');
    } catch (error) {
      console.error('Failed to update coupon:', error);
      showModal('Error', 'Failed to update coupon.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this coupon?')) return;
    try {
      const response = await fetch(`${API_BASE_URL}/coupons/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        const err = await response.json();
        showModal('Error', err.message || 'Failed to delete coupon.');
        return;
      }
      fetchCoupons();
      showModal('Success', 'Coupon deleted successfully.');
    } catch (error) {
      console.error('Failed to delete coupon:', error);
      showModal('Error', 'Failed to delete coupon.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <ThemedModal
        isOpen={modal.isOpen}
        onClose={() => setModal({ isOpen: false, title: '', message: '' })}
        title={modal.title}
        message={modal.message}
      />

      <h1 className="text-2xl font-bold mb-4">Manage Coupons</h1>

      <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Create Coupon</h2>
        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Coupon Code</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm text-gray-900 bg-white"
              placeholder="SAMHITA26"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Limit</label>
            <input
              type="number"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm text-gray-900 bg-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Discount %</label>
            <input
              type="number"
              value={discountPercent}
              onChange={(e) => setDiscountPercent(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm text-gray-900 bg-white"
              required
            />
          </div>
          <div className="md:col-span-3 flex justify-end">
            <button
              type="submit"
              className="w-full md:w-auto bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Create Coupon
            </button>
          </div>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Existing Coupons</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Limit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount %</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {coupons.map((coupon) => (
                <tr key={coupon.id} className="text-gray-900">
                  <td className="px-6 py-4 whitespace-nowrap">{coupon.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{coupon.limit}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{coupon.discountPercent}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => setEditing({ ...coupon })}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(coupon.id)}
                      className="text-red-600 hover:text-red-900 ml-4"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {coupons.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-6 text-center text-gray-400">
                    No coupons created yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Update Coupon</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Coupon Code</label>
                <input
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm text-gray-900 bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Limit</label>
                <input
                  type="number"
                  value={editing.limit}
                  onChange={(e) => setEditing({ ...editing, limit: Number(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm text-gray-900 bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Discount %</label>
                <input
                  type="number"
                  value={editing.discountPercent}
                  onChange={(e) => setEditing({ ...editing, discountPercent: Number(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm text-gray-900 bg-white"
                  required
                />
              </div>
              <div className="flex justify-end gap-4">
                <button type="button" onClick={() => setEditing(null)} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400">
                  Cancel
                </button>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCouponsPage;
