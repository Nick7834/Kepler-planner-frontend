'use client'
import React, { useState, useEffect, useRef, ChangeEvent } from 'react'
import styles from './ModalAutch.module.scss'
import { FaArrowLeftLong } from "react-icons/fa6";
import { useTheme } from 'next-themes'
import { BsMoonStarsFill } from "react-icons/bs";
import { HiSun } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import { IoSearchOutline } from "react-icons/io5";

import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchAuthMe, logout, authSlice, updateAvatar, isAuth } from '@/redux/slices/auth';
import instance from '@/service';
import Image from 'next/image';
import { setOpenBack } from '@/redux/slices/pin';

interface openProfile {
    open: Boolean,
    closeModal: () => void
}

const ModalAutch = ({ open, closeModal }: openProfile) => {
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector((state: RootState) => state.auth.data) as any; 

    const [tabs, setTabs] = useState(0);

    const [dark, setDark] = useState<boolean>(false);

    const { theme, setTheme } = useTheme();

    const profileRef = useRef<HTMLDivElement | null>(null);

    const [backList, setBackList] = useState([]);

    const getFetchBackground = async () => {
        try {
          const resp = await instance.get('/backgrounds');
          setBackList(resp.data);
        } catch(err) {
          console.error('Ошибка:', err);
      }
    }
    
    const handBack = async (back: string) => {

      const updateBack = {
        userId: user?._id,
        backgroundImage: back
      }

      try { 
        await instance.patch('/select-background', updateBack);
        dispatch(authSlice.actions.setBackground(back));
      } catch(err) {
        console.error('err:', err)
      }
    }

    useEffect(() => {

      const closeKey = (e: any) => {
        if(e.key === 'Escape') {
          closeModal()
        }
      }
  
      document.addEventListener('keydown', closeKey);
  
      return () => {
        document.removeEventListener('keydown', closeKey);
      }
  
    }, []);

    useEffect(() => {
      if(!open) return;
  
      const closeProfile = (e: any) => {
        if(!profileRef.current) return;
        if(profileRef.current && !profileRef.current.contains(e.target)) {
          closeModal()
        }
      }
  
      document.addEventListener('click', closeProfile);
  
      return () => {
        document.removeEventListener('click', closeProfile);
      }
  
    }, [open]);

    const handCloseMob = () => {
      closeModal()
    }

    const handOpenBackSearch = () => {
      closeModal();
      dispatch(setOpenBack(true))
    }

    const updateDarkState = (value: boolean) => {
      setDark(value);
      localStorage.setItem('dark', JSON.stringify(value));
    };
    
    useEffect(() => {
      const storedDark = localStorage.getItem('dark');

      if (storedDark) {
        updateDarkState(JSON.parse(storedDark));
      }
    }, []);

    const handDark = () => {
      updateDarkState(!dark);
      setTheme(theme === 'dark' ? 'light' : 'dark');
    }  

    const handAvatar = async (e: ChangeEvent<HTMLInputElement>) => {
        try {

          const fileData = new FormData();
          const fileTarget = e.target.files && e.target.files[0];

          if(fileTarget) {
            fileData.append('avatar', fileTarget);

            await dispatch(updateAvatar(fileData)).unwrap();

          } else {
            console.warn('Not file!')
          }

        } catch(err) {
          console.warn('Error loading the avatar!:', err)
        }
    }

    const Exit = () => {
        if(window.confirm('Are you sure you want to get out?')) {
          dispatch(logout());
          window.localStorage.removeItem('token');
        }
    }

  return (
    <div ref={profileRef} className={`${styles.modal_profile} ${open ? `${styles.active_profile}` : ''}`}>

        <button className={styles.close_mob} onClick={handCloseMob}><IoClose /></button>

        <div className={styles.buttons}>
            <button onClick={() => setTabs(1)}>My profile</button>
            <button onClick={() => {setTabs(2), getFetchBackground()}}>Background</button>
            <button onClick={() => setTabs(3)}>Theme</button>
            <a target='_blank' href="https://github.com/Nick7834">GitHub</a>
            <button onClick={Exit}>Exit</button>
        </div>

        <div className={`${styles.content} ${tabs === 2 ? `${styles.content_h}` : ''}`}>

            <div className={`${styles.blocks} ${styles.profile} ${tabs === 1 ? `${styles.active_tab}` : ''}`}>
                <button onClick={() => setTabs(0)} className={styles.back}><FaArrowLeftLong /></button>

                <h2>Profile</h2>

                <div className={styles.info}>
                    <div className={styles.avatar}>
                        <input type="file" id='file' onChange={handAvatar} />
                        <label htmlFor='file'>
                            {!user?.avatarUrl.length ? 
                             <span></span>
                             :  <Image src={user?.avatarUrl && `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5555'}${user?.avatarUrl}`} width={70} height={70} alt='avatar'></Image>}
                        </label>
                    </div>
                    <span className={styles.fullName}>{user?.fullName}</span>
                    <span>{user?.email}</span>
                </div>
            </div>

            <div className={`${styles.blocks} ${styles.background} ${tabs === 2 ? `${styles.active_tab}` : ''}`}>
                <button onClick={() => setTabs(0)} className={styles.back}><FaArrowLeftLong /></button>

                <h2>Background</h2>

                <button className={styles.open_s} onClick={handOpenBackSearch}><IoSearchOutline /></button>

                <div className={styles.cards}>
                    {user?.backgroundImage && !user?.backgroundImage.startsWith('/backgrounds/') && 
                    <div className={`${styles.card} ${user?.backgroundImage ? `${styles.activeBack}` : ''}`}>
                      <Image src={user?.backgroundImage} width={209} height={100} alt='img'></Image>
                    </div>}
                    {backList && backList.map((el, index) => (
                      <div key={index} className={`${styles.card} ${el === user?.backgroundImage ? `${styles.activeBack}` : ''}`} onClick={() => handBack(el)}><Image src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5555'}${el}`} width={209} height={100} alt='img'></Image></div>
                    ))}
                </div>
            </div>

            <div className={`${styles.blocks} ${styles.thema} ${tabs === 3 ? `${styles.active_tab}` : ''}`}>
                <button onClick={() => setTabs(0)} className={styles.back}><FaArrowLeftLong /></button>

                <h2>Thema</h2>

                <button className={`${styles.create} ${dark ? `${styles.active_dark}` : ''}`} onClick={handDark}>
                    <HiSun />
                    <BsMoonStarsFill />
                </button>

            </div>

        </div>
            
    </div>
  )
}

export default ModalAutch