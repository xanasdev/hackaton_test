import { ReactNode } from 'react'
import { Map } from '@pbe/react-yandex-maps'

interface YandexMapViewProps {
  children: ReactNode
  onMapClick: (e: any) => void
}

export function YandexMapView({ children, onMapClick }: YandexMapViewProps) {
  return (
    <Map
      defaultState={{ center: [42.8746, 47.6248], zoom: 10 }}
      width="100%"
      height="100%"
      onClick={onMapClick}
    >
      {children}
    </Map>
  )
}
