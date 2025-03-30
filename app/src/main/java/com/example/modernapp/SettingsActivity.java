package com.example.modernapp;

import android.os.Bundle;
import android.view.MenuItem;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.app.AppCompatDelegate;
import androidx.appcompat.widget.Toolbar;

import com.google.android.material.switchmaterial.SwitchMaterial;

/**
 * Activité des paramètres de l'application
 */
public class SettingsActivity extends AppCompatActivity {

    private SwitchMaterial darkModeSwitch;
    private SwitchMaterial notificationsSwitch;
    private RadioGroup languageRadioGroup;
    private RadioButton frenchOption;
    private RadioButton englishOption;
    private DataManager dataManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_settings);

        // Configuration de la toolbar
        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        if (getSupportActionBar() != null) {
            getSupportActionBar().setDisplayHomeAsUpEnabled(true);
            getSupportActionBar().setTitle(R.string.settings_title);
        }

        // Récupération du gestionnaire de données
        dataManager = DataManager.getInstance();

        // Initialisation des vues
        darkModeSwitch = findViewById(R.id.darkModeSwitch);
        notificationsSwitch = findViewById(R.id.enableNotificationsSwitch);
        languageRadioGroup = findViewById(R.id.languageRadioGroup);
        frenchOption = findViewById(R.id.languageOptionFrench);
        englishOption = findViewById(R.id.languageOptionEnglish);

        // Chargement des paramètres existants
        loadSettings();

        // Configuration des listeners pour les changements de paramètres
        setupSettingsListeners();
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        if (item.getItemId() == android.R.id.home) {
            // Retour à l'activité précédente avec animation
            finish();
            overridePendingTransition(R.anim.slide_in_left, R.anim.slide_out_right);
            return true;
        }
        return super.onOptionsItemSelected(item);
    }

    @Override
    public void onBackPressed() {
        super.onBackPressed();
        // Animation de transition lors du retour
        overridePendingTransition(R.anim.slide_in_left, R.anim.slide_out_right);
    }

    /**
     * Charge les paramètres existants
     */
    private void loadSettings() {
        // Mode sombre
        darkModeSwitch.setChecked(dataManager.isDarkModeEnabled());

        // Notifications
        notificationsSwitch.setChecked(dataManager.isNotificationsEnabled());

        // Langue
        String language = dataManager.getSelectedLanguage();
        if ("en".equals(language)) {
            englishOption.setChecked(true);
        } else {
            frenchOption.setChecked(true);
        }
    }

    /**
     * Configure les listeners pour les changements de paramètres
     */
    private void setupSettingsListeners() {
        // Mode sombre
        darkModeSwitch.setOnCheckedChangeListener((buttonView, isChecked) -> {
            dataManager.setDarkModeEnabled(isChecked);
            applyDarkMode(isChecked);
        });

        // Notifications
        notificationsSwitch.setOnCheckedChangeListener((buttonView, isChecked) -> {
            dataManager.setNotificationsEnabled(isChecked);
            if (isChecked) {
                Toast.makeText(this, "Notifications activées", Toast.LENGTH_SHORT).show();
            } else {
                Toast.makeText(this, "Notifications désactivées", Toast.LENGTH_SHORT).show();
            }
        });

        // Langue
        languageRadioGroup.setOnCheckedChangeListener((group, checkedId) -> {
            if (checkedId == R.id.languageOptionEnglish) {
                dataManager.setSelectedLanguage("en");
                Toast.makeText(this, "Language set to English", Toast.LENGTH_SHORT).show();
            } else {
                dataManager.setSelectedLanguage("fr");
                Toast.makeText(this, "Langue définie sur Français", Toast.LENGTH_SHORT).show();
            }
        });
    }

    /**
     * Applique le mode sombre
     */
    private void applyDarkMode(boolean enabled) {
        if (enabled) {
            AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_YES);
        } else {
            AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_NO);
        }
    }
}