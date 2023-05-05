import ErrorPage from 'next/error'

export default function Home() {
  return (
    <div className='error-page'>
      <ErrorPage statusCode={404} />
    </div>
  )
}
