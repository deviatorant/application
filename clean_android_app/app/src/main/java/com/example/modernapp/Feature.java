package com.example.modernapp;

/**
 * Data class representing a feature in the application
 */
public class Feature {
    private int iconResourceId;
    private String title;
    private String description;
    private Class<?> targetActivity;

    /**
     * Constructs a new Feature
     *
     * @param iconResourceId the resource ID of the icon
     * @param title          the title of the feature
     * @param description    the description of the feature
     * @param targetActivity the activity to navigate to when clicking on this feature
     */
    public Feature(int iconResourceId, String title, String description, Class<?> targetActivity) {
        this.iconResourceId = iconResourceId;
        this.title = title;
        this.description = description;
        this.targetActivity = targetActivity;
    }

    /**
     * Gets the icon resource ID
     *
     * @return the icon resource ID
     */
    public int getIconResourceId() {
        return iconResourceId;
    }

    /**
     * Sets the icon resource ID
     *
     * @param iconResourceId the icon resource ID
     */
    public void setIconResourceId(int iconResourceId) {
        this.iconResourceId = iconResourceId;
    }

    /**
     * Gets the title
     *
     * @return the title
     */
    public String getTitle() {
        return title;
    }

    /**
     * Sets the title
     *
     * @param title the title
     */
    public void setTitle(String title) {
        this.title = title;
    }

    /**
     * Gets the description
     *
     * @return the description
     */
    public String getDescription() {
        return description;
    }

    /**
     * Sets the description
     *
     * @param description the description
     */
    public void setDescription(String description) {
        this.description = description;
    }

    /**
     * Gets the target activity
     *
     * @return the target activity
     */
    public Class<?> getTargetActivity() {
        return targetActivity;
    }

    /**
     * Sets the target activity
     *
     * @param targetActivity the target activity
     */
    public void setTargetActivity(Class<?> targetActivity) {
        this.targetActivity = targetActivity;
    }
}