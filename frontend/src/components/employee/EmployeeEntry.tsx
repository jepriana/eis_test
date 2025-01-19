import React, { useState, useContext, useEffect, useCallback } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Autocomplete,
  CircularProgress,
  IconButton,
  Box,
  Stack,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { AuthContext } from "../../context/AuthContext";
import { createEmployee, updateEmployee } from "../../services/employee_api";
import { createUnit, getUnits } from "../../services/unit_api";
import { createRole, getRoles } from "../../services/role_api";
import {
  createEmployeeUnitRole,
  updateEmployeeUnitRole,
  deleteEmployeeUnitRole,
} from "../../services/employee_unit_role_api";
import {formatDate} from '../../utils/date_formater';

interface EmployeeFormProps {
  open: boolean;
  onClose: () => void;
  initialData?: any;
  fetchEmployees: () => void;
}

interface UnitRole {
  id: string | null;
  unit: Category | null;
  role: Category | null;
}

interface Category {
  id: string;
  name: string;
  description: string;
}

type CategoryField = "unit" | "role";

const EmployeeEntry: React.FC<EmployeeFormProps> = ({
  open,
  onClose,
  initialData,
  fetchEmployees,
}) => {
  console.log(initialData);
  const [username, setUsername] = useState(initialData?.username || "");
  const [fullName, setFullName] = useState(initialData?.fullName || "");
  const [password, setPassword] = useState("");
  const [joinAt, setJoinAt] = useState(formatDate(initialData?.joinAt || ""));
  const [unitRoles, setUnitRoles] = useState<UnitRole[]>(
    initialData?.unitRoles || []
  );
  const [roleOptions, setRoleOptions] = useState<Category[]>([]);
  const [unitOptions, setUnitOptions] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const authContext = useContext(AuthContext);  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (authContext?.accessToken) {
      const employeeData = { username, fullName, password, joinAt };
      try {
        let employeeId: string | null = null;
        if (initialData) {
          employeeId = initialData.id;
          await updateEmployee(
            authContext.accessToken,
            initialData.id,
            employeeData
          );
        } else {
          const result = await createEmployee(
            authContext.accessToken,
            employeeData
          );
          employeeId = result.data.id;
        }

        await Promise.all(
          unitRoles.map(async (unitRole) => {
            if (unitRole.id === null) {
              await createEmployeeUnitRole(authContext!.accessToken!, {
                employeeId,
                unitId: unitRole.unit?.id,
                roleId: unitRole.role?.id,
              });
            } else {
              await updateEmployeeUnitRole(
                authContext!.accessToken!,
                unitRole.id,
                {
                  employeeId,
                  unitId: unitRole.unit?.id,
                  roleId: unitRole.role?.id,
                }
              );
            }
          })
        );

        fetchEmployees();
        onClose();
      } catch (error) {
        console.error("Error saving employee:", error);
      }
    }
  };

  const fetchRoles = useCallback( async (keyword: string) => {
    if (authContext?.accessToken) {
      const response = await getRoles(authContext.accessToken, keyword, 1, 10);
      setRoleOptions(response.data.data);
    }
  }, [authContext?.accessToken]);

  const fetchUnits = useCallback( async (keyword: string) => {
    if (authContext?.accessToken) {
      const response = await getUnits(authContext.accessToken, keyword, 1, 10);
      setUnitOptions(response.data.data);
    }
  }, [authContext?.accessToken]);

  const fetchInitialData = useCallback(async () => {
    if (authContext?.accessToken) {
      setIsLoading(true);
      try {
        await fetchUnits("");
        await fetchRoles("");
      } catch (error) {
        console.error("Error fetching initial data:", error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [authContext?.accessToken, fetchRoles, fetchUnits]);

  const handleAddUnitRole = async () => {
    setUnitRoles([...unitRoles, { id: null, unit: null, role: null }]);
    await fetchUnits("");
    await fetchRoles("");
  };

  const handleDeleteUnitRole = (index: number) => {
    const unitRole = unitRoles[index];
    setUnitRoles((prevUnitRoles) => {
      const updatedUnitRoles = prevUnitRoles.filter((_, i) => i !== index);
      console.log(unitRole);
      if (authContext?.accessToken && unitRole.id) {
        deleteEmployeeUnitRole(authContext.accessToken, unitRole.id);
      }
      return updatedUnitRoles;
    });
  };

  const handleChange = (
    index: number,
    field: CategoryField,
    value: Category | null
  ) => {
    const newUnitRoles = [...unitRoles];
    newUnitRoles[index] = { ...newUnitRoles[index], [field]: value };
    setUnitRoles(newUnitRoles);
  };

  const handleAddNewRole = async (roleName: string) => {
    if (authContext?.accessToken) {
      const response = await createRole(authContext.accessToken, {
        name: roleName,
        description: "",
      });
      const newRole = response.data;
      setRoleOptions([...roleOptions, newRole]);
      return newRole;
    }
    return null;
  };

  const handleAddNewUnit = async (unitName: string) => {
    if (authContext?.accessToken) {
      const response = await createUnit(authContext.accessToken, {
        name: unitName,
        description: "",
      });
      const newUnit = response.data;
      setUnitOptions([...unitOptions, newUnit]);
      return newUnit;
    }
    return null;
  };

  useEffect(() => {
    setUsername(initialData?.username || "");
    setFullName(initialData?.fullName || "");
    setPassword("");
    setJoinAt(formatDate(initialData?.joinAt || ""));
    setUnitRoles(initialData?.unitRoles || []);
    fetchInitialData();
  }, [authContext?.accessToken, initialData, fetchInitialData]);

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        {" "}
        <CircularProgress />{" "}
      </Box>
    );
  }

  const getDropdownOptionsWithAddNew = (
    options: Category[] = [],
    inputValue: string
  ) => {
    const filteredOptions = options.filter((option) =>
      option.name.toLowerCase().includes(inputValue.toLowerCase())
    );
    return filteredOptions.length > 0
      ? filteredOptions
      : [{ id: "add-new", name: `Add new ${inputValue}`, description: "" }];
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {initialData ? "Edit Employee" : "Add Employee"}
      </DialogTitle>
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
            <Stack
              direction="row"
              spacing={2}
              key={index}
              alignItems={"center"}
              width={"100%"}
            >
              <Box flexGrow={1}>
                <Autocomplete
                  options={getDropdownOptionsWithAddNew(
                    unitOptions,
                    unitRole.unit?.name || ""
                  )}
                  getOptionLabel={(option) => option.name}
                  value={unitRole.unit}
                  onChange={async (e, newValue) => {
                    if (newValue?.id === "add-new") {
                      const newUnit = await handleAddNewUnit(
                        newValue.name.replace("Add new ", "")
                      );
                      if (newUnit) handleChange(index, "unit", newUnit);
                    } else {
                      handleChange(index, "unit", newValue);
                    }
                  }}
                  onInputChange={(e, newInputValue) =>
                    fetchUnits(newInputValue)
                  }
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
              </Box>
              <Box flexGrow={1}>
                <Autocomplete
                  options={getDropdownOptionsWithAddNew(
                    roleOptions,
                    unitRole.role?.name || ""
                  )}
                  getOptionLabel={(option) => option.name}
                  value={unitRole.role}
                  onChange={async (e, newValue) => {
                    if (newValue?.id === "add-new") {
                      const newRole = await handleAddNewRole(
                        newValue.name.replace("Add new ", "")
                      );
                      if (newRole) handleChange(index, "role", newRole);
                    } else {
                      handleChange(index, "role", newValue);
                    }
                  }}
                  onInputChange={(e, newInputValue) =>
                    fetchRoles(newInputValue)
                  }
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
              </Box>
              <Box>
                <IconButton
                  onClick={() => handleDeleteUnitRole(index)}
                  color="secondary"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Stack>
          ))}
          <Button onClick={handleAddUnitRole} color="primary">
            Add Unit & Role
          </Button>
          <DialogActions>
            <Button onClick={onClose} color="secondary">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              {initialData ? "Update" : "Add"}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeEntry;
