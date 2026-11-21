# SMART

**SMART** signifie **System for Maintenance Assistance, Research and Technical expertise**.

Ce projet est une application web de messagerie intelligente dédiée à l’assistance technique et à la maintenance. Son interface permet de créer plusieurs conversations, d’envoyer des demandes, d’afficher les réponses générées par un modèle d’IA et de retrouver l’historique localement dans le navigateur.

Le dépôt contient actuellement **l’interface frontend complète**. L’appel au modèle passe par un service configurable dans `src/context/services/openaiservice.js` ; un serveur/API externe doit être disponible pour fournir les réponses.

## Aperçu des fonctionnalités

- Interface de chat responsive pour ordinateur et mobile
- Création de nouvelles conversations
- Sélection et suppression des conversations existantes
- Suppression globale de l’historique
- Mise à jour automatique du titre avec le premier message
- Défilement automatique vers le dernier message
- Indicateur de chargement pendant l’attente de la réponse
- Affichage des erreurs renvoyées par l’API
- Modes sombre et clair avec mémorisation du choix
- Sidebar repliable, notamment sur les petits écrans
- Sauvegarde automatique des conversations, du thème et de la sidebar dans `localStorage`
- Envoi d’un message avec le bouton ou avec `Entrée`
- Saisie multilignes avec `Maj + Entrée`

## Technologies utilisées

| Technologie | Rôle |
|---|---|
| React 19 | Construction de l’interface |
| Vite 8 | Serveur de développement et compilation |
| Tailwind CSS 4 | Mise en forme responsive |
| Lucide React | Icônes |
| Context API | Gestion globale des conversations et du thème |
| Fetch API | Communication avec le service de modèle |
| localStorage | Persistance côté navigateur |

## Prérequis

- Node.js récent compatible avec Vite 8
- npm
- Un service/API compatible avec le contrat décrit ci-dessous

## Installation

```bash
git clone https://github.com/KemgneDilan/SMART.git
cd SMART
npm install
```

## Lancement

### Mode développement

```bash
npm run dev
```

Vite affiche ensuite l’adresse locale du projet, généralement `http://localhost:5173`.

### Compilation de production

```bash
npm run build
```

Les fichiers produits sont placés dans le dossier `dist/`.

### Prévisualisation de la compilation

```bash
npm run preview
```

### Vérification du code

```bash
npm run lint
```

## Configuration de l’API

L’application doit appeler un backend de confiance, dont l’adresse de base se configure dans un fichier `.env.local` à la racine du projet. Vous pouvez partir du modèle fourni :

```bash
cp .env.example .env.local
```

Adaptez ensuite cette variable dans `.env.local` :

```dotenv
VITE_MODEL_API_URL=http://localhost:8000/api
```

Dans ce cas, l’application appellera :

```text
POST http://localhost:8000/api/generate
```

Le contenu envoyé est :

```json
{
  "instruction": "Le message de l’utilisateur",
  "max_tokens": 2000,
  "temperature": 0.2
}
```

Une réponse acceptée doit contenir `response` ou `result` :

```json
{
  "response": "La réponse générée"
}
```

Le service affiche dans l’interface les erreurs HTTP renvoyées au format suivant :

```json
{
  "error": {
    "message": "Description de l’erreur"
  }
}
```

Le backend doit gérer l’accès au fournisseur de modèle et autoriser les appels provenant de l’application. Le proxy de développement dans [vite.config.js](vite.config.js) cible actuellement `https://api.openai.com` sous le chemin `/api/openai`, mais il ne constitue pas un backend complet : le frontend envoie un format JSON personnalisé avec `/generate`, qui doit être pris en charge par le service choisi.

**Ne mettez jamais de clé OpenAI ou d’autre secret dans le code frontend ni dans une variable `VITE_*`** : les variables Vite sont intégrées au JavaScript livré au navigateur et peuvent être consultées par tous les visiteurs. Stockez la clé uniquement côté serveur, dans la configuration privée de votre backend.

## Utilisation

1. Lancer l’application avec `npm run dev`.
2. Cliquer sur **New Chat** pour créer une conversation.
3. Saisir une demande dans le champ **Chat with SMART...**.
4. Appuyer sur `Entrée` ou sur le bouton d’envoi.
5. Utiliser la sidebar pour changer de conversation ou supprimer des discussions.
6. Utiliser le bouton soleil/lune pour changer de thème.

Lorsque aucune conversation n’est active, la saisie d’un premier message crée automatiquement une nouvelle conversation.

## Architecture du projet

