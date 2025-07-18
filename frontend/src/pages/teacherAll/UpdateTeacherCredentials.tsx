// src/components/UpdateTeacherCredentials.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import Popup from '../../components/Popup.tsx';
import { updateTeacherCredentials } from '../../redux/teacherRelated/teacherHandle';

const UpdateTeacherCredentials = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentUser, status, response, error } = useSelector((state: any) => state.user);
  const { loading } = useSelector((state: any) => state.teacher);

  const [username, setUsername] = useState(currentUser?.username || '');
  const [password, setPassword] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState('');
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setUsername(currentUser.username || '');
    }
  }, [currentUser]);

  useEffect(() => {
    if (status === 'success') {
      setMessage('Credentials updated successfully');
      setShowPopup(true);
      setLoader(false);
      setPassword('');
    } else if (status === 'failed') {
      setMessage(response || 'Failed to update credentials');
      setShowPopup(true);
      setLoader(false);
    } else if (status === 'error') {
      setMessage('Network Error');
      setShowPopup(true);
      setLoader(false);
    }
  }, [status, response, navigate]);

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    if (!currentUser?._id) {
      setMessage('User not authenticated');
      setShowPopup(true);
      return;
    }
    if (!username || !password) {
      setMessage('Username and password are required');
      setShowPopup(true);
      return;
    }

    const fields = { username, password };
    setLoader(true);
    dispatch(updateTeacherCredentials({ teacherId: currentUser._id, adminID: currentUser._id, formData: fields }));
  };

  return (
    <Box sx={{ padding: '20px', maxWidth: '600px', margin: '0 auto', mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 2, textAlign: 'center', color: '#333' }}>
        Update Your Credentials
      </Typography>
      <Box component="form" onSubmit={submitHandler}>
        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            backgroundColor: '#333333',
            color: 'white',
            padding: '12px 24px',
            fontWeight: 'bold',
            '&:hover': { backgroundColor: '#555555' },
          }}
          disabled={loader || loading || !currentUser}
        >
          {loader ? <CircularProgress size={24} color="inherit" /> : 'Update Credentials'}
        </Button>
      </Box>
      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </Box>
  );
};

export default UpdateTeacherCredentials;