import React, { useState, useEffect } from 'react';
import { ref, push, serverTimestamp, getDatabase, onValue } from 'firebase/database';
import './notification.css';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const AddDomain = () => {
  const [domain, setDomain] = useState('');
  const [userDomains, setUserDomains] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [domainsPerPage] = useState(5);
  const auth = getAuth();

  function isValidDomain(domain) {
    const domainRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return domainRegex.test(domain);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserDomains();
      } else {
        console.log('User is signed out');
      }
    });

    return () => unsubscribe();
  }, [auth, currentPage]);

  const fetchUserDomains = async () => {
    try {
     
      if (!auth.currentUser) {
        console.error('User not authenticated');
        return;
      }
      if (domain.trim() !== '' && !isValidDomain(domain)) {
        console.error('Invalid domain');
        return;
      }

      const db = getDatabase();
      const domainRef = ref(db, `users/${auth.currentUser.uid}/AddedDomains`);

      onValue(domainRef, (snapshot) => {
        const domainsData = snapshot.val();
        if (domainsData) {
          const domainsArray = Object.entries(domainsData).map(([key, value]) => ({ id: key, ...value }));
          setUserDomains(domainsArray);
        }
      });
    } catch (error) {
      console.error('Error fetching domains:', error.message);
    }
  };

  const handleSend = async () => {
    try {
      if (!auth.currentUser) {
        console.error('User not authenticated');
        return;
      }
      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleString();

      if (domain.trim() !== '' && !isValidDomain(domain)) {
        alert('Invalid domain');
        return;
      }

      if (isValidDomain(domain)) {
        const db = getDatabase();
        const domainRef = ref(db, `users/${auth.currentUser.uid}/AddedDomains`);

        await push(domainRef, {
          name: domain,
          addedAt: formattedDate,
        });
        alert('Domain added successfully');
      }

      setDomain('');
    } catch (error) {
      console.error('Error adding domain:', error.message);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const indexOfLastDomain = currentPage * domainsPerPage;
  const indexOfFirstDomain = indexOfLastDomain - domainsPerPage;
  const currentDomains = userDomains.slice(indexOfFirstDomain, indexOfLastDomain);

  return (
    <>
      <div className='card' style={{ height: '30vh' }}>
        <input
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          className='notification'
          placeholder='Domain Name'
          type='text'
        />
        <div style={{ width: '100%', justifyContent: 'center', display: 'flex', marginTop: '20px' }}>
          <button style={{ borderRadius: '5px', width: '10%' }} onClick={handleSend}>
            Send
          </button>
        </div>
      </div>

      <div className='card' style={{ height: '80vh' }}>
        <div className='table-container'>
          <table className='table' style={{ marginLeft: '20px', marginTop: '20px' }}>
            <thead style={{ height: '7vh' }}>
              <tr className='table-header'>
                <th style={{ background: 'transparent', color: 'skyblue' }}>Domain Name</th>
                <th style={{ background: 'transparent', color: 'skyblue' }}>Added At</th>
              </tr>
            </thead>
            <tbody>
              {currentDomains.map((userDomain) => (
                <tr key={userDomain.id}>
                  <td className='domain-row' style={{ height: '10vh', background: 'transparent', color: 'white' }}>
                    {userDomain.name}
                  </td>
                  <td className='domain-row' style={{ height: '10vh', background: 'transparent', color: 'white' }}>
                    {userDomain.addedAt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

       
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <button style={{ marginRight: '10px' }} className='pagination-btn' onClick={handlePrevPage} disabled={currentPage === 1}>
            Previous
          </button>
          
          <button className='pagination-btn' style={{ marginLeft: '10px' }}
            onClick={handleNextPage}
            disabled={currentPage === Math.ceil(userDomains.length / domainsPerPage)}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default AddDomain
