// src/pages/SearchEmployees.jsx
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Avatar,
  Stack,
} from '@mui/material';
import { Visibility, Edit } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

const SearchEmployees = () => {
  const navigate = useNavigate();

  const [department, setDepartment] = useState('');
  const [position, setPosition] = useState('');
  const [results, setResults] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (event) => {
    event.preventDefault();
    setError('');
    setHasSearched(false);

    // If nothing is provided, we can either show error or treat as "no filter"
    if (!department && !position) {
      setError('Please enter department, position, or both to search.');
      return;
    }

    setLoading(true);
    try {
      const params = {};
      if (department) params.department = department;
      if (position) params.position = position;

      const response = await api.get('/emp/employees', { params });
      setResults(response.data);
      setHasSearched(true);
    } catch (err) {
      console.error('Error searching employees:', err);
      const message =
        err.response?.data?.message || 'Failed to search employees.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (id) => {
    navigate(`/employees/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/employees/${id}/edit`);
  };

  const renderResults = () => {
    if (loading) {
      return (
        <Box display="flex" justifyContent="center" my={3}>
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      );
    }

    if (hasSearched && results.length === 0) {
      return (
        <Typography sx={{ mt: 2 }}>
          No employees found for the given criteria.
        </Typography>
      );
    }

    if (!hasSearched) {
      return null;
    }

    return (
      <Table sx={{ mt: 3 }}>
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
          {results.map((emp) => {
            const photoSrc =
              emp.profilePictureUrl ||
              (emp.profilePicture
                ? `http://localhost:3000/${emp.profilePicture}`
                : null);
            return (
              <TableRow key={emp.id}>
                <TableCell>
                  {photoSrc ? (
                    <Avatar
                      src={photoSrc}
                      alt={`${emp.firstName} ${emp.lastName}`}
                    />
                  ) : (
                    <Avatar>
                      {emp.firstName?.[0]}
                      {emp.lastName?.[0]}
                    </Avatar>
                  )}
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
                    <Button
                      size="small"
                      startIcon={<Visibility fontSize="small" />}
                      onClick={() => handleView(emp.id)}
                    >
                      View
                    </Button>
                    <Button
                      size="small"
                      startIcon={<Edit fontSize="small" />}
                      onClick={() => handleEdit(emp.id)}
                    >
                      Edit
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    );
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Search Employees
        </Typography>

        <Box component="form" onSubmit={handleSearch} sx={{ mt: 2 }}>
          <Box display="flex" gap={2} flexWrap="wrap">
            <TextField
              label="Department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            />
            <TextField
              label="Position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{ alignSelf: 'center' }}
            >
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </Box>
        </Box>

        {renderResults()}
      </CardContent>
    </Card>
  );
};

export default SearchEmployees;
