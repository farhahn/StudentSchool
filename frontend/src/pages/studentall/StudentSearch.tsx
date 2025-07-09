import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select, { OnChangeValue } from 'react-select';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled, { keyframes } from 'styled-components';
import ReactPaginate from 'react-paginate';
import { searchStudents, resetSearch } from '../../redux/StudentAddmissionDetail/studentSearchHandle';
import { getAllFclasses } from '../../redux/fclass/fclassHandle';
import { RootState, AppDispatch } from '../../redux/store';

interface Option {
  value: string;
  label: string;
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

const FilterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: clamp(0.8rem, 2vw, 1rem);
  width: 100%;
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
  font-family: 'Roboto', sans-serif;
  width: 100%;
  box-sizing: border-box;
  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.3);
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
  align-self: flex-start;
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

const ResetButton = styled(Button)`
  background: linear-gradient(45deg, #e74c3c, #c0392b);
  &:focus {
    box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.3);
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
  min-width: 800px;
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

const StudentSearch: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { students, loading, error, status } = useSelector((state: RootState) => state.studentSearch);
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { fclassesList } = useSelector((state: RootState) => state.fclass);
  const adminID = currentUser?._id;

  const [searchParams, setSearchParams] = useState({
    admissionNo: '',
    name: '',
    classId: '',
    section: '',
  });
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    if (adminID) {
      dispatch(getAllFclasses(adminID));
    } else {
      toast.error('Please log in to search students', { position: 'top-right', autoClose: 3000 });
    }
  }, [dispatch, adminID]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, newValue: OnChangeValue<Option, false>) => {
    setSearchParams((prev) => ({
      ...prev,
      [name]: newValue ? newValue.value : '',
      ...(name === 'classId' && { section: '' }), // Reset section when class changes
    }));
  };

  const handleSearch = () => {
    if (!adminID) {
      toast.error('Please log in to search students', { position: 'top-right', autoClose: 3000 });
      return;
    }
    dispatch(searchStudents(adminID, searchParams));
    setCurrentPage(0); // Reset to first page on new search
  };

  const handleReset = () => {
    setSearchParams({ admissionNo: '', name: '', classId: '', section: '' });
    dispatch(resetSearch());
    setCurrentPage(0); // Reset pagination
  };

  const classOptions: Option[] = fclassesList.map((cls) => ({ value: cls._id, label: cls.name }));
  const sectionOptions: Option[] = fclassesList
    .find((cls) => cls._id === searchParams.classId)
    ?.sections.map((sec) => ({ value: sec, label: sec })) || [];

  const pageCount = Math.ceil(students.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentPageData = students.slice(offset, offset + itemsPerPage);

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
        <Title>Student Search</Title>

        {error && (
          <div style={{ color: '#e74c3c', textAlign: 'center', marginBottom: 'clamp(0.8rem, 2vw, 1rem)', fontSize: 'clamp(0.9rem, 3vw, 1rem)' }}>
            {error}
          </div>
        )}

        <Card>
          <FilterSection>
            <FormGroup>
              <Label htmlFor="admission-no">Admission No</Label>
              <Input
                id="admission-no"
                name="admissionNo"
                value={searchParams.admissionNo}
                onChange={handleInputChange}
                placeholder="Search by Admission No"
                aria-label="Search by Admission Number"
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={searchParams.name}
                onChange={handleInputChange}
                placeholder="Search by Name"
                aria-label="Search by Student Name"
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="class-select">Class</Label>
              <Select
                id="class-select"
                options={classOptions}
                value={classOptions.find((opt) => opt.value === searchParams.classId) || null}
                onChange={(newValue) => handleSelectChange('classId', newValue)}
                placeholder="Select Class"
                isClearable
                isSearchable
                styles={selectStyles}
                aria-label="Select Class"
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="section-select">Section</Label>
              <Select
                id="section-select"
                options={sectionOptions}
                value={sectionOptions.find((opt) => opt.value === searchParams.section) || null}
                onChange={(newValue) => handleSelectChange('section', newValue)}
                placeholder="Select Section"
                isClearable
                isSearchable
                isDisabled={!searchParams.classId}
                styles={selectStyles}
                aria-label="Select Section"
              />
            </FormGroup>
            <div style={{ display: 'flex', gap: 'clamp(0.8rem, 2vw, 1rem)' }}>
              <Button onClick={handleSearch} disabled={loading} aria-label="Search Students">
                Search
              </Button>
              <ResetButton onClick={handleReset} disabled={loading} aria-label="Reset Search">
                Reset
              </ResetButton>
            </div>
          </FilterSection>
        </Card>

        {loading ? (
          <div style={{ textAlign: 'center', fontSize: 'clamp(0.9rem, 3vw, 1rem)', color: '#2c3e50' }}>
            Loading...
          </div>
        ) : currentPageData.length === 0 ? (
          <div style={{ textAlign: 'center', fontSize: 'clamp(0.9rem, 3vw, 1rem)', color: '#2c3e50' }}>
            No students found. Try adjusting your search criteria.
          </div>
        ) : (
          <TableWrapper>
            <Table>
              <thead>
                <tr>
                  <Th>Admission No</Th>
                  <Th>Name</Th>
                  <Th>Class</Th>
                  <Th>Section</Th>
                  <Th>Gender</Th>
                  <Th>DOB</Th>
                </tr>
              </thead>
              <tbody>
                {currentPageData.map((student) => (
                  <tr key={student._id}>
                    <Td>{student.admissionNo}</Td>
                    <Td>{student.firstName} {student.lastName}</Td>
                    <Td>{typeof student.classId === 'object' && student.classId ? student.classId.name : 'Unknown'}</Td>
                    <Td>{student.section || 'N/A'}</Td>
                    <Td>{student.gender || 'N/A'}</Td>
                    <Td>{new Date(student.dob).toLocaleDateString()}</Td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <PaginationContainer>
              <RecordCount>
                Records: {currentPageData.length} of {students.length}
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
      </Container>
      <style jsx global>{`
        .Toastify__toast--success {
          background: linear-gradient(135deg, #2ecc71, #27ae60);
          color: #fff;
          font-family: 'Roboto, sans-serif';
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          font-size: clamp(0.8rem, 3vw, 0.9rem);
        }
        .Toastify__toast--error {
          background: linear-gradient(135deg, #e74c3c, #c0392b);
          color: #fff;
          font-family: 'Roboto, sans-serif';
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          font-size: clamp(0.8rem, 3vw, 0.9rem);
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

export default StudentSearch;