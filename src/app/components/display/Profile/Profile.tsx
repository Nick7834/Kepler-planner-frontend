'use client'
import React, { useState, useEffect } from 'react'
import styles from './Profile.module.scss'
import Image from 'next/image';
import ModalAutch from '../ModalAutch/ModalAutch';

import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchAuthMe } from '@/redux/slices/auth';
import useKeyPress from '@/app/hooks/useKeyPress';


export const Profile = () => {
    
    const user = useSelector((state: RootState) => state.auth.data) as any;
  
    const [profile, setProfile] = useState(false);

    const closeProfiveModal = () => {
      setProfile(false)
    }

    useKeyPress('p', !profile, () => setProfile(!profile));

    // new year 

    const currentYear = new Date();
    
    const start = new Date(currentYear.getFullYear(), 11, 1);
    const end = new Date(currentYear.getFullYear() + 1, 0, 15);

    const isInSeason = currentYear >= start && currentYear <= end;

  return (
    <div className={styles.profile}>

        <button className={styles.button} onClick={() => setProfile(!profile)}>
            {isInSeason && <Image src='/year.png' width={50} height={50} className='absolute -top-[18px] -left-[19px]' alt='avatar'></Image>}
            {!user?.avatarUrl.length ? 
                <span></span>
                :
                <Image src={user?.avatarUrl && `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5555'}${user?.avatarUrl}`} width={40} height={40} alt='avatar' className={styles.img_p}></Image>
            }
            <p>{user?.fullName.length > 10 ? user?.fullName.slice(0, 10) + '...' : user?.fullName}</p>
        </button>

        <ModalAutch open={profile} closeModal={closeProfiveModal} />

    </div>
  )
}
