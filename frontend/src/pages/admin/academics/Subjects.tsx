import React, { useState, useEffect } from 'react';
import {
  Box, Typography, TextField, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, InputAdornment, Snackbar, Alert, Radio, RadioGroup, FormControlLabel
} from '@mui/material';
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAllSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
  clearSubjectError
} from '../../../redux/subjectRelated/subjectHandle.js';

const Subjects = () => {
  const [subjectName, setSubjectName] = useState('');
  const [subjectType, setSubjectType] = useState('Theory');
  const [subjectCode, setSubjectCode] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [editId, setEditId] = useState(null);

  const dispatch = useDispatch();
  const { subjectsList, loading, error } = useSelector((state) => state.subject);

  const [snack, setSnack] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    dispatch(getAllSubjects());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      setSnack({ open: true, message: error, severity: 'error' });
      dispatch(clearSubjectError());
    }
  }, [error, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!subjectName.trim() || !subjectCode.trim()) return;

    const payload = { 
      name: subjectName.trim(), 
      code: subjectCode.trim(),
      type: subjectType
    };

    const exists = Array.isArray(subjectsList) && subjectsList.some(
      (sub) => sub.code.toLowerCase() === subjectCode.trim().toLowerCase() && 
              (!editId || sub._id !== editId)
    );

    if (exists) {
      setSnack({ open: true, message: 'Subject with this code already exists!', severity: 'warning' });
      return;
    }

    if (editId) {
      dispatch(updateSubject(editId, payload))
        .then(() => {
          setEditId(null);
          resetForm();
          dispatch(getAllSubjects());
          setSnack({ open: true, message: 'Subject updated successfully', severity: 'success' });
        });
    } else {
      dispatch(createSubject(payload))
        .then(() => {
          resetForm();
          dispatch(getAllSubjects());
          setSnack({ open: true, message: 'Subject created successfully', severity: 'success' });
        });
    }
  };

  const resetForm = () => {
    setSubjectName('');
    setSubjectCode('');
    setSubjectType('Theory');
  };

  const handleEdit = (subject) => {
    setEditId(subject._id);
    setSubjectName(subject.name);
    setSubjectCode(subject.code);
    setSubjectType(subject.type);
  };

  const handleDelete = (id) => {
    dispatch(deleteSubject(id))
      .then(() => {
        dispatch(getAllSubjects());
        setSnack({ open: true, message: 'Subject deleted successfully', severity: 'info' });
      });
  };

  const handleCloseSnack = () => {
    setSnack({ ...snack, open: false });
  };

  const filteredSubjects = Array.isArray(subjectsList)
    ? subjectsList.filter((subject) =>
        subject?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        subject?.code?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <Box sx={{
      display: 'flex',
      gap: 3,
      p: 3,
      bgcolor: '#f9f9f9',
      minHeight: '100vh',
    }}>
      {/* Form Section */}
      <Box sx={{
        width: '30%',
        p: 3,
        borderRadius: '12px',
        bgcolor: '#fff',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: '#333' }}>
          {editId ? 'Edit Subject' : 'Add Subject'}
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Subject Name"
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
            required
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Subject Code"
            value={subjectCode}
            onChange={(e) => setSubjectCode(e.target.value)}
            required
            fullWidth
            sx={{ mb: 2 }}
          />
          <RadioGroup
            row
            value={subjectType}
            onChange={(e) => setSubjectType(e.target.value)}
            sx={{ mb: 2 }}
          >
            <FormControlLabel value="Theory" control={<Radio />} label="Theory" />
            <FormControlLabel value="Practical" control={<Radio />} label="Practical" />
          </RadioGroup>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              backgroundColor: '#1a2526',
              '&:hover': { backgroundColor: '#2e3b3d' },
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              py: 1,
            }}
          >
            {editId ? 'Update' : 'Save'}
          </Button>
        </form>
      </Box>

      {/* Table Section */}
      <Box sx={{ width: '70%' }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: '#333' }}>Subject List</Typography>
        <TextField
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2, width: '240px', bgcolor: '#fff', borderRadius: '8px' }}
        />

        {loading ? (
          <Typography sx={{ color: '#555' }}>Loading...</Typography>
        ) : (
          <>
            <TableContainer component={Paper} sx={{ boxShadow: '0 3px 10px rgba(0,0,0,0.06)' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#1a2526' }}>
                    <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Subject Name</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Code</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Type</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredSubjects.map((subject, index) => (
                    <TableRow
                      key={subject._id}
                      sx={{
                        bgcolor: index % 2 === 0 ? '#f5f5f5' : '#fff',
                        '&:hover': { backgroundColor: '#eef5f5' },
                      }}
                    >
                      <TableCell sx={{ fontWeight: 500 }}>{subject.name}</TableCell>
                      <TableCell>{subject.code}</TableCell>
                      <TableCell>{subject.type}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleEdit(subject)} sx={{ color: '#1976d2' }}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(subject._id)} sx={{ color: '#d32f2f' }}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Typography sx={{ mt: 2, color: '#555' }}>
              Records: {filteredSubjects.length} of {subjectsList?.length || 0}
            </Typography>
          </>
        )}
      </Box>

      {/* Snackbar Alert */}
      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={handleCloseSnack}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnack} severity={snack.severity} sx={{ width: '100%' }}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Subjects;