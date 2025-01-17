import React, { useEffect, useState, useContext, useCallback } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableHead, TableRow, TablePagination, Box, Button, TextField, IconButton } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { AuthContext } from '../../context/AuthContext';
import { getEmployees, deleteEmployee } from '../../services/employee_api';
import EmployeeForm from './EmployeeForm';

const EmployeeList: React.FC = () => {
  const [employees, setEmployees] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [editData, setEditData] = useState(null);

  const authContext = useContext(AuthContext);

  const fetchEmployees = useCallback(async () => {
    if (authContext?.accessToken) {
      const response = await getEmployees(authContext.accessToken, keyword, page + 1, rowsPerPage);
      setTotalRecords(response.data.totalRecords);
      setEmployees(response.data.data);
    }
  }, [authContext?.accessToken, keyword, page, rowsPerPage]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

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

  const handleEdit = (employee: any) => {
    setEditData(employee);
    setOpenForm(true);
  };

  const handleDelete = async (employeeId: string) => {
    if (authContext?.accessToken) {
      await deleteEmployee(authContext.accessToken, employeeId);
      fetchEmployees();
    }
  };

  const handleFormClose = () => {
    setOpenForm(false);
    setEditData(null);
    fetchEmployees();
  };

  return (
    <Container>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
        <Typography variant="h4">Employee List</Typography>
        <TextField
          label="Search"
          value={keyword}
          onChange={handleSearch}
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={() => setOpenForm(true)}>
          Add Employee
        </Button>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Full Name</TableCell>
              <TableCell>Join Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((employee: any) => (
              <TableRow key={employee.id}>
                <TableCell>{employee.username}</TableCell>
                <TableCell>{employee.fullName}</TableCell>
                <TableCell>{employee.joinAt}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(employee)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(employee.id)} color="secondary">
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
      <EmployeeForm open={openForm} onClose={handleFormClose} initialData={editData} fetchEmployees={fetchEmployees} />
    </Container>
  );
};

export default EmployeeList;
