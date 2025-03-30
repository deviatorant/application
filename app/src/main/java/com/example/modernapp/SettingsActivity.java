package com.example.modernapp;

import android.os.Bundle;
import android.view.MenuItem;
import android.widget.CompoundButton;
import android.widget.Switch;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.app.AppCompatDelegate;
import androidx.appcompat.widget.Toolbar;

public class SettingsActivity extends AppCompatActivity {

    private Switch darkModeSwitch;
    private Switch notificationsSwitch;
    private Switch vibrationSwitch;
    private Switch soundSwitch;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_settings);

        // Set up toolbar
        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

        // Enable back button in the toolbar
        if (getSupportActionBar() != null) {
            getSupportActionBar().setDisplayHomeAsUpEnabled(true);
            getSupportActionBar().setTitle(R.string.settings);
        }

        // Initialize switches
        darkModeSwitch = findViewById(R.id.darkModeSwitch);
        notificationsSwitch = findViewById(R.id.notificationsSwitch);
        vibrationSwitch = findViewById(R.id.vibrationSwitch);
        soundSwitch = findViewById(R.id.soundSwitch);

        // Set initial states (in a real app, these would come from SharedPreferences)
        darkModeSwitch.setChecked(AppCompatDelegate.getDefaultNightMode() == AppCompatDelegate.MODE_NIGHT_YES);
        notificationsSwitch.setChecked(true);
        vibrationSwitch.setChecked(true);
        soundSwitch.setChecked(true);

        // Set listeners
        darkModeSwitch.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                toggleDarkMode(isChecked);
            }
        });

        notificationsSwitch.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                toggleNotifications(isChecked);
            }
        });

        vibrationSwitch.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                toggleVibration(isChecked);
            }
        });

        soundSwitch.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                toggleSound(isChecked);
            }
        });
    }

    private void toggleDarkMode(boolean enableDarkMode) {
        // In a real app, you would save this setting to SharedPreferences
        if (enableDarkMode) {
            AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_YES);
            Utils.showToast(this, "Dark mode enabled");
        } else {
            AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_NO);
            Utils.showToast(this, "Dark mode disabled");
        }
    }

    private void toggleNotifications(boolean enableNotifications) {
        // In a real app, you would save this setting to SharedPreferences
        Utils.showToast(this, enableNotifications ? 
                "Notifications enabled" : "Notifications disabled");
        
        // Update the state of other switches based on notification setting
        if (!enableNotifications) {
            vibrationSwitch.setChecked(false);
            soundSwitch.setChecked(false);
            vibrationSwitch.setEnabled(false);
            soundSwitch.setEnabled(false);
        } else {
            vibrationSwitch.setEnabled(true);
            soundSwitch.setEnabled(true);
        }
    }

    private void toggleVibration(boolean enableVibration) {
        // In a real app, you would save this setting to SharedPreferences
        Utils.showToast(this, enableVibration ? 
                "Vibration enabled" : "Vibration disabled");
    }

    private void toggleSound(boolean enableSound) {
        // In a real app, you would save this setting to SharedPreferences
        Utils.showToast(this, enableSound ? 
                "Sound enabled" : "Sound disabled");
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