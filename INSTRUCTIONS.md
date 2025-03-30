# Instructions pour tester l'application

## Étape 1: Cloner le dépôt GitHub
```bash
git clone https://github.com/USERNAME/modern-android-app.git
```

## Étape 2: Ouvrir le projet dans Android Studio
1. Lancez Android Studio
2. Sélectionnez "Open an existing Android Studio project"
3. Naviguez jusqu'au dossier cloné et sélectionnez-le
4. Attendez que le projet se synchronise avec Gradle

## Étape 3: Exécuter l'application
1. Connectez un appareil Android (physique ou émulateur)
2. Cliquez sur "Run" (le bouton vert de lecture) 
3. Sélectionnez votre appareil dans la liste
4. Attendez que l'application s'installe et se lance

## Architecture de l'application

L'application comprend :

1. **Écran d'accueil** (MainActivity)
   - Liste de fonctionnalités avec des cartes cliquables
   - Menu avec options de paramètres et à propos

2. **Écran secondaire** (SecondActivity) 
   - Accessible depuis l'écran d'accueil
   - Démontre la navigation et les animations

3. **Profil utilisateur** (ProfileActivity)
   - Affiche et permet de modifier les informations utilisateur
   - Utilise le DataManager pour stocker les préférences

4. **Paramètres** (SettingsActivity)
   - Options pour activer/désactiver les notifications
   - Option pour activer/désactiver le mode sombre
   - Boutons de sauvegarde et d'annulation

## Points forts techniques

- Utilisation de Material Design pour une UI moderne
- Animations de transition fluides entre les écrans
- Gestion d'état avec SharedPreferences
- Structure modulaire et extensible
- Code bien documenté avec des commentaires JavaDoc