import '../styles/globals.css'
import { Lato } from 'next/font/google';

const lato = Lato({subsets: ['latin'], weight: ['100', '300', '400', '700']});

function MyApp({ Component, pageProps }) {
  return (
    <div className={`${lato.className}`}>
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp
