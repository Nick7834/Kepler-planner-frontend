'use client';
import React, { useEffect, useState } from 'react';
import styles from './FolderPage.module.scss';

import { FaRegTrashCan } from "react-icons/fa6";
import { AllTaskFolder } from '../AllTaskFolder/AllTaskFolder';
import { TaskDetail } from '../TaskDetail/TaskDetail';
import instance from '@/service';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { deleteFolder, fetchFolderById, fetchTasks, foldersAll, updateTasksForFolder } from '@/redux/slices/tasks';
import { useRouter } from 'next/navigation';
import { Loader } from '../Loader/Loader';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface FolderProps {
  idFolder: string,
}

export const FolderPage = ({ idFolder }: FolderProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter(); 

  const folderData = useSelector((state: RootState) => 
    state.tasks.folders.items.find((folder: any) => folder._id === idFolder)
  );

  const [name, setFolderName] = useState('');
  const [isLoader, setIsLoader] = useState(true);

  const isPinned = useSelector((state: RootState) => state.pin.pin);
  const isMouse = useSelector((state: RootState) => state.pin.mousePin);

  useEffect(() => {
    if (!idFolder) return;

    const loadFolderData = async () => {
        try {
            setIsLoader(true); 
            const result = await dispatch(fetchFolderById(idFolder));

            if (!result.payload || Object.keys(result.payload).length === 0) {
                router.replace('/planner/myday'); 
                return;
            }

            await dispatch(foldersAll());
        } catch (err) {
            console.warn("Error:", err);
            router.replace('/planner/myday'); 
        } finally {
            setIsLoader(false); 
        }
    };

    loadFolderData();
}, [dispatch, idFolder, router]);

useEffect(() => {
    if (folderData) {
        setFolderName(folderData.name || '');
    }
}, [folderData]);

  const delFolderNow = async (id: string) => {
    try {

      if (folderData.importance === 'importance') {
        toast.error('The default folder cannot be deleted!', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
        return;
      }

      await dispatch(deleteFolder(id));
      router.replace('/planner/myday');
    } catch (error) {
      console.error('An error occurred when deleting the folder:', error);
      toast.error('An error occurred when deleting the folder!', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };

  const patchFolder = async (id: string) => {
    if (!name.trim() || name === folderData?.name) return;

    const updatedFolder = { name };

    try {
      await instance.patch(`/folders/${id}`, updatedFolder);
      await dispatch(foldersAll());
      await dispatch(fetchTasks());
      await dispatch(updateTasksForFolder(id));
    } catch (error) {
      console.error('An error occurred when updating the folder:', error);
    }
  };

  return (
    <div className={`${styles.folder} ${isPinned || isMouse ? 'active_left' : ''}`}>
      <div className={styles.folder_main}>
        <div className={styles.top}>
          <input 
            type="text" 
            value={name}
            onChange={e => setFolderName(e.target.value)}
            onBlur={() => patchFolder(idFolder)}
          />
          <button onClick={() => delFolderNow(idFolder)}><FaRegTrashCan /></button>
        </div>

        <div className={styles.blocks}>
          {isLoader && <Loader />}
          <AllTaskFolder idFolderTask={idFolder} taskFolder={folderData} />
          {folderData?.tasks.length > 0 && (
            <TaskDetail taskDefault={folderData} folderId={idFolder} folderName={name} />
          )}
        </div>
      </div>
    </div>
  );
};
