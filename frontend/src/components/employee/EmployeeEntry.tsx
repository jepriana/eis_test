import React, { useState, useContext, useEffect } from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Autocomplete, Grid, CircularProgress } from '@mui/material';
import { AuthContext } from '../../context/AuthContext';
import { createEmployee, updateEmployee } from '../../services/employee_api';
import { createUnit, getUnits, getAllUnits } from '../../services/unit_api';
import { createRole, getRoles, getAllRoles } from '../../services/role_api';

interface EmployeeFormProps {
  open: boolean;
  onClose: () => void;
  initialData?: any;
  fetchEmployees: () => void;
}

interface UnitRole {
  id: string | null;
  unit: Category | null,
  role: Category | null
}

interface Category {
  id: string;
  name: string;
  description: string;
}

type CategoryField = 'unit' | 'role';

const EmployeeEntry: React.FC<EmployeeFormProps> = ({ open, onClose, initialData, fetchEmployees }) => {
  const [username, setUsername] = useState(initialData?.username || '');
  const [fullName, setFullName] = useState(initialData?.fullName || '');
  const [password, setPassword] = useState('');
  const [joinAt, setJoinAt] = useState(initialData?.joinAt || '');
  const [unitRoles, setUnitRoles] = useState<UnitRole[]>(initialData?.unitRoles || []);
  const [roles, setRoles] = useState<Category[]>([]);
  const [units, setUnits] = useState<Category[]>([]);
  const [roleOptions, setRoleOptions] = useState<Category[]>([]);
  const [unitOptions, setUnitOptions] = useState<Category[]>([]);
  const [roleKeyword, setRoleKeyword] = useState('');
  const [unitKeyword, setUnitKeyword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

  const fetchInitialData = async () => {
    if (authContext?.accessToken) {
      setIsLoading(true);
      try {
        const allRoles = await getAllRoles(authContext.accessToken, '');
        const allUnits = await getAllUnits(authContext.accessToken, '');

        setRoles(allRoles.data.data);
        setUnits(allUnits.data.data);
      } catch (error) {
        console.error('Error fetching initial data:', error);
      } finally {
        setIsLoading(false);
      }
    }
  }

  const fetchRoles = async (token: string, keyword: string) => { 
    const response = await getRoles(token, keyword, 1, 10); 
    setRoles(response.data.data); 
  }; 
  
  const fetchUnits = async (token: string, keyword: string) => { 
    const response = await getUnits(token, keyword, 1, 10); 
    setUnits(response.data.data); 
  };

  const handleAddUnitRole = () => { 
    setUnitRoles([...unitRoles, { id: null, unit: null, role: null }]); 
  }; 
  
  const handleDeleteRole = (index: number) => { 
    setUnitRoles(unitRoles.filter((_, i) => i !== index)); 
  };

  const handleChange = (index: number, field: CategoryField, value: string) => { 
    const newUnitRoles = [...unitRoles]; 
    let newValue: Category | null;
    if (field === 'unit') {
      newValue = units.find((unit) => unit.id === value) || null;
    } else {
      newValue = roles.find((role) => role.id === value) || null;
    }
    newUnitRoles[index] = { ...newUnitRoles[index], [field]: newValue };
    setUnitRoles(newUnitRoles); 
  };

  const handleUnitSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUnitKeyword(e.target.value);
  }

  const handleRoleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoleKeyword(e.target.value);
  }

  const handleAddNewRole = async () => {
    const roleName = prompt('Enter new role name:');
    if (roleName) {
      const response = await createRole(authContext!.accessToken!, { name: roleName });
      setRoleOptions([...roleOptions, response.data]);
    }
  };

  const handleAddNewUnit = async () => {
    const unitName = prompt('Enter new unit name:');
    if (unitName) {
      const response = await createUnit(authContext!.accessToken!, { name: unitName });
      setUnitOptions([...unitOptions, response.data]);
    }
  };

  useEffect(() => {
    if (authContext?.accessToken) {      
      fetchUnits(authContext.accessToken, unitKeyword);
      fetchRoles(authContext.accessToken, roleKeyword);
      fetchInitialData();
    }
    if (initialData) {
      setUsername(initialData.username);
      setFullName(initialData.fullName);
      setJoinAt(initialData.joinAt);
      setUnitRoles(initialData.unitRoles);
    }
  }, [authContext?.accessToken, initialData, unitKeyword, roleKeyword]);

  if (isLoading) {
     return <CircularProgress />;
  }
  return  (
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
            value={joinAt}
            onChange={(e) => setJoinAt(e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            required
          />
        {unitRoles.map((unitRole, index) => (
            <Grid container spacing={2} key={index}>
              <Grid item xs={6}>
              <Autocomplete
                options={unitOptions}
                getOptionLabel={(option) => option.name}
                value={unitOptions.find((u) => u.id === unitRole.unit?.id) || null}
                onChange={(e, newValue) => handleChange(index, 'unit', newValue?.id || '')}
                onInputChange={(e) => handleUnitSearch}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Unit"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                  />
                )}
              />
              </Grid>
              <Grid item xs={5}>
              <Autocomplete
                options={roleOptions}
                getOptionLabel={(option) => option.name}
                value={roleOptions.find((u) => u.id === unitRole.role?.id) || null}
                onChange={(e, newValue) => handleChange(index, 'role', newValue?.id || '')}
                onInputChange={(e) =>handleRoleSearch }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Role"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                  />
                )}
              />
              </Grid>
              <Button onClick={() => handleDeleteRole(index)} color="secondary">
                Delete Unit Role
              </Button>
            </Grid>
          ))}
          <Button onClick={handleAddUnitRole} color="primary">
            Add Role
          </Button>
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

export default EmployeeEntry;
