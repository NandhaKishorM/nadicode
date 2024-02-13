import { PropsWithChildren } from 'react'

import { Metadata } from 'next'

import Providers from '@/containers/Providers'

import '@/styles/main.scss'

export const metadata: Metadata = {
  title: 'Nadi',
  description:
    'Self-hosted, local, AI Inference Platform that scales from personal use to production deployments for a team.',
}

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white font-sans text-sm antialiased dark:bg-background">
        <div className="title-bar" />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
