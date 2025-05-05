
## Installation

1. Configure the environment variables inside the `.env` file.

```bash
# The url of the database
DATABASE_URL="postgres://user:password@localhost:5432/database"

# Secret key used by NextAuth to sign JWT tokens and manage sessions.
NEXTAUTH_SECRET="une_clé_secrète_super_longue"

# URL of your application, used for redirections and session management in NextAuth.
NEXTAUTH_URL="http://localhost:3000"
```

2. Install dependencies.
  
```bash
npm install
```

3. Don't forget to seed the database. (See the Database & Prisma section)

4. Run the application.
```bash
npm run start
```

## Database & Prisma

```bash
# seed database
npx prisma db seed

# push schema
npx prisma db push

# lunch prisma studio
npx prisma db push

# generate schema
npx prisma generate
```

## Running the app

```bash
# development
npm run dev

```

## Test

```bash
# vitest
npm run test

# vitest with ui
npm run test:ui

```


