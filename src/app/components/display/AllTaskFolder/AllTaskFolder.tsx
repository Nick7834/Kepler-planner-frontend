'use client'
import React, { use, useEffect, useMemo, useState } from 'react'
import styles from './AllTaskFolder.module.scss'

import { AddTask } from '../AddTask/AddTask'
import { TaskOne } from '../TaskOne/TaskOne'
import instance from '@/service'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/redux/store'
import { addNewTaskFolder, fetchFolderById, foldersAll } from '@/redux/slices/tasks'

interface folderTask {
  taskFolder: any;
  idFolderTask: String,
}

export const AllTaskFolder = ({ idFolderTask, taskFolder }:folderTask) => {

  const dispatch = useDispatch<AppDispatch>();

  const [newTaskAll, setNewTaskAll] = useState<string>('');

  const filterTasks = (tasks: any) => {
      if (!tasks || !Array.isArray(tasks.tasks)) {
        return [];
      }

      const doneTasks = tasks.tasks.filter((task: any) => task.done);
      const activeTask = tasks.tasks.filter((task: any) => !task.done);

      return [...doneTasks, ...activeTask];
  } 

  const filterAllFolder = useMemo(() => filterTasks(taskFolder), [filterTasks, taskFolder])

  const handleAddTaskAll = async (e: any) => {
      e.preventDefault();

      try {
        const response = await instance.post(`/folders/${idFolderTask}/tasks`, { title: newTaskAll });
        const newTask = response.data;

        dispatch(addNewTaskFolder(newTask, idFolderTask));

        setNewTaskAll('');
      } catch (error) {
        console.error('An error occurred when creating the task!:', error)
      }

  }

  return (
    <div className={styles.all}>

        <div className={styles.tasks}>

            {filterAllFolder && filterAllFolder.map((tasks: any, index: number) => (
                <TaskOne key={index} taskData={tasks} />
            )).reverse()}

        </div>

      <div className={styles.add}><AddTask value={newTaskAll} onChange={setNewTaskAll} onAddTask={handleAddTaskAll} /></div>

    </div>
  )
}
