import { useState } from 'react';
import axios from 'axios';

function App() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:3001/scrape');
      setListings(res.data.listings);
    } catch (err) {
      alert('❌ Failed to fetch listings');
      console.error('❌ Axios error message:', err.message);
      if (err.response) {
        console.error('📄 Backend responded with error:', err.response.status, err.response.data);
      } else if (err.request) {
        console.error('📡 Request was made but no response received:', err.request);
      } else {
        console.error('🚫 Something else went wrong:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Airbnb Listings</h1>
      <button
        onClick={fetchListings}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        {loading ? 'Loading...' : 'Fetch Listings'}
      </button>

      <ul className="mt-6 space-y-2">
        {listings.map((item, i) => (
          <li key={i} className="border p-2 rounded shadow">
            <a href={item.link} target="_blank" rel="noreferrer">
              <strong>{item.title}</strong> – {item.price}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
