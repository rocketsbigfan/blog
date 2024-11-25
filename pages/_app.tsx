import '../styles/global.css';
import '../styles/rehype-prism-plus.css';

import { ThemeProvider } from 'next-themes';

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider 
      enableSystem={true}
      attribute="class"
      // attribute="data-theme"
      defaultTheme="light"
    >
      <Component {...pageProps} />
    </ThemeProvider>
  );
}