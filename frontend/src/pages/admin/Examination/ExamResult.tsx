import React, { useState, useEffect, useRef } from 'react';
import  { useDispatch, useSelector } from 'react-redux';
import Select, { StylesConfig } from 'react-select';
import {
  getAllExamResults,
  createExamResult,
  updateExamResult,
  deleteExamResult,
  clearExamResultError,
} from '../../../redux/examRelated/examResultAction';
import { getAllFclasses } from '../../../redux/fclass/fclassHandle';
import { getAllSections } from '../../../redux/sectionRelated/sectionHandle';
import { fetchAdmissionForms } from '../../../redux/StudentAddmissionDetail/studentAddmissionHandle';
import {
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Snackbar,
  Alert,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  CircularProgress,
  FormControl,
  InputLabel,
  Select as MUISelect,
  MenuItem,
} from '@mui/material';
import { Search as SearchIcon, Edit as EditIcon, Delete as DeleteIcon, Print as PrintIcon, Download as DownloadIcon } from '@mui/icons-material';
import { CSVLink } from 'react-csv';
import { FaPlus, FaMinus } from 'react-icons/fa';
import styled from 'styled-components';
import ReactPaginate from 'react-paginate';

// TypeScript interfaces
interface Subject {
  subjectName: string;
  marksObtained: string | number;
  subjectCode: string;
  grade?: string;
  attendance?: string;
}

interface ExamResult {
  _id?: string;
  admissionNo: string;
  rollNo: string;
  studentName: string;
  examGroup: string;
  examType: string;
  session: string;
  classId: { _id: string; name: string; sections: string[] };
  section: string;
  subjects: Subject[];
  grandTotal?: number;
  percent?: number;
  rank?: number;
  result?: string;
  gpa?: number;
  overallGrade?: string;
}

interface Fclass {
  _id: string;
  name: string;
  sections: string[];
}

interface AdmissionForm {
  admissionNo: string;
  rollNo: string;
  firstName: string;
  lastName: string;
  classId: { _id: string; name: string };
  section: string;
}

interface RootState {
  examResult: {
    examResultsList: ExamResult[];
    loading: boolean;
    error: string | null;
  };
  fclass: {
    fclassesList: Fclass[];
    loading: boolean;
    error: string | null;
  };
  sections: {
    sectionsList: string[];
    loading: boolean;
    error: string | null;
  };
  admissionForms: {
    admissionForms: AdmissionForm[];
    loading: boolean;
    error: string | null;
  };
  user: {
    currentUser: { _id: string } | null;
  };
}

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

// Custom styles for react-select
const selectStyles: StylesConfig = {
  control: (provided) => ({
    ...provided,
    minHeight: '40px',
    fontSize: '14px',
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: 9999,
    maxHeight: '200px',
    overflowY: 'auto',
    width: '100%',
    maxWidth: '100%',
  }),
  menuPortal: (provided) => ({
    ...provided,
    zIndex: 9999,
  }),
  option: (provided) => ({
    ...provided,
    fontSize: '14px',
  }),
  singleValue: (provided) => ({
    ...provided,
    fontSize: '14px',
  }),
};

// Function to convert marks to Grade Point and Letter Grade
const getGrade = (marks: number): { gpa: number; grade: string } => {
  if (marks > 100 || marks < 0) return { gpa: 0.0, grade: 'N/A' };
  if (marks >= 97) return { gpa: 4.0, grade: 'A+' };
  if (marks >= 93) return { gpa: 4.0, grade: 'A' };
  if (marks >= 90) return { gpa: 3.7, grade: 'A-' };
  if (marks >= 87) return { gpa: 3.3, grade: 'B+' };
  if (marks >= 83) return { gpa: 3.0, grade: 'B' };
  if (marks >= 80) return { gpa: 2.7, grade: 'B-' };
  if (marks >= 77) return { gpa: 2.3, grade: 'C+' };
  if (marks >= 73) return { gpa: 2.0, grade: 'C' };
  if (marks >= 70) return { gpa: 1.7, grade: 'C-' };
  if (marks >= 67) return { gpa: 1.3, grade: 'D+' };
  if (marks >= 65) return { gpa: 1.0, grade: 'D' };
  return { gpa: 0.0, grade: 'F' };
};

// Function to calculate GPA, grand total, and overall grade
const calculateGPAandGrade = (subjects: Subject[], creditHoursPerSubject: number = 1): { gpa: number; overallGrade: string; grandTotal: number; percent: number } => {
  const totalMarks = subjects.reduce((sum, subject) => {
    const marks = subject.attendance === 'Absent' ? 0 : Number(subject.marksObtained);
    return sum + (isNaN(marks) || marks < 0 || marks > 100 ? 0 : marks);
  }, 0);
  const maxMarks = subjects.length * 100;
  const grandTotal = totalMarks;
  const percent = maxMarks > 0 ? Number(((totalMarks / maxMarks) * 100).toFixed(2)) : 0.0;

  const totalPoints = subjects.reduce((sum, subject) => {
    const marks = subject.attendance === 'Absent' ? 0 : Number(subject.marksObtained);
    const { gpa } = isNaN(marks) || marks < 0 || marks > 100 ? { gpa: 0, grade: 'N/A' } : getGrade(marks);
    return sum + (gpa * creditHoursPerSubject);
  }, 0);
  const totalCreditHours = subjects.length * creditHoursPerSubject;
  const gpa = totalCreditHours > 0 ? Number((totalPoints / totalCreditHours).toFixed(2)) : 0.0;

  const averagePercent = percent;
  const { grade: overallGrade } = getGrade(averagePercent);

  return { gpa, overallGrade, grandTotal, percent };
};

