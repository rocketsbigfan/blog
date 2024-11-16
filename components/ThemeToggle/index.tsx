import { useTheme } from 'next-themes';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const handleThemeToggle = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }

  return <button className='px-2 py-1 text-white dark:text-black bg-black dark:bg-white font-semibold text-[14px] rounded-md' onClick={handleThemeToggle}>
    {theme === 'dark' ? 'Light' : 'Dark'}
  </button>
}