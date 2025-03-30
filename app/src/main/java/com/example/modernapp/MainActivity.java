package com.example.modernapp;

import android.content.Intent;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;

import com.google.android.material.button.MaterialButton;
import com.google.android.material.floatingactionbutton.FloatingActionButton;
import com.google.android.material.snackbar.Snackbar;

/**
 * Activité principale de l'application
 */
public class MainActivity extends AppCompatActivity {

    private MaterialButton nextButton;
    private MaterialButton profileButton;
    private MaterialButton settingsButton;
    private FloatingActionButton fab;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Configuration de la toolbar
        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

        // Initialisation des vues
        nextButton = findViewById(R.id.nextButton);
        profileButton = findViewById(R.id.profileButton);
        settingsButton = findViewById(R.id.settingsButton);
        fab = findViewById(R.id.fab);

        // Configuration des listeners pour les boutons
        setupButtonListeners();
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        int id = item.getItemId();

        if (id == R.id.action_settings) {
            navigateToSettings();
            return true;
        } else if (id == R.id.action_about) {
            showAboutInfo();
            return true;
        }

        return super.onOptionsItemSelected(item);
    }

    /**
     * Configuration des listeners pour les boutons
     */
    private void setupButtonListeners() {
        // Bouton pour aller à l'activité suivante
        nextButton.setOnClickListener(v -> {
            Intent intent = new Intent(MainActivity.this, SecondActivity.class);
            // Animation de transition
            startActivity(intent);
            overridePendingTransition(R.anim.slide_in_right, R.anim.slide_out_left);
        });

        // Bouton pour aller au profil
        profileButton.setOnClickListener(v -> {
            Intent intent = new Intent(MainActivity.this, ProfileActivity.class);
            startActivity(intent);
            overridePendingTransition(R.anim.slide_in_right, R.anim.slide_out_left);
        });

        // Bouton pour aller aux paramètres
        settingsButton.setOnClickListener(v -> {
            navigateToSettings();
        });

        // Bouton flottant (FAB)
        fab.setOnClickListener(view -> {
            Snackbar.make(view, "Fonctionnalité en développement", Snackbar.LENGTH_LONG)
                    .setAction("OK", null).show();
        });
    }

    /**
     * Navigation vers l'activité des paramètres
     */
    private void navigateToSettings() {
        Intent intent = new Intent(MainActivity.this, SettingsActivity.class);
        startActivity(intent);
        overridePendingTransition(R.anim.slide_in_right, R.anim.slide_out_left);
    }

    /**
     * Affichage des informations à propos de l'application
     */
    private void showAboutInfo() {
        Toast.makeText(this, "Application Moderne - Version 1.0", Toast.LENGTH_SHORT).show();
    }
}