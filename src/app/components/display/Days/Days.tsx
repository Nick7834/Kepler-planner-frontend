'use client'
import React, { useEffect, useState } from 'react'
import styles from './Days.module.scss'

import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';

export const Days = () => {

    const [greeting, setGreeting] = useState('');
    const [randSloganDay, setRandSloganDay] = useState('');
    const [currentDate, setCurrentDate] = useState<Date | null>(null);
    
    const user = useSelector((state: RootState) => state.auth.data) as any; 

    useEffect(() => {
        const currentGreeting = new Date();
        setCurrentDate(currentGreeting);

        const greetingText = currentGreeting.getHours();

        if (greetingText < 6) {
            setGreeting('Good Night');
        } else if (greetingText < 12) {
            setGreeting('Good Morning');
        } else if (greetingText < 18) {
            setGreeting('Good Afternoon');
        } else {
            setGreeting('Good Evening');
        }
    }, []);

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const slogans = [
        "Plan your way to success, one task at a time!",
        "Empower your day with organized goals!",
        "Shape your future, one task at a time!",
        "Transform aspirations into actions!",
        "Unlock your potential with structured planning!",
        "Dream big, plan smart, achieve more!",
        "Seize the day with strategic scheduling!",
        "Elevate productivity, embrace planning!",
        "Chart your course to success with daily tasks!",
        "Fuel your ambition with purposeful planning!",
        "Come up with something for the day!"
    ];

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const randomSlogan = () => {   
                let randomSlogan = slogans[Math.floor(Math.random() * slogans.length)];
                setRandSloganDay(randomSlogan);
            }

            randomSlogan();
        }
    }, []);

    if (!currentDate) {
        return null;
    }

    const day = daysOfWeek[currentDate.getDay()];
    const month = months[currentDate.getMonth()];
    const date = currentDate.getDate();

  return (
    <div className={styles.dates}>
        
        <div className={styles.days}>
            <span>{day}</span>
            <h2>{date}</h2>
            <span>{month}</span>
        </div>

        <div className={styles.text}>
            <h1>{greeting}, {user?.fullName}</h1>
            <p>{randSloganDay}</p>
        </div>

    </div>
  )
}
