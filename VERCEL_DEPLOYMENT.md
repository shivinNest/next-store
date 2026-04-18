# Vercel Deployment Guide

## Environment Variables

Create these environment variables in Vercel Dashboard:

### Database
- `DATABASE_URL`: PostgreSQL connection string with pooling (e.g., `postgresql://user:password@host:port/db?schema=public&connection_limit=5`)

### JWT & Security
- `JWT_SECRET`: Strong random string (min 32 characters) for token signing

### Email Configuration
- `SMTP_HOST`: SMTP server hostname
- `SMTP_PORT`: SMTP port (usually 587 or 465)
- `SMTP_USER`: SMTP authentication username
- `SMTP_PASSWORD`: SMTP authentication password
- `ADMIN_EMAIL`: Admin email address

### Optional
- `NEXT_PUBLIC_API_URL`: Public API URL (defaults to the deployment URL)

## Database Setup

Before deployment:

1. **Create PostgreSQL Database**
   - Use neon.tech, railway.app, or similar PostgreSQL hosting
   - Ensure connection pooling is enabled

2. **Run Migrations**
   ```bash
   npm run seed
   ```
   Or manually:
   ```bash
   npx prisma migrate deploy
   npx prisma db seed
   ```

3. **Connection String Format**
   ```
   postgresql://[user[:password]@][netloc][:port][/dbname][?param1=value1&...]
   ```

## Deployment Steps

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for Vercel deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Select "Next.js" template (auto-detected)

3. **Set Environment Variables**
   - Add all required variables from the list above
   - Use `vercel.json` configuration as reference

4. **Deploy**
   - Click "Deploy"
   - Vercel will run `next build`
   - Your app will be live within 2-5 minutes

## Post-Deployment Checklist

- [ ] Database connection working (`/api/auth/me` returns proper user data)
- [ ] Email sending works (check registration flow)
- [ ] File uploads working (`/api/upload`)
- [ ] Admin panel accessible and functional
- [ ] All API routes responding correctly
- [ ] CORS configured if needed

## Troubleshooting

### Build Fails with Prisma
- Ensure `prisma generate` runs during build
- Add `prisma` to `serverExternalPackages` in `next.config.ts` ✅ (already done)

### Database Connection Timeout
- Check `DATABASE_URL` is correct
- Ensure database accepts connections from Vercel IPs
- Add connection pooling (`?connection_limit=5`)

### Email Not Sending
- Verify SMTP credentials
- Check firewall/security rules for SMTP ports
- Ensure `ADMIN_EMAIL` is valid

### Image Upload Issues
- Verify `/public/uploads` directory exists
- Set proper permissions
- Consider using external storage (AWS S3, Vercel Blob)

## Performance Tips

- Enable Image Optimization (done in `next.config.ts`)
- Use Edge Functions for API routes (configure in `vercel.json`)
- Enable ISR (Incremental Static Regeneration) for pages
- Monitor function execution time in Vercel Dashboard

## Security Notes

- Never commit `.env.local` to repository
- Use Vercel Dashboard for environment variables
- Enable HTTPS (automatic with Vercel)
- Regularly rotate JWT_SECRET if compromised
- Keep dependencies updated
