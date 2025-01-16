import React, { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Login from './components/Login';
import EmployeeList from './components/EmployeeList';
import EmployeeForm from './components/EmployeeForm';

const App = () => {
  const { authState, handleLogout } = useContext(AuthContext);

  if (!authState.accessToken) {
    return <Login />;
  }

  return (
    <div>
      <h1>Admin Panel</h1>
      <button onClick={handleLogout}>Logout</button>
      <EmployeeForm token={authState.accessToken} />
      <EmployeeList token={authState.accessToken} />
    </div>
  );
};

export default App;
