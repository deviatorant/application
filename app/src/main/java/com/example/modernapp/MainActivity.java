package com.example.modernapp;

import android.content.Intent;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import java.util.ArrayList;
import java.util.List;

public class MainActivity extends AppCompatActivity {

    private RecyclerView featuresRecyclerView;
    private FeatureAdapter featureAdapter;
    private List<Feature> featureList;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Set up toolbar
        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

        // Initialize welcome text
        TextView welcomeTextView = findViewById(R.id.welcomeTextView);
        welcomeTextView.setText(R.string.welcome_message);

        // Initialize RecyclerView
        featuresRecyclerView = findViewById(R.id.featuresRecyclerView);
        featuresRecyclerView.setLayoutManager(new LinearLayoutManager(this));

        // Create feature list
        initFeatureList();

        // Set up adapter
        featureAdapter = new FeatureAdapter(this, featureList);
        featuresRecyclerView.setAdapter(featureAdapter);
    }

    private void initFeatureList() {
        featureList = new ArrayList<>();

        // Add features with their respective icons and target activities
        featureList.add(new Feature(
                "Profile",
                "View and edit your profile information",
                android.R.drawable.ic_menu_myplaces,
                ProfileActivity.class));

        featureList.add(new Feature(
                "Settings",
                "Customize app settings and preferences",
                android.R.drawable.ic_menu_preferences,
                SettingsActivity.class));

        featureList.add(new Feature(
                "Theme Options",
                "Change the appearance of the app",
                android.R.drawable.ic_menu_gallery,
                SettingsActivity.class));

        featureList.add(new Feature(
                "Notifications",
                "Manage your notification preferences",
                android.R.drawable.ic_popup_reminder,
                SettingsActivity.class));

        featureList.add(new Feature(
                "About",
                "Learn more about this application",
                android.R.drawable.ic_menu_info_details,
                SettingsActivity.class));
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.main_menu, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(@NonNull MenuItem item) {
        int id = item.getItemId();

        if (id == R.id.action_settings) {
            Intent intent = new Intent(this, SettingsActivity.class);
            startActivity(intent);
            overridePendingTransition(R.anim.slide_in_right, R.anim.slide_out_left);
            return true;
        } else if (id == R.id.action_profile) {
            Intent intent = new Intent(this, ProfileActivity.class);
            startActivity(intent);
            overridePendingTransition(R.anim.slide_in_right, R.anim.slide_out_left);
            return true;
        }

        return super.onOptionsItemSelected(item);
    }
}