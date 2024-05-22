'use client'
import React, { useRef, useState } from 'react'
import styles from './Accordion.module.scss'
import { TaskOne } from '../TaskOne/TaskOne'

export const Accordion = () => {

  const accordionRef = useRef<HTMLDivElement | null>(null)
  const [accordion, setAccordion] = useState<Boolean>(false);

  const accordionOpen = () => {
    if(accordionRef.current) {
      const newHeight = accordion ? '0px' : `${accordionRef.current.scrollHeight}px`;
      accordionRef.current.style.maxHeight = newHeight;
      setAccordion(!accordion);
    }
  }
 
  return (
    <div className={styles.accordion}>
        
        <button className={`${styles.button} ${accordion ? `${styles.textActive}` : ''}`} onClick={accordionOpen}>Today
          {!accordion && <span>8</span>}
        </button>

        <div ref={accordionRef} className={styles.content} style={{maxHeight: '0px',}}>
            <TaskOne />
            <TaskOne />
            <TaskOne />
            <TaskOne />
            <TaskOne />
            <TaskOne />
        </div>

    </div>
  )
}
