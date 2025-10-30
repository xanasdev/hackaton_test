'use client'

import { useEffect, useState } from 'react'

export default function SimpleMapPage() {
  const [apiKey, setApiKey] = useState<string | undefined>()
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_YANDEX_MAPS_KEY
    setApiKey(key)

    if (!key) {
      setError('API ключ не найден! Создайте файл .env.local с NEXT_PUBLIC_YANDEX_MAPS_KEY')
      return
    }

    const script = document.createElement('script')
    script.src = `https://api-maps.yandex.ru/2.1/?apikey=${key}&lang=en_US`
    script.async = true
    
    script.onload = () => {
      setScriptLoaded(true)
      // @ts-ignore
      if (window.ymaps) {
        // @ts-ignore
        window.ymaps.ready(() => {
          // @ts-ignore
          const map = new window.ymaps.Map('map', {
            center: [42.8746, 47.6248],
            zoom: 10
          })
          console.log('Карта успешно создана!', map)
        })
      }
    }

    script.onerror = () => {
      setError('Ошибка загрузки Yandex Maps API. Проверьте API ключ и интернет-соединение.')
    }

    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [])

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ marginBottom: '20px' }}>Диагностика Yandex Maps</h1>
      
      <div style={{ marginBottom: '20px', padding: '10px', background: '#f0f0f0', borderRadius: '5px' }}>
        <p><strong>API Key:</strong> {apiKey ? `${apiKey.substring(0, 10)}...` : '❌ НЕ НАЙДЕН'}</p>
        <p><strong>Script Loaded:</strong> {scriptLoaded ? '✅ Да' : '⏳ Загрузка...'}</p>
        {error && <p style={{ color: 'red' }}><strong>Ошибка:</strong> {error}</p>}
      </div>

      {!apiKey && (
        <div style={{ padding: '20px', background: '#fff3cd', borderRadius: '5px', marginBottom: '20px' }}>
          <h3>⚠️ Создайте файл .env.local</h3>
          <pre style={{ background: '#f8f9fa', padding: '10px', borderRadius: '5px' }}>
{`NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_YANDEX_MAPS_KEY=ваш_ключ_здесь`}
          </pre>
          <p>Получить ключ: <a href="https://developer.tech.yandex.ru/services/" target="_blank">https://developer.tech.yandex.ru/services/</a></p>
          <p><strong>После создания файла перезапустите сервер!</strong></p>
        </div>
      )}

      <div 
        id="map" 
        style={{ 
          width: '100%', 
          height: '500px', 
          border: '2px solid #007bff',
          borderRadius: '5px',
          background: '#f8f9fa'
        }}
      >
        {!scriptLoaded && !error && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100%',
            fontSize: '18px',
            color: '#666'
          }}>
            Загрузка карты...
          </div>
        )}
      </div>

      <div style={{ marginTop: '20px', padding: '10px', background: '#e7f3ff', borderRadius: '5px' }}>
        <h3>Инструкции:</h3>
        <ol>
          <li>Откройте консоль браузера (F12)</li>
          <li>Проверьте наличие ошибок</li>
          <li>Если карта не загружается, проверьте API ключ</li>
          <li>Убедитесь, что файл .env.local в корне проекта</li>
        </ol>
      </div>
    </div>
  )
}
