import React, { useState, useEffect, useCallback } from 'react';
import API_BASE_URL from '../Config';
import { FiTag, FiX } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ThemedModal from './ThemedModal';

interface Pass {
    id: number;
    name: string;
    cost: number;
    description: string;
    accountId?: number;
}

interface CartItem {
    id: number;
    passId: number;
}

const PassesDisplay: React.FC = () => {
    const [passes, setPasses] = useState<Pass[]>([]);
    const [selectedPass, setSelectedPass] = useState<Pass | null>(null);
    const [events, setEvents] = useState<any[]>([]);
    const [selectedWorkshopEventIds, setSelectedWorkshopEventIds] = useState<number[]>([]);
    const [workshopSelectionError, setWorkshopSelectionError] = useState<string | null>(null);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [verifiedPassIds, setVerifiedPassIds] = useState<number[]>([]);
    const { user, isLoggedIn } = useAuth();
    const navigate = useNavigate();
    const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'info' });

    const isWorkshopPassName = (name: string) => name.trim().toLowerCase() === 'workshop pass';
    const getRound1DateKey = (event: any) => {
        const round = (event.rounds || []).find((r: any) => r.roundNumber === 1) || event.rounds?.[0];
        if (!round?.roundDateTime) return null;
        const d = new Date(round.roundDateTime);
        if (Number.isNaN(d.getTime())) return null;
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };
    const formatRound1Date = (event: any) => {
        const round = (event.rounds || []).find((r: any) => r.roundNumber === 1) || event.rounds?.[0];
        if (!round?.roundDateTime) return 'Date TBA';
        const d = new Date(round.roundDateTime);
        if (Number.isNaN(d.getTime())) return 'Date TBA';
        const datePart = d.toLocaleDateString('en-GB').replace(/\//g, '-');
        const timePart = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true });
        return `${datePart}, ${timePart}`;
    };
    const getEventsForPass = (pass: Pass) => events.filter((e) => Number(e.passId) === Number(pass.id));

    const fetchCartItems = useCallback(async () => {
        if (!user) return;
        try {
            const response = await fetch(`${API_BASE_URL}/pass-cart/${user.id}`);
            if (response.ok) {
                const data = await response.json();
                if (Array.isArray(data)) {
                    setCartItems(data);
                } else {
                    console.error("Cart items data is not an array:", data);
                    setCartItems([]);
                }
            }
        } catch (error) {
            console.error('Error fetching cart items:', error);
        }
    }, [user]);

    const fetchVerifiedPasses = useCallback(async () => {
        if (!user) return;
        try {
            const response = await fetch(`${API_BASE_URL}/registrations/verified/${user.id}`);
            if (response.ok) {
                const data = await response.json();
                if (Array.isArray(data)) {
                    const passIds = data.map((item: any) => item.passId).filter((id: any) => id !== null);
                    setVerifiedPassIds(passIds);
                } else {
                    console.error("Verified passes data is not an array:", data);
                    setVerifiedPassIds([]);
                }
            }
        } catch (error) {
            console.error('Error fetching verified passes:', error);
        }
    }, [user]);

    useEffect(() => {
        const fetchPasses = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/passes`);
                if (response.ok) {
                    const data = await response.json();
                    if (Array.isArray(data)) {
                        setPasses(data);
                    } else {
                        console.error("Passes data is not an array:", data);
                        setPasses([]);
                    }
                }
            } catch (error) {
                console.error('Error fetching passes:', error);
            }
        };

        fetchPasses();
    }, []);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/events`);
                if (response.ok) {
                    const data = await response.json();
                    if (Array.isArray(data)) {
                        setEvents(data);
                    }
                }
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };
        fetchEvents();
    }, []);

    useEffect(() => {
        setSelectedWorkshopEventIds([]);
        setWorkshopSelectionError(null);
    }, [selectedPass]);

    useEffect(() => {
        if (isLoggedIn) {
            fetchCartItems();
            fetchVerifiedPasses();
        }
    }, [isLoggedIn, fetchCartItems, fetchVerifiedPasses]);

    const handleAddToCart = async (pass: Pass) => {
        if (!isLoggedIn) {
            setModal({ isOpen: true, title: 'Login Required', message: 'Please log in to add items to your cart.', type: 'info' });
            return;
        }

        if (isWorkshopPassName(pass.name) && selectedWorkshopEventIds.length === 0) {
            setWorkshopSelectionError('Select at least one workshop.');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/pass-cart`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: user?.id,
                    passId: pass.id,
                    eventIds: isWorkshopPassName(pass.name) ? selectedWorkshopEventIds : undefined
                }),
            });

            if (response.ok) {
                setModal({ isOpen: true, title: 'Success', message: `${pass.name} added to cart!`, type: 'success' });
                fetchCartItems();
                setSelectedPass(null);
            } else {
                const errorData = await response.json();
                setModal({ isOpen: true, title: 'Error', message: errorData.message || 'Failed to add item to cart.', type: 'error' });
            }
        } catch (error) {
            console.error('Failed to add to cart:', error);
            setModal({ isOpen: true, title: 'Error', message: 'An unexpected error occurred.', type: 'error' });
        }
    };

    const handleRemoveFromCart = async (passId: number) => {
        const cartItem = getCartItemForPass(passId);
        if (!cartItem) {
            console.error("Cart item not found for passId:", passId);
            setModal({ isOpen: true, title: 'Error', message: 'Could not find item to remove.', type: 'error' });
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/pass-cart/${cartItem.id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setModal({ isOpen: true, title: 'Success', message: 'Pass removed from cart.', type: 'info' });
                fetchCartItems();
                setSelectedPass(null);
            } else {
                const errorData = await response.json();
                setModal({ isOpen: true, title: 'Error', message: errorData.message || 'Failed to remove item from cart.', type: 'error' });
            }
        } catch (error) {
            console.error('Failed to remove from cart:', error);
            setModal({ isOpen: true, title: 'Error', message: 'An unexpected error occurred.', type: 'error' });
        }
    };

    const getCartItemForPass = (passId: number): CartItem | undefined => {
        return cartItems.find(item => item.passId === passId);
    };

    const isPassVerified = (passId: number): boolean => {
        return verifiedPassIds.includes(passId);
    }

    if (passes.length === 0) {
        return null;
    }

    return (
        <>
            <ThemedModal
                isOpen={modal.isOpen}
                onClose={() => setModal(prev => ({ ...prev, isOpen: false }))}
                title={modal.title}
                hideDefaultFooter={modal.type === 'success'}
            >
                <p className="text-white">{modal.message}</p>
                {modal.type === 'success' && (
                    <div className="flex justify-end space-x-4 mt-6">
                        <button
                            onClick={() => setModal(prev => ({ ...prev, isOpen: false }))}
                            className="px-5 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            Continue Shopping
                        </button>
                        <button
                            onClick={() => {
                                setModal(prev => ({ ...prev, isOpen: false }));
                                navigate('/cart');
                            }}
                            className="px-5 py-2 bg-samhita-600 text-white font-semibold rounded-lg hover:bg-samhita-700 transition-colors"
                        >
                            Go to Cart
                        </button>
                    </div>
                )}
            </ThemedModal>
            {selectedPass && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 border border-gold-500/50 rounded-lg shadow-xl max-w-sm w-full relative text-white">
                        <button
                            onClick={() => setSelectedPass(null)}
                            className="absolute top-2 right-2 text-gray-400 hover:text-white"
                        >
                            <FiX size={24} />
                        </button>
                        <div className="p-8">
                            <h2 className="text-2xl font-bold text-gold-400 mb-2">{selectedPass.name}</h2>
                            <p className="text-3xl font-bold mb-4">
                                {isWorkshopPassName(selectedPass.name)
                                    ? (() => {
                                        const total = getEventsForPass(selectedPass)
                                            .filter((e: any) => selectedWorkshopEventIds.includes(Number(e.id)))
                                            .reduce((sum: number, e: any) => sum + (Number(e.registrationFees) || 0), 0);
                                        return `\u20B9${total}`;
                                    })()
                                    : `\u20B9${selectedPass.cost}`}
                            </p>
                            <p className="text-gray-300 mb-6">{selectedPass.description}</p>
                            {isWorkshopPassName(selectedPass.name) && (
                                <div className="mb-4 space-y-2">
                                    <p className="text-gold-300 font-semibold">Select workshops (unique round 1 dates):</p>
                                    <div className="space-y-2 max-h-56 overflow-y-auto pr-2">
                                        {getEventsForPass(selectedPass).map((event: any) => {
                                            const eventId = Number(event.id);
                                            const dateKey = getRound1DateKey(event);
                                            const selectedDates = new Set(
                                                getEventsForPass(selectedPass)
                                                    .filter((e: any) => selectedWorkshopEventIds.includes(Number(e.id)))
                                                    .map((e: any) => getRound1DateKey(e))
                                                    .filter(Boolean)
                                            );
                                            const isSelected = selectedWorkshopEventIds.includes(eventId);
                                            const isBlocked = !isSelected && dateKey && selectedDates.has(dateKey);
                                            return (
                                                <label
                                                    key={`workshop-${eventId}`}
                                                    className={`flex items-start gap-3 p-3 rounded-lg border ${
                                                        isBlocked ? 'border-gray-700 text-gray-500' : 'border-gray-700 text-gray-200'
                                                    }`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        disabled={isBlocked}
                                                        onChange={(e) => {
                                                            setWorkshopSelectionError(null);
                                                            if (e.target.checked) {
                                                                setSelectedWorkshopEventIds((prev) => [...prev, eventId]);
                                                            } else {
                                                                setSelectedWorkshopEventIds((prev) => prev.filter((id) => id !== eventId));
                                                            }
                                                        }}
                                                        className="mt-1"
                                                    />
                                                    <div className="text-sm">
                                                        <div className="font-semibold">{event.eventName}</div>
                                                        <div className="text-gray-400">Date: {formatRound1Date(event)}</div>
                                                        <div className="text-gold-300">{'\u20B9'}{event.registrationFees}</div>
                                                    </div>
                                                </label>
                                            );
                                        })}
                                        {getEventsForPass(selectedPass).length === 0 && (
                                            <div className="text-gray-400 text-sm">No workshops mapped yet.</div>
                                        )}
                                    </div>
                                    {workshopSelectionError && (
                                        <p className="text-sm text-red-400">{workshopSelectionError}</p>
                                    )}
                                </div>
                            )}
                            {isLoggedIn ? (
                                isPassVerified(selectedPass.id) ? (
                                    <button
                                        disabled
                                        className="w-full bg-green-600 text-white py-2 rounded-lg cursor-not-allowed"
                                    >
                                        Pass is Active
                                    </button>
                                ) : getCartItemForPass(selectedPass.id) ? (
                                    <button
                                        onClick={() => handleRemoveFromCart(selectedPass.id)}
                                        className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
                                    >
                                        Remove from Cart
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleAddToCart(selectedPass)}
                                        className="w-full bg-samhita-600 text-white py-2 rounded-lg hover:bg-samhita-700 transition-colors"
                                    >
                                        Add to Cart
                                    </button>
                                )
                            ) : (
                                <button
                                    onClick={() => navigate('/login')}
                                    className="w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition-colors"
                                >
                                    Log in to Purchase
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default PassesDisplay;





