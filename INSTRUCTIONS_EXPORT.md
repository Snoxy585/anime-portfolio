# 📁 Instructions pour exporter vers VS Code

## Structure du projet

Votre projet est un **portfolio React + Supabase** avec la structure suivante :

```
anime-portfolio/
├── public/
├── src/
│   ├── App.tsx                              (Point d'entrée principal)
│   ├── components/
│   │   ├── AdminPanel.tsx                   (Panneau admin sécurisé)
│   │   ├── AuthModal.tsx                    (Modal connexion/inscription)
│   │   ├── EditCard.tsx                     (Carte d'edit vidéo)
│   │   ├── EditDetailModal.tsx              (Modal détail + interactions)
│   │   ├── EditGrid.tsx                     (Grille d'edits)
│   │   ├── FilterButtons.tsx                (Filtres par catégorie)
│   │   ├── Header.tsx                       (En-tête du site)
│   │   ├── SearchBar.tsx                    (Barre de recherche)
│   │   ├── StatsBox.tsx                     (Statistiques)
│   │   ├── Toast.tsx                        (Notifications)
│   │   ├── UserMenu.tsx                     (Menu utilisateur)
│   │   └── figma/
│   │       └── ImageWithFallback.tsx        (Composant image protégé)
│   ├── contexts/
│   │   ├── SupabaseAuthContext.tsx          (Contexte authentification)
│   │   ├── SupabaseInteractionsContext.tsx  (Contexte likes/comments/ratings)
│   │   └── ToastContext.tsx                 (Contexte notifications)
│   ├── hooks/
│   │   └── useAdminCheck.tsx                (Hook vérification admin)
│   ├── data/
│   │   └── edits.ts                         (Données des 12 edits)
│   ├── utils/
│   │   └── supabase/
│   │       ├── client.ts                    (Client Supabase singleton)
│   │       └── info.tsx                     (Clés Supabase - PROTÉGÉ)
│   ├── styles/
│   │   └── globals.css                      (Styles globaux Tailwind)
│   └── supabase/
│       └── functions/
│           └── server/
│               ├── index.tsx                (Serveur Hono principal)
│               ├── routes.tsx               (Route signup)
│               └── kv_store.tsx             (Utilitaire KV - PROTÉGÉ)
├── package.json
├── tsconfig.json
├── vite.config.ts
└── index.html
```

## 🚀 Étapes pour créer le projet dans VS Code

### 1. Créer un nouveau projet Vite + React + TypeScript

```bash
npm create vite@latest anime-portfolio -- --template react-ts
cd anime-portfolio
npm install
```

### 2. Installer les dépendances nécessaires

```bash
# Supabase
npm install @supabase/supabase-js

# Lucide React (icônes)
npm install lucide-react

# Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 3. Configurer Tailwind CSS

Créez `tailwind.config.js` :

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### 4. Structure des dossiers

Créez la structure suivante dans `src/` :

```bash
mkdir -p src/components/figma
mkdir -p src/contexts
mkdir -p src/hooks
mkdir -p src/data
mkdir -p src/utils/supabase
mkdir -p src/styles
mkdir -p supabase/functions/server
```

### 5. Copier tous les fichiers

Téléchargez tous les fichiers depuis Figma Make et placez-les dans les dossiers correspondants.

**IMPORTANT** : Les fichiers suivants contiennent vos clés Supabase :
- `src/utils/supabase/info.tsx`
- Les variables d'environnement Supabase sont déjà configurées dans votre projet Figma Make

### 6. Configuration Supabase

Les clés Supabase sont déjà dans le fichier `info.tsx` :
- Project ID: `mjvxlzdkjsbibqcvthgr`
- Anon Key: (déjà dans le fichier)

Pour le backend (Edge Functions), vous devrez déployer sur Supabase :

```bash
# Installer la CLI Supabase
npm install -g supabase

# Se connecter à Supabase
supabase login

# Lier votre projet
supabase link --project-ref mjvxlzdkjsbibqcvthgr

# Déployer les fonctions
supabase functions deploy make-server-181e480f
```

### 7. Variables d'environnement pour le serveur

Les Edge Functions utilisent ces variables (déjà configurées dans Supabase) :
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_DB_URL`

### 8. Lancer le projet

```bash
npm run dev
```

## 📝 Fichiers importants à copier

### Fichiers essentiels :
1. **App.tsx** - Point d'entrée
2. **data/edits.ts** - Vos 12 edits
3. **styles/globals.css** - Styles Tailwind
4. **Tous les composants** dans components/
5. **Tous les contextes** dans contexts/
6. **Le hook** useAdminCheck.tsx
7. **Les utilitaires Supabase** dans utils/supabase/
8. **Le serveur backend** dans supabase/functions/server/

### Admin sécurisé :
L'email admin autorisé est : **tymeo.poncelet@gmail.com**
(Configuré dans `supabase/functions/server/index.tsx`)

## 🎯 Ce que vous obtiendrez

✅ Portfolio d'edits anime/rappeur responsive
✅ Authentification sécurisée (inscription/connexion)
✅ Système de likes, commentaires et notes
✅ Panneau admin réservé à vous seul
✅ Backend Supabase complet avec PostgreSQL
✅ 12 edits configurés avec catégories
✅ Recherche et filtres fonctionnels
✅ Design dark moderne avec dégradés

## 💡 Conseils

- **Ne partagez jamais** le fichier `info.tsx` publiquement (contient les clés)
- Pour production, utilisez des variables d'environnement (.env)
- Le backend est déjà déployé sur Supabase et fonctionnel
- Les mots de passe sont cryptés (impossible de les voir, c'est normal)

## 🆘 Besoin d'aide ?

Si vous avez des questions lors de l'export, n'hésitez pas !
