import React, { useContext, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Toolbar, IconButton, AppBar, Typography, Menu, MenuItem, CircularProgress } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AuthProvider, { AuthContext } from './context/AuthContext';
import Sidebar from './components/common/Sidebar';
import Login from './components/common/Login';
import Employees from './components/employee/Employees';
import Dashboard from './components/common/Dashboard';
import Units from './components/unit/Units';
import Roles from './components/role/Roles';
import { AccountCircle } from '@mui/icons-material';

const theme = createTheme();
const drawerWidth = 240;

const AppContent: React.FC = () => {
  const location = useLocation();
  const authContext = useContext(AuthContext);
  const hideSidebar = location.pathname === '/login';
  const [open, setOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    authContext?.logoutUser();
    handleMenuClose();
  };
  if (authContext?.loading) { return <CircularProgress />; }
    
  if (!authContext?.accessToken && location.pathname !== '/login') {
    return <Navigate to="/login" />;
  }

  return (
    <Box sx={{ display: 'flex' }}>
      {!hideSidebar && <Sidebar open={open} handleDrawerToggle={handleDrawerToggle} />}
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: !hideSidebar && open ? `calc(100% - ${drawerWidth}px)` : '100%', transition: 'width 0.3s' }}
      >
        {!hideSidebar && (
          <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar>
              <IconButton color="inherit" aria-label="open drawer" onClick={handleDrawerToggle} edge="start">
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
                Puri Bunda
              </Typography>
              <IconButton
                color="inherit"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenuOpen}
                edge="end"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                keepMounted
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </Toolbar>
          </AppBar>
        )}
        <Toolbar />
        <Routes>
          <Route
            path="/"
            element={authContext?.accessToken ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/units" element={<Units />} />
          <Route path="/roles" element={<Roles />} />
        </Routes>
      </Box>
    </Box>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
