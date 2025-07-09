import React, { useEffect, useState, useRef } from 'react';
import {
  Box, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Grid, Card, CardContent, FormControl, InputLabel, Select, MenuItem, Snackbar, Alert, InputAdornment,
  Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { Search as SearchIcon, Add as AddIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import ReactPaginate from 'react-paginate';
import { getAllExamSchedules, createExamSchedule, clearExamScheduleError } from '../../../redux/examRelated/exam-schedule-actions';
import { getAllExamGroups } from '../../../redux/examRelated/exam-group-actions';

// Styled Components
const Container = styled(Box)`
  padding: 16px;
  background-color: #f4f6f8;
  min-height: 100vh;
  @media (min-width: 960px) {
    padding: 32px;
  }
`;

const Heading = styled(Typography)`
  text-align: center;
  font-weight: 700;
  color: #1a2526;
  margin-bottom: 32px;
  font-size: 1.5rem;
  @media (min-width: 960px) {
    font-size: 2.125rem;
  }
`;

const CriteriaCard = styled(Card)`
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background-color: #fff;
`;

const TableCard = styled(Card)`
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background-color: #fff;
`;

const SubHeading = styled(Typography)`
  margin-bottom: 16px;
  font-weight: 600;
  color: #1a2526;
`;

const CriteriaContainer = styled(Box)`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 16px;
  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const SearchContainer = styled(Box)`
  display: flex;
  gap: 8px;
  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const AddButton = styled(Button)`
  border-radius: 20px;
  text-transform: none;
  background-color: #2e7d32;
  color: white;
  &:hover {
    background-color: #1b5e20;
  }
`;

const SearchButton = styled(Button)`
  border-radius: 20px;
  text-transform: none;
  background-color: #1976d2;
  color: white;
  &:hover {
    background-color: #115293;
  }
`;

const CancelButton = styled(Button)`
  border-radius: 20px;
  text-transform: none;
  background-color: #f44336;
  color: white;
  &:hover {
    background-color: #d32f2f;
  }
`;

const StyledTableContainer = styled(TableContainer)`
  box-shadow: none;
  background-color: #fff;
  overflow-x: auto;
`;

const StyledTableRow = styled(TableRow)`
  &:nth-of-type(odd) {
    background-color: #f9f9f9;
  }
  &:hover {
    background-color: #e0f7fa;
  }
`;

const PaginationContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  gap: 10px;
`;

const FormContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 8px;
`;

const examTypes = [
  'Monthly Test March 2025',
  'Final Exam Quarterly Examination Sept 2024',
  'Monthly Test JULY 2024',
  'Half-Yearly Examination Dec 2024',
];

const ExamSchedule = () => {
  const dispatch = useDispatch();
  const examScheduleState = useSelector((state) => state.examSchedule || { examSchedulesList: [], loading: false, error: null });
  const examGroupState = useSelector((state) => state.examGroup || { examGroupsList: [], loading: false, error: null });
  const userState = useSelector((state) => state.user || {});
  const { examSchedulesList, loading, error } = examScheduleState;
  const { examGroupsList } = examGroupState;
  const adminID = userState.currentUser?._id;

  const [subjectSearchTerm, setSubjectSearchTerm] = useState('');
  const [selectedExamGroup, setSelectedExamGroup] = useState('');
  const [selectedExamType, setSelectedExamType] = useState('');
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isExamGroupSelectOpen, setIsExamGroupSelectOpen] = useState(false);
  const [isExamTypeSelectOpen, setIsExamTypeSelectOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    time: '',
    duration: '',
    room: '',
    maxMarks: '',
    minMarks: '',
    examGroup: '',
    examType: '',
  });

  // Refs for form fields and buttons
  const subjectRef = useRef(null);
  const dateRef = useRef(null);
  const timeRef = useRef(null);
  const durationRef = useRef(null);
  const roomRef = useRef(null);
  const maxMarksRef = useRef(null);
  const minMarksRef = useRef(null);
  const examGroupRef = useRef(null);
  const examTypeRef = useRef(null);
  const saveButtonRef = useRef(null);

  useEffect(() => {
    if (adminID) {
      dispatch(getAllExamSchedules(adminID));
      dispatch(getAllExamGroups(adminID));
    } else {
      setSnack({ open: true, message: 'Please log in to view exam schedules', severity: 'error' });
    }
  }, [dispatch, adminID]);

  useEffect(() => {
    if (error) {
      setSnack({ open: true, message: error, severity: 'error' });
      dispatch(clearExamScheduleError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    setFilteredSchedules(examSchedulesList);
  }, [examSchedulesList]);

  const handleSubjectSearch = () => {
    console.log('Subject Search Term:', subjectSearchTerm);
    const filtered = examSchedulesList.filter((schedule) =>
      schedule.name.toLowerCase().includes(subjectSearchTerm.toLowerCase())
    );
    console.log('Filtered Schedules (Subject):', filtered);
    setFilteredSchedules([...filtered]);
    setCurrentPage(0); // Reset to first page on search
    if (filtered.length === 0) {
      setSnack({ open: true, message: 'No schedules found for the subject search', severity: 'info' });
    }
  };

  const handleCriteriaSearch = () => {
    console.log('Search Criteria:', { selectedExamGroup, selectedExamType });
    console.log('Exam Schedules List:', examSchedulesList);
    const filtered = examSchedulesList.filter((schedule) => {
      const groupMatch = !selectedExamGroup || (schedule.examGroup && schedule.examGroup._id.toString() === selectedExamGroup);
      const typeMatch = !selectedExamType || schedule.examType.toLowerCase() === selectedExamType.toLowerCase();
      console.log(`Schedule: ${schedule.name}, Group Match: ${groupMatch}, Type Match: ${typeMatch}`);
      return groupMatch && typeMatch;
    });
    console.log('Filtered Schedules (Criteria):', filtered);
    setFilteredSchedules([...filtered]);
    setCurrentPage(0); // Reset to first page on search
    if (filtered.length === 0) {
      setSnack({ open: true, message: 'No schedules found for the selected criteria', severity: 'info' });
    }
  };

  const handleAddExam = () => {
    setOpenAddDialog(true);
    setTimeout(() => subjectRef.current?.focus(), 0); // Focus Subject field when dialog opens
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    setFormData({
      name: '',
      date: '',
      time: '',
      duration: '',
      room: '',
      maxMarks: '',
      minMarks: '',
      examGroup: '',
      examType: '',
    });
    setIsExamGroupSelectOpen(false);
    setIsExamTypeSelectOpen(false);
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSubmit = () => {
    if (!adminID) {
      setSnack({ open: true, message: 'Please log in to add exam schedules', severity: 'error' });
      return;
    }
    if (
      !formData.name ||
      !formData.date ||
      !formData.time ||
      !formData.duration ||
      !formData.room ||
      !formData.maxMarks ||
      !formData.minMarks ||
      !formData.examGroup ||
      !formData.examType
    ) {
      setSnack({ open: true, message: 'All fields are required', severity: 'warning' });
      return;
    }
    dispatch(createExamSchedule(formData, adminID))
      .then(() => {
        setSnack({ open: true, message: 'Exam schedule added successfully', severity: 'success' });
        handleCloseAddDialog();
        setCurrentPage(0); // Reset to first page after adding
      })
      .catch((err) => {
        setSnack({ open: true, message: err.message || 'Failed to add exam schedule', severity: 'error' });
      });
  };

  const handleKeyDown = (e, nextRef) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission or new line in TextField
      if (nextRef && nextRef.current) {
        if (nextRef === examGroupRef) {
          setIsExamGroupSelectOpen(true);
          examGroupRef.current.focus();
        } else if (nextRef === examTypeRef) {
          setIsExamTypeSelectOpen(true);
          examTypeRef.current.focus();
        } else {
          nextRef.current.focus();
        }
      } else {
        handleAddSubmit();
      }
    }
  };

  // Fix: Define displayedSchedules before pageCount to avoid TDZ error
  const offset = currentPage * itemsPerPage;
  const displayedSchedules = (filteredSchedules.length > 0 ? filteredSchedules : examSchedulesList) || [];
  const currentPageData = displayedSchedules.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(displayedSchedules.length / itemsPerPage);

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(0);
  };

  return (
    <Container>
      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack({ ...snack, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnack({ ...snack, open: false })} severity={snack.severity} sx={{ width: '100%' }}>
          {snack.message}
        </Alert>
      </Snackbar>
      <Heading variant="h4">Exam Schedule Management</Heading>
      <Grid container spacing={3}>
        {/* Select Criteria Section */}
        <Grid item xs={12}>
          <CriteriaCard>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <SubHeading variant="h6">Select Criteria</SubHeading>
                <AddButton
                  variant="contained"
                  onClick={handleAddExam}
                  startIcon={<AddIcon />}
                  aria-label="Add Exam Schedule"
                >
                  Add Exam
                </AddButton>
              </Box>
              <CriteriaContainer>
                <FormControl sx={{ minWidth: 200 }} size="small">
                  <InputLabel id="exam-group-label">Exam Group</InputLabel>
                  <Select
                    value={selectedExamGroup}
                    onChange={(e) => setSelectedExamGroup(e.target.value)}
                    label="Exam Group"
                    labelId="exam-group-label"
                    aria-label="Select Exam Group"
                  >
                    <MenuItem value="">Select Exam Group</MenuItem>
                    {examGroupsList.map((group) => (
                      <MenuItem key={group._id} value={group._id}>
                        {group.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl sx={{ minWidth: 200 }} size="small">
                  <InputLabel id="exam-type-label">Exam Type</InputLabel>
                  <Select
                    value={selectedExamType}
                    onChange={(e) => setSelectedExamType(e.target.value)}
                    label="Exam Type"
                    labelId="exam-type-label"
                    aria-label="Select Exam Type"
                  >
                    <MenuItem value="">Select Exam Type</MenuItem>
                    {examTypes.map((type, index) => (
                      <MenuItem key={index} value={type}>{type}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </CriteriaContainer>
              <SearchButton
                variant="contained"
                onClick={handleCriteriaSearch}
                aria-label="Search by Criteria"
              >
                Search Criteria
              </SearchButton>
            </CardContent>
          </CriteriaCard>
        </Grid>

        {/* Subject Search and Table Section */}
        <Grid item xs={12}>
          <TableCard>
            <CardContent>
              <SubHeading variant="h6">Exam Schedules</SubHeading>
              <SearchContainer>
                <TextField
                  fullWidth
                  label="Search subjects"
                  value={subjectSearchTerm}
                  onChange={(e) => setSubjectSearchTerm(e.target.value)}
                  variant="outlined"
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                    'aria-label': 'Search subjects',
                  }}
                />
                <SearchButton
                  variant="contained"
                  onClick={handleSubjectSearch}
                  aria-label="Search Subjects"
                >
                  Search Subjects
                </SearchButton>
              </SearchContainer>
              <StyledTableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#1a2526' }}>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.75rem', md: '0.875rem' }, p: { xs: 1, md: 2 } }}>
                        Subject
                      </TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.75rem', md: '0.875rem' }, p: { xs: 1, md: 2 } }}>
                        Date
                      </TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.75rem', md: '0.875rem' }, p: { xs: 1, md: 2 } }}>
                        Start Time
                      </TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.75rem', md: '0.875rem' }, p: { xs: 1, md: 2 } }}>
                        Duration
                      </TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.75rem', md: '0.875rem' }, p: { xs: 1, md: 2 } }}>
                        Room No.
                      </TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.75rem', md: '0.875rem' }, p: { xs: 1, md: 2 } }}>
                        Marks (Max.)
                      </TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.75rem', md: '0.875rem' }, p: { xs: 1, md: 2 } }}>
                        Marks (Min.)
                      </TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.75rem', md: '0.875rem' }, p: { xs: 1, md: 2 } }}>
                        Exam Group
                      </TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.75rem', md: '0.875rem' }, p: { xs: 1, md: 2 } }}>
                        Exam Type
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={9} sx={{ textAlign: 'center', color: '#1a2526' }}>
                          Loading...
                        </TableCell>
                      </TableRow>
                    ) : currentPageData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} sx={{ textAlign: 'center', p: 4, color: '#666' }}>
                          No exam schedules found
                        </TableCell>
                      </TableRow>
                    ) : (
                      currentPageData.map((schedule, idx) => (
                        <StyledTableRow key={schedule._id}>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                            {schedule.name}
                          </TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                            {schedule.date}
                          </TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                            {schedule.time}
                          </TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                            {schedule.duration}h
                          </TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                            {schedule.room}
                          </TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                            {schedule.maxMarks}
                          </TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                            {schedule.minMarks}
                          </TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                            {schedule.examGroup ? schedule.examGroup.name : 'N/A'}
                          </TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                            {schedule.examType}
                          </TableCell>
                        </StyledTableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </StyledTableContainer>
              <PaginationContainer>
                <Typography sx={{ mt: 2, color: '#1a2526', textAlign: 'center' }}>
                  Showing {currentPageData.length} of {displayedSchedules.length} records
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ color: '#1a2526' }}>Items per page</Typography>
                  <FormControl variant="outlined" size="small" sx={{ minWidth: 80 }}>
                    <InputLabel id="items-per-page-label">Items</InputLabel>
                    <Select
                      value={itemsPerPage}
                      onChange={handleItemsPerPageChange}
                      label="Items"
                      labelId="items-per-page-label"
                      aria-label="Items per page"
                    >
                      {[5, 10, 20, 30].map((num) => (
                        <MenuItem key={num} value={num}>
                          {num}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                <ReactPaginate
                  previousLabel={'←'}
                  nextLabel={'→'}
                  pageCount={pageCount}
                  onPageChange={({ selected }) => {
                    setCurrentPage(selected);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  containerClassName={'pagination'}
                  activeClassName={'active'}
                  pageClassName={'page'}
                  pageLinkClassName={'page-link'}
                  previousClassName={'page'}
                  nextClassName={'page'}
                  breakLabel={'...'}
                />
              </PaginationContainer>
            </CardContent>
          </TableCard>
        </Grid>
      </Grid>

      {/* Add Exam Dialog */}
      <Dialog open={openAddDialog} onClose={handleCloseAddDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Exam Schedule</DialogTitle>
        <DialogContent>
          <FormContainer>
            <TextField
              fullWidth
              label="Subject"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              onKeyDown={(e) => handleKeyDown(e, dateRef)}
              variant="outlined"
              size="small"
              required
              inputProps={{ 'aria-label': 'Subject' }}
              inputRef={subjectRef}
            />
            <TextField
              fullWidth
              label="Date (MM/DD/YYYY)"
              name="date"
              value={formData.date}
              onChange={handleFormChange}
              onKeyDown={(e) => handleKeyDown(e, timeRef)}
              variant="outlined"
              size="small"
              required
              inputProps={{ 'aria-label': 'Date' }}
              inputRef={dateRef}
            />
            <TextField
              fullWidth
              label="Start Time (HH:MM:SS)"
              name="time"
              value={formData.time}
              onChange={handleFormChange}
              onKeyDown={(e) => handleKeyDown(e, durationRef)}
              variant="outlined"
              size="small"
              required
              inputProps={{ 'aria-label': 'Start Time' }}
              inputRef={timeRef}
            />
            <TextField
              fullWidth
              label="Duration (hours)"
              name="duration"
              value={formData.duration}
              onChange={handleFormChange}
              onKeyDown={(e) => handleKeyDown(e, roomRef)}
              variant="outlined"
              size="small"
              type="number"
              required
              inputProps={{ 'aria-label': 'Duration' }}
              inputRef={durationRef}
            />
            <TextField
              fullWidth
              label="Room No."
              name="room"
              value={formData.room}
              onChange={handleFormChange}
              onKeyDown={(e) => handleKeyDown(e, maxMarksRef)}
              variant="outlined"
              size="small"
              type="number"
              required
              inputProps={{ 'aria-label': 'Room Number' }}
              inputRef={roomRef}
            />
            <TextField
              fullWidth
              label="Marks (Max)"
              name="maxMarks"
              value={formData.maxMarks}
              onChange={handleFormChange}
              onKeyDown={(e) => handleKeyDown(e, minMarksRef)}
              variant="outlined"
              size="small"
              type="number"
              required
              inputProps={{ 'aria-label': 'Maximum Marks' }}
              inputRef={maxMarksRef}
            />
            <TextField
              fullWidth
              label="Marks (Min)"
              name="minMarks"
              value={formData.minMarks}
              onChange={handleFormChange}
              onKeyDown={(e) => handleKeyDown(e, examGroupRef)}
              variant="outlined"
              size="small"
              type="number"
              required
              inputProps={{ 'aria-label': 'Minimum Marks' }}
              inputRef={minMarksRef}
            />
            <FormControl fullWidth size="small">
              <InputLabel id="form-exam-group-label">Exam Group</InputLabel>
              <Select
                name="examGroup"
                value={formData.examGroup}
                onChange={handleFormChange}
                onKeyDown={(e) => handleKeyDown(e, examTypeRef)}
                open={isExamGroupSelectOpen}
                onOpen={() => setIsExamGroupSelectOpen(true)}
                onClose={() => setIsExamGroupSelectOpen(false)}
                label="Exam Group"
                labelId="form-exam-group-label"
                required
                aria-label="Exam Group"
                inputRef={examGroupRef}
              >
                <MenuItem value="">Select Exam Group</MenuItem>
                {examGroupsList.map((group) => (
                  <MenuItem key={group._id} value={group._id}>
                    {group.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth size="small">
              <InputLabel id="form-exam-type-label">Exam Type</InputLabel>
              <Select
                name="examType"
                value={formData.examType}
                onChange={handleFormChange}
                onKeyDown={(e) => handleKeyDown(e, saveButtonRef)}
                open={isExamTypeSelectOpen}
                onOpen={() => setIsExamTypeSelectOpen(true)}
                onClose={() => setIsExamTypeSelectOpen(false)}
                label="Exam Type"
                labelId="form-exam-type-label"
                required
                aria-label="Exam Type"
                inputRef={examTypeRef}
              >
                <MenuItem value="">Select Exam Type</MenuItem>
                {examTypes.map((type, index) => (
                  <MenuItem key={index} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </FormContainer>
        </DialogContent>
        <DialogActions>
          <CancelButton onClick={handleCloseAddDialog} aria-label="Cancel">
            Cancel
          </CancelButton>
          <AddButton onClick={handleAddSubmit} aria-label="Save Exam Schedule" ref={saveButtonRef}>
            Save
          </AddButton>
        </DialogActions>
      </Dialog>
      <style jsx global>{`
        .pagination {
          display: flex;
          justify-content: center;
          list-style: none;
          padding: 0;
          margin: 20px 0;
          flex-wrap: wrap;
        }
        .page {
          margin: 0 3px;
        }
        .page-link {
          padding: 6px 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          cursor: pointer;
          background-color: #f9f9f9;
          color: #1a2526;
          transition: all 0.2s ease;
          text-decoration: none;
          font-size: 14px;
          min-width: 44px;
          min-height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .page-link:hover {
          background-color: #e0e0e0;
        }
        .active .page-link {
          background: #4caf50;
          color: white;
          border-color: #4caf50;
          font-weight: bold;
        }
        @media (max-width: 600px) {
          .pagination {
            flex-direction: column;
            align-items: center;
            gap: 5px;
          }
          .page-link {
            padding: 5px 8px;
            font-size: 12px;
          }
        }
        @media (max-width: 900px) {
          .pagination {
            flex-direction: column;
            align-items: center;
            gap: 5px;
          }
          .page-link {
            padding: 5px 8px;
            font-size: 12px;
          }
        }
      `}</style>
    </Container>
  );
};

export default ExamSchedule;