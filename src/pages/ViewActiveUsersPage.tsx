import React, { useEffect, useState } from "react";
import Loader from "../components/Loader";
import jsPDF from "jspdf";
import "jspdf-autotable";
import API_BASE_URL from "../Config";

interface ActiveUser {
  id: number;
  fullName: string;
  email: string;
  mobile: string;
  college: string;
  department: string;
  yearOfPassing: number;
  state: string;
  district: string;
  totalEvents: number;
}

const ViewActiveUsersPage: React.FC = () => {
  const [users, setUsers] = useState<ActiveUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchNumber, setSearchNumber] = useState('');

  const filteredUsers = users.filter(user => {
    const digits = searchNumber.replace(/\D/g, '').slice(0, 4);
    if (!digits) return true;
    const padded = digits.padStart(4, '0');
    const targetId = `S${padded}`;
    return (user as any).id === targetId || user.id === (targetId as any);
  });

  useEffect(() => {
    setLoading(true);
    let url = `${API_BASE_URL}/registrations/registered-users`;

    fetch(url)
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error("Error fetching active users:", err))
      .finally(() => setLoading(false));
  }, []);

  const exportToPDF = () => {
    const symposiumLabel = 'SAMHITA';
    const doc = new jsPDF();
    doc.text(`Active Users List - ${symposiumLabel}`, 14, 15);
    (doc as any).autoTable({
      startY: 20,
      head: [["Name", "Email", "Mobile", "College", "Department", "Symposia", "Events"]],
      body: filteredUsers.map(u => [
        u.fullName,
        u.email,
        u.mobile,
        u.college,
        u.department,
        (u as any).symposiums || 'N/A',
        u.totalEvents.toString(),
      ]),
    });
    doc.save(`ActiveUsers_${symposiumLabel}.pdf`);
  };

  if (loading) return <Loader />;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Active Users</h1>

      <div className="flex flex-col gap-4 mb-6">
        <div className="p-4 bg-gray-800 rounded-lg shadow-sm border border-gray-700">
          <label className="block text-sm text-gray-300 mb-2">Search by User ID number (e.g., 1 for S0001)</label>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Enter number only"
            value={searchNumber}
            onChange={(e) => setSearchNumber(e.target.value)}
            className="w-full px-4 py-2 bg-gray-900/70 border border-gray-700 rounded-lg text-white"
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={exportToPDF}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Export to PDF
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-600 rounded-lg">
          <thead className="bg-gray-700 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Mobile</th>
              <th className="py-3 px-4 text-left">College</th>
              <th className="py-3 px-4 text-left">Department</th>
              <th className="py-3 px-4 text-left">Symposia</th>
              <th className="py-3 px-4 text-center">Total Items</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, idx) => (
              <tr key={idx} className="hover:bg-gray-800/40">
                <td className="py-3 px-4">{user.fullName}</td>
                <td className="py-3 px-4">{user.email}</td>
                <td className="py-3 px-4">{user.mobile}</td>
                <td className="py-3 px-4">{user.college}</td>
                <td className="py-3 px-4">{user.department}</td>
                <td className="py-3 px-4 text-gold-400 font-medium">{(user as any).symposiums || 'N/A'}</td>
                <td className="py-3 px-4 text-center font-bold">{user.totalEvents}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewActiveUsersPage;



