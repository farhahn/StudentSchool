
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select, { OnChangeValue } from 'react-select';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled, { keyframes } from 'styled-components';
import ReactPaginate from 'react-paginate';
import {
  fetchEntries,
  addEntry,
  updateEntry,
  deleteEntry,
} from '../../../redux/FrontOffice/Enquiry/frontOfficeHandler';

interface Option {
  value: string;
  label: string;
}

interface FrontOfficeEntry {
  _id: string;
  name: string;
  description: string;
  type: string;
}

interface EntriesState {
  Purpose: FrontOfficeEntry[];
  'Complaint Type': FrontOfficeEntry[];
  Source: FrontOfficeEntry[];
  Reference: FrontOfficeEntry[];
}

interface RootState {
  frontOffice: {
    entries: EntriesState;
    loading: boolean;
    error: string | null;
  };
  user: {
    currentUser: { _id: string } | null;
  };
}

const TABS = ['Purpose', 'Complaint Type', 'Source', 'Reference'] as const;
type Tab = typeof TABS[number];

const itemsPerPageOptions: Option[] = [
  { value: '5', label: '5' },
  { value: '10', label: '10' },
  { value: '20', label: '20' },
  { value: '30', label: '30' },
];

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Styled Components
const Container = styled.div`
  display: flex;
  gap: clamp(1rem, 3vw, 1.5rem);
  padding: clamp(1rem, 3vw, 1.5rem);
  font-family: 'Roboto', sans-serif;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
  box-sizing: border-box;
  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

const Sidebar = styled.div`
  width: 200px;
  background: #fff;
  padding: clamp(1rem, 3vw, 1.5rem);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  @media (max-width: 900px) {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    padding: clamp(0.8rem, 2.5vw, 1rem);
  }
`;

const MenuItem = styled.p<{ active?: boolean }>`
  font-weight: ${(props) => (props.active ? 'bold' : 'normal')};
  color: ${(props) => (props.active ? '#3498db' : '#2c3e50')};
  cursor: pointer;
  padding: 0.5rem;
  margin: 0;
  font-size: clamp(0.9rem, 3vw, 1rem);
  transition: color 0.2s;
  &:hover {
    color: #3498db;
  }
  @media (max-width: 900px) {
    flex: 1;
    text-align: center;
    padding: 0.4rem;
    font-size: clamp(0.8rem, 2.5vw, 0.9rem);
  }
`;

const FormContainer = styled.div`
  flex: 1;
  background: #fff;
  padding: clamp(1rem, 3vw, 1.5rem);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  display: grid;
  grid-template-columns: 1fr;
  gap: clamp(0.8rem, 2vw, 1rem);
`;

const ListContainer = styled.div`
  flex: 2;
  background: #fff;
  padding: clamp(1rem, 3vw, 1.5rem);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
`;

const Heading = styled.h2`
  font-size: clamp(1.4rem, 4vw, 1.6rem);
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: clamp(0.8rem, 2vw, 1rem);
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
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
  transition: border-color 0.2s;
  width: 100%;
  box-sizing: border-box;
  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
  }
