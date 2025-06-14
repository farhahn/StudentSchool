const React = require('react')
const { useState, useEffect } = React;
const { useDispatch, useSelector } = require('react-redux');
const { toast, ToastContainer } = require('react-toastify');
require('react-toastify/dist/ReactToastify.css');
const styled = require('styled-components').default;
const {
  generateInstallmentPlan,
  fetchQuickFeesOptions,
} = require('../../../redux/StudentAddmissionDetail/studentAddmissionHandle');

const Container = styled.div`
  font-family: 'Poppins', sans-serif;
  padding: 2rem;
  max-width: 800px;
  margin: 2rem auto;
  background-color: #e8c897;
  border-radius: 12px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
`;

const Header = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  position: relative;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const Input = styled.input`
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  font-size: 0.875rem;
  width: 100%;
  transition: all 0.2s ease;
  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }
`;

const Select = styled.select`
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  font-size: 0.875rem;
  background-color: white;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%234b5563'%3e%3cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1rem;
`;

const Button = styled.button`
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  padding: 0.875rem 1.5rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 6px -1px rgba(99, 102, 241, 0.2);
  }
`;

const Required = styled.span`
  color: #ef4444;
  font-size: 0.75rem;
`;

const Icon = styled.svg`
  width: 20px;
  height: 20px;
`;

