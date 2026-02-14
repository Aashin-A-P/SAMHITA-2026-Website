import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom'; // Added useSearchParams
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Loader from '../components/Loader';
import API_BASE_URL from '../Config'; // adjust path if needed

interface Registration {
  id: number;
  userId: string;
  userName: string;
  email: string;
  college: string;
  mobileNumber: string;
  transactionId: string;
  transactionUsername: string;
  transactionTime: string;
  transactionDate: string;
  transactionAmount: number;
}

interface EventDetails {
  eventName: string;
  coordinatorName: string;
  coordinatorContactNo: string;
}

const ViewEventRegistrationsPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const [searchParams] = useSearchParams();
  const symposium = searchParams.get('symposium');
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [presentSet, setPresentSet] = useState<Set<string>>(new Set());
  const [eventDetails, setEventDetails] = useState<EventDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPresentOnly, setShowPresentOnly] = useState(false);
  const [presentEmailSet, setPresentEmailSet] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/registrations/event/${eventId}`);
        const data = await response.json();
        setRegistrations(data);
      } catch (err) {
        console.error('Error fetching registrations:', err);
      }
    };

    const fetchAttendance = async () => {
      if (!eventId) return;
      try {
        const response = await fetch(`${API_BASE_URL}/attendance/event/${eventId}`);
        if (!response.ok) {
          throw new Error(`Attendance fetch failed: ${response.status}`);
        }
        const data = await response.json();
        const normalizeArray = (arr: any[]) => {
          const userIds: string[] = [];
          const emails: string[] = [];
          arr.forEach((item) => {
            if (!item) return;
            if (typeof item === 'string') {
              userIds.push(item);
            } else {
              if (item.userId) userIds.push(item.userId);
              if (item.email) emails.push(String(item.email).toLowerCase());
            }
          });
          return { userIds, emails };
        };

        const source = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
            ? data.data
            : [];

        const { userIds, emails } = normalizeArray(source);
        setPresentSet(new Set(userIds.filter(Boolean)));
        setPresentEmailSet(new Set(emails.filter(Boolean)));
      } catch (err) {
        console.error('Error fetching attendance:', err);
      }
    };

    const fetchEventDetails = async () => {
      if (!symposium) { // Check if symposium is available
        console.error('Symposium name is missing for fetching event details.');
        setIsLoading(false);
        return;
      }
      try {
        const response = await fetch(`${API_BASE_URL}/events/${eventId}?symposium=${symposium}`); // Modified API call
        const data = await response.json();
        setEventDetails(data);
      } catch (err) {
        console.error('Error fetching event details:', err);
      }
    };

    Promise.all([fetchRegistrations(), fetchAttendance(), fetchEventDetails()]).finally(() => setIsLoading(false));
  }, [eventId, symposium]); // Added symposium to dependency array

  const handleDelete = async (registrationId: number) => {
    if (!window.confirm('Are you sure you want to delete this registration?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/registrations/${registrationId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setRegistrations((prev) => prev.filter((r) => r.id !== registrationId));
        alert('Registration deleted successfully.');
      } else {
        const errorData = await response.json();
        alert(`Failed to delete: ${errorData.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Error deleting registration:', err);
      alert('An error occurred while deleting the registration.');
    }
  };

  const downloadPdf = () => {
    if (!eventDetails) {
      return;
    }

    const doc = new jsPDF();
    doc.text(`Registrations for ${eventDetails.eventName}`, 14, 16);
    doc.text(`Coordinator: ${eventDetails.coordinatorName} (${eventDetails.coordinatorContactNo})`, 14, 24);

    autoTable(doc, {
      startY: 30,
      head: [['Name', 'Email', 'College', 'Mobile Number', 'Attendance']],
      body: filteredRegistrations.map(r => [
        r.userName,
        r.email,
        r.college,
        r.mobileNumber,
        presentSet.has(r.userId) ? 'Present' : 'Not Marked'
      ]),
    });

    doc.save(`event_${eventDetails.eventName}_registrations.pdf`);
  };

  if (isLoading) {
    return <Loader />;
  }

  const isPresent = (registration: Registration) => {
    if (registration.userId && presentSet.has(registration.userId)) return true;
    if (registration.email && presentEmailSet.has(registration.email.toLowerCase())) return true;
    return false;
  };

  const filteredRegistrations = showPresentOnly
    ? registrations.filter(isPresent)
    : registrations;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 pt-20">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          {eventDetails?.eventName} Registrations
        </h1>
        <div className="flex justify-end mb-4">
          <label className="mr-4 text-sm text-gray-300 flex items-center gap-2">
            <input
              type="checkbox"
              checked={showPresentOnly}
              onChange={(e) => setShowPresentOnly(e.target.checked)}
              className="h-4 w-4 text-samhita-600 bg-gray-700 border-gray-600 rounded"
            />
            Show Present Only
          </label>
          <button
            onClick={downloadPdf}
            className="bg-samhita-600 hover:bg-samhita-700 text-white font-bold py-2 px-4 rounded"
          >
            Download as PDF
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-800 rounded-lg">
            <thead>
              <tr className="bg-gray-700">
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">College</th>
                <th className="py-3 px-4 text-left">Mobile Number</th>
                <th className="py-3 px-4 text-left">Attendance</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRegistrations.map((registration, index) => (
                <tr key={index} className="border-b border-gray-700">
                  <td className="py-3 px-4">{registration.userName}</td>
                  <td className="py-3 px-4">{registration.email}</td>
                  <td className="py-3 px-4">{registration.college}</td>
                  <td className="py-3 px-4">{registration.mobileNumber}</td>
                  <td className="py-3 px-4">
                    {isPresent(registration) ? (
                      <span className="text-green-400 font-semibold">Present</span>
                    ) : (
                      <span className="text-gray-400">Not Marked</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleDelete(registration.id)}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm transition-colors duration-200"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewEventRegistrationsPage;


