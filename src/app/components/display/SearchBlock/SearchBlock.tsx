'use client'
import React, { useCallback, useState } from 'react'
import styles from './SearchBlock.module.scss';
import { Search } from '../../ul/Search/Search';
import Image from 'next/image';
import instance from '@/service';
import { TaskTwo } from '../TaskTwo/TaskTwo';

export const SearchBlock = () => {

    const [searchValue, setSearchValue] = useState<string>('');
    const [searchTasks, setSearchTasks] = useState([]);

    function debounce(func: (...args: any[]) => void, wait: number) {
        let timeout: ReturnType<typeof setTimeout>;
      
        return (...args: any[]) => {
          clearTimeout(timeout);
          timeout = setTimeout(() => func(...args), wait);
        };
      }
      
      const handSearch = useCallback(debounce(async (query: string) => {
        if (!query.trim()) {
          setSearchTasks([]);
          return;
        }
        try {
          const response = await instance.get(`/alltasks/search?query=${query}`);
          setSearchTasks(response.data);
        } catch (err) {
          console.log('error in the search:', err);
          setSearchTasks([]);
        }
      }, 150), []);
    
      const handleChange = (newValue: string) => {
        setSearchValue(newValue);
        handSearch(newValue); 
      };

  return (
    <>

        <Search value={searchValue} onChange={handleChange} />

            {searchValue.length > 0 &&
                <div className={styles.search_block}>
                    {searchTasks.length > 0  ? 
                        searchTasks.map((task, index) => (
                            <TaskTwo key={index} taskData={task} />
                        )) : 
                    <div className={styles.no_search}>
                        <Image src="/Outer space-bro.svg" width={100} height={100} alt="search" />
                        <p>Nothing was found!</p>
                    </div>
                    }
                </div> 
            }

    </>
  )
}
