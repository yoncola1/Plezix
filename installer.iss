; --- СКРИПТ УСТАНОВЩИКА PLEZIX ---
#define MyAppName "Plezix Browser"
#define MyAppVersion "1.0"
#define MyAppPublisher "Plezix Team"
#define MyAppExeName "browser.exe"

[Setup]
; Уникальный ID (не меняй)
AppId={{A1B2C3D4-E5F6-4G7H-8I9J-K0L1M2N3O4P5}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppPublisher={#MyAppPublisher}
; Папка установки по умолчанию (Program Files\Plezix Browser)
DefaultDirName={autopf}\{#MyAppName}
DefaultGroupName={#MyAppName}
AllowNoIcons=yes
; Куда сохранить готовый установщик
OutputDir=.\installer_output
OutputBaseFilename=Plezix_Setup_v1.0
Compression=lzma
SolidCompression=yes
WizardStyle=modern

[Languages]
Name: "russian"; MessagesFile: "compiler:Languages\Russian.isl"

[Tasks]
; Задача для создания ярлыка на рабочем столе
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked

[Files]
; --- ПРОГРАММА И ИКОНКА ---
Source: "build\Debug\{#MyAppExeName}"; DestDir: "{app}"; Flags: ignoreversion
Source: "build\Debug\icon.ico"; DestDir: "{app}"; Flags: ignoreversion

; --- DLL БИБЛИОТЕКИ (ОБЯЗАТЕЛЬНО) ---
Source: "build\Debug\*.dll"; DestDir: "{app}"; Flags: ignoreversion

; --- РЕСУРСЫ CEF (.pak, .dat, .bin) ---
Source: "build\Debug\*.pak"; DestDir: "{app}"; Flags: ignoreversion
Source: "build\Debug\*.bin"; DestDir: "{app}"; Flags: ignoreversion
Source: "build\Debug\*.dat"; DestDir: "{app}"; Flags: ignoreversion
Source: "build\Debug\*.json"; DestDir: "{app}"; Flags: ignoreversion
Source: "build\Debug\index.html"; DestDir: "{app}"; Flags: ignoreversion

; --- ПОДПАПКА LOCALES (ВАЖНО ДЛЯ CEF) ---
Source: "build\Debug\locales\*"; DestDir: "{app}\locales"; Flags: ignoreversion recursesubdirs createallsubdirs

[Icons]
; Ярлык в меню Пуск
Name: "{group}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; IconFilename: "{app}\icon.ico"
; Ярлык на Рабочем столе
Name: "{autodesktop}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; IconFilename: "{app}\icon.ico"; Tasks: desktopicon

[Run]
; Предложить запустить браузер после установки
Filename: "{app}\{#MyAppExeName}"; Description: "{cm:LaunchProgram,{#StringChange(MyAppName, '&', '&&')}}"; Flags: nowait postinstall skipifsilent