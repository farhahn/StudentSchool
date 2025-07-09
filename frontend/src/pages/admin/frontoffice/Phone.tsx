
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactPaginate from "react-paginate";
import {
  fetchCallLogs,
  addCallLog,
  updateCallLog,
  deleteCallLog,
} from "../../../redux/FrontOffice/Enquiry/phoneHandler";
import { RootState, AppDispatch } from "../../../redux/store";

interface CallLog {
  _id: string;
  name: string;
  phone: string;
  date: string;
  description: string;
  followUpDate: string;
  duration: string;
  note: string;
  callType: "Incoming" | "Outgoing";
  school: string;
}

const PhoneCallLogPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { callLogs = [], loading, error: reduxError } = useSelector((state: RootState) => state.phoneCallLogs || {});
  const { currentUser } = useSelector((state: RootState) => state.user || {});
  const adminID = currentUser?._id;

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
    followUpDate: "",
    duration: "",
    note: "",
    callType: "Incoming" as "Incoming" | "Outgoing",
  });
  const [filters, setFilters] = useState({
    name: "",
    phone: "",
    date: "",
  });
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Refs for form inputs
  const inputRefs = {
    name: useRef<HTMLInputElement>(null),
    phone: useRef<HTMLInputElement>(null),
    date: useRef<HTMLInputElement>(null),
    description: useRef<HTMLTextAreaElement>(null),
    followUpDate: useRef<HTMLInputElement>(null),
    duration: useRef<HTMLInputElement>(null),
    note: useRef<HTMLTextAreaElement>(null),
    callTypeIncoming: useRef<HTMLInputElement>(null),
    callTypeOutgoing: useRef<HTMLInputElement>(null),
  };

  useEffect(() => {
    if (adminID) {
      dispatch(fetchCallLogs(adminID));
    } else {
      setError("Please log in to view call logs");
      toast.error("Please log in to view call logs", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  }, [dispatch, adminID]);

  useEffect(() => {
    if (showForm && inputRefs.name.current) {
      inputRefs.name.current.focus();
    }
  }, [showForm]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, callType: e.target.value as "Incoming" | "Outgoing" });
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setCurrentPage(0); // Reset to first page on filter change
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(0);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
    nextField?: keyof typeof inputRefs
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (nextField && inputRefs[nextField].current) {
        inputRefs[nextField].current.focus();
      } else {
        handleSubmit(e as React.FormEvent);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminID) {
      setError("Please log in to submit call logs");
      toast.error("Please log in to submit call logs", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    // Validation
    if (!formData.name.trim()) {
      setError("Name is required");
      toast.error("Name is required", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const cleanedPhone = formData.phone.replace(/\D/g, "");
    if (!cleanedPhone) {
      setError("Phone number is required");
      toast.error("Phone number is required", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(cleanedPhone)) {
      setError("Please enter a valid 10-digit phone number");
      toast.error("Please enter a valid 10-digit phone number", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (!formData.date) {
      setError("Date is required");
      toast.error("Date is required", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    const isValidDate = (dateStr: string) => !isNaN(new Date(dateStr).getTime());
    if (!isValidDate(formData.date)) {
      setError("Invalid date format");
      toast.error("Invalid date format", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (!formData.followUpDate) {
      setError("Follow-up date is required");
      toast.error("Follow-up date is required", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    if (!isValidDate(formData.followUpDate)) {
      setError("Invalid follow-up date format");
      toast.error("Invalid follow-up date format", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (!formData.description.trim()) {
      setError("Description is required");
      toast.error("Description is required", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (!formData.duration.trim()) {
      setError("Duration is required");
      toast.error("Duration is required", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    const durationRegex = /^\d+\s*(min|sec)$/i;
    if (!durationRegex.test(formData.duration.trim())) {
      setError("Duration must be a number followed by 'min' or 'sec' (e.g., '5 min')");
      toast.error("Duration must be a number followed by 'min' or 'sec' (e.g., '5 min')", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (!formData.note.trim()) {
      setError("Note is required");
      toast.error("Note is required", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const payload = {
      name: formData.name.trim(),
      phone: cleanedPhone,
      date: new Date(formData.date).toISOString(),
      description: formData.description.trim(),
      followUpDate: new Date(formData.followUpDate).toISOString(),
      duration: formData.duration.trim(),
      note: formData.note.trim(),
      callType: formData.callType,
      adminID,
    };

    try {
      if (editingId) {
        await dispatch(updateCallLog({ id: editingId, log: payload, adminID }));
        toast.success("Call log updated successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
        setEditingId(null);
      } else {
        await dispatch(addCallLog(payload, adminID));
        toast.success("Call log added successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
      }

      setFormData({
        name: "",
        phone: "",
        date: new Date().toISOString().split("T")[0],
        description: "",
        followUpDate: "",
        duration: "",
        note: "",
        callType: "Incoming",
      });
      setShowForm(false);
      setError(null);
    } catch (err) {
      toast.error("Failed to save call log.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleEdit = (id: string) => {
    const callLog = callLogs.find((log: CallLog) => log._id === id);
    if (callLog) {
      setFormData({
        name: callLog.name || "",
        phone: callLog.phone || "",
        date: callLog.date ? new Date(callLog.date).toISOString().split("T")[0] : "",
        description: callLog.description || "",
        followUpDate: callLog.followUpDate ? new Date(callLog.followUpDate).toISOString().split("T")[0] : "",
        duration: callLog.duration || "",
        note: callLog.note || "",
        callType: callLog.callType || "Incoming",
      });
      setEditingId(id);
      setShowForm(true);
    }
  };

  const handleDelete = (id: string) => {
    dispatch(deleteCallLog(id, adminID));
    toast.success("Call log deleted successfully!", {
      position: "top-right",
      autoClose: 3000,
    });
  };

  const filteredCallLogs = callLogs.filter((log: CallLog) => {
    const matchesName = filters.name ? log.name.toLowerCase().includes(filters.name.toLowerCase()) : true;
    const matchesPhone = filters.phone ? log.phone.includes(filters.phone) : true;
    const matchesDate = filters.date ? new Date(log.date).toISOString().split("T")[0] === filters.date : true;
    return matchesName && matchesPhone && matchesDate;
  });

  const pageCount = Math.ceil(filteredCallLogs.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentPageData = filteredCallLogs.slice(offset, offset + itemsPerPage);

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
      <h2 style={styles.heading}>Phone Call Log Management</h2>

      {(error || reduxError) && <div style={styles.error}>{error || reduxError}</div>}

      <div style={styles.filterContainer}>
        <input
          type="text"
          name="name"
          placeholder="Filter by Name"
          value={filters.name}
          onChange={handleFilterChange}
          style={styles.input}
        />
        <input
          type="text"
          name="phone"
          placeholder="Filter by Phone"
          value={filters.phone}
          onChange={handleFilterChange}
          style={styles.input}
        />
        <label style={styles.label}>
          Date:
          <input
            type="date"
            name="date"
            value={filters.date}
            onChange={handleFilterChange}
            style={styles.input}
          />
        </label>
        <select
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
          style={styles.select}
        >
          {[5, 10, 20, 30].map((n) => (
            <option key={n} value={n}>{n} / page</option>
          ))}
        </select>
      </div>

      <div style={styles.headerContainer}>
        <h3 style={styles.subHeading}>Phone Call Log Details</h3>
        <button onClick={() => {
          setShowForm(true);
          setEditingId(null);
          setFormData({
            name: "",
            phone: "",
            date: new Date().toISOString().split("T")[0],
            description: "",
            followUpDate: "",
            duration: "",
            note: "",
            callType: "Incoming",
          });
        }} style={styles.addButton}>
          + Add
        </button>
      </div>

      {loading ? (
        <div style={styles.loading}>Loading...</div>
      ) : currentPageData.length === 0 ? (
        <div style={styles.noData}>No call logs available</div>
      ) : (
        <div style={styles.tableContainer}>
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Phone</th>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Follow Up</th>
                  <th style={styles.th}>Type</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentPageData.map((log: CallLog) => (
                  <tr key={log._id} style={styles.tr}>
                    <td style={styles.td}>{log.name}</td>
                    <td style={styles.td}>{log.phone}</td>
                    <td style={styles.td}>{new Date(log.date).toLocaleDateString()}</td>
                    <td style={styles.td}>{log.followUpDate ? new Date(log.followUpDate).toLocaleDateString() : "N/A"}</td>
                    <td style={styles.td}>{log.callType}</td>
                    <td style={styles.td}>
                      <button onClick={() => handleEdit(log._id)} style={styles.editButton}>📝</button>
                      <button onClick={() => handleDelete(log._id)} style={styles.deleteButton}>❌</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={styles.paginationContainer}>
            <p style={styles.recordCount}>Records: {currentPageData.length} of {filteredCallLogs.length}</p>
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

      {showForm && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3 style={styles.subHeading}>{editingId !== null ? "Edit Call Log" : "Add Call Log"}</h3>
            <form onSubmit={handleSubmit} style={styles.formContainer}>
              <div style={styles.formField}>
                <label style={styles.label}>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onKeyDown={(e) => handleKeyDown(e, "phone")}
                  ref={inputRefs.name}
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.formField}>
                <label style={styles.label}>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  onKeyDown={(e) => handleKeyDown(e, "date")}
                  ref={inputRefs.phone}
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.formField}>
                <label style={styles.label}>Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  onKeyDown={(e) => handleKeyDown(e, "description")}
                  ref={inputRefs.date}
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.formField}>
                <label style={styles.label}>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  onKeyDown={(e) => handleKeyDown(e, "followUpDate")}
                  ref={inputRefs.description}
                  style={styles.textarea}
                  required
                />
              </div>
              <div style={styles.formField}>
                <label style={styles.label}>Follow Up Date</label>
                <input
                  type="date"
                  name="followUpDate"
                  value={formData.followUpDate}
                  onChange={handleChange}
                  onKeyDown={(e) => handleKeyDown(e, "duration")}
                  ref={inputRefs.followUpDate}
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.formField}>
                <label style={styles.label}>Duration</label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  onKeyDown={(e) => handleKeyDown(e, "note")}
                  ref={inputRefs.duration}
                  placeholder="e.g., 5 min"
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.formField}>
                <label style={styles.label}>Note</label>
                <textarea
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  onKeyDown={(e) => handleKeyDown(e, "callTypeIncoming")}
                  ref={inputRefs.note}
                  style={styles.textarea}
                  required
                />
              </div>
              <div style={styles.formField}>
                <label style={styles.label}>Call Type</label>
                <div style={styles.radioGroup}>
                  <label style={styles.radioLabel}>
                    <input
                      type="radio"
                      name="callType"
                      value="Incoming"
                      checked={formData.callType === "Incoming"}
                      onChange={handleRadioChange}
                      onKeyDown={(e) => handleKeyDown(e, "callTypeOutgoing")}
                      ref={inputRefs.callTypeIncoming}
                    />
                    Incoming
                  </label>
                  <label style={styles.radioLabel}>
                    <input
                      type="radio"
                      name="callType"
                      value="Outgoing"
                      checked={formData.callType === "Outgoing"}
                      onChange={handleRadioChange}
                      onKeyDown={(e) => handleKeyDown(e)}
                      ref={inputRefs.callTypeOutgoing}
                    />
                    Outgoing
                  </label>
                </div>
              </div>
              <div style={styles.buttonGroup}>
                <button type="submit" style={styles.saveButton}>Save</button>
                <button type="button" onClick={() => setShowForm(false)} style={styles.cancelButton}>Cancel</button>
              </div>
            </form>
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
    minHeight: '100vh',
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
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: '20px',
    fontSize: 'clamp(0.8rem, 3vw, 0.9rem)',
  },
  input: {
    width: '100%',
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: 'clamp(0.8rem, 3vw, 0.9rem)',
  },
  textarea: {
    width: '100%',
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: 'clamp(0.8rem, 3vw, 0.9rem)',
    resize: 'vertical',
    minHeight: '80px',
  },
  select: {
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: 'clamp(0.8rem, 3vw, 0.9rem)',
    minWidth: '80px',
  },
  filterContainer: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  headerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
    flexWrap: 'wrap',
    gap: '10px',
  },
  addButton: {
    padding: '8px 12px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: 'clamp(0.8rem, 3vw, 0.9rem)',
    minWidth: '44px',
    minHeight: '44px',
  },
  tableContainer: {
    background: 'white',
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
    backgroundColor: '#007BFF',
    color: 'white',
    padding: 'clamp(8px, 2vw, 10px)',
    textAlign: 'center',
    fontWeight: 'bold',
    borderBottom: '1px solid #ddd',
    fontSize: 'clamp(0.8rem, 3vw, 0.9rem)',
  },
  td: {
    padding: 'clamp(8px, 2vw, 10px)',
    borderBottom: '1px solid #ddd',
    textAlign: 'center',
    fontSize: 'clamp(0.8rem, 3vw, 0.9rem)',
  },
  tr: {
    transition: 'background-color 0.2s',
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
  noData: {
    textAlign: 'center',
    color: 'red',
    fontSize: 'clamp(0.9rem, 3vw, 1rem)',
    margin: '20px 0',
  },
  recordCount: {
    color: '#333',
    fontSize: 'clamp(0.8rem, 3vw, 0.9rem)',
    marginBottom: '10px',
  },
  paginationContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '10px',
    gap: '10px',
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
    background: 'white',
    padding: 'clamp(15px, 4vw, 20px)',
    borderRadius: '8px',
    width: 'min(90vw, 500px)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  formField: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
    color: '#333',
    fontSize: 'clamp(0.8rem, 3vw, 0.9rem)',
  },
  radioGroup: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
  },
  radioLabel: {
    fontSize: 'clamp(0.8rem, 3vw, 0.9rem)',
    marginLeft: '5px',
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: '15px',
  },
  saveButton: {
    padding: '8px 12px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: 'clamp(0.8rem, 3vw, 0.9rem)',
    minWidth: '44px',
    minHeight: '44px',
  },
  cancelButton: {
    padding: '8px 12px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: 'clamp(0.8rem, 3vw, 0.9rem)',
    minWidth: '44px',
    minHeight: '44px',
  },
};

export default PhoneCallLogPage;
