import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearUser } from '../redux/userRelated/userSlice';

const Logout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    localStorage.removeItem('token');
    dispatch(clearUser());
    navigate('/login');
  }, [dispatch, navigate]);

  return null;
};

export default Logout;