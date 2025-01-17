import React, { useState, useContext, useEffect } from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { AuthContext } from '../../context/AuthContext';
import { createUnit, updateUnit } from '../../services/unit_api';

interface UnitEntryProps {
  open: boolean;
  onClose: () => void;
  initialData?: any;
  fetchUnits: () => void;
}

const UnitEntry: React.FC<UnitEntryProps> = ({ open, onClose, initialData, fetchUnits }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');

  const authContext = useContext(AuthContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (authContext?.accessToken) {
      const unitData = { name, description };

      try {
        if (initialData) {
          await updateUnit(authContext.accessToken, initialData.id, unitData);
        } else {
          await createUnit(authContext.accessToken, unitData);
        }
        fetchUnits();
        onClose();
      } catch (error) {
        console.error('Error saving unit:', error);
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
      <DialogTitle>{initialData ? 'Edit Unit' : 'Add Unit'}</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Unit Name"
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

export default UnitEntry;
