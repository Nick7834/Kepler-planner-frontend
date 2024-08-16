'use client'
import React, { useEffect, useRef, useState } from 'react'
import styles from './TaskDetail.module.scss'
import { FaFolder } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";

import { FaRegTrashCan } from "react-icons/fa6";
import { BsCheckCircle } from "react-icons/bs";
import { BsCheckCircleFill } from "react-icons/bs";
import { useTaskContext } from '@/app/context/TaskContext';
import instance from '@/service';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchFolderById, foldersAll, setTaskCheck, setTaskId } from '@/redux/slices/tasks';
import { deleteTask, taskToday, updateTask } from '@/redux/slices/tasks';
import { useConfirmContext } from '@/app/context/ConfirmContext';
import { GoGoal } from "react-icons/go";

interface TaskData {
  _id: string;
  title: string;
  folder: string; 
  done: boolean;
  pin: boolean;
}

export const TaskDetail = ({taskDefault, folderId, folderName}: any) => {

  const { selectedTaskId, setSelectedTaskId, modalOpenTask } = useTaskContext();

  const { confirmDel, setConfirmOpen, setConfirmDel } = useConfirmContext();

  const dispatch = useDispatch<AppDispatch>();
  const taskIdSatate = useSelector((state: RootState) => state.tasks.taskId);
  const taskCheck = useSelector((state: RootState) => state.tasks.taskCheck);

  const { todayTasks } = useSelector((state: RootState) => state.tasks)
  const { items: taskItems } = todayTasks;
  
  const [data, setData] = useState<TaskData | null>(null);

  const [title, setTitle] = useState('');
  const [done, setDone] = useState(data?.done);
  const [pin, setPin] = useState(false);
  const [idDone, setIdDone] = useState(data?.done)

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);


  const inputHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '25px';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  };

  useEffect(() => {
    if(data && taskDefault && taskDefault?.tasks) {
      const nowDone = taskDefault?.tasks.find((task: any) => task._id === data?._id);
      setIdDone(prevState => nowDone?.done ?? prevState);
    }
  }, [taskDefault, data])

  useEffect(() => {
    setSelectedTaskId(null);
  }, [data, folderId]);

  useEffect(() => {
    if (taskCheck && taskIdSatate) {
      const selectedTask = taskDefault?.tasks.find((task: any) => task._id === taskIdSatate);
      if (selectedTask) {
        setData(selectedTask);
        setTitle(selectedTask.title);
        dispatch(setTaskCheck(false))
        return; 
      }
    }
    
    if (taskDefault && taskDefault?.tasks.length > 0) {
      if (!data || !taskDefault?.tasks.find((task: any) => task?._id === data?._id)) {
        const filterTaskOne = taskDefault?.tasks.filter((task: any) => !task?.done);
        const filterTaskOneDone = taskDefault?.tasks.filter((task: any) => task?.done);
        const lastTask = filterTaskOne[filterTaskOne.length - 1]; 
        const lastTaskDone = filterTaskOneDone[filterTaskOneDone.length - 1]; 
        if (lastTask) {
          setData(lastTask);
          setTitle(lastTask.title);
          dispatch(setTaskId(lastTask?._id))
        } else {
          setData(lastTaskDone);
          setTitle(lastTaskDone.title);
          dispatch(setTaskId(lastTaskDone._id))
        }
      }
    }
  }, [taskDefault, data, folderId, selectedTaskId, taskCheck, taskIdSatate]); 
  
  
  useEffect(() => {
    if(!selectedTaskId) return;
  
    if (!data || selectedTaskId !== data?._id) {
      const taskDetailNow = async () => {
        try {
          const res = await instance.get(`/tasks/${selectedTaskId}`);
          setData(res.data);
          setTitle(res.data?.title); 
          dispatch(setTaskId(res.data?._id));
        } catch(err) {
          console.error('Error', err);
        }
      }
  
      taskDetailNow();
    }
  }, [taskDefault, folderName, selectedTaskId, folderId]);

    useEffect(() => {
    const taskDetailNow = async () => {
      const currentTask = taskDefault?.tasks.find((task: any) => task?._id === data?._id);

   
      if (currentTask && data && folderName === currentTask.folder) {
        return;
      }

      if (currentTask) {
        try {
          const res = await instance.get(`/tasks/${currentTask?._id}`);
          setData(res?.data);
        } catch(err) {
          console.error('Error', err);
        }
      }
    }

    taskDetailNow();
  }, [taskDefault, folderName, data])
  

  useEffect(() => {
    inputHeight()
  }, [data]);

  const patchTask = async (id: any) => {

    if(!data?.title.trim()) return;

    const updatedTasks = {
      title,
      done: done,
      pin: pin,
    }

      if (title !== data?.title) {
          try {
             await dispatch(updateTask({taskId: id, updatedTask: updatedTasks}));
          } catch (error) {
              console.error('An error occurred when updating the task:', error);
          }
      }

  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault(); 

      if (!data?.title.trim()) return;
   
      patchTask(data?._id); 
      
    }
  };

  const confirmDelTask = () => {
    setConfirmOpen(true);
  }

  useEffect(() => {
    if(confirmDel && !modalOpenTask) {
      delTaskNow(data?._id)
    }
  }, [confirmDel, data]);

  const delTaskNow = async (id: any) => {
    try {
      dispatch(deleteTask(id));
      setConfirmDel(false);
    
      if (taskDefault && taskDefault?.tasks) {
        const tasks = taskDefault?.tasks;
        const deletedTaskIndex = tasks.findIndex((task: any) => task?._id === id);
  
        let taskToShow = null;
  
        if (tasks.length > 0) {
          if (deletedTaskIndex === tasks.length) {
            const activeTasks = tasks.filter((task: any) => !task?.done);
            taskToShow = activeTasks.length > 0 ? activeTasks[activeTasks.length - 1] : tasks[tasks.length - 1];
          } else {
            taskToShow = tasks[deletedTaskIndex] || tasks[tasks.length - 1];
          }
        }
  
        if (taskToShow) {
          setData(taskToShow);
          setTitle(taskToShow?.title);
        } else {
          setData(null);
          setTitle('');
        }
      } else {
        setData(null);
        setTitle('');
      }
    } catch (error) {
      console.error('An error occurred when deleting the task!!:', error);
    } 
  }

  const taskAddToday = async (id: any) => {
    const nowTaskToday = taskItems.find((task:any) => task._id === id);

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

    useEffect(() => {
      setDone(idDone)
    }, [data, idDone]);

  const taskCheckDone = async (id: any) => {
    const newDone = !done;
    setDone(newDone);
    setIdDone(newDone);
    const newPin = false;
    setPin(newPin);

    const updatedTasks = {
      done: newDone,
      pin: newPin,
      title: title
    }
    
      try {
        await dispatch(updateTask({taskId: id, updatedTask: updatedTasks}));
      } catch (error) {
          console.error('An error occurred when updating the task:', error);
      }
  }

  
  return (
    <div className={`${styles.task_detail} ${idDone ? `${styles.taskDone}` : ''}`}>

            <div className={styles.top}>
               <div className={styles.map}><span>My lists</span><IoIosArrowForward /><span>{data?.folder}</span></div>

                <div className={styles.right}>
                      <button onClick={() => taskCheckDone(data?._id)}>{idDone ? <BsCheckCircleFill className={styles.checkActive} /> : <BsCheckCircle />}</button>
                      <button onClick={() => taskAddToday(data?._id)}><GoGoal className={`${taskItems.find(task => task._id === data?._id) ? `${styles.todayTask}` : ''}`} /></button>
                      <button onClick={confirmDelTask}><FaRegTrashCan /></button>
                </div> 
            </div>

          <div className={styles.scrolls}>
            <textarea
                ref={textareaRef}
                maxLength={1000}
                value={title}
                onChange={e => setTitle(e.target.value)}
                onBlur={() => patchTask(data?._id)}
                onInput={inputHeight}
                onKeyDown={handleKeyDown}
              ></textarea>

              <div className={styles.categories}>
                  <button><FaFolder />{data?.folder}</button>
              </div>
          </div>

    </div>
  )
}
