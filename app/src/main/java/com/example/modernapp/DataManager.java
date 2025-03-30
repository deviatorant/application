package com.example.modernapp;

import java.util.ArrayList;
import java.util.List;

/**
 * DataManager class to manage app data
 * Singleton pattern implementation for global data access
 */
public class DataManager {
    // Singleton instance
    private static DataManager instance;
    
    // Data storage
    private List<ItemModel> itemList;
    private String userName;
    private String userEmail;
    private String userBio;
    private boolean darkThemeEnabled;
    private boolean notificationsEnabled;
    private boolean soundEnabled;
    
    // Private constructor for Singleton pattern
    private DataManager() {
        // Initialize with default data
        itemList = new ArrayList<>();
        populateDefaultItems();
        
        // Default user settings
        userName = "";
        userEmail = "";
        userBio = "";
        darkThemeEnabled = false;
        notificationsEnabled = true;
        soundEnabled = true;
    }
    
    // Get Singleton instance
    public static synchronized DataManager getInstance() {
        if (instance == null) {
            instance = new DataManager();
        }
        return instance;
    }
    
    // Populate with default items for the list
    private void populateDefaultItems() {
        itemList.add(new ItemModel("Item 1", "This is the first item in our modern Android app.", android.R.drawable.ic_menu_compass));
        itemList.add(new ItemModel("Item 2", "A beautifully designed application with modern UI elements.", android.R.drawable.ic_menu_gallery));
        itemList.add(new ItemModel("Item 3", "Uses RecyclerView with custom adapter for efficient list display.", android.R.drawable.ic_menu_slideshow));
        itemList.add(new ItemModel("Item 4", "Material Design components for a cohesive user experience.", android.R.drawable.ic_menu_view));
        itemList.add(new ItemModel("Item 5", "Data management through singleton pattern for global access.", android.R.drawable.ic_menu_info_details));
    }
    
    // Get all items
    public List<ItemModel> getItems() {
        return itemList;
    }
    
    // Add a new item
    public void addItem(ItemModel item) {
        itemList.add(item);
    }
    
    // Remove an item
    public void removeItem(int position) {
        if (position >= 0 && position < itemList.size()) {
            itemList.remove(position);
        }
    }
    
    // User profile methods
    public String getUserName() {
        return userName;
    }
    
    public void setUserName(String userName) {
        this.userName = userName;
    }
    
    public String getUserEmail() {
        return userEmail;
    }
    
    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }
    
    public String getUserBio() {
        return userBio;
    }
    
    public void setUserBio(String userBio) {
        this.userBio = userBio;
    }
    
    // Settings methods
    public boolean isDarkThemeEnabled() {
        return darkThemeEnabled;
    }
    
    public void setDarkThemeEnabled(boolean darkThemeEnabled) {
        this.darkThemeEnabled = darkThemeEnabled;
    }
    
    public boolean isNotificationsEnabled() {
        return notificationsEnabled;
    }
    
    public void setNotificationsEnabled(boolean notificationsEnabled) {
        this.notificationsEnabled = notificationsEnabled;
    }
    
    public boolean isSoundEnabled() {
        return soundEnabled;
    }
    
    public void setSoundEnabled(boolean soundEnabled) {
        this.soundEnabled = soundEnabled;
    }
    
    // Inner class for item data model
    public static class ItemModel {
        private String title;
        private String description;
        private int iconResource;
        
        public ItemModel(String title, String description, int iconResource) {
            this.title = title;
            this.description = description;
            this.iconResource = iconResource;
        }
        
        public String getTitle() {
            return title;
        }
        
        public String getDescription() {
            return description;
        }
        
        public int getIconResource() {
            return iconResource;
        }
    }
}