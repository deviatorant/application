package com.example.modernapp;

import android.content.Context;
import android.content.SharedPreferences;

import java.util.ArrayList;
import java.util.List;

/**
 * Data manager class for handling app preferences and data
 */
public class DataManager {
    private static final String PREF_NAME = "modern_app_prefs";
    private static final String KEY_NOTIFICATIONS_ENABLED = "notifications_enabled";
    private static final String KEY_DARK_MODE_ENABLED = "dark_mode_enabled";
    private static final String KEY_USER_NAME = "user_name";
    private static final String KEY_USER_EMAIL = "user_email";

    private static DataManager instance;
    private final SharedPreferences preferences;
    
    /**
     * Model class for items to be displayed in lists
     */
    public static class ItemModel {
        private int iconResource;
        private String title;
        private String description;
        
        public ItemModel(int iconResource, String title, String description) {
            this.iconResource = iconResource;
            this.title = title;
            this.description = description;
        }
        
        public int getIconResource() {
            return iconResource;
        }
        
        public String getTitle() {
            return title;
        }
        
        public String getDescription() {
            return description;
        }
    }

    /**
     * Private constructor
     *
     * @param context application context
     */
    private DataManager(Context context) {
        preferences = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
    }

    /**
     * Gets the singleton instance
     *
     * @param context application context
     * @return the DataManager instance
     */
    public static synchronized DataManager getInstance(Context context) {
        if (instance == null) {
            instance = new DataManager(context.getApplicationContext());
        }
        return instance;
    }

    /**
     * Saves whether notifications are enabled
     *
     * @param enabled true if enabled, false otherwise
     */
    public void setNotificationsEnabled(boolean enabled) {
        preferences.edit().putBoolean(KEY_NOTIFICATIONS_ENABLED, enabled).apply();
    }

    /**
     * Checks if notifications are enabled
     *
     * @return true if notifications are enabled, false otherwise
     */
    public boolean areNotificationsEnabled() {
        return preferences.getBoolean(KEY_NOTIFICATIONS_ENABLED, true);
    }

    /**
     * Saves whether dark mode is enabled
     *
     * @param enabled true if enabled, false otherwise
     */
    public void setDarkModeEnabled(boolean enabled) {
        preferences.edit().putBoolean(KEY_DARK_MODE_ENABLED, enabled).apply();
    }

    /**
     * Checks if dark mode is enabled
     *
     * @return true if dark mode is enabled, false otherwise
     */
    public boolean isDarkModeEnabled() {
        return preferences.getBoolean(KEY_DARK_MODE_ENABLED, false);
    }

    /**
     * Saves the user name
     *
     * @param name the user name
     */
    public void setUserName(String name) {
        preferences.edit().putString(KEY_USER_NAME, name).apply();
    }

    /**
     * Gets the user name
     *
     * @return the user name, or a default value if not set
     */
    public String getUserName() {
        return preferences.getString(KEY_USER_NAME, "John Doe");
    }

    /**
     * Saves the user email
     *
     * @param email the user email
     */
    public void setUserEmail(String email) {
        preferences.edit().putString(KEY_USER_EMAIL, email).apply();
    }

    /**
     * Gets the user email
     *
     * @return the user email, or a default value if not set
     */
    public String getUserEmail() {
        return preferences.getString(KEY_USER_EMAIL, "john.doe@example.com");
    }
    
    /**
     * Gets a list of sample items for demonstration purposes
     *
     * @return a list of sample items
     */
    public List<ItemModel> getSampleItems() {
        List<ItemModel> items = new ArrayList<>();
        
        // Add sample items
        items.add(new ItemModel(android.R.drawable.ic_menu_camera, "Photos", "Access and manage your photos"));
        items.add(new ItemModel(android.R.drawable.ic_menu_call, "Contacts", "View and edit your contacts"));
        items.add(new ItemModel(android.R.drawable.ic_menu_agenda, "Calendar", "Schedule and manage events"));
        items.add(new ItemModel(android.R.drawable.ic_menu_gallery, "Gallery", "Browse your media files"));
        items.add(new ItemModel(android.R.drawable.ic_menu_send, "Messages", "Send and receive messages"));
        
        return items;
    }
}