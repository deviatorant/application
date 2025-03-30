# Configuration GitHub depuis Replit

Voici les étapes pour publier ce projet directement sur GitHub depuis Replit :

## 1. Créer un nouveau dépôt GitHub

1. Connectez-vous à votre compte GitHub
2. Cliquez sur le bouton "+" en haut à droite, puis sur "New repository"
3. Nommez le dépôt (par exemple "modern-android-app")
4. Optionnellement, ajoutez une description
5. Laissez le dépôt public
6. Ne cochez pas "Initialize this repository with a README"
7. Cliquez sur "Create repository"

## 2. Configurer Git dans Replit

```bash
git config --global user.email "votre-email@example.com"
git config --global user.name "Votre Nom"
```

## 3. Connecter le dépôt local au dépôt GitHub

Après avoir créé le dépôt GitHub, vous verrez une page avec des instructions. Utilisez la section "…or push an existing repository from the command line".

```bash
git remote add origin https://github.com/VOTRE-PSEUDO/modern-android-app.git
git branch -M main
git push -u origin main
```

## 4. Authentification GitHub

Lorsque vous exécutez la commande push, GitHub vous demandera de vous authentifier. Dans Replit, vous devrez utiliser un token d'accès personnel :

1. Allez dans GitHub → Settings → Developer Settings → Personal access tokens
2. Cliquez sur "Generate new token"
3. Donnez un nom au token, sélectionnez la durée de validité
4. Cochez les cases "repo" pour donner l'accès complet aux dépôts
5. Cliquez sur "Generate token"
6. Copiez le token généré

Lorsque Git demande votre mot de passe, utilisez ce token à la place.

## 5. Ajouter l'APK comme Release

Une fois le code sur GitHub:

1. Allez dans la section "Releases" de votre dépôt
2. Cliquez sur "Create a new release"
3. Donnez un tag et un titre à la release
4. Joignez le fichier APK en le glissant dans la zone de dépôt
5. Cliquez sur "Publish release"