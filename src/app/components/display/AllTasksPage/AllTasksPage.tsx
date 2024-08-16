'use client'
import React, { useEffect, useMemo, useState } from 'react'
import styles from './AllTasksPage.module.scss'
import { AllTaskDay } from '../AllTaskDay/AllTaskDay'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/redux/store';
import { fetchTasks } from '@/redux/slices/tasks';
import { Loader } from '../Loader/Loader'
import { TaskAllDetail } from '../TasksAllDetail/TasksAllDetail'

export const AllTasksPage = () => {

  const dispatch = useDispatch<AppDispatch>();
  const { tasks } = useSelector((state: RootState) => state.tasks);
  const { items: tasksItems } = tasks;

  const isPinned = useSelector((state: RootState) => state.pin.pin);
  const isMouse = useSelector((state: RootState) => state.pin.mousePin);

  const [isLoader, setIsLoader] = useState(true);

  const memoizedTasksItems = useMemo(() => tasksItems, [tasksItems]);

    useEffect(() => {
        if (tasks.status === 'loading' && !memoizedTasksItems.length) {
            dispatch(fetchTasks());
        } else {
            setIsLoader(false);
        }
    }, [dispatch, tasks, memoizedTasksItems]);

  return (
    <div className={`${styles.allTaks} ${isPinned || isMouse ? 'active_left' : ''}`}>

      <div className={styles.folder_main}>

          <div className={styles.blocks}>

              {isLoader && <Loader />}

             <AllTaskDay taskInfo={memoizedTasksItems} />

             {memoizedTasksItems?.length > 0 && (
                <TaskAllDetail taskDefault={memoizedTasksItems}  />
              )}
          </div>

      </div>

        
    </div>
  )
}
