import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRegistrations = async () => {
        try {
            const res = await api.get('/registrations/user');
            setRegistrations(Array.isArray(res?.data) ? res.data : []);
        } catch (error) {
            console.error('Error fetching registrations:', error);
            setRegistrations([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRegistrations();
    }, []);

    const handleCancel = async (id) => {
        if (window.confirm('Are you sure you want to cancel this registration?')) {
            try {
                await api.delete(`/registrations/${id}`);
                setRegistrations(prev => prev.filter(reg => reg?._id !== id));
            } catch {
                alert('Failed to cancel registration');
            }
        }
    };

    // ✅ SAFE FILTERS
    const upcomingEvents = registrations.filter(reg =>
        reg?.event?.date &&
        new Date(reg.event.date) > new Date() &&
        reg.status !== 'cancelled'
    );

    const pastEvents = registrations.filter(reg =>
        reg?.event?.date &&
        new Date(reg.event.date) <= new Date() &&
        reg.status !== 'cancelled'
    );

    const cancelledEvents = registrations.filter(reg =>
        reg?.status === 'cancelled'
    );

    const EventList = ({ title, items = [], canCancel }) => (
        <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 border-b pb-2">{title}</h2>

            {items?.length > 0 ? (
                <div className="space-y-4">
                    {items.map((reg) => (
                        <div key={reg._id} className="bg-white p-4 rounded shadow flex flex-col md:flex-row justify-between items-center">
                            <div>
                                <Link
                                    to={`/events/${reg?.event?._id || ''}`}
                                    className="text-xl font-bold hover:text-blue-600"
                                >
                                    {reg?.event?.name || "Unknown Event"}
                                </Link>

                                <p className="text-gray-600">
                                    {reg?.event?.date
                                        ? new Date(reg.event.date).toLocaleDateString()
                                        : "No date"}{" "}
                                    at {reg?.event?.location || "Unknown"}
                                </p>

                                <p className="text-sm text-gray-500">
                                    Registered on: {reg?.createdAt
                                        ? new Date(reg.createdAt).toLocaleDateString()
                                        : "Unknown"}
                                </p>
                            </div>

                            {canCancel && (
                                <button
                                    onClick={() => handleCancel(reg._id)}
                                    className="mt-4 md:mt-0 bg-red-100 text-red-600 px-4 py-2 rounded hover:bg-red-200 transition"
                                >
                                    Cancel Registration
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 italic">No events in this category.</p>
            )}
        </div>
    );

    if (loading) {
        return <div className="text-center mt-8">Loading dashboard...</div>;
    }

    return (
        <div className="container mx-auto mt-8 px-4">
            <h1 className="text-3xl font-bold mb-8">My Dashboard</h1>

            <EventList title="Upcoming Events" items={upcomingEvents} canCancel />
            <EventList title="Past Events" items={pastEvents} />

            {cancelledEvents?.length > 0 && (
                <div className="mt-12 opacity-70">
                    <h2 className="text-xl font-bold mb-4 border-b pb-2 text-gray-500">
                        Cancelled Registrations
                    </h2>

                    <div className="space-y-4">
                        {cancelledEvents.map((reg) => (
                            <div key={reg._id} className="bg-gray-100 p-4 rounded flex justify-between items-center">
                                <div>
                                    <span className="font-bold text-gray-700">
                                        {reg?.event?.name || "Unknown Event"}
                                    </span>
                                    <span className="ml-4 text-sm text-red-500 uppercase font-bold text-xs border border-red-500 px-2 py-0.5 rounded">
                                        Cancelled
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
