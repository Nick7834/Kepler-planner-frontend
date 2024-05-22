import React from 'react'
import styles from './DelConfirm.module.scss'
import { useConfirmContext } from '@/app/context/ConfirmContext'

export const DelConfirm = () => {

  const { confirmOpen, setConfirmOpen, setConfirmDel } = useConfirmContext();

  const handDelTask = () => {
    setConfirmDel(true);
    setConfirmOpen(false);
  }

  const closeModal = () => {
    setConfirmOpen(false)
  }

  return (
    <div className={`${styles.confirm} ${confirmOpen ? `${styles.open}` : ''}`}>

        <div className={`${styles.modal} ${confirmOpen ? `${styles.openModal}` : ''}`}>

            <h2>Delete a task?</h2>

            <p>Are you sure you want to delete this task?</p>

            <div className={styles.buttons}>
                <button onClick={closeModal}>Cancel</button>
                <button onClick={handDelTask}>Delite</button>
            </div>

        </div>

    </div>
  )
}
