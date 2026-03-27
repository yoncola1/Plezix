cmake_minimum_required(VERSION 3.15)
project(PlezixBrowser)

# 1. Глобальная настройка рантайма (КРИТИЧНО для MSVC)
# Это говорит CMake использовать /MT в Release и /MTd в Debug для всех целей
set(CMAKE_MSVC_RUNTIME_LIBRARY "MultiThreaded$<$<CONFIG:Debug>:Debug>")

# 2. Стандарты C++
set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# 3. Пути к CEF SDK
set(CEF_ROOT "${CMAKE_SOURCE_DIR}/cef_sdk")
list(APPEND CMAKE_MODULE_PATH ${CEF_ROOT}/cmake)
find_package(CEF REQUIRED)

# 4. Исполняемый файл
add_executable(browser WIN32 main.cpp browser.rc)

# Заголовки
target_include_directories(browser PRIVATE ${CEF_ROOT})

# 5. Линковка
# Пути к библиотекам
target_link_directories(browser PRIVATE 
    ${CMAKE_SOURCE_DIR}/cef_sdk/build_lib/libcef_dll_wrapper/$<CONFIG>
    ${CMAKE_SOURCE_DIR}/cef_sdk/$<CONFIG>
)

# Библиотеки
target_link_libraries(browser
    libcef_dll_wrapper
    libcef
    ${CEF_STANDARD_LIBS}
)

# 6. Настройки компилятора MSVC
if(MSVC)
    # Статический CRT для совместимости с libcef_dll_wrapper
    set(CMAKE_CXX_FLAGS_DEBUG "${CMAKE_CXX_FLAGS_DEBUG} /MTd")
    set(CMAKE_CXX_FLAGS_RELEASE "${CMAKE_CXX_FLAGS_RELEASE} /MT")
    
    target_compile_definitions(browser PRIVATE NOMINMAX _CRT_SECURE_NO_WARNINGS)
    set_target_properties(browser PROPERTIES LINK_FLAGS "/SUBSYSTEM:WINDOWS")
endif()

# 7. Копирование ресурсов после сборки
add_custom_command(
    TARGET browser POST_BUILD
    COMMAND ${CMAKE_COMMAND} -E copy_directory "${CEF_ROOT}/$<CONFIG>" "$<TARGET_FILE_DIR:browser>"
    COMMAND ${CMAKE_COMMAND} -E copy_directory "${CEF_ROOT}/Resources" "$<TARGET_FILE_DIR:browser>"
    COMMAND ${CMAKE_COMMAND} -E copy_if_different "${CMAKE_SOURCE_DIR}/icon.ico" "$<TARGET_FILE_DIR:browser>"
    COMMAND ${CMAKE_COMMAND} -E copy_if_different "${CMAKE_SOURCE_DIR}/newtab.html" "$<TARGET_FILE_DIR:browser>"
    COMMENT "Deploying Plezix resources..."
)

# 8. Выходная папка
set_target_properties(browser PROPERTIES
    RUNTIME_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}"
)

# ============================================================================
# 9. УСТАНОВЩИК (CPack)
# ============================================================================

# Установка файлов
install(TARGETS browser
    RUNTIME DESTINATION "."
)

# Копируем все DLL и ресурсы CEF из Debug папки
install(DIRECTORY "${CEF_ROOT}/Debug/"
    DESTINATION "."
    FILES_MATCHING 
        PATTERN "*.dll"
        PATTERN "*.bin"
        PATTERN "*.json"
        PATTERN "*.pak"
        PATTERN "*.dat"
)

# Копируем папку locales
install(DIRECTORY "${CEF_ROOT}/Resources/locales/"
    DESTINATION "locales"
)

# Копируем иконку
install(FILES "${CMAKE_SOURCE_DIR}/icon.ico"
    DESTINATION "."
)

# Настройки CPack для Windows
set(CPACK_PACKAGE_NAME "Plezix Browser")
set(CPACK_PACKAGE_VENDOR "Plezix Inc.")
set(CPACK_PACKAGE_DESCRIPTION_SUMMARY "Plezix - Приватный браузер на базе Chromium 147")
set(CPACK_PACKAGE_VERSION "1.0.0")
set(CPACK_PACKAGE_VERSION_MAJOR "1")
set(CPACK_PACKAGE_VERSION_MINOR "0")
set(CPACK_PACKAGE_VERSION_PATCH "0")
set(CPACK_PACKAGE_INSTALL_DIRECTORY "Plezix")
set(CPACK_PACKAGE_ICON "${CMAKE_SOURCE_DIR}/icon.ico")

# Генераторы для Windows
set(CPACK_GENERATOR "NSIS;ZIP")
set(CPACK_NSIS_ENABLE_UNINSTALL_BEFORE_INSTALL ON)
set(CPACK_NSIS_DISPLAY_NAME "Plezix Browser")
set(CPACK_NSIS_HELP_LINK "https://github.com/yoncola1/Plezix")
set(CPACK_NSIS_URL_INFO_ABOUT "https://github.com/yoncola1/Plezix")
set(CPACK_NSIS_CONTACT "yoncola1")
set(CPACK_NSIS_MODIFY_PATH ON)
set(CPACK_NSIS_MUI_ICON "${CMAKE_SOURCE_DIR}/icon.ico")
set(CPACK_NSIS_MUI_UNIICON "${CMAKE_SOURCE_DIR}/icon.ico")

# Включаем CPack
include(CPack)
