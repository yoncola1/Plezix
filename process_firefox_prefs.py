import sys
import os

# Добавляем путь к mozbuild
sys.path.insert(0, r'c:\Plezix\python\mozbuild')

from mozbuild.preprocessor import Preprocessor

pp = Preprocessor()
pp.define("APP_VERSION", "141.0a1")

# Создаем директорию назначения
os.makedirs(r'c:\Plezix\obj-plezix-windows\dist\bin\browser\defaults\preferences', exist_ok=True)

# Обрабатываем файл
pp.processFile(
    r'c:\Plezix\browser\app\profile\firefox.js',
    r'c:\Plezix\obj-plezix-windows\dist\bin\browser\defaults\preferences\firefox.js'
)

print("Done!")
