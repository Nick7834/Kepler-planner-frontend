'use client'
import React, { useEffect, useMemo, useState } from 'react'
import styles from './TaskSection.module.scss'
import { HiOutlineLightBulb } from "react-icons/hi"
import { CgClose } from "react-icons/cg";
import { TaskDay } from '../TaskDay/TaskDay';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import instance from '@/service';
import { foldersAll, taskToday, updateTask } from '@/redux/slices/tasks';
import { setOpenRandom } from '@/redux/slices/pin';

export const TaskSection = () => {

    const dispatch = useDispatch<AppDispatch>();
    const [openTasks, setOpenTasks] = useState(false);
    const { tasks } = useSelector((state: RootState) => state.tasks);
    const { items: tasksItems } = tasks;
    const { todayTasks } = useSelector((state: RootState) => state.tasks);
    const { items: todayAll } = todayTasks;
    const [tasksNow, setTasksNow] = useState<any[]>([]);

    const openRand = useSelector((state: RootState) => state.pin.openRandom);

    const randomTasks = (tasksItems:any, todayAll:any) => {
        const filtersTasks = tasksItems.filter((task:any) => 
            !todayAll.some((todayTask:any) => todayTask._id === task._id)
        );
        const randTasks = filtersTasks.sort(() => 0.5 - Math.random());
        return randTasks.slice(0, 20);
    }

    const memoizedTasksRand = useMemo(() => randomTasks(tasksItems, todayAll), [tasksItems, todayAll])

   useEffect(() => {
        setTasksNow(memoizedTasksRand)
   }, [memoizedTasksRand]);

   const handTodayNow = async (id: string, title: string) => {
        const nowTaskToday = todayAll.find((task:any) => task._id === id);

        const updatedTasks = {
            done: false,
            pin: false,
            title: title
        }

        if(nowTaskToday) {
        try {
            await instance.delete(`/tasks/today/remove/${id}`);
            await dispatch(taskToday())
        } catch(err) {
            console.error('Failed to complete the task from today:(', err);
        }
        } else {
        try {
            await instance.post('/tasks/today/add', {taskId: id});
            await dispatch(updateTask({taskId: id, updatedTask: updatedTasks}));
            await dispatch(taskToday())
            await dispatch(foldersAll());
        } catch(err) {
            console.error('Couldnt add a task for today:(', err);
        }
        }
   }

   const handOpenRand = () => {
        dispatch(setOpenRandom(!openRand))
   }

  return (
    <div className={styles.task_section}>

        <button className={styles.open} onClick={handOpenRand}>
            {openRand ? <CgClose /> : <HiOutlineLightBulb />}
        </button>

        <div className={`${styles.task_block} ${openRand ? `${styles.active_tasks}` : ''}`}>

            <h3 className={styles.title}>Tasks of the day</h3>
    
            <div className={styles.tasks}>
                {tasksNow.map((task, index) => (
                    <TaskDay key={index} task={task} onclick={handTodayNow} />
                ))}
            </div>

        </div>

    </div>
  )
}
