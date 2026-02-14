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

const AdminUserRegistrationPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [passes, setPasses] = useState<Pass[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [searchUserTerm, setSearchUserTerm] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [registeredPassIds, setRegisteredPassIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [usersRes, passesRes] = await Promise.all([
          fetch(`${API_BASE_URL}/registrations/users`),
          fetch(`${API_BASE_URL}/passes`),
        ]);

        if (!usersRes.ok || !passesRes.ok) {
          throw new Error("Failed to fetch initial data.");
        }

        const usersData = await usersRes.json();
        const passesData = await passesRes.json();

        setUsers(usersData);
        setPasses(passesData);
      } catch (error) {
        setMessage({ type: "error", text: "Failed to load data. Please try again." });
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredUsers = users.filter(user => {
    const digits = searchUserTerm.replace(/\D/g, "").slice(0, 4);
    if (!digits) return false;
    const numericPart = user.id.replace(/\D/g, "");
    return numericPart.includes(digits);
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
    setMessage(null);
    try {
      const response = await fetch(`${API_BASE_URL}/registrations/admin-register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: selectedUserId, passIds: [passId] }),
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
                placeholder="Type number only (e.g., 1 for S0001)"
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
                return (
                  <div key={pass.id} className="flex items-center justify-between gap-4">
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
