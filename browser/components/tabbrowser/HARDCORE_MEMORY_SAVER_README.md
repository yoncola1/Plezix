# Plezix Hardcore Memory Saver

Агрессивная система экономии памяти для браузера Plezix на движке Gecko.

## 📋 Описание

**Hardcore Memory Saver** автоматически выгружает неактивные вкладки из памяти когда:
- Свободная память системы падает ниже 20%
- Потребление RAM браузером превышает 1500MB
- Вкладка не использовалась более 300 секунд (5 минут)

Выгруженные вкладки остаются в панели вкладок, но их содержимое удаляется из памяти. При клике на вкладку она перезагружается.

## 🚀 Быстрый старт

Функция включена по умолчанию с настройками:
- ⏱️ Выгрузка через 5 минут неактивности
- 📊 Порог свободной памяти: 20%
- 💾 Порог потребления браузером: 1500MB
- 🔄 Проверка каждые 30 секунд

## ⚙️ Настройка

Все настройки находятся в префиксе `plezix.hardcore-memory-saver.`

### Основные префы

| Преф | Значение по умолчанию | Описание |
|------|----------------------|----------|
| `enabled` | `true` | Включить/выключить функцию |
| `minInactiveDurationMs` | `300000` (5 мин) | Минимальная неактивность перед выгрузкой |
| `systemMemoryThresholdPercent` | `20` | Порог свободной памяти системы (%) |
| `browserMemoryThresholdMB` | `1500` | Порог потребления браузером (MB) |
| `checkIntervalMs` | `30000` (30 сек) | Интервал проверки памяти |
| `minTabsCount` | `3` | Мин. количество вкладок для выгрузки |
| `maxTabsToUnloadPerCycle` | `2` | Макс. вкладок за один цикл |
| `logLevel` | `"Info"` | Уровень логирования |

### Примеры настройки

**Более агрессивная экономия (выгрузка через 2 минуты):**
```javascript
user_pref("plezix.hardcore-memory-saver.minInactiveDurationMs", 120000);
user_pref("plezix.hardcore-memory-saver.systemMemoryThresholdPercent", 30);
user_pref("plezix.hardcore-memory-saver.browserMemoryThresholdMB", 1000);
```

**Менее агрессивная (выгрузка через 10 минут):**
```javascript
user_pref("plezix.hardcore-memory-saver.minInactiveDurationMs", 600000);
user_pref("plezix.hardcore-memory-saver.systemMemoryThresholdPercent", 10);
user_pref("plezix.hardcore-memory-saver.browserMemoryThresholdMB", 2000);
```

**Полное отключение:**
```javascript
user_pref("plezix.hardcore-memory-saver.enabled", false);
```

## 📁 Файловая структура

```
c:\Plezix\
├── browser\
│   ├── components\
│   │   ├── tabbrowser\
│   │   │   ├── HardcoreMemorySaver.sys.mjs    # Основной модуль
│   │   │   ├── TabUnloader.sys.mjs            # Интеграция с TabUnloader
│   │   │   └── moz.build                       # Файл сборки
│   │   └── BrowserGlue.sys.mjs                # Инициализация при запуске
│   └── app\profile\
│       └── firefox.js                         # Префы по умолчанию
└── toolkit\
    └── components\
        └── search\                            # Интеграция с поиском
```

## 🔧 Интеграция

### 1. BrowserGlue.sys.mjs
Инициализация при запуске браузера:
```javascript
ChromeUtils.defineESModuleGetters(lazy, {
  HardcoreMemorySaver: "resource:///modules/HardcoreMemorySaver.sys.mjs",
});

// В _init():
lazy.HardcoreMemorySaver.init();
```

### 2. TabUnloader.sys.mjs
Интеграция с существующей системой выгрузки:
```javascript
ChromeUtils.defineESModuleGetters(lazy, {
  HardcoreMemorySaver: "resource:///modules/HardcoreMemorySaver.sys.mjs",
});

// В unloadTabAsync():
const memoryStats = lazy.HardcoreMemorySaver.getMemoryStats();
if (!memoryStats.shouldUnload) {
  return; // Не выгружать, память в норме
}
```

## 📊 Мониторинг

### Проверка статуса через консоль браузера

Откройте Browser Console (Ctrl+Shift+J) и выполните:
```javascript
const {HardcoreMemorySaver} = ChromeUtils.import(
  "resource:///modules/HardcoreMemorySaver.sys.mjs"
);
console.log(HardcoreMemorySaver.getMemoryStats());
```

Вывод:
```javascript
{
  systemFreeMemoryPercent: 45,      // % свободной памяти
  browserMemoryUsageMB: 1234,       // Потребление браузером (MB)
  shouldUnload: false,              // Нужно ли выгружать
  isEnabled: true,                  // Включена ли функция
  isUnloading: false                // Идёт ли выгрузка
}
```

### Логи

Логи выводятся в Browser Console с префиксом `Plezix.HardcoreMemorySaver`.

Уровни логирования:
- `Debug` - детальная информация
- `Info` - основные события
- `Warn` - предупреждения
- `Error` - ошибки

## 🛡️ Защита от выгрузки

Следующие вкладки **НЕ** выгружаются:
- ✅ Активная вкладка (selected)
- ✅ Закрепленные вкладки (pinned)
- ✅ Вкладки с воспроизведением медиа (soundPlaying)
- ✅ Вкладки Picture-in-Picture
- ✅ Вкладки с WebRTC (видеозвонки)
- ✅ Приватные вкладки (Private Browsing)
- ✅ Вкладки в процессе загрузки

## 🎯 Рекомендации

### Для систем с 4GB RAM
```javascript
user_pref("plezix.hardcore-memory-saver.minInactiveDurationMs", 180000);
user_pref("plezix.hardcore-memory-saver.systemMemoryThresholdPercent", 25);
user_pref("plezix.hardcore-memory-saver.browserMemoryThresholdMB", 1200);
user_pref("plezix.hardcore-memory-saver.maxTabsToUnloadPerCycle", 3);
```

### Для систем с 8GB RAM
```javascript
user_pref("plezix.hardcore-memory-saver.minInactiveDurationMs", 300000);
user_pref("plezix.hardcore-memory-saver.systemMemoryThresholdPercent", 20);
user_pref("plezix.hardcore-memory-saver.browserMemoryThresholdMB", 2000);
```

### Для систем с 16GB+ RAM
```javascript
user_pref("plezix.hardcore-memory-saver.minInactiveDurationMs", 600000);
user_pref("plezix.hardcore-memory-saver.systemMemoryThresholdPercent", 15);
user_pref("plezix.hardcore-memory-saver.browserMemoryThresholdMB", 4000);
```

## 🐛 Отладка

### Включить подробное логирование
```javascript
user_pref("plezix.hardcore-memory-saver.logLevel", "Debug");
```

### Принудительная выгрузка
Откройте Browser Console и выполните:
```javascript
const {HardcoreMemorySaver} = ChromeUtils.import(
  "resource:///modules/HardcoreMemorySaver.sys.mjs"
);
HardcoreMemorySaver.forceUnload();
```

## 📝 История изменений

- **v1.0** - Первая версия
  - Базовая функциональность выгрузки
  - Мониторинг памяти системы и браузера
  - Интеграция с TabUnloader
  - Гибкая система префов

## 📄 Лицензия

Plezix Public License v2.0
