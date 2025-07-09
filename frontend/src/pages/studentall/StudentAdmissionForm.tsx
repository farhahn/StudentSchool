import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select, { OnChangeValue, SelectInstance } from 'react-select';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled, { keyframes } from 'styled-components';
import ReactPaginate from 'react-paginate';
import { FaPlus, FaMinus } from 'react-icons/fa';
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

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: clamp(1rem, 3vw, 1.5rem);
  flex-wrap: wrap;
  gap: clamp(0.8rem, 2vw, 1rem);
`;

const FilterSection = styled.div`
  display: flex;
  align-items: flex-end;
  gap: clamp(0.8rem, 2vw, 1rem);
  margin-bottom: clamp(1rem, 3vw, 1.5rem);
  flex-wrap: wrap;
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  width: 200px;
  @media (max-width: 600px) {
    width: 100%;
  }
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
  gap: clamp(0.8rem, 2vw, 1rem);
  background: white;
  padding: clamp(1rem, 3vw, 1.5rem);
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
  padding: clamp(1rem, 3vw, 1.5rem);
  width: 90%;
  max-width: 600px;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  animation: ${scaleIn} 0.3s ease;
  max-height: 90vh;
  overflow-y: auto;
  @media (max-width: 600px) {
    width: 95%;
    padding: clamp(0.8rem, 2.5vw, 1rem);
  }
`;

const SectionTitle = styled.h3`
  color: #34495e;
  font-size: clamp(1.2rem, 4vw, 1.4rem);
  font-weight: 500;
  margin: clamp(0.8rem, 2vw, 1rem) 0;
`;

const GridSection = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: clamp(0.8rem, 2vw, 1rem);
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const FeeSection = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: clamp(0.8rem, 2vw, 1rem);
  background: #f9f9f9;
`;

const FeeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: clamp(0.8rem, 2vw, 1rem);
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
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
    transform: scale(1za.2);
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

const ItemsPerPageSelect = styled(Select)`
  width: 140px;
  @media (max-width: 600px) {
    width: 100%;
  }
`;

const itemsPerPageOptions: Option[] = [
  { value: '5', label: '5' },
  { value: '10', label: '10' },
  { value: '20', label: '20' },
  { value: '30', label: '30' },
];

const StudentAdmissionForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { admissionForms = [], loading, error: reduxError, status } = useSelector((state: RootState) => state.admissionForms);
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
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);

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
  }, [fclassError, sectionError, routeError, pickupError, reduxError]);

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
    setFilterSection(null);
    setCurrentPage(0); // Reset pagination on filter change
  };

  const handleFilterSectionChange = (newValue: OnChangeValue<Option, false>) => {
    setFilterSection(newValue ? newValue.value : null);
    setCurrentPage(0); // Reset pagination on filter change
  };

  const handleSearchButtonClick = () => {
    setCurrentPage(0); // Reset pagination on search
  };

  const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(0); // Reset pagination on search
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
    setCurrentPage(0); // Reset pagination on form submission
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
    setCurrentPage(0); // Reset pagination on delete
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

  const pageCount = Math.ceil(filteredAdmissionForms.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentPageData = filteredAdmissionForms.slice(offset, offset + itemsPerPage);

  const handleItemsPerPageChange = (newValue: OnChangeValue<Option, false>) => {
    setItemsPerPage(newValue ? Number(newValue.value) : 5);
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
        <Title>Admission Form Management</Title>

        {error && (
          <div style={{ color: '#e74c3c', textAlign: 'center', marginBottom: 'clamp(0.8rem, 2vw, 1rem)', fontSize: 'clamp(0.9rem, 3vw, 1rem)' }}>
            {error}
          </div>
        )}
        {reduxError && (
          <div style={{ color: '#e74c3c', textAlign: 'center', marginBottom: 'clamp(0.8rem, 2vw, 1rem)', fontSize: 'clamp(0.9rem, 3vw, 1rem)' }}>
            {reduxError}
          </div>
        )}

        <HeaderSection>
          <SectionTitle>Admission Form Details</SectionTitle>
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
            aria-label="Add Admission Form"
          >
            + Add Admission Form
          </Button>
        </HeaderSection>

        <FilterSection>
          <FormGroup>
            <Label htmlFor="filter-class">Filter by Class</Label>
            <Select
              id="filter-class"
              options={classOptions}
              value={classOptions.find((opt) => opt.value === filterClass) || null}
              onChange={handleFilterClassChange}
              placeholder="Select Class"
              isClearable
              isSearchable
              aria-label="Filter by Class"
              styles={{
                control: (base) => ({
                  ...base,
                  borderRadius: '6px',
                  padding: '0.2rem',
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
          <FormGroup>
            <Label htmlFor="filter-section">Filter by Section</Label>
            <Select
              id="filter-section"
              options={sectionOptions}
              value={sectionOptions.find((opt) => opt.value === filterSection) || null}
              onChange={handleFilterSectionChange}
              placeholder="Select Section"
              isClearable
              isSearchable
              isDisabled={!filterClass}
              aria-label="Filter by Section"
              styles={{
                control: (base) => ({
                  ...base,
                  borderRadius: '6px',
                  padding: '0.2rem',
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
          <Button onClick={handleSearchButtonClick} aria-label="Search">Search</Button>
          <FormGroup>
            <Label htmlFor="search-query">Search by ID, Roll No, Name</Label>
            <Input
              id="search-query"
              value={searchQuery}
              onChange={handleSearchQueryChange}
              placeholder="Search by ID, Roll No, Name"
              aria-label="Search by ID, Roll No, Name"
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
        </FilterSection>

        {loading ? (
          <div style={{ textAlign: 'center', fontSize: 'clamp(0.9rem, 3vw, 1rem)', color: '#2c3e50' }}>
            Loading...
          </div>
        ) : currentPageData.length === 0 ? (
          <div style={{ textAlign: 'center', fontSize: 'clamp(0.9rem, 3vw, 1rem)', color: '#e74c3c' }}>
            No admission forms available. {reduxError ? `Error: ${reduxError}` : 'Try adding a new form or adjusting filters.'}
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
                  <Th>Action</Th>
                </tr>
              </thead>
              <tbody>
                {currentPageData.map((form: AdmissionForm) => (
                  <tr key={form._id}>
                    <Td>{form.admissionNo}</Td>
                    <Td>{form.firstName} {form.lastName}</Td>
                    <Td>
                      {typeof form.classId === 'object' && form.classId ? form.classId.name : 
                       typeof form.classId === 'string' ? fclassesList.find((cls) => cls._id === form.classId)?.name || 'Unknown' : 
                       'Unknown'}
                    </Td>
                    <Td>{form.section}</Td>
                    <Td>
                      <ActionButton
                        onClick={() => handleEdit(form._id)}
                        aria-label={`Edit ${form.firstName} ${form.lastName}`}
                        style={{ color: '#3498db' }}
                      >
                        📝
                      </ActionButton>
                      <ActionButton
                        onClick={() => handleDelete(form._id)}
                        aria-label={`Delete ${form.firstName} ${form.lastName}`}
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
                Records: {currentPageData.length} of {filteredAdmissionForms.length}
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

        {showForm && (
          <>
            <ModalOverlay onClick={() => setShowForm(false)} />
            <Modal>
              <SectionTitle>{editingId !== null ? 'Edit Admission Form' : 'Add Admission Form'}</SectionTitle>
              <FormContainer onSubmit={handleSubmit}>
                <GridSection>
                  <FormGroup>
                    <Label htmlFor="admissionNo">Admission No</Label>
                    <Input
                      id="admissionNo"
                      name="admissionNo"
                      value={formData.admissionNo}
                      onChange={handleInputChange}
                      onKeyDown={(e) => handleKeyDown(e, 'admissionNo')}
                      ref={inputRefs.admissionNo}
                      placeholder="Admission No"
                      aria-label="Admission No"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="rollNo">Roll No</Label>
                    <Input
                      id="rollNo"
                      name="rollNo"
                      value={formData.rollNo}
                      onChange={handleInputChange}
                      onKeyDown={(e) => handleKeyDown(e, 'rollNo')}
                      ref={inputRefs.rollNo}
                      placeholder="Roll No"
                      aria-label="Roll No"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="classId">Class</Label>
                    <Select
                      id="classId"
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
                      aria-label="Class"
                      styles={{
                        control: (base) => ({
                          ...base,
                          borderRadius: '6px',
                          padding: '0.2rem',
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
                  <FormGroup>
                    <Label htmlFor="section">Section</Label>
                    <Select
                      id="section"
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
                      aria-label="Section"
                      styles={{
                        control: (base) => ({
                          ...base,
                          borderRadius: '6px',
                          padding: '0.2rem',
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
                  <FormGroup>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      onKeyDown={(e) => handleKeyDown(e, 'firstName')}
                      ref={inputRefs.firstName}
                      placeholder="First Name"
                      aria-label="First Name"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      onKeyDown={(e) => handleKeyDown(e, 'lastName')}
                      ref={inputRefs.lastName}
                      placeholder="Last Name"
                      aria-label="Last Name"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      id="gender"
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
                      aria-label="Gender"
                      styles={{
                        control: (base) => ({
                          ...base,
                          borderRadius: '6px',
                          padding: '0.2rem',
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
                  <FormGroup>
                    <Label htmlFor="dob">DOB</Label>
                    <Input
                      id="dob"
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleInputChange}
                      onKeyDown={(e) => handleKeyDown(e, 'dob')}
                      ref={inputRefs.dob}
                      placeholder="DOB"
                      aria-label="DOB"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="routeId">Route</Label>
                    <Select
                      id="routeId"
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
                      aria-label="Route"
                      styles={{
                        control: (base) => ({
                          ...base,
                          borderRadius: '6px',
                          padding: '0.2rem',
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
                  <FormGroup>
                    <Label htmlFor="pickupPointId">Pickup Point</Label>
                    <Select
                      id="pickupPointId"
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
                      aria-label="Pickup Point"
                      styles={{
                        control: (base) => ({
                          ...base,
                          borderRadius: '6px',
                          padding: '0.2rem',
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
                  <FormGroup>
                    <Label htmlFor="feesMonth">Fees Month</Label>
                    <Input
                      id="feesMonth"
                      name="feesMonth"
                      value={formData.feesMonth}
                      onChange={handleInputChange}
                      onKeyDown={(e) => handleKeyDown(e, 'feesMonth')}
                      ref={inputRefs.feesMonth}
                      placeholder="Fees Month"
                      aria-label="Fees Month"
                    />
                  </FormGroup>
                </GridSection>

                <SectionTitle>Fees Details</SectionTitle>
                <FeeSection>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'clamp(0.8rem, 2vw, 1rem)' }}>
                    <span style={{ fontSize: 'clamp(0.9rem, 3vw, 1rem)', fontWeight: 500, color: '#2c3e50' }}>Fees</span>
                    <Button type="button" onClick={() => setFeesVisible(!feesVisible)} aria-label={feesVisible ? 'Hide Fees' : 'Show Fees'}>
                      {feesVisible ? <FaMinus /> : <FaPlus />}
                    </Button>
                  </div>
                  {feesVisible &&
                    formData.fees.map((fee, index) => (
                      <FeeGrid key={index}>
                        <FormGroup>
                          <Label htmlFor={`feeType-${index}`}>Fee Type</Label>
                          <Input
                            id={`feeType-${index}`}
                            placeholder="Fee Type"
                            value={fee.feeType}
                            onChange={(e) => handleFeeChange(index, 'feeType', e.target.value)}
                            aria-label={`Fee Type ${index + 1}`}
                          />
                        </FormGroup>
                        <FormGroup>
                          <Label htmlFor={`dueDate-${index}`}>Due Date</Label>
                          <Input
                            id={`dueDate-${index}`}
                            type="date"
                            placeholder="Due Date"
                            value={fee.dueDate}
                            onChange={(e) => handleFeeChange(index, 'dueDate', e.target.value)}
                            aria-label={`Due Date ${index + 1}`}
                          />
                        </FormGroup>
                        <div style={{ display: 'flex', gap: 'clamp(0.8rem, 2vw, 1rem)' }}>
                          <FormGroup style={{ flex: 1 }}>
                            <Label htmlFor={`amount-${index}`}>Amount</Label>
                            <Input
                              id={`amount-${index}`}
                              type="number"
                              placeholder="Amount"
                              value={fee.amount}
                              onChange={(e) => handleFeeChange(index, 'amount', e.target.value)}
                              aria-label={`Amount ${index + 1}`}
                            />
                          </FormGroup>
                          {index > 0 && (
                            <Button
                              type="button"
                              style={{ background: 'linear-gradient(45deg, #e74c3c, #c0392b)', marginTop: '1.5rem' }}
                              onClick={() => removeFee(index)}
                              aria-label={`Remove Fee ${index + 1}`}
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                      </FeeGrid>
                    ))}
                  {feesVisible && (
                    <Button type="button" onClick={addFee} style={{ marginTop: 'clamp(0.8rem, 2vw, 1rem)' }} aria-label="Add Fee">
                      Add Fee
                    </Button>
                  )}
                </FeeSection>

                <SectionTitle>Parent & Guardian Details</SectionTitle>
                {(['father', 'mother'] as const).map((parent) => (
                  <div key={parent}>
                    <SectionTitle style={{ fontSize: 'clamp(1rem, 3vw, 1.2rem)' }}>
                      {parent.charAt(0).toUpperCase() + parent.slice(1)} Details
                    </SectionTitle>
                    <GridSection>
                      <FormGroup>
                        <Label htmlFor={`${parent}-name`}>{parent.charAt(0).toUpperCase() + parent.slice(1)} Name</Label>
                        <Input
                          id={`${parent}-name`}
                          placeholder={`${parent.charAt(0).toUpperCase() + parent.slice(1)} Name`}
                          name="name"
                          value={formData.parents[parent].name}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e, 'parents', parent)}
                          aria-label={`${parent.charAt(0).toUpperCase() + parent.slice(1)} Name`}
                        />
                      </FormGroup>
                      <FormGroup>
                        <Label htmlFor={`${parent}-phone`}>{parent.charAt(0).toUpperCase() + parent.slice(1)} Phone</Label>
                        <Input
                          id={`${parent}-phone`}
                          placeholder={`${parent.charAt(0).toUpperCase() + parent.slice(1)} Phone`}
                          name="phone"
                          value={formData.parents[parent].phone}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e, 'parents', parent)}
                          aria-label={`${parent.charAt(0).toUpperCase() + parent.slice(1)} Phone`}
                        />
                      </FormGroup>
                      <FormGroup>
                        <Label htmlFor={`${parent}-occupation`}>{parent.charAt(0).toUpperCase() + parent.slice(1)} Occupation</Label>
                        <Input
                          id={`${parent}-occupation`}
                          placeholder={`${parent.charAt(0).toUpperCase() + parent.slice(1)} Occupation`}
                          name="occupation"
                          value={formData.parents[parent].occupation}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e, 'parents', parent)}
                          aria-label={`${parent.charAt(0).toUpperCase() + parent.slice(1)} Occupation`}
                        />
                      </FormGroup>
                    </GridSection>
                  </div>
                ))}

                <SectionTitle>Additional Details</SectionTitle>
                <GridSection>
                  <FormGroup>
                    <Label htmlFor="aadharNumber">Aadhar Number</Label>
                    <Input
                      id="aadharNumber"
                      placeholder="Aadhar Number"
                      name="aadharNumber"
                      value={formData.additionalDetails.aadharNumber}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e, 'additionalDetails')}
                      aria-label="Aadhar Number"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="panNumber">PAN Number</Label>
                    <Input
                      id="panNumber"
                      placeholder="PAN Number"
                      name="panNumber"
                      value={formData.additionalDetails.panNumber}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e, 'additionalDetails')}
                      aria-label="PAN Number"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="tcNumber">TC Number</Label>
                    <Input
                      id="tcNumber"
                      placeholder="TC Number"
                      name="tcNumber"
                      value={formData.additionalDetails.tcNumber}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e, 'additionalDetails')}
                      aria-label="TC Number"
                    />
                  </FormGroup>
                </GridSection>

                <div style={{ display: 'flex', gap: 'clamp(0.8rem, 2vw, 1rem)', justifyContent: 'center', marginTop: 'clamp(0.8rem, 2vw, 1rem)' }}>
                  <Button type="submit" aria-label="Save Admission Form">Save</Button>
                  <Button
                    type="button"
                    style={{ background: 'linear-gradient(45deg, #e74c3c, #c0392b)' }}
                    onClick={() => setShowForm(false)}
                    aria-label="Cancel"
                  >
                    Cancel
                  </Button>
                </div>
              </FormContainer>
            </Modal>
          </>
        )}
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

export default StudentAdmissionForm;