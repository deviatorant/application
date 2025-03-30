package com.example.modernapp;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Build;

import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;

/**
 * Service for handling app notifications
 */
public class NotificationService {
    private static final String CHANNEL_ID = "modern_app_channel";
    private static final String CHANNEL_NAME = "Modern App Notifications";
    private static final String CHANNEL_DESC = "Notifications from Modern App";
    
    private static final int NOTIFICATION_ID = 1001;
    
    private final Context context;
    private final NotificationManagerCompat notificationManager;
    
    /**
     * Constructor
     * 
     * @param context application context
     */
    public NotificationService(Context context) {
        this.context = context;
        this.notificationManager = NotificationManagerCompat.from(context);
        createNotificationChannel();
    }
    
    /**
     * Creates the notification channel for Android O and above
     */
    private void createNotificationChannel() {
        // Create the NotificationChannel, but only on API 26+ (Android O and above)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                    CHANNEL_ID,
                    CHANNEL_NAME,
                    NotificationManager.IMPORTANCE_DEFAULT
            );
            channel.setDescription(CHANNEL_DESC);
            
            // Register the channel with the system
            NotificationManager notificationManager = 
                    context.getSystemService(NotificationManager.class);
            if (notificationManager != null) {
                notificationManager.createNotificationChannel(channel);
            }
        }
    }
    
    /**
     * Shows a basic notification
     * 
     * @param title the notification title
     * @param message the notification message
     */
    public void showNotification(String title, String message) {
        // Check if notifications are enabled
        if (!DataManager.getInstance(context).areNotificationsEnabled()) {
            return;
        }
        
        // Create an intent that will open the app when the notification is tapped
        Intent intent = new Intent(context, MainActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        PendingIntent pendingIntent = PendingIntent.getActivity(
                context, 
                0, 
                intent, 
                PendingIntent.FLAG_IMMUTABLE
        );
        
        // Build the notification
        NotificationCompat.Builder builder = new NotificationCompat.Builder(context, CHANNEL_ID)
                .setSmallIcon(R.mipmap.ic_launcher)
                .setContentTitle(title)
                .setContentText(message)
                .setPriority(NotificationCompat.PRIORITY_DEFAULT)
                .setContentIntent(pendingIntent)
                .setAutoCancel(true);
        
        // Show the notification
        notificationManager.notify(NOTIFICATION_ID, builder.build());
    }
    
    /**
     * Cancels all notifications
     */
    public void cancelAllNotifications() {
        notificationManager.cancelAll();
    }
}