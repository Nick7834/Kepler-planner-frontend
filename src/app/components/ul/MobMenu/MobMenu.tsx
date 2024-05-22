import React from 'react'
import styles from './MobMenu.module.scss'

import { LuCalendarDays } from "react-icons/lu";
import { TbClipboardList } from "react-icons/tb";
import { FaRegDotCircle } from "react-icons/fa";
import { FaFolder } from "react-icons/fa";
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export const MobMenu = () => {

    const navs = [
        {text: 'My day', svg: <FaRegDotCircle />, link: '/planner/myday'},
        {text: 'Next 7 days', svg: <LuCalendarDays />, link: '/planner/next_seven_days'},
        {text: 'All my tasks', svg: <TbClipboardList />, link: '/planner/all_my_tasks'},
        {text: 'Folders', svg: <FaFolder />, link: '/planner/folders_mob'}
    ];

    const namePage = usePathname();

  return (
    <div className={styles.mob_menu}>

        <div className={styles.menu}>
            {navs.map((nav, index) => (
                <Link key={index} href={nav.link} className={`${namePage === nav.link ? `${styles.activeNav}` : ''}`}>
                    <span>{nav.svg}</span>
                    <p className={styles.text}>{nav.text}</p>
                </Link>
            ))}
        </div>

    </div>
  )
}
