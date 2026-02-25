/* -*- mode: js; indent-tabs-mode: nil; js-indent-level: 2 -*- */
/* This Source Code Form is subject to the terms of the Plezix Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * HardcoreMemorySaver - Агрессивная экономия памяти для Plezix
 * 
 * Мониторит использование памяти и выгружает неактивные вкладки когда:
 * - Свободная память системы < 20%
 * - Потребление RAM браузером высокое
 * - Вкладка не использовалась более 300 секунд (5 минут)
 */

const EXPORTED_SYMBOLS = ["HardcoreMemorySaver"];

const { XPCOMUtils } = ChromeUtils.importESModule(
  "resource://gre/modules/XPCOMUtils.sys.mjs"
);

const lazy = {};

ChromeUtils.defineESModuleGetters(lazy, {
  Log: "resource://gre/modules/Log.sys.mjs",
  Services: "resource://gre/modules/Services.sys.mjs",
});

// ============================================================================
// КОНФИГУРАЦИЯ
// ============================================================================

const PREF_BRANCH = "plezix.hardcore-memory-saver.";

const DEFAULT_PREFS = {
  // Включить/выключить функцию
  enabled: true,
  
  // Минимальная неактивность перед выгрузкой (мс) - 300 секунд = 5 минут
  minInactiveDurationMs: 300000,
  
  // Порог свободной памяти системы (%) - выгружать когда < 20%
  systemMemoryThresholdPercent: 20,
  
  // Порог потребления памяти браузером (MB) - выгружать когда > 1500MB
  browserMemoryThresholdMB: 1500,
  
  // Интервал проверки памяти (мс) - проверять каждые 30 секунд
  checkIntervalMs: 30000,
  
  // Минимальное количество вкладок для начала выгрузки
  minTabsCount: 3,
  
  // Максимальное количество вкладок для выгрузки за один цикл
  maxTabsToUnloadPerCycle: 2,
  
  // Логирование
  logLevel: "Debug", // Debug, Info, Warn, Error
};

// ============================================================================
// ЛОГГЕР
// ============================================================================

const LOGGER_NAME = "Plezix.HardcoreMemorySaver";

function getLogger() {
  if (!lazy.Log.repository.getLogger(LOGGER_NAME)) {
    const logger = lazy.Log.repository.getLogger(LOGGER_NAME);
    logger.level = lazy.Log.Level[DEFAULT_PREFS.logLevel] || lazy.Log.Level.Debug;
    logger.addAppender(new lazy.Log.DumpAppender());
    return logger;
  }
  return lazy.Log.repository.getLogger(LOGGER_NAME);
}

const log = {
  debug: (msg) => getLogger().debug(msg),
  info: (msg) => getLogger().info(msg),
  warn: (msg) => getLogger().warn(msg),
  error: (msg) => getLogger().error(msg),
};

// ============================================================================
// МОНИТОР ПАМЯТИ
// ============================================================================

class MemoryMonitor {
  constructor() {
    this._memoryWatcher = Cc["@mozilla.org/xpcom/memory-watcher;1"].getService(
      Ci.nsIAvailableMemoryWatcherBase
    );
    this._memReporter = Cc["@mozilla.org/memory-reporter-manager;1"].getService(
      Ci.nsIMemoryReporterManager
    );
  }

  /**
   * Получить процент свободной памяти системы
   * @returns {number} Процент свободной памяти (0-100)
   */
  getSystemFreeMemoryPercent() {
    try {
      // Пробуем получить информацию о памяти через memory-watcher
      const availableMemory = this._memoryWatcher.lastAvailableMemoryMB;
      const totalMemory = this._memoryWatcher.totalMemoryMB;
      
      if (availableMemory > 0 && totalMemory > 0) {
        return Math.round((availableMemory / totalMemory) * 100);
      }
      
      // Fallback: используем приблизительную оценку
      return 50; // По умолчанию считаем что 50% свободно
    } catch (ex) {
      log.error(`Failed to get system memory: ${ex}`);
      return 50;
    }
  }

  /**
   * Получить общее потребление памяти браузером (в MB)
   * @returns {number} Потребление памяти в MB
   */
  getBrowserMemoryUsageMB() {
    try {
      // Получаем информацию о процессе браузера
      const procInfo = ChromeUtils.requestProcInfo();
      
      let totalMemory = 0;
      
      // Память родительского процесса
      if (procInfo.memory) {
        totalMemory += procInfo.memory.rss / (1024 * 1024); // Конвертируем в MB
      }
      
      // Память дочерних процессов
      if (procInfo.children) {
        for (const child of procInfo.children) {
          if (child.memory) {
            totalMemory += child.memory.rss / (1024 * 1024);
          }
        }
      }
      
      return Math.round(totalMemory);
    } catch (ex) {
      log.error(`Failed to get browser memory usage: ${ex}`);
      return 0;
    }
  }

