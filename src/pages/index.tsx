import { Inter } from 'next/font/google'
import ErrorPage from 'next/error'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return <ErrorPage statusCode={404} />
}
