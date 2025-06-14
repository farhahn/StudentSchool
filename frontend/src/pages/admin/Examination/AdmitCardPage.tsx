import React, { useState, useEffect } from 'react';

const AdmitCardPage = () => {
  // State for form inputs
  const [template, setTemplate] = useState('');
  const [heading, setHeading] = useState('');
  const [title, setTitle] = useState('');
  const [examName, setExamName] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [examCenter, setExamCenter] = useState('');
  const [footerText, setFooterText] = useState('');

  // State for admit card list
  const [admitCards, setAdmitCards] = useState([
    { 
      id: 1, 
      name: '', 
      backgroundImg: 'image.jpg', 
      active: true,
      template: '',
      heading: '',
      examName: '',
      schoolName: '',
      examCenter: '',
      footerText: ''
    }
  ]);

  // State for toggle switches
  const [toggles, setToggles] = useState({
    name: true,
    fatherName: false,
    motherName: false,
    dateOfBirth: false,
    admissionNo: true,
    rollNumber: true,
    address: false,
    gender: false,
    photo: false,
    class: true,
    section: true
  });

  // State for file uploads
  const [files, setFiles] = useState({
    leftLogo: null,
    rightLogo: null,
    sign: null,
    backgroundImage: null
  });

  // State for dropdown menu and editing
  const [openMenuId, setOpenMenuId] = useState(null);
  const [editingCard, setEditingCard] = useState(null);

  // Handle file upload
  const handleFileUpload = (field, acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setFiles(prev => ({
        ...prev,
        [field]: acceptedFiles[0]
      }));
    }
  };

  // File upload component
  const FileUpload = ({ field, onUpload }) => {
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === 'dragover') {
        setDragActive(true);
      } else if (e.type === 'dragleave') {
        setDragActive(false);
      }
    };

    const handleDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      const droppedFiles = e.dataTransfer.files;
      onUpload(field, droppedFiles);
    };

    return (
      <div
        style={{
          ...uploadBoxStyle,
          ...(dragActive ? dragActiveStyle : {}),
          position: 'relative'
        }}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        {files[field] ? files[field].name : 'Drag and drop or click to upload'}
        <input
          type="file"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: 0,
            cursor: 'pointer'
          }}
          onChange={(e) => onUpload(field, e.target.files)}
        />
      </div>
    );
  };

  // Handle toggle switch changes
  const handleToggle = (key) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingCard) {
      // Update existing card
      setAdmitCards(admitCards.map(card => 
        card.id === editingCard ? {
          ...card,
          name: title,
          template,
          heading,
          examName,
          schoolName,
          examCenter,
          footerText,
          backgroundImg: files.backgroundImage?.name || card.backgroundImg
        } : card
      ));
      setEditingCard(null);
    } else {
      // Add new card
      const newAdmitCard = {
        id: admitCards.length + 1,
        name: title || 'New Admit Card',
        template,
        heading,
        examName,
        schoolName,
        examCenter,
        footerText,
        backgroundImg: files.backgroundImage?.name || 'new-image.jpg',
        active: true
      };
      setAdmitCards([...admitCards, newAdmitCard]);
    }
    // Reset form
    setTemplate('');
    setHeading('');
    setTitle('');
    setExamName('');
    setSchoolName('');
    setExamCenter('');
    setFooterText('');
    setFiles({
      leftLogo: null,
      rightLogo: null,
      sign: null,
      backgroundImage: null
    });
  };

  // Handle delete action
  const handleDelete = (id) => {
    setAdmitCards(admitCards.filter(card => card.id !== id));
    setOpenMenuId(null);
  };

  // Handle edit action
  const handleEdit = (card) => {
    setEditingCard(card.id);
    setTemplate(card.template);
    setHeading(card.heading);
    setTitle(card.name);
    setExamName(card.examName);
    setSchoolName(card.schoolName);
    setExamCenter(card.examCenter);
    setFooterText(card.footerText);
    setOpenMenuId(null);
  };

  // Handle three-dot menu toggle
  const handleMenuToggle = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.action-menu')) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Table actions component
  const TableActions = ({ card }) => (
    <td style={tableCellStyle}>
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <button 
          style={actionButtonStyle}
          onClick={() => handleMenuToggle(card.id)}
          className="action-menu"
        >
          ⋮
        </button>
        {openMenuId === card.id && (
          <div style={dropdownMenuStyle}>
            <button 
              style={dropdownItemStyle}
              onClick={() => handleEdit(card)}
            >
              ✏️ Edit
            </button>
            <button 
              style={dropdownItemStyle}
              onClick={() => handleDelete(card.id)}
            >
              ❌ Delete
            </button>
          </div>
        )}
      </div>
    </td>
  );

  return (
    <div style={containerStyle}>
      {/* Side-by-Side Sections */}
      <div style={sideBySideContainerStyle}>
        {/* Add/Edit Admit Card Section */}
        <div id="form-section" style={sideSectionStyle}>
          <h2 style={headingStyle}>
            {editingCard ? 'Edit Admit Card' : 'Add Admit Card'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div style={formGroupStyle}>
              <label style={labelStyle}>
                Template <span style={requiredStyle}>*</span>
              </label>
              <input
                type="text"
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
                style={inputStyle}
                placeholder="Enter template"
                required
              />
            </div>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Heading</label>
              <input
                type="text"
                value={heading}
                onChange={(e) => setHeading(e.target.value)}
                style={inputStyle}
                placeholder="Enter heading"
              />
            </div>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={inputStyle}
                placeholder="Enter title"
              />
            </div>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Exam Name</label>
              <input
                type="text"
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
                style={inputStyle}
                placeholder="Enter exam name"
              />
            </div>
            <div style={formGroupStyle}>
              <label style={labelStyle}>School Name</label>
              <input
                type="text"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                style={inputStyle}
                placeholder="Enter school name"
              />
            </div>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Exam Center</label>
              <input
                type="text"
                value={examCenter}
                onChange={(e) => setExamCenter(e.target.value)}
                style={inputStyle}
                placeholder="Enter exam center"
              />
            </div>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Footer Text</label>
              <input
                type="text"
                value={footerText}
                onChange={(e) => setFooterText(e.target.value)}
                style={inputStyle}
                placeholder="Enter footer text"
              />
            </div>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Left Logo</label>
              <FileUpload
                field="leftLogo"
                onUpload={handleFileUpload}
              />
            </div>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Right Logo</label>
              <FileUpload
                field="rightLogo"
                onUpload={handleFileUpload}
              />
            </div>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Sign</label>
              <FileUpload
                field="sign"
                onUpload={handleFileUpload}
              />
            </div>
          </form>
        </div>

        {/* Background Image Section */}
        <div style={sideSectionStyle}>
          <h2 style={headingStyle}>Background Image</h2>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Background Image</label>
            <FileUpload
              field="backgroundImage"
              onUpload={handleFileUpload}
            />
          </div>
          <div style={toggleContainerStyle}>
            {Object.keys(toggles).map(key => (
              <div key={key} style={toggleRowStyle}>
                <span style={toggleLabelStyle}>
                  {key.split(/(?=[A-Z])/).join(' ').replace(/\b\w/g, char => char.toUpperCase())}
                </span>
                <label style={switchStyle}>
                  <input
                    type="checkbox"
                    checked={toggles[key]}
                    onChange={() => handleToggle(key)}
                    style={{ display: 'none' }}
                  />
                  <span style={toggles[key] ? sliderOnStyle : sliderOffStyle}></span>
                </label>
              </div>
            ))}
          </div>
          <div style={buttonContainerStyle}>
            <button style={saveButtonStyle} type="submit">
              {editingCard ? 'Update' : 'Save'}
            </button>
          </div>
        </div>
      </div>

      {/* Admit Card List Section */}
      <div style={sectionStyle}>
        <h2 style={headingStyle}>Admit Card List</h2>
        <div style={tableWrapperStyle}>
          <table style={tableStyle}>
            <thead>
              <tr style={tableHeaderRowStyle}>
                <th style={tableHeaderStyle}>Certificate Name</th>
                <th style={tableHeaderStyle}>Background IMG</th>
                <th style={tableHeaderStyle}>Active</th>
                <th style={tableHeaderStyle}>Action</th>
              </tr>
            </thead>
            <tbody>
              {admitCards.map(card => (
                <tr key={card.id} style={tableRowStyle}>
                  <td style={tableCellStyle}>{card.name}</td>
                  <td style={tableCellStyle}>{card.backgroundImg}</td>
                  <td style={tableCellStyle}>
                    <span style={card.active ? activeDotStyle : inactiveDotStyle}></span>
                  </td>
                  <TableActions card={card} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={paginationStyle}>
          Records: 1 to {admitCards.length} of {admitCards.length}
        </div>
      </div>
    </div>
  );
};

// Styles
const containerStyle = {
  padding: '2rem',
  backgroundColor: "#e8c897",
  minHeight: '100vh',
  maxWidth: '1200px',
  margin: '0 auto',
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
};

const sideBySideContainerStyle = {
  display: 'flex',
  gap: '2rem',
  flexWrap: 'wrap',
  marginBottom: '2rem'
};

const sideSectionStyle = {
  flex: '1',
  background: 'white',
  borderRadius: '8px',
  padding: '1.5rem',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  minWidth: '300px'
};

const sectionStyle = {
  background: 'white',
  borderRadius: '8px',
  padding: '1.5rem',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
};

const headingStyle = {
  color: '#333',
  fontSize: '1.5rem',
  marginBottom: '1rem',
  fontWeight: '600'
};

const formGroupStyle = {
  marginBottom: '1rem'
};

const labelStyle = {
  display: 'block',
  fontSize: '1rem',
  color: '#333',
  fontWeight: '500',
  marginBottom: '0.5rem'
};

const requiredStyle = {
  color: 'red'
};

const inputStyle = {
  width: '100%',
  padding: '0.5rem',
  borderRadius: '4px',
  border: '1px solid #ccc',
  fontSize: '1rem',
  outline: 'none'
};

const uploadBoxStyle = {
  border: '1px dashed #ccc',
  padding: '1rem',
  textAlign: 'center',
  color: '#666',
  fontSize: '0.9rem',
  borderRadius: '4px',
  minHeight: '80px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.3s ease'
};

const dragActiveStyle = {
  borderColor: '#007bff',
  backgroundColor: 'rgba(0, 123, 255, 0.1)'
};

const toggleContainerStyle = {
  marginTop: '1rem'
};

const toggleRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0.5rem 0',
  borderBottom: '1px solid #eee'
};

const toggleLabelStyle = {
  fontSize: '1rem',
  color: '#333'
};

const switchStyle = {
  position: 'relative',
  display: 'inline-block',
  width: '40px',
  height: '20px'
};

const sliderOnStyle = {
  position: 'absolute',
  cursor: 'pointer',
  top: '0',
  left: '0',
  right: '0',
  bottom: '0',
  background: '#007bff',
  borderRadius: '20px',
  transition: '0.4s',
  ':before': {
    position: 'absolute',
    content: '""',
    height: '16px',
    width: '16px',
    left: '22px',
    bottom: '2px',
    background: 'white',
    borderRadius: '50%',
    transition: '0.4s'
  }
};

const sliderOffStyle = {
  position: 'absolute',
  cursor: 'pointer',
  top: '0',
  left: '0',
  right: '0',
  bottom: '0',
  background: '#ccc',
  borderRadius: '20px',
  transition: '0.4s',
  ':before': {
    position: 'absolute',
    content: '""',
    height: '16px',
    width: '16px',
    left: '2px',
    bottom: '2px',
    background: 'white',
    borderRadius: '50%',
    transition: '0.4s'
  }
};

const buttonContainerStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  marginTop: '1rem'
};

const saveButtonStyle = {
  padding: '0.5rem 1.5rem',
  background: '#6c757d',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  fontSize: '1rem',
  cursor: 'pointer',
  transition: 'background 0.3s'
};

const tableWrapperStyle = {
  overflowX: 'auto'
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse'
};

const tableHeaderRowStyle = {
  background: '#f8f9fa'
};

const tableHeaderStyle = {
  padding: '0.75rem',
  textAlign: 'left',
  borderBottom: '1px solid #dee2e6',
  color: '#333',
  fontWeight: '500'
};

const tableRowStyle = {
  background: '#ffffff'
};

const tableCellStyle = {
  padding: '0.75rem',
  borderBottom: '1px solid #dee2e6',
  color: '#555'
};

const activeDotStyle = {
  display: 'inline-block',
  width: '10px',
  height: '10px',
  background: '#007bff',
  borderRadius: '50%'
};

const inactiveDotStyle = {
  display: 'inline-block',
  width: '10px',
  height: '10px',
  background: '#ccc',
  borderRadius: '50%'
};

const actionButtonStyle = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  margin: '0 5px',
  fontSize: '1rem'
};

const paginationStyle = {
  marginTop: '1rem',
  fontSize: '0.9rem',
  color: '#666',
  textAlign: 'right'
};

const dropdownMenuStyle = {
  position: 'absolute',
  right: 0,
  top: '100%',
  backgroundColor: 'white',
  border: '1px solid #ddd',
  borderRadius: '4px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  zIndex: 100,
  minWidth: '120px'
};

const dropdownItemStyle = {
  width: '100%',
  padding: '8px 12px',
  background: 'none',
  border: 'none',
  textAlign: 'left',
  cursor: 'pointer',
  fontSize: '14px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  ':hover': {
    backgroundColor: '#f8f9fa'
  }
};

export default AdmitCardPage;