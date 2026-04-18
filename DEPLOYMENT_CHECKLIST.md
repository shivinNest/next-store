# Vercel Deployment Checklist

## Pre-Deployment Setup

### 1. Environment Variables
- [ ] Database URL configured (PostgreSQL with connection pooling)
- [ ] JWT_SECRET generated (min 32 characters)
- [ ] SMTP credentials configured
- [ ] ADMIN_EMAIL set
- [ ] All variables added to Vercel Dashboard

### 2. Code Preparation
- [ ] All code committed to main branch
- [ ] No secrets in code or .env.local
- [ ] `.env.local` added to .gitignore ✅
- [ ] `vercel.json` configured ✅
- [ ] `next.config.ts` optimized ✅
- [ ] `package.json` build scripts updated ✅

### 3. Database Setup
- [ ] PostgreSQL database created
- [ ] Database supports connection pooling
- [ ] Database accepts connections from Vercel IPs
- [ ] Firewall rules configured
- [ ] TEST: Can connect with `DATABASE_URL`

### 4. Local Testing
```bash
# Test build locally
npm run build

# Test database connection
npm run seed

# Run development server
npm run dev

# Test API endpoints
curl http://localhost:3000/api/auth/me
```

## Deployment Process

### Step 1: Push to GitHub
```bash
git add .
git commit -m "chore: prepare for Vercel deployment"
git push origin main
```

### Step 2: Connect to Vercel
1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your GitHub repository
4. Choose "Next.js" (auto-detected)
5. Click "Continue"

### Step 3: Configure Project
- **Project Name**: `saaviya` (or your preference)
- **Framework Preset**: Next.js ✅
- **Root Directory**: `./` (default)
- **Build Command**: Use default or `npm run build`
- **Output Directory**: `.next` (default)
- **Install Command**: Use default

### Step 4: Set Environment Variables
In Vercel Dashboard > Settings > Environment Variables, add:

```
DATABASE_URL = postgresql://...
JWT_SECRET = your-secret-here
SMTP_HOST = smtp.gmail.com
SMTP_PORT = 587
SMTP_USER = your-email@gmail.com
SMTP_PASSWORD = your-app-password
ADMIN_EMAIL = admin@saaviya.in
NODE_ENV = production
NEXT_PUBLIC_API_URL = https://your-domain.vercel.app
```

### Step 5: Deploy
1. Click "Deploy"
2. Wait for build to complete (2-5 minutes)
3. Access deployment URL from dashboard

## Post-Deployment Verification

### 1. Health Check
- [ ] Visit deployment URL in browser
- [ ] Page loads without errors
- [ ] Images load correctly
- [ ] No console errors

### 2. API Testing
```bash
# Replace YOUR_DOMAIN with your Vercel domain
curl https://YOUR_DOMAIN/api/auth/me
curl https://YOUR_DOMAIN/api/products
curl https://YOUR_DOMAIN/api/categories
```

### 3. Authentication Flow
- [ ] Login page loads
- [ ] Registration page works
- [ ] Email verification sends
- [ ] JWT tokens created properly

### 4. User Features
- [ ] Browse products ✅
- [ ] Add to cart ✅
- [ ] Checkout process ✅
- [ ] View account orders ✅
- [ ] Update profile ✅
- [ ] Add addresses ✅

### 5. Admin Panel
- [ ] Admin login works
- [ ] Dashboard displays stats
- [ ] Product management works
- [ ] Order management works
- [ ] User management works

### 6. Email Functionality
- [ ] Registration email sent
- [ ] Password reset email works
- [ ] Order confirmation emails send

### 7. File Uploads
- [ ] Product image uploads work
- [ ] Payment screenshot uploads work
- [ ] Files stored in `/public/uploads`

### 8. Database Connection
- [ ] All queries execute correctly
- [ ] No connection timeouts
- [ ] Prisma queries working
- [ ] Database migrations applied

## Custom Domain Setup

### 1. Update Vercel Settings
1. Go to Project > Settings > Domains
2. Click "Add"
3. Enter your domain (e.g., saaviya.in)
4. Follow DNS instructions for your registrar

### 2. DNS Configuration
Add these records at your domain registrar:

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com.

Type: A
Name: @
Value: 76.76.19.21

Type: A
Name: @
Value: 76.76.19.22
```

### 3. Verify Domain
- [ ] Domain resolves to Vercel deployment
- [ ] HTTPS certificate auto-generated
- [ ] www subdomain redirects to root

## Monitoring & Maintenance

### Analytics Dashboard
- Monitor deployments: Vercel Dashboard > Analytics
- Check function execution: Vercel Dashboard > Functions
- View build logs: Vercel Dashboard > Deployments

### Performance
- [ ] Lighthouse score > 80
- [ ] First Contentful Paint < 2s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Cumulative Layout Shift < 0.1

### Security
- [ ] HTTPS enabled ✅ (automatic)
- [ ] Security headers configured ✅
- [ ] No exposed secrets in logs
- [ ] Regular dependency updates
- [ ] Enable branch protection on main

### Database
- [ ] Monitor connection pool usage
- [ ] Check query performance
- [ ] Regular backups configured
- [ ] Test recovery procedure

## Troubleshooting

### Build Fails
- Check build logs: Vercel Dashboard > Deployments > (select deployment) > Logs
- Common issues:
  - Missing environment variables
  - Prisma generation failed
  - TypeScript errors
  - Dependency conflicts

### Runtime Errors
- Check function logs: Vercel Dashboard > Functions
- Common issues:
  - Database connection failed
  - Missing environment variable at runtime
  - Memory limit exceeded (increase in vercel.json)
  - API timeout

### Performance Issues
- Enable caching headers (done in next.config.ts)
- Use Edge Functions for API routes
- Optimize images (automatic with Next.js Image)
- Monitor database query performance

## Rollback Procedure

If deployment has critical issues:

1. Go to Vercel Dashboard > Deployments
2. Find the last stable deployment
3. Click "Promote to Production"
4. Deployment rolls back immediately

## Team Collaboration

### Invite Team Members
1. Go to Project > Settings > Members
2. Click "Add"
3. Enter email and select role
4. Send invitation

### Branch Deployments
- Every pull request creates a preview deployment
- Preview URL: `https://<branch-name>.yourdomain.com`
- Test changes before merging to main

## Next Steps

- [ ] Enable Vercel Analytics
- [ ] Setup monitoring and alerts
- [ ] Configure backup strategy
- [ ] Document deployment process for team
- [ ] Schedule regular security audits
- [ ] Plan scaling strategy

---

**Last Updated**: April 18, 2026
**Status**: Ready for Deployment
