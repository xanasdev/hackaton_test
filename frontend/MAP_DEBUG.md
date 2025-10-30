# Диагностика проблем с картой

## Шаг 1: Проверка API ключа

### Создайте файл `.env.local` в корне проекта:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_YANDEX_MAPS_KEY=ваш_ключ_yandex_maps
```

### Получите ключ:
1. Перейдите на https://developer.tech.yandex.ru/services/
2. Зарегистрируйтесь/войдите
3. Создайте новый API ключ для JavaScript API
4. Скопируйте ключ в `.env.local`

### Проверьте, что ключ загружается:
```bash
# Перезапустите сервер
npm run dev
```

## Шаг 2: Тестовая страница

Откройте в браузере: http://localhost:3000/test-map

Эта страница покажет:
- Простую карту без дополнительных компонентов
- Красную рамку вокруг контейнера карты
- Инструкции по диагностике

## Шаг 3: Проверка консоли браузера

1. Откройте DevTools (F12 или Cmd+Option+I)
2. Перейдите на вкладку Console
3. Ищите ошибки:

### Возможные ошибки:

**"API key is invalid"**
```
Решение: Проверьте правильность ключа в .env.local
```

**"Cannot read properties of undefined"**
```
Решение: Убедитесь, что YMaps загружен до Map
```

**"Failed to load resource"**
```
Решение: Проверьте интернет-соединение
```

**Карта серая или пустая**
```
Решение: Проверьте координаты центра карты
```

## Шаг 4: Проверка структуры

### Убедитесь, что структура правильная:

```tsx
<YMaps query={{ apikey: "ваш_ключ" }}>
  <div style={{ width: '100%', height: '600px' }}>
    <Map
      defaultState={{ center: [55.75, 37.57], zoom: 9 }}
      width="100%"
      height="100%"
    />
  </div>
</YMaps>
```

### НЕ правильно:
```tsx
// ❌ Map вне YMaps
<div>
  <YMaps />
  <Map />
</div>

// ❌ Нет высоты у контейнера
<div>
  <YMaps>
    <Map />
  </YMaps>
</div>
```

## Шаг 5: Проверка стилей

### Откройте DevTools → Elements
1. Найдите элемент с картой
2. Проверьте computed styles
3. Убедитесь, что:
   - width: 100%
   - height: > 0px (не 0!)

### Если height = 0:
```css
/* Добавьте в родительский контейнер */
.mapWrapper {
  height: 600px; /* или 100vh */
}
```

## Шаг 6: Проверка сети

### DevTools → Network
1. Обновите страницу
2. Ищите запросы к api-maps.yandex.ru
3. Проверьте статус ответов (должен быть 200)

### Если 403 Forbidden:
- API ключ неверный или не активирован
- Домен не добавлен в разрешенные (для production)

## Шаг 7: Минимальный рабочий пример

Создайте новый файл `test.html`:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Yandex Map Test</title>
    <script src="https://api-maps.yandex.ru/2.1/?apikey=ВАШ_КЛЮЧ&lang=en_US"></script>
    <style>
        #map { width: 600px; height: 400px; }
    </style>
</head>
<body>
    <div id="map"></div>
    <script>
        ymaps.ready(function() {
            var map = new ymaps.Map('map', {
                center: [55.75, 37.57],
                zoom: 9
            });
        });
    </script>
</body>
</html>
```

Откройте в браузере. Если работает - проблема в React компонентах.

## Шаг 8: Проверка версии библиотеки

```bash
npm list @pbe/react-yandex-maps
```

Должна быть версия 1.2.5 или выше.

### Если нет:
```bash
npm install @pbe/react-yandex-maps@latest
```

## Шаг 9: Очистка кеша

```bash
# Удалите .next и node_modules
rm -rf .next node_modules

# Переустановите зависимости
npm install

# Запустите снова
npm run dev
```

## Шаг 10: Проверка переменных окружения

### В компоненте добавьте:
```tsx
console.log('API Key:', process.env.NEXT_PUBLIC_YANDEX_MAPS_KEY)
```

### Если undefined:
1. Файл `.env.local` должен быть в корне проекта
2. Переменная должна начинаться с `NEXT_PUBLIC_`
3. Перезапустите dev сервер

## Быстрый чеклист

- [ ] Файл `.env.local` создан
- [ ] API ключ правильный
- [ ] Dev сервер перезапущен после создания .env.local
- [ ] Тестовая страница /test-map работает
- [ ] Консоль браузера не показывает ошибок
- [ ] Контейнер карты имеет высоту > 0
- [ ] Запросы к api-maps.yandex.ru возвращают 200
- [ ] Версия @pbe/react-yandex-maps >= 1.2.5

## Если ничего не помогло

1. **Проверьте интернет**
   ```bash
   ping api-maps.yandex.ru
   ```

2. **Попробуйте другой браузер**
   - Chrome
   - Firefox
   - Safari

3. **Проверьте firewall/антивирус**
   - Может блокировать запросы к Yandex

4. **Используйте VPN**
   - В некоторых странах Yandex может быть заблокирован

## Контакты для помощи

Если проблема не решается:
1. Откройте issue на GitHub проекта
2. Приложите:
   - Скриншот консоли браузера
   - Скриншот Network tab
   - Версию Node.js (`node -v`)
   - Версию Next.js
   - Операционную систему

## Рабочий пример

После всех исправлений карта должна работать на:
- http://localhost:3000/ (главная страница)
- http://localhost:3000/test-map (тестовая страница)
