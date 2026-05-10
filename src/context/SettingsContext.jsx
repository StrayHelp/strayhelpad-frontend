import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getSettings, updateSettings as apiUpdateSettings } from '../services/settingsService';

const SettingsContext = createContext();

const isPlainObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);

const deepMerge = (target, source) => {
  if (!isPlainObject(source)) {
    return source;
  }

  const result = { ...(target || {}) };

  Object.keys(source).forEach((key) => {
    const sourceValue = source[key];
    const targetValue = result[key];

    if (isPlainObject(sourceValue) && isPlainObject(targetValue)) {
      result[key] = deepMerge(targetValue, sourceValue);
    } else {
      result[key] = sourceValue;
    }
  });

  return result;
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Load settings only once on app startup
  const loadSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSettings();
      setSettings(data.settings);
      setHasLoaded(true);
    } catch (err) {
      console.error('Failed to load settings:', err);
      setError(err.message);
      setHasLoaded(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!hasLoaded) {
      loadSettings();
    }
  }, [hasLoaded, loadSettings]);

  const updateSettings = useCallback(async (newSettings) => {
    try {
      setError(null);
      
      // Optimistically update local state
      setSettings((prev) => deepMerge(prev, newSettings));
      
      // Save to backend
      const response = await apiUpdateSettings(newSettings);
      
      // Verify backend response
      if (response.settings) {
        setSettings(response.settings);
      }
      
      return response;
    } catch (err) {
      console.error('Failed to update settings:', err);
      setError(err.message);
      
      // Reload from server on error
      await loadSettings();
      throw err;
    }
  }, [loadSettings]);

  const value = {
    settings,
    loading,
    error,
    loadSettings,
    updateSettings
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettingsContext = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettingsContext must be used within SettingsProvider');
  }
  return context;
};
