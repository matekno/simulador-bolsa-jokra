import { Inter } from "next/font/google";
import './globals.css'


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: 'JOKRIM INVESTMENT AND CO',
  description: 'JOKRIM INVESTMENT INC.',
}
 
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
