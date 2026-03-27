#define NOMINMAX
#include <windows.h>
#include <string>
#include <algorithm>

// Включаем CEF заголовки
#include "include/cef_app.h"
#include "include/cef_client.h"
#include "include/cef_browser.h"
#include "include/cef_load_handler.h"

class BrowserHandler : public CefClient,
                       public CefLifeSpanHandler,
                       public CefDisplayHandler,
                       public CefLoadHandler,
                       public CefRequestHandler {
public:
    BrowserHandler() {}

    virtual CefRefPtr<CefLifeSpanHandler> GetLifeSpanHandler() override { return this; }
    virtual CefRefPtr<CefDisplayHandler> GetDisplayHandler() override { return this; }
    virtual CefRefPtr<CefLoadHandler> GetLoadHandler() override { return this; }
    virtual CefRefPtr<CefRequestHandler> GetRequestHandler() override { return this; }

    // Закрытие приложения при закрытии окна
    virtual void OnBeforeClose(CefRefPtr<CefBrowser> browser) override {
        CefQuitMessageLoop();
    }

    // После создания браузера - устанавливаем иконку
    virtual void OnAfterCreated(CefRefPtr<CefBrowser> browser) override {
        OutputDebugStringA(("Browser created: " + std::to_string(browser->GetIdentifier()) + (browser->IsPopup() ? " (popup)" : " (main)") + "\n").c_str());
        if (!browser->IsPopup()) {
            CefWindowHandle hwnd = browser->GetHost()->GetWindowHandle();
            if (hwnd) {
                HICON hIcon = (HICON)LoadImageA(GetModuleHandleA(nullptr), "icon.ico", IMAGE_ICON, 256, 256, LR_LOADFROMFILE | LR_DEFAULTSIZE);
                if (hIcon) {
                    SendMessageA(hwnd, WM_SETICON, ICON_BIG, (LPARAM)hIcon);
                    SendMessageA(hwnd, WM_SETICON, ICON_SMALL, (LPARAM)hIcon);
                }
            }
        }
    }

    // Брендирование заголовка окна
    virtual void OnTitleChange(CefRefPtr<CefBrowser> browser, const CefString& title) override {
        if (!browser->IsPopup()) {
            CefWindowHandle hwnd = browser->GetHost()->GetWindowHandle();
            if (hwnd) {
                std::wstring originalTitle = title.ToWString();
                size_t pos = originalTitle.find(L"Chromium");
                if (pos != std::wstring::npos) {
                    originalTitle.replace(pos, 8, L"Plezix");
                }
                std::wstring windowTitle = originalTitle + L" - Plezix Browser";
                SetWindowTextW(hwnd, windowTitle.c_str());
            }
        }
    }

    // Обработка только plezix:// страниц
    virtual bool OnBeforeBrowse(CefRefPtr<CefBrowser> browser, CefRefPtr<CefFrame> frame, CefRefPtr<CefRequest> request, bool user_gesture, bool is_redirect) override {
        std::string url = request->GetURL();

        // Логируем все запросы
        OutputDebugStringA(("Browse: " + url + "\n").c_str());

        // Перехват chrome://settings и plezix:// страниц
        if (url == "chrome://settings/" || url.find("plezix://") == 0) {
            char path_buf[MAX_PATH];
            GetModuleFileNameA(nullptr, path_buf, MAX_PATH);
            std::string exe_dir = std::string(path_buf).substr(0, std::string(path_buf).find_last_of("\\/"));

            std::string targetFile = "newtab.html";
            if (url.find("settings") != std::string::npos) targetFile = "settings.html";
            else if (url.find("security") != std::string::npos) targetFile = "check.html";

            std::string newUrl = "file:///" + exe_dir + "/" + targetFile;
            frame->LoadURL(newUrl);
            return true;
        }

        // Всё остальное (включая Google, YouTube) работает как обычно
        return false;
    }

    // Обработка popup окон (важно для Google входа)
    virtual bool OnBeforePopup(CefRefPtr<CefBrowser> browser, CefRefPtr<CefFrame> frame, int popup_id, const CefString& target_url, const CefString& target_frame_name, cef_window_open_disposition_t target_disposition, bool user_gesture, const CefPopupFeatures& popupFeatures, CefWindowInfo& windowInfo, CefRefPtr<CefClient>& client, CefBrowserSettings& settings, CefRefPtr<CefDictionaryValue>& extra_info, bool* no_javascript_access) override {
        // Логируем popup
        OutputDebugStringA(("Popup: " + std::string(target_url) + "\n").c_str());
        // Для Google popup разрешаем без изменений
        if (target_url.ToString().find("accounts.google.com") != std::string::npos ||
            target_url.ToString().find("google.com") != std::string::npos) {
            return false; // Разрешаем popup
        }
        return false; // Разрешаем popup для других сайтов
    }

    // Обработка ошибок загрузки
    virtual void OnLoadError(CefRefPtr<CefBrowser> browser, CefRefPtr<CefFrame> frame, ErrorCode errorCode, const CefString& errorText, const CefString& failedUrl) override {
        if (errorCode == ERR_ABORTED) return; // Игнорируем aborted
        std::string log = "Load Error: " + std::string(errorText) + " URL: " + std::string(failedUrl) + "\n";
        OutputDebugStringA(log.c_str());
        std::string html = "<html><body><h1>Load Error</h1><p>" + std::string(errorText) + "</p><p>URL: " + std::string(failedUrl) + "</p></body></html>";
        frame->LoadURL("data:text/html," + html);
    }

    IMPLEMENT_REFCOUNTING(BrowserHandler);
};

