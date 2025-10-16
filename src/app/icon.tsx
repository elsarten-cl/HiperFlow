
import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

// Para cambiar el favicon, puedes modificar el JSX que se muestra a continuación.
// Puedes usar cualquier SVG o elementos HTML/CSS para diseñar tu ícono.
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0A0A0A',
          borderRadius: '6px',
        }}
      >
        <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M22.08 8.4H13.68V0H8.88V8.4H0.48V13.2H8.88V22.8H13.68V13.2H22.08V8.4Z" fill="url(#paint0_linear_favicon)"/>
          <path d="M159.63 12.36L153.426 0H148.866L155.658 13.8L156.09 13.68C159.258 12.84 160.074 10.92 160.074 8.76C160.074 6.12 158.91 4.56 156.45 3.36L159.63 12.36ZM145.548 22.8L152.01 9.48L145.062 3.03999H136.95L144.15 12.6L135.39 22.8H145.548Z" fill="#1f7a3c" transform="scale(0.15) translate(-135, -2)"/>
          <defs>
            <linearGradient id="paint0_linear_favicon" x1="11.28" y1="0" x2="11.28" y2="22.8" gradientUnits="userSpaceOnUse">
              <stop stopColor="#11E44F"/>
              <stop offset="1" stopColor="#1f7a3c"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
    ),
    { ...size }
  )
}
