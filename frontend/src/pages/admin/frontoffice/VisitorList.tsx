
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactPaginate from 'react-paginate';
import {
  fetchVisitors,
  addVisitor,
  updateVisitor,
  deleteVisitor,
  clearError,
} from '../../../redux/FrontOffice/Enquiry/VisitorActions';

interface Visitor {
  _id: string;
  visitorName: string;
  meetingWith: string;
  purpose: string;
  phone: string;
  idCard: string;
  numOfPerson: number;
  date: string;
  inTime: string;
  outTime: string;
}

interface RootState {
  visitor: {
    visitors: Visitor[];
    loading: boolean;
    error: string | null;
  };
  user: {
    currentUser: { _id: string } | null;
  };
}

const VisitorList: React.FC = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.user || {});
  const { visitors, loading, error } = useSelector((state: RootState) => state.visitor || {});
  const adminID = currentUser?._id;

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null);
  const [editingVisitor, setEditingVisitor] = useState<Visitor | null>(null);
  const [newVisitor, setNewVisitor] = useState<Visitor | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Refs for input fields
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (adminID) {
      dispatch(fetchVisitors(adminID));
    } else {
      toast.error('Please log in to view visitors', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  }, [adminID, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: 'top-right',
        autoClose: 3000,
        onClose: () => dispatch(clearError()),
      });
    }
  }, [error, dispatch]);

  const validateVisitor = (visitor: Visitor | null): string | null => {
    if (!visitor) return 'No visitor data';
    if (!visitor.visitorName.trim()) return 'Visitor name is required';
    if (!visitor.meetingWith.trim()) return 'Meeting with is required';
    if (!visitor.purpose.trim()) return 'Purpose is required';
    if (!visitor.phone.trim()) return 'Phone number is required';
    if (!visitor.idCard.trim()) return 'ID card number is required';
    if (visitor.numOfPerson < 1) return 'Number of persons must be at least 1';
    if (!visitor.date) return 'Date is required';
    if (!visitor.inTime) return 'In time is required';
    if (!visitor.outTime) return 'Out time is required';
    return null;
  };

  const deleteVisitorHandler = (id: string) => {
    dispatch(deleteVisitor(id, adminID));
    toast.error('Visitor deleted successfully', {
      position: 'top-right',
      autoClose: 3000,
    });
  };

  const viewVisitor = (visitor: Visitor) => {
    setSelectedVisitor(visitor);
    setEditingVisitor(null);
    setNewVisitor(null);
    setShowForm(false);
  };

  const editVisitor = (visitor: Visitor) => {
    setEditingVisitor({ ...visitor });
    setSelectedVisitor(null);
    setNewVisitor(null);
    setShowForm(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editingVisitor) {
      setEditingVisitor((prev) => ({
        ...prev!,
        [name]: name === 'numOfPerson' ? parseInt(value) || 1 : value,
      }));
    } else if (newVisitor) {
      setNewVisitor((prev) => ({
        ...prev!,
        [name]: name === 'numOfPerson' ? parseInt(value) || 1 : value,
      }));
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
    isEditForm: boolean
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const fields = [
        'visitorName',
        'meetingWith',
        'purpose',
        'phone',
        'idCard',
        'numOfPerson',
        'date',
        'inTime',
        'outTime',
      ];
      if (index < fields.length - 1) {
        const nextInput = inputRefs.current[index + 1];
        if (nextInput) {
          nextInput.focus();
        }
      } else {
        if (isEditForm) {
          saveEditedVisitor();
        } else {
          saveNewVisitor();
        }
      }
    }
  };

  const saveEditedVisitor = () => {
    const validationError = validateVisitor(editingVisitor);
    if (validationError) {
      toast.error(validationError, {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }
    dispatch(updateVisitor(editingVisitor!._id, editingVisitor!, adminID));
    toast.warn('Visitor updated successfully', {
      position: 'top-right',
      autoClose: 3000,
    });
    setEditingVisitor(null);
    setShowForm(false);
  };

  const addNewVisitor = () => {
    setNewVisitor({
      _id: '',
      visitorName: '',
      meetingWith: '',
      purpose: '',
      phone: '',
      idCard: '',
      numOfPerson: 1,
      date: '',
      inTime: '',
      outTime: '',
    });
    setEditingVisitor(null);
    setSelectedVisitor(null);
    setShowForm(true);
  };

  const saveNewVisitor = () => {
    const validationError = validateVisitor(newVisitor);
    if (validationError) {
      toast.error(validationError, {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }
    dispatch(addVisitor(newVisitor!, adminID));
    toast.success('Visitor added successfully', {
      position: 'top-right',
      autoClose: 3000,
    });
    setNewVisitor(null);
    setShowForm(false);
  };

  const cancelEdit = () => {
    setEditingVisitor(null);
    setShowForm(false);
  };

  const cancelNewVisitor = () => {
    setNewVisitor(null);
    setShowForm(false);
  };

  const backToList = () => setSelectedVisitor(null);

  const filteredVisitors = visitors.filter((visitor) =>
    visitor.visitorName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pageCount = Math.ceil(filteredVisitors.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentPageData = filteredVisitors.slice(offset, offset + itemsPerPage);

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(0);
  };

  const renderFormFields = (visitor: Visitor, isEditForm: boolean) => {
    const fields = [
      { name: 'visitorName', label: 'Visitor Name *', type: 'text' },
      { name: 'meetingWith', label: 'Meeting With *', type: 'text' },
      { name: 'purpose', label: 'Purpose *', type: 'text' },
      { name: 'phone', label: 'Phone Number *', type: 'text' },
      { name: 'idCard', label: 'ID Card Number *', type: 'text' },
      { name: 'numOfPerson', label: 'Number of Persons *', type: 'number', min: 1 },
      { name: 'date', label: 'Date *', type: 'date' },
      { name: 'inTime', label: 'In Time *', type: 'time' },
      { name: 'outTime', label: 'Out Time *', type: 'time' },
    ];

    return fields.map((field, index) => (
      <div key={field.name} style={styles.formField}>
        <label style={styles.label}>{field.label}</label>
        <input
          type={field.type}
          name={field.name}
          value={visitor[field.name as keyof Visitor]}
          onChange={handleInputChange}
          onKeyDown={(e) => handleKeyDown(e, index, isEditForm)}
          placeholder={field.label.replace(' *', '')}
          style={styles.input}
          min={field.min}
          ref={(el) => (inputRefs.current[index] = el)}
        />
      </div>
    ));
  };

  return (
    <div style={styles.container}>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <h2 style={styles.heading}>Visitor List</h2>
      <div style={styles.filterContainer}>
        <input
          type="text"
          placeholder="Search by Visitor Name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={styles.input}
        />
        <select
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
          style={styles.select}
        >
          {[5, 10, 20, 30].map((n) => (
            <option key={n} value={n}>{n} / page</option>
          ))}
        </select>
        <button onClick={addNewVisitor} style={styles.addButton}>
          ➕ Add Visitor
        </button>
      </div>
      {loading && <div style={styles.loading}>Loading...</div>}
      {selectedVisitor ? (
        <div style={styles.detailsContainer}>
          <h3 style={styles.subHeading}>Visitor Details</h3>
          {Object.entries(selectedVisitor).map(([key, value]) => (
            key !== '_id' && (
              <p key={key} style={styles.detailItem}>
                <strong>{key.replace(/([A-Z])/g, ' $1').trim()}: </strong> {value}
              </p>
            )
          ))}
          <button onClick={backToList} style={styles.backButton}>← Back</button>
        </div>
      ) : (
        <div style={styles.tableContainer}>
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Visitor Name</th>
                  <th style={styles.th}>Meeting With</th>
                  <th style={styles.thPurpose}>Purpose</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentPageData.map((visitor) => (
                  <tr key={visitor._id} style={styles.tr}>
                    <td style={styles.td}>{visitor.visitorName}</td>
                    <td style={styles.td}>{visitor.meetingWith}</td>
                    <td style={styles.tdPurpose}>{visitor.purpose}</td>
                    <td style={styles.td}>
                      <button onClick={() => viewVisitor(visitor)} style={styles.viewButton}>👁 View</button>
                      <button onClick={() => editVisitor(visitor)} style={styles.editButton}>✏ Edit</button>
                      <button onClick={() => deleteVisitorHandler(visitor._id)} style={styles.deleteButton}>❌ Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={styles.paginationContainer}>
            <p style={styles.recordCount}>Records: {currentPageData.length} of {filteredVisitors.length}</p>
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
          </div>
        </div>
      )}
      {showForm && (editingVisitor || newVisitor) && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3 style={styles.subHeading}>{editingVisitor ? 'Edit Visitor' : 'Add Visitor'}</h3>
            {renderFormFields(editingVisitor || newVisitor!, !!editingVisitor)}
            <div style={styles.buttonGroup}>
              <button
                onClick={editingVisitor ? saveEditedVisitor : saveNewVisitor}
                style={styles.saveButton}
              >
                Save
              </button>
              <button
                onClick={editingVisitor ? cancelEdit : cancelNewVisitor}
                style={styles.cancelButton}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <style jsx>{`
        .pagination {
          display: flex;
          justify-content: center;
          list-style: none;
          padding: 0;
          margin: 1rem 0;
          flex-wrap: wrap;
        }
        .page {
          margin: 0 3px;
        }
        .page-link {
          padding: 6px 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
          cursor: pointer;
          background-color: #f9f9f9;
          color: #333;
          transition: all 0.2s ease;
          text-decoration: none;
          font-size: clamp(0.8rem, 2.5vw, 0.9rem);
        }
        .page-link:hover {
          background-color: #e0e0e0;
        }
        .active .page-link {
          background-color: #27ae60;
          color: white;
          border-color: #27ae60;
          font-weight: bold;
        }
        .Toastify__toast--success {
          background: linear-gradient(135deg, #28a745, #218838);
          color: #fff;
          font-family: Arial, sans-serif;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          font-size: clamp(0.8rem, 3vw, 0.9rem);
        }
        .Toastify__toast--error {
          background: linear-gradient(135deg, #dc3545, #c82333);
          color: #fff;
          font-family: Arial, sans-serif;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          font-size: clamp(0.8rem, 3vw, 0.9rem);
        }
        .Toastify__toast--warning {
          background: linear-gradient(135deg, #ffc107, #e0a800);
          color: #212529;
          font-family: Arial, sans-serif;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          font-size: clamp(0.8rem, 3vw, 0.9rem);
        }
        .Toastify__toast-body {
          padding: 8px;
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
          color: #212529;
        }
        .Toastify__toast--warning .Toastify__progress-bar {
          background: rgba(0, 0, 0, 0.3);
        }
        tr:hover {
          background-color: #f1f1f1;
        }
        @media (max-width: 600px) {
          .Toastify__toast {
            font-size: 0.8rem;
            margin: 5px;
            width: calc(100% - 10px);
          }
          .Toastify__toast-body {
            padding: 6px;
          }
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
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '90vw',
    margin: '20px auto',
    backgroundColor: '#e8c897',
    padding: 'clamp(15px, 2vw, 20px)',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgb(239, 176, 17)',
    fontFamily: 'Arial, sans-serif',
  },
  heading: {
    textAlign: 'center',
    color: '#333',
    fontSize: 'clamp(1.5rem, 5vw, 1.8rem)',
    marginBottom: '20px',
  },
  subHeading: {
    fontSize: 'clamp(1rem, 4vw, 1.2rem)',
    color: '#333',
    marginBottom: '15px',
  },
  input: {
    width: '100%',
    padding: '8px',
    marginBottom: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: 'clamp(0.8rem, 3vw, 0.9rem)',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
    color: '#333',
    fontSize: 'clamp(0.8rem, 3vw, 0.9rem)',
  },
  addButton: {
    padding: '8px 12px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: 'clamp(0.8rem, 3vw, 0.9rem)',
    minWidth: '44px',
    minHeight: '44px',
  },
  detailsContainer: {
    background: '#fff',
    padding: 'clamp(15px, 2vw, 20px)',
    borderRadius: '5px',
    boxShadow: '0 0 5px rgba(0,0,0,0.1)',
  },
  modal: {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1300,
    overflowY: 'auto',
  },
  modalContent: {
    background: '#fff',
    padding: 'clamp(15px, 4vw, 20px)',
    borderRadius: '8px',
    width: 'min(90vw, 500px)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  formField: {
    marginBottom: '15px',
  },
  detailItem: {
    margin: '5px 0',
    fontSize: 'clamp(0.8rem, 3vw, 0.9rem)',
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    marginTop: '15px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  saveButton: {
    backgroundColor: '#28a745',
    color: 'white',
    padding: '8px 12px',
    borderRadius: '5px',
    cursor: 'pointer',
    border: 'none',
    fontSize: 'clamp(0.8rem, 3vw, 0.9rem)',
    minWidth: '44px',
    minHeight: '44px',
  },
  cancelButton: {
    backgroundColor: '#dc3545',
    color: 'white',
    padding: '8px 12px',
    borderRadius: '5px',
    cursor: 'pointer',
    border: 'none',
    fontSize: 'clamp(0.8rem, 3vw, 0.9rem)',
    minWidth: '44px',
    minHeight: '44px',
  },
  backButton: {
    padding: '8px 12px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: 'clamp(0.8rem, 3vw, 0.9rem)',
    minWidth: '44px',
    minHeight: '44px',
  },
  tableContainer: {
    background: '#fff',
    borderRadius: '5px',
    boxShadow: '0 0 5px rgba(0,0,0,0.1)',
    padding: '10px',
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '600px',
  },
  th: {
    backgroundColor: '#f8f9fa',
    padding: 'clamp(8px, 2vw, 10px)',
    textAlign: 'left',
    fontWeight: 'bold',
    borderBottom: '1px solid #ddd',
    fontSize: 'clamp(0.8rem, 3vw, 0.9rem)',
  },
  td: {
    padding: 'clamp(8px, 2vw, 10px)',
    borderBottom: '1px solid #ddd',
    fontSize: 'clamp(0.8rem, 3vw, 0.9rem)',
  },
  thPurpose: {
    backgroundColor: '#f8f9fa',
    padding: 'clamp(8px, 2vw, 10px)',
    textAlign: 'left',
    fontWeight: 'bold',
    borderBottom: '1px solid #ddd',
    fontSize: 'clamp(0.8rem, 3vw, 0.9rem)',
    display: 'none',
  },
  tdPurpose: {
    padding: 'clamp(8px, 2vw, 10px)',
    borderBottom: '1px solid #ddd',
    fontSize: 'clamp(0.8rem, 3vw, 0.9rem)',
    display: 'none',
  },
  tr: {
    transition: 'background-color 0.2s',
  },
  viewButton: {
    margin: '0 3px',
    padding: '6px 10px',
    backgroundColor: '#17a2b8',
    color: 'white',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer',
    fontSize: 'clamp(0.7rem, 2.5vw, 0.8rem)',
    minWidth: '44px',
    minHeight: '44px',
  },
  editButton: {
    margin: '0 3px',
    padding: '6px 10px',
    backgroundColor: '#ffc107',
    color: '#212529',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer',
    fontSize: 'clamp(0.7rem, 2.5vw, 0.8rem)',
    minWidth: '44px',
    minHeight: '44px',
  },
  deleteButton: {
    margin: '0 3px',
    padding: '6px 10px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer',
    fontSize: 'clamp(0.7rem, 2.5vw, 0.8rem)',
    minWidth: '44px',
    minHeight: '44px',
  },
  loading: {
    textAlign: 'center',
    color: '#333',
    fontSize: 'clamp(0.9rem, 3vw, 1rem)',
    margin: '20px 0',
  },
  recordCount: {
    color: '#333',
    fontSize: 'clamp(0.8rem, 3vw, 0.9rem)',
    marginBottom: '10px',
  },
  filterContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  select: {
    padding: '8px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: 'clamp(0.8rem, 3vw, 0.9rem)',
    minWidth: '80px',
  },
  paginationContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '10px',
    gap: '10px',
  },
};

export default VisitorList;
