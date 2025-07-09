import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select, { OnChangeValue } from 'react-select';
import * as XLSX from 'xlsx';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactPaginate from 'react-paginate';
import {
  fetchAllStudents,
  bulkDeleteStudents,
} from '../../redux/StudentAddmissionDetail/bulkDeleteHandle';
import {
  setSelectedStudents,
  setVisibleColumns,
  resetBulkDelete,
} from '../../redux/StudentAddmissionDetail/bulkDeleteSlice';
import { getAllFclasses } from '../../redux/fclass/fclassHandle';
import { RootState, AppDispatch } from '../../redux/store';

interface Option {
  value: string;
  label: string;
}

const searchBarStyle = {
  padding: '10px',
  width: '250px',
  borderRadius: '5px',
  border: '1px solid #ddd',
  fontSize: '14px',
  fontFamily: 'Arial, sans-serif',
};

const buttonStyle = {
  padding: '8px 14px',
  margin: '5px',
  borderRadius: 5,
  cursor: 'pointer',
  backgroundColor: '#3498db',
  color: 'white',
  border: 'none',
  fontSize: '14px',
  fontFamily: 'Arial, sans-serif',
  minWidth: '44px',
  minHeight: '44px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  borderRadius: '10px',
  overflow: 'hidden',
  fontFamily: 'Arial, sans-serif',
};

const headerRowStyle = {
  backgroundColor: '#f5f5f5',
  fontWeight: 'bold',
  textAlign: 'center',
  padding: '10px',
};

const cellStyle = {
  padding: '10px',
  border: '1px solid #ddd',
  textAlign: 'center',
  fontSize: '14px',
};

const emptyCellStyle = {
  backgroundColor: '#f8f9fa',
  color: '#999',
  textAlign: 'center',
  padding: '10px',
  border: '1px solid #ddd',
  fontSize: '14px',
};

const rowStyle = {
  backgroundColor: '#fff',
  borderBottom: '1px solid #ddd',
  padding: '10px',
  textAlign: 'center',
};

const selectStyles = {
  control: (base: any) => ({
    ...base,
    padding: '6px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    fontSize: '14px',
    fontFamily: 'Arial, sans-serif',
    boxShadow: 'none',
    '&:hover': { borderColor: '#3498db' },
  }),
  menu: (base: any) => ({
    ...base,
    borderRadius: '5px',
    marginTop: '4px',
    zIndex: 1000,
    fontSize: '14px',
    fontFamily: 'Arial, sans-serif',
  }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isSelected ? '#3498db' : state.isFocused ? '#e0e0e0' : 'white',
    color: state.isSelected ? 'white' : '#2c3e50',
    padding: '8px',
    cursor: 'pointer',
  }),
};

