'use client'

import { YMaps, Map } from '@pbe/react-yandex-maps'

export default function TestMapPage() {
  return (
    <div style={{ width: '100%', height: 'calc(100vh - 4rem)', position: 'relative' }}>
      <h1 style={{ padding: '1rem' }}>Test Map Page</h1>
      <div style={{ width: '100%', height: '600px', border: '2px solid red' }}>
        <YMaps query={{ apikey: process.env.NEXT_PUBLIC_YANDEX_MAPS_KEY, lang: 'en_US' }}>
          <Map
            defaultState={{ center: [55.75, 37.57], zoom: 9 }}
            width="100%"
            height="100%"
            style={{ width: '100%', height: '100%' }}
          />
        </YMaps>
      </div>
      <p style={{ padding: '1rem' }}>
        Если карта не отображается:
        <br />
        1. Проверьте API ключ в .env.local
        <br />
        2. Откройте консоль браузера (F12)
        <br />
        3. Проверьте ошибки
      </p>
    </div>
  )
}
