import React, { useEffect, useMemo, useState } from 'react';
import API_BASE_URL from '../Config';
import ThemedModal from '../components/ThemedModal';
import Loader from '../components/Loader';

interface Event {
  id: number;
  eventName: string;
  eventCategory: string;
}

interface Registration {
  userId: string;
  name: string;
  email: string;
  mobile: string;
  department: string;
  yearofPassing: number;
  college: string;
}

const OrganizerAttendancePage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [presentSet, setPresentSet] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingRegs, setIsLoadingRegs] = useState(false);
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '' });
  const [searchNumber, setSearchNumber] = useState('');

  const showModal = (title: string, message: string) => {
    setModal({ isOpen: true, title, message });
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/events`);
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        showModal('Error', 'Failed to load events.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    if (!selectedEventId) {
      setRegistrations([]);
      setPresentSet(new Set());
      return;
    }

    const fetchRegistrationsAndAttendance = async () => {
      setIsLoadingRegs(true);
      try {
        const [regsRes, attendanceRes] = await Promise.all([
          fetch(`${API_BASE_URL}/events/${selectedEventId}/registrations`),
          fetch(`${API_BASE_URL}/attendance/event/${selectedEventId}`)
        ]);

        const regsData = await regsRes.json();
        const attendanceData = await attendanceRes.json();

        setRegistrations(regsData);
        setPresentSet(new Set(attendanceData));
      } catch (error) {
        showModal('Error', 'Failed to load registrations or attendance.');
      } finally {
        setIsLoadingRegs(false);
      }
    };

    fetchRegistrationsAndAttendance();
  }, [selectedEventId]);

  const handleMarkPresent = async (userId: string) => {
    if (!selectedEventId) {
      showModal('Error', 'Select an event first.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/attendance/mark`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId: selectedEventId, userId })
      });

      if (!response.ok) {
        throw new Error('Failed to mark attendance.');
      }

      setPresentSet(prev => new Set(prev).add(userId));
    } catch (error) {
      showModal('Error', 'Could not mark attendance.');
    }
  };

  const handleRevertPresent = async (userId: string) => {
    if (!selectedEventId) {
      showModal('Error', 'Select an event first.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/attendance/unmark`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId: selectedEventId, userId })
      });

      if (!response.ok) {
        throw new Error('Failed to revert attendance.');
      }

      setPresentSet(prev => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    } catch (error) {
      showModal('Error', 'Could not revert attendance.');
    }
  };

  const presentCount = useMemo(() => {
    return registrations.filter(r => presentSet.has(r.userId)).length;
  }, [registrations, presentSet]);

  const filteredRegistrations = useMemo(() => {
    const digits = searchNumber.replace(/\D/g, '').slice(0, 4);
    if (!digits) return registrations;
    const padded = digits.padStart(4, '0');
    const targetId = `S${padded}`;
    return registrations.filter(r => r.userId === targetId);
  }, [registrations, searchNumber]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen text-white">
      <ThemedModal
        isOpen={modal.isOpen}
        onClose={() => setModal({ isOpen: false, title: '', message: '' })}
        title={modal.title}
        message={modal.message}
      />

      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6 text-gold-gradient">Mark Attendance</h1>

        <div className="bg-black/70 backdrop-blur-md border border-gold-500/30 p-6 rounded-lg gold-glow mb-8">
          <label htmlFor="event-select" className="block text-sm text-gold-300 mb-2">Select Event</label>
          <select
            id="event-select"
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="w-full p-3 rounded-md bg-black/60 border border-gold-500/40 text-white"
          >
            <option value="">Choose an event</option>
            {events.map(event => (
              <option key={event.id} value={event.id}>
                {event.eventName} ({event.eventCategory})
              </option>
            ))}
          </select>
        </div>

        {isLoadingRegs ? (
          <Loader />
        ) : (
          <>
            {selectedEventId && (
              <div className="flex items-center justify-between mb-4 text-sm text-gold-300">
                <span>Total registrations: {registrations.length}</span>
                <span>Present: {presentCount}</span>
              </div>
            )}

            {selectedEventId && (
              <div className="mb-4">
                <label htmlFor="attendance-search" className="block text-sm text-gold-300 mb-2">
                  Search by ID number (e.g., 1 for S0001)
                </label>
                <input
                  id="attendance-search"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="Enter number only"
                  value={searchNumber}
                  onChange={(e) => setSearchNumber(e.target.value)}
                  className="w-full p-3 rounded-md bg-black/60 border border-gold-500/40 text-white"
                />
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="min-w-full bg-black/70 border border-gold-500/30 rounded-lg overflow-hidden">
                <thead className="bg-black/80">
                  <tr>
                    <th className="py-3 px-4 text-left">User ID</th>
                    <th className="py-3 px-4 text-left">Name</th>
                    <th className="py-3 px-4 text-left">Email</th>
                    <th className="py-3 px-4 text-left">Mobile</th>
                    <th className="py-3 px-4 text-left">Department</th>
                    <th className="py-3 px-4 text-left">College</th>
                    <th className="py-3 px-4 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRegistrations.length === 0 && (
                    <tr>
                      <td className="py-6 px-4 text-center text-gray-400" colSpan={7}>
                        {selectedEventId ? 'No registrations found for this event.' : 'Select an event to view registrations.'}
                      </td>
                    </tr>
                  )}
                  {filteredRegistrations.map((reg) => {
                    const isPresent = presentSet.has(reg.userId);
                    return (
                      <tr key={reg.userId} className="border-t border-gold-500/10">
                        <td className="py-3 px-4">{reg.userId}</td>
                        <td className="py-3 px-4">{reg.name}</td>
                        <td className="py-3 px-4">{reg.email}</td>
                        <td className="py-3 px-4">{reg.mobile}</td>
                        <td className="py-3 px-4">{reg.department}</td>
                        <td className="py-3 px-4">{reg.college}</td>
                        <td className="py-3 px-4">
                          <button
                            type="button"
                            onClick={() => (isPresent ? handleRevertPresent(reg.userId) : handleMarkPresent(reg.userId))}
                            className={`px-4 py-2 rounded-md text-xs font-semibold transition ${
                              isPresent ? 'bg-gray-600 text-gray-200 hover:bg-gray-500' : 'bg-samhita-600 hover:bg-samhita-700 text-white'
                            }`}
                          >
                            {isPresent ? 'Revert' : 'Mark Present'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OrganizerAttendancePage;
