import ErrorPage from 'next/error'
import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <link rel="stylesheet" type="text/css" href="/assets/styles/error.css" />
      </Head>
      <ErrorPage statusCode={404} />
    </>
  )
}
