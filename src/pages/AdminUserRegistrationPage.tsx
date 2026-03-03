import React, { useState, useEffect } from "react";
import API_BASE_URL from "../Config";

type User = {
  id: string;
  fullName: string;
  email: string;
};

type Pass = {
  id: number;
  name: string;
};

type Event = {
  id: number;
  eventName: string;
  passId?: number | null;
  passName?: string | null;
  registrationFees?: number;
  rounds?: { roundNumber: number; roundDateTime?: string }[];
};

const AdminUserRegistrationPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [passes, setPasses] = useState<Pass[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [searchUserTerm, setSearchUserTerm] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [registeredPassIds, setRegisteredPassIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [workshopSelections, setWorkshopSelections] = useState<Record<number, number[]>>({});
  const [specialSelections, setSpecialSelections] = useState<Record<number, number[]>>({});

  const isWorkshopPassName = (name: string) => name.trim().toLowerCase() === 'workshop pass';
  const isSpecialPassName = (name: string) => name.toLowerCase().includes('special event pass');

  const getEventsForPass = (passId: number) =>
    events.filter((e) => Number(e.passId) === Number(passId));

  const getRound1DateKey = (event: Event) => {
    const round = (event.rounds || []).find((r) => r.roundNumber === 1) || event.rounds?.[0];
    if (!round?.roundDateTime) return null;
    const d = new Date(round.roundDateTime);
    if (Number.isNaN(d.getTime())) return null;
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };
  const formatRound1Date = (event: Event) => {
    const round = (event.rounds || []).find((r) => r.roundNumber === 1) || event.rounds?.[0];
    if (!round?.roundDateTime) return 'Date TBA';
    const d = new Date(round.roundDateTime);
    if (Number.isNaN(d.getTime())) return 'Date TBA';
    const datePart = d.toLocaleDateString('en-GB').replace(/\//g, '-');
    const timePart = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true });
    return `${datePart}, ${timePart}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [usersRes, passesRes, eventsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/registrations/users`),
          fetch(`${API_BASE_URL}/passes`),
          fetch(`${API_BASE_URL}/events`),
        ]);

        if (!usersRes.ok || !passesRes.ok || !eventsRes.ok) {
          throw new Error("Failed to fetch initial data.");
        }

        const usersData = await usersRes.json();
        const passesData = await passesRes.json();
        const eventsData = await eventsRes.json();

        setUsers(usersData);
        setPasses(passesData);
        setEvents(Array.isArray(eventsData) ? eventsData : []);
      } catch (error) {
        setMessage({ type: "error", text: "Failed to load data. Please try again." });
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredUsers = users.filter((user) => {
    const term = searchUserTerm.trim().toLowerCase();
    if (!term) return false;

    const normalizedId = user.id.toLowerCase();
    const normalizedEmail = user.email.toLowerCase();
    const normalizedName = user.fullName.toLowerCase();
    const digits = term.replace(/\D/g, "");
    const numericPart = user.id.replace(/\D/g, "");

    return (
      normalizedId.includes(term) ||
      normalizedEmail.includes(term) ||
      normalizedName.includes(term) ||
      (digits.length > 0 && numericPart.includes(digits))
    );
  });

  const fetchRegisteredPasses = async (userId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/registrations/passes/${userId}`);
      if (!response.ok) {
        setRegisteredPassIds([]);
        return;
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        const passIds = data
          .filter((id: any) => id !== null && id !== undefined)
          .map((id: any) => Number(id));
        setRegisteredPassIds(passIds);
      } else {
        setRegisteredPassIds([]);
      }
    } catch (error) {
      console.error("Failed to fetch registered passes:", error);
      setRegisteredPassIds([]);
    }
  };

  const handleUserSelect = (user: User) => {
    setSelectedUserId(user.id);
    setSearchUserTerm(user.id);
    setShowResults(false);
    fetchRegisteredPasses(user.id);
  };

  const handleSearchChange = (val: string) => {
    setSearchUserTerm(val);
    setSelectedUserId("");
    setRegisteredPassIds([]);
    setShowResults(val.length > 0);
  };

  const handleRegisterPass = async (passId: number) => {
    if (!selectedUserId) {
      setMessage({ type: "error", text: "Please select a user first." });
      return;
    }
    const pass = passes.find((p) => p.id === passId);
    if (!pass) {
      setMessage({ type: "error", text: "Pass not found." });
      return;
    }
    if (isWorkshopPassName(pass.name)) {
      const selected = workshopSelections[passId] || [];
      if (selected.length === 0) {
        setMessage({ type: "error", text: "Select at least one workshop event." });
        return;
      }
    }
    if (isSpecialPassName(pass.name)) {
      const selected = specialSelections[passId] || [];
      if (selected.length === 0) {
        setMessage({ type: "error", text: "Select at least one special event." });
        return;
      }
      if (selected.length > 2) {
        setMessage({ type: "error", text: "Select up to two special events." });
        return;
      }
    }
    setMessage(null);
    try {
      const response = await fetch(`${API_BASE_URL}/registrations/admin-register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUserId,
          passIds: [passId],
          workshopEventIds: workshopSelections,
          specialEventIds: specialSelections,
        }),
      });
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || "Failed to register pass.");
      }
      fetchRegisteredPasses(selectedUserId);
      setMessage({ type: "success", text: responseData.message });
    } catch (error: any) {
      // If backend says already registered, refresh state so UI flips to Revert.
      if (selectedUserId) {
        fetchRegisteredPasses(selectedUserId);
      }
      setMessage({ type: "error", text: error.message || "Failed to register pass." });
    }
  };

  const handleRevertPass = async (passId: number) => {
    if (!selectedUserId) {
      setMessage({ type: "error", text: "Please select a user first." });
      return;
    }
    setMessage(null);
    try {
      const response = await fetch(`${API_BASE_URL}/registrations/admin-deregister`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: selectedUserId, passId }),
      });
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || "Failed to deregister pass.");
      }
      fetchRegisteredPasses(selectedUserId);
      setMessage({ type: "success", text: responseData.message });
    } catch (error: any) {
      setMessage({ type: "error", text: error.message || "Failed to deregister pass." });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-gold-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-gold-400 to-pink-600">
          Register User for Passes
        </h1>

        {message && (
          <div className={`p-4 mb-4 rounded-lg ${message.type === "success" ? "bg-green-800/50 text-green-300" : "bg-red-800/50 text-red-300"}`}>
            {message.text}
          </div>
        )}

        <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 space-y-6">
          <div className="relative">
            <label htmlFor="user-search" className="block text-sm font-medium text-gray-300 mb-2">Select User</label>
            <div className="relative">
              <input
                type="text"
                id="user-search"
                autoComplete="off"
                placeholder="Search by Samhita ID, email, or name"
                value={searchUserTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                onFocus={() => searchUserTerm.length > 0 && setShowResults(true)}
                className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
              {selectedUserId && (
                <button
                  type="button"
                  onClick={() => { setSelectedUserId(""); setSearchUserTerm(""); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  ?
                </button>
              )}
            </div>

            {showResults && filteredUsers.length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                {filteredUsers.map(user => (
                  <div
                    key={user.id}
                    onClick={() => handleUserSelect(user)}
                    className="px-4 py-3 hover:bg-gray-700 cursor-pointer border-b border-gray-700/50 last:border-none"
                  >
                    <div className="font-semibold text-gold-400">{user.id} - {user.fullName}</div>
                    <div className="text-xs text-gray-400">{user.email}</div>
                  </div>
                ))}
              </div>
            )}

            {showResults && filteredUsers.length === 0 && (
              <div className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg p-4 text-center text-gray-400 italic">
                No users found.
              </div>
            )}

            {selectedUserId && (
              <p className="mt-2 text-xs text-green-400 flex items-center">
                Selected: {selectedUserId} - {users.find(u => u.id === selectedUserId)?.fullName}
              </p>
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3">Passes</h2>
            <div className="space-y-2 max-h-72 overflow-y-auto p-2 border border-gray-700 rounded-lg">
              {passes.map(pass => {
                const isRegistered = registeredPassIds.includes(Number(pass.id));
                const isWorkshop = isWorkshopPassName(pass.name);
                const isSpecial = isSpecialPassName(pass.name);
                const passEvents = (isWorkshop || isSpecial) ? getEventsForPass(pass.id) : [];
                const selectedWorkshopIds = workshopSelections[pass.id] || [];
                const selectedSpecialIds = specialSelections[pass.id] || [];
                const selectedWorkshopDates = new Set(
                  passEvents
                    .filter((e) => selectedWorkshopIds.includes(Number(e.id)))
                    .map((e) => getRound1DateKey(e))
                    .filter(Boolean)
                );
                return (
                  <div key={pass.id} className="rounded-lg border border-gray-700/60 p-3 space-y-3">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm">{pass.name}</span>
                      {isRegistered ? (
                        <button
                          type="button"
                          onClick={() => handleRevertPass(pass.id)}
                          className="px-4 py-2 rounded-md text-xs font-semibold bg-gray-600 text-gray-200 hover:bg-gray-500 transition"
                        >
                          Revert
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleRegisterPass(pass.id)}
                          className="px-4 py-2 rounded-md text-xs font-semibold bg-samhita-600 text-white hover:bg-samhita-700 transition"
                        >
                          Register
                        </button>
                      )}
                    </div>
                    {isWorkshop && (
                      <div className="space-y-2">
                        <p className="text-xs text-gold-300 font-semibold">Select workshops (unique round 1 dates):</p>
                        <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                          {passEvents.map((event) => {
                            const eventId = Number(event.id);
                            const dateKey = getRound1DateKey(event);
                            const isSelected = selectedWorkshopIds.includes(eventId);
                            const isBlocked = !isSelected && dateKey && selectedWorkshopDates.has(dateKey);
                            return (
                              <label
                                key={`workshop-${pass.id}-${eventId}`}
                                className={`flex items-start gap-3 p-2 rounded border ${
                                  isBlocked ? 'border-gray-700 text-gray-500' : 'border-gray-700 text-gray-200'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  disabled={isBlocked}
                                  onChange={(e) => {
                                    setWorkshopSelections((prev) => {
                                      const next = { ...prev };
                                      const current = next[pass.id] || [];
                                      next[pass.id] = e.target.checked
                                        ? [...current, eventId]
                                        : current.filter((id) => id !== eventId);
                                      return next;
                                    });
                                  }}
                                  className="mt-1"
                                />
                                <div className="text-xs">
                                  <div className="font-semibold">{event.eventName}</div>
                                  <div className="text-gray-400">Date: {formatRound1Date(event)}</div>
                                </div>
                              </label>
                            );
                          })}
                          {passEvents.length === 0 && (
                            <div className="text-gray-400 text-xs">No workshops mapped yet.</div>
                          )}
                        </div>
                      </div>
                    )}
                    {isSpecial && (
                      <div className="space-y-2">
                        <p className="text-xs text-gold-300 font-semibold">Select special events (max 2):</p>
                        <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                          {passEvents.map((event) => {
                            const eventId = Number(event.id);
                            const isSelected = selectedSpecialIds.includes(eventId);
                            const isBlocked = !isSelected && selectedSpecialIds.length >= 2;
                            return (
                              <label
                                key={`special-${pass.id}-${eventId}`}
                                className={`flex items-start gap-3 p-2 rounded border ${
                                  isBlocked ? 'border-gray-700 text-gray-500' : 'border-gray-700 text-gray-200'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  disabled={isBlocked}
                                  onChange={(e) => {
                                    setSpecialSelections((prev) => {
                                      const next = { ...prev };
                                      const current = next[pass.id] || [];
                                      next[pass.id] = e.target.checked
                                        ? [...current, eventId]
                                        : current.filter((id) => id !== eventId);
                                      return next;
                                    });
                                  }}
                                  className="mt-1"
                                />
                                <div className="text-xs">
                                  <div className="font-semibold">{event.eventName}</div>
                                  {event.registrationFees !== undefined && (
                                    <div className="text-gold-300">{'\u20B9'}{event.registrationFees}</div>
                                  )}
                                </div>
                              </label>
                            );
                          })}
                          {passEvents.length === 0 && (
                            <div className="text-gray-400 text-xs">No events mapped yet.</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="text-xs text-gray-400">
            Select a user above, then use Register/Revert buttons for each pass.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserRegistrationPage;
