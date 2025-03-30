package com.example.modernapp;

import android.os.Bundle;
import android.view.View;
import android.widget.CompoundButton;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.app.AppCompatDelegate;

import com.example.modernapp.databinding.ActivitySettingsBinding;

public class SettingsActivity extends AppCompatActivity {
    private ActivitySettingsBinding binding;
    private DataManager dataManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Initialize view binding
        binding = ActivitySettingsBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());
        
        // Initialize data manager
        dataManager = new DataManager(this);
        
        // Setup back button
        binding.buttonBack.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });
        
        // Setup dark mode switch
        binding.switchDarkMode.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                toggleDarkMode(isChecked);
            }
        });
        
        // Setup notifications switch
        binding.switchNotifications.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                dataManager.saveUserPreference("notifications_enabled", isChecked);
                Toast.makeText(SettingsActivity.this, 
                        "Notifications " + (isChecked ? "enabled" : "disabled"), 
                        Toast.LENGTH_SHORT).show();
            }
        });
        
        // Setup clear data button
        binding.buttonClearData.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                clearAllData();
            }
        });
        
        // Load saved settings
        loadSavedSettings();
    }
    
    private void toggleDarkMode(boolean isEnabled) {
        // Save preference
        dataManager.saveUserPreference("dark_mode_enabled", isEnabled);
        
        // Apply dark mode
        if (isEnabled) {
            AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_YES);
        } else {
            AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_NO);
        }
    }
    
    private void loadSavedSettings() {
        // Load dark mode setting
        boolean darkModeEnabled = dataManager.getUserPreference("dark_mode_enabled", false);
        binding.switchDarkMode.setChecked(darkModeEnabled);
        
        // Load notifications setting
        boolean notificationsEnabled = dataManager.getUserPreference("notifications_enabled", true);
        binding.switchNotifications.setChecked(notificationsEnabled);
    }
    
    private void clearAllData() {
        dataManager.clearAllData();
        Toast.makeText(this, "All data has been cleared", Toast.LENGTH_SHORT).show();
        
        // Reset switches to default state
        binding.switchNotifications.setChecked(true);
        binding.switchDarkMode.setChecked(false);
    }
}
