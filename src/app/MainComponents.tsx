'use client'
import React, { useEffect, ReactNode } from 'react'

import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { fetchAuthMe, isAuth } from '@/redux/slices/auth';

const MainComponents = ({ children }: { children: ReactNode }) => {

  useEffect(() => {
    document.body.classList.remove('no-scroll');
  }, []);

  const dispatch = useDispatch<AppDispatch>();
  let isAuths = useSelector(isAuth);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(fetchAuthMe());
    }
  }, [dispatch]);

  return (
    <div className="wrapper">
      {children}
    </div>
  )
}

export default MainComponents;