import '../styles/globals.css'
import { Space_Mono } from 'next/font/google';

const spaceMono = Space_Mono({subsets: ['latin'], weight: ['400']});

function MyApp({ Component, pageProps }) {
  return (
    <div className={spaceMono.className}>
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp
