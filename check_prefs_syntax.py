import re

def check_prefs_file(filepath):
    errors = []
    with open(filepath, 'r', encoding='utf-8') as f:
        for i, line in enumerate(f, 1):
            line = line.rstrip()
            # Пропускаем пустые строки и комментарии
            if not line or line.startswith('//'):
                continue
            # Пропускаем директивы #@line
            if line.startswith('//@line'):
                continue
            # Пропускаем препроцессорные директивы
            if line.startswith('#if') or line.startswith('#else') or line.startswith('#endif') or line.startswith('#ifdef') or line.startswith('#ifndef'):
                continue
            # Проверяем строки pref
            if line.startswith('pref('):
                if not re.match(r'^pref\([^)]+\)\s*;\s*$', line):
                    errors.append(f"Line {i}: Invalid pref syntax: {repr(line)}")
            # Проверяем строки user_pref
            elif line.startswith('user_pref('):
                if not re.match(r'^user_pref\([^)]+\)\s*;\s*$', line):
                    errors.append(f"Line {i}: Invalid user_pref syntax: {repr(line)}")
            else:
                errors.append(f"Line {i}: Unexpected content: {repr(line)}")
    return errors

# Проверяем исходный файл
print("Checking source file...")
errors = check_prefs_file(r'c:\Plezix\browser\app\profile\firefox.js')
if errors:
    print(f"Found {len(errors)} errors in source file:")
    for error in errors[:20]:
        print(error)
else:
    print("Source file is OK")
