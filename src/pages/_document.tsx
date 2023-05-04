import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className='align-items-start py-0 flex-column'>
        <div id="root" className="w-100">
          <Main />
        </div>
        <NextScript />
      </body>
    </Html>
  )
}
