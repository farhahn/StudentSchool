import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';
import {
  fetchFeeTypes,
  addFeeType,
  updateFeeType,
  deleteFeeType,
} from '../../../redux/StudentAddmissionDetail/studentAddmissionHandle';
import { RootState, AppDispatch } from '../../../redux/store';

const Container = styled.div`
  font-family: 'Poppins', sans-serif;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  background-color: #e8c897;
`;

const Header = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const FormContainer = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
`;

const InputGroup = styled.div`
  margin-bottom: 1.5rem;
  position: relative;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.75rem;
  font-weight: 600;
  color: #475569;
  font-size: 0.9rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.875rem 1rem;
  border-radius: 8px;
  border: 2px solid #e2e8f0;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const PrimaryButton = styled.button`
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  padding: 0.875rem 1.5rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 6px -1px rgba(99, 102, 241, 0.2);
  }
`;

const SecondaryButton = styled.button`
  background: #e2e8f0;
  color: #475569;
  padding: 0.875rem 1.5rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
  &:hover {
    background: #d1d5db;
  }
`;

const TableContainer = styled.div`
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  overflow: hidden;
`;

const SearchContainer = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #f1f5f9;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.875rem 1rem;
  border-radius: 8px;
  border: 2px solid #e2e8f0;
  font-size: 0.9rem;
  padding-left: 2.5rem;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3e%3cpath stroke-linecap='round' stroke-linejoin='round' d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' /%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: 1rem center;
  background-size: 1rem;
  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  background-color: #f8fafc;
  padding: 1rem;
  text-align: left;
  color: #64748b;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #f1f5f9;
  transition: background-color 0.2s ease;
  &:hover {
    background-color: #f8fafc;
  }
`;

const TableCell = styled.td`
  padding: 1.25rem 1rem;
  color: #1e293b;
  font-size: 0.9rem;
`;

const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  margin-right: 0.5rem;
`;

const EditButton = styled(ActionButton)`
  background-color: #e0f2fe;
  color: #0369a1;
`;

const DeleteButton = styled(ActionButton)`
  background-color: #fee2e2;
  color: #dc2626;
`;

const FeesTypeManager = () => {
  const dispatch = useDispatch();
  const { feeTypes = [], loading, error } = useSelector((state) => state.admissionForms);
  const { currentUser } = useSelector((state) => state.user);
  const adminID = currentUser?._id;

  const [formData, setFormData] = useState({ name: '', code: '', description: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (adminID) {
      dispatch(fetchFeeTypes(adminID));
    } else {
      toast.error('Please log in to manage fee types', { position: 'top-right', autoClose: 3000 });
    }
  }, [dispatch, adminID]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.code) {
      toast.error('Name and code are required', { position: 'top-right', autoClose: 3000 });
      return;
    }
    if (!adminID) {
      toast.error('Please log in to perform this action', { position: 'top-right', autoClose: 3000 });
      return;
    }

    const normalizedCode = formData.code.trim().toLowerCase().replace(/\s+/g, '-');
    const payload = { ...formData, code: normalizedCode, adminID };

    if (editingId) {
      dispatch(updateFeeType(editingId, payload)).then(() => {
        toast.success('Fee type updated successfully', { position: 'top-right', autoClose: 3000 });
        setFormData({ name: '', code: '', description: '' });
        setEditingId(null);
      });
    } else {
      dispatch(addFeeType(payload)).then(() => {
        toast.success('Fee type created successfully', { position: 'top-right', autoClose: 3000 });
        setFormData({ name: '', code: '', description: '' });
      });
    }
  };

  const handleEdit = (feeType) => {
    setFormData({ name: feeType.name, code: feeType.code, description: feeType.description || '' });
    setEditingId(feeType._id);
  };

  const handleDelete = (id) => {
    if (!adminID) {
      toast.error('Please log in to perform this action', { position: 'top-right', autoClose: 3000 });
      return;
    }
    if (window.confirm('Are you sure you want to delete this fee type?')) {
      dispatch(deleteFeeType(id, adminID)).then(() => {
        toast.success('Fee type deleted successfully', { position: 'top-right', autoClose: 3000 });
      });
    }
  };

  const filteredFeeTypes = feeTypes.filter(
    (ft) =>
      ft.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ft.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet" />
      <Container>
        <ToastContainer position="top-right" autoClose={3000} />
        <Header>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6366f1">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
          </svg>
          Manage Fee Types
        </Header>

        {error && <div style={{ color: '#e74c3c', textAlign: 'center', marginBottom: '1rem' }}>{error}</div>}

        <FormContainer>
          <form onSubmit={handleSubmit}>
            <InputGroup>
              <Label>Name *</Label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter fee type name"
                required
              />
            </InputGroup>

            <InputGroup>
              <Label>Fees Code *</Label>
              <Input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="Enter unique fee code"
                required
              />
            </InputGroup>

            <InputGroup>
              <Label>Description</Label>
              <Input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Add description (optional)"
              />
            </InputGroup>

            <ButtonGroup>
              <PrimaryButton type="submit">{editingId ? 'Update Fee Type' : 'Create New Fee Type'}</PrimaryButton>
              {editingId && (
                <SecondaryButton
                  type="button"
                  onClick={() => {
                    setFormData({ name: '', code: '', description: '' });
                    setEditingId(null);
                  }}
                >
                  Cancel
                </SecondaryButton>
              )}
            </ButtonGroup>
          </form>
        </FormContainer>

        <TableContainer>
          <SearchContainer>
            <SearchInput
              type="text"
              placeholder="Search fee types..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchContainer>

          {loading ? (
            <div style={{ color: '#34495e', textAlign: 'center', padding: '1rem' }}>Loading...</div>
          ) : filteredFeeTypes.length === 0 ? (
            <div style={{ color: '#34495e', textAlign: 'center', padding: '1rem' }}>
              No fee types found. {error ? `Error: ${error}` : 'Try adjusting your search.'}
            </div>
          ) : (
            <Table>
              <thead>
                <tr>
                  <TableHeader>Name</TableHeader>
                  <TableHeader>Fees Code</TableHeader>
                  <TableHeader>Actions</TableHeader>
                </tr>
              </thead>
              <tbody>
                {filteredFeeTypes.map((ft) => (
                  <TableRow key={ft._id}>
                    <TableCell>{ft.name}</TableCell>
                    <TableCell>{ft.code}</TableCell>
                    <TableCell>
                      <EditButton onClick={() => handleEdit(ft)}>✏️ Edit</EditButton>
                      <DeleteButton onClick={() => handleDelete(ft._id)}>🗑️ Delete</DeleteButton>
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          )}
        </TableContainer>
      </Container>
    </>
  );
};

export default FeesTypeManager;