  /**
   * Проверить, нужно ли выгружать вкладки
   * @returns {boolean} true если нужно выгружать
   */
  shouldUnloadTabs() {
    const freeMemoryPercent = this.getSystemFreeMemoryPercent();
    const browserMemoryMB = this.getBrowserMemoryUsageMB();
    
    const thresholdPercent = Services.prefs.getIntPref(
      `${PREF_BRANCH}systemMemoryThresholdPercent`,
      DEFAULT_PREFS.systemMemoryThresholdPercent
    );
    
    const thresholdMB = Services.prefs.getIntPref(
      `${PREF_BRANCH}browserMemoryThresholdMB`,
      DEFAULT_PREFS.browserMemoryThresholdMB
    );
    
    log.debug(
      `Memory check: Free=${freeMemoryPercent}% (threshold=${thresholdPercent}%), ` +
      `Browser=${browserMemoryMB}MB (threshold=${thresholdMB}MB)`
    );
    
    // Выгружаем если:
    // 1. Свободная память системы < порога ИЛИ
    // 2. Потребление браузером > порога
    return (
      freeMemoryPercent < thresholdPercent ||
      browserMemoryMB > thresholdMB
    );
  }
}

// ============================================================================
// HARDCORE MEMORY SAVER
// ============================================================================

