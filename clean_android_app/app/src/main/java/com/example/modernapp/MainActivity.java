package com.example.modernapp;

import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.recyclerview.widget.RecyclerView;

import java.util.ArrayList;
import java.util.List;

public class MainActivity extends AppCompatActivity implements FeatureAdapter.OnFeatureClickListener {

    private RecyclerView featuresRecyclerView;
    private List<Feature> features;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Set up toolbar
        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

        // Set up RecyclerView
        featuresRecyclerView = findViewById(R.id.featuresRecyclerView);
        setupFeaturesList();
    }

    /**
     * Sets up the features list with data
     */
    private void setupFeaturesList() {
        features = new ArrayList<>();
        
        // Add sample features
        features.add(new Feature(
                android.R.drawable.ic_menu_manage,
                "Settings",
                "Configure application settings",
                SettingsActivity.class
        ));
        
        features.add(new Feature(
                android.R.drawable.ic_menu_info_details,
                "Second Screen Demo",
                "View a demonstration of navigation to another screen",
                SecondActivity.class
        ));
        
        features.add(new Feature(
                android.R.drawable.ic_menu_myplaces,
                "User Profile",
                "View and edit your profile information",
                ProfileActivity.class
        ));

        // Set up the adapter
        FeatureAdapter adapter = new FeatureAdapter(this, features, this);
        featuresRecyclerView.setAdapter(adapter);
    }

    @Override
    public void onFeatureClick(Feature feature, int position) {
        // Handle feature click by navigating to the specified activity
        Utils.navigateToWithAnimation(this, feature.getTargetActivity());
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(@NonNull MenuItem item) {
        int id = item.getItemId();
        
        if (id == R.id.action_settings) {
            Utils.navigateToWithAnimation(this, SettingsActivity.class);
            return true;
        } else if (id == R.id.action_about) {
            // Display about information
            Utils.showAboutDialog(this);
            return true;
        }
        
        return super.onOptionsItemSelected(item);
    }
}