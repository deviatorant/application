package com.example.modernapp;

import android.os.Bundle;
import android.view.View;

import androidx.appcompat.app.AppCompatActivity;

import com.example.modernapp.databinding.ActivitySecondBinding;

public class SecondActivity extends AppCompatActivity {
    private ActivitySecondBinding binding;
    private DataManager dataManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Initialize view binding
        binding = ActivitySecondBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());
        
        // Initialize data manager
        dataManager = new DataManager(this);
        
        // Setup back button
        binding.buttonBack.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // Go back to previous screen
                finish();
                // Apply custom animation for back navigation
                overridePendingTransition(android.R.anim.slide_in_left, android.R.anim.slide_out_right);
            }
        });
        
        // Load saved data if available
        displaySavedData();
    }
    
    private void displaySavedData() {
        String savedData = dataManager.getUserData("user_input");
        
        if (savedData != null && !savedData.isEmpty()) {
            binding.textViewSavedData.setText(savedData);
            binding.textViewEmptyState.setVisibility(View.GONE);
        } else {
            binding.textViewSavedData.setVisibility(View.GONE);
            binding.textViewEmptyState.setVisibility(View.VISIBLE);
        }
    }
    
    @Override
    public void onBackPressed() {
        super.onBackPressed();
        // Apply custom animation for back button
        overridePendingTransition(android.R.anim.slide_in_left, android.R.anim.slide_out_right);
    }
}
