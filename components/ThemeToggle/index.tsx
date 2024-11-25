'use client'
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  const handleThemeToggle = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }
  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true)
  }, [])

  return mounted ? <button 
    className='px-2 py-1 text-white dark:text-black bg-black dark:bg-white font-semibold text-[14px] rounded-md' 
    onClick={handleThemeToggle}
  >
      {theme === 'dark' ? 'Light' : 'Dark'}
    </button> : <span className='px-2 py-1 color-transparent bg-black dark:bg-white rounded-md text-[14px] selecton'>mounting</span>
}