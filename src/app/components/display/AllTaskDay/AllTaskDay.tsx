'use client'
import React, { useState, useEffect, useMemo } from 'react'
import styles from './AllTaskDay.module.scss'
import { AddTask } from '../AddTask/AddTask'
import { TaskOne } from '../TaskOne/TaskOne'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/redux/store'
import { addNewTask, fetchTasks } from '@/redux/slices/tasks'
import instance from '@/service'
import { foldersAll } from '@/redux/slices/tasks'

export const AllTaskDay = ({taskInfo}: any) => {

    const dispatch = useDispatch<AppDispatch>();

    const [newTask, setNewTask] = useState<string>('');

    const filterTasks = (tasks: any) => {
      if (!tasks || !Array.isArray(tasks)) {
        return [];
      }

      const doneTasks = tasks.filter((task: any) => task.done);
      const activeTask = tasks.filter((task: any) => !task.done);

      return [...doneTasks, ...activeTask];
    } 

    const filteredTasks = useMemo(() => filterTasks(taskInfo), [taskInfo]);

    const handleAddTaskToday = async (e: any) => {
      e.preventDefault();

      try {
        const response = await instance.post('/tasks', { title: newTask });
        const newTaskData = response.data;

        dispatch(addNewTask(newTaskData));
        await dispatch(foldersAll());
        setNewTask('');
      } catch (error) {
        console.error('An error occurred when creating the task!:', error)
      }

    }

  

  return (
    <div className={styles.all}>

        <div className={styles.tasks}>

           {taskInfo && filteredTasks.map((task: any, index: number) => (
              <TaskOne key={index} taskData={task} />
           )).reverse()}

        </div>

      <div className={styles.add}><AddTask value={newTask} onChange={setNewTask} onAddTask={handleAddTaskToday} /></div>

    </div>
  )
}
