package com.example.modernapp;

import android.os.Bundle;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;

public class SecondActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_second);
        
        // Set up toolbar
        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        
        // Enable back button in the toolbar
        if (getSupportActionBar() != null) {
            getSupportActionBar().setDisplayHomeAsUpEnabled(true);
            getSupportActionBar().setTitle("Second Screen");
        }
        
        // Get views
        TextView titleTextView = findViewById(R.id.titleTextView);
        TextView descriptionTextView = findViewById(R.id.descriptionTextView);
        Button actionButton = findViewById(R.id.actionButton);
        
        // Set content
        titleTextView.setText("Welcome to the Second Screen");
        descriptionTextView.setText("This is the second screen of our modern Android app. " +
                "It demonstrates navigation between multiple activities with animations.");
        
        // Set up button
        actionButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Utils.showToast(SecondActivity.this, "Action button clicked!");
                finish();
            }
        });
    }
    
    @Override
    public boolean onOptionsItemSelected(@NonNull MenuItem item) {
        if (item.getItemId() == android.R.id.home) {
            // Custom back animation
            Utils.finishWithAnimation(this, R.anim.fade_in, R.anim.slide_out_right);
            return true;
        }
        return super.onOptionsItemSelected(item);
    }
    
    @Override
    public void onBackPressed() {
        // Custom back animation
        Utils.finishWithAnimation(this, R.anim.fade_in, R.anim.slide_out_right);
    }
}