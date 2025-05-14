## Présentation
GarderieManager est un outil numérique moderne destiné aux structures de garde d’enfants. Il permet à votre personnel de gérer simplement les informations des enfants, d’enregistrer leurs présences (matin et après-midi), et de générer automatiquement des feuilles de suivi claires et imprimables.
Chaque utilisateur dispose d’un accès personnalisé selon son rôle (éducateur, responsable, parent).

[![CI](https://github.com/MrTangoo/GarderieManager/actions/workflows/ci.yml/badge.svg?branch=dev)](https://github.com/MrTangoo/GarderieManager/actions/workflows/ci.yml)
## Installation

1. Configurez les variables d’environnement dans le fichier `.env` :

```bash
# URL de la base de données
DATABASE_URL="postgres://user:password@localhost:5432/database"

# Clé secrète utilisée par NextAuth pour signer les JWT et gérer les sessions
NEXTAUTH_SECRET="une_clé_secrète_super_longue"

# URL de l’application (utilisée pour les redirections et la gestion des sessions)
NEXTAUTH_URL="http://localhost:3000"
```

2. Installez les dépendances :
  
```bash
npm install
```

3. N’oubliez pas d’initialiser la base de données (voir section Base de données & Prisma).

4. Lancez l'application :
```bash
npm run start
```

## Base de données & Prisma

```bash
# Peupler la base de données avec des données de test
npx prisma db seed

# Pousser le schéma vers la base de données
npx prisma db push

# Lancer Prisma Studio (interface de gestion visuelle de la base)
npx prisma studio

# Générer le client Prisma
npx prisma generate

```

## Lancer l'application en développement

```bash
# development
npm run dev

```

## Tests

```bash
# Exécuter tous les tests Vitest
npm run test

# Lancer Vitest avec interface graphique
npm run test:ui

```


