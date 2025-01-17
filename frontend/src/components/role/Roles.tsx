import React, { useEffect, useState, useContext, useCallback } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableHead, TableRow, TablePagination, Box, Button, TextField, IconButton } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { AuthContext } from '../../context/AuthContext';
import { getRoles, deleteRole } from '../../services/role_api';
import RoleEntry from './RoleEntry';

const Roles: React.FC = () => {
  const [roles, setRoles] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [editData, setEditData] = useState(null);

  const authContext = useContext(AuthContext);

  const fetchRoles = useCallback(async () => {
    if (authContext?.accessToken) {
      const response = await getRoles(authContext.accessToken, keyword, page + 1, rowsPerPage);
      setTotalRecords(response.data.totalRecords);
      setRoles(response.data.data);
    }
  }, [authContext?.accessToken, keyword, page, rowsPerPage]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

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

  const handleEdit = (role: any) => {
    setEditData(role);
    setOpenForm(true);
  };

  const handleDelete = async (roleId: string) => {
    if (authContext?.accessToken) {
      await deleteRole(authContext.accessToken, roleId);
      fetchRoles();
    }
  };

  const handleFormClose = () => {
    setOpenForm(false);
    setEditData(null);
    fetchRoles();
  };

  return (
    <Container>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
        <Typography variant="h4">Role List</Typography>
        <TextField
          label="Search"
          value={keyword}
          onChange={handleSearch}
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={() => setOpenForm(true)}>
          Add Role
        </Button>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Role Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {roles.map((role: any) => (
              <TableRow key={role.id}>
                <TableCell>{role.name}</TableCell>
                <TableCell>{role.description}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(role)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(role.id)} color="secondary">
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
      <RoleEntry open={openForm} onClose={handleFormClose} initialData={editData} fetchRoles={fetchRoles} />
    </Container>
  );
};

export default Roles;
