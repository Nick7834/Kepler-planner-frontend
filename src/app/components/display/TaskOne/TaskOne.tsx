'use client'
import React, { useEffect, useState } from 'react';
import styles from './TaskOne.module.scss';

import { BsCheck } from "react-icons/bs";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchTasks, taskToday, updateTask } from '@/redux/slices/tasks';
import { useTaskContext } from '@/app/context/TaskContext';
import { foldersAll } from '@/redux/slices/tasks';

export const TaskOne = ({ taskData }: any) => {

    const { selectedTaskId, setSelectedTaskId } = useTaskContext();
    const taskIdSatate = useSelector((state: RootState) => state.tasks.taskId);
    const dispatch = useDispatch<AppDispatch>();

    const [done, setDone] = useState<boolean>(taskData.done);
    const [pin, setPin] = useState<boolean>(taskData.pin);

        useEffect(() => {
          setDone(taskData.done);
          setPin(taskData.pin);
        }, [taskData]);

    const handleCheckboxChange = async (id: string) => {
      const newDone = !done;
      setDone(newDone);  
      const newPin = false;
      setPin(newPin);
      await handPatchTask(id, newDone, newPin);
    }
    
    const handPatchTask = async (id: string, newDone: boolean, newPin: boolean) => {
      const updatedTasks = {
        done: newDone,
        pin: newPin,
        title: taskData.title
      }
    
      if (newDone !== taskData.done || newPin !== taskData.pin) {
        try {
          await dispatch(updateTask({taskId: id, updatedTask: updatedTasks}));
        } catch (error) {
            console.error('An error occurred when updating the task:', error);
        }
      }
    }

    const taskFolderDetil = () => {
        setSelectedTaskId(taskData._id);
    }

  return (
    <div onClick={taskFolderDetil} className={`${styles.taskOne} ${done ? `${styles.doneTask}` : ''} ${[taskData._id].find(task => task === taskIdSatate) ? `${styles.activeTask}` : ''}`}>
        
        <div className={styles.left}>
            <label onClick={(e) => e.stopPropagation()} className={styles.label}>
                <input type="checkbox" checked={done} onChange={() => handleCheckboxChange(taskData._id)} className={styles.original} />
                <span className={styles.check}><BsCheck /></span>
            </label>
            <h4>{taskData?.title.length >= 50 ? `${taskData?.title.substring(0, 50).trim()}...` : taskData?.title.trim()}</h4>
        </div>
        
    </div>
  )
}
