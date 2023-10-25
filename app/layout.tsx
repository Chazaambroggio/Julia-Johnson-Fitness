import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import NotificationBar from '../components/NotificationBar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Jules Johnson Fitness',
  description: `Personal Trainer from tailored workout plans to real-time progress tracking,
                embark on a transformative fitness experience like never before!`,
}

export default function RootLayout({ children } : { children: React.ReactNode }) {

  return (
    <html lang="en">
        <head>         
            <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png"/>
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png"/>
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png"/>
            <link rel="manifest" href="/favicon/site.webmanifest"/>
            <link rel="mask-icon" href="/favicon/safari-pinned-tab.svg" color="#5bbad5"/>
            <meta name="msapplication-TileColor" content="#2b5797"/>
            <meta name="theme-color" content="#ffffff"></meta>
        </head>

      <body className={inter.className}>

          <NotificationBar />
            <main className='flex flex-col flex-1 py-6 px-4'>
              {children}
            </main>
      </body>
    </html>
  )
}
