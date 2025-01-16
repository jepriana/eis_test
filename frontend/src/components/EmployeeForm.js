import React, { useState } from 'react';
import { createEmployee, updateEmployee } from '../api';

const EmployeeForm = ({ token }) => {
  const [employee, setEmployee] = useState({
    username: '',
    fullName: '',
    password: '',
  });
  const [isEdit, setIsEdit] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee({ ...employee, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await updateEmployee(employee.id, employee, token);
      } else {
        await createEmployee(employee, token);
      }
      // Reset form
      setEmployee({
        username: '',
        fullName: '',
        password: '',
      });
      setIsEdit(false);
    } catch (error) {
      console.error('Error saving employee', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Username:</label>
        <input
          type="text"
          name="username"
          value={employee.username}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Full Name:</label>
        <input
          type="text"
          name="fullName"
          value={employee.fullName}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={employee.password}
          onChange={handleChange}
        />
      </div>
      <button type="submit">Save Employee</button>
    </form>
  );
};

export default EmployeeForm;
