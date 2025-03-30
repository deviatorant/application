package com.example.modernapp;

import android.content.Context;
import android.content.SharedPreferences;

/**
 * Utility class to manage data persistence using SharedPreferences
 */
public class DataManager {
    private static final String PREF_NAME = "modern_app_prefs";
    private static final String KEY_FIRST_LAUNCH = "first_launch";
    
    private final SharedPreferences sharedPreferences;
    private final SharedPreferences.Editor editor;
    
    public DataManager(Context context) {
        sharedPreferences = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
        editor = sharedPreferences.edit();
    }
    
    /**
     * Check if this is the first time the app is launched
     */
    public boolean isFirstLaunch() {
        return sharedPreferences.getBoolean(KEY_FIRST_LAUNCH, true);
    }
    
    /**
     * Set the first launch status
     */
    public void setFirstLaunch(boolean isFirstLaunch) {
        editor.putBoolean(KEY_FIRST_LAUNCH, isFirstLaunch);
        editor.apply();
    }
    
    /**
     * Save string data with a specific key
     */
    public void saveUserData(String key, String value) {
        editor.putString(key, value);
        editor.apply();
    }
    
    /**
     * Get string data by key, or null if not found
     */
    public String getUserData(String key) {
        return sharedPreferences.getString(key, null);
    }
    
    /**
     * Save boolean preference
     */
    public void saveUserPreference(String key, boolean value) {
        editor.putBoolean(key, value);
        editor.apply();
    }
    
    /**
     * Get boolean preference with a default value
     */
    public boolean getUserPreference(String key, boolean defaultValue) {
        return sharedPreferences.getBoolean(key, defaultValue);
    }
    
    /**
     * Clear all stored data
     */
    public void clearAllData() {
        editor.clear();
        // We want to keep the first launch as false
        editor.putBoolean(KEY_FIRST_LAUNCH, false);
        editor.apply();
    }
}
