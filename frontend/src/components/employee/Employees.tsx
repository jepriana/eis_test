import React, { useEffect, useState, useContext, useCallback } from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  Box,
  Button,
  TextField,
  IconButton,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { AuthContext } from "../../context/AuthContext";
import { getEmployees, deleteEmployee } from "../../services/employee_api";
import EmployeeEntry from "./EmployeeEntry";

const Employees: React.FC = () => {
  const [employees, setEmployees] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean, employeeId: string | null }>({ open: false, employeeId: null });

  const authContext = useContext(AuthContext);

  const fetchEmployees = useCallback(async () => {
    if (authContext?.accessToken) {
      const response = await getEmployees(
        authContext.accessToken,
        keyword,
        page + 1,
        rowsPerPage
      );
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

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
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
      setDeleteConfirm({ open: false, employeeId: null });
      await deleteEmployee(authContext.accessToken, employeeId);
      fetchEmployees();
    }
  };

  const handleFormClose = () => {
    setOpenForm(false);
    setEditData(null);
    fetchEmployees();
  };

  const handleDeleteConfirm = (employeeId: string) => {
    setDeleteConfirm({ open: true, employeeId });
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm({ open: false, employeeId: null });
  };

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h4">Employee List</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenForm(true)}
          >
            Add Employee
          </Button>
        </Box>
        <Box sx={{ mt: 2 }}>
          <TextField
            label="Search"
            value={keyword}
            onChange={handleSearch}
            fullWidth
            margin="normal"
            variant="outlined"
          />
        </Box>
      </Box>
      <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 3 }}>
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
                  <IconButton onClick={() => handleDeleteConfirm(employee.id)} color="secondary">
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
      </Paper>
      <EmployeeEntry open={openForm} onClose={handleFormClose} initialData={editData} fetchEmployees={fetchEmployees} />
      <Dialog open={deleteConfirm.open} onClose={handleDeleteCancel}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this employee?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={() => handleDelete(deleteConfirm.employeeId!)} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Employees;
