// src/components/TeacherSideBar.tsx
import { Divider, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import AnnouncementOutlinedIcon from '@mui/icons-material/AnnouncementOutlined';
import ClassOutlinedIcon from '@mui/icons-material/ClassOutlined';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { useSelector } from 'react-redux';

const TeacherSideBar = () => {
  const { currentUser } = useSelector((state: any) => state.user);
  const sclassName = currentUser?.teachSclass?.sclassName || 'Not Assigned';

  const location = useLocation();

  return (
    <>
      <ListItemButton component={Link} to="/">
        <ListItemIcon>
          <HomeIcon color={location.pathname === '/' || location.pathname === '/teacher/TeacherDashboard' ? 'primary' : 'inherit'} />
        </ListItemIcon>
        <ListItemText primary="Home" />
      </ListItemButton>
      <ListItemButton component={Link} to="/Teacher/class">
        <ListItemIcon>
          <ClassOutlinedIcon color={location.pathname.startsWith('/Teacher/class') ? 'primary' : 'inherit'} />
        </ListItemIcon>
        <ListItemText primary={`Class ${sclassName}`} />
      </ListItemButton>
      <ListItemButton component={Link} to="/Teacher/complain">
        <ListItemIcon>
          <AnnouncementOutlinedIcon color={location.pathname.startsWith('/Teacher/complain') ? 'primary' : 'inherit'} />
        </ListItemIcon>
        <ListItemText primary="Complain" />
      </ListItemButton>
      <ListItemButton component={Link} to="/Teacher/update-credentials">
        <ListItemIcon>
          <VpnKeyIcon color={location.pathname.startsWith('/Teacher/update-credentials') ? 'primary' : 'inherit'} />
        </ListItemIcon>
        <ListItemText primary="Update Credentials" />
      </ListItemButton>
      <Divider sx={{ my: 1 }} />
      <ListSubheader component="div" inset>
        User
      </ListSubheader>
      <ListItemButton component={Link} to="/Teacher/TeacherProfile">
        <ListItemIcon>
          <AccountCircleOutlinedIcon color={location.pathname.startsWith('/Teacher/TeacherProfile') ? 'primary' : 'inherit'} />
        </ListItemIcon>
        <ListItemText primary="Profile" />
      </ListItemButton>
      <ListItemButton component={Link} to="/logout">
        <ListItemIcon>
          <ExitToAppIcon color={location.pathname.startsWith('/logout') ? 'primary' : 'inherit'} />
        </ListItemIcon>
        <ListItemText primary="Logout" />
      </ListItemButton>
    </>
  );
};

export default TeacherSideBar;