'use client'
import React, { useState, useEffect } from 'react'
import styles from './Dashboard.module.scss'
import { Nav } from '../../ul/Nav/Nav'
import { Profile } from '../Profile/Profile'
import { Folders } from '../Folders/Folders'
import { RiPushpinLine } from "react-icons/ri";
import { AppDispatch, RootState } from '@/redux/store'
import { useDispatch, useSelector } from 'react-redux'
import { initializePin, setMousePin, setPin } from '@/redux/slices/pin'

export const Dashboard = () => {

    const dispatch = useDispatch<AppDispatch>();

    const isPinned = useSelector((state: RootState) => state.pin.pin);
    const isMouse = useSelector((state: RootState) => state.pin.mousePin);

    useEffect(() => {
        dispatch(initializePin());
    }, [dispatch]);

    const togglePin = () => {
      dispatch(setPin(!isPinned));
    };

    const handleMouseEnter = () => {
        if (!isPinned) {
            dispatch(setMousePin(true));
        }
    };

    const handleMouseLeave = () => {
        if (!isPinned) {
            dispatch(setMousePin(false));
        }
    };

  return (
    <div 
    onMouseEnter={handleMouseEnter} 
    onMouseLeave={handleMouseLeave}
    className={`${styles.dashboard} ${isMouse || isPinned ? `${styles.active_dashboard}` : ''}`}>

        <div className={styles.blur}></div>

        <button className={`${styles.pin} ${isPinned ? `${styles.active_color}` : ''}`} onClick={togglePin}>
            <RiPushpinLine />
        </button>

        <Profile />

        <div className={styles.main}>

            <Nav />

            <Folders />

        </div>

    </div>
  )

}
