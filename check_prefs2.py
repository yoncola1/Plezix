with open(r'c:\Plezix\browser\app\profile\firefox.js', 'r', encoding='utf-8') as f:
    src_lines = len(f.readlines())

with open(r'c:\Plezix\obj-plezix-windows\dist\bin\browser\defaults\preferences\firefox.js', 'r', encoding='utf-8') as f:
    obj_lines = len(f.readlines())

print(f'Source: {src_lines} lines')
print(f'Obj: {obj_lines} lines')
print(f'Difference: {src_lines - obj_lines} lines')
