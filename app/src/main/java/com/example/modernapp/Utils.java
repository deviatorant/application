package com.example.modernapp;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.view.View;
import android.widget.Toast;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;

/**
 * Utility class providing common functionality across the app
 */
public class Utils {

    /**
     * Shows a short toast message
     *
     * @param context the context
     * @param message the message to show
     */
    public static void showToast(Context context, String message) {
        Toast.makeText(context, message, Toast.LENGTH_SHORT).show();
    }

    /**
     * Shows a long toast message
     *
     * @param context the context
     * @param message the message to show
     */
    public static void showLongToast(Context context, String message) {
        Toast.makeText(context, message, Toast.LENGTH_LONG).show();
    }

    /**
     * Navigates to a specified activity with animation
     *
     * @param activity       the current activity
     * @param targetActivity the target activity class
     */
    public static void navigateToWithAnimation(Activity activity, Class<?> targetActivity) {
        Intent intent = new Intent(activity, targetActivity);
        activity.startActivity(intent);
        activity.overridePendingTransition(R.anim.slide_in_right, R.anim.slide_out_left);
    }

    /**
     * Finishes the current activity with animation
     *
     * @param activity      the activity to finish
     * @param enterAnimRes  the enter animation resource
     * @param exitAnimRes   the exit animation resource
     */
    public static void finishWithAnimation(Activity activity, int enterAnimRes, int exitAnimRes) {
        activity.finish();
        activity.overridePendingTransition(enterAnimRes, exitAnimRes);
    }

    /**
     * Sets up a click listener with animation feedback (ripple effect)
     *
     * @param view     the view to set up
     * @param listener the click listener
     */
    public static void setClickListener(View view, View.OnClickListener listener) {
        view.setOnClickListener(v -> {
            v.animate().scaleX(0.95f).scaleY(0.95f).setDuration(100)
                    .withEndAction(() -> {
                        v.animate().scaleX(1f).scaleY(1f).setDuration(100);
                        if (listener != null) {
                            listener.onClick(v);
                        }
                    });
        });
    }

    /**
     * Sets the title of an activity
     *
     * @param activity the activity
     * @param title    the title to set
     */
    public static void setActivityTitle(AppCompatActivity activity, String title) {
        if (activity.getSupportActionBar() != null) {
            activity.getSupportActionBar().setTitle(title);
        }
    }

    /**
     * Enables the back button in the toolbar
     *
     * @param activity the activity
     */
    public static void enableBackButton(AppCompatActivity activity) {
        if (activity.getSupportActionBar() != null) {
            activity.getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        }
    }
    
    /**
     * Shows an about dialog with application information
     *
     * @param context the context
     */
    public static void showAboutDialog(Context context) {
        new AlertDialog.Builder(context)
                .setTitle(R.string.app_name)
                .setMessage("Version 1.0\n\nA modern Android application with multiple screens, " +
                        "proper navigation, and Material Design components.")
                .setPositiveButton(android.R.string.ok, null)
                .setIcon(R.mipmap.ic_launcher)
                .show();
    }
}