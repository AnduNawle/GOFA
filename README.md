# GOFA - Golf Océan Football Academy ⚽🌊🏆

Bienvenue sur le dépôt officiel de la **Golf Océan Football Academy (GOFA)**, également connue sous le nom de **Les Espadons**. 

Ce site web moderne et performant permet de suivre la vie de l'académie, de consulter les statistiques des joueurs, de suivre les résultats des matchs, de s'inscrire, et d'accéder à un espace membre sécurisé.

---

## 🚀 Fonctionnalités Clés

- **🏠 Tableau de bord complet :** Accueil immersif présentant l'académie, notre histoire et nos actualités majeures.
- **📈 Classements & Statistiques :** Un suivi en temps réel du classement de l'équipe et des performances globales.
- **⚽ Matchs & Résultats :** Calendrier des rencontres passées et à venir avec les logos d'équipes et les fiches de match.
- **🔄 Marché des Transferts :** Suivi dynamique des arrivées (In) et des départs (Out) de l'académie.
- **🔒 Espace Membre :** Authentification sécurisée gérée via **Firebase Auth** et intégration **Firestore** avec des politiques de sécurité strictes pour protéger les données.
- **🎨 Design Ultra-Soigné :** Élaboré de manière artistique et adaptative avec **Tailwind CSS v4** et des animations fluides grâce à **Motion**.

---

## 🛠️ Stack Technique

- **Framework Frontend :** Angular v21 (Zoneless, Standalone Components, Signals)
- **Base de données & Auth :** Firebase (Authentication & Cloud Firestore)
- **Rendu :** Rendu Hybride (SSR/CSR) propulsé par Express
- **Styles & Design :** Tailwind CSS v4, Material Icons, Font-Awesome Icons
- **Animations :** Motion (v12)
- **Build System :** Angular CLI / Builders (`@angular/build`)

---

## 💻 Installation & Lancement Local

Suivez ces étapes simples pour faire tourner le projet localement sur votre machine :

### Prerequis
Avoir **Node.js** (v18+) et **npm** installés sur votre ordinateur.

### 1. Cloner le projet
```bash
git clone <URL_DE_VOTRE_DEPOT_GITHUB>
cd <NOM_DU_DOSSIER>
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configurer Firebase (Optionnel)
Pour connecter votre propre projet Firebase, créez un fichier de configuration ou renseignez les variables d'environnement adaptées à votre projet. Les règles de sécurité Firestore se trouvent prêtes dans le fichier `firestore.rules`.

### 4. Démarrer le serveur de développement
```bash
npm run dev
```
Le site sera alors accessible localement sur `http://localhost:3000`.

---

## 📁 Structure du Projet

```text
├── src/
│   ├── app/
│   │   ├── core/           # Services (Auth, Firebase) et guards
│   │   ├── pages/          # Pages de l'application (Home, Matches, Rankings, etc.)
│   │   ├── shared/         # Composants réutilisables ou partagés (Navbar, Footer)
│   │   ├── app.ts          # Composant principal d'entrée
│   │   └── app.config.ts   # Configuration globale de l'app Angular
│   ├── public/             # Fichiers statiques et assets publics (images, logos, favicon)
│   ├── styles.css          # Styles globaux et configuration Tailwind v4
│   └── main.ts             # Point d'entrée de l'application
├── firestore.rules         # Règles de sécurité Firestore
├── angular.json            # Configuration du constructeur Angular CLI
└── package.json            # Dépendances et scripts de démarrage
```

---

## 🏆 À propos de GOFA
La **Golf Océan Football Academy (Les Espadons)** œuvre pour le développement des talents du football de demain en s'appuyant sur de fortes valeurs humaines, collectives et sportives. Le talent se construit ici !
