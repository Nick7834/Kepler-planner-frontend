import React from 'react'
import styles from './Loader.module.scss'

interface LoaderProps {
  className?: string
}

export const Loader = ({ className }: LoaderProps) => {
  return (
    <div className={`${styles.back_loder} ${className}`}>
        <div className={styles.loader}></div>
    </div>
  )
}
