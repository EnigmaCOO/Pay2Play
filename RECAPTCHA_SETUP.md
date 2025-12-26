# reCAPTCHA Configuration for Phone Authentication

## Error: "Hostname match not found" / "auth/captcha-check-failed"

This error occurs when the domain you're using for local development isn't authorized in Firebase Console for reCAPTCHA verification.

## Required Admin Panel Configuration

### Step 1: Add Authorized Domain in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **pay-2-play-f1da3**
3. Navigate to **Authentication** → **Settings** → **Authorized domains**
4. Click **Add domain**
5. Add your local development domain:
   - For local development: `app.pay2play.local`
   - For production: Your production domain (e.g., `app.pay2play.fun`)

### Step 2: Verify reCAPTCHA Configuration

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Click on **Phone** provider
3. Ensure **Phone** authentication is **Enabled**
4. Check that reCAPTCHA is properly configured (it should be automatic)

### Step 3: For Local Development (`app.pay2play.local`)

If you're using a custom local domain:

1. Make sure your `/etc/hosts` file includes:
   ```
   127.0.0.1 app.pay2play.local
   ```

2. Make sure Caddy is configured to proxy to your local server (see `Caddyfile`)

3. Access the app via `http://app.pay2play.local` (not `localhost`)

### Step 4: Verify Environment Variable

Ensure `EXPO_PUBLIC_AUTH_DOMAIN` is set correctly:
- For local dev: `app.pay2play.local`
- For production: `pay-2-play-f1da3.firebaseapp.com` (or your custom domain)

## Testing

After configuration:

1. Restart your development server
2. Clear browser cache/cookies
3. Try phone authentication again
4. The reCAPTCHA should initialize without errors

## Troubleshooting

### Still getting errors?

1. **Check browser console** for the exact error message
2. **Verify domain** - Make sure you're accessing the app via the authorized domain
3. **Check Firebase Console** - Ensure the domain appears in the authorized domains list
4. **Wait a few minutes** - Domain authorization can take a few minutes to propagate
5. **Try incognito mode** - Rule out browser cache issues

### For Production

Before deploying to production:
1. Add your production domain to authorized domains
2. Ensure reCAPTCHA site key is configured for production
3. Test phone authentication on production domain

## Additional Notes

- The reCAPTCHA verifier uses "invisible" mode, so users won't see a challenge unless suspicious activity is detected
- Local development domains (like `.local`) may require additional configuration
- If using Firebase emulators, reCAPTCHA may not work - use real Firebase for phone auth testing
