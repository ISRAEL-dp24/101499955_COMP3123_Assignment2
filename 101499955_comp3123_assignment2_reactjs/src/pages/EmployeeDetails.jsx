import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Grid,
  Avatar,
  Button,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';

const EmployeeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadEmployee = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get(`/emp/employees/${id}`);
      setEmployee(response.data);
    } catch (err) {
      console.error('Error loading employee:', err);
      const message =
        err.response?.data?.message || 'Failed to load employee details.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployee();
  }, [id]);

  const formatDate = (value) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent>
          <Alert severity="error">{error}</Alert>
        </CardContent>
      </Card>
    );
  }

  if (!employee) {
    return null;
  }

  const photoSrc =
    employee.profilePictureUrl ||
    (employee.profilePicture
      ? `http://localhost:3000/${employee.profilePicture}`
      : null);

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5">Employee Details</Typography>
          <Box>
            <Button
              variant="outlined"
              sx={{ mr: 1 }}
              onClick={() => navigate(`/employees/${employee.id}/edit`)}
            >
              Edit
            </Button>
            <Button variant="outlined" onClick={() => navigate('/employees')}>
              Back to List
            </Button>
          </Box>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Box display="flex" flexDirection="column" alignItems="center">
              {photoSrc ? (
                <Avatar
                  src={photoSrc}
                  alt={`${employee.firstName} ${employee.lastName}`}
                  sx={{ width: 120, height: 120, mb: 2 }}
                />
              ) : (
                <Avatar sx={{ width: 120, height: 120, mb: 2 }}>
                  {employee.firstName?.[0]}
                  {employee.lastName?.[0]}
                </Avatar>
              )}
              <Typography variant="h6">
                {employee.firstName} {employee.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {employee.position} • {employee.department}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={8}>
            <Grid container spacing={1}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Employee ID</Typography>
                <Typography>{employee.employeeId}</Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Email</Typography>
                <Typography>{employee.email}</Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Position</Typography>
                <Typography>{employee.position}</Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Department</Typography>
                <Typography>{employee.department}</Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Salary</Typography>
                <Typography>{employee.salary}</Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Date of Joining</Typography>
                <Typography>{formatDate(employee.date_of_joining)}</Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default EmployeeDetails;
