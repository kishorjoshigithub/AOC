import React, { useState, useEffect } from 'react';
import { ref, getDatabase, onValue, push } from 'firebase/database';
import './notification.css';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const Notification = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [actionUrl, setActionUrl] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('');
  const [domains, setDomains] = useState([]);
  const [image, setImage] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [notificationsPerPage] = useState(5);

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserDomains();
        fetchNotifications();
      } else {
        console.log('User is signed out');
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const fetchUserDomains = async () => {
    try {
      if (!auth.currentUser) {
        console.error('User not authenticated');
        return;
      }

      const db = getDatabase();
      const userDomainsRef = ref(db, `users/${auth.currentUser.uid}/AddedDomains`);

      onValue(userDomainsRef, (snapshot) => {
        const domainsData = snapshot.val();
        if (domainsData) {
          const domainsArray = Object.values(domainsData);
          setDomains(domainsArray);
        }
      });
    } catch (error) {
      console.error('Error fetching user domains:', error.message);
    }
  };

  const fetchNotifications = async () => {
    try {
      if (!auth.currentUser) {
        console.error('User not authenticated');
        return;
      }

      const db = getDatabase();
      const notificationsRef = ref(db, `users/${auth.currentUser.uid}/Notifications`);

      onValue(notificationsRef, (snapshot) => {
        const notificationsData = snapshot.val();
        if (notificationsData) {
          const notificationsArray = Object.values(notificationsData);
          setNotifications(notificationsArray);
        }
      });
    } catch (error) {
      console.error('Error fetching notifications:', error.message);
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

  const indexOfLastNotification = currentPage * notificationsPerPage;
  const indexOfFirstNotification = indexOfLastNotification - notificationsPerPage;
  const currentNotifications = notifications.slice(indexOfFirstNotification, indexOfLastNotification);

  const handleSubmit = async () => {
    try {
      if (!auth.currentUser) {
        console.error('User not authenticated');
        return;
      }
      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleString();

      const db = getDatabase();
      const domainRef = ref(db,`users/${auth.currentUser.uid}/Notifications`);

      await push(domainRef, {
        domain: selectedDomain,
        title: title,
        body: body,
        actionUrl: actionUrl,
        image: image,
        addedAt: formattedDate,
      });
      alert('Notification Sent Successfully');

      setTitle('');
      setBody('');
      setActionUrl('');
      setSelectedDomain('');
      setImage('');
    } catch (error) {
      console.error('Error adding domain:', error.message);
    }
  };

  return (
    <>
      <div className='card notification'>
        <h2 style={{ color: 'white', marginLeft: '20px' }}>Send Notification</h2>

        <select
          className='notification'
          value={selectedDomain}
          onChange={(e) => setSelectedDomain(e.target.value)}
          style={{ background: 'transparent', color: 'skyblue' }}
        >
          <option value='' disabled>Select Domain</option>

          {domains.length > 0 ? (
            domains.map((domain, index) => (
              <option key={index} value={domain.name}>
                {domain.name}
              </option>
            ))
          ) : (
            <option value='' style={{ display: 'none' }}></option>
          )}

          <option value=''>None</option>
        </select>

        <input
          className='notification'
          placeholder='Title'
          type='text'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          style={{ width: '90%', height: '20vh', resize: 'none' }}
          className='notification'
          rows='4'
          cols='50'
          placeholder='Body'
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />

        <input
          className='notification'
          placeholder='Action Url'
          type='text'
          value={actionUrl}
          onChange={(e) => setActionUrl(e.target.value)}
        />

        <input
          className='notification'
          type='file'
          accept='image/*'
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />

        <div style={{ width: '100%', justifyContent: 'center', display: 'flex', marginTop: '30px' }}>
          <button style={{ borderRadius: '5px', width: '10%' }} onClick={handleSubmit}>
            Send
          </button>
        </div>
      </div>

      <div className='card' style={{ height: '80vh' }}>
        <div className='table-container'>
          <table className='table' style={{ marginLeft: '20px', marginTop: '20px' }}>
            <thead style={{ height: '7vh' }}>
              <tr className='table-header'>
                <th style={{ background: 'transparent', color: 'white' }}>Title</th>
                <th style={{ background: 'transparent', color: 'white' }}>Body</th>
                <th style={{ background: 'transparent', color: 'white' }}>icons</th>
                <th style={{ background: 'transparent', color: 'white' }}>Action</th>
                <th style={{ background: 'transparent', color: 'white' }}>Domain</th>
                <th style={{ background: 'transparent', color: 'white' }}>Sent At</th>
              </tr>
            </thead>
            <tbody>
              {currentNotifications.map((notification, index) => (
                <tr style={{ height: '10vh' }} key={index}>
                  <td style={{ background: 'transparent', color: 'skyblue' }}>{notification.title}</td>
                  <td style={{ background: 'transparent', color: 'skyblue' }}>{notification.body}</td>
                  <td style={{ background: 'transparent', color: 'skyblue' }}>{notification.image}</td>
                  <td style={{ background: 'transparent', color: 'skyblue' }}>{notification.actionUrl}</td>
                  <td style={{ background: 'transparent', color: 'skyblue' }}>{notification.domain}</td>
                  <td style={{ background: 'transparent', color: 'skyblue' }}>{notification.addedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <button className='pagination-btn' style={{ marginRight: '10px' }} onClick={handlePrevPage} disabled={currentPage === 1}>
            Previous
          </button>
          
          <button className='pagination-btn' onClick={handleNextPage} style={{ marginLeft: '10px' }} disabled={currentPage === Math.ceil(notifications.length / notificationsPerPage)}>
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default Notification;
