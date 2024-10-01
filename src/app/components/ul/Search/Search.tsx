'use client'
import React, { useEffect, useRef, useState } from 'react'
import { FiSearch } from "react-icons/fi";
import styles from './Search.module.scss'
import useKeyPress from '@/app/hooks/useKeyPress';

interface searchTask {
  value: string,
  onChange: (e: any) => void,
}

export const Search = ({ value, onChange }:searchTask) => {

  const [searchOpen, setSearchOpen] = useState(false);
  const search = useRef<HTMLDivElement>(null);

  useEffect(() => {

    function closeShow(e: MouseEvent) {
      if(!search.current) return;
      if(search.current && !search.current.contains(e.target as Node)) {
        setSearchOpen(false);
        onChange('');
      }
    }

    document.addEventListener('click', closeShow);
    return () => document.removeEventListener('click', closeShow);

  }, [onChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
  };

  useKeyPress('s', !searchOpen, () => setSearchOpen(!searchOpen));

  return (
    <div className={styles.search_block}>

      <div className={`${styles.back} ${searchOpen ? `${styles.active_back}` : ''}`}></div>

        <div ref={search} className={`${styles.search} ${searchOpen ? `${styles.active_search}` : ''}`}>
            <button onClick={() => setSearchOpen(!searchOpen)}><FiSearch /></button>
            <input type="text" value={value} onChange={handleChange} placeholder='Search tasks'/>
        </div>

    </div>
  )
}
