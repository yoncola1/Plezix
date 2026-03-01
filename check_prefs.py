import re

with open(r'c:\Plezix\obj-plezix-windows\dist\bin\browser\defaults\preferences\firefox.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

line_directives = [(i+1, line.rstrip()) for i, line in enumerate(lines) if line.startswith('//@line')]
print(f'Total #@line directives: {len(line_directives)}')
for i, line in line_directives[:30]:
    print(f'{i}: {line}')
