import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            sx={{ flexGrow: 1, textDecoration: 'none' }}
            component={Link}
            to={isAuthenticated ? '/employees' : '/login'}
            color="inherit"
          >
            Employee Management
          </Typography>

          {!isAuthenticated && (
            <>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/signup">
                Signup
              </Button>
            </>
          )}

          {isAuthenticated && (
            <>
              <Button color="inherit" component={Link} to="/employees">
                Employees
              </Button>
              <Button color="inherit" component={Link} to="/search">
                Search
              </Button>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="md">
        <Box mt={4}>{children}</Box>
      </Container>
    </>
  );
};

export default Layout;
