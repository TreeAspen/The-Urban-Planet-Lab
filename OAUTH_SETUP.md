# Setting Up the CMS Admin Login

The admin panel at `/admin` uses Decap CMS with GitHub as the backend. Because GitHub Pages has no server, login requires a small OAuth proxy. This guide sets one up for free on Netlify in ~10 minutes.

---

## Step 1 — Create a GitHub OAuth App

1. Go to **GitHub → Settings → Developer settings → OAuth Apps → New OAuth App**
2. Fill in:
   - **Application name**: `The Urban Planet Lab CMS`
   - **Homepage URL**: `https://utoplab.net` (or your GitHub Pages URL)
   - **Authorization callback URL**: `https://YOUR-NETLIFY-PROXY.netlify.app/callback`  
     *(you'll get this URL in Step 2 — you can edit it after)*
3. Click **Register application**
4. On the next screen, note the **Client ID**
5. Click **Generate a new client secret** and copy the **Client Secret** (shown only once)

---

## Step 2 — Deploy the OAuth Proxy to Netlify

1. Go to **[github.com/vencax/netlify-cms-github-oauth-provider](https://github.com/vencax/netlify-cms-github-oauth-provider)** and click **Deploy to Netlify** in the README
2. During setup, set these environment variables in the Netlify UI:
   - `OAUTH_CLIENT_ID` = the Client ID from Step 1
   - `OAUTH_CLIENT_SECRET` = the Client Secret from Step 1
3. After deploy, note your Netlify site URL, e.g. `https://my-proxy-abc123.netlify.app`
4. Go back to GitHub (Step 1) and update the **Authorization callback URL** to:  
   `https://my-proxy-abc123.netlify.app/callback`

---

## Step 3 — Update config.yml

Open `public/admin/config.yml` and replace the two placeholder values:

```yaml
backend:
  name: github
  repo: GITHUB_USERNAME/The-Urban-Planet-Lab   # ← your actual GitHub username
  branch: main
  base_url: https://NETLIFY_OAUTH_PROXY_URL.netlify.app  # ← your Netlify proxy URL
```

Commit and push. GitHub Actions will redeploy the site.

---

## Step 4 — Log in

Visit `https://utoplab.net/admin/` (or your Pages URL + `/admin/`).  
Click **Login with GitHub**, authorize the app, and you're in.

---

## Workflow: How edits get published

1. Make an edit in the admin panel and click **Publish**
2. Decap CMS commits the change directly to the `main` branch of your GitHub repo
3. GitHub Actions detects the push and runs the build + deploy workflow automatically
4. The live site updates in ~1–2 minutes

No server, no database, no recurring costs.
