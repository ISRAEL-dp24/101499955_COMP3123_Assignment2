const express = require('express');
const router = express.Router();

const Employee = require('../models/Employee');

const fs = require('fs');
const path = require('path');
const multer = require('multer');

// Import auth middleware from userRoutes
const { authenticateToken } = require('./userRoutes');

// =======================
// MULTER CONFIG FOR FILE UPLOADS
// =======================

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    const uniqueName = `${baseName}-${Date.now()}${ext}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// Helper: map Employee document to response object
const mapEmployee = (req, emp) => {
  const relativePath = emp.profilePicture || null;
  const profilePictureUrl = relativePath
    ? `${req.protocol}://${req.get('host')}/${relativePath}`
    : null;

  return {
    id: emp._id,
    employeeId: emp.employeeId,
    firstName: emp.firstName,
    lastName: emp.lastName,
    email: emp.email,
    position: emp.position,
    salary: emp.salary,
    date_of_joining: emp.date_of_joining,
    department: emp.department,
    profilePicture: relativePath,
    profilePictureUrl,
  };
};


// =======================
// CREATE EMPLOYEE
// POST /api/v1/emp/employees
// =======================
router.post(
  '/employees',
  authenticateToken,
  upload.single('profilePicture'),
  async (req, res) => {
    try {
      const {
        employeeId,
        firstName,
        lastName,
        email,
        position,
        salary,
        date_of_joining,
        department
      } = req.body;

      // Basic validation
      if (!employeeId || !firstName || !lastName || !email || !position || !salary || !date_of_joining || !department) {
        return res.status(400).json({
          message: 'All fields (employeeId, firstName, lastName, email, position, salary, date_of_joining, department) are required'
        });
      }

      const employee = new Employee({
        employeeId,
        firstName,
        lastName,
        email,
        position,
        salary: parseFloat(salary),
        date_of_joining,
        department
      });

      // If file uploaded, save relative path
      if (req.file) {
        employee.profilePicture = path.join('uploads', req.file.filename).replace(/\\/g, '/');
      }

      await employee.save();

      return res.status(201).json({
      message: 'Employee created successfully',
      employee: mapEmployee(req, employee),
      });

    } catch (error) {
      console.error('Error creating employee:', error);
      return res.status(500).json({ message: 'Error creating employee', error: error.message });
    }
  }
);

// =======================
// GET ALL EMPLOYEES
// GET /api/v1/emp/employees
// =======================
// =======================
// GET ALL / FILTERED EMPLOYEES
// GET /api/v1/emp/employees
// (optional query params: ?department=...&position=...)
// =======================
router.get('/employees', authenticateToken, async (req, res) => {
  try {
    const { department, position } = req.query;

    const filter = {};
    if (department) filter.department = department;
    if (position) filter.position = position;

    const employees = await Employee.find(filter, { __v: 0 }).sort({ createdAt: -1 });
    const mapped = employees.map((emp) => mapEmployee(req, emp));
    return res.json(mapped);
  } catch (error) {
    console.error('Error fetching employees:', error);
    return res.status(500).json({
      message: 'Error fetching employees',
      error: error.message,
    });
  }
});


// =======================
// GET EMPLOYEE BY ID
// GET /api/v1/emp/employees/:id
// =======================
router.get('/employees/:id', authenticateToken, async (req, res) => {
  try {
    const emp = await Employee.findById(req.params.id, { __v: 0 });
    if (!emp) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    return res.json(mapEmployee(req, emp));
  } catch (error) {
    console.error('Error fetching employee:', error);
    return res.status(500).json({ message: 'Error fetching employee', error: error.message });
  }
});

// =======================
// UPDATE EMPLOYEE
// PUT /api/v1/emp/employees/:id
// =======================
router.put(
  '/employees/:id',
  authenticateToken,
  upload.single('profilePicture'),
  async (req, res) => {
    try {
      const {
        employeeId,
        firstName,
        lastName,
        email,
        position,
        salary,
        date_of_joining,
        department
      } = req.body;

      const emp = await Employee.findById(req.params.id);
      if (!emp) {
        return res.status(404).json({ message: 'Employee not found' });
      }

      // Update fields if provided
      if (employeeId !== undefined) emp.employeeId = employeeId;
      if (firstName !== undefined) emp.firstName = firstName;
      if (lastName !== undefined) emp.lastName = lastName;
      if (email !== undefined) emp.email = email;
      if (position !== undefined) emp.position = position;
      if (salary !== undefined) emp.salary = parseFloat(salary);
      if (date_of_joining !== undefined) emp.date_of_joining = date_of_joining;
      if (department !== undefined) emp.department = department;

      // If new file uploaded, optionally delete old file, then set new path
      if (req.file) {
        if (emp.profilePicture) {
          const oldPath = path.join(__dirname, '..', emp.profilePicture);
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        }
        emp.profilePicture = path.join('uploads', req.file.filename).replace(/\\/g, '/');
      }

      await emp.save();

      return res.json({
  message: 'Employee updated successfully',
  employee: mapEmployee(req, emp),
});

    } catch (error) {
      console.error('Error updating employee:', error);
      return res.status(500).json({ message: 'Error updating employee', error: error.message });
    }
  }
);

// =======================
// DELETE EMPLOYEE
// DELETE /api/v1/emp/employees/:id
// =======================
router.delete('/employees/:id', authenticateToken, async (req, res) => {
  try {
    const emp = await Employee.findById(req.params.id);
    if (!emp) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Delete profile picture from disk if exists
    if (emp.profilePicture) {
      const imgPath = path.join(__dirname, '..', emp.profilePicture);
      if (fs.existsSync(imgPath)) {
        fs.unlinkSync(imgPath);
      }
    }

    await Employee.deleteOne({ _id: emp._id });

    return res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    return res.status(500).json({ message: 'Error deleting employee', error: error.message });
  }
});

// =======================
// SEARCH EMPLOYEES
// GET /api/v1/emp/employees/search?department=...&position=...
// =======================
router.get('/employees/search', authenticateToken, async (req, res) => {
  try {
    const { department, position } = req.query;

    const filter = {};
    if (department) filter.department = department;
    if (position) filter.position = position;

    const employees = await Employee.find(filter, { __v: 0 }).sort({ createdAt: -1 });
const mapped = employees.map((emp) => mapEmployee(req, emp));

return res.json(mapped);

  } catch (error) {
    console.error('Error searching employees:', error);
    return res.status(500).json({ message: 'Error searching employees', error: error.message });
  }
});

module.exports = router;
