import React, { createContext, useContext, useState, ReactNode } from 'react';

interface TaskContextProps {
  selectedTaskId: string | null;
  modalOpenTask: boolean,
  setSelectedTaskId: (id: string | null) => void;
  setModalOpenTask: (value: boolean) => void;
}

const TaskContext = createContext<TaskContextProps>({
  selectedTaskId: null,
  modalOpenTask: false,
  setSelectedTaskId: () => {},
  setModalOpenTask: () => {},
});

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [modalOpenTask, setModalOpenTask] = useState<boolean>(false); 

  return (
    <TaskContext.Provider value={{ selectedTaskId, modalOpenTask, setSelectedTaskId, setModalOpenTask }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => useContext(TaskContext);