var HardcoreMemorySaver = {
  _initialized: false,
  _intervalId: null,
  _memoryMonitor: null,
  _isUnloading: false,

  /**
   * Инициализация модуля
   */
  init() {
    if (this._initialized) {
      log.warn("HardcoreMemorySaver already initialized");
      return;
    }

    // Регистрируем префы по умолчанию
    this._registerDefaultPrefs();

    // Проверяем, включена ли функция
    if (!this._isEnabled()) {
      log.info("HardcoreMemorySaver is disabled via preferences");
      return;
    }

    this._memoryMonitor = new MemoryMonitor();
    this._initialized = true;

    // Запускаем периодическую проверку
    this._startMonitoring();

    // Регистрируем обработчик memory-pressure
    Services.obs.addObserver(this, "memory-pressure");

    log.info("HardcoreMemorySaver initialized successfully");
  },

  /**
   * Регистрация префов по умолчанию
   */
  _registerDefaultPrefs() {
    const defaults = Services.prefs.getDefaultBranch(PREF_BRANCH);
    
    for (const [pref, value] of Object.entries(DEFAULT_PREFS)) {
      try {
        if (!Services.prefs.prefHasUserValue(`${PREF_BRANCH}${pref}`)) {
          if (typeof value === "boolean") {
            defaults.setBoolPref(pref, value);
          } else if (typeof value === "number") {
            defaults.setIntPref(pref, value);
          } else if (typeof value === "string") {
            defaults.setStringPref(pref, value);
          }
        }
      } catch (ex) {
        log.error(`Failed to set default pref ${pref}: ${ex}`);
      }
    }
  },

  /**
   * Проверка, включена ли функция
   */
  _isEnabled() {
    return Services.prefs.getBoolPref(
      `${PREF_BRANCH}enabled`,
      DEFAULT_PREFS.enabled
    );
  },

  /**
   * Запуск мониторинга памяти
   */
  _startMonitoring() {
    const interval = Services.prefs.getIntPref(
      `${PREF_BRANCH}checkIntervalMs`,
      DEFAULT_PREFS.checkIntervalMs
    );

    log.info(`Starting memory monitoring with interval ${interval}ms`);

    this._intervalId = setInterval(() => {
      this._checkMemoryAndUnload();
    }, interval);
  },

  /**
   * Остановка мониторинга
   */
  _stopMonitoring() {
    if (this._intervalId) {
      clearInterval(this._intervalId);
      this._intervalId = null;
      log.info("Memory monitoring stopped");
    }
  },

  /**
   * Проверка памяти и выгрузка вкладок при необходимости
   */
  async _checkMemoryAndUnload() {
    if (!this._isEnabled()) {
      return;
    }

    if (this._isUnloading) {
      log.debug("Unload operation already in progress, skipping");
      return;
    }

    // Проверяем, нужно ли выгружать
    if (!this._memoryMonitor.shouldUnloadTabs()) {
      log.debug("Memory pressure is acceptable, no need to unload tabs");
      return;
    }

    log.info("Memory pressure detected, starting tab unload process");
    await this._unloadInactiveTabs();
  },

  /**
   * Выгрузка неактивных вкладок
   */
  async _unloadInactiveTabs() {
    this._isUnloading = true;

    try {
      const minDuration = Services.prefs.getIntPref(
        `${PREF_BRANCH}minInactiveDurationMs`,
        DEFAULT_PREFS.minInactiveDurationMs
      );

      const minTabs = Services.prefs.getIntPref(
        `${PREF_BRANCH}minTabsCount`,
        DEFAULT_PREFS.minTabsCount
      );

      const maxTabs = Services.prefs.getIntPref(
        `${PREF_BRANCH}maxTabsToUnloadPerCycle`,
        DEFAULT_PREFS.maxTabsToUnloadPerCycle
      );

      // Получаем все окна и вкладки
      const windows = Services.wm.getEnumerator("navigator:browser");
      let allTabs = [];

      for (const win of windows) {
        if (win.gBrowser) {
          const tabs = Array.from(win.gBrowser.tabs);
          allTabs = allTabs.concat(tabs.map(tab => ({ tab, gBrowser: win.gBrowser })));
        }
      }

      // Проверяем минимальное количество вкладок
      if (allTabs.length <= minTabs) {
        log.debug(`Only ${allTabs.length} tabs open, skipping unload`);
        return;
      }

      // Сортируем вкладки по времени последней активности
      const now = Date.now();
      allTabs.sort((a, b) => {
        const aTime = a.tab.lastAccessed || 0;
        const bTime = b.tab.lastAccessed || 0;
        return aTime - bTime;
      });

      // Выгружаем самые старые неактивные вкладки
      let unloadedCount = 0;
      for (const { tab, gBrowser } of allTabs) {
        if (unloadedCount >= maxTabs) {
          break;
        }

        const inactiveTime = now - (tab.lastAccessed || 0);
        
        // Пропускаем активную вкладку
        if (tab.selected) {
          log.debug(`Skipping selected tab: ${tab._tPos}`);
          continue;
        }

        // Пропускаем вкладки с медиа
        if (tab.soundPlaying || tab.pictureinpicture) {
          log.debug(`Skipping tab with active media: ${tab._tPos}`);
          continue;
        }

        // Пропускаем закрепленные вкладки
        if (tab.pinned) {
          log.debug(`Skipping pinned tab: ${tab._tPos}`);
          continue;
        }

        // Проверяем, достаточно ли долго вкладка неактивна
        if (inactiveTime < minDuration) {
          log.debug(
            `Tab ${tab._tPos} inactive for ${inactiveTime}ms ` +
            `(need ${minDuration}ms), skipping`
          );
          continue;
        }

        // Выгружаем вкладку
        const url = tab.linkedBrowser?.currentURI?.spec || "unknown";
        log.info(
          `Unloading tab ${tab._tPos} (${url}) - inactive for ${Math.round(inactiveTime / 1000)}s`
        );

        try {
          await gBrowser.prepareDiscardBrowser(tab);
          if (gBrowser.discardBrowser(tab)) {
            tab.updateLastUnloadedByTabUnloader?.();
            unloadedCount++;
            log.info(`Successfully unloaded tab ${tab._tPos}`);
          } else {
            log.warn(`Failed to discard tab ${tab._tPos}`);
          }
        } catch (ex) {
          log.error(`Error unloading tab ${tab._tPos}: ${ex}`);
        }
      }

      log.info(`Unloaded ${unloadedCount} tabs in this cycle`);
    } catch (ex) {
      log.error(`Error in _unloadInactiveTabs: ${ex}`);
    } finally {
      this._isUnloading = false;
    }
  },

  /**
   * Обработчик события memory-pressure
   */
  observe(subject, topic, data) {
    if (topic === "memory-pressure") {
      log.info(`Received memory-pressure event: ${data}`);
      
      // Выгружаем вкладки немедленно при сильном давлении памяти
      if (data === "heap-minimal" || data === "heap-low") {
        this._checkMemoryAndUnload();
      }
    }
  },

  /**
   * Принудительная выгрузка неактивных вкладок
   * Может быть вызвана извне
   */
  async forceUnload() {
    log.info("Force unload requested");
    await this._unloadInactiveTabs();
  },

  /**
   * Очистка при завершении работы
   */
  uninit() {
    this._stopMonitoring();
    
    if (this._initialized) {
      Services.obs.removeObserver(this, "memory-pressure");
      this._initialized = false;
      log.info("HardcoreMemorySaver uninitialized");
    }
  },

  /**
   * Получить статистику использования памяти
   */
  getMemoryStats() {
    return {
      systemFreeMemoryPercent: this._memoryMonitor?.getSystemFreeMemoryPercent() || 0,
      browserMemoryUsageMB: this._memoryMonitor?.getBrowserMemoryUsageMB() || 0,
      shouldUnload: this._memoryMonitor?.shouldUnloadTabs() || false,
      isEnabled: this._isEnabled(),
      isUnloading: this._isUnloading,
    };
  },
};

// ============================================================================
// ЭКСПОРТ
// ============================================================================

// Автоматическая инициализация при загрузке модуля
if (typeof Services !== "undefined") {
  // Откладываем инициализацию чтобы не блокировать запуск
  setTimeout(() => {
    try {
      HardcoreMemorySaver.init();
    } catch (ex) {
      console.error("Failed to initialize HardcoreMemorySaver:", ex);
    }
  }, 5000); // Ждем 5 секунд после запуска
}
