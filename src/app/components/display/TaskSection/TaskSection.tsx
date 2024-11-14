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
import useKeyPress from '@/app/hooks/useKeyPress';
import { isAuth } from '@/redux/slices/auth';

export const TaskSection = () => {

    const isAuths = useSelector(isAuth);
    const dispatch = useDispatch<AppDispatch>();
    const [openTasks, setOpenTasks] = useState(false);
    const { tasks } = useSelector((state: RootState) => state.tasks);
    const { items: tasksItems } = tasks;
    const { todayTasks } = useSelector((state: RootState) => state.tasks);
    const { items: todayAll } = todayTasks;
    const [tasksNow, setTasksNow] = useState<any[]>([]);

    const openRand = useSelector((state: RootState) => state.pin.openRandom);

    // const randomTasks = (tasksItems:any, todayAll:any) => {
        // const filtersTasks = tasksItems.filter((task:any) => 
        //     !todayAll.some((todayTask:any) => todayTask._id === task._id)
        // );
    //     const randTasks = filtersTasks.sort(() => 0.5 - Math.random());

    //     if(tasksItems.length > 20) {
    //         return randTasks.slice(0, 10);
    //     } else if (tasksItems.length > 50) {
    //         return randTasks.slice(0, 20);
    //     } else {
    //         return randTasks.slice(0, 5);
    //     }
    // }

    useEffect(() => {
            setTasksNow(tasksItems.filter((task:any) => 
                !todayAll.some((todayTask:any) => todayTask._id === task._id)
            ));
    }, [tasksItems, todayAll]);


    const handTodayNow = async (id: string, title: string) => {
        const nowTaskToday = todayAll.find((task:any) => task._id === id);

        const updatedTasks = {
            done: false,
            pin: false,
            title: title
        };

        if (nowTaskToday) {
            try {
                await instance.delete(`/tasks/today/remove/${id}`);
                await dispatch(taskToday());
            } catch (err) {
                console.error('Failed to complete the task from today:(', err);
            }
        } else {
            try {
                await instance.post('/tasks/today/add', { taskId: id });
                await dispatch(updateTask({ taskId: id, updatedTask: updatedTasks }));
                await dispatch(taskToday());
                await dispatch(foldersAll());

                setTasksNow((prevTasks) => prevTasks.filter((task:any) => task._id !== id));
            } catch (err) {
                console.error('Couldn\'t add a task for today:(', err);
            }
        }
    };

    const handOpenRand = () => {
        dispatch(setOpenRandom(!openRand));
    };

    useKeyPress('r', !openRand, handOpenRand);

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
 