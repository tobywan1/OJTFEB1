// UserPage.js
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';  // Import the Modal component
import { serverURL } from './config';

Modal.setAppElement('#root');

const UserPage = ({ accessToken }) => {
  const [userTollGateData, setUserTollGateData] = useState([]);
  const [expresswayData, setExpresswayData] = useState([]);
  const [calculatorFormData, setCalculatorFormData] = useState({
    expressway: '',
    entry: '',
    exit: '',
    vehicleClass: '',
    vehicle: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [calculatedPrice, setCalculatedPrice] = useState(null);

  useEffect(() => {
    // Fetch user toll gate data
    fetch(`${serverURL}/getUserTollGateData`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'X-User-Role': 'user' 
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Received user data:', data);
        setUserTollGateData(data);
      })
      .catch((error) => console.error('Error fetching user data:', error));

    // Fetch expressway data
    fetch(`${serverURL}/getExpresswayData`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Received expressway data:', data);
        setExpresswayData(data);
      })
      .catch((error) => console.error('Error fetching expressway data:', error));
  }, [accessToken]);

  const handleCalculatorInputChange = (e) => {
    setCalculatorFormData({ ...calculatorFormData, [e.target.name]: e.target.value });
  };

  const handleCalculate = () => {
    // Implement your pricing calculation logic here based on the expresswayData and calculatorFormData
    const selectedExpressway = expresswayData.find(expressway => expressway.name === calculatorFormData.expressway);
    if (selectedExpressway) {
      const matchingToll = userTollGateData.find(toll => toll.expressway === calculatorFormData.expressway
        && toll.entry === calculatorFormData.entry
        && toll.exit === calculatorFormData.exit
        && toll.vehicleClass === calculatorFormData.vehicleClass
        && toll.vehicle === calculatorFormData.vehicle);

      if (matchingToll) {
        // Use the toll-specific price if available, otherwise use a default price (e.g., $1.00)
        const calculatedPrice = matchingToll.price || 1.0;
        setCalculatedPrice(calculatedPrice);
      } else {
        setCalculatedPrice(null); // No matching toll found
      }

      setIsModalOpen(true);
    }
  };

  const getUniqueValues = (key) => {
    return Array.from(new Set(userTollGateData.map((dataItem) => dataItem[key])));
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <h1>Your Toll Gate Data</h1>
      {userTollGateData.map((dataItem, index) => (
        <div key={index}>
          {dataItem.expressway}, {dataItem.entry}, {dataItem.exit}, ...
        </div>
      ))}

      <div>
        <h2>Expressway Calculator</h2>
        <form>
          <label>Expressway:</label>
          <select name="expressway" value={calculatorFormData.expressway} onChange={handleCalculatorInputChange}>
            <option value="">Select...</option>
            {expresswayData.map((expressway, index) => (
              <option key={index} value={expressway.name}>
                {expressway.name}
              </option>
            ))}
          </select>

          <label>Entry:</label>
          <select name="entry" value={calculatorFormData.entry} onChange={handleCalculatorInputChange}>
            <option value="">Select...</option>
            {getUniqueValues('entry').map((entry, index) => (
              <option key={index} value={entry}>
                {entry}
              </option>
            ))}
          </select>

          <label>Exit:</label>
          <select name="exit" value={calculatorFormData.exit} onChange={handleCalculatorInputChange}>
            <option value="">Select...</option>
            {getUniqueValues('exit').map((exit, index) => (
              <option key={index} value={exit}>
                {exit}
              </option>
            ))}
          </select>

          <label>Vehicle Class:</label>
          <select name="vehicleClass" value={calculatorFormData.vehicleClass} onChange={handleCalculatorInputChange}>
            <option value="">Select...</option>
            {getUniqueValues('vehicleClass').map((vehicleClass, index) => (
              <option key={index} value={vehicleClass}>
                {vehicleClass}
              </option>
            ))}
          </select>

          <label>Vehicle:</label>
          <select name="vehicle" value={calculatorFormData.vehicle} onChange={handleCalculatorInputChange}>
            <option value="">Select...</option>
            {getUniqueValues('vehicle').map((vehicle, index) => (
              <option key={index} value={vehicle}>
                {vehicle}
              </option>
            ))}
          </select>

          <button type="button" onClick={handleCalculate}>
            Calculate Price
          </button>
        </form>
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
          content: {
            width: '10%',  // Adjust the width to your preference
            height: '20%',
            margin: 'auto',
            backgroundColor: 'lightgray',  // Change to your preferred background color
            padding: '20px',
            borderRadius: '10px',  // Optional: Add rounded corners
            border: '2px solid black', 
          },
        }}
      >
        <h2> Price</h2>
        <p style={{ fontSize: '18px' }}>{calculatedPrice ? `$${calculatedPrice.toFixed(2)}` : 'No price calculated'}</p>
        <button onClick={closeModal}>Close</button>
      </Modal>
    </div>
  );
};

export default UserPage;
