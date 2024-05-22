'use client'
import React, { ReactNode } from 'react'
import { Provider } from 'react-redux'
import store from './store'

interface ProviderMainProps {
  children: ReactNode;
}

export const ProviderMain: React.FC<ProviderMainProps> = ({ children }) => {
  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
};
