'use client'
import React, { useEffect, useState } from 'react'
import styles from './FoldersMob.module.scss'
import { useRouter } from 'next/navigation'
import { IoAdd } from "react-icons/io5";
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { Loader } from '../Loader/Loader';
import { setOpenFolder } from '@/redux/slices/pin';

export const FoldersMob = () => {

    const dispatch = useDispatch<AppDispatch>();
    const foldersSlice  = useSelector((state: RootState) => state.tasks.folders)
    const { items } = foldersSlice;

    const router = useRouter();

    useEffect(() => {

        const checkWidth = () => {
            if (window.innerWidth > 1000) {
                router.replace('/planner/myday');
            }
        };
    
        checkWidth();

        const resize = () => {
            const currentWidth = window.innerWidth;

            if (currentWidth > 1000) {
                router.replace('/planner/myday');
            }
        }

        window.addEventListener('resize', resize);

        return () => {
            window.removeEventListener('resize', resize);
        }

    }, [router])


  return (
    <div className={styles.folders_list}>

        <h1>My Lists</h1>   

        <div className={styles.folders}>

            {items.length === 0 && <Loader />}

            {items.map((folder: any, index: number) => (
                <Link key={index} href={`/planner/folder/${folder?._id}`}>
                    {folder?.name.length >= 20 ? `${folder?.name.substring(0, 15).trim()}...` : folder?.name.trim()}
                    {folder?.tasks.filter((task: any) => !task.done).length !== 0 && 
                    <span>{folder?.tasks.filter((task: any) => !task.done).length < 99 ? folder?.tasks.filter((task: any) => !task.done).length : '99+'}</span>}
                </Link>
            ))}

            <button onClick={() => dispatch(setOpenFolder(true))}><IoAdd /></button>

        </div>

    </div>
  )
}
