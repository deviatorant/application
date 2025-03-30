package com.example.modernapp;

import android.app.Activity;
import android.content.Context;
import android.widget.Toast;

/**
 * Utility class for common functions used throughout the app
 */
public class Utils {

    /**
     * Shows a toast message
     * 
     * @param context The context
     * @param message The message to show
     */
    public static void showToast(Context context, String message) {
        Toast.makeText(context, message, Toast.LENGTH_SHORT).show();
    }

    /**
     * Shows a long toast message
     * 
     * @param context The context
     * @param message The message to show
     */
    public static void showLongToast(Context context, String message) {
        Toast.makeText(context, message, Toast.LENGTH_LONG).show();
    }

    /**
     * Finish an activity with custom animation
     * 
     * @param activity The activity to finish
     * @param enterAnim The enter animation resource
     * @param exitAnim The exit animation resource
     */
    public static void finishWithAnimation(Activity activity, int enterAnim, int exitAnim) {
        activity.finish();
        activity.overridePendingTransition(enterAnim, exitAnim);
    }
}