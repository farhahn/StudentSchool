import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import styled, { keyframes } from 'styled-components';
import ReactPaginate from 'react-paginate';
import { FaPlus, FaMinus } from 'react-icons/fa';
import {
  fetchAllReasons,
  createReason,
  updateReason,
  deleteReason,
} from '../../redux/StudentAddmissionDetail/reasonHandle';
import {
  setNewReason,
  setEditReason,
  toggleEditReason,
  resetReason,
} from '../../redux/StudentAddmissionDetail/reasonSlice';
import { RootState, AppDispatch } from '../../redux/store';
import { Edit, Delete, FileCopy, Print, PictureAsPdf } from '@mui/icons-material';

interface Reason {
  _id: string;
  text: string;
  isEditing: boolean;
}

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const scaleIn = keyframes`
  from { transform: scale(0.8); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
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

const Input = styled.input`
  padding: 0.6rem;
  border: 1px solid #bdc3c7;
  border-radius: 6px;
  font-size: clamp(0.85rem, 3vw, 0.95rem);
  width: 100%;
  box-sizing: border-box;
  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
  }
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

const ExportButtons = styled.div`
  display: flex;
  gap: clamp(0.8rem, 2vw, 1rem);
  justify-content: flex-end;
  margin-bottom: clamp(0.8rem, 2vw, 1rem);
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
  min-width: 500px;
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
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  @media (max-width: 768px) {
    max-width: 150px;
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

const DisableReason: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { reasons, newReason, loading, error, status } = useSelector(
    (state: RootState) => state.reason
  );
  const { currentUser } = useSelector((state: RootState) => state.user);
  const adminID = currentUser?._id;

  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    if (adminID) {
      dispatch(fetchAllReasons(adminID));
    } else {
      toast.error('Please log in to manage reasons', {
        position: 'top-right',
        autoClose: 3000,
      });
    }

    return () => {
      dispatch(resetReason());
    };
  }, [dispatch, adminID]);

  useEffect(() => {
    if (error) {
      let errorMessage = error;
      if (error.includes('Cast to Number failed')) {
        errorMessage = 'Invalid reason ID format. Please try again.';
      } else if (error.includes('Reason ID already exists')) {
        errorMessage = 'This reason ID is already in use. Try again later.';
      } else if (error.includes('Reason already exists')) {
        errorMessage = 'This reason already exists for your school.';
      } else if (error.includes('duplicate key error')) {
        errorMessage = 'A duplicate reason ID was detected. Please try again.';
      }
      toast.error(errorMessage, { position: 'top-right', autoClose: 3000 });
    }
  }, [error]);

  const addReason = () => {
    if (!newReason.trim()) {
      toast.warn('Reason cannot be empty!', { position: 'top-right', autoClose: 3000 });
      return;
    }
    if (reasons.some((reason) => reason.text.toLowerCase() === newReason.trim().toLowerCase())) {
      toast.warn('Reason already exists!', { position: 'top-right', autoClose: 3000 });
      return;
    }

    dispatch(createReason({ adminID, text: newReason.trim() })).then((result) => {
      if (createReason.fulfilled.match(result)) {
        toast.success('Reason added successfully', {
          position: 'top-right',
          autoClose: 3000,
        });
      } else {
        toast.error('Failed to add reason', { position: 'top-right', autoClose: 3000 });
      }
    });
  };

  const handleEdit = (id: string) => {
    dispatch(toggleEditReason(id));
  };

  const handleTextChange = (id: string, text: string) => {
    dispatch(setEditReason({ id, text }));
  };

  const handleSave = (id: string) => {
    const reason = reasons.find((r) => r._id === id);
    if (!reason?.text.trim()) {
      toast.warn('Reason cannot be empty!', { position: 'top-right', autoClose: 3000 });
      return;
    }
    dispatch(updateReason({ adminID, reasonId: id, text: reason.text })).then((result) => {
      if (updateReason.fulfilled.match(result)) {
        toast.success('Reason updated successfully', {
          position: 'top-right',
          autoClose: 3000,
        });
      } else {
        toast.error('Failed to update reason', { position: 'top-right', autoClose: 3000 });
      }
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this reason?')) {
      dispatch(deleteReason({ adminID, reasonId: id })).then((result) => {
        if (deleteReason.fulfilled.match(result)) {
          toast.success('Reason deleted successfully', {
            position: 'top-right',
            autoClose: 3000,
          });
        } else {
          toast.error('Failed to delete reason', { position: 'top-right', autoClose: 3000 });
        }
      });
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text('Disable Reason List', 10, 10);
    doc.autoTable({
      head: [['#', 'Disable Reason']],
      body: reasons.map((r, index) => [index + 1, r.text]),
    });
    doc.save('DisableReasonList.pdf');
  };

  const pageCount = Math.ceil(reasons.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentPageData = reasons.slice(offset, offset + itemsPerPage);

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(0);
  };

  return (
    <>
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
        <Title>Disable Reason Management</Title>

        {error && (
          <div style={{ color: '#e74c3c', textAlign: 'center', marginBottom: 'clamp(0.8rem, 2vw, 1rem)', fontSize: 'clamp(0.9rem, 3vw, 1rem)' }}>
            {error}
          </div>
        )}

        <Card>
          <FormGroup>
            <Label htmlFor="new-reason">Reason</Label>
            <Input
              id="new-reason"
              placeholder="Enter Disable Reason"
              value={newReason}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => dispatch(setNewReason(e.target.value))}
              disabled={loading}
              aria-label="New Disable Reason"
            />
          </FormGroup>
          <Button onClick={addReason} disabled={loading} aria-label="Save Reason">
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </Card>

        <Card>
          <ExportButtons>
            <ActionButton
              onClick={() => navigator.clipboard.writeText(JSON.stringify(reasons))}
              disabled={loading}
              aria-label="Copy Reasons to Clipboard"
              style={{ color: '#3498db' }}
            >
              <FileCopy />
            </ActionButton>
            <ActionButton
              onClick={() => window.print()}
              disabled={loading}
              aria-label="Print Reasons"
              style={{ color: '#3498db' }}
            >
              <Print />
            </ActionButton>
            <ActionButton
              onClick={exportPDF}
              disabled={loading}
              aria-label="Export Reasons to PDF"
              style={{ color: '#e74c3c' }}
            >
              <PictureAsPdf />
            </ActionButton>
          </ExportButtons>

          {loading ? (
            <div style={{ textAlign: 'center', fontSize: 'clamp(0.9rem, 3vw, 1rem)', color: '#2c3e50' }}>
              Loading...
            </div>
          ) : (
            <TableWrapper>
              <Table>
                <thead>
                  <tr>
                    <Th>#</Th>
                    <Th>Disable Reason</Th>
                    <Th>Actions</Th>
                  </tr>
                </thead>
                <tbody>
                  {currentPageData.length > 0 ? (
                    currentPageData.map((reason: Reason, index: number) => (
                      <tr key={reason._id}>
                        <Td>{offset + index + 1}</Td>
                        <Td>
                          {reason.isEditing ? (
                            <Input
                              value={reason.text}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleTextChange(reason._id, e.target.value)}
                              disabled={loading}
                              aria-label={`Edit Reason ${reason.text}`}
                            />
                          ) : (
                            reason.text
                          )}
                        </Td>
                        <Td>
                          {reason.isEditing ? (
                            <ActionButton
                              onClick={() => handleSave(reason._id)}
                              disabled={loading}
                              aria-label={`Save Reason ${reason.text}`}
                              style={{ color: '#27ae60' }}
                            >
                              ✔️
                            </ActionButton>
                          ) : (
                            <ActionButton
                              onClick={() => handleEdit(reason._id)}
                              disabled={loading}
                              aria-label={`Edit Reason ${reason.text}`}
                              style={{ color: '#3498db' }}
                            >
                              <Edit />
                            </ActionButton>
                          )}
                          <ActionButton
                            onClick={() => handleDelete(reason._id)}
                            disabled={loading}
                            aria-label={`Delete Reason ${reason.text}`}
                            style={{ color: '#e74c3c' }}
                          >
                            <Delete />
                          </ActionButton>
                        </Td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <Td colSpan={3} style={{ textAlign: 'center', color: '#999' }}>
                        No reasons found.
                      </Td>
                    </tr>
                  )}
                </tbody>
              </Table>
              <PaginationContainer>
                <RecordCount>
                  Records: {currentPageData.length} of {reasons.length}
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
    </>
  );
};

export default DisableReason;