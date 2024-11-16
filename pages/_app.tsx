import '../styles/global.css';
import { ThemeProvider } from 'next-themes';

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider 
      enableSystem={true}
      attribute="class"
      // attribute="data-theme"
      defaultTheme="dark"
    >
      <Component {...pageProps} />
    </ThemeProvider>
  );
}