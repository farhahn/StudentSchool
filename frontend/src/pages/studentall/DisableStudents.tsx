import React, { useEffect, useState, Component, ErrorInfo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select, { OnChangeValue } from 'react-select';
import styled, { keyframes } from 'styled-components';
import ReactPaginate from 'react-paginate';
import {
  fetchAllDisabledStudents,
  createDisabledStudent,
  updateDisabledStudent,
  deleteDisabledStudent,
} from '../../redux/StudentAddmissionDetail/disabledStudentHandle';
import {
  setNewDisabledStudent,
  toggleEditDisabledStudent,
  setEditDisabledStudent,
  resetDisabledStudent,
} from '../../redux/StudentAddmissionDetail/disabledStudentSlice';
import { fetchAllReasons } from '../../redux/StudentAddmissionDetail/reasonHandle';
import { fetchAdmissionForms } from '../../redux/StudentAddmissionDetail/studentAddmissionHandle';
import { RootState, AppDispatch } from '../../redux/store';
import { Edit, Delete } from '@mui/icons-material';

interface Option {
  value: string;
  label: string;
}

interface DisabledStudent {
  _id: string;
  reasonId: string;
  studentId: string;
  reasonText?: string;
  studentName?: string;
  studentClass?: string;
  studentAdmissionNo?: string;
  isEditing?: boolean;
}

// Error Boundary Component
class ErrorBoundary extends Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ textAlign: 'center', padding: '20px', color: '#e74c3c' }}>
          <h2>Something went wrong.</h2>
          <p>Please refresh the page or try again later.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  padding: clamp(1rem, 3vw, 1.5rem);
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
  font-family: 'Roboto', sans-serif;
  overflow-x: hidden;
  width: 100%;
  box-sizing: border-box;
  @media (max-width: 768px) {
    padding: clamp(0.8rem, 2.5vw, 1rem);
  }
`;

const Title = styled.h2`
  text-align: center;
  color: #2c3e50;
  margin-bottom: clamp(1rem, 3vw, 1.5rem);
  font-size: clamp(1.8rem, 5vw, 2.2rem);
  font-weight: 700;
  text-transform: uppercase;
`;

const Card = styled.div`
  background: white;
  padding: clamp(1rem, 3vw, 1.5rem);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: clamp(1rem, 3vw, 1.5rem);
  max-width: 600px;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  @media (max-width: 600px) {
    padding: clamp(0.8rem, 2.5vw, 1rem);
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: clamp(0.8rem, 2vw, 1rem);
`;

const Label = styled.label`
  font-size: clamp(0.8rem, 3vw, 0.9rem);
  color: #2c3e50;
  font-weight: 500;
  margin-bottom: 0.3rem;
`;

const Button = styled.button`
  padding: 0.6rem 1.2rem;
  background: linear-gradient(45deg, #2ecc71, #27ae60);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: clamp(0.9rem, 3vw, 1rem);
  font-weight: 600;
  transition: transform 0.2s, box-shadow 0.2s;
  min-width: 44px;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(46, 204, 113, 0.3);
  }
  &:disabled {
    background: #bdc3c7;
    cursor: not-allowed;
  }
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: clamp(1rem, 3vw, 1.1rem);
  margin: 0 0.3rem;
  min-width: 44px;
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
  &:hover {
    transform: scale(1.2);
  }
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  width: 100%;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const Table = styled.table`
  width: 100%;
  background: white;
  border-radius: 12px;
  border-collapse: collapse;
  animation: ${fadeIn} 0.5s ease;
  table-layout: auto;
  min-width: 600px;
`;

const Th = styled.th`
  background: linear-gradient(45deg, #3498db, #2980b9);
  color: white;
  padding: clamp(0.6rem, 2vw, 0.8rem);
  font-size: clamp(0.9rem, 3vw, 1rem);
  font-weight: 600;
  text-transform: uppercase;
  white-space: nowrap;
`;

const Td = styled.td`
  padding: clamp(0.6rem, 2vw, 0.8rem);
  text-align: center;
  border-bottom: 1px solid #ecf0f1;
  font-size: clamp(0.85rem, 3vw, 0.95rem);
  color: #2c3e50;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  @media (max-width: 768px) {
    max-width: 100px;
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: clamp(1rem, 3vw, 1.5rem);
  gap: 0.8rem;
`;

const RecordCount = styled.div`
  color: #2c3e50;
  font-size: clamp(0.8rem, 3vw, 0.9rem);
  font-weight: 500;
`;

const selectStyles = {
  control: (base: any) => ({
    ...base,
    marginBottom: 'clamp(0.8rem, 2vw, 1rem)',
    borderRadius: '6px',
    padding: '0.2rem',
    fontSize: 'clamp(0.85rem, 3vw, 0.95rem)',
    fontFamily: 'Roboto, sans-serif',
    borderColor: '#bdc3c7',
    '&:hover': { borderColor: '#3498db' },
    boxShadow: 'none',
  }),
  menu: (base: any) => ({
    ...base,
    borderRadius: '6px',
    marginTop: '4px',
    zIndex: 1000,
    fontSize: 'clamp(0.85rem, 3vw, 0.95rem)',
    fontFamily: 'Roboto, sans-serif',
  }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isSelected ? '#3498db' : state.isFocused ? '#e0e0e0' : 'white',
    color: state.isSelected ? 'white' : '#2c3e50',
    padding: '0.5rem',
    cursor: 'pointer',
  }),
};

