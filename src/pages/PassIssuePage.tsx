import React, { useEffect, useState } from 'react';
import API_BASE_URL from '../Config';
import ThemedModal from '../components/ThemedModal';

interface Pass {
  id: number;
  name: string;
}

interface PassIssueRow {
  userId: string;
  fullName: string;
  email: string;
  mobile: string;
  passId: number;
  passName: string;
  issued: number;
}

const PassIssuePage: React.FC = () => {
  const [passes, setPasses] = useState<Pass[]>([]);
  const [selectedPassId, setSelectedPassId] = useState<string>('all');
  const [rows, setRows] = useState<PassIssueRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '' });
  const [searchNumber, setSearchNumber] = useState('');

  const showModal = (title: string, message: string) => {
    setModal({ isOpen: true, title, message });
  };

  const fetchPasses = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/passes`);
      if (response.ok) {
        const data = await response.json();
        setPasses(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Failed to load passes:', error);
    }
  };

  const fetchRows = async (passId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/pass-issues/list?passId=${passId}`);
      if (!response.ok) {
        throw new Error('Failed to load pass issues.');
      }
      const data = await response.json();
      setRows(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load pass issues:', error);
      showModal('Error', 'Failed to load pass issues.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPasses();
    fetchRows('all');
  }, []);

  useEffect(() => {
    fetchRows(selectedPassId);
  }, [selectedPassId]);

  const handleIssue = async (row: PassIssueRow) => {
    try {
      const response = await fetch(`${API_BASE_URL}/pass-issues/issue`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: row.userId, passId: row.passId })
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to issue pass.');
      }
      fetchRows(selectedPassId);
    } catch (error: any) {
      showModal('Error', error.message || 'Failed to issue pass.');
    }
  };

  const handleRevert = async (row: PassIssueRow) => {
    try {
      const response = await fetch(`${API_BASE_URL}/pass-issues/revert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: row.userId, passId: row.passId })
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to revert pass.');
      }
      fetchRows(selectedPassId);
    } catch (error: any) {
      showModal('Error', error.message || 'Failed to revert pass.');
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

      <h1 className="text-2xl font-bold mb-4">Pass Issue</h1>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">Pass Type</label>
        <select
          value={selectedPassId}
          onChange={(e) => setSelectedPassId(e.target.value)}
          className="w-full p-3 rounded-md bg-black/60 border border-gold-500/40 text-white"
        >
          <option value="all">All Passes</option>
          {passes.map((pass) => (
            <option key={pass.id} value={String(pass.id)}>
              {pass.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">Search by User ID number (e.g., 1 for S0001)</label>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="Enter number only"
          value={searchNumber}
          onChange={(e) => setSearchNumber(e.target.value)}
          className="w-full p-3 rounded-md bg-black/60 border border-gold-500/40 text-white"
        />
      </div>

      {isLoading ? (
        <p className="text-gray-400">Loading pass issues...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-black/70 border border-gold-500/30 rounded-lg overflow-hidden">
            <thead className="bg-black/80">
              <tr>
                <th className="py-3 px-4 text-left">User ID</th>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Mobile</th>
                <th className="py-3 px-4 text-left">Pass</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td className="py-6 px-4 text-center text-gray-400" colSpan={7}>
                    No pass registrations found.
                  </td>
                </tr>
              )}
              {rows
                .filter((row) => {
                  const digits = searchNumber.replace(/\D/g, '').slice(0, 4);
                  if (!digits) return true;
                  const padded = digits.padStart(4, '0');
                  const targetId = `S${padded}`;
                  return row.userId === targetId;
                })
                .map((row) => (
                <tr key={`${row.userId}-${row.passId}`} className="border-t border-gold-500/10">
                  <td className="py-3 px-4">{row.userId}</td>
                  <td className="py-3 px-4">{row.fullName}</td>
                  <td className="py-3 px-4">{row.email}</td>
                  <td className="py-3 px-4">{row.mobile}</td>
                  <td className="py-3 px-4">{row.passName}</td>
                  <td className="py-3 px-4">
                    {row.issued ? (
                      <span className="text-green-400 font-semibold">Issued</span>
                    ) : (
                      <span className="text-yellow-400 font-semibold">Not Issued</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {row.issued ? (
                      <button
                        type="button"
                        onClick={() => handleRevert(row)}
                        className="px-4 py-2 rounded-md text-xs font-semibold bg-gray-600 text-gray-200 hover:bg-gray-500 transition"
                      >
                        Revert
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleIssue(row)}
                        className="px-4 py-2 rounded-md text-xs font-semibold bg-samhita-600 text-white hover:bg-samhita-700 transition"
                      >
                        Issue
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PassIssuePage;
