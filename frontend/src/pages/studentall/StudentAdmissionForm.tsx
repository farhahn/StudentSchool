import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select, { OnChangeValue, SelectInstance } from 'react-select';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled, { keyframes } from 'styled-components';
import {
  fetchAdmissionForms,
  addAdmissionForm,
  updateAdmissionForm,
  deleteAdmissionForm,
} from '../../redux/StudentAddmissionDetail/studentAddmissionHandle';
import { getAllFclasses } from '../../redux/fclass/fclassHandle';
import { getAllSections } from '../../redux/sectionRelated/sectionHandle';
import { getAllTransportRoutes } from '../../redux/TransportRelated/routeHandle';
import { getAllPickupPoints } from '../../redux/TransportRelated/PickupPointAction';
import { RootState, AppDispatch } from '../../redux/store';
import { FaPlus, FaMinus } from 'react-icons/fa';

interface Option {
  value: string;
  label: string;
}

interface Fee {
  feeType: string;
  dueDate: string;
  amount: string;
}

interface Parent {
  name: string;
  phone: string;
  occupation: string;
}

interface AdditionalDetails {
  aadharNumber: string;
  panNumber: string;
  tcNumber: string;
}

interface AdmissionForm {
  _id: string;
  admissionNo: string;
  rollNo: string;
  classId: { _id: string; name: string } | string | null;
  section: string;
  firstName: string;
  lastName: string;
  gender: string;
  dob: string;
  routeId: { _id: string; title: string } | string | null;
  pickupPointId: { _id: string; name: string } | string | null;
  feesMonth: string;
  fees: Fee[];
  parents: {
    father: Parent;
    mother: Parent;
  };
  additionalDetails: AdditionalDetails;
  school: string;
}

