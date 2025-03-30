package com.example.modernapp;

import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.google.android.material.dialog.MaterialAlertDialogBuilder;
import com.google.android.material.floatingactionbutton.FloatingActionButton;
import com.google.android.material.snackbar.Snackbar;

import java.util.List;

/**
 * Deuxième activité de l'application avec une liste d'éléments
 */
public class SecondActivity extends AppCompatActivity implements ItemAdapter.OnItemClickListener {

    private RecyclerView recyclerView;
    private ItemAdapter adapter;
    private List<DataManager.Item> items;
    private FloatingActionButton fab;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_second);

        // Configuration de la toolbar
        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        if (getSupportActionBar() != null) {
            getSupportActionBar().setDisplayHomeAsUpEnabled(true);
            getSupportActionBar().setTitle("Liste des éléments");
        }

        // Récupération des données
        items = DataManager.getInstance().getItems();

        // Configuration du RecyclerView
        recyclerView = findViewById(R.id.recyclerView);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));
        adapter = new ItemAdapter(this, items, this);
        recyclerView.setAdapter(adapter);

        // Configuration du FAB
        fab = findViewById(R.id.fab);
        fab.setOnClickListener(view -> {
            // Action lorsqu'on clique sur le FAB (ajouter un élément)
            showAddItemDialog();
        });
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
     * Affiche une boîte de dialogue pour ajouter un nouvel élément
     */
    private void showAddItemDialog() {
        // Création d'un nouvel élément pour la démonstration
        String title = "Nouvel élément " + (items.size() + 1);
        String description = "Description du nouvel élément " + (items.size() + 1);
        
        // Ajout de l'élément aux données
        DataManager.Item newItem = new DataManager.Item(title, description);
        DataManager.getInstance().addItem(newItem);
        
        // Mise à jour de l'adaptateur
        adapter.notifyItemInserted(items.size() - 1);
        
        // Notification à l'utilisateur
        Snackbar.make(recyclerView, "Nouvel élément ajouté", Snackbar.LENGTH_SHORT).show();
    }

    @Override
    public void onItemClick(DataManager.Item item, int position) {
        // Affichage des détails de l'élément
        Toast.makeText(this, "Élément sélectionné: " + item.getTitle(), Toast.LENGTH_SHORT).show();
    }

    @Override
    public void onActionButtonClick(DataManager.Item item, int position) {
        // Action lorsqu'on clique sur le bouton d'action d'un élément
        new MaterialAlertDialogBuilder(this)
                .setTitle("Détails de l'élément")
                .setMessage(item.getDescription())
                .setPositiveButton("Fermer", null)
                .show();
    }
}