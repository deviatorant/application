package com.example.modernapp;

import android.os.Bundle;
import android.view.MenuItem;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;

import com.google.android.material.button.MaterialButton;
import com.google.android.material.textfield.TextInputEditText;

/**
 * Activité de profil utilisateur
 */
public class ProfileActivity extends AppCompatActivity {

    private TextInputEditText usernameInput;
    private TextInputEditText passwordInput;
    private MaterialButton saveButton;
    private DataManager dataManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_profile);

        // Configuration de la toolbar
        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        if (getSupportActionBar() != null) {
            getSupportActionBar().setDisplayHomeAsUpEnabled(true);
            getSupportActionBar().setTitle(R.string.profile_title);
        }

        // Récupération du gestionnaire de données
        dataManager = DataManager.getInstance();

        // Initialisation des vues
        usernameInput = findViewById(R.id.usernameInput);
        passwordInput = findViewById(R.id.passwordInput);
        saveButton = findViewById(R.id.saveButton);

        // Chargement des données existantes
        loadProfileData();

        // Configuration du bouton de sauvegarde
        saveButton.setOnClickListener(v -> saveProfileData());
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
     * Charge les données de profil existantes
     */
    private void loadProfileData() {
        usernameInput.setText(dataManager.getUsername());
        passwordInput.setText(dataManager.getPassword());
    }

    /**
     * Sauvegarde les données de profil modifiées
     */
    private void saveProfileData() {
        String username = "";
        String password = "";

        if (usernameInput.getText() != null) {
            username = usernameInput.getText().toString().trim();
        }

        if (passwordInput.getText() != null) {
            password = passwordInput.getText().toString().trim();
        }

        // Validation
        if (username.isEmpty()) {
            usernameInput.setError("Le nom d'utilisateur ne peut pas être vide");
            return;
        }

        // Sauvegarde des données
        dataManager.setUsername(username);
        dataManager.setPassword(password);

        // Notification à l'utilisateur
        Toast.makeText(this, "Profil sauvegardé avec succès", Toast.LENGTH_SHORT).show();
        
        // Retour à l'écran précédent
        finish();
        overridePendingTransition(R.anim.slide_in_left, R.anim.slide_out_right);
    }
}