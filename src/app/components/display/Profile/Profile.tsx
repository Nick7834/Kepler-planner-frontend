'use client'
import React, { useState, useEffect } from 'react'
import styles from './Profile.module.scss'
import Image from 'next/image';
import ModalAutch from '../ModalAutch/ModalAutch';

import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchAuthMe } from '@/redux/slices/auth';


export const Profile = () => {
    
    const user = useSelector((state: RootState) => state.auth.data) as any;
  
    const [profile, setProfile] = useState(false);

    const closeProfiveModal = () => {
      setProfile(false)
    }

  return (
    <div className={styles.profile}>

        <button className={styles.button} onClick={() => setProfile(!profile)}>
            {!user?.avatarUrl.length ? 
                <span></span>
                :
                <Image src={user?.avatarUrl && `${process.env.NEXT_PUBLIC_API_URL}${user?.avatarUrl}`} width={40} height={40} alt='avatar'></Image>
            }
            <p>{user?.fullName}</p>
        </button>

        <ModalAutch open={profile} closeModal={closeProfiveModal} />

    </div>
  )
}
