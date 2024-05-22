'use client'
import { Task } from '@/app/components/display/Task/Task';
import { AddTask } from '@/app/components/display/AddTask/AddTask';
import { Days } from '@/app/components/display/Days/Days';
import { TaskSection } from '@/app/components/display/TaskSection/TaskSection';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { useState, useEffect, useMemo } from 'react';
import { addNewTaskTodays, deleteTask, foldersAll, taskToday } from '@/redux/slices/tasks';
import instance from '@/service';
import { Loader } from '@/app/components/display/Loader/Loader';
import { motion } from "framer-motion"


export default function Page() {
  const dispatch = useDispatch<AppDispatch>();
  const { todayTasks } = useSelector((state: RootState) => state.tasks);
  const { items: taskItems } = todayTasks;

  const [isLoader, setIsLoader] = useState(true);

  const isPinned = useSelector((state: RootState) => state.pin.pin);
  const isMouse = useSelector((state: RootState) => state.pin.mousePin);
  const openRand = useSelector((state: RootState) => state.pin.openRandom);

  useEffect(() => {
      dispatch(taskToday());
      setIsLoader(false);
  }, [dispatch]);

  // filter

  const filterTasks = useMemo(() => (tasks: any) => {
    const pinnedTasks = tasks.filter((task: any) => task.pin);
    const doneTasks = tasks.filter((task: any) => task.done);
    const remainingTasks = tasks.filter((task: any) => !task.done && !task.pin);
  
    return [...doneTasks, ...remainingTasks, ...pinnedTasks];
  }, []);

  const tasksAllFilter = useMemo(() => filterTasks(taskItems), [filterTasks, taskItems]);

  const [newTask, setNewTask] = useState<string>('');

  const handleAddTaskToday = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {

        const response = await instance.post('/tasks/today', { title: newTask });
        const newTasks = response.data;
        dispatch(addNewTaskTodays(newTasks))
        await dispatch(foldersAll());
        setIsLoader(false)

        setNewTask('');
    } catch (error) {
      console.error('An error occurred when creating the task!:', error)
    }

  }

  return (
    <div className={`main-page-m 
    ${isPinned || isMouse ? 'active_left' : ''} ${openRand ? 'active_randBlock' : ''}`}>

        <Days />

        <motion.div layout className='main__tasks'>

          {isLoader ? (
            <Loader />
          ) : (
            tasksAllFilter.map((task: string, index: number) => <Task key={index} task={task} />).reverse()
          )}

        </motion.div>

        <AddTask value={newTask} onChange={setNewTask} onAddTask={handleAddTaskToday} />

        <TaskSection />

    </div>
  )
}
