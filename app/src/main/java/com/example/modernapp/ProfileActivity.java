package com.example.modernapp;

import android.os.Bundle;
import android.view.View;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.example.modernapp.databinding.ActivityProfileBinding;

public class ProfileActivity extends AppCompatActivity {
    private ActivityProfileBinding binding;
    private DataManager dataManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Initialize view binding
        binding = ActivityProfileBinding.inflate(getLayoutInflater());
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
        
        // Setup save profile button
        binding.buttonSaveProfile.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                saveProfileData();
            }
        });
        
        // Load profile data if available
        loadProfileData();
    }
    
    private void saveProfileData() {
        String name = binding.editTextName.getText().toString().trim();
        String email = binding.editTextEmail.getText().toString().trim();
        String bio = binding.editTextBio.getText().toString().trim();
        
        if (name.isEmpty() || email.isEmpty()) {
            Toast.makeText(this, "Name and email are required", Toast.LENGTH_SHORT).show();
            return;
        }
        
        // Save profile data
        dataManager.saveUserData("profile_name", name);
        dataManager.saveUserData("profile_email", email);
        dataManager.saveUserData("profile_bio", bio);
        
        Toast.makeText(this, "Profile saved successfully", Toast.LENGTH_SHORT).show();
    }
    
    private void loadProfileData() {
        String name = dataManager.getUserData("profile_name");
        String email = dataManager.getUserData("profile_email");
        String bio = dataManager.getUserData("profile_bio");
        
        if (name != null && !name.isEmpty()) {
            binding.editTextName.setText(name);
        }
        
        if (email != null && !email.isEmpty()) {
            binding.editTextEmail.setText(email);
        }
        
        if (bio != null && !bio.isEmpty()) {
            binding.editTextBio.setText(bio);
        }
    }
}
