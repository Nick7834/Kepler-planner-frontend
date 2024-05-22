import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ConfirmContextProps {
    taskIdList: string | null;
    setTaskIdList: (id: string | null) => void;
    confirmOpen: boolean;
    setConfirmOpen: (e: boolean) => void;
    confirmDel: boolean;
    setConfirmDel: (e: boolean) => void;
}

const ConfirmContext = createContext<ConfirmContextProps>({
    confirmOpen: false,
    setConfirmOpen: () => {},
    confirmDel: false,
    setConfirmDel: () => {},
    taskIdList: null,
    setTaskIdList: () => {},
});

export const ConfirmProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
  const [confirmDel, setConfirmDel] = useState<boolean>(false);
  const [taskIdList, setTaskIdList] = useState<string | null>(null);

  return (
    <ConfirmContext.Provider value={{ confirmOpen, setConfirmOpen, confirmDel, setConfirmDel, taskIdList, setTaskIdList }}>
      {children}
    </ConfirmContext.Provider>
  );
};

export const useConfirmContext = () => useContext(ConfirmContext);