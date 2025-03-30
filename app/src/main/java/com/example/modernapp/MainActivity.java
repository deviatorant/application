package com.example.modernapp;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.example.modernapp.databinding.ActivityMainBinding;
import com.google.android.material.snackbar.Snackbar;

public class MainActivity extends AppCompatActivity {
    private ActivityMainBinding binding;
    private DataManager dataManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Initialize view binding
        binding = ActivityMainBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());
        
        // Initialize data manager
        dataManager = new DataManager(this);
        
        // Set up click listeners for buttons
        setupClickListeners();
        
        // Display welcome message if this is the first launch
        if (dataManager.isFirstLaunch()) {
            Snackbar.make(binding.getRoot(), "Welcome to Modern App!", Snackbar.LENGTH_LONG).show();
            dataManager.setFirstLaunch(false);
        }
    }

    private void setupClickListeners() {
        // Second screen button
        binding.buttonSecondScreen.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                navigateToSecondScreen();
            }
        });
        
        // Profile button
        binding.buttonProfile.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                navigateToProfile();
            }
        });
        
        // Settings button
        binding.buttonSettings.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                navigateToSettings();
            }
        });
        
        // Save data button
        binding.buttonSaveData.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                saveUserInput();
            }
        });
    }
    
    private void navigateToSecondScreen() {
        Intent intent = new Intent(MainActivity.this, SecondActivity.class);
        startActivity(intent);
        // Apply custom animation
        overridePendingTransition(R.anim.slide_in_right, R.anim.slide_out_left);
    }
    
    private void navigateToProfile() {
        Intent intent = new Intent(MainActivity.this, ProfileActivity.class);
        startActivity(intent);
    }
    
    private void navigateToSettings() {
        Intent intent = new Intent(MainActivity.this, SettingsActivity.class);
        startActivity(intent);
    }
    
    private void saveUserInput() {
        String userInput = binding.editTextUserInput.getText().toString().trim();
        
        if (!userInput.isEmpty()) {
            dataManager.saveUserData("user_input", userInput);
            Toast.makeText(this, "Data saved successfully!", Toast.LENGTH_SHORT).show();
            binding.editTextUserInput.setText("");
        } else {
            Toast.makeText(this, "Please enter some text", Toast.LENGTH_SHORT).show();
        }
    }
    
    @Override
    protected void onResume() {
        super.onResume();
        // Load any saved data
        String savedData = dataManager.getUserData("user_input");
        if (savedData != null && !savedData.isEmpty()) {
            binding.textViewSavedData.setText("Last saved: " + savedData);
            binding.textViewSavedData.setVisibility(View.VISIBLE);
        } else {
            binding.textViewSavedData.setVisibility(View.GONE);
        }
    }
}
