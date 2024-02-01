// AdminPage.js

import React, { useState, useEffect } from 'react';
import { serverURL } from './config';
import './AdminPage.css';
import SearchForm from './SearchForm';
import EditConfirmationModal from './EditConfirmationModal'; // Import EditConfirmationModal

const DeleteConfirmationModal = ({ data, onConfirm, onCancel }) => {
  return (
    <div className="delete-confirmation-modal">
      <p>Are you sure you want to delete the following data?</p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <button onClick={onConfirm}>Yes</button>
      <button onClick={onCancel}>No</button>
    </div>
  );
};

const AdminPage = ({ onAddDataClick, onEditClick }) => {
  const [tollGateData, setTollGateData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [dataToDelete, setDataToDelete] = useState(null);
  const [showEditConfirmation, setShowEditConfirmation] = useState(false);
  const [dataToEdit, setDataToEdit] = useState(null);

  useEffect(() => {
    // Fetch all toll gate data
    fetch(`${serverURL}/getAllTollGateData`)
      .then((response) => response.json())
      .then((data) => {
        console.log('Received data:', data);
        setTollGateData(data);
        updateFilteredData(data);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const updateFilteredData = (data) => {
    // Call this function to update filteredData
    setFilteredData(data);
  };

  const handleEdit = (data) => {
    // Show the custom edit confirmation modal
    setDataToEdit(data);
    setShowEditConfirmation(true);
  };

  const handleEditConfirmation = () => {
    setShowEditConfirmation(false);
    onEditClick(dataToEdit);
  };

  const handleEditCancellation = () => {
    setShowEditConfirmation(false);
    setDataToEdit(null);
  };

  const handleSearch = (expressway) => {
    if (expressway === '') {
      updateFilteredData(tollGateData); // If search query is empty, show all data
    } else {
      // Filter data based on the search query
      const filtered = tollGateData.filter((data) =>
        data.expressway.toLowerCase().includes(expressway.toLowerCase())
      );
      updateFilteredData(filtered);
    }
  };

  const handleGroupByExpressway = () => {
    // Group data by expressway
    const groupedData = tollGateData.reduce((groups, data) => {
      const expressway = data.expressway.toLowerCase();
      if (!groups[expressway]) {
        groups[expressway] = [];
      }
      groups[expressway].push(data);
      return groups;
    }, {});

    const groupedArray = Object.values(groupedData).flat(); // Convert grouped data to array

    updateFilteredData(groupedArray);
  };

  const handleDelete = (data) => {
    setDataToDelete(data);
    setShowDeleteConfirmation(true);
  };

  const handleConfirmDelete = () => {
    const stringId = dataToDelete._id.toString();

    // Implement delete functionality
    // Make a DELETE request to your server
    fetch(`${serverURL}/deleteTollGateData/${stringId}`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then(() => {
        // Update tollGateData after deletion
        setTollGateData((prevData) => prevData.filter((item) => item._id !== stringId));
        updateFilteredData(tollGateData); // Update filteredData after deletion
        setShowDeleteConfirmation(false);
        setDataToDelete(null);
      })
      .catch((error) => {
        console.error('Error deleting data:', error);
        setShowDeleteConfirmation(false);
        setDataToDelete(null);
      });
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
    setDataToDelete(null);
  };

  return (
    <div className="admin-container">
      <h2>Admin Page</h2>
      <SearchForm onSearch={handleSearch} />
      <button type="button" onClick={onAddDataClick}>
        Create/Add Data
      </button>
      <button type="button" onClick={handleGroupByExpressway}>
        Group by Expressway
      </button>

      {/* Display toll gate data in a table */}
      <table>
        <thead>
          <tr>
            <th>Expressway</th>
            <th>Entry</th>
            <th>Exit</th>
            <th>Vehicle Class</th>
            <th>Vehicle</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((data) => (
            <tr key={data._id}>
              <td>{data.expressway}</td>
              <td>{data.entry}</td>
              <td>{data.exit}</td>
              <td>{data.vehicleClass}</td>
              <td>{data.vehicle}</td>
              <td>{data.price}</td>
              <td>
                <button onClick={() => handleEdit(data)}>Edit</button>
                <button onClick={() => handleDelete(data)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showEditConfirmation && (
        <EditConfirmationModal
          data={dataToEdit}
          onConfirm={handleEditConfirmation}
          onCancel={handleEditCancellation}
        />
      )}

      {showDeleteConfirmation && (
        <DeleteConfirmationModal
          data={dataToDelete}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
};

export default AdminPage;
