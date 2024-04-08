import React, { useEffect, useState } from 'react';
import "./../index.css"
import Header from "./header.jsx"
import TrainerHeader from "./trainer-header.jsx"
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const TrainerDashboard = () => { 
  const navigate = useNavigate();
  const [currentSearch, setCurrentSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearchChange = (e) => {
    setCurrentSearch(e.target.value);
  };

  useEffect(() => {
    if (currentSearch.trim() !== '') {
      const fetchSearchResults = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/searchUsers?search=${currentSearch}`);
          setSearchResults(response.data);
        } catch (error) {
          console.error('Error fetching search results:', error);
        }
      };
  
      fetchSearchResults();
    } else {
      setSearchResults([]); 
    }
  }, [currentSearch]); 
  

  const handleUserClick = (user) => {
    console.log(user)
    navigate(`/search-profile/`, { state: { user } });
  };

  return (
    <div>
      <TrainerHeader></TrainerHeader>
        <div>
          <label>Search User: </label>
          <input type="text" value={currentSearch} onChange={handleSearchChange} />
        </div>
        {currentSearch.trim() !== '' && (
          <div className="search-results-container">
            <div className="search-results">
              <ul>
                {searchResults.map(user => (
                  <li key={user?.id} onClick={() => handleUserClick(user)}>
                    <a className='clickable-search'>{user?.username}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
    </div>
  );
};


export default TrainerDashboard;

