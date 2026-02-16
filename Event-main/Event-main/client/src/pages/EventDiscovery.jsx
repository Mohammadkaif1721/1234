import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Link } from 'react-router-dom';

const EventDiscovery = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [location, setLocation] = useState('');

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const params = {};
            if (search) params.search = search;
            if (category) params.category = category;
            if (location) params.location = location;

            const res = await api.get('/events', { params });
            setEvents(res.data.events);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchEvents();
        }, 300);
        return () => clearTimeout(timer);
    }, [search, category, location]);

    return (
        <div className="container mx-auto mt-8">
            <div className="bg-white p-6 rounded shadow mb-8">
                <div className="flex flex-col md:flex-row gap-4">
                    <input
                        type="text"
                        placeholder="Search events..."
                        className="border p-2 rounded flex-grow"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <select
                        className="border p-2 rounded"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="">All Categories</option>
                        <option value="Tech">Tech</option>
                        <option value="Sports">Sports</option>
                        <option value="Music">Music</option>
                        <option value="Business">Business</option>
                    </select>
                    <input
                        type="text"
                        placeholder="Location..."
                        className="border p-2 rounded"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <p className="text-center text-gray-500">Loading events...</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.length > 0 ? (
                        events.map((event) => (
                            <div key={event._id} className="bg-white rounded shadow-md overflow-hidden hover:shadow-lg transition">
                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">{event.category}</span>
                                        <span className="text-gray-500 text-sm">{new Date(event.date).toLocaleDateString()}</span>
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">{event.name}</h3>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
                                    <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                                        <span>📍 {event.location}</span>
                                        <span>👥 {event.availableSeats} / {event.capacity} seats</span>
                                    </div>
                                    <Link to={`/events/${event._id}`} className="block w-full bg-blue-600 text-white text-center py-2 rounded hover:bg-blue-700">
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="col-span-full text-center text-gray-500">No events found matching your criteria.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default EventDiscovery;
