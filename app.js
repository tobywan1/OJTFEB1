//app.js

import React, { useState } from 'react';
import './styles.css';
import { serverURL } from './config';
import AdminPage from './AdminPage';
import CreateDataPage from './CreateDataPage';
import EditDataPage from './EditDataPage';
import UserPage from './UserPage';

const DropdownMenuWithInputsAndVehiclesAndSubmit = () => {
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [createUsername, setCreateUsername] = useState('');
  const [createPassword, setCreatePassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCreateAccount, setIsCreateAccount] = useState(false);
  const [isAdmin, setIsAdmin] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [selectedData, setSelectedData] = useState(null);




  const handleLogin = async () => {
    if (!loginUsername || !loginPassword) {
      alert('Please enter both username and password');
      return;
    }
  
    const lowerCaseUsername = loginUsername.toLowerCase();
  
    // Simulating local login logic
    if (lowerCaseUsername === 'admin' && loginPassword === 'wa') {
      setIsLoggedIn(true);
      setIsAdmin(true);
      setIsCreateAccount(false);
      console.log('Admin logged in');
    } else if (lowerCaseUsername === createUsername && loginPassword === createPassword) {
      setIsLoggedIn(true);
      setIsAdmin(false);
      setIsCreateAccount(false);
      console.log('User logged in');
    } else {
      // If local login fails, try server-side authentication
      try {
        const response = await fetch(`${serverURL}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username: loginUsername, password: loginPassword }),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          // Server authentication successful
          setIsLoggedIn(true);
          setIsAdmin(data.isAdmin); // Set isAdmin based on the server response
          setIsCreateAccount(false);
          console.log('Server login successful');
        } else {
          // Server authentication failed
          alert('Invalid credentials');
        }
      } catch (error) {
        console.error('Error during login:', error);
        alert('An error occurred during login');
      }
    }
  };
  

  
  const handleCreateAccount = () => {
    // Simulating account creation logic, you should replace this with your actual registration logic
    if (createUsername.toLowerCase() === 'admin' && createPassword === 'wa') {
      alert('Admin account created. Please login before accessing the expressway.');
      setIsCreateAccount(true);
      setIsLoggedIn(false);
      setIsAdmin(true);
    } else {
      alert(`Account created for ${createUsername}. Please log in.`);
      setIsCreateAccount(true);
      setIsLoggedIn(false);
      setIsAdmin(false);
    }
  };


  const handleAddData = async () => {
    try {
      console.log('Adding data...');
      // Your logic for adding data goes here
    } catch (error) {
      console.error('Error adding data:', error);
      alert(`Error adding data: ${error.message}`);
    }
  };
    
    console.log('isLoggedIn:', isLoggedIn);
    console.log('isAdmin:', isAdmin);

     

  
  return (
    <div>
    {isLoggedIn && isAdmin && !isCreating && !selectedData && (
      <div>
        <h1>Toll Gate Management System</h1>
        <AdminPage
          onAddDataClick={() => setIsCreating(true)}
          onEditClick={(data) => setSelectedData(data)}
        />
      </div>
    )}

      {isLoggedIn && !isAdmin && !isCreating && !selectedData && (
        <div>
          <h1>Toll Gate Management System</h1>
          <UserPage />
        </div>
      )}

    {isCreating && (
      <CreateDataPage onCancelClick={() => setIsCreating(false)} onAddDataClick={handleAddData} />
    )}

    {selectedData && !isCreating && (
      <EditDataPage
        onCancelClick={() => setSelectedData(null)}
        onEditDataClick={() => {
          setSelectedData(null);
          // You may want to fetch updated data here and update tollGateData
        }}
        data={selectedData}
      />
    )}

  {!isLoggedIn && !isCreating && (
        <div className='form'>
        {isCreateAccount ? (
          <>
            <label>Create Account</label>
            <input
              type="text"
              placeholder="Username"
              value={createUsername}
              onChange={(e) => setCreateUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={createPassword}
              onChange={(e) => setCreatePassword(e.target.value)}
            />
            <button  onClick={handleCreateAccount} className='submit'>
              Create Account
            </button>
            <p>
              Already have an account?{' '}
              <button
                
                onClick={() => setIsCreateAccount(false)}
                className='toggleButton'
              >
                Login
              </button>
            </p>
          </>
        ) : (
          <>
            <label>Login</label>
            <input
              type="text"
              placeholder="Username"
              value={loginUsername}
              onChange={(e) => setLoginUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />
            <button  onClick={handleLogin} className='submit'>
              Login
            </button>
            <p>
              Don't have an account?{' '}
              <button
              
                onClick={() => setIsCreateAccount(true)}
                className='toggleButton'
              >
                Create Account
              </button>
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
};


export default DropdownMenuWithInputsAndVehiclesAndSubmit;
