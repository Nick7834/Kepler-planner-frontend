'use client'
import React, { useState, useEffect } from 'react'
import styles from './DayCard.module.scss'
import { Task } from '../Task/Task'
import { AddTask } from '../AddTask/AddTask'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/redux/store'
import { taskToday, taskWeek, addTaskToDay, foldersAll } from '@/redux/slices/tasks'
import instance from '@/service'
import { Loader } from '../Loader/Loader'

export const DayCard = () => {

  const dispatch = useDispatch<AppDispatch>();
  const { week } = useSelector((state: RootState) => state.tasks)
  const { items: taskItems } = week;

  const isPinned = useSelector((state: RootState) => state.pin.pin);
  const isMouse = useSelector((state: RootState) => state.pin.mousePin);

  const [isLoader, setIsLoader] = useState(true);

  const [newTaskSeven, setNewTaskSeven] = useState<string>('');
 
  useEffect(() => {
    if(week.status === 'loading' && !taskItems.length) {
      dispatch(taskWeek())
    } else {
      setIsLoader(false)
    }
  }, [dispatch, week]);

  const handleInputChange = (day: any, value: any) => {
    setNewTaskSeven((prev: any) => ({ ...prev, [day]: value }));
  };

  const handleAddTask = async (e: any, day: any, indexDay: any) => {
    e.preventDefault();

    const title = newTaskSeven[day]; 

    const addTaskWeeks = {
      title: title, 
      dayOfWeek: indexDay
    }

    try {
      await dispatch(addTaskToDay({ dayIndex: indexDay, newTask: addTaskWeeks }));
      await dispatch(foldersAll());
      setNewTaskSeven('');
    } catch (error) {
      console.error('An error occurred when creating the task!:', error)
    }

  };

  const filterTaskWeek = (tasks: any) => {
    if (!tasks || !Array.isArray(tasks)) {
      return [];
    }

    const done = tasks.filter((task: any) => task?.done);
    const NotDone = tasks.filter((task: any) => !task?.done);
    return [...done, ...NotDone];
  }
  

  return (
    <div className={`${styles.all_seven_task} ${isPinned || isMouse ? 'active_left' : ''}`}>

        {isLoader && <Loader />}

        {taskItems.map(el => (
          <div key={el?.dayIndex} id={el?.dayIndex} className={styles.task_card}>

              <h3>{el?.dayOfWeek}</h3>
     
              <div className={styles.all_task}>
                  {filterTaskWeek(el.tasks).map((task: any, index: any) => (
                      
                    <Task key={index} task={task} />
                      
                  )).reverse()}
              </div>
     
            
             <AddTask 
                value={newTaskSeven[el.dayOfWeek] || ''} 
                onChange={(value) => handleInputChange(el.dayOfWeek, value)} 
                onAddTask={(e) => handleAddTask(e, el.dayOfWeek, el.dayIndex)} 
              />
     
         </div>
        ))}

    </div>
  )
}
