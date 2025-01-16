import React, { useState, useEffect } from 'react';
import { getAllEmployees } from '../api';

const EmployeeList = ({ token }) => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await getAllEmployees({}, token);
        setEmployees(response.data);
      } catch (error) {
        console.error('Error fetching employees', error);
      }
    };

    fetchEmployees();
  }, [token]);

  return (
    <div>
      <h1>Employee List</h1>
      <ul>
        {employees.map((employee) => (
          <li key={employee.id}>{employee.fullName}</li>
        ))}
      </ul>
    </div>
  );
};

export default EmployeeList;
