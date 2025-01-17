import React, { useEffect, useState, useContext, useCallback } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableHead, TableRow, TablePagination, Box, Button, TextField, IconButton } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { AuthContext } from '../../context/AuthContext';
import { getUnits, deleteUnit } from '../../services/unit_api';
import UnitEntry from './UnitEntry';

const Units: React.FC = () => {
  const [units, setUnits] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [editData, setEditData] = useState(null);

  const authContext = useContext(AuthContext);

  const fetchUnits = useCallback(async () => {
    if (authContext?.accessToken) {
      const response = await getUnits(authContext.accessToken, keyword, page + 1, rowsPerPage);
      setTotalRecords(response.data.totalRecords);
      setUnits(response.data.data);
    }
  }, [authContext?.accessToken, keyword, page, rowsPerPage]);

  useEffect(() => {
    fetchUnits();
  }, [fetchUnits]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
    setPage(0);
  };

  const handleEdit = (unit: any) => {
    setEditData(unit);
    setOpenForm(true);
  };

  const handleDelete = async (unitId: string) => {
    if (authContext?.accessToken) {
      await deleteUnit(authContext.accessToken, unitId);
      fetchUnits();
    }
  };

  const handleFormClose = () => {
    setOpenForm(false);
    setEditData(null);
    fetchUnits();
  };

  return (
    <Container>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
        <Typography variant="h4">Unit List</Typography>
        <TextField
          label="Search"
          value={keyword}
          onChange={handleSearch}
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={() => setOpenForm(true)}>
          Add Unit
        </Button>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Unit Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {units.map((unit: any) => (
              <TableRow key={unit.id}>
                <TableCell>{unit.name}</TableCell>
                <TableCell>{unit.description}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(unit)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(unit.id)} color="secondary">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={totalRecords} // Update with actual total count from API
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
      <UnitEntry open={openForm} onClose={handleFormClose} initialData={editData} fetchUnits={fetchUnits} />
    </Container>
  );
};

export default Units;
