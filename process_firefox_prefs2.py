import sys
import os

# Устанавливаем переменные окружения
os.environ['MOZCONFIG'] = r'c:\Plezix\mozconfig'

# Добавляем путь к mozbuild
sys.path.insert(0, r'c:\Plezix\python\mozbuild')
sys.path.insert(0, r'c:\Plezix\build')

from mozbuild.preprocessor import Preprocessor

pp = Preprocessor()
pp.define("XP_WIN", True)
pp.define("MOZ_SANDBOX", True)
pp.define("APP_VERSION", "141.0a1")

# Создаем директорию назначения
os.makedirs(r'c:\Plezix\obj-plezix-windows\dist\bin\browser\defaults\preferences', exist_ok=True)

# Обрабатываем файл
pp.processFile(
    r'c:\Plezix\browser\app\profile\firefox.js',
    r'c:\Plezix\obj-plezix-windows\dist\bin\browser\defaults\preferences\firefox.js'
)

print("Done!")
