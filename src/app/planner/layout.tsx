/* eslint-disable react/jsx-no-undef */
'use client'
import React, { useState, useEffect, ReactNode } from 'react'
import { Dashboard } from '../components/display/Dashboard/Dashboard';

import { redirect, usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { isAuth } from '@/redux/slices/auth';
import { taskToday } from '@/redux/slices/tasks';
import { AppDispatch, RootState } from '@/redux/store';
import { AddFolder } from '../components/display/AddFolder/AddFolder';
import Providers from '../providers';
import { TaskDetailModal } from '../components/display/TaskDetailModal/TaskDetailModal';
import { TaskProvider } from '../context/TaskContext';
import { FolderProvider } from '../context/FolderContext';
import { DelConfirm } from '../components/display/DelСonfirm/DelConfirm';
import { ConfirmProvider } from '../context/ConfirmContext';
import { SearchBlock } from '../components/display/SearchBlock/SearchBlock';
import { MobMenu } from '../components/ul/MobMenu/MobMenu';
import { setOpenFolder } from '@/redux/slices/pin';
import { Profile } from '../components/display/Profile/Profile';
import { SearchBackgroundMain } from '../components/display/SearchBackgroundMain/SearchBackgroundMain';
import { ToastContainer, toast } from 'react-toastify';

export default function RootPlaner({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {

  useEffect(() => {
    document.body.classList.add('no-scroll');
    return () => {
        document.body.classList.remove('no-scroll');
    };
}, []);

  const dispatch = useDispatch<AppDispatch>();

  const user = useSelector((state: RootState) => state.auth.data) as any; 
  const isOpenFolder = useSelector((state: RootState) => state.pin.openFolder)

  const isAuths = useSelector(isAuth);

  useEffect(() => {
    if (!window.localStorage.getItem('token') && !isAuths) {
      redirect('/'); 
    }
  }, [isAuths, redirect]);

  const closeModal = () => {
    dispatch(setOpenFolder(false));
  }

  return (
    <div>
      <Providers enableSystem={false} attribute="data-theme">

        <FolderProvider>
          <TaskProvider>
            <ConfirmProvider>

              <div className='app'>

                <div className='background' 
                style={{backgroundImage: user?.backgroundImage && 
                `url(${user?.backgroundImage.startsWith('/backgrounds/') ? 
                `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5555'}${user?.backgroundImage}` 
                : `${user?.backgroundImage}.jpg`})`}}></div>

                <Dashboard />

                <AddFolder openModalFolder={isOpenFolder} closeModal={closeModal} /> 

                <TaskDetailModal />

                <DelConfirm />

                <div className="mains">
                    {children}
                </div>

                <div className="main__top-p">
                  <Profile />
                </div>

                <SearchBlock />

                <MobMenu />

                <SearchBackgroundMain />

                <ToastContainer
                  position="top-right"
                  autoClose={2000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme="dark"
                />

              </div>

            </ConfirmProvider>
          </TaskProvider>
        </FolderProvider>
          
      </Providers>

    </div>
  );
}
