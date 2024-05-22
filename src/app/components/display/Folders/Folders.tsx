'use client'
import React, { useRef, useState, useEffect } from 'react'
import styles from './Folders.module.scss'

import { IoMdAddCircleOutline } from "react-icons/io";
import Link from 'next/link';

import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { useFolderContext } from '@/app/context/FolderContext';
import instance from '@/service';
import { foldersAll } from '@/redux/slices/tasks';
import { usePathname } from 'next/navigation';
import { setOpenFolder } from '@/redux/slices/pin';

export const Folders = () => {

    const { folderName } = useFolderContext();

    const useList = useRef<HTMLUListElement | null>(null);
    const [folder, setFolder] = useState<Boolean>(false);
    const [isLoader, setIsLoader] = useState(true);

    const dispatch = useDispatch<AppDispatch>();
    const foldersSlice  = useSelector((state: RootState) => state.tasks.folders)
    const { items } = foldersSlice;

    const pageNameId = usePathname().replace('/planner/folder/', '');

    useEffect(() => {
        dispatch(foldersAll());
        setIsLoader(false)
    }, [dispatch]);

    const toggleFolder = () => {
        if(useList.current) {
            const newHeight = folder ? '0px' : `${useList.current.scrollHeight}px`;
            useList.current.style.maxHeight = newHeight;
            setFolder(!folder);
        }
    }

    const handFolderClick = (e: any) => {
      e.stopPropagation()
      dispatch(setOpenFolder(true))
    }

    useEffect(() => {
      if(!folderName) return;

      const createFolderFetch = async () => {
        try {
             await instance.post('/folders', { name: folderName });

            dispatch(foldersAll());
            setIsLoader(false)
        } catch (err) {
            console.warn('Error creating folder', err);
        }
     }

     createFolderFetch()
    }, [folderName]);


    useEffect(() => {
      if (useList.current && folder) {
          const newHeight = `${useList.current.scrollHeight}px`;
          useList.current.style.maxHeight = newHeight;
      }
    }, [folder, toggleFolder]);

  return (
    <div className={styles.folder_block}>

        <div className={styles.lists_block}>
            <button className={styles.top} onClick={toggleFolder}>My lists</button>

            {folder ?
                <div onClick={handFolderClick}><IoMdAddCircleOutline /></div>
                :  
                <span>{items.length}</span>
            }
        </div>

        <ul ref={useList} className={styles.folders} style={{maxHeight: '0px',}}>

        {isLoader ? (
            <div>Loading...</div>
          ) : (
            items.map((folder: any, index: number) => 
            <li key={index} className={pageNameId === folder?._id ? `${styles.activeFolderNav}` : ''}>
               <Link 
                  href={`/planner/folder/${folder?._id}`}>
                  {folder?.name.length >= 20 ? `${folder?.name.substring(0, 15).trim()}...` : folder?.name.trim()} 
                  {folder?.tasks.filter((task: any) => !task.done).length !== 0 && <span>
                    {folder?.tasks.filter((task: any) => !task.done).length < 99 ? folder?.tasks.filter((task: any) => !task.done).length : '99+'}
                  </span>}
                </Link>
            </li>
            )
        )}

        </ul>

    </div>
  )
}
