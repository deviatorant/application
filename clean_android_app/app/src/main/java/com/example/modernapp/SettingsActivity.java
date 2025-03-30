package com.example.modernapp;

import android.os.Bundle;
import android.view.MenuItem;
import android.widget.Button;
import android.widget.Switch;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;

import com.google.android.material.card.MaterialCardView;
import com.google.android.material.switchmaterial.SwitchMaterial;

public class SettingsActivity extends AppCompatActivity {

    private MaterialCardView settingsCardView;
    private SwitchMaterial notificationsSwitch;
    private SwitchMaterial darkModeSwitch;
    private Button saveButton;
    private Button cancelButton;
    private DataManager dataManager;
    private NotificationService notificationService;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_settings);

        // Initialize data manager and notification service
        dataManager = DataManager.getInstance(this);
        notificationService = new NotificationService(this);

        // Set up toolbar
        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        
        // Enable back button in the toolbar
        if (getSupportActionBar() != null) {
            getSupportActionBar().setDisplayHomeAsUpEnabled(true);
            getSupportActionBar().setTitle(R.string.settings);
        }

        // Initialize views
        settingsCardView = findViewById(R.id.settingsCardView);
        notificationsSwitch = findViewById(R.id.notificationsSwitch);
        darkModeSwitch = findViewById(R.id.darkModeSwitch);
        saveButton = findViewById(R.id.saveButton);
        cancelButton = findViewById(R.id.cancelButton);

        // Load current settings
        loadSettings();

        // Set up click listeners
        setupClickListeners();
    }

    /**
     * Loads current settings from DataManager
     */
    private void loadSettings() {
        notificationsSwitch.setChecked(dataManager.areNotificationsEnabled());
        darkModeSwitch.setChecked(dataManager.isDarkModeEnabled());
    }

    /**
     * Sets up click listeners for the buttons
     */
    private void setupClickListeners() {
        saveButton.setOnClickListener(v -> {
            // Save settings to DataManager
            dataManager.setNotificationsEnabled(notificationsSwitch.isChecked());
            dataManager.setDarkModeEnabled(darkModeSwitch.isChecked());

            // Show confirmation notification if notifications are enabled
            if (notificationsSwitch.isChecked()) {
                notificationService.showNotification(
                        "Settings Updated", 
                        "Your settings have been saved successfully"
                );
            }
            
            Utils.showToast(this, "Settings saved successfully");
            finish();
        });

        cancelButton.setOnClickListener(v -> {
            // Cancel and go back
            Utils.showToast(this, "Settings not saved");
            Utils.finishWithAnimation(this, R.anim.fade_in, R.anim.fade_out);
        });

        // Switch listeners
        notificationsSwitch.setOnCheckedChangeListener((buttonView, isChecked) -> {
            String status = isChecked ? "enabled" : "disabled";
            Utils.showToast(this, "Notifications " + status);
        });

        darkModeSwitch.setOnCheckedChangeListener((buttonView, isChecked) -> {
            String status = isChecked ? "enabled" : "disabled";
            Utils.showToast(this, "Dark mode " + status);
        });
    }

    @Override
    public boolean onOptionsItemSelected(@NonNull MenuItem item) {
        if (item.getItemId() == android.R.id.home) {
            // Custom back animation
            Utils.finishWithAnimation(this, R.anim.fade_in, R.anim.fade_out);
            return true;
        }
        return super.onOptionsItemSelected(item);
    }

    @Override
    public void onBackPressed() {
        // Custom back animation
        Utils.finishWithAnimation(this, R.anim.fade_in, R.anim.fade_out);
    }
}