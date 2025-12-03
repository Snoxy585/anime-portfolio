# 🚀 GUIDE DE DÉPLOIEMENT ULTRA-RAPIDE

## ⚡ Méthode 1 : VERCEL (LA PLUS SIMPLE - 5 MIN)

### **Étape 1 : Télécharger le code**

Depuis Figma Make, vous devez copier-coller tous les fichiers dans un dossier local.

**Structure finale :**
```
anime-portfolio/
├── index.html ✅
├── package.json ✅
├── vite.config.ts ✅
├── vercel.json ✅
├── tsconfig.json ✅
├── .gitignore ✅
├── README.md ✅
├── src/
│   ├── main.tsx ✅
│   ├── App.tsx
│   ├── components/ (tous les fichiers)
│   ├── contexts/ (tous les fichiers)
│   ├── hooks/ (tous les fichiers)
│   ├── data/edits.ts
│   ├── utils/
│   └── styles/globals.css
└── supabase/
    └── functions/server/ (tous les fichiers)
```

### **Étape 2 : Push sur GitHub**

```bash
# Dans votre terminal, dans le dossier anime-portfolio
git init
git add .
git commit -m "🎬 Portfolio initial"
git branch -M main

# Créez un repo sur github.com, puis :
git remote add origin https://github.com/VOTRE-USERNAME/anime-portfolio.git
git push -u origin main
```

### **Étape 3 : Déployer sur Vercel**

1. Allez sur **https://vercel.com**
2. Cliquez sur **"Sign up with GitHub"**
3. Cliquez sur **"New Project"**
4. Sélectionnez **"anime-portfolio"**
5. Vercel détecte automatiquement Vite ✅
6. Cliquez sur **"Deploy"**

**🎉 VOTRE SITE EST EN LIGNE EN 2 MINUTES !**

URL : `https://anime-portfolio-votre-username.vercel.app`

---

## 🎯 Méthode 2 : NETLIFY DROP (30 SECONDES)

### **Super rapide mais sans Git**

1. Créez un dossier avec TOUS les fichiers du projet
2. Compressez en ZIP
3. Allez sur **https://app.netlify.com/drop**
4. **Glissez-déposez** le ZIP
5. **C'EST EN LIGNE !** 🚀

---

## 🔧 Méthode 3 : VERCEL CLI (DÉVELOPPEURS)

```bash
# Installer Vercel
npm install -g vercel

# Dans le dossier du projet
vercel login
vercel

# Pour production
vercel --prod
```

---

## ✅ CHECKLIST AVANT DÉPLOIEMENT

- [ ] Tous les fichiers copiés depuis Figma Make
- [ ] `package.json` présent ✅ (créé automatiquement)
- [ ] `vite.config.ts` présent ✅ (créé automatiquement)
- [ ] `index.html` présent ✅ (créé automatiquement)
- [ ] `src/main.tsx` présent ✅ (créé automatiquement)
- [ ] `src/App.tsx` présent (à copier depuis Figma Make)
- [ ] Tous les composants dans `src/components/`
- [ ] `src/styles/globals.css` présent

---

## 🎨 PERSONNALISATION DU DOMAINE

### Sur Vercel (Gratuit)

1. Dans votre projet Vercel
2. Onglet **"Settings"**
3. **"Domains"**
4. Ajoutez : `tym-portfolio.vercel.app` (ou autre)

### Domaine personnalisé (payant)

1. Achetez un domaine (ex: `tymponcelet.com`)
2. Dans Vercel > Domains
3. Ajoutez votre domaine
4. Suivez les instructions DNS

---

## 🐛 RÉSOLUTION DE PROBLÈMES

### Erreur : "Build failed"
```bash
# Vérifiez package.json
npm install
npm run build
```

### Erreur : "Module not found"
- Vérifiez que tous les imports sont corrects
- Vérifiez les chemins relatifs (`./ ou ../`)

### Erreur Supabase
- Les credentials sont déjà dans le code
- Attendez que Supabase se remette en ligne

---

## 📞 BESOIN D'AIDE ?

Si vous rencontrez un problème, vérifiez :
1. Tous les fichiers sont bien présents
2. La structure des dossiers est correcte
3. `npm install` fonctionne localement

---

## 🎉 APRÈS LE DÉPLOIEMENT

1. **Testez votre site** sur l'URL Vercel
2. **Partagez le lien** sur TikTok !
3. **Configurez Google OAuth** (si besoin) : https://supabase.com/docs/guides/auth/social-login/auth-google

---

**TEMPS TOTAL : 5-10 MINUTES** ⚡

Bon déploiement ! 🚀
