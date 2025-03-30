package com.example.modernapp;

import android.os.Bundle;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;

public class ProfileActivity extends AppCompatActivity {

    private EditText nameEditText;
    private EditText emailEditText;
    private EditText phoneEditText;
    private Button saveButton;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_profile);

        // Set up toolbar
        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

        // Enable back button in the toolbar
        if (getSupportActionBar() != null) {
            getSupportActionBar().setDisplayHomeAsUpEnabled(true);
            getSupportActionBar().setTitle(R.string.profile);
        }

        // Initialize views
        nameEditText = findViewById(R.id.nameEditText);
        emailEditText = findViewById(R.id.emailEditText);
        phoneEditText = findViewById(R.id.phoneEditText);
        saveButton = findViewById(R.id.saveButton);

        // Set dummy data (in a real app, this would come from a database or preferences)
        nameEditText.setText("John Doe");
        emailEditText.setText("john.doe@example.com");
        phoneEditText.setText("(123) 456-7890");

        // Set up save button
        saveButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                saveProfile();
            }
        });
    }

    private void saveProfile() {
        // In a real app, this would save the data to a database or preferences
        String name = nameEditText.getText().toString();
        String email = emailEditText.getText().toString();
        String phone = phoneEditText.getText().toString();
        
        // Validate input
        if (name.isEmpty() || email.isEmpty()) {
            Utils.showToast(this, "Name and email are required fields");
            return;
        }

        // Simple email validation
        if (!android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
            Utils.showToast(this, "Please enter a valid email address");
            return;
        }

        // Show success message
        Utils.showToast(this, "Profile saved successfully");
        
        // Go back to previous screen
        Utils.finishWithAnimation(this, R.anim.fade_in, R.anim.fade_out);
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