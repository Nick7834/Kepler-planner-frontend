'use client'
import React, { useEffect, useState } from 'react';
import styles from './TaskTwo.module.scss'

import { BsCheck } from "react-icons/bs";
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { setTaskCheck, setTaskId } from '@/redux/slices/tasks';


export const TaskTwo = ({ taskData }: any) => {

    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();

    const gay = (id: string, folderId: string) => {
        dispatch(setTaskId(id));
        dispatch(setTaskCheck(true))
        router.push(`/planner/folder/${folderId}`)
    }

  return (
    <div onClick={() => gay(taskData?._id, taskData?.folderId)} className={styles.taskTwo}>
        
        <div className={styles.left}>
            <label className={styles.label}>
                <span className={styles.check}><BsCheck /></span>
            </label>
           <div className={styles.info}>
             <h4>{taskData?.title.length >= 50 ? `${taskData?.title.substring(0, 50).trim()}...` : taskData?.title.trim()}</h4>
             <p>{taskData?.folder}</p>
           </div>
        </div>
        
    </div>
  )
}
