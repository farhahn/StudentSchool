// // frontend/src/pages/Admin/AssignTeacherSubjectClass.js
// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import { Box, Button, Grid, Typography } from '@mui/material';
// import Select from 'react-select';
// import { getAllTeachers, assignTeacherSubject, assignTeacherClass } from '../../redux/TeacherAllRelated/formHandle';
// import { getSubjectives } from '../../redux/subjective/subjectiveHandle'; // Assume exists
// import { getClasses } from '../../redux/fclass/fclassHandle'; // Assume exists

// const AssignTeacherSubjectClass = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { currentUser } = useSelector((state) => state.user);
//   const { teachers, loading, error } = useSelector((state) => state.teacherForm);
//   const { subjectives } = useSelector((state) => state.subjective); // Assume subjective slice
//   const { classes } = useSelector((state) => state.class); // Assume class slice
//   const adminID = currentUser?._id || '681586cd99e5ea0012e4ea1c';

//   const [selectedTeacher, setSelectedTeacher] = useState(null);
//   const [selectedSubject, setSelectedSubject] = useState(null);
//   const [selectedClass, setSelectedClass] = useState(null);

//   useEffect(() => {
//     dispatch(getAllTeachers(adminID));
//     dispatch(getSubjectives(adminID));
//     dispatch(getClasses(adminID));
//   }, [dispatch, adminID]);

//   useEffect(() => {
//     if (error) {
//       toast.error(error, { position: 'top-right', autoClose: 3000 });
//     }
//   }, [error]);

//   const handleAssign = async () => {
//     if (!selectedTeacher) {
//       toast.warn('Please select a teacher', { position: 'top-right', autoClose: 3000 });
//       return;
//     }
//     if (!selectedSubject && !selectedClass) {
//       toast.warn('Please select a subject or class', { position: 'top-right', autoClose: 3000 });
//       return;
//     }
//     try {
//       if (selectedSubject) {
//         await dispatch(assignTeacherSubject({ teacherId: selectedTeacher.value, teachSubject: selectedSubject.value }));
//         toast.success('Subject assigned successfully', { position: 'top-right', autoClose: 3000 });
//       }
//       if (selectedClass) {
//         await dispatch(assignTeacherClass({ teacherId: selectedTeacher.value, teachClass: selectedClass.value }));
//         toast.success('Class assigned successfully', { position: 'top-right', autoClose: 3000 });
//       }
//       navigate('/Admin/teachers');
//     } catch (err) {
//       toast.error('Assignment failed', { position: 'top-right', autoClose: 3000 });
//     }
//   };

//   const teacherOptions = teachers.map((teacher) => ({
//     value: teacher._id,
//     label: teacher.fullName,
//   }));
//   const subjectOptions = subjectives?.map((subject) => ({
//     value: subject._id,
//     label: subject.name,
//   })) || [];
//   const classOptions = classes?.map((cls) => ({
//     value: cls._id,
//     label: cls.name,
//   })) || [];

//   const selectStyles = {
//     control: (base) => ({
//       ...base,
//       height: 56,
//       minHeight: 56,
//       borderRadius: 4,
//       borderColor: '#ccc',
//       boxShadow: 'none',
//       '&:hover': { borderColor: '#888' },
//     }),
//     menu: (base) => ({
//       ...base,
//       zIndex: 9999,
//     }),
//   };

//   return (
//     <Box sx={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
//       <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 4 }}>
//         Assign Subject/Class to Teacher
//       </Typography>
//       <Grid container spacing={3}>
//         <Grid item xs={12}>
//           <Typography sx={{ fontWeight: '500', mb: 1 }}>Select Teacher *</Typography>
//           <Select
//             options={teacherOptions}
//             value={selectedTeacher}
//             onChange={setSelectedTeacher}
//             placeholder="Select Teacher"
//             isSearchable
//             styles={selectStyles}
//           />
//         </Grid>
//         <Grid item xs={12}>
//           <Typography sx={{ fontWeight: '500', mb: 1 }}>Select Subject</Typography>
//           <Select
//             options={subjectOptions}
//             value={selectedSubject}
//             onChange={setSelectedSubject}
//             placeholder="Select Subject"
//             isSearchable
//             isClearable
//             styles={selectStyles}
//           />
//         </Grid>
//         <Grid item xs={12}>
//           <Typography sx={{ fontWeight: '500', mb: 1 }}>Select Class</Typography>
//           <Select
//             options={classOptions}
//             value={selectedClass}
//             onChange={setSelectedClass}
//             placeholder="Select Class"
//             isSearchable
//             isClearable
//             styles={selectStyles}
//           />
//         </Grid>
//         <Grid item xs={12}>
//           <Button
//             variant="contained"
//             sx={{
//               backgroundColor: '#333333',
//               color: 'white',
//               padding: '12px 24px',
//               fontWeight: 'bold',
//               borderRadius: '5px',
//               '&:hover': { backgroundColor: '#555555' },
//             }}
//             onClick={handleAssign}
//             disabled={loading}
//           >
//             {loading ? 'Assigning...' : 'Assign'}
//           </Button>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// };

// export default AssignTeacherSubjectClass;