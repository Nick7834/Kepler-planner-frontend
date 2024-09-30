'use client'
import React, { useEffect, useRef, useState } from 'react'
import styles from './AddFolder.module.scss'
import { IoClose } from "react-icons/io5";
import { useFolderContext } from '@/app/context/FolderContext';

interface modalFolder {
  openModalFolder: boolean;
  closeModal: () => void;
}

export const AddFolder = ({ openModalFolder, closeModal }:modalFolder) => {

  const { setFolderName } = useFolderContext()

  const [folderCreate, setFolderCreate] = useState<any>('');
  const modalFolser = useRef<HTMLDivElement | null>(null);

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

  }, [closeModal]);

  useEffect(() => {
    if(!openModalFolder) return;

    const closeWindow = (e: any) => {
      if(!modalFolser.current) return;
      if(modalFolser.current && !modalFolser.current.contains(e.target)) {
        closeModal()
      }
    }

    document.addEventListener('click', closeWindow);

    return () => {
      document.removeEventListener('click', closeWindow);
    }

  }, [closeModal, openModalFolder]);

  const createFolder = (e: any) => {
    e.preventDefault(); 

    setFolderName(folderCreate)

    setFolderCreate('')
    closeModal()
  }

  return (
    <div className={`${styles.addFolder} ${openModalFolder ? `${styles.open}` : ''}`}>

           <div ref={modalFolser} className={`${styles.modal} ${openModalFolder ? `${styles.openModal}` : ''}`}>
               <button onClick={closeModal} className={styles.close}><IoClose /></button>
              
                <form>
                  <input 
                    type="text" 
                    placeholder='Name Folder' 
                    value={folderCreate}
                    onChange={e => setFolderCreate(e.target.value)}
                  />

                  <button disabled={folderCreate.trim() === ''} onClick={createFolder}>Create</button>
                </form>
           </div>

    </div>
  )
}
