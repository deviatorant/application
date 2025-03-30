package com.example.modernapp;

import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.MenuItem;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;

import com.google.android.material.card.MaterialCardView;

public class ProfileActivity extends AppCompatActivity {

    private EditText profileNameTextView;
    private EditText profileEmailTextView;
    private MaterialCardView profileCardView;
    private Button saveButton;
    private DataManager dataManager;
    private NotificationService notificationService;
    private boolean hasChanges = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_profile);

        // Initialize data manager and notification service
        dataManager = DataManager.getInstance(this);
        notificationService = new NotificationService(this);

        // Set up toolbar
        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        
        // Enable back button in the toolbar
        if (getSupportActionBar() != null) {
            getSupportActionBar().setDisplayHomeAsUpEnabled(true);
            getSupportActionBar().setTitle(R.string.profile);
        }

        // Initialize views
        profileCardView = findViewById(R.id.profileCardView);
        profileNameTextView = findViewById(R.id.profileNameTextView);
        profileEmailTextView = findViewById(R.id.profileEmailTextView);
        saveButton = findViewById(R.id.saveButton);

        // Set up profile data from data manager
        loadProfileData();

        // Set up text change listeners
        setupTextChangeListeners();

        // Set up save button
        saveButton.setOnClickListener(v -> {
            // Save profile data to data manager
            String name = profileNameTextView.getText().toString();
            String email = profileEmailTextView.getText().toString();
            
            dataManager.setUserName(name);
            dataManager.setUserEmail(email);
            
            // Show notification if notifications are enabled
            if (dataManager.areNotificationsEnabled()) {
                notificationService.showNotification(
                        "Profile Updated",
                        "Your profile has been updated successfully"
                );
            }
            
            Utils.showToast(this, "Profile saved successfully");
            hasChanges = false;
            finish();
        });
    }

    /**
     * Loads profile data from DataManager
     */
    private void loadProfileData() {
        profileNameTextView.setText(dataManager.getUserName());
        profileEmailTextView.setText(dataManager.getUserEmail());
    }
    
    /**
     * Sets up text change listeners to detect when profile data has been modified
     */
    private void setupTextChangeListeners() {
        TextWatcher textWatcher = new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {
                // Not used
            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                // Detect changes to enable the save button
                hasChanges = true;
            }

            @Override
            public void afterTextChanged(Editable s) {
                // Not used
            }
        };
        
        profileNameTextView.addTextChangedListener(textWatcher);
        profileEmailTextView.addTextChangedListener(textWatcher);
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