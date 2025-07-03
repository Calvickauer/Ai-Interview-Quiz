'use client'
import { useEffect } from 'react'

interface Props {
  onSuccess: (token: string) => void
}

export default function GoogleSignIn({ onSuccess }: Props) {
  useEffect(() => {
    const handle = (resp: any) => {
      onSuccess(resp.credential)
    }
    if (window.google && process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: handle,
      })
      window.google.accounts.id.renderButton(
        document.getElementById('g-btn')!,
        { theme: 'outline', size: 'large' }
      )
    }
  }, [onSuccess])
  return <div id="g-btn" />
}
