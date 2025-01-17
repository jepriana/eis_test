import React, { useState, useContext, useEffect } from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { AuthContext } from '../../context/AuthContext';
import { createRole, updateRole } from '../../services/role_api';

interface RoleEntryProps {
  open: boolean;
  onClose: () => void;
  initialData?: any;
  fetchRoles: () => void;
}

const RoleEntry: React.FC<RoleEntryProps> = ({ open, onClose, initialData, fetchRoles }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');

  const authContext = useContext(AuthContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (authContext?.accessToken) {
      const roleData = { name, description };

      try {
        if (initialData) {
          await updateRole(authContext.accessToken, initialData.id, roleData);
        } else {
          await createRole(authContext.accessToken, roleData);
        }
        fetchRoles();
        onClose();
      } catch (error) {
        console.error('Error saving role:', error);
      }
    }
  };

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description);
    }
  }, [initialData]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{initialData ? 'Edit Role' : 'Add Role'}</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Role Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
            required
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
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

export default RoleEntry;
