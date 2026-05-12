# Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```env
# Database Connection
DATABASE_URL="mysql://username:password@localhost:3306/database_name"

# JWT Secret (generate a strong secret key)
JWT_SECRET="your-super-secret-jwt-key-here"

# Next.js App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## Database Setup

1. Make sure you have MySQL installed and running
2. Create a database for the application:
   ```sql
   CREATE DATABASE prajavarta;
   ```
3. Update the `DATABASE_URL` in your `.env.local` file with your MySQL credentials
4. Run Prisma migrations to create the tables:
   ```bash
   npx prisma migrate dev --name init
   ```
5. Generate Prisma client:
   ```bash
   npx prisma generate
   ```

## Testing the Authentication

After setting up the environment:

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Test registration:
   - Navigate to `http://localhost:3000/register`
   - Fill out the form and submit

3. Test login:
   - Navigate to `http://localhost:3000/login`
   - Use the credentials you just registered

## Troubleshooting

If authentication still doesn't work:

1. Check the browser console for errors
2. Check the server terminal for error messages
3. Verify the database connection by checking if the user was created in the database
4. Make sure all environment variables are set correctly
