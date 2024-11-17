import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SpendingTracker({ serverUrl }) {
  const [file, setFile] = useState(null);
  const [monthlySpending, setMonthlySpending] = useState([]);

  useEffect(() => {
    fetchMonthlySpending();
  }, []);

  // Function to handle CSV file upload
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleFileUpload = async (event) => {
    event.preventDefault();

    if (!file) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append('csv_file', file);

    try {
      await axios.post(`${serverUrl}api/upload_csv/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert("File uploaded successfully!");
      fetchMonthlySpending();
    } catch (error) {
      console.error("Error uploading the file:", error);
      alert("Failed to upload the file.");
    }
  };

  // Function to fetch monthly spending data
  const fetchMonthlySpending = async () => {
    try {
      const response = await axios.get(`${serverUrl}api/monthly_spending/`);
      console.log(response);
      setMonthlySpending(response.data); // Assuming the data is grouped by month
    } catch (error) {
      console.error("Error fetching monthly spending data:", error);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#f0f0f0', padding: '20px' }}>
      <h1 style={{ color: '#333', marginBottom: '20px' }}>Spending Tracker</h1>
      <form onSubmit={handleFileUpload} style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '10px' }}>
          Upload CSV:
          <input type="file" accept=".csv" onChange={handleFileChange} style={{ marginLeft: '10px' }} />
        </label>
        <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Upload</button>
      </form>

      <h2 style={{ color: '#333', marginBottom: '10px' }}>Monthly Spending</h2>
      <table border="1" style={{ borderCollapse: 'collapse', width: '80%', maxWidth: '600px', backgroundColor: '#fff' }}>
        <thead>
          <tr>
            <th style={{ padding: '10px', backgroundColor: '#007bff', color: '#fff' }}>Month</th>
            <th style={{ padding: '10px', backgroundColor: '#007bff', color: '#fff' }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {monthlySpending.length > 0 ? (
            monthlySpending.map((item, index) => (
              <tr key={index}>
                <td style={{ padding: '10px', textAlign: 'center' }}>{item.month}</td>
                <td style={{ padding: '10px', textAlign: 'center' }}>{item.amount}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" style={{ padding: '10px', textAlign: 'center' }}>No data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default SpendingTracker;
