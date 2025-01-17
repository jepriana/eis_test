import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Collapse, Toolbar, Box, Typography, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import BusinessIcon from '@mui/icons-material/Business';
import WorkIcon from '@mui/icons-material/Work';

const drawerWidth = 240;

interface SidebarProps {
  open: boolean;
  handleDrawerToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, handleDrawerToggle }) => {
  const [openCollapse, setOpenCollapse] = useState(false);

  const handleClick = () => {
    setOpenCollapse(!openCollapse);
  };

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      sx={{
        width: open ? drawerWidth : 0,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: open ? drawerWidth : 0, transition: 'width 0.3s' },
      }}
    >
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          MyApp
        </Typography>
        <IconButton onClick={handleDrawerToggle}>
          <MenuIcon />
        </IconButton>
      </Toolbar>
      <Box sx={{ overflow: 'auto' }}>
        <List>
          <ListItem component={Link} to="/dashboard">
            <ListItemIcon><DashboardIcon /></ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem component={Link} to="/employees">
            <ListItemIcon><PeopleIcon /></ListItemIcon>
            <ListItemText primary="Employees" />
          </ListItem>
          <ListItem onClick={handleClick}>
            <ListItemIcon><BusinessIcon /></ListItemIcon>
            <ListItemText primary="Master Data" />
            {openCollapse ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={openCollapse} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem component={Link} to="/units" sx={{ pl: 4 }}>
                <ListItemIcon><BusinessIcon /></ListItemIcon>
                <ListItemText primary="Units" />
              </ListItem>
              <ListItem component={Link} to="/roles" sx={{ pl: 4 }}>
                <ListItemIcon><WorkIcon /></ListItemIcon>
                <ListItemText primary="Roles" />
              </ListItem>
            </List>
          </Collapse>
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
