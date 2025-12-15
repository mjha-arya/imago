import './globals.css'

export const metadata = {
  title: 'The Witness',
  description: 'A sacred space for witnessing, not fixing.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

