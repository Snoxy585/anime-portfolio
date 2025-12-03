# 🎬 Portfolio Tym.pcl - Edits d'Anime & Rappeurs

Portfolio professionnel présentant mes edits d'anime (Your Lie in April, Your Name, Naruto, Demon Slayer, etc.) avec système complet d'interactions utilisateurs.

## 🚀 Déploiement sur Vercel (Méthode Rapide)

### **Option 1 : Depuis GitHub (Recommandé)**

1. **Créer un nouveau repository GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/VOTRE-USERNAME/anime-portfolio.git
   git push -u origin main
   ```

2. **Déployer sur Vercel**
   - Allez sur [vercel.com](https://vercel.com)
   - Cliquez sur "New Project"
   - Importez votre repository
   - Cliquez sur "Deploy" ✅

### **Option 2 : Depuis Vercel CLI (Ultra-rapide)**

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter à Vercel
vercel login

# Déployer (dans le dossier du projet)
vercel

# Pour déployer en production
vercel --prod
```

### **Option 3 : Drag & Drop**

1. Compresser tout le projet en ZIP
2. Aller sur [vercel.com/new](https://vercel.com/new)
3. Glisser-déposer le ZIP
4. Déploiement automatique ! 🎉

## 📦 Installation locale

```bash
# Installer les dépendances
npm install

# Lancer en développement
npm run dev

# Build pour production
npm run build

# Prévisualiser le build
npm run preview
```

## 🛠️ Stack Technique

- **Frontend:** React 18 + TypeScript
- **Styling:** Tailwind CSS v4
- **Build:** Vite
- **Backend:** Supabase (Auth + Database + Edge Functions)
- **Hosting:** Vercel
- **Icons:** Lucide React
- **Notifications:** Sonner

## 🎨 Fonctionnalités

- ✅ Design moderne sombre avec dégradés radiaux
- ✅ Grille responsive d'edits avec thumbnails vidéo
- ✅ Système de recherche et filtres par catégorie
- ✅ Authentification complète (Email + Google)
- ✅ Système de likes, commentaires et notes
- ✅ Panneau admin sécurisé
- ✅ 12 edits configurés

## 🔗 Liens

- **TikTok:** [@tym.pcl](https://tiktok.com/@tym.pcl)
- **Portfolio:** [Votre lien Vercel]

## 📝 Configuration Supabase

Les variables d'environnement Supabase sont déjà configurées dans `/src/utils/supabase/info.tsx`.
Aucune configuration supplémentaire n'est nécessaire !

## 👨‍💻 Auteur

**Tym.pcl** - Créateur de contenu et editeur

---

Made with ❤️ by Tym.pcl
