import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminHeader from './admin-header';

const AdminBilling = () => {
  const [userId, setUserId] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [billings, setBillings] = useState([]);

  useEffect(() => {
    fetchBillings();
  }, []);

  const fetchBillings = async () => {
    try {
      const response = await axios.get('http://localhost:3000/get-all-billings');
      setBillings(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateBill = async () => {
    try {
      await axios.post('http://localhost:3000/create-bill', {
        userId,
        amount,
      });
      setMessage("Bill Created");
      fetchBillings();
    } catch (error) {
      console.error('Error creating bill:', error);
      setMessage('Error creating bill. Please try again.');
    }
  };

  const handleCancelBill = async () => {
    try {
      await axios.delete('http://localhost:3000/cancel-bill', {
        data: { userId } 
      });
      setMessage("Bill Cancelled");
      fetchBillings();
    } catch (error) {
      console.error('Error cancelling bill:', error);
      setMessage('Error cancelling bill. Please try again.');
    }
  };

  const handleUpdateBill = async () => {
    try {
      await axios.put(`http://localhost:3000/update-bill`, {
        userId,
        amount,
      });
      setMessage("Bill Updated");
      fetchBillings();
    } catch (error) {
      console.error('Error updating bill:', error);
      setMessage('Error updating bill. Please try again.');
    }
  };

  return (
    <div>
      <AdminHeader />
      <h2>Admin Billing</h2>
      <div>
        <h3>Create Bill</h3>
        <label>User ID:</label>
        <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} />
        <label>Amount:</label>
        <input type="text" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <button onClick={handleCreateBill}>Create Bill</button>
      </div>
      <div>
        <h3>Cancel Bill</h3>
        <label>Billing ID:</label>
        <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} />
        <button onClick={handleCancelBill}>Cancel Bill</button>
      </div>
      <div>
        <h3>Update Bill</h3>
        <label>Billing ID:</label>
        <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} />
        <label>Amount:</label>
        <input type="text" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <button onClick={handleUpdateBill}>Update Bill</button>
      </div>
      {message && <p>{message}</p>}
      <div>
        <h2>All Current Billings</h2>
        {billings.length === 0 ? (
          <p>No billings found</p>
        ) : (
          <ul>
            {billings.map(billing => (
              <li key={billing.id}>
                <p>Billings ID: {billing.id}</p>
                <p>User ID: {billing.user_id}</p>
                <p>Amount: {billing.amount}</p>
                <p>Payment Status: {billing.payment_status ? 'Paid' : 'Occurring payment'}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminBilling;
