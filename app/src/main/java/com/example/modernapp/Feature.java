package com.example.modernapp;

/**
 * Data class representing a feature in the application
 */
public class Feature {
    private String title;
    private String description;
    private int iconResId;
    private Class<?> activityClass;

    /**
     * Constructor for Feature class
     *
     * @param title         The title of the feature
     * @param description   A short description of the feature
     * @param iconResId     The resource ID for the feature icon
     * @param activityClass The activity class to launch when this feature is selected
     */
    public Feature(String title, String description, int iconResId, Class<?> activityClass) {
        this.title = title;
        this.description = description;
        this.iconResId = iconResId;
        this.activityClass = activityClass;
    }

    // Getters
    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public int getIconResId() {
        return iconResId;
    }

    public Class<?> getActivityClass() {
        return activityClass;
    }

    // Setters
    public void setTitle(String title) {
        this.title = title;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setIconResId(int iconResId) {
        this.iconResId = iconResId;
    }

    public void setActivityClass(Class<?> activityClass) {
        this.activityClass = activityClass;
    }
}