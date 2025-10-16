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
          borderRadius: '16px',
        }}
      >
        <svg 
            width="24" 
            height="24" 
            viewBox="0 0 100 100" 
            xmlns="http://www.w3.org/2000/svg"
        >
            <circle cx="50" cy="50" r="45" fill="#11E44F" />
        </svg>
      </div>
    ),
    { ...size }
  )
}