class MyApp : public CefApp {
public:
    virtual void OnBeforeCommandLineProcessing(const CefString& process_type, CefRefPtr<CefCommandLine> command_line) override {
        // === ТОЛЬКО САМОЕ НЕОБХОДИМОЕ ===
        
        // === ЯЗЫК ===
        command_line->AppendSwitchWithValue("--lang", "en-US");
        
        // === ВИДЕО ===
        command_line->AppendSwitch("--enable-accelerated-video-decode");

        // === ДЛЯ GOOGLE ===
        command_line->AppendSwitch("--disable-features=VizDisplayCompositor");
        command_line->AppendSwitch("--disable-background-timer-throttling");
        command_line->AppendSwitch("--disable-features=VideoCapture"); // Отключить video capture

        // === ОПТИМИЗАЦИЯ ПРОИЗВОДИТЕЛЬНОСТИ ===
        command_line->AppendSwitch("--disable-low-end-device-mode");
        command_line->AppendSwitch("--disable-backgrounding-occluded-windows");
        command_line->AppendSwitch("--disable-features=HeavyAdPrivacyMitigations");
        command_line->AppendSwitchWithValue("--max-tiles-for-interest-area", "512");
        command_line->AppendSwitchWithValue("--num-raster-threads", "4");
        command_line->AppendSwitch("--disable-gpu-vsync");
    }

    IMPLEMENT_REFCOUNTING(MyApp);
};

int CALLBACK WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPSTR lpCmdLine, int nCmdShow) {
    CefMainArgs main_args(hInstance);
    CefRefPtr<MyApp> app = new MyApp();

    int exit_code = CefExecuteProcess(main_args, app, nullptr);
    if (exit_code >= 0) return exit_code;

    char path_buf[MAX_PATH];
    GetModuleFileNameA(nullptr, path_buf, MAX_PATH);
    std::string exe_dir = std::string(path_buf).substr(0, std::string(path_buf).find_last_of("\\/"));

    CefSettings settings;
    // Кэш для Google авторизации
    CefString(&settings.cache_path).FromASCII((exe_dir + "\\cache").c_str());
    
    // === ЭКОНОМИЯ ОЗУ ===
    settings.windowless_rendering_enabled = false;

    CefString(&settings.locales_dir_path).FromASCII((exe_dir + "\\locales").c_str());
    CefString(&settings.resources_dir_path).FromASCII(exe_dir.c_str());

    if (!CefInitialize(main_args, settings, app, nullptr)) return 1;

    CefWindowInfo window_info;
    window_info.SetAsPopup(nullptr, L"Plezix Browser");

    CefBrowserSettings browser_settings;
    CefRefPtr<BrowserHandler> handler = new BrowserHandler();

    // Запускаем chrome://newtab
    CefBrowserHost::CreateBrowser(window_info, handler, "chrome://newtab", browser_settings, nullptr, nullptr);

    CefRunMessageLoop();
    CefShutdown();
    return 0;
}