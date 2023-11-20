import { getAuth } from 'firebase/auth';
import { getDatabase, push, ref } from 'firebase/database';
import React, { useState } from 'react'

const Steps = () => {

  const [domain, setDomain] = useState('');
  const auth = getAuth();


  function isValidDomain(domain) {
    const domainRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return domainRegex.test(domain);
  }


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
            Save
          </button>
        </div>
      </div>


    </>
  )
}

export default Steps
