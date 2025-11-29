import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Stack,
  Avatar,
  CircularProgress,
  Alert,
  Box,
} from '@mui/material';
import { Visibility, Edit, Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

const EmployeeList = () => {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [deletingId, setDeletingId] = useState(null);

  const fetchEmployees = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.get('/emp/employees');
      setEmployees(response.data);
    } catch (err) {
      console.error('Error fetching employees:', err);
      const message =
        err.response?.data?.message || 'Failed to fetch employees.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) {
      return;
    }

    setDeletingId(id);
    try {
      await api.delete(`/emp/employees/${id}`);
      setEmployees((prev) => prev.filter((emp) => emp.id !== id));
    } catch (err) {
      console.error('Error deleting employee:', err);
      alert(
        err.response?.data?.message || 'Failed to delete employee. Please try again.'
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleAdd = () => {
    navigate('/employees/new');
  };

  const handleView = (id) => {
    navigate(`/employees/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/employees/${id}/edit`);
  };

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5">Employees</Typography>
          <Button variant="contained" onClick={handleAdd}>
            Add Employee
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : employees.length === 0 ? (
          <Typography>No employees found. Try adding one.</Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Photo</TableCell>
                <TableCell>Employee ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Position</TableCell>
                <TableCell>Department</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.map((emp) => (
                <TableRow key={emp.id}>
                  <TableCell>
                    {(() => {
                    const photoSrc =
                        emp.profilePictureUrl ||
                        (emp.profilePicture ? `http://localhost:3000/${emp.profilePicture}` : null);

                    return photoSrc ? (
                        <Avatar src={photoSrc} alt={`${emp.firstName} ${emp.lastName}`} />
                    ) : (
                        <Avatar>
                        {emp.firstName?.[0]}
                        {emp.lastName?.[0]}
                        </Avatar>
                    );
                    })()}
                </TableCell>
                  <TableCell>{emp.employeeId}</TableCell>
                  <TableCell>
                    {emp.firstName} {emp.lastName}
                  </TableCell>
                  <TableCell>{emp.email}</TableCell>
                  <TableCell>{emp.position}</TableCell>
                  <TableCell>{emp.department}</TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <IconButton
                        aria-label="view"
                        onClick={() => handleView(emp.id)}
                        size="small"
                      >
                        <Visibility fontSize="small" />
                      </IconButton>
                      <IconButton
                        aria-label="edit"
                        onClick={() => handleEdit(emp.id)}
                        size="small"
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton
                        aria-label="delete"
                        onClick={() => handleDelete(emp.id)}
                        size="small"
                        disabled={deletingId === emp.id}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default EmployeeList;
