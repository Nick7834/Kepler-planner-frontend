'use client'
import React, { useRef, useState } from 'react'
import styles from './AddTask.module.scss'
import { IoMdArrowRoundUp } from "react-icons/io";

interface AddTaskProps {
  value: string;
  onChange: (newValue: string) => void;
  onAddTask: (e: any) => void;
}

export const AddTask: React.FC<AddTaskProps> = ({ value, onChange, onAddTask }) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const inputHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '25px';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault(); 

      if (!value.trim()) return;
   
      onAddTask(e); 
      
      if (textareaRef.current) {
        textareaRef.current.style.height = '25px';
      } 
    }
  };

  const handInp = (e: any) => {
    e.preventDefault(); 
    
    if (!value.trim()) return;
   
    onAddTask(e); 
    
    if (textareaRef.current) {
      textareaRef.current.style.height = '25px';
    } 
  }

  return (
    <label className={styles.add_task}>
      <form>
        <textarea
          ref={textareaRef}
          maxLength={1000}
          placeholder="Add task"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onInput={inputHeight}
          onKeyDown={handleKeyDown}
        ></textarea>
        <button className={styles.button} onClick={handInp}>
          <IoMdArrowRoundUp />
        </button>
      </form>
    </label>
  );
};