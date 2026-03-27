# 🛡️ Plezix Browser

**Приватный браузер на базе Chromium 147**

---

## 🔍 Прозрачность и Безопасность

Этот репозиторий содержит **полные исходные коды** браузера Plezix. Вы можете лично убедиться в отсутствии:

- ✅ Скрытых соединений
- ✅ Телеметрии
- ✅ Трекеров
- ✅ Бэкдоров
- ✅ Майнеров
- ✅ Шпионских модулей

---

## 📋 Что в репозитории

| Файл | Описание | Для проверки |
|---|---|---|
| `main.cpp` | Весь код браузера (~250 строк) | ✅ |
| `CMakeLists.txt` | Конфигурация сборки | ✅ |
| `start.html` | Стартовая страница | ✅ |
| `index.html` | Альтернативная страница | ✅ |
| `.gitignore` | Исключения для Git | ✅ |

---

## 🔎 Как проверить код

### 1. Быстрая проверка (5 минут)

Откройте `main.cpp` и найдите:

```cpp
// Поиск подозрительных вызовов
search: "http://"
search: "https://"
search: "socket"
search: "connect"
search: "send"
search: "recv"
```

**Результат:** Единственные сетевые вызовы — это загрузка веб-страниц через CEF.

---

### 2. Проверка сетевой активности (10 минут)

В `main.cpp` проверьте все флаги CEF:

```cpp
// Отключение телеметрии
command_line->AppendSwitch("--disable-background-networking");
command_line->AppendSwitch("--disable-sync");

// Отключение WebRTC (утечка IP)
command_line->AppendSwitch("--disable-webrtc");

// Блокировка обновлений
command_line->AppendSwitch("--disable-component-update");
```

**Результат:** Все сетевые функции Chrome отключены.

---

### 3. Проверка исходящего трафика (30 минут)

Запустите браузер с мониторингом сети:

```powershell
# Windows (PowerShell)
Start-Process -FilePath "browser.exe"
Get-NetTCPConnection | Where-Object {$_.OwningProcess -eq $PID}
```

**Результат:** Соединения только с посещаемыми сайтами.

---

### 4. Статический анализ (1 час)

Используйте инструменты:

```bash
# Cppcheck
cppcheck --enable=all main.cpp

# Clang-Tidy
clang-tidy main.cpp -- -std=c++20
```

**Результат:** Никаких скрытых вызовов.

---

## 🚀 Сборка

### Требования

- Windows 10/11 (64-bit)
- Visual Studio 2022 Community
- CMake 3.15+
- CEF SDK 147

### Инструкция

```bash
# 1. Клонируйте репозиторий
git clone https://github.com/yoncola1/Plezix.git
cd Plezix

# 2. Скачайте CEF SDK
# https://cef-builds.spotifycdn.com/index.html#windows64
# Распакуйте в папку cef_sdk/

# 3. Соберите libcef_dll_wrapper
cd cef_sdk
mkdir build_lib && cd build_lib
cmake -G "Visual Studio 17 2022" -A x64 ..
cmake --build . --config Release --target libcef_dll_wrapper

# 4. Соберите браузер
cd ../../
mkdir build && cd build
cmake -G "Visual Studio 17 2022" -A x64 ..
cmake --build . --config Release

# 5. Запустите
./Release/browser.exe
```

---

## 📦 Установщик

```bash
# Создать установщик
cd build
cpack -G NSIS -C Release

# Создать портативную версию
cpack -G ZIP -C Release
```

---

## 🔐 Функции безопасности

| Функция | Статус | Описание |
|---|---|---|
| **No Sandbox** | ✅ Включено | Для совместимости |
| **WebRTC** | ❌ Отключено | Защита от утечки IP |
| **Телеметрия** | ❌ Отключена | Нет отправки данных |
| **Синхронизация** | ❌ Отключена | Нет аккаунтов Google |
| **Обновления** | ❌ Отключены | Ручное обновление |
| **Cookie** | 🔒 Инкогнито | Очищаются при выходе |
| **Кэш** | 🔒 Инкогнито | Только RAM |

---

## 📊 Сравнение с другими браузерами

| Браузер | Исходники | Телеметрия | Проверка |
|---|---|---|---|
| **Plezix** | ✅ Открытые | ❌ Нет | ✅ Любой может проверить |
| Chrome | ❌ Закрытые | ✅ Да | ❌ Невозможно |
| Firefox | ✅ Открытые | ⚠️ Частично | ✅ Можно |
| Brave | ✅ Открытые | ⚠️ Частично | ✅ Можно |

---

## ⚠️ Отказ от ответственности

Этот браузер предоставляется "как есть". Используйте на свой страх и риск.

**Что НЕ гарантируется:**
- Полная защита от продвинутых атак
- Совместимость со всеми сайтами
- Долгосрочная поддержка

**Что гарантируется:**
- Исходный код открыт для проверки
- Нет намеренных бэкдоров
- Нет телеметрии

---

## 📝 Лицензия

MIT License — используйте как угодно.

---

## 📬 Контакты

- GitHub: [@yoncola1](https://github.com/yoncola1/Plezix)
- Email: (укажите при желании)

---

## 🔗 Полезные ссылки

- [CEF GitHub](https://github.com/chromiumembedded/cef)
- [Chromium Security](https://www.chromium.org/Home/chromium-security/)
- [EFF Privacy Badger](https://privacybadger.org/)

---

**Последнее обновление:** Март 2025
**Версия:** 1.0.0
