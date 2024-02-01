// EditDataPage.js

import React from 'react';
import { serverURL } from './config';

const EditDataPage = ({ onCancelClick, onEditDataClick, data }) => {
  const [formData, setFormData] = React.useState({
    expressway: data.expressway,
    entry: data.entry,
    exit: data.exit,
    vehicleClass: data.vehicleClass,
    vehicle: data.vehicle,
    price: data.price,
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditData = async () => {
    try {
      console.log('Trying to edit data...');
      const response = await fetch(`${serverURL}/updateTollGateData/${data._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ updatedData: formData }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorMessage}`);
      }

      const updatedData = await response.json();

      // Implement further logic as needed after successful data update
      console.log('Data updated successfully:', updatedData);

      // Call the provided onEditDataClick function
      onEditDataClick();

    } catch (error) {
      console.error('Error editing data:', error);
      alert(`Error editing data: ${error.message}`);
    }
  };

  return (
    <div>
      <h2>Edit Data Page</h2>
      <form>
        <label>Expressway:</label>
        <input
          type="text"
          name="expressway"
          value={formData.expressway}
          onChange={handleInputChange}
        />
        <label>Entry:</label>
        <input type="text" name="entry" value={formData.entry} onChange={handleInputChange} />
        <label>Exit:</label>
        <input type="text" name="exit" value={formData.exit} onChange={handleInputChange} />
        <label>Vehicle Class:</label>
        <input
          type="text"
          name="vehicleClass"
          value={formData.vehicleClass}
          onChange={handleInputChange}
        />
        <label>Vehicle:</label>
        <input type="text" name="vehicle" value={formData.vehicle} onChange={handleInputChange} />
        <label>Price:</label>
        <input type="text" name="price" value={formData.price} onChange={handleInputChange} />
        {/* Add similar input fields for other data properties */}
        <button type="button" onClick={handleEditData}>
          Edit Data
        </button>
        <button type="button" onClick={onCancelClick}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default EditDataPage;
