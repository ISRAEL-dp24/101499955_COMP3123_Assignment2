import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Box,
  Grid,
  CircularProgress,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/api';

const EmployeeForm = () => {
  const navigate = useNavigate();
  const { id } = useParams(); 
  const isEdit = Boolean(id);

  const [employeeId, setEmployeeId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [position, setPosition] = useState('');
  const [salary, setSalary] = useState('');
  const [dateOfJoining, setDateOfJoining] = useState('');
  const [department, setDepartment] = useState('');

  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [currentProfilePicture, setCurrentProfilePicture] = useState(null);

  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const formatDateForInput = (value) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const fetchEmployee = async () => {
      if (!isEdit) return;

      setLoading(true);
      setError('');

      try {
        const response = await api.get(`/emp/employees/${id}`);
        const emp = response.data;

        setEmployeeId(emp.employeeId || '');
        setFirstName(emp.firstName || '');
        setLastName(emp.lastName || '');
        setEmail(emp.email || '');
        setPosition(emp.position || '');
        setSalary(emp.salary != null ? String(emp.salary) : '');
        setDateOfJoining(formatDateForInput(emp.date_of_joining));
        setDepartment(emp.department || '');
        setCurrentProfilePicture(emp.profilePicture || null);
      } catch (err) {
        console.error('Error fetching employee:', err);
        const message =
          err.response?.data?.message || 'Failed to load employee details.';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id, isEdit]);

  const validate = () => {
    if (
      !employeeId ||
      !firstName ||
      !lastName ||
      !email ||
      !position ||
      !salary ||
      !dateOfJoining ||
      !department
    ) {
      setError(
        'All fields (Employee ID, First Name, Last Name, Email, Position, Salary, Date of Joining, Department) are required.'
      );
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!validate()) return;

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('employeeId', employeeId);
      formData.append('firstName', firstName);
      formData.append('lastName', lastName);
      formData.append('email', email);
      formData.append('position', position);
      formData.append('salary', salary);
      formData.append('date_of_joining', dateOfJoining);
      formData.append('department', department);

      if (profilePictureFile) {
        formData.append('profilePicture', profilePictureFile);
      }

      if (isEdit) {
        await api.put(`/emp/employees/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        await api.post('/emp/employees', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      navigate('/employees');
    } catch (err) {
      console.error('Error saving employee:', err);
      const message =
        err.response?.data?.message || 'Failed to save employee. Please try again.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      setProfilePictureFile(event.target.files[0]);
    } else {
      setProfilePictureFile(null);
    }
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

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {isEdit ? 'Edit Employee' : 'Add Employee'}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Employee ID"
                fullWidth
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                fullWidth
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="First Name"
                fullWidth
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Last Name"
                fullWidth
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Position"
                fullWidth
                value={position}
                onChange={(e) => setPosition(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Department"
                fullWidth
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Salary"
                fullWidth
                type="number"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Date of Joining"
                fullWidth
                type="date"
                InputLabelProps={{ shrink: true }}
                value={dateOfJoining}
                onChange={(e) => setDateOfJoining(e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              {isEdit && currentProfilePicture && (
                <Box mb={1}>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    Current Profile Picture:
                  </Typography>
                  <img
                    src={`http://localhost:3000/${currentProfilePicture}`}
                    alt="Current profile"
                    style={{ maxWidth: '120px', borderRadius: 8 }}
                  />
                </Box>
              )}

              <Button variant="outlined" component="label">
                {profilePictureFile ? 'Change Profile Picture' : 'Upload Profile Picture'}
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleFileChange}
                />
              </Button>

              {profilePictureFile && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Selected file: {profilePictureFile.name}
                </Typography>
              )}
            </Grid>

            <Grid item xs={12}>
              <Box display="flex" justifyContent="flex-end" mt={2}>
                <Button
                  variant="outlined"
                  sx={{ mr: 2 }}
                  onClick={() => navigate('/employees')}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={submitting}
                >
                  {submitting
                    ? isEdit
                      ? 'Updating...'
                      : 'Saving...'
                    : isEdit
                    ? 'Update Employee'
                    : 'Save Employee'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default EmployeeForm;
