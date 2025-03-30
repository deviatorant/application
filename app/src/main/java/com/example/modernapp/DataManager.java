package com.example.modernapp;

import java.util.ArrayList;
import java.util.List;

/**
 * Classe qui gère les données de l'application
 * Singleton pour un accès global aux données
 */
public class DataManager {
    private static DataManager instance;
    private List<Item> items;
    private String username;
    private String password;
    private boolean darkModeEnabled;
    private boolean notificationsEnabled;
    private String selectedLanguage;

    // Constructeur privé pour Singleton
    private DataManager() {
        initializeData();
    }

    // Méthode pour obtenir l'instance unique
    public static synchronized DataManager getInstance() {
        if (instance == null) {
            instance = new DataManager();
        }
        return instance;
    }

    // Initialisation des données
    private void initializeData() {
        // Valeurs par défaut
        username = "";
        password = "";
        darkModeEnabled = false;
        notificationsEnabled = true;
        selectedLanguage = "fr";

        // Liste d'éléments pour le RecyclerView
        items = new ArrayList<>();
        items.add(new Item("Élément 1", "Description détaillée de l'élément 1"));
        items.add(new Item("Élément 2", "Description détaillée de l'élément 2"));
        items.add(new Item("Élément 3", "Description détaillée de l'élément 3"));
        items.add(new Item("Élément 4", "Description détaillée de l'élément 4"));
        items.add(new Item("Élément 5", "Description détaillée de l'élément 5"));
        items.add(new Item("Élément 6", "Description détaillée de l'élément 6"));
        items.add(new Item("Élément 7", "Description détaillée de l'élément 7"));
        items.add(new Item("Élément 8", "Description détaillée de l'élément 8"));
        items.add(new Item("Élément 9", "Description détaillée de l'élément 9"));
        items.add(new Item("Élément 10", "Description détaillée de l'élément 10"));
    }

    // Getters et Setters
    public List<Item> getItems() {
        return items;
    }

    public void addItem(Item item) {
        items.add(item);
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public boolean isDarkModeEnabled() {
        return darkModeEnabled;
    }

    public void setDarkModeEnabled(boolean darkModeEnabled) {
        this.darkModeEnabled = darkModeEnabled;
    }

    public boolean isNotificationsEnabled() {
        return notificationsEnabled;
    }

    public void setNotificationsEnabled(boolean notificationsEnabled) {
        this.notificationsEnabled = notificationsEnabled;
    }

    public String getSelectedLanguage() {
        return selectedLanguage;
    }

    public void setSelectedLanguage(String selectedLanguage) {
        this.selectedLanguage = selectedLanguage;
    }

    // Classe interne pour les éléments de la liste
    public static class Item {
        private String title;
        private String description;

        public Item(String title, String description) {
            this.title = title;
            this.description = description;
        }

        public String getTitle() {
            return title;
        }

        public String getDescription() {
            return description;
        }
    }
}