const DisableStudents: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { reasons } = useSelector((state: RootState) => state.reason);
  const { admissionForms } = useSelector((state: RootState) => state.admissionForms);
  const { disabledStudents, newDisabledStudent, loading, error, status } = useSelector(
    (state: RootState) => state.disabledStudent
  );
  const { currentUser } = useSelector((state: RootState) => state.user);
  const adminID = currentUser?._id;

  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    if (adminID) {
      dispatch(fetchAllReasons(adminID));
      dispatch(fetchAdmissionForms(adminID));
      dispatch(fetchAllDisabledStudents(adminID));
    } else {
      toast.error('Please log in to manage disabled students', {
        position: 'top-right',
        autoClose: 3000,
      });
    }

    return () => {
      dispatch(resetDisabledStudent());
    };
  }, [dispatch, adminID]);

  useEffect(() => {
    if (error) {
      let errorMessage = error;
      if (error.includes('Cast to Number failed')) {
        errorMessage = 'Invalid ID format. Please try again.';
      } else if (error.includes('duplicate key error')) {
        errorMessage = 'This student is already disabled for this reason.';
      }
      toast.error(errorMessage, { position: 'top-right', autoClose: 3000 });
    }
  }, [error]);

  const reasonOptions: Option[] = reasons.map((reason) => ({
    value: reason._id,
    label: reason.text,
  }));

  const studentOptions: Option[] = admissionForms.map((form) => ({
    value: form._id,
    label: `${form.firstName} ${form.lastName} (Class: ${
      typeof form.classId === 'object' && form.classId ? form.classId.name : form.classId || 'N/A'
    }, Admission No: ${form.admissionNo || 'N/A'})`,
  }));

  const handleReasonChange = (newValue: OnChangeValue<Option, false>) => {
    dispatch(setNewDisabledStudent({ ...newDisabledStudent, reasonId: newValue ? newValue.value : '' }));
  };

  const handleStudentChange = (newValue: OnChangeValue<Option, false>) => {
    dispatch(setNewDisabledStudent({ ...newDisabledStudent, studentId: newValue ? newValue.value : '' }));
  };

  const handleEditReasonChange = (id: string, newValue: OnChangeValue<Option, false>) => {
    dispatch(setEditDisabledStudent({ id, reasonId: newValue ? newValue.value : '' }));
  };

  const handleEditStudentChange = (id: string, newValue: OnChangeValue<Option, false>) => {
    dispatch(setEditDisabledStudent({ id, studentId: newValue ? newValue.value : '' }));
  };

  const addDisabledStudent = () => {
    if (!newDisabledStudent.reasonId || !newDisabledStudent.studentId) {
      toast.warn('Please select both a reason and a student!', { position: 'top-right', autoClose: 3000 });
      return;
    }

    if (
      disabledStudents.some(
        (ds) => ds.studentId === newDisabledStudent.studentId && ds.reasonId === newDisabledStudent.reasonId
      )
    ) {
      toast.warn('This student is already disabled for this reason!', { position: 'top-right', autoClose: 3000 });
      return;
    }

    dispatch(createDisabledStudent(adminID, newDisabledStudent))
      .then((result: any) => {
        console.log('addDisabledStudent result:', result);
        if (result.success) {
          toast.success('Student disabled successfully', {
            position: 'top-right',
            autoClose: 3000,
          });
          dispatch(setNewDisabledStudent({ reasonId: '', studentId: '' }));
        } else {
          toast.error(result.error || 'Failed to add disabled student', {
            position: 'top-right',
            autoClose: 3000,
          });
        }
      })
      .catch((err: Error) => {
        console.error('Error in addDisabledStudent:', err);
        toast.error(`Failed to add disabled student: ${err.message || 'Unexpected error'}`, {
          position: 'top-right',
          autoClose: 3000,
        });
      });
  };

  const handleEdit = (id: string) => {
    dispatch(toggleEditDisabledStudent(id));
  };

  const handleSave = (id: string) => {
    const disabledStudent = disabledStudents.find((ds) => ds._id === id);
    if (!disabledStudent?.reasonId || !disabledStudent?.studentId) {
      toast.warn('Please select both a reason and a student!', { position: 'top-right', autoClose: 3000 });
      return;
    }

    dispatch(
      updateDisabledStudent(adminID, id, {
        reasonId: disabledStudent.reasonId,
        studentId: disabledStudent.studentId,
      })
    )
      .then((result: any) => {
        console.log('handleSave result:', result);
        if (result.success) {
          toast.success('Disabled student updated successfully', {
            position: 'top-right',
            autoClose: 3000,
          });
        } else {
          toast.error(result.error || 'Failed to update disabled student', {
            position: 'top-right',
            autoClose: 3000,
          });
        }
      })
      .catch((err: Error) => {
        console.error('Error in handleSave:', err);
        toast.error(`Failed to update disabled student: ${err.message || 'Unexpected error'}`, {
          position: 'top-right',
          autoClose: 3000,
        });
      });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to remove this disabled student?')) {
      dispatch(deleteDisabledStudent(adminID, id))
        .then((result: any) => {
          console.log('handleDelete result:', result);
          if (result.success) {
            toast.success('Disabled student removed successfully', {
              position: 'top-right',
              autoClose: 3000,
            });
          } else {
            toast.error(result.error || 'Failed to delete disabled student', {
              position: 'top-right',
              autoClose: 3000,
            });
          }
        })
        .catch((err: Error) => {
          console.error('Error in handleDelete:', err);
          toast.error(`Failed to delete disabled student: ${err.message || 'Unexpected error'}`, {
            position: 'top-right',
            autoClose: 3000,
          });
        });
    }
  };

  const pageCount = Math.ceil(disabledStudents.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentPageData = disabledStudents.slice(offset, offset + itemsPerPage);

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(0);
  };

  return (
    <ErrorBoundary>
      <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet" />
      <Container>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          toastStyle={{
            borderRadius: '8px',
            fontFamily: 'Roboto, sans-serif',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
            fontSize: 'clamp(0.8rem, 3vw, 0.9rem)',
          }}
        />
        <Title>Disable Student Management</Title>

        {error && (
          <div style={{ color: '#e74c3c', textAlign: 'center', marginBottom: 'clamp(0.8rem, 2vw, 1rem)', fontSize: 'clamp(0.9rem, 3vw, 1rem)' }}>
            {error}
          </div>
        )}

        <Card>
          <FormGroup>
            <Label htmlFor="reason-select">Disable Reason</Label>
            <Select
              id="reason-select"
              options={reasonOptions}
              value={reasonOptions.find((opt) => opt.value === newDisabledStudent.reasonId) || null}
              onChange={handleReasonChange}
              placeholder="Select Disable Reason"
              isClearable
              styles={selectStyles}
              aria-label="Select Disable Reason"
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="student-select">Student</Label>
            <Select
              id="student-select"
              options={studentOptions}
              value={studentOptions.find((opt) => opt.value === newDisabledStudent.studentId) || null}
              onChange={handleStudentChange}
              placeholder="Select Student (Name, Class, Admission No)"
              isClearable
              styles={selectStyles}
              aria-label="Select Student"
            />
          </FormGroup>
          <Button onClick={addDisabledStudent} disabled={loading} aria-label="Disable Student">
            {loading ? 'Saving...' : 'Done'}
          </Button>
        </Card>

        <Card>
          {loading ? (
            <div style={{ textAlign: 'center', fontSize: 'clamp(0.9rem, 3vw, 1rem)', color: '#2c3e50' }}>
              Loading...
            </div>
          ) : (
            <TableWrapper>
              <Table>
                <thead>
                  <tr>
                    <Th>Disable Reason</Th>
                    <Th>Student Name</Th>
                    <Th>Class</Th>
                    <Th>Admission No</Th>
                    <Th>Actions</Th>
                  </tr>
                </thead>
                <tbody>
                  {currentPageData.length > 0 ? (
                    currentPageData.map((ds: DisabledStudent) => (
                      <tr key={ds._id}>
                        <Td>
                          {ds.isEditing ? (
                            <Select
                              options={reasonOptions}
                              value={reasonOptions.find((opt) => opt.value === ds.reasonId) || null}
                              onChange={(newValue) => handleEditReasonChange(ds._id, newValue)}
                              placeholder="Select Disable Reason"
                              styles={selectStyles}
                              aria-label={`Edit Disable Reason for ${ds.studentName || 'Student'}`}
                            />
                          ) : (
                            ds.reasonText || 'N/A'
                          )}
                        </Td>
                        <Td>
                          {ds.isEditing ? (
                            <Select
                              options={studentOptions}
                              value={studentOptions.find((opt) => opt.value === ds.studentId) || null}
                              onChange={(newValue) => handleEditStudentChange(ds._id, newValue)}
                              placeholder="Select Student"
                              styles={selectStyles}
                              aria-label={`Edit Student for ${ds.studentName || 'Student'}`}
                            />
                          ) : (
                            ds.studentName || 'N/A'
                          )}
                        </Td>
                        <Td>{ds.studentClass || 'N/A'}</Td>
                        <Td>{ds.studentAdmissionNo || 'N/A'}</Td>
                        <Td>
                          {ds.isEditing ? (
                            <ActionButton
                              onClick={() => handleSave(ds._id)}
                              disabled={loading}
                              aria-label={`Save Disabled Student ${ds.studentName || 'Student'}`}
                              style={{ color: '#27ae60' }}
                            >
                              ✔️
                            </ActionButton>
                          ) : (
                            <ActionButton
                              onClick={() => handleEdit(ds._id)}
                              disabled={loading}
                              aria-label={`Edit Disabled Student ${ds.studentName || 'Student'}`}
                              style={{ color: '#3498db' }}
                            >
                              <Edit />
                            </ActionButton>
                          )}
                          <ActionButton
                            onClick={() => handleDelete(ds._id)}
                            disabled={loading}
                            aria-label={`Delete Disabled Student ${ds.studentName || 'Student'}`}
                            style={{ color: '#e74c3c' }}
                          >
                            <Delete />
                          </ActionButton>
                        </Td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <Td colSpan={5} style={{ textAlign: 'center', color: '#999' }}>
                        No disabled students found.
                      </Td>
                    </tr>
                  )}
                </tbody>
              </Table>
              <PaginationContainer>
                <RecordCount>
                  Records: {currentPageData.length} of {disabledStudents.length}
                </RecordCount>
                <div style={{ display: 'flex', gap: 'clamp(0.8rem, 2vw, 1rem)', alignItems: 'center' }}>
                  <Label htmlFor="items-per-page">Items per page</Label>
                  <select
                    id="items-per-page"
                    value={itemsPerPage}
                    onChange={(e) => handleItemsPerPageChange(e.target.value)}
                    style={{
                      padding: '0.6rem',
                      borderRadius: '6px',
                      border: '1px solid #bdc3c7',
                      fontSize: 'clamp(0.8rem, 3vw, 0.9rem)',
                    }}
                    aria-label="Items per page"
                  >
                    {[5, 10, 20, 30].map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                </div>
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
            </TableWrapper>
          )}
        </Card>
      </Container>
      <style jsx global>{`
        .Toastify__toast--success {
          background: linear-gradient(135deg, #2ecc71, #27ae60);
          color: #fff;
          font-family: 'Roboto', sans-serif;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          font-size: clamp(0.8rem, 3vw, 0.9rem);
        }
        .Toastify__toast--error {
          background: linear-gradient(135deg, #e74c3c, #c0392b);
          color: #fff;
          font-family: 'Roboto', sans-serif;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          font-size: clamp(0.8rem, 3vw, 0.9rem);
        }
        .Toastify__toast--warning {
          background: linear-gradient(135deg, #ffc107, #e0a800);
          color: #2c3e50;
          font-family: 'Roboto', sans-serif;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          font-size: clamp(0.8rem, 3vw, 0.9rem);
        }
        .Toastify__toast-body {
          padding: 10px;
        }
        .Toastify__close-button {
          color: #fff;
          opacity: 0.8;
          transition: opacity 0.2s ease;
        }
        .Toastify__close-button:hover {
          opacity: 1;
        }
        .Toastify__progress-bar {
          background: rgba(255, 255, 255, 0.3);
        }
        .Toastify__toast--warning .Toastify__close-button {
          color: #2c3e50;
        }
        .Toastify__toast--warning .Toastify__progress-bar {
          background: rgba(0, 0, 0, 0.3);
        }
        .pagination {
          display: flex;
          justify-content: center;
          list-style: none;
          padding: 0;
          margin: clamp(0.8rem, 2vw, 1rem) 0;
          flex-wrap: wrap;
        }
        .page {
          margin: 0 3px;
        }
        .page-link {
          padding: 6px 10px;
          border: 1px solid #bdc3c7;
          border-radius: 4px;
          cursor: pointer;
          background-color: #f9f9f9;
          color: #2c3e50;
          transition: all 0.2s ease;
          text-decoration: none;
          font-size: clamp(0.8rem, 2.5vw, 0.9rem);
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
          background: linear-gradient(45deg, #2ecc71, #27ae60);
          color: white;
          border-color: #27ae60;
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
            font-size: 0.8rem;
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
            font-size: 0.8rem;
          }
        }
      `}</style>
    </ErrorBoundary>
  );
};

export default DisableStudents;