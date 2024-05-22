'use client'
import React, { useEffect, useState } from 'react';
import styles from './FolderPage.module.scss';

import { FaRegTrashCan } from "react-icons/fa6";
import { AllTaskFolder } from '../AllTaskFolder/AllTaskFolder';
import { TaskDetail } from '../TaskDetail/TaskDetail';
import instance from '@/service'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/redux/store'
import { fetchFolderById, foldersAll } from '@/redux/slices/tasks';
import { redirect, useRouter } from 'next/navigation';
import { Loader } from '../Loader/Loader';

interface folder {
  idFolder: String,
}

export const FolderPage = ({ idFolder }: folder) => {

  const dispatch = useDispatch<AppDispatch>();
  
  const folderData = useSelector((state: RootState) => state.tasks.folders.items.find((folder: any) => folder._id === idFolder));

  const isPinned = useSelector((state: RootState) => state.pin.pin);
  const isMouse = useSelector((state: RootState) => state.pin.mousePin);

  const [name, setFolderName] = useState('');

  const [isLoader, setIsLoader] = useState(true);

  const router = useRouter(); 

  useEffect(() => {
    if (!folderData) return;

    if (idFolder !== folderData._id) {
      router.replace('/planner/myday'); 
    }
  }, [idFolder, folderData, router]);

  useEffect(() => {
    if(!idFolder) return;

    const dataIdFolder = async () => {
      
      try {
        dispatch(fetchFolderById(idFolder));
        dispatch(foldersAll())
        setIsLoader(false)
      } catch (err) {
        console.warn("Error:", err);
      }

    }

    dataIdFolder()

  }, [dispatch, idFolder]);

  useEffect(() => {
    if (folderData) {
      setFolderName(folderData?.name);
    }
  }, [folderData]);

  ///

  const delFolderNow = async (id: any) => {
    try {
      await instance.delete(`/folders/${id}`);
      dispatch(foldersAll());
      setIsLoader(false)
      setIsLoader(false)
      router.replace('/planner/myday');
    } catch (error) {
      console.error('An error occurred when deleting the folder!!:', error)
    }
  }

  const patchFolder = async (id: any) => {

    if(!folderData?.name.trim()) return;

    const updatedFolder = {
      name,
    }

      if (name !== folderData?.name) {
          try {
              await instance.patch(`/folders/${id}`, updatedFolder);
              dispatch(foldersAll());
          } catch (error) {
              console.error('An error occurred when updating the folder:', error);
          }
      }

  }

  return (
    <div className={`${styles.folder} ${isPinned || isMouse ? 'active_left' : ''}`}>

      <div className={styles.folder_main}>

          <div className={styles.top}>
              
              <input 
                type="text" 
                value={name}
                onChange={e => setFolderName(e.target.value)}
                onBlur={() => patchFolder(folderData._id)}
              />

              <button onClick={() => delFolderNow(idFolder)}><FaRegTrashCan /></button>

          </div>

          <div className={styles.blocks}>
              <AllTaskFolder idFolderTask={idFolder} taskFolder={folderData}  />

              {isLoader ? 
              (<Loader />) 
              : 
              (folderData?.tasks.length > 0) && (
                <TaskDetail taskDefault={folderData} folderId={idFolder} />
              )}
          </div>

      </div>

    </div>
  )
}
