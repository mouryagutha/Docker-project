import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

const Search = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post('http://localhost:3000/docker-search', { imageName: searchQuery });
            if (response.data.success) {
                setSearchResults(response.data.results);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error('Error occurred while searching:', error);
            toast.error('An error occurred while searching');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button onClick={handleSearch} disabled={!searchQuery || isLoading}>
                {isLoading ? 'Searching...' : 'Search'}
            </button>
            <table>
                {/* Display search results here */}
            </table>
        </div>
    );
};

export default Search;