const QuickFeesMaster = () => {
  const dispatch = useDispatch();
  const admissionFormsState = useSelector((state) => state.admissionForms);
  const quickFeesOptions = admissionFormsState?.quickFeesOptions ?? { classes: [], sections: [], students: [] };
  const loading = admissionFormsState?.loading ?? false;
  const error = admissionFormsState?.error ?? null;
  const { currentUser } = useSelector((state) => state.user);
  const adminID = currentUser?._id;

  const [formData, setFormData] = useState({
    classId: '',
    section: '',
    studentId: '',
    totalFees: '',
    firstInstallment: '',
    balanceFees: '',
    installments: '1',
    dueDateDay: '3',
    fineType: 'Fix Amount',
    fineValue: '',
  });

  const { classes = [], sections = [], students = [] } = quickFeesOptions;

  // Debug data fetching and filtering
  useEffect(() => {
    console.log('QuickFeesMaster Redux state:', {
      admissionFormsState,
      quickFeesOptions,
      classes,
      sections,
      students,
      loading,
      error,
    });
    if (adminID) {
      dispatch(fetchQuickFeesOptions(adminID));
    } else {
      toast.error('Please log in to generate fees plans', { position: 'top-right', autoClose: 3000 });
    }
  }, [dispatch, adminID]);

  // Debug form data changes
  useEffect(() => {
    console.log('Form data updated:', formData);
    console.log('Filtered students:', students.filter(
      (student) => student.classId === formData.classId && student.section === formData.section
    ));
  }, [formData, students]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.classId || !formData.section || !formData.studentId || !formData.totalFees || !formData.balanceFees || !formData.dueDateDay) {
      toast.error('Please fill all required fields', { position: 'top-right', autoClose: 3000 });
      return;
    }

    if (!adminID) {
      toast.error('Please log in to perform this action', { position: 'top-right', autoClose: 3000 });
      return;
    }

    const totalFees = parseFloat(formData.totalFees);
    const firstInstallment = parseFloat(formData.firstInstallment) || 0;
    const balanceFees = parseFloat(formData.balanceFees);

    if (totalFees !== firstInstallment + balanceFees) {
      toast.error('Total fees must equal first installment plus balance fees', { position: 'top-right', autoClose: 3000 });
      return;
    }

    if (formData.fineType !== 'Fix Amount' && formData.fineType !== 'Percentage') {
      toast.error('Invalid fine type', { position: 'top-right', autoClose: 3000 });
      return;
    }

    if (formData.fineValue && parseFloat(formData.fineValue) < 0) {
      toast.error('Fine value cannot be negative', { position: 'top-right', autoClose: 3000 });
      return;
    }

    const payload = {
      classId: formData.classId,
      section: formData.section,
      studentId: formData.studentId,
      totalFees,
      firstInstallment,
      balanceFees,
      installments: parseInt(formData.installments),
      dueDateDay: parseInt(formData.dueDateDay),
      fineType: formData.fineType,
      fineValue: parseFloat(formData.fineValue) || 0,
      adminID,
    };

    try {
      await dispatch(generateInstallmentPlan(payload)).unwrap();
      toast.success('Installment plan generated successfully', { position: 'top-right', autoClose: 3000 });
      setFormData({
        classId: '',
        section: '',
        studentId: '',
        totalFees: '',
        firstInstallment: '',
        balanceFees: '',
        installments: '1',
        dueDateDay: '3',
        fineType: 'Fix Amount',
        fineValue: '',
      });
    } catch (error) {
      toast.error(`Failed to generate installment plan: ${error}`, { position: 'top-right', autoClose: 3000 });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'classId' ? { section: '', studentId: '' } : {}),
      ...(name === 'section' ? { studentId: '' } : {}),
    }));
  };

  // Filter sections based on selected class
  const filteredSections = formData.classId
    ? classes.find((cls) => cls._id === formData.classId)?.sections || []
    : [];

  // Filter students based on selected class and section
  const filteredStudents = students.filter(
    (student) => {
      const matchesClass = student.classId === formData.classId;
      const matchesSection = student.section === formData.section;
      console.log('Filtering student:', { student, classId: formData.classId, section: formData.section, matchesClass, matchesSection });
      return matchesClass && matchesSection;
    }
  );

  return (
    React.createElement(React.Fragment, null,
      React.createElement('link', {
        href: 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap',
        rel: 'stylesheet'
      }),
      React.createElement(Container, null,
        React.createElement(ToastContainer, { position: 'top-right', autoClose: 3000 }),
        React.createElement(Header, null,
          React.createElement(Icon, {
            fill: 'none',
            stroke: 'currentColor',
            viewBox: '0 0 24 24'
          },
            React.createElement('path', {
              strokeLinecap: 'round',
              strokeLinejoin: 'round',
              strokeWidth: '2',
              d: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
            })
          ),
          'Quick Fees Master'
        ),

        error && React.createElement('div', {
          style: { color: '#e74c3c', textAlign: 'center', marginBottom: '1rem' }
        }, error),

        React.createElement('form', { onSubmit: handleSubmit },
          React.createElement(FormGrid, null,
            React.createElement(InputGroup, null,
              React.createElement(Label, null,
                'Class',
                React.createElement(Required, null, '*')
              ),
              React.createElement(Select, {
                name: 'classId',
                value: formData.classId,
                onChange: handleChange,
                required: true
              },
                React.createElement('option', { value: '' }, 'Select Class'),
                classes.map((cls) =>
                  React.createElement('option', { key: cls._id, value: cls._id }, cls.name)
                )
              )
            ),

            React.createElement(InputGroup, null,
              React.createElement(Label, null,
                'Section',
                React.createElement(Required, null, '*')
              ),
              React.createElement(Select, {
                name: 'section',
                value: formData.section,
                onChange: handleChange,
                required: true,
                disabled: !formData.classId
              },
                React.createElement('option', { value: '' }, 'Select Section'),
                filteredSections.map((section) =>
                  React.createElement('option', { key: section, value: section }, section)
                )
              )
            ),

            React.createElement(InputGroup, null,
              React.createElement(Label, null,
                'Student',
                React.createElement(Required, null, '*')
              ),
              React.createElement(Select, {
                name: 'studentId',
                value: formData.studentId,
                onChange: handleChange,
                required: true,
                disabled: !formData.section
              },
                React.createElement('option', { value: '' }, 'Select Student'),
                filteredStudents.length === 0 && formData.section
                  ? React.createElement('option', { value: '', disabled: true }, 'No students found')
                  : filteredStudents.map((student) =>
                      React.createElement('option', { key: student._id, value: student._id }, student.name)
                    )
              )
            )
          ),

          React.createElement(FormGrid, null,
            React.createElement(InputGroup, null,
              React.createElement(Label, null,
                'Total Fees',
                React.createElement(Required, null, '*')
              ),
              React.createElement('div', { style: { position: 'relative' } },
                React.createElement(Input, {
                  type: 'number',
                  name: 'totalFees',
                  value: formData.totalFees,
                  onChange: handleChange,
                  required: true,
                  placeholder: '0.00'
                }),
                React.createElement('span', {
                  style: {
                    position: 'absolute',
                    right: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#6b7280',
                    fontSize: '0.875rem'
                  }
                }, '₹')
              )
            ),

            React.createElement(InputGroup, null,
              React.createElement(Label, null, '1st Installment'),
              React.createElement(Input, {
                type: 'number',
                name: 'firstInstallment',
                value: formData.firstInstallment,
                onChange: handleChange,
                placeholder: '0.00'
              })
            ),

            React.createElement(InputGroup, null,
              React.createElement(Label, null,
                'Balance Fees',
                React.createElement(Required, null, '*')
              ),
              React.createElement(Input, {
                type: 'number',
                name: 'balanceFees',
                value: formData.balanceFees,
                onChange: handleChange,
                required: true,
                placeholder: '0.00'
              })
            ),

            React.createElement(InputGroup, null,
              React.createElement(Label, null, 'Installments'),
              React.createElement(Select, {
                name: 'installments',
                value: formData.installments,
                onChange: handleChange
              },
                [1, 2, 3, 4, 5, 6].map((num) =>
                  React.createElement('option', { key: num, value: num }, num)
                )
              )
            )
          ),

          React.createElement(FormGrid, null,
            React.createElement(InputGroup, null,
              React.createElement(Label, null, 'Due Date Day'),
              React.createElement('div', { style: { position: 'relative' } },
                React.createElement(Input, {
                  type: 'number',
                  name: 'dueDateDay',
                  value: formData.dueDateDay,
                  onChange: handleChange,
                  min: '1',
                  max: '31'
                }),
                React.createElement('span', {
                  style: {
                    position: 'absolute',
                    right: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#6b7280',
                    fontSize: '0.875rem'
                  }
                }, '📅')
              )
            ),

            React.createElement(InputGroup, null,
              React.createElement(Label, null, 'Fine Type'),
              React.createElement(Select, {
                name: 'fineType',
                value: formData.fineType,
                onChange: handleChange
              },
                React.createElement('option', { value: 'Fix Amount' }, 'Fix Amount'),
                React.createElement('option', { value: 'Percentage' }, 'Percentage')
              )
            ),

            React.createElement(InputGroup, null,
              React.createElement(Label, null, 'Fine Value'),
              React.createElement(Input, {
                type: 'number',
                name: 'fineValue',
                value: formData.fineValue,
                onChange: handleChange,
                placeholder: formData.fineType === 'Percentage' ? '%' : '₹'
              })
            )
          ),

          React.createElement(Button, { type: 'submit', disabled: loading },
            loading
              ? 'Generating...'
              : React.createElement(React.Fragment, null,
                  React.createElement(Icon, {
                    fill: 'none',
                    stroke: 'currentColor',
                    viewBox: '0 0 24 24'
                  },
                    React.createElement('path', {
                      strokeLinecap: 'round',
                      strokeLinejoin: 'round',
                      strokeWidth: '2',
                      d: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                    })
                  ),
                  'Generate Installment Plan'
                )
          )
        )
      )
    )
  );
};

module.exports = QuickFeesMaster;