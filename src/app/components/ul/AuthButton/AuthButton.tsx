import React from 'react'
import styles from './AuthButton.module.scss'

interface button {
    name: string
}

export const AuthButton = ({ name }: button) => {
  return (
    <button className={styles.auth_button}>{ name }</button>
  )
}
