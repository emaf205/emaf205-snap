# Publish to GitHub

Target repository: `https://github.com/emaf205/emaf205-snap`

## Git CLI

From the parent directory of this folder:

```bash
cd emaf205-snap-ready
git init
git branch -M main
git add .
git commit -m "Initial release: EMAF205 SNAP v1.2.0"
git remote add origin https://github.com/emaf205/emaf205-snap.git
git push -u origin main
```

If GitHub asks for authentication, complete it with your normal GitHub credentials / GitHub CLI flow.