const ExamResult = () => {
  const dispatch = useDispatch();
  const { examResult, fclass, sections, admissionForms, user } = useSelector((state: RootState) => state);
  const { examResultsList, loading: examLoading, error: examError } = examResult;
  const { fclassesList, loading: classLoading, error: classError } = fclass;
  const { sectionsList, loading: sectionLoading, error: sectionError } = sections;
  const { admissionForms: admissionFormsList, loading: admissionLoading, error: admissionError } = admissionForms;
  const adminID = user.currentUser?._id;

  // State for dropdown selections, form, and pagination
  const [selectedExamGroup, setSelectedExamGroup] = useState('');
  const [selectedExamType, setSelectedExamType] = useState('');
  const [selectedSession, setSelectedSession] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [sortColumn, setSortColumn] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isExamGroupSelectOpen, setIsExamGroupSelectOpen] = useState(false);
  const [isExamTypeSelectOpen, setIsExamTypeSelectOpen] = useState(false);
  const [isSessionSelectOpen, setIsSessionSelectOpen] = useState(false);
  const [isClassSelectOpen, setIsClassSelectOpen] = useState(false);
  const [isSectionSelectOpen, setIsSectionSelectOpen] = useState(false);
  const [isAdmissionSelectOpen, setIsAdmissionSelectOpen] = useState(false);
  const [formData, setFormData] = useState({
    admissionNo: '',
    rollNo: '',
    studentName: '',
    examGroup: '',
    examType: '',
    session: '',
    classId: '',
    section: '',
    subjects: [{ subjectName: '', marksObtained: '', subjectCode: '', grade: '', attendance: 'Present' }],
  });
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'warning' | 'info' });
  const [filteredExamResults, setFilteredExamResults] = useState<ExamResult[]>([]);
  const [subjectAttendanceOpen, setSubjectAttendanceOpen] = useState<boolean[]>([]);

  // Refs for form fields and buttons
  const classRef = useRef(null);
  const sectionRef = useRef(null);
  const admissionRef = useRef(null);
  const examGroupRef = useRef(null);
  const examTypeRef = useRef(null);
  const sessionRef = useRef(null);
  const subjectRefs = useRef<(HTMLInputElement | null)[][]>([]);
  const saveButtonRef = useRef(null);

  // Initialize refs for subjects
  useEffect(() => {
    subjectRefs.current = formData.subjects.map(() => [null, null, null, null]);
    setSubjectAttendanceOpen(formData.subjects.map(() => false));
  }, [formData.subjects.length]);

  // Dropdown options
  const examGroups = ["Class 4 (Pass / Fail)", "Class 5 (Pass / Fail)"];
  const examTypes = ["FINAL EXAM (March-2025)", "Mid-Term (Sept-2024)"];
  const sessions = ["2018-19", "2019-20"];
  const classOptions = fclassesList.map((cls) => ({ value: cls._id, label: cls.name }));
  const sectionOptions = fclassesList
    .find((cls) => cls._id === selectedClass)
    ?.sections.map((sec) => ({ value: sec, label: sec })) || [];
  const formSectionOptions = fclassesList
    .find((cls) => cls._id === formData.classId)
    ?.sections.map((sec) => ({ value: sec, label: sec })) || [];
  const admissionOptions = admissionFormsList
    .filter((form) => (!formData.classId || form.classId._id === formData.classId) && (!formData.section || form.section === formData.section))
    .map((form) => ({
      value: form.admissionNo,
      label: `${form.admissionNo} - ${form.firstName} ${form.lastName}`,
      data: form,
    }));
  const attendanceOptions = [
    { value: 'Present', label: 'Present' },
    { value: 'Absent', label: 'Absent' },
  ];

  // Fetch data on mount
  useEffect(() => {
    if (adminID) {
      dispatch(getAllExamResults(adminID));
      dispatch(getAllFclasses(adminID));
      dispatch(getAllSections(adminID));
      dispatch(fetchAdmissionForms(adminID));
    } else {
      setSnack({ open: true, message: 'Please log in to view exam results', severity: 'error' });
    }
  }, [dispatch, adminID]);

  // Handle errors from Redux
  useEffect(() => {
    if (examError || classError || sectionError || admissionError) {
      setSnack({
        open: true,
        message: examError || classError || sectionError || admissionError || 'An error occurred',
        severity: 'error',
      });
      dispatch(clearExamResultError());
    }
  }, [examError, classError, sectionError, admissionError, dispatch]);

  // Debug class and section options
  useEffect(() => {
    console.log('fclassesList:', fclassesList);
    console.log('classOptions:', classOptions);
    console.log('formSectionOptions:', formSectionOptions);
    console.log('admissionOptions:', admissionOptions);
    console.log('examResultsList:', examResultsList);
  }, [fclassesList, classOptions, formSectionOptions, admissionOptions, examResultsList]);

  const handleSearch = () => {
    setCurrentPage(0); // Reset to first page on search
  };

  const handleSort = (column: string) => {
    const newSortOrder = sortColumn === column && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortColumn(column);
    setSortOrder(newSortOrder);

    const sortedData = [...filteredExamResults].sort((a, b) => {
      let valueA = a[column as keyof ExamResult];
      let valueB = b[column as keyof ExamResult];

      if (['grandTotal', 'percent', 'rank', 'gpa'].includes(column)) {
        valueA = Number(valueA) || 0;
        valueB = Number(valueB) || 0;
      }

      if (valueA < valueB) return newSortOrder === 'asc' ? -1 : 1;
      if (valueA > valueB) return newSortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredExamResults(sortedData);
  };

  const handleAdd = () => {
    setFormData({
      admissionNo: '',
      rollNo: '',
      studentName: '',
      examGroup: '',
      examType: '',
      session: '',
      classId: '',
      section: '',
      subjects: [{ subjectName: '', marksObtained: '', subjectCode: '', grade: '', attendance: 'Present' }],
    });
    setEditId(null);
    setIsPopupOpen(true);
    setTimeout(() => classRef.current?.focus(), 0); // Focus first field
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setEditId(null);
    setFormData({
      admissionNo: '',
      rollNo: '',
      studentName: '',
      examGroup: '',
      examType: '',
      session: '',
      classId: '',
      section: '',
      subjects: [{ subjectName: '', marksObtained: '', subjectCode: '', grade: '', attendance: 'Present' }],
    });
    setIsExamGroupSelectOpen(false);
    setIsExamTypeSelectOpen(false);
    setIsSessionSelectOpen(false);
    setIsClassSelectOpen(false);
    setIsSectionSelectOpen(false);
    setIsAdmissionSelectOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number | null = null, field: string | null = null) => {
    if (index !== null && field) {
      const newSubjects = [...formData.subjects];
      const marks = field === 'marksObtained' ? Number(e.target.value) : Number(newSubjects[index].marksObtained);
      const attendance = newSubjects[index].attendance;
      const effectiveMarks = attendance === 'Absent' ? 0 : marks;
      const { grade } = isNaN(effectiveMarks) || effectiveMarks < 0 || effectiveMarks > 100 ? { gpa: 0, grade: 'N/A' } : getGrade(effectiveMarks);
      newSubjects[index] = { ...newSubjects[index], [field]: e.target.value, grade: grade };
      setFormData({ ...formData, subjects: newSubjects });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSelectChange = (fieldName: string, newValue: any, index: number | null = null) => {
    if (index !== null && fieldName === 'attendance') {
      const newSubjects = [...formData.subjects];
      const marks = newSubjects[index].attendance === 'Absent' ? 0 : Number(newSubjects[index].marksObtained);
      const { grade } = isNaN(marks) || marks < 0 || marks > 100 ? { gpa: 0, grade: 'N/A' } : getGrade(marks);
      newSubjects[index] = { ...newSubjects[index], attendance: newValue ? newValue.value : 'Present', grade: grade };
      setFormData({ ...formData, subjects: newSubjects });
    } else if (fieldName === 'admissionNo' && newValue) {
      const admission = admissionOptions.find((opt) => opt.value === newValue.value)?.data;
      if (admission) {
        setFormData({
          ...formData,
          admissionNo: admission.admissionNo,
          rollNo: admission.rollNo,
          studentName: `${admission.firstName} ${admission.lastName}`,
          classId: admission.classId._id,
          section: admission.section,
        });
      }
    } else if (fieldName === 'classId') {
      setFormData({
        ...formData,
        classId: newValue ? newValue.value : '',
        section: '',
        admissionNo: '',
        rollNo: '',
        studentName: '',
      });
    } else if (fieldName === 'section') {
      setFormData({
        ...formData,
        section: newValue ? newValue.value : '',
        admissionNo: '',
        rollNo: '',
        studentName: '',
      });
    } else {
      setFormData({ ...formData, [fieldName]: newValue ? newValue.value : '' });
    }
  };

  const addSubject = () => {
    setFormData({
      ...formData,
      subjects: [...formData.subjects, { subjectName: '', marksObtained: '', subjectCode: '', grade: '', attendance: 'Present' }],
    });
  };

  const removeSubject = (index: number) => {
    setFormData({
      ...formData,
      subjects: formData.subjects.filter((_, i) => i !== index),
    });
  };

  const handleSave = () => {
    if (!adminID) {
      setSnack({ open: true, message: 'Please log in to add exam results', severity: 'error' });
      return;
    }
    if (
      !formData.admissionNo ||
      !formData.rollNo ||
      !formData.studentName ||
      !formData.examGroup ||
      !formData.examType ||
      !formData.session ||
      !formData.classId ||
      !formData.section ||
      !formData.subjects.every((sub) => sub.subjectName && sub.marksObtained && sub.subjectCode && sub.attendance)
    ) {
      setSnack({ open: true, message: 'All fields are required', severity: 'warning' });
      return;
    }

    const { gpa, overallGrade, grandTotal, percent } = calculateGPAandGrade(formData.subjects);

    const action = editId
      ? updateExamResult({ id: editId, examResult: { ...formData, grandTotal, percent, gpa, overallGrade }, adminID })
      : createExamResult({ ...formData, grandTotal, percent, gpa, overallGrade }, adminID);

    dispatch(action)
      .then(() => {
        setSnack({ open: true, message: editId ? 'Exam result updated successfully' : 'Exam result added successfully', severity: 'success' });
        handleClosePopup();
        setCurrentPage(0); // Reset to first page after adding/updating
      })
      .catch((err) => {
        setSnack({ open: true, message: err.message || 'Failed to save exam result', severity: 'error' });
      });
  };

  const handleEdit = (result: ExamResult) => {
    const subjectsWithGrades = result.subjects.map((sub) => {
      const marks = sub.attendance === 'Absent' ? 0 : Number(sub.marksObtained);
      const { grade } = isNaN(marks) || marks < 0 || marks > 100 ? { gpa: 0, grade: 'N/A' } : getGrade(marks);
      return { ...sub, grade };
    });
    const { gpa, overallGrade, grandTotal, percent } = calculateGPAandGrade(subjectsWithGrades);
    setFormData({
      admissionNo: result.admissionNo,
      rollNo: result.rollNo,
      studentName: result.studentName,
      examGroup: result.examGroup,
      examType: result.examType,
      session: result.session,
      classId: result.classId._id,
      section: result.section,
      subjects: subjectsWithGrades,
    });
    setEditId(result._id || null);
    setIsPopupOpen(true);
    setTimeout(() => classRef.current?.focus(), 0); // Focus first field
  };

  const handleDelete = (id: string) => {
    if (!adminID) {
      setSnack({ open: true, message: 'Please log in to delete exam results', severity: 'error' });
      return;
    }
    if (window.confirm('Are you sure you want to delete this exam result?')) {
      dispatch(deleteExamResult(id, adminID))
        .then(() => {
          setSnack({ open: true, message: 'Exam result deleted successfully', severity: 'info' });
          setCurrentPage(0); // Reset to first page after deletion
        })
        .catch((err) => {
          setSnack({ open: true, message: err.message || 'Failed to delete exam result', severity: 'error' });
        });
    }
  };

  const handleExport = () => {
    setSnack({ open: true, message: 'Exporting exam results as CSV', severity: 'info' });
  };

  const handlePrint = () => {
    window.print();
    setSnack({ open: true, message: 'Printing exam results', severity: 'info' });
  };

  const updateSubjectAttendanceOpen = (index: number, open: boolean) => {
    const newOpenStates = [...subjectAttendanceOpen];
    newOpenStates[index] = open;
    setSubjectAttendanceOpen(newOpenStates);
  };

  const handleKeyDown = (e: React.KeyboardEvent, nextRef: React.RefObject<any> | null, index: number | null = null, field: string | null = null) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (index !== null && field) {
        // Handle subject fields
        if (field === 'subjectName' && subjectRefs.current[index][1]) {
          subjectRefs.current[index][1].focus();
        } else if (field === 'marksObtained' && subjectRefs.current[index][2]) {
          subjectRefs.current[index][2].focus();
        } else if (field === 'subjectCode' && subjectRefs.current[index][3]) {
          setTimeout(() => {
            subjectRefs.current[index][3].focus();
            updateSubjectAttendanceOpen(index, true);
          }, 0);
        } else if (field === 'attendance') {
          // Move to next subject or save
          if (index < formData.subjects.length - 1 && subjectRefs.current[index + 1][0]) {
            subjectRefs.current[index + 1][0].focus();
          } else {
            saveButtonRef.current?.focus();
          }
        }
      } else if (nextRef && nextRef.current) {
        // Handle top-level fields
        if (nextRef === examGroupRef) {
          setIsExamGroupSelectOpen(true);
          setTimeout(() => examGroupRef.current?.focus(), 0);
        } else if (nextRef === examTypeRef) {
          setIsExamTypeSelectOpen(true);
          setTimeout(() => examTypeRef.current?.focus(), 0);
        } else if (nextRef === sessionRef) {
          setIsSessionSelectOpen(true);
          setTimeout(() => sessionRef.current?.focus(), 0);
        } else if (nextRef === classRef) {
          setIsClassSelectOpen(true);
          setTimeout(() => classRef.current?.focus(), 0);
        } else if (nextRef === sectionRef) {
          setIsSectionSelectOpen(true);
          setTimeout(() => sectionRef.current?.focus(), 0);
        } else if (nextRef === admissionRef) {
          setIsAdmissionSelectOpen(true);
          setTimeout(() => admissionRef.current?.focus(), 0);
        } else {
          nextRef.current.focus();
        }
      } else {
        handleSave();
      }
    }
  };

  useEffect(() => {
    const updatedResults = examResultsList.map((result) => {
      const subjectsWithGrades = result.subjects.map((sub) => {
        const marks = sub.attendance === 'Absent' ? 0 : Number(sub.marksObtained);
        const { grade } = isNaN(marks) || marks < 0 || marks > 100 ? { gpa: 0, grade: 'N/A' } : getGrade(marks);
        return { ...sub, grade };
      });
      const { gpa, overallGrade, grandTotal, percent } = calculateGPAandGrade(subjectsWithGrades);
      return { ...result, subjects: subjectsWithGrades, grandTotal, percent, gpa, overallGrade };
    }).filter((result) => {
      const groupMatch = !selectedExamGroup || result.examGroup === selectedExamGroup;
      const typeMatch = !selectedExamType || result.examType === selectedExamType;
      const sessionMatch = !selectedSession || result.session === selectedSession;
      const classMatch = !selectedClass || result.classId._id === selectedClass;
      const sectionMatch = !selectedSection || result.section === selectedSection;
      const searchMatch =
        result.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.admissionNo.toLowerCase().includes(searchTerm.toLowerCase());
      return groupMatch && typeMatch && sessionMatch && classMatch && sectionMatch && searchMatch;
    });
    setFilteredExamResults(updatedResults);
    setCurrentPage(0); // Reset to first page when filters change
  }, [examResultsList, selectedExamGroup, selectedExamType, selectedSession, selectedClass, selectedSection, searchTerm]);

  // Pagination logic
  const offset = currentPage * itemsPerPage;
  const displayedResults = filteredExamResults || [];
  const currentPageData = displayedResults.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(displayedResults.length / itemsPerPage);

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(0);
  };

  const csvData = filteredExamResults.map((result) => ({
    AdmissionNo: result.admissionNo,
    RollNumber: result.rollNo,
    StudentName: result.studentName,
    ...result.subjects.reduce(
      (acc, sub) => ({
        ...acc,
        [`${sub.subjectName} (Marks)`]: `${sub.attendance === 'Absent' ? 0 : sub.marksObtained || 0}/100`,
        [`${sub.subjectName} (Grade)`]: sub.grade || 'N/A',
        [`${sub.subjectName} (Attendance)`]: sub.attendance || 'Present',
      }),
      {}
    ),
    GrandTotal: `${result.grandTotal || 0}/${result.subjects.length * 100 || 0}`,
    Percent: (result.percent || 0).toFixed(2),
    GPA: (result.gpa || 0).toFixed(2),
    OverallGrade: result.overallGrade || 'N/A',
    Rank: result.rank || 0,
    Result: result.result || 'N/A',
  }));

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
      <Heading variant="h4">Exam Result Management</Heading>
      <Grid container spacing={3}>
        {/* Select Criteria Section */}
        <Grid item xs={12}>
          <CriteriaCard>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <SubHeading variant="h6">Select Criteria</SubHeading>
                <AddButton
                  variant="contained"
                  onClick={handleAdd}
                  startIcon={<FaPlus />}
                  aria-label="Add Exam Result"
                >
                  Add Result
                </AddButton>
              </Box>
              <CriteriaContainer>
                <FormControl sx={{ minWidth: 200 }} size="small">
                  <InputLabel id="exam-group-label">Exam Group</InputLabel>
                  <MUISelect
                    value={selectedExamGroup}
                    onChange={(e) => setSelectedExamGroup(e.target.value)}
                    label="Exam Group"
                    labelId="exam-group-label"
                    aria-label="Select Exam Group"
                  >
                    <MenuItem value="">Select Exam Group</MenuItem>
                    {examGroups.map((group) => (
                      <MenuItem key={group} value={group}>{group}</MenuItem>
                    ))}
                  </MUISelect>
                </FormControl>
                <FormControl sx={{ minWidth: 200 }} size="small">
                  <InputLabel id="exam-type-label">Exam Type</InputLabel>
                  <MUISelect
                    value={selectedExamType}
                    onChange={(e) => setSelectedExamType(e.target.value)}
                    label="Exam Type"
                    labelId="exam-type-label"
                    aria-label="Select Exam Type"
                  >
                    <MenuItem value="">Select Exam Type</MenuItem>
                    {examTypes.map((type) => (
                      <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                  </MUISelect>
                </FormControl>
                <FormControl sx={{ minWidth: 200 }} size="small">
                  <InputLabel id="session-label">Session</InputLabel>
                  <MUISelect
                    value={selectedSession}
                    onChange={(e) => setSelectedSession(e.target.value)}
                    label="Session"
                    labelId="session-label"
                    aria-label="Select Session"
                  >
                    <MenuItem value="">Select Session</MenuItem>
                    {sessions.map((session) => (
                      <MenuItem key={session} value={session}>{session}</MenuItem>
                    ))}
                  </MUISelect>
                </FormControl>
                <FormControl sx={{ minWidth: 200 }} size="small">
                  {classLoading ? (
                    <CircularProgress size={24} />
                  ) : fclassesList.length === 0 ? (
                    <Typography color="error">No classes available</Typography>
                  ) : (
                    <Select
                      options={classOptions}
                      value={classOptions.find((opt) => opt.value === selectedClass) || null}
                      onChange={(newValue) => {
                        setSelectedClass(newValue ? newValue.value : '');
                        setSelectedSection('');
                      }}
                      placeholder="Select Class"
                      isClearable
                      isSearchable
                      styles={selectStyles}
                      menuPortalTarget={document.body}
                    />
                  )}
                </FormControl>
                <FormControl sx={{ minWidth: 200 }} size="small">
                  <Select
                    options={sectionOptions}
                    value={sectionOptions.find((opt) => opt.value === selectedSection) || null}
                    onChange={(newValue) => setSelectedSection(newValue ? newValue.value : '')}
                    placeholder="Select Section"
                    isClearable
                    isSearchable
                    isDisabled={!selectedClass}
                    styles={selectStyles}
                    menuPortalTarget={document.body}
                  />
                </FormControl>
              </CriteriaContainer>
              <SearchButton
                variant="contained"
                onClick={handleSearch}
                aria-label="Search by Criteria"
              >
                Search Criteria
              </SearchButton>
            </CardContent>
          </CriteriaCard>
        </Grid>

        {/* Exam Result List Section */}
        <Grid item xs={12}>
          <TableCard>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                <SubHeading variant="h6">Exam Result List</SubHeading>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: { xs: 'center', sm: 'flex-end' } }}>
                  <CSVLink
                    data={csvData}
                    filename="exam-results.csv"
                    style={{ textDecoration: 'none' }}
                    onClick={handleExport}
                  >
                    <IconButton sx={{ color: '#666' }} title="Export">
                      <DownloadIcon />
                    </IconButton>
                  </CSVLink>
                  <IconButton sx={{ color: '#666' }} onClick={handlePrint} title="Print">
                    <PrintIcon />
                  </IconButton>
                </Box>
              </Box>
              <SearchContainer>
                <TextField
                  fullWidth
                  label="Search exam results"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  variant="outlined"
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                    'aria-label': 'Search exam results',
                  }}
                />
                <SearchButton
                  variant="contained"
                  onClick={handleSearch}
                  aria-label="Search Results"
                >
                  Search Results
                </SearchButton>
              </SearchContainer>
              <StyledTableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#1a2526' }}>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, minWidth: 120, fontSize: { xs: '0.75rem', md: '0.875rem' }, p: { xs: 1, md: 2 } }} onClick={() => handleSort('admissionNo')}>
                        Admission No {sortColumn === 'admissionNo' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, minWidth: 120, fontSize: { xs: '0.75rem', md: '0.875rem' }, p: { xs: 1, md: 2 } }} onClick={() => handleSort('rollNo')}>
                        Roll Number {sortColumn === 'rollNo' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, minWidth: 150, fontSize: { xs: '0.75rem', md: '0.875rem' }, p: { xs: 1, md: 2 } }} onClick={() => handleSort('studentName')}>
                        Student Name {sortColumn === 'studentName' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </TableCell>
                      {filteredExamResults[0]?.subjects.map((sub) => (
                        <React.Fragment key={sub.subjectName}>
                          <TableCell sx={{ color: '#fff', fontWeight: 600, minWidth: 120, fontSize: { xs: '0.75rem', md: '0.875rem' }, p: { xs: 1, md: 2 } }}>
                            {sub.subjectName} (Marks)
                          </TableCell>
                          <TableCell sx={{ color: '#fff', fontWeight: 600, minWidth: 100, fontSize: { xs: '0.75rem', md: '0.875rem' }, p: { xs: 1, md: 2 } }}>
                            {sub.subjectName} (Attendance)
                          </TableCell>
                          <TableCell sx={{ color: '#fff', fontWeight: 600, minWidth: 100, fontSize: { xs: '0.75rem', md: '0.875rem' }, p: { xs: 1, md: 2 } }}>
                            {sub.subjectName} (Grade)
                          </TableCell>
                        </React.Fragment>
                      ))}
                      <TableCell sx={{ color: '#fff', fontWeight: 600, minWidth: 120, fontSize: { xs: '0.75rem', md: '0.875rem' }, p: { xs: 1, md: 2 } }} onClick={() => handleSort('grandTotal')}>
                        Grand Total {sortColumn === 'grandTotal' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, minWidth: 100, fontSize: { xs: '0.75rem', md: '0.875rem' }, p: { xs: 1, md: 2 } }} onClick={() => handleSort('percent')}>
                        Percent (%) {sortColumn === 'percent' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, minWidth: 80, fontSize: { xs: '0.75rem', md: '0.875rem' }, p: { xs: 1, md: 2 } }} onClick={() => handleSort('gpa')}>
                        GPA {sortColumn === 'gpa' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, minWidth: 120, fontSize: { xs: '0.75rem', md: '0.875rem' }, p: { xs: 1, md: 2 } }}>
                        Overall Grade
                      </TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, minWidth: 80, fontSize: { xs: '0.75rem', md: '0.875rem' }, p: { xs: 1, md: 2 } }} onClick={() => handleSort('rank')}>
                        Rank {sortColumn === 'rank' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, minWidth: 100, fontSize: { xs: '0.75rem', md: '0.875rem' }, p: { xs: 1, md: 2 } }} onClick={() => handleSort('result')}>
                        Result {sortColumn === 'result' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, minWidth: 120, fontSize: { xs: '0.75rem', md: '0.875rem' }, p: { xs: 1, md: 2 } }}>
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {examLoading ? (
                      <TableRow>
                        <TableCell colSpan={13 + (filteredExamResults[0]?.subjects.length || 0) * 3} sx={{ textAlign: 'center', color: '#1a2526' }}>
                          Loading...
                        </TableCell>
                      </TableRow>
                    ) : currentPageData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={13 + (filteredExamResults[0]?.subjects.length || 0) * 3} sx={{ textAlign: 'center', p: 4, color: '#666' }}>
                          No exam results found
                        </TableCell>
                      </TableRow>
                    ) : (
                      currentPageData.map((result, idx) => (
                        <StyledTableRow key={result._id}>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>{result.admissionNo}</TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>{result.rollNo}</TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>{result.studentName}</TableCell>
                          {result.subjects.map((sub) => (
                            <React.Fragment key={sub.subjectName}>
                              <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>{`${sub.attendance === 'Absent' ? 0 : sub.marksObtained || 0}/100`}</TableCell>
                              <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>{sub.attendance || 'Present'}</TableCell>
                              <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>{sub.grade || 'N/A'}</TableCell>
                            </React.Fragment>
                          ))}
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>{`${result.grandTotal || 0}/${result.subjects.length * 100}`}</TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>{(result.percent || 0).toFixed(2)}%</TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>{(result.gpa || 0).toFixed(2)}</TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>{result.overallGrade || 'N/A'}</TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>{result.rank || 0}</TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>{result.result || 'N/A'}</TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 } }}>
                            <IconButton onClick={() => handleEdit(result)} sx={{ color: '#1976d2' }} title="Edit">
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton onClick={() => handleDelete(result._id || '')} sx={{ color: '#d32f2f' }} title="Delete">
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </StyledTableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </StyledTableContainer>
              <PaginationContainer>
                <Typography sx={{ mt: 2, color: '#1a2526', textAlign: 'center' }}>
                  Showing {currentPageData.length} of {displayedResults.length} records
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ color: '#1a2526' }}>Items per page</Typography>
                  <FormControl variant="outlined" size="small" sx={{ minWidth: 80 }}>
                    <InputLabel id="items-per-page-label">Items</InputLabel>
                    <MUISelect
                      value={itemsPerPage}
                      onChange={handleItemsPerPageChange}
                      label="Items"
                      labelId="items-per-page-label"
                      aria-label="Items per page"
                    >
                      {[5, 10, 20, 30].map((num) => (
                        <MenuItem key={num} value={num}>{num}</MenuItem>
                      ))}
                    </MUISelect>
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

      {/* Add/Edit Exam Result Dialog */}
      <Dialog open={isPopupOpen} onClose={handleClosePopup} maxWidth="md" fullWidth sx={{ '& .MuiDialog-paper': { width: { xs: '90%', sm: '80%', md: '70%' } } }}>
        <DialogTitle>{editId ? 'Edit Exam Result' : 'Add Exam Result'}</DialogTitle>
        <DialogContent>
          <FormContainer>
            <FormControl fullWidth size="small">
              {classLoading ? (
                <CircularProgress size={24} />
              ) : fclassesList.length === 0 ? (
                <Typography color="error">No classes available. Please add classes first.</Typography>
              ) : (
                <Select
                  options={classOptions}
                  value={classOptions.find((opt) => opt.value === formData.classId) || null}
                  onChange={(newValue) => handleSelectChange('classId', newValue)}
                  onKeyDown={(e: any) => handleKeyDown(e, sectionRef)}
                  placeholder="Select Class"
                  isClearable
                  isSearchable
                  styles={selectStyles}
                  menuPortalTarget={document.body}
                  ref={classRef}
                  isOpen={isClassSelectOpen}
                  onMenuOpen={() => setIsClassSelectOpen(true)}
                  onMenuClose={() => setIsClassSelectOpen(false)}
                />
              )}
            </FormControl>
            <FormControl fullWidth size="small">
              {formSectionOptions.length === 0 && formData.classId ? (
                <Typography color="error">No sections available for this class</Typography>
              ) : (
                <Select
                  options={formSectionOptions}
                  value={formSectionOptions.find((opt) => opt.value === formData.section) || null}
                  onChange={(newValue) => handleSelectChange('section', newValue)}
                  onKeyDown={(e: any) => handleKeyDown(e, admissionRef)}
                  placeholder="Select Section"
                  isClearable
                  isSearchable
                  isDisabled={!formData.classId}
                  styles={selectStyles}
                  menuPortalTarget={document.body}
                  ref={sectionRef}
                  isOpen={isSectionSelectOpen}
                  onMenuOpen={() => setIsSectionSelectOpen(true)}
                  onMenuClose={() => setIsSectionSelectOpen(false)}
                />
              )}
            </FormControl>
            <FormControl fullWidth size="small">
              {admissionLoading ? (
                <CircularProgress size={24} />
              ) : admissionOptions.length === 0 && formData.classId && formData.section ? (
                <Typography color="error">No students found for this class and section</Typography>
              ) : (
                <Select
                  options={admissionOptions}
                  value={admissionOptions.find((opt) => opt.value === formData.admissionNo) || null}
                  onChange={(newValue) => handleSelectChange('admissionNo', newValue)}
                  onKeyDown={(e: any) => handleKeyDown(e, examGroupRef)}
                  placeholder="Select Admission No"
                  isClearable
                  isSearchable
                  isDisabled={!formData.classId || !formData.section}
                  styles={selectStyles}
                  menuPortalTarget={document.body}
                  ref={admissionRef}
                  isOpen={isAdmissionSelectOpen}
                  onMenuOpen={() => setIsAdmissionSelectOpen(true)}
                  onMenuClose={() => setIsAdmissionSelectOpen(false)}
                />
              )}
            </FormControl>
            <TextField
              fullWidth
              label="Roll Number"
              name="rollNo"
              value={formData.rollNo}
              onChange={handleInputChange}
              variant="outlined"
              size="small"
              disabled
            />
            <TextField
              fullWidth
              label="Student Name"
              name="studentName"
              value={formData.studentName}
              onChange={handleInputChange}
              variant="outlined"
              size="small"
              disabled
            />
            <FormControl fullWidth size="small">
              <InputLabel id="form-exam-group-label">Exam Group</InputLabel>
              <MUISelect
                name="examGroup"
                value={formData.examGroup}
                onChange={(e) => handleSelectChange('examGroup', { value: e.target.value })}
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
                {examGroups.map((group) => (
                  <MenuItem key={group} value={group}>{group}</MenuItem>
                ))}
              </MUISelect>
            </FormControl>
            <FormControl fullWidth size="small">
              <InputLabel id="form-exam-type-label">Exam Type</InputLabel>
              <MUISelect
                name="examType"
                value={formData.examType}
                onChange={(e) => handleSelectChange('examType', { value: e.target.value })}
                onKeyDown={(e) => handleKeyDown(e, sessionRef)}
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
                {examTypes.map((type) => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </MUISelect>
            </FormControl>
            <FormControl fullWidth size="small">
              <InputLabel id="form-session-label">Session</InputLabel>
              <MUISelect
                name="session"
                value={formData.session}
                onChange={(e) => handleSelectChange('session', { value: e.target.value })}
                onKeyDown={(e) => handleKeyDown(e, subjectRefs.current[0][0] ? subjectRefs.current[0][0] : saveButtonRef)}
                open={isSessionSelectOpen}
                onOpen={() => setIsSessionSelectOpen(true)}
                onClose={() => setIsSessionSelectOpen(false)}
                label="Session"
                labelId="form-session-label"
                required
                aria-label="Session"
                inputRef={sessionRef}
              >
                <MenuItem value="">Select Session</MenuItem>
                {sessions.map((session) => (
                  <MenuItem key={session} value={session}>{session}</MenuItem>
                ))}
              </MUISelect>
            </FormControl>
            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
              Subjects (Marks should be between 0 and 100)
            </Typography>
            {formData.subjects.map((subject, index) => (
              <Grid container spacing={2} key={index} sx={{ mb: 2, alignItems: 'center' }}>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    label="Subject Name"
                    value={subject.subjectName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e, index, 'subjectName')}
                    onKeyDown={(e) => handleKeyDown(e, subjectRefs.current[index][1], index, 'subjectName')}
                    variant="outlined"
                    size="small"
                    inputRef={(el) => (subjectRefs.current[index][0] = el)}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <TextField
                    fullWidth
                    label="Marks Obtained (0-100)"
                    type="number"
                    value={subject.attendance === 'Absent' ? 0 : subject.marksObtained}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const value = Number(e.target.value);
                      if (value > 100 || value < 0) {
                        setSnack({ open: true, message: 'Marks must be between 0 and 100', severity: 'warning' });
                        return;
                      }
                      handleInputChange(e, index, 'marksObtained');
                    }}
                    onKeyDown={(e) => handleKeyDown(e, subjectRefs.current[index][2], index, 'marksObtained')}
                    variant="outlined"
                    size="small"
                    inputProps={{ min: 0, max: 100 }}
                    error={Number(subject.marksObtained) > 100 || Number(subject.marksObtained) < 0}
                    helperText={Number(subject.marksObtained) > 100 || Number(subject.marksObtained) < 0 ? 'Invalid marks' : ''}
                    disabled={subject.attendance === 'Absent'}
                    inputRef={(el) => (subjectRefs.current[index][1] = el)}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <TextField
                    fullWidth
                    label="Subject Code"
                    value={subject.subjectCode}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e, index, 'subjectCode')}
                    onKeyDown={(e) => handleKeyDown(e, subjectRefs.current[index][3], index, 'subjectCode')}
                    variant="outlined"
                    size="small"
                    inputRef={(el) => (subjectRefs.current[index][2] = el)}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Select
                    options={attendanceOptions}
                    value={attendanceOptions.find((opt) => opt.value === subject.attendance) || null}
                    onChange={(newValue) => handleSelectChange('attendance', newValue, index)}
                    onKeyDown={(e: any) => handleKeyDown(e, null, index, 'attendance')}
                    placeholder="Attendance"
                    isClearable
                    isSearchable
                    styles={selectStyles}
                    menuPortalTarget={document.body}
                    ref={(el) => (subjectRefs.current[index][3] = el)}
                    isOpen={subjectAttendanceOpen[index]}
                    onMenuOpen={() => updateSubjectAttendanceOpen(index, true)}
                    onMenuClose={() => updateSubjectAttendanceOpen(index, false)}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    label="Grade"
                    value={subject.grade || 'N/A'}
                    disabled
                    variant="outlined"
                    size="small"
                  />
                  {index > 0 && (
                    <IconButton onClick={() => removeSubject(index)} color="error">
                      <FaMinus />
                    </IconButton>
                  )}
                  {index === formData.subjects.length - 1 && (
                    <IconButton onClick={addSubject} color="success">
                      <FaPlus />
                    </IconButton>
                  )}
                </Grid>
              </Grid>
            ))}
            <Typography>
              Grand Total: {calculateGPAandGrade(formData.subjects).grandTotal}/{formData.subjects.length * 100}
            </Typography>
            <Typography>
              Percentage: {calculateGPAandGrade(formData.subjects).percent}%
            </Typography>
            <Typography>
              GPA: {(calculateGPAandGrade(formData.subjects).gpa).toFixed(2)}
            </Typography>
            <Typography>
              Overall Grade: {calculateGPAandGrade(formData.subjects).overallGrade}
            </Typography>
          </FormContainer>
        </DialogContent>
        <DialogActions>
          <CancelButton onClick={handleClosePopup} aria-label="Cancel">
            Cancel
          </CancelButton>
          <AddButton onClick={handleSave} aria-label={editId ? 'Update Exam Result' : 'Save Exam Result'} ref={saveButtonRef}>
            {editId ? 'Update' : 'Save'}
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

export default ExamResult;