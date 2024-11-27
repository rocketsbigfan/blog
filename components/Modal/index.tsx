'use client'

import { useState } from 'react';
import styles from './index.module.css';
import classNames from 'classnames';
import { useRouter } from 'next/navigation';

interface ModalProps {
  children: React.ReactNode
  open: boolean
  title?: string
  routerBack?: boolean
  onClose?: () => void
}

export default function Modal({ children, open, title, routerBack, onClose }: ModalProps) {
  const [isOpen, setIsOpen] = useState(open);
  const router = useRouter()

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
    if (routerBack) {
      router.back()
    }
  }

  return <div 
    className={classNames(styles.modal, "fixed inset-0 z-50")}
  >
    <div className={classNames(styles.modalOverlay, "fixed w-full h-full bg-black bg-opacity-50 transition-opacity duration-300")}></div> 
    <div className={classNames(styles.modalWrapper, "max-md:!w-full max-md:!h-full w-[60vw] h-[80vh] bg-white dark:bg-gray-900 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 rounded-lg overflow-y-auto")}>
      <div className={classNames(styles.modalHeader, "rounded-t-lg rounded-s-lg flex justify-between items-center sticky top-0 bg-white dark:bg-gray-900 px-4 py-2")}>
        <div className={classNames(styles.modalTitle, "text-xl font-bold")}>
          <h2>{title}</h2>
        </div>
        <div className={classNames(styles.modalClose, "px-2 text-gray-500 hover:text-gray-800")}>
          <button onClick={handleClose}>X</button>
        </div>
      </div>
      <div className={classNames(styles.modalContent, "px-4 py-2")}>
        {children}
      </div>
    </div>
  </div>;
}
