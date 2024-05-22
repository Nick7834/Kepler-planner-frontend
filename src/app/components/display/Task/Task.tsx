'use client'
import React, { useState, useEffect } from 'react'
import styles from './Task.module.scss'
import { RiPushpinLine } from "react-icons/ri";
import { IoClose } from "react-icons/io5";
import { useTaskContext } from '@/app/context/TaskContext';
import { BsCheck } from "react-icons/bs";
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { addTaskToDay, deleteTask, taskToday, taskWeek, updateTask } from '@/redux/slices/tasks';
import { useConfirmContext } from '@/app/context/ConfirmContext';
import { usePathname } from 'next/navigation';
import { foldersAll } from '@/redux/slices/tasks';
import { motion } from "framer-motion"
import { IoIosArrowForward } from "react-icons/io";
import Link from 'next/link';

interface task {
  task: any,
}

export const Task = ({ task }: task) => {
    const { setSelectedTaskId, setModalOpenTask } = useTaskContext();

    const { confirmDel, setConfirmOpen, setConfirmDel, taskIdList, setTaskIdList } = useConfirmContext();

    const dispatch = useDispatch<AppDispatch>();

    const pageUpdate = usePathname();

    const [done, setDone] = useState<boolean>(task?.done);
    const [pin, setPin] = useState<boolean>(task?.pin);

    useEffect(() => {
      setDone(task?.done);
      setPin(task?.pin);
    }, [task]);

    const handIdClick = (id: string) => {
      setSelectedTaskId(id);
      setModalOpenTask(true);
    }  

    const handleCheckboxChange = async (id: string) => {
      const newDone = !done;
      setDone(newDone);
      const newPin = false;
      setPin(newPin);
      await handPatchTask(id, newDone, newPin);
    }

    const handlePinboxChange = async (id: string) => {
      const newPin = !pin;
      setPin(newPin);
      await handPatchTask(id, done, newPin);
    }
    
    const handPatchTask = async (id: string, newDone: boolean, newPin: boolean) => {
      const updatedTasks = {
        done: newDone,
        pin: newPin,
        title: task?.title
      }
    
      if (newDone !== task.done || newPin !== task.pin) {
        try {
          await dispatch(updateTask({taskId: id, updatedTask: updatedTasks}));
        } catch (error) {
            console.error('An error occurred when updating the task:', error);
        }
      }
    }

    const confirmDelTaskModal = (id: any) => {
      setConfirmOpen(true);
      setTaskIdList(id)
    }

    const delTaskNow = async (id: any) => {
      if (id === task?._id) {
        try {
          await dispatch(deleteTask(id));
          setConfirmDel(false);
          setTaskIdList(null);
        } catch (error) {
          console.error('An error occurred when deleting the task!:', error);
        }
      }
    }

    useEffect(() => {
      if (confirmDel && taskIdList) {
        delTaskNow(taskIdList);
      }
    }, [confirmDel]);

  return (
    <motion.div 
    layout
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}   
    exit={{ opacity: 0, y: 20 }} 
    transition={{ duration: 0.2 }}   
    onClick={() => handIdClick(task?._id)} className={`${styles.task} ${done ? `${styles.doneTask}` : ''}`}>

        <div className={styles.task_text}>
            <label onClick={(e) => e.stopPropagation()} className={styles.label}>
                <input type="checkbox" checked={done} onChange={() => handleCheckboxChange(task?._id)} className={styles.original} />
                <span className={styles.check}><BsCheck /></span>
            </label>
            <div className={styles.p_main}>
               <Link onClick={(e) => e.stopPropagation()} href={`/planner/folder/${task?.folderId}`} className={styles.map}><span>My lists</span><IoIosArrowForward /><span>{task?.folder}</span></Link>
               <p>{task?.title.length >= 100 ? `${task?.title.substring(0, 100).trim()}...` : task?.title.trim()}</p>
            </div>
        </div>

        <div onClick={(e) => e.stopPropagation()} className={styles.fun}>
            {!done && <button onClick={() => handlePinboxChange(task?._id)} className={`${pin ? `${styles.pinTask}` : ''} ${pageUpdate === '/planner/next_seven_days' ? `${styles.hiddenPin}` : ''}`}><RiPushpinLine /></button>}
            <button onClick={() => confirmDelTaskModal(task?._id)}><IoClose /></button>
        </div>
      
    </motion.div>
  )
}
