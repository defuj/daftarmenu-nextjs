import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#70B44E" />

        <meta itemProp="name" content="Daftar Menu" />
        <meta itemProp="description" content="Kelola restoran di daftarmenu.com - Tingkatkan pendapatan restoranmu dengan pelayanan servis terbaik menggunakan QRCode, Coba dan buat QRCode Restoranmu sekarang secara gratis hanya dengan satu langkah" />
        <meta itemProp="image" content="http://daftarmenu.com/assets/banner.png" />

        <meta property="og:url" content="https://daftarmenu.com" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Daftar Menu" />
        <meta property="og:description" content="Kelola restoran di daftarmenu.com - Tingkatkan pendapatan restoranmu dengan pelayanan servis terbaik menggunakan QRCode, Coba dan buat QRCode Restoranmu sekarang secara gratis hanya dengan satu langkah" />
        <meta property="og:image" content="https://daftarmenu.com/assets/banner.png" />
        <meta property="og:image:url" content="https://daftarmenu.com/assets/banner.png" />
        <meta property="og:image:secure_url" content="https://daftarmenu.com/assets/banner.png" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:site_name" content="Daftar Menu" />

        <meta name="twitter:title" content="Daftar Menu" />
        <meta name="twitter:description" content="Kelola restoran di daftarmenu.com - Tingkatkan pendapatan restoranmu dengan pelayanan servis terbaik menggunakan QRCode, Coba dan buat QRCode Restoranmu sekarang secara gratis hanya dengan satu langkah" />
        <meta name="twitter:image" content="https://daftarmenu.com/assets/banner.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="https://daftarmenu.com" />
        <meta name="twitter:creator" content="@sadigit_" />

        <meta name="title" content="Daftarmenu - Aplikasi Menu Digital Restoran Gratis" />
        <meta name="description" content="Kelola restoran di daftarmenu.com - Tingkatkan pendapatan restoranmu dengan pelayanan servis terbaik menggunakan QRCode, Coba dan buat QRCode Restoranmu sekarang secara gratis hanya dengan satu langkah" />
        <meta name="keywords" content="menu digital restoran, qrcode restoran, aplikasi qrcode restoran, qr code menu restoran, scan menu restoran, qrcode restoran terbaik, daftar menu digital, aplikasi menu digital restoran gratis, aplikasi restoran gratis, aplikasi kelola restoran" />
        <meta name="author" content="Sadigit" />
        <meta name="robots" content="no-index, no-follow" />
        <meta name="googlebot" content="no-index, no-follow" />
        <meta name="publisher" content="Sadigit" />

        <link rel="apple-touch-icon" href="/logo192.png" />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <body className='align-items-start py-0 flex-column'>
        <div id="root" className="w-100">
          <Main />
        </div>
        <NextScript />
      </body>
    </Html>
  )
}