const BulkDeleteStudents: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { students, selectedStudents, visibleColumns, loading, error, status } = useSelector(
    (state: RootState) => state.bulkDelete
  );
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
      dispatch(fetchAllStudents(adminID));
      dispatch(getAllFclasses(adminID));
    } else {
      toast.error('Please log in to view students', { position: 'top-right', autoClose: 3000 });
    }
    return () => {
      dispatch(resetBulkDelete());
    };
  }, [dispatch, adminID]);

  useEffect(() => {
    if (error) {
      toast.error(error, { position: 'top-right', autoClose: 3000 });
    }
  }, [error]);

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
      toast.error('Please log in to view students', { position: 'top-right', autoClose: 3000 });
      return;
    }
    dispatch(fetchAllStudents(adminID, searchParams));
    setCurrentPage(0); // Reset to first page on new search
  };

  const handleReset = () => {
    setSearchParams({ admissionNo: '', name: '', classId: '', section: '' });
    dispatch(fetchAllStudents(adminID, {})); // Fetch all students
    setCurrentPage(0); // Reset pagination
  };

  const handleSelect = (id: string) => {
    dispatch(
      setSelectedStudents(
        selectedStudents.includes(id)
          ? selectedStudents.filter((sid) => sid !== id)
          : [...selectedStudents, id]
      )
    );
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSelectedStudents(e.target.checked ? filteredStudents.map((s) => s.id) : []));
  };

  const handleDeleteSelected = () => {
    if (selectedStudents.length === 0) {
      toast.warn('No students selected for deletion.', { position: 'top-right', autoClose: 3000 });
      return;
    }
    if (window.confirm(`Are you sure you want to delete ${selectedStudents.length} student(s)?`)) {
      dispatch(bulkDeleteStudents(adminID, selectedStudents)).then(() => {
        toast.success('Students deleted successfully', { position: 'top-right', autoClose: 3000 });
      });
    }
  };

  const exportToCSV = () => {
    const csvData = currentPageData.map((student) => ({
      'Admission No': student.admissionNo,
      Name: student.name,
      Class: student.class,
      Section: student.section || 'N/A',
      Gender: student.gender,
      'Date of Birth': student.dob,
    }));
    const worksheet = XLSX.utils.json_to_sheet(csvData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');
    XLSX.writeFile(workbook, 'Students_Data.xlsx');
  };

  const classOptions: Option[] = fclassesList.map((cls) => ({ value: cls._id, label: cls.name }));
  const sectionOptions: Option[] = fclassesList
    .find((cls) => cls._id === searchParams.classId)
    ?.sections.map((sec) => ({ value: sec, label: sec })) || [];

  const filteredStudents = students.filter((student) =>
    Object.values({
      admissionNo: student.admissionNo,
      name: student.name,
      class: student.class,
      section: student.section || 'N/A',
      gender: student.gender,
      dob: student.dob,
    }).some((value) => value.toString().toLowerCase().includes(searchParams.name.toLowerCase()))
  );

  const pageCount = Math.ceil(filteredStudents.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentPageData = filteredStudents.slice(offset, offset + itemsPerPage);

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(0);
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Arial:wght@400;500;700&display=swap"
        rel="stylesheet"
      />
      <div
        style={{
          padding: '25px',
          maxWidth: '950px',
          margin: 'auto',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <ToastContainer
          position="top-right"
          autoClose={3000}
          toastStyle={{
            borderRadius: '8px',
            fontFamily: 'Arial, sans-serif',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            fontSize: '14px',
          }}
        />
        <h2
          style={{
            fontSize: '24px',
            fontWeight: 'bold',
            textAlign: 'center',
            padding: '15px',
            background: 'linear-gradient(90deg, #4CAF50, #2196F3)',
            color: 'white',
            borderRadius: '8px',
            marginBottom: '20px',
            boxShadow: '0px 4px 6px rgba(0,0,0,0.2)',
          }}
        >
          Bulk Delete Students
        </h2>

        {loading && (
          <div style={{ textAlign: 'center', fontSize: '14px', color: '#34495e' }}>
            Loading...
          </div>
        )}

        {error && (
          <div
            style={{
              color: '#e74c3c',
              textAlign: 'center',
              marginBottom: '15px',
              fontSize: '14px',
            }}
          >
            {error}
          </div>
        )}

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '15px',
          }}
        >
          <div
            style={{
              background: 'white',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              maxWidth: '600px',
              width: '100%',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '15px',
              }}
            >
              <div>
                <label
                  htmlFor="admission-no"
                  style={{ fontSize: '14px', fontWeight: '500', marginBottom: '5px', display: 'block' }}
                >
                  Admission No
                </label>
                <input
                  id="admission-no"
                  name="admissionNo"
                  value={searchParams.admissionNo}
                  onChange={handleInputChange}
                  placeholder="Search by Admission No"
                  style={searchBarStyle}
                  aria-label="Search by Admission Number"
                />
              </div>
              <div>
                <label
                  htmlFor="name"
                  style={{ fontSize: '14px', fontWeight: '500', marginBottom: '5px', display: 'block' }}
                >
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  value={searchParams.name}
                  onChange={handleInputChange}
                  placeholder="Search by Name"
                  style={searchBarStyle}
                  aria-label="Search by Student Name"
                />
              </div>
              <div>
                <label
                  htmlFor="class-select"
                  style={{ fontSize: '14px', fontWeight: '500', marginBottom: '5px', display: 'block' }}
                >
                  Class
                </label>
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
              </div>
              <div>
                <label
                  htmlFor="section-select"
                  style={{ fontSize: '14px', fontWeight: '500', marginBottom: '5px', display: 'block' }}
                >
                  Section
                </label>
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
              </div>
              <div
                style={{
                  display: 'flex',
                  gap: '10px',
                  justifyContent: 'flex-start',
                }}
              >
                <button
                  onClick={handleSearch}
                  disabled={loading}
                  style={buttonStyle}
                  aria-label="Search Students"
                >
                  Search
                </button>
                <button
                  onClick={handleReset}
                  disabled={loading}
                  style={{ ...buttonStyle, backgroundColor: '#e74c3c' }}
                  aria-label="Reset Search"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
          <div>
            <button
              onClick={() => navigator.clipboard.writeText(JSON.stringify(currentPageData, null, 2))}
              style={buttonStyle}
            >
              📋 Copy
            </button>
            <button onClick={exportToCSV} style={buttonStyle}>
              📊 Excel
            </button>
            <button
              onClick={() => alert('CSV Export Coming Soon!')}
              style={buttonStyle}
            >
              📄 CSV
            </button>
            <button onClick={() => window.print()} style={buttonStyle}>
              🖨️ Print
            </button>
            <button
              onClick={handleDeleteSelected}
              style={{ ...buttonStyle, backgroundColor: '#e74c3c' }}
              aria-label="Delete Selected Students"
            >
              🗑️ Delete Selected
            </button>
          </div>
        </div>

        <div style={{ marginBottom: '10px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {Object.keys(visibleColumns).map((col) => (
            <label key={col} style={{ fontSize: '14px', display: 'flex', alignItems: 'center' }}>
              <input
                type="checkbox"
                checked={visibleColumns[col as keyof typeof visibleColumns]}
                onChange={() =>
                  dispatch(
                    setVisibleColumns({
                      ...visibleColumns,
                      [col]: !visibleColumns[col as keyof typeof visibleColumns],
                    })
                  )
                }
                style={{ marginRight: '5px' }}
              />
              {col.charAt(0).toUpperCase() + col.slice(1)}
            </label>
          ))}
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={tableStyle}>
            <thead>
              <tr style={headerRowStyle}>
                <th style={cellStyle}>
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0}
                    aria-label="Select All Students"
                  />
                </th>
                {visibleColumns.admissionNo && <th style={cellStyle}>Admission No</th>}
                {visibleColumns.name && <th style={cellStyle}>Student Name</th>}
                {visibleColumns.class && <th style={cellStyle}>Class</th>}
                {visibleColumns.section && <th style={cellStyle}>Section</th>}
                {visibleColumns.gender && <th style={cellStyle}>Gender</th>}
                {visibleColumns.dob && <th style={cellStyle}>Date of Birth</th>}
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                currentPageData.map((student) => (
                  <tr key={student.id} style={rowStyle}>
                    <td style={cellStyle}>
                      <input
                        type="checkbox"
                        checked={selectedStudents.includes(student.id)}
                        onChange={() => handleSelect(student.id)}
                        aria-label={`Select student ${student.name}`}
                      />
                    </td>
                    {visibleColumns.admissionNo && <td style={cellStyle}>{student.admissionNo}</td>}
                    {visibleColumns.name && <td style={cellStyle}>{student.name}</td>}
                    {visibleColumns.class && <td style={cellStyle}>{student.class}</td>}
                    {visibleColumns.section && <td style={cellStyle}>{student.section || 'N/A'}</td>}
                    {visibleColumns.gender && <td style={cellStyle}>{student.gender}</td>}
                    {visibleColumns.dob && <td style={cellStyle}>{student.dob}</td>}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} style={emptyCellStyle}>
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '20px',
            gap: '10px',
          }}
        >
          <div style={{ fontSize: '14px', color: '#2c3e50' }}>
            Records: {currentPageData.length} of {filteredStudents.length}
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <label htmlFor="items-per-page" style={{ fontSize: '14px' }}>
              Items per page
            </label>
            <select
              id="items-per-page"
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(e.target.value)}
              style={{
                padding: '8px',
                borderRadius: '5px',
                border: '1px solid #ddd',
                fontSize: '14px',
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
        </div>
      </div>
      <style jsx global>{`
        .Toastify__toast--success {
          background: linear-gradient(90deg, #4CAF50, #2196F3);
          color: #fff;
          font-family: 'Arial, sans-serif';
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          font-size: 14px;
        }
        .Toastify__toast--error {
          background: linear-gradient(135deg, #e74c3c, #c0392b);
          color: #fff;
          font-family: 'Arial, sans-serif';
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          font-size: 14px;
        }
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
          color: #2c3e50;
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
          background: linear-gradient(90deg, #4CAF50, #2196F3);
          color: white;
          border-color: #2196F3;
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
    </>
  );
};

export default BulkDeleteStudents;