`;

const Textarea = styled.textarea`
  padding: 0.6rem;
  border: 1px solid #bdc3c7;
  border-radius: 6px;
  font-size: clamp(0.85rem, 3vw, 0.95rem);
  resize: vertical;
  min-height: 80px;
  transition: border-color 0.2s;
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
`;

const SearchInput = styled(Input)`
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
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  @media (max-width: 768px) {
    max-width: 150px;
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

const ItemsPerPageSelect = styled(Select)`
  width: 140px;
  @media (max-width: 600px) {
    width: 100%;
  }
`;

const FrontOffice: React.FC = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.user || {});
  const { entries = {}, loading, error } = useSelector((state: RootState) => state.frontOffice || {});
  const adminID = currentUser?._id;

  const [activeTab, setActiveTab] = useState<Tab>('Purpose');
  const [newEntry, setNewEntry] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    if (adminID) {
      dispatch(fetchEntries(adminID, activeTab));
    } else {
      toast.error('Please log in to view entries', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  }, [activeTab, adminID, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  }, [error]);

  const handleAddOrEdit = () => {
    if (!newEntry.trim()) {
      toast.error('Entry name is required', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    const entryData = { name: newEntry, description, type: activeTab };

    if (editingId) {
      dispatch(updateEntry(editingId, entryData, adminID));
      toast.warn('Entry updated successfully', {
        position: 'top-right',
        autoClose: 3000,
      });
    } else {
      dispatch(addEntry(entryData, adminID));
      toast.success('Entry added successfully', {
        position: 'top-right',
        autoClose: 3000,
      });
    }

    setNewEntry('');
    setDescription('');
    setEditingId(null);
    setCurrentPage(0); // Reset to first page on form submission
  };

  const handleDelete = (id: string) => {
    dispatch(deleteEntry(id, adminID, activeTab));
    toast.error('Entry deleted successfully', {
        position: 'top-right',
        autoClose: 3000,
      });
  };

  const handleEdit = (item: FrontOfficeEntry) => {
    setNewEntry(item.name);
    setDescription(item.description);
    setEditingId(item._id);
  };

  const handleItemsPerPageChange = (newValue: OnChangeValue<Option, false>) => {
    setItemsPerPage(newValue ? Number(newValue.value) : 5);
    setCurrentPage(0);
  };

  const filteredEntries = (entries[activeTab] || []).filter((item: FrontOfficeEntry) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const pageCount = Math.ceil(filteredEntries.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentPageData = filteredEntries.slice(offset, offset + itemsPerPage);

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
        <Sidebar>
          {TABS.map((tab) => (
            <MenuItem
              key={tab}
              active={activeTab === tab}
              onClick={() => {
                setActiveTab(tab);
                setCurrentPage(0); // Reset pagination on tab change
              }}
            >
              {tab}
            </MenuItem>
          ))}
        </Sidebar>
        <FormContainer>
          <Heading>Add {activeTab}</Heading>
          <FormGroup>
            <Label htmlFor="entry-name">{activeTab} *</Label>
            <Input
              id="entry-name"
              type="text"
              value={newEntry}
              onChange={(e) => setNewEntry(e.target.value)}
              aria-label={`${activeTab} Name`}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              aria-label="Description"
            />
          </FormGroup>
          <Button onClick={handleAddOrEdit} aria-label={editingId ? 'Update Entry' : 'Save Entry'}>
            {editingId ? 'Update' : 'Save'}
          </Button>
        </FormContainer>
        <ListContainer>
          <Heading>{activeTab} List</Heading>
          <FormGroup>
            <Label htmlFor="search">Search</Label>
            <SearchInput
              id="search"
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(0); // Reset pagination on search
              }}
              aria-label="Search Entries"
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="items-per-page">Items per page</Label>
            <ItemsPerPageSelect
              id="items-per-page"
              options={itemsPerPageOptions}
              value={itemsPerPageOptions.find((opt) => opt.value === itemsPerPage.toString()) || null}
              onChange={handleItemsPerPageChange}
              placeholder="Items per page"
              isClearable={false}
              isSearchable={false}
              aria-label="Items per page"
              styles={{
                control: (base) => ({
                  ...base,
                  borderRadius: '6px',
                  padding: '0.2rem',
                  boxShadow: 'none',
                  '&:hover': { borderColor: '#3498db' },
                  minWidth: '100%',
                  fontSize: 'clamp(0.8rem, 3vw, 0.9rem)',
                }),
                menu: (base) => ({
                  ...base,
                  borderRadius: '6px',
                  marginTop: '4px',
                  zIndex: 1000,
                  fontSize: 'clamp(0.8rem, 3vw, 0.9rem)',
                }),
              }}
            />
          </FormGroup>
          {loading ? (
            <div style={{ textAlign: 'center', fontSize: 'clamp(0.9rem, 3vw, 1rem)', color: '#2c3e50' }}>
              Loading...
            </div>
          ) : currentPageData.length === 0 ? (
            <div style={{ textAlign: 'center', fontSize: 'clamp(0.9rem, 3vw, 1rem)', color: '#e74c3c' }}>
              No entries available
            </div>
          ) : (
            <TableWrapper>
              <Table>
                <thead>
                  <tr>
                    <Th>{activeTab}</Th>
                    <Th>Description</Th>
                    <Th>Action</Th>
                  </tr>
                </thead>
                <tbody>
                  {currentPageData.map((item: FrontOfficeEntry) => (
                    <tr key={item._id}>
                      <Td>{item.name}</Td>
                      <Td>{item.description}</Td>
                      <Td>
                        <ActionButton
                          onClick={() => handleEdit(item)}
                          aria-label={`Edit ${item.name}`}
                          style={{ color: '#3498db' }}
                        >
                          📝
                        </ActionButton>
                        <ActionButton
                          onClick={() => handleDelete(item._id)}
                          aria-label={`Delete ${item.name}`}
                          style={{ color: '#e74c3c' }}
                        >
                          ❌
                        </ActionButton>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <PaginationContainer>
                <RecordCount>
                  Records: {currentPageData.length} of {filteredEntries.length}
                </RecordCount>
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
        </ListContainer>
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

export default FrontOffice;
