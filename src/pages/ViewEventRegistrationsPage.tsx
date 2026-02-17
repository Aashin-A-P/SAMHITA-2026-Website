import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom'; // Added useSearchParams
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Loader from '../components/Loader';
import API_BASE_URL from '../Config'; // adjust path if needed
import ThemedModal from '../components/ThemedModal';

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

interface Team {
  id: number;
  teamName: string;
  createdBy: string;
  member1Id: string;
  member2Id: string;
  member3Id?: string;
  member4Id?: string;
  member1Name?: string;
  member1Email?: string;
  member1Mobile?: string;
  member1College?: string;
  member1Department?: string;
  member1YearOfPassing?: number;
  member2Name?: string;
  member2Email?: string;
  member2Mobile?: string;
  member2College?: string;
  member2Department?: string;
  member2YearOfPassing?: number;
  member3Name?: string;
  member3Email?: string;
  member3Mobile?: string;
  member3College?: string;
  member3Department?: string;
  member3YearOfPassing?: number;
  member4Name?: string;
  member4Email?: string;
  member4Mobile?: string;
  member4College?: string;
  member4Department?: string;
  member4YearOfPassing?: number;
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
  const [teams, setTeams] = useState<Team[]>([]);
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '' });

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

    const fetchTeams = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/pass-teams/by-event/${eventId}`);
        if (!response.ok) {
          setTeams([]);
          return;
        }
        const data = await response.json();
        setTeams(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching teams:', err);
        setTeams([]);
      }
    };

    if (eventId) {
      fetchTeams();
    }
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
        setModal({ isOpen: true, title: 'Success', message: 'Registration deleted successfully.' });
      } else {
        const errorData = await response.json();
        setModal({ isOpen: true, title: 'Error', message: `Failed to delete: ${errorData.message || 'Unknown error'}` });
      }
    } catch (err) {
      console.error('Error deleting registration:', err);
      setModal({ isOpen: true, title: 'Error', message: 'An error occurred while deleting the registration.' });
    }
  };

  const downloadPdf = () => {
    if (!eventDetails) {
      return;
    }

    const doc = new jsPDF();
    doc.text(`Registrations for ${eventDetails.eventName}`, 14, 16);
    doc.text(`Coordinator: ${eventDetails.coordinatorName} (${eventDetails.coordinatorContactNo})`, 14, 24);

    const useTeamRows = teams.length > 0;
    const rowsForPdf = useTeamRows ? filteredTeamRows : filteredRegistrations;

    autoTable(doc, {
      startY: 30,
      head: useTeamRows
        ? [['Team Name', 'Name', 'Email', 'College', 'Mobile Number', 'Attendance']]
        : [['Name', 'Email', 'College', 'Mobile Number', 'Attendance']],
      body: useTeamRows
        ? rowsForPdf.map((r) => [
            r.teamName,
            r.name,
            r.email,
            r.college,
            r.mobile,
            isUserPresent(r.userId, r.email) ? 'Present' : 'Not Marked',
          ])
        : rowsForPdf.map((r) => [
            r.userName,
            r.email,
            r.college,
            r.mobileNumber,
            presentSet.has(r.userId) ? 'Present' : 'Not Marked',
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

  const isUserPresent = (userId?: string, email?: string) => {
    if (userId && presentSet.has(userId)) return true;
    if (email && presentEmailSet.has(email.toLowerCase())) return true;
    return false;
  };

  const toggleTeamAttendance = async (userId: string, email?: string) => {
    if (!eventId) return;
    const currentlyPresent = isUserPresent(userId, email);
    const endpoint = currentlyPresent ? 'unmark' : 'mark';
    try {
      const response = await fetch(`${API_BASE_URL}/attendance/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, userId }),
      });
      if (!response.ok) {
        throw new Error(`Attendance ${endpoint} failed`);
      }
      setPresentSet((prev) => {
        const next = new Set(prev);
        if (currentlyPresent) {
          next.delete(userId);
        } else {
          next.add(userId);
        }
        return next;
      });
      if (email) {
        setPresentEmailSet((prev) => {
          const next = new Set(prev);
          const key = email.toLowerCase();
          if (currentlyPresent) {
            next.delete(key);
          } else {
            next.add(key);
          }
          return next;
        });
      }
    } catch (err) {
      console.error('Error updating attendance:', err);
      setModal({ isOpen: true, title: 'Error', message: 'Failed to update attendance.' });
    }
  };

  const getTeamMembers = (team: Team) => {
    const members = [
      { id: team.member1Id, name: team.member1Name, email: team.member1Email, mobile: team.member1Mobile, college: team.member1College },
      { id: team.member2Id, name: team.member2Name, email: team.member2Email, mobile: team.member2Mobile, college: team.member2College },
      { id: team.member3Id, name: team.member3Name, email: team.member3Email, mobile: team.member3Mobile, college: team.member3College },
      { id: team.member4Id, name: team.member4Name, email: team.member4Email, mobile: team.member4Mobile, college: team.member4College },
    ];
    return members.filter((m) => m.id);
  };

  const handleDeleteTeam = async (teamId: number) => {
    if (!window.confirm('Delete this team?')) {
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/pass-teams/${teamId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete team.');
      }
      setTeams((prev) => prev.filter((t) => t.id !== teamId));
    } catch (err) {
      console.error('Error deleting team:', err);
      setModal({ isOpen: true, title: 'Error', message: 'Failed to delete team.' });
    }
  };

  const filteredRegistrations = showPresentOnly
    ? registrations.filter(isPresent)
    : registrations;

  const teamRows = teams.flatMap((team) =>
    getTeamMembers(team).map((member) => ({
      teamName: team.teamName,
      userId: member.id,
      name: member.name || 'N/A',
      email: member.email || 'N/A',
      college: member.college || 'N/A',
      mobile: member.mobile || 'N/A',
    }))
  );

  const filteredTeamRows = showPresentOnly
    ? teamRows.filter((row) => isUserPresent(row.userId, row.email))
    : teamRows;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 pt-20">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          {eventDetails?.eventName} Registrations
        </h1>

        {teams.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gold-300 mb-3">
              {eventDetails?.eventName?.toLowerCase().includes('paper')
                ? 'Paper Presentation Teams'
                : 'Hackathon Teams'}
            </h2>
          </div>
        )}
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
                {teams.length > 0 && <th className="py-3 px-4 text-left">Team Name</th>}
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">College</th>
                <th className="py-3 px-4 text-left">Mobile Number</th>
                <th className="py-3 px-4 text-left">Attendance</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teams.length > 0 ? (
                filteredTeamRows.map((row, index) => {
                  const present = isUserPresent(row.userId, row.email);
                  const team = teams.find((t) => t.teamName === row.teamName);
                  return (
                    <tr key={`${row.teamName}-${row.userId}-${index}`} className="border-b border-gray-700">
                      <td className="py-3 px-4">{row.teamName}</td>
                      <td className="py-3 px-4">{row.name}</td>
                      <td className="py-3 px-4">{row.email}</td>
                      <td className="py-3 px-4">{row.college}</td>
                      <td className="py-3 px-4">{row.mobile}</td>
                      <td className="py-3 px-4">
                        {present ? (
                          <span className="text-green-400 font-semibold">Present</span>
                        ) : (
                          <span className="text-gray-400">Not Marked</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => toggleTeamAttendance(row.userId, row.email)}
                            className={`px-3 py-1 rounded text-xs font-semibold ${
                              present
                                ? 'bg-red-600 hover:bg-red-700 text-white'
                                : 'bg-samhita-600 hover:bg-samhita-700 text-white'
                            }`}
                          >
                            {present ? 'Revert' : 'Mark Present'}
                          </button>
                          {team && (
                            <button
                              onClick={() => handleDeleteTeam(team.id)}
                              className="px-3 py-1 rounded text-xs font-semibold bg-gray-700 hover:bg-gray-600 text-white"
                            >
                              Delete Team
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                filteredRegistrations.map((registration, index) => (
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <ThemedModal
        isOpen={modal.isOpen}
        onClose={() => setModal({ isOpen: false, title: '', message: '' })}
        title={modal.title}
      >
        <p>{modal.message}</p>
      </ThemedModal>
    </div>
  );
};

export default ViewEventRegistrationsPage;


