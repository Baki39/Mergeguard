# 🚀 GitHub App Setup - Korak po korak

## KORAK 1: Kreiraj GitHub App

1. **Otvori:** https://github.com/settings/apps/new

2. **Ispuni polja:**

### Basic Settings
```
GitHub App name: MergeGuard
Description: AI Code Verification Platform
Homepage URL: https://mergeguard.vercel.app
```

### Webhook (VAŽNO!)
```
☑ Enable webhook
Webhook URL: https://mergeguard.vercel.app/api/webhooks/github
Webhook secret: (ostavi prazno za sada ili napiši neki random string)
```

### Permissions
```
Permissions → Pull requests: ✅ Read-only
Repository contents: ✅ Read-only
```

### Subscribe to events
```
☑ Pull request
```

3. **Klikni:** "Create GitHub App"

---

## KORAK 2: Sačuvaj Credentials

Kad kreiraš app, dobit ćeš:
- **App ID** - npr. "123456"
- **Client ID** - npr. "Iv1.1234567890abcdef"
- **Client secret** - napiši ovo negdje
- **Private key** - klikni "Generate a private key" i sačuvaj .pem fajl

---

## KORAK 3: Instaliraj App

1. Na istoj stranici gdje si kreirao app, klikni **"Install"**
2. Izaberi račun (Baki39)
3. Izaberi **"All repositories"** ili samo MergeGuard
4. Klikni **"Install"**

---

## KORAK 4: Dodaj u .env

Vrati se ovdje sa:
- APP_ID
- CLIENT_ID  
- CLIENT_SECRET
- PRIVATE_KEY

Ja ću dodati u config!

---

## 🎯 Wa'ta čekaš? Kreni! 🚀
