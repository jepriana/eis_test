import React, { useState, useContext, useEffect } from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { AuthContext } from '../../context/AuthContext';
import { createEmployee, updateEmployee } from '../../services/employee_api';

interface EmployeeFormProps {
  open: boolean;
  onClose: () => void;
  initialData?: any;
  fetchEmployees: () => void;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ open, onClose, initialData, fetchEmployees }) => {
  const [username, setUsername] = useState(initialData?.username || '');
  const [fullName, setFullName] = useState(initialData?.fullName || '');
  const [password, setPassword] = useState('');
  const [joinAt, setJoinAt] = useState(initialData?.joinAt || '');

  const authContext = useContext(AuthContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (authContext?.accessToken) {
      const employeeData = { username, fullName, password, joinAt };

      try {
        if (initialData) {
          await updateEmployee(authContext.accessToken, initialData.id, employeeData);
        } else {
          await createEmployee(authContext.accessToken, employeeData);
        }
        fetchEmployees();
        onClose();
      } catch (error) {
        console.error('Error saving employee:', error);
      }
    }
  };

  useEffect(() => {
    if (initialData) {
      setUsername(initialData.username);
      setFullName(initialData.fullName);
      setJoinAt(initialData.joinAt);
    }
  }, [initialData]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{initialData ? 'Edit Employee' : 'Add Employee'}</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
            required
          />
          <TextField
            label="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
            required
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
            required={!initialData} // Password required only for new employee
          />
          <TextField
            label="Join Date"
            type="date"
            value={new Date(joinAt)}
            onChange={(e) => setJoinAt(e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            required
          />
          <DialogActions>
            <Button onClick={onClose} color="secondary">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              {initialData ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeForm;
