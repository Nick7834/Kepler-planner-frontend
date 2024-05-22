'use client'
import React from 'react'
import styles from './TaskDay.module.scss'
import { IoMdAddCircleOutline } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import Link from 'next/link';

export const TaskDay = ({task, onclick}: any) => {

  const handToday = () => {
      onclick(task?._id, task?.title)
  }

  return (
    <div onClick={handToday} className={styles.task}>

        <div className={styles.task_text}>
            <button><IoMdAddCircleOutline /></button>

            <div className={styles.mains}>
              <span>{task?.title}</span>
              <Link onClick={(e) => e.stopPropagation()} href={`/planner/folder/${task?.folderId}`} className={styles.map}><span>My lists</span><IoIosArrowForward /><span>{task?.folder}</span></Link>
            </div>

        </div>
      
    </div>
  )
}
