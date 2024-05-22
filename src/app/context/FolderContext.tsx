import React, { createContext, useContext, useState, ReactNode } from 'react';

interface FolderContextProps {
    folderName: string | null;
    setFolderName: (e: string) => void;
}

const FolderContext = createContext<FolderContextProps>({
  folderName: '',
  setFolderName: () => {},
});

export const FolderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [folderName, setFolderName] = useState<string | null>(null);

  return (
    <FolderContext.Provider value={{ folderName, setFolderName }}>
      {children}
    </FolderContext.Provider>
  );
};

export const useFolderContext = () => useContext(FolderContext);