interface Fclass {
  _id: string;
  name: string;
  sections: string[];
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
  padding: 1.5rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
  font-family: 'Roboto', sans-serif;
  overflow-x: hidden;
  width: 100%;
  box-sizing: border-box;
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Title = styled.h2`
  text-align: center;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  font-size: clamp(1.8rem, 5vw, 2.2rem);
  font-weight: 700;
  text-transform: uppercase;
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const FilterSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
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
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
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

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 999;
  animation: ${fadeIn} 0.3s ease;
`;

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 1.5rem;
  width: 90%;
  max-width: 600px;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  animation: ${scaleIn} 0.3s ease;
  max-height: 90vh;
  overflow-y: auto;
`;

const SectionTitle = styled.h3`
  color: #34495e;
  font-size: clamp(1.2rem, 4vw, 1.4rem);
  font-weight: 500;
  margin: 1rem 0;
`;

const GridSection = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const FeeSection = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  background: #f9f9f9;
`;

const FeeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.1rem;
  margin: 0 0.3rem;
  transition: transform 0.2s;
  &:hover {
    transform: scale(1.2);
  }
`;

const StudentAdmissionForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { admissionForms = [], loading, error: reduxError, status } = useSelector((state: RootState) => {
    console.log('Redux state:', state);
    return state.admissionForms;
  });
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { fclassesList, error: fclassError } = useSelector((state: RootState) => state.fclass);
  const { sectionsList, error: sectionError } = useSelector((state: RootState) => state.sections);
  const { transportRoutesList, error: routeError } = useSelector((state: RootState) => state.transportRoute);
  const { pickupPointsList, error: pickupError } = useSelector((state: RootState) => state.pickupPoint);
  const adminID = currentUser?._id;

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [feesVisible, setFeesVisible] = useState(false);
  const [filterClass, setFilterClass] = useState<string | null>(null);
  const [filterSection, setFilterSection] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState<AdmissionForm>({
    _id: '',
    admissionNo: '',
    rollNo: '',
    classId: '',
    section: '',
    firstName: '',
    lastName: '',
    gender: '',
    dob: '',
    routeId: '',
    pickupPointId: '',
    feesMonth: '',
    fees: [{ feeType: '', dueDate: '', amount: '' }],
    parents: {
      father: { name: '', phone: '', occupation: '' },
      mother: { name: '', phone: '', occupation: '' },
    },
    additionalDetails: {
      aadharNumber: '',
      panNumber: '',
      tcNumber: '',
    },
    school: adminID || '',
  });

  const inputRefs = {
    admissionNo: useRef<HTMLInputElement>(null),
    rollNo: useRef<HTMLInputElement>(null),
    classId: useRef<SelectInstance<Option>>(null),
    section: useRef<SelectInstance<Option>>(null),
    firstName: useRef<HTMLInputElement>(null),
    lastName: useRef<HTMLInputElement>(null),
    gender: useRef<SelectInstance<Option>>(null),
    dob: useRef<HTMLInputElement>(null),
    routeId: useRef<SelectInstance<Option>>(null),
    pickupPointId: useRef<SelectInstance<Option>>(null),
    feesMonth: useRef<HTMLInputElement>(null),
  };

  const fieldOrder: (keyof typeof inputRefs)[] = [
    'admissionNo',
    'rollNo',
    'classId',
    'section',
    'firstName',
    'lastName',
    'gender',
    'dob',
    'routeId',
    'pickupPointId',
    'feesMonth',
  ];

  useEffect(() => {
    let isMounted = true;
    if (adminID && isMounted) {
      dispatch(fetchAdmissionForms(adminID));
      dispatch(getAllFclasses(adminID));
      dispatch(getAllSections(adminID));
      dispatch(getAllTransportRoutes(adminID));
      dispatch(getAllPickupPoints(adminID));
    } else if (!adminID) {
      setError('Please log in to view admission forms');
      toast.error('Please log in to view admission forms', { position: 'top-right', autoClose: 3000 });
    }
    return () => {
      isMounted = false;
    };
  }, [dispatch, adminID]);

  useEffect(() => {
    console.log('admissionForms:', JSON.stringify(admissionForms, null, 2));
    console.log('status:', status);
    console.log('reduxError:', reduxError);
    console.log('fclassesList:', fclassesList);

    if (fclassError) {
      toast.error(`Failed to load classes: ${fclassError}`, { position: 'top-right', autoClose: 3000 });
      setError(fclassError);
    }
    if (sectionError) {
      toast.error(`Failed to load sections: ${sectionError}`, { position: 'top-right', autoClose: 3000 });
      setError(sectionError);
    }
    if (routeError) {
      toast.error(`Failed to load routes: ${routeError}`, { position: 'top-right', autoClose: 3000 });
      setError(routeError);
    }
    if (pickupError) {
      toast.error(`Failed to load pickup points: ${pickupError}`, { position: 'top-right', autoClose: 3000 });
      setError(pickupError);
    }
    if (reduxError) {
      toast.error(`Failed to load admission forms: ${reduxError}`, { position: 'top-right', autoClose: 3000 });
      setError(reduxError);
    }
  }, [fclassError, sectionError, routeError, pickupError, reduxError, admissionForms, status, fclassesList]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    section?: keyof AdmissionForm,
    subSection?: keyof AdmissionForm['parents']
  ) => {
    const { name, value } = e.target;
    if (subSection && section === 'parents') {
      setFormData((prev) => ({
        ...prev,
        parents: {
          ...prev.parents,
          [subSection]: {
            ...prev.parents[subSection],
            [name]: value,
          },
        },
      }));
    } else if (section === 'additionalDetails') {
      setFormData((prev) => ({
        ...prev,
        additionalDetails: {
          ...prev.additionalDetails,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>,
    currentField: keyof typeof inputRefs
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const currentIndex = fieldOrder.indexOf(currentField);
      const nextField = fieldOrder[currentIndex + 1];
      if (nextField && inputRefs[nextField].current) {
        inputRefs[nextField].current?.focus();
        if (inputRefs[nextField].current instanceof HTMLElement) {
          inputRefs[nextField].current?.select?.();
        } else {
          (inputRefs[nextField].current as SelectInstance<Option>)?.focus();
        }
      }
    }
  };

  const handleSelectChange = (
    fieldName: keyof AdmissionForm,
    newValue: OnChangeValue<Option, false>,
    currentField: keyof typeof inputRefs
  ) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: newValue ? newValue.value : '',
    }));
    const currentIndex = fieldOrder.indexOf(currentField);
    const nextField = fieldOrder[currentIndex + 1];
    if (nextField && inputRefs[nextField].current) {
      setTimeout(() => {
        inputRefs[nextField].current?.focus();
        if (inputRefs[nextField].current instanceof HTMLElement) {
          inputRefs[nextField].current?.select?.();
        } else {
          (inputRefs[nextField].current as SelectInstance<Option>)?.focus();
        }
      }, 0);
    }
  };

  const handleFilterClassChange = (newValue: OnChangeValue<Option, false>) => {
    setFilterClass(newValue ? newValue.value : null);
    setFilterSection(null); // Reset section when class changes
  };

  const handleFilterSectionChange = (newValue: OnChangeValue<Option, false>) => {
    setFilterSection(newValue ? newValue.value : null);
  };

  const handleSearchButtonClick = () => {
    // Filtering is applied in filteredAdmissionForms
  };

  const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleFeeChange = (index: number, field: keyof Fee, value: string) => {
    setFormData((prev) => {
      const newFees = [...prev.fees];
      newFees[index] = { ...newFees[index], [field]: value };
      return { ...prev, fees: newFees };
    });
  };

  const addFee = () => {
    setFormData((prev) => ({
      ...prev,
      fees: [...prev.fees, { feeType: '', dueDate: '', amount: '' }],
    }));
  };

  const removeFee = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      fees: prev.fees.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminID) {
      setError('Please log in to submit admission forms');
      toast.error('Please log in to submit admission forms', { position: 'top-right', autoClose: 3000 });
      return;
    }

    if (!formData.classId || !formData.section || !formData.firstName || !formData.dob) {
      setError('Class, Section, First Name, and DOB are required');
      toast.error('Class, Section, First Name, and DOB are required', { position: 'top-right', autoClose: 3000 });
      return;
    }

    const selectedClass = fclassesList.find((cls) => cls._id === (typeof formData.classId === 'string' ? formData.classId : formData.classId?._id));
    if (selectedClass && !selectedClass.sections.includes(formData.section)) {
      setError('Invalid section for selected class');
      toast.error('Invalid section for selected class', { position: 'top-right', autoClose: 3000 });
      return;
    }

    const validFees = formData.fees.filter((fee) => fee.feeType && fee.dueDate && fee.amount);
    const admissionFormData = {
      ...formData,
      fees: validFees,
      school: adminID,
      classId: typeof formData.classId === 'string' ? formData.classId : formData.classId?._id,
      routeId: typeof formData.routeId === 'string' ? formData.routeId : formData.routeId?._id,
      pickupPointId: typeof formData.pickupPointId === 'string' ? formData.pickupPointId : formData.pickupPointId?._id,
    };

    if (editingId !== null) {
      dispatch(updateAdmissionForm(editingId, admissionFormData, adminID));
      toast.success('Admission form updated successfully!', { position: 'top-right', autoClose: 3000 });
    } else {
      dispatch(addAdmissionForm(admissionFormData, adminID));
      toast.success('Admission form added successfully!', { position: 'top-right', autoClose: 3000 });
    }

    setFormData({
      _id: '',
      admissionNo: '',
      rollNo: '',
      classId: '',
      section: '',
      firstName: '',
      lastName: '',
      gender: '',
      dob: '',
      routeId: '',
      pickupPointId: '',
      feesMonth: '',
      fees: [{ feeType: '', dueDate: '', amount: '' }],
      parents: {
        father: { name: '', phone: '', occupation: '' },
        mother: { name: '', phone: '', occupation: '' },
      },
      additionalDetails: {
        aadharNumber: '',
        panNumber: '',
        tcNumber: '',
      },
      school: adminID || '',
    });
    setShowForm(false);
    setEditingId(null);
    setFeesVisible(false);
    setError(null);
  };

  const handleEdit = (id: string) => {
    const admissionForm = admissionForms.find((s: AdmissionForm) => s._id === id);
    if (admissionForm) {
      setFormData(admissionForm);
      setEditingId(id);
      setShowForm(true);
    }
  };

  const handleDelete = (id: string) => {
    dispatch(deleteAdmissionForm(id, adminID));
    toast.success('Admission form deleted successfully!', { position: 'top-right', autoClose: 3000 });
  };

  const classOptions: Option[] = fclassesList.map((cls) => ({ value: cls._id, label: cls.name }));
  const sectionOptions: Option[] = fclassesList
    .find((cls) => cls._id === filterClass)
    ?.sections.map((sec) => ({ value: sec, label: sec })) || [];
  const formSectionOptions: Option[] = fclassesList
    .find((cls) => cls._id === (typeof formData.classId === 'string' ? formData.classId : formData.classId?._id))
    ?.sections.map((sec) => ({ value: sec, label: sec })) || [];
  const genderOptions: Option[] = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
  ];
  const routeOptions: Option[] = transportRoutesList.map((route) => ({ value: route._id, label: route.title }));
  const pickupPointOptions: Option[] = pickupPointsList.map((point) => ({ value: point._id, label: point.name }));

  const filteredAdmissionForms = admissionForms.filter((form: AdmissionForm) => {
    let matchesClass = true;
    let matchesSection = true;
    let matchesSearch = true;

    if (filterClass) {
      const classId = typeof form.classId === 'string' ? form.classId : form.classId?._id;
      matchesClass = classId === filterClass;
    }

    if (filterSection) {
      matchesSection = form.section === filterSection;
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const fullName = `${form.firstName} ${form.lastName}`.toLowerCase();
      matchesSearch =
        form.admissionNo.toLowerCase().includes(query) ||
        form.rollNo.toLowerCase().includes(query) ||
        fullName.includes(query);
    }

    return matchesClass && matchesSection && matchesSearch;
  });

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
          }}
        />
        <Title>Admission Form Management</Title>

        {error && <div style={{ color: '#e74c3c', textAlign: 'center', marginBottom: '1rem' }}>{error}</div>}
        {reduxError && <div style={{ color: '#e74c3c', textAlign: 'center', marginBottom: '1rem' }}>{reduxError}</div>}

        <HeaderSection>
          <h3 style={{ color: '#34495e', fontSize: 'clamp(1.4rem, 4vw, 1.6rem)', fontWeight: 500 }}>
            Admission Form Details
          </h3>
          <Button
            onClick={() => {
              setShowForm(true);
              setEditingId(null);
              setFormData({
                _id: '',
                admissionNo: '',
                rollNo: '',
                classId: '',
                section: '',
                firstName: '',
                lastName: '',
                gender: '',
                dob: '',
                routeId: '',
                pickupPointId: '',
                feesMonth: '',
                fees: [{ feeType: '', dueDate: '', amount: '' }],
                parents: {
                  father: { name: '', phone: '', occupation: '' },
                  mother: { name: '', phone: '', occupation: '' },
                },
                additionalDetails: {
                  aadharNumber: '',
                  panNumber: '',
                  tcNumber: '',
                },
                school: adminID || '',
              });
            }}
          >
            + Add Admission Form
          </Button>
        </HeaderSection>

        <FilterSection>
          <div style={{ width: '200px' }}>
            <label style={{ fontSize: 'clamp(0.9rem, 3vw, 1rem)', color: '#2c3e50', fontWeight: 500 }}>
              Filter by Class
            </label>
            <Select
              options={classOptions}
              value={classOptions.find((opt) => opt.value === filterClass) || null}
              onChange={handleFilterClassChange}
              placeholder="Select Class"
              isClearable
              isSearchable
              styles={{
                control: (base) => ({
                  ...base,
                  borderRadius: '6px',
                  padding: '0.2rem',
                  minWidth: '100%',
                }),
                menu: (base) => ({
                  ...base,
                  borderRadius: '6px',
                  marginTop: '4px',
                  zIndex: 1000,
                }),
              }}
            />
          </div>
          <div style={{ width: '200px' }}>
            <label style={{ fontSize: 'clamp(0.9rem, 3vw, 1rem)', color: '#2c3e50', fontWeight: 500 }}>
              Filter by Section
            </label>
            <Select
              options={sectionOptions}
              value={sectionOptions.find((opt) => opt.value === filterSection) || null}
              onChange={handleFilterSectionChange}
              placeholder="Select Section"
              isClearable
              isSearchable
              isDisabled={!filterClass}
              styles={{
                control: (base) => ({
                  ...base,
                  borderRadius: '6px',
                  padding: '0.2rem',
                  minWidth: '100%',
                }),
                menu: (base) => ({
                  ...base,
                  borderRadius: '6px',
                  marginTop: '4px',
                  zIndex: 1000,
                }),
              }}
            />
          </div>
          <Button onClick={handleSearchButtonClick}>Search</Button>
          <div style={{ width: '200px' }}>
            <label style={{ fontSize: 'clamp(0.9rem, 3vw, 1rem)', color: '#2c3e50', fontWeight: 500 }}>
              Search by ID, Roll No, Name
            </label>
            <Input
              value={searchQuery}
              onChange={handleSearchQueryChange}
              placeholder="Search by ID, Roll No, Name"
            />
          </div>
        </FilterSection>

        {loading ? (
          <div style={{ color: '#34495e', textAlign: 'center' }}>Loading...</div>
        ) : filteredAdmissionForms.length === 0 ? (
          <div style={{ color: '#34495e', textAlign: 'center' }}>
            No admission forms available. {reduxError ? `Error: ${reduxError}` : 'Try adding a new form or adjusting filters.'}
          </div>
        ) : (
          <div style={{ overflowX: 'auto', width: '100%', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)' }}>
            <table style={{ width: '100%', background: 'white', borderRadius: '12px', borderCollapse: 'collapse', minWidth: '800px' }}>
              <thead>
                <tr>
                  <th style={{ background: 'linear-gradient(45deg, #3498db, #2980b9)', color: 'white', padding: '0.8rem', fontWeight: 600 }}>
                    Admission No
                  </th>
                  <th style={{ background: 'linear-gradient(45deg, #3498db, #2980b9)', color: 'white', padding: '0.8rem', fontWeight: 600 }}>
                    Name
                  </th>
                  <th style={{ background: 'linear-gradient(45deg, #3498db, #2980b9)', color: 'white', padding: '0.8rem', fontWeight: 600 }}>
                    Class
                  </th>
                  <th style={{ background: 'linear-gradient(45deg, #3498db, #2980b9)', color: 'white', padding: '0.8rem', fontWeight: 600 }}>
                    Section
                  </th>
                  <th style={{ background: 'linear-gradient(45deg, #3498db, #2980b9)', color: 'white', padding: '0.8rem', fontWeight: 600 }}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAdmissionForms.map((form: AdmissionForm) => (
                  <tr key={form._id}>
                    <td style={{ padding: '0.8rem', textAlign: 'center', borderBottom: '1px solid #ecf0f1' }}>{form.admissionNo}</td>
                    <td style={{ padding: '0.8rem', textAlign: 'center', borderBottom: '1px solid #ecf0f1' }}>
                      {form.firstName} {form.lastName}
                    </td>
                    <td style={{ padding: '0.8rem', textAlign: 'center', borderBottom: '1px solid #ecf0f1' }}>
                      {typeof form.classId === 'object' && form.classId ? form.classId.name : 
                       typeof form.classId === 'string' ? fclassesList.find((cls) => cls._id === form.classId)?.name || 'Unknown' : 
                       'Unknown'}
                    </td>
                    <td style={{ padding: '0.8rem', textAlign: 'center', borderBottom: '1px solid #ecf0f1' }}>{form.section}</td>
                    <td style={{ padding: '0.8rem', textAlign: 'center', borderBottom: '1px solid #ecf0f1' }}>
                      <ActionButton onClick={() => handleEdit(form._id)} style={{ color: '#3498db' }}>
                        📝
                      </ActionButton>
                      <ActionButton onClick={() => handleDelete(form._id)} style={{ color: '#e74c3c' }}>
                        ❌
                      </ActionButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {showForm && (
          <>
            <ModalOverlay onClick={() => setShowForm(false)} />
            <Modal>
              <h3>{editingId !== null ? 'Edit Admission Form' : 'Add Admission Form'}</h3>
              <FormContainer onSubmit={handleSubmit}>
                <GridSection>
                  <div>
                    <label style={{ fontSize: 'clamp(0.9rem, 3vw, 1rem)', color: '#2c3e50', fontWeight: 500 }}>
                      Admission No
                    </label>
                    <Input
                      name="admissionNo"
                      value={formData.admissionNo}
                      onChange={handleInputChange}
                      onKeyDown={(e) => handleKeyDown(e, 'admissionNo')}
                      ref={inputRefs.admissionNo}
                      placeholder="Admission No"
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 'clamp(0.9rem, 3vw, 1rem)', color: '#2c3e50', fontWeight: 500 }}>
                      Roll No
                    </label>
                    <Input
                      name="rollNo"
                      value={formData.rollNo}
                      onChange={handleInputChange}
                      onKeyDown={(e) => handleKeyDown(e, 'rollNo')}
                      ref={inputRefs.rollNo}
                      placeholder="Roll No"
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 'clamp(0.9rem, 3vw, 1rem)', color: '#2c3e50', fontWeight: 500 }}>
                      Class
                    </label>
                    <Select
                      ref={inputRefs.classId}
                      options={classOptions}
                      value={classOptions.find((opt) => opt.value === (typeof formData.classId === 'string' ? formData.classId : formData.classId?._id)) || null}
                      onChange={(newValue) => handleSelectChange('classId', newValue, 'classId')}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const currentValue = inputRefs.classId.current?.props.value;
                          if (currentValue) {
                            handleSelectChange('classId', currentValue, 'classId');
                          } else {
                            const inputValue = (e.target as any).value || '';
                            const filteredOptions = classOptions.filter((opt) =>
                              opt.label.toLowerCase().includes(inputValue.toLowerCase())
                            );
                            if (filteredOptions.length > 0) {
                              handleSelectChange('classId', filteredOptions[0], 'classId');
                            } else {
                              const currentIndex = fieldOrder.indexOf('classId');
                              const nextField = fieldOrder[currentIndex + 1];
                              if (nextField && inputRefs[nextField].current) {
                                inputRefs[nextField].current?.focus();
                                if (inputRefs[nextField].current instanceof HTMLElement) {
                                  inputRefs[nextField].current?.select?.();
                                } else {
                                  (inputRefs[nextField].current as SelectInstance<Option>)?.focus();
                                }
                              }
                            }
                          }
                        }
                      }}
                      placeholder="Select Class (e.g., type '1' for Class 1)"
                      isClearable
                      isSearchable
                      filterOption={(option, inputValue) =>
                        option.label.toLowerCase().includes(inputValue.toLowerCase())
                      }
                      styles={{
                        control: (base) => ({
                          ...base,
                          borderRadius: '6px',
                          padding: '0.2rem',
                          minWidth: '100%',
                        }),
                        menu: (base) => ({
                          ...base,
                          borderRadius: '6px',
                          marginTop: '4px',
                          zIndex: 1000,
                        }),
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 'clamp(0.9rem, 3vw, 1rem)', color: '#2c3e50', fontWeight: 500 }}>
                      Section
                    </label>
                    <Select
                      ref={inputRefs.section}
                      options={formSectionOptions}
                      value={formSectionOptions.find((opt) => opt.value === formData.section) || null}
                      onChange={(newValue) => handleSelectChange('section', newValue, 'section')}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const currentValue = inputRefs.section.current?.props.value;
                          if (currentValue) {
                            handleSelectChange('section', currentValue, 'section');
                          } else {
                            const inputValue = (e.target as any).value || '';
                            const filteredOptions = formSectionOptions.filter((opt) =>
                              opt.label.toLowerCase().includes(inputValue.toLowerCase())
                            );
                            if (filteredOptions.length > 0) {
                              handleSelectChange('section', filteredOptions[0], 'section');
                            } else {
                              const currentIndex = fieldOrder.indexOf('section');
                              const nextField = fieldOrder[currentIndex + 1];
                              if (nextField && inputRefs[nextField].current) {
                                inputRefs[nextField].current?.focus();
                                if (inputRefs[nextField].current instanceof HTMLElement) {
                                  inputRefs[nextField].current?.select?.();
                                } else {
                                  (inputRefs[nextField].current as SelectInstance<Option>)?.focus();
                                }
                              }
                            }
                          }
                        }
                      }}
                      placeholder="Select Section (e.g., type 'A' for Section A)"
                      isClearable
                      isSearchable
                      isDisabled={!formData.classId}
                      filterOption={(option, inputValue) =>
                        option.label.toLowerCase().includes(inputValue.toLowerCase())
                      }
                      styles={{
                        control: (base) => ({
                          ...base,
                          borderRadius: '6px',
                          padding: '0.2rem',
                          minWidth: '100%',
                        }),
                        menu: (base) => ({
                          ...base,
                          borderRadius: '6px',
                          marginTop: '4px',
                          zIndex: 1000,
                        }),
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 'clamp(0.9rem, 3vw, 1rem)', color: '#2c3e50', fontWeight: 500 }}>
                      First Name
                    </label>
                    <Input
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      onKeyDown={(e) => handleKeyDown(e, 'firstName')}
                      ref={inputRefs.firstName}
                      placeholder="First Name"
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 'clamp(0.9rem, 3vw, 1rem)', color: '#2c3e50', fontWeight: 500 }}>
                      Last Name
                    </label>
                    <Input
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      onKeyDown={(e) => handleKeyDown(e, 'lastName')}
                      ref={inputRefs.lastName}
                      placeholder="Last Name"
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 'clamp(0.9rem, 3vw, 1rem)', color: '#2c3e50', fontWeight: 500 }}>
                      Gender
                    </label>
                    <Select
                      ref={inputRefs.gender}
                      options={genderOptions}
                      value={genderOptions.find((opt) => opt.value === formData.gender) || null}
                      onChange={(newValue) => handleSelectChange('gender', newValue, 'gender')}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const currentValue = inputRefs.gender.current?.props.value;
                          if (currentValue) {
                            handleSelectChange('gender', currentValue, 'gender');
                          } else {
                            const inputValue = (e.target as any).value || '';
                            const filteredOptions = genderOptions.filter((opt) =>
                              opt.label.toLowerCase().includes(inputValue.toLowerCase())
                            );
                            if (filteredOptions.length > 0) {
                              handleSelectChange('gender', filteredOptions[0], 'gender');
                            } else {
                              const currentIndex = fieldOrder.indexOf('gender');
                              const nextField = fieldOrder[currentIndex + 1];
                              if (nextField && inputRefs[nextField].current) {
                                inputRefs[nextField].current?.focus();
                                if (inputRefs[nextField].current instanceof HTMLElement) {
                                  inputRefs[nextField].current?.select?.();
                                } else {
                                  (inputRefs[nextField].current as SelectInstance<Option>)?.focus();
                                }
                              }
                            }
                          }
                        }
                      }}
                      placeholder="Select Gender"
                      isClearable
                      isSearchable
                      filterOption={(option, inputValue) =>
                        option.label.toLowerCase().includes(inputValue.toLowerCase())
                      }
                      styles={{
                        control: (base) => ({
                          ...base,
                          borderRadius: '6px',
                          padding: '0.2rem',
                          minWidth: '100%',
                        }),
                        menu: (base) => ({
                          ...base,
                          borderRadius: '6px',
                          marginTop: '4px',
                          zIndex: 1000,
                        }),
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 'clamp(0.9rem, 3vw, 1rem)', color: '#2c3e50', fontWeight: 500 }}>
                      DOB
                    </label>
                    <Input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleInputChange}
                      onKeyDown={(e) => handleKeyDown(e, 'dob')}
                      ref={inputRefs.dob}
                      placeholder="DOB"
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 'clamp(0.9rem, 3vw, 1rem)', color: '#2c3e50', fontWeight: 500 }}>
                      Route
                    </label>
                    <Select
                      ref={inputRefs.routeId}
                      options={routeOptions}
                      value={routeOptions.find((opt) => opt.value === (typeof formData.routeId === 'string' ? formData.routeId : formData.routeId?._id)) || null}
                      onChange={(newValue) => handleSelectChange('routeId', newValue, 'routeId')}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const currentValue = inputRefs.routeId.current?.props.value;
                          if (currentValue) {
                            handleSelectChange('routeId', currentValue, 'routeId');
                          } else {
                            const inputValue = (e.target as any).value || '';
                            const filteredOptions = routeOptions.filter((opt) =>
                              opt.label.toLowerCase().includes(inputValue.toLowerCase())
                            );
                            if (filteredOptions.length > 0) {
                              handleSelectChange('routeId', filteredOptions[0], 'routeId');
                            } else {
                              const currentIndex = fieldOrder.indexOf('routeId');
                              const nextField = fieldOrder[currentIndex + 1];
                              if (nextField && inputRefs[nextField].current) {
                                inputRefs[nextField].current?.focus();
                                if (inputRefs[nextField].current instanceof HTMLElement) {
                                  inputRefs[nextField].current?.select?.();
                                } else {
                                  (inputRefs[nextField].current as SelectInstance<Option>)?.focus();
                                }
                              }
                            }
                          }
                        }
                      }}
                      placeholder="Select Route"
                      isClearable
                      isSearchable
                      filterOption={(option, inputValue) =>
                        option.label.toLowerCase().includes(inputValue.toLowerCase())
                      }
                      styles={{
                        control: (base) => ({
                          ...base,
                          borderRadius: '6px',
                          padding: '0.2rem',
                          minWidth: '100%',
                        }),
                        menu: (base) => ({
                          ...base,
                          borderRadius: '6px',
                          marginTop: '4px',
                          zIndex: 1000,
                        }),
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 'clamp(0.9rem, 3vw, 1rem)', color: '#2c3e50', fontWeight: 500 }}>
                      Pickup Point
                    </label>
                    <Select
                      ref={inputRefs.pickupPointId}
                      options={pickupPointOptions}
                      value={pickupPointOptions.find((opt) => opt.value === (typeof formData.pickupPointId === 'string' ? formData.pickupPointId : formData.pickupPointId?._id)) || null}
                      onChange={(newValue) => handleSelectChange('pickupPointId', newValue, 'pickupPointId')}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const currentValue = inputRefs.pickupPointId.current?.props.value;
                          if (currentValue) {
                            handleSelectChange('pickupPointId', currentValue, 'pickupPointId');
                          } else {
                            const inputValue = (e.target as any).value || '';
                            const filteredOptions = pickupPointOptions.filter((opt) =>
                              opt.label.toLowerCase().includes(inputValue.toLowerCase())
                            );
                            if (filteredOptions.length > 0) {
                              handleSelectChange('pickupPointId', filteredOptions[0], 'pickupPointId');
                            } else {
                              const currentIndex = fieldOrder.indexOf('pickupPointId');
                              const nextField = fieldOrder[currentIndex + 1];
                              if (nextField && inputRefs[nextField].current) {
                                inputRefs[nextField].current?.focus();
                                if (inputRefs[nextField].current instanceof HTMLElement) {
                                  inputRefs[nextField].current?.select?.();
                                } else {
                                  (inputRefs[nextField].current as SelectInstance<Option>)?.focus();
                                }
                              }
                            }
                          }
                        }
                      }}
                      placeholder="Select Pickup Point"
                      isClearable
                      isSearchable
                      isDisabled={!formData.routeId}
                      filterOption={(option, inputValue) =>
                        option.label.toLowerCase().includes(inputValue.toLowerCase())
                      }
                      styles={{
                        control: (base) => ({
                          ...base,
                          borderRadius: '6px',
                          padding: '0.2rem',
                          minWidth: '100%',
                        }),
                        menu: (base) => ({
                          ...base,
                          borderRadius: '6px',
                          marginTop: '4px',
                          zIndex: 1000,
                        }),
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 'clamp(0.9rem, 3vw, 1rem)', color: '#2c3e50', fontWeight: 500 }}>
                      Fees Month
                    </label>
                    <Input
                      name="feesMonth"
                      value={formData.feesMonth}
                      onChange={handleInputChange}
                      onKeyDown={(e) => handleKeyDown(e, 'feesMonth')}
                      ref={inputRefs.feesMonth}
                      placeholder="Fees Month"
                    />
                  </div>
                </GridSection>

                <SectionTitle>Fees Details</SectionTitle>
                <FeeSection>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Fees</span>
                    <Button type="button" onClick={() => setFeesVisible(!feesVisible)}>
                      {feesVisible ? <FaMinus /> : <FaPlus />}
                    </Button>
                  </div>
                  {feesVisible &&
                    formData.fees.map((fee, index) => (
                      <FeeGrid key={index}>
                        <div>
                          <label style={{ fontSize: 'clamp(0.9rem, 3vw, 1rem)', color: '#2c3e50', fontWeight: 500 }}>
                            Fee Type
                          </label>
                          <Input
                            placeholder="Fee Type"
                            value={fee.feeType}
                            onChange={(e) => handleFeeChange(index, 'feeType', e.target.value)}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: 'clamp(0.9rem, 3vw, 1rem)', color: '#2c3e50', fontWeight: 500 }}>
                            Due Date
                          </label>
                          <Input
                            type="date"
                            placeholder="Due Date"
                            value={fee.dueDate}
                            onChange={(e) => handleFeeChange(index, 'dueDate', e.target.value)}
                          />
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                          <div style={{ flex: 1 }}>
                            <label style={{ fontSize: 'clamp(0.9rem, 3vw, 1rem)', color: '#2c3e50', fontWeight: 500 }}>
                              Amount
                            </label>
                            <Input
                              type="number"
                              placeholder="Amount"
                              value={fee.amount}
                              onChange={(e) => handleFeeChange(index, 'amount', e.target.value)}
                            />
                          </div>
                          {index > 0 && (
                            <Button
                              type="button"
                              style={{ background: '#e74c3c', marginTop: '1.5rem' }}
                              onClick={() => removeFee(index)}
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                      </FeeGrid>
                    ))}
                  {feesVisible && (
                    <Button type="button" onClick={addFee} style={{ marginTop: '1rem' }}>
                      Add Fee
                    </Button>
                  )}
                </FeeSection>

                <SectionTitle>Parent & Guardian Details</SectionTitle>
                {(['father', 'mother'] as const).map((parent) => (
                  <GridSection key={parent}>
                    <div>
                      <label style={{ fontSize: 'clamp(0.9rem, 3vw, 1rem)', color: '#2c3e50', fontWeight: 500 }}>
                        {parent.charAt(0).toUpperCase() + parent.slice(1)} Name
                      </label>
                      <Input
                        placeholder={`${parent.charAt(0).toUpperCase() + parent.slice(1)} Name`}
                        name="name"
                        value={formData.parents[parent].name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e, 'parents', parent)}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 'clamp(0.9rem, 3vw, 1rem)', color: '#2c3e50', fontWeight: 500 }}>
                        {parent.charAt(0).toUpperCase() + parent.slice(1)} Phone
                      </label>
                      <Input
                        placeholder={`${parent.charAt(0).toUpperCase() + parent.slice(1)} Phone`}
                        name="phone"
                        value={formData.parents[parent].phone}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e, 'parents', parent)}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 'clamp(0.9rem, 3vw, 1rem)', color: '#2c3e50', fontWeight: 500 }}>
                        {parent.charAt(0).toUpperCase() + parent.slice(1)} Occupation
                      </label>
                      <Input
                        placeholder={`${parent.charAt(0).toUpperCase() + parent.slice(1)} Occupation`}
                        name="occupation"
                        value={formData.parents[parent].occupation}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e, 'parents', parent)}
                      />
                    </div>
                  </GridSection>
                ))}

                <SectionTitle>Additional Details</SectionTitle>
                <GridSection>
                  <div>
                    <label style={{ fontSize: 'clamp(0.9rem, 3vw, 1rem)', color: '#2c3e50', fontWeight: 500 }}>
                      Aadhar Number
                    </label>
                    <Input
                      placeholder="Aadhar Number"
                      name="aadharNumber"
                      value={formData.additionalDetails.aadharNumber}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e, 'additionalDetails')}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 'clamp(0.9rem, 3vw, 1rem)', color: '#2c3e50', fontWeight: 500 }}>
                      PAN Number
                    </label>
                    <Input
                      placeholder="PAN Number"
                      name="panNumber"
                      value={formData.additionalDetails.panNumber}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e, 'additionalDetails')}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 'clamp(0.9rem, 3vw, 1rem)', color: '#2c3e50', fontWeight: 500 }}>
                      TC Number
                    </label>
                    <Input
                      placeholder="TC Number"
                      name="tcNumber"
                      value={formData.additionalDetails.tcNumber}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e, 'additionalDetails')}
                    />
                  </div>
                </GridSection>

                <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center', marginTop: '1rem' }}>
                  <Button type="submit">Save</Button>
                  <Button
                    type="button"
                    style={{ background: 'linear-gradient(45deg, #e74c3c, #c0392b)' }}
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </FormContainer>
            </Modal>
          </>
        )}
      </Container>
    </>
  );
};

export default StudentAdmissionForm;