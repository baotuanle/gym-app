import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './header.jsx';

const UserBillings = () => {
  const [billings, setBillings] = useState([]);

  const userDataString = localStorage.getItem('userData');
  const userData = JSON.parse(userDataString);
  const userId = userData.data[0].id;


  useEffect(() => {
    fetchBillings();
  }, [userId]);

  const fetchBillings = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/get-user-billings`, {
        params: {
          userId: userId
        }
      });
      setBillings(response.data);
    } catch (error) {
      console.error('Error fetching user billings:', error);
    }
  };

  const handlePaymentStatusUpdate = async (billingId) => {
    try {
      await axios.post(`http://localhost:3000/update-payment`, {
        billingId: billingId
      });
      fetchBillings();
    } catch (error) {
      console.error('Error updating payment status:', error);
    }
  };

  return (
    <div>
      <Header />
      <h2>User Billings</h2>
      {billings.length === 0 ? (
        <p>No billings found for this user.</p>
      ) : (
        <ul>
          {billings.map(billing => (
            <li key={billing.id}>
              <p>Amount: {billing.amount}</p>
              <p>Payment Status: {billing.payment_status ? 'Paid' : 'Occurring payment'}</p>
              {!billing.payment_status && (
                <button onClick={() => handlePaymentStatusUpdate(billing.id)}>Mark as Paid</button>
              )}
            </li>
          ))}
        </ul>
        
      )}
    </div>
  );
};

export default UserBillings;