```text
SMART/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/
│   │   ├── SMARTLogo.png
│   │   └── hero.png
│   ├── components/
│   │   ├── ChatInterface.jsx    # Structure principale de l’écran
│   │   ├── Sidebar.jsx          # Conversations et navigation
│   │   ├── MessageList.jsx      # Historique et état de chargement
│   │   ├── MessageInput.jsx     # Saisie et envoi des messages
│   │   └── SMARTLogo.jsx        # Affichage du logo
│   ├── config/
│   │   └── config.js            # URL et paramètres du modèle
│   ├── context/
│   │   ├── AppContext.jsx       # Conversations et état global
│   │   ├── ThemeContext.jsx     # Thème clair/sombre
│   │   └── services/
│   │       └── openaiservice.js # Appels HTTP au modèle
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── vite.config.js
└── package.json
```

## Gestion de l’état

### Conversations

`AppContext` gère :

- la liste des conversations ;
- l’identifiant de la conversation active ;
- la création, la suppression et la réinitialisation des discussions ;
- l’ajout des messages ;
- le titre des conversations ;
- l’état de chargement ;
- l’ouverture ou la fermeture de la sidebar.

Chaque conversation possède un identifiant, un titre, sa liste de messages et sa date de création.

### Thème

`ThemeContext` applique la classe `dark` sur la racine du document et mémorise le choix dans `localStorage`.

## Persistance des données

Les données suivantes sont conservées uniquement dans le navigateur :

| Clé | Contenu |
|---|---|
| `conversations` | Conversations et messages |
| `activeConversationId` | Conversation actuellement ouverte |
| `sidebarOpen` | État visuel de la sidebar |
| `theme` | Thème `dark` ou `light` |

Les données ne sont pas synchronisées avec un compte utilisateur et disparaissent si le stockage local du navigateur est effacé.

## Publier le projet sur GitHub

Le dépôt distant utilisé par ce projet est [KemgneDilan/SMART](https://github.com/KemgneDilan/SMART). Le fichier `.gitignore` empêche l’ajout des dépendances installées (`node_modules`), des fichiers compilés (`dist`), des caches, des journaux et des fichiers d’environnement locaux. Le modèle `.env.example` ne contient que l’URL publique du backend ; le `package-lock.json`, nécessaire pour retrouver les mêmes dépendances, doit rester suivi par Git.

Depuis le dossier du projet, vérifiez d’abord le dépôt configuré et les fichiers qui seront envoyés :

```bash
git remote -v
git status
```

Pour enregistrer et envoyer vos changements :

```bash
git add .
git commit -m "Décrire les changements"
git push -u origin main
```

Les fois suivantes, après avoir enregistré un nouveau commit, `git push` suffit. Si Git refuse l’envoi parce que le dépôt distant contient des changements, récupérez-les et intégrez-les avant de réessayer :

```bash
git pull --rebase origin main
git push
```

En cas de conflit, corrigez les fichiers signalés, puis terminez le rebase avec `git add <fichier>` et `git rebase --continue`. Ne forcez pas l’envoi avec `--force`, car cela peut écraser des commits distants. `.gitignore` ne retire pas du dépôt un fichier déjà suivi et n’efface pas l’historique Git : si un secret a été commité, révoquez-le immédiatement et purgez-le de tous les commits avant de publier.

## État actuel du projet

Réalisé :

- Interface de chat responsive
- Gestion locale des conversations
- Historique persistant dans le navigateur
- Thème clair/sombre
- Sidebar responsive
- Envoi des messages et gestion des erreurs
- Service HTTP configurable
- Logo et identité visuelle SMART
- Scripts de développement, compilation et lint

À intégrer pour rendre l’assistant pleinement opérationnel :

- API backend adaptée au modèle d’IA retenu
- Gestion sécurisée des clés/API externes
- Authentification et profils utilisateurs
- Historique sauvegardé sur serveur
- Gestion de plusieurs utilisateurs et conversations partagées
- Tests automatisés
- Streaming des réponses
- Gestion des pièces jointes et des outils spécialisés

## Dépannage

### Aucun message n’est reçu

- Vérifier que `MODEL_API_URL` pointe vers un service actif.
- Vérifier que le point d’entrée `${MODEL_API_URL}/generate` existe.
- Vérifier la console du navigateur et l’onglet réseau.
- Vérifier que le backend autorise les appels depuis l’origine Vite.

### Erreur CORS

Configurer le CORS côté API ou ajouter un proxy dans [vite.config.js](vite.config.js).

### Les données ont disparu

Les conversations sont stockées dans `localStorage`. Elles dépendent de l’origine, du navigateur et du profil utilisateur.

## Auteur

**Kemgne Dilan**  
Dépôt : [KemgneDilan/SMART](https://github.com/KemgneDilan/SMART)
