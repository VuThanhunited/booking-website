# Render Setup Manual Guide

## Nếu Render service bị lỗi:

### Option 1: Xóa cũ + Tạo mới (RECOMMENDED)

1. **Xóa service cũ:**
   - Vào Render Dashboard → `booking-website-api` → Settings → Delete

2. **Tạo Web Service mới:**
   - Click "New" → "Web Service"
   - GitHub repo: `booking-website`
   - Branch: `main`

3. **Cấu hình (QUAN TRỌNG):**
   
   **Build Command:**
   ```
   npm install --prefix server
   ```
   
   **Start Command:**
   ```
   node server/server.js
   ```
   
   **Runtime:**
   - Node version: 18 (hoặc 16+)

4. **Environment Variables** (Add từ .env của server):
   ```
   MONGO_URI=mongodb+srv://vuthanh:vuthanh@product.xgsynmy.mongodb.net/assignment2?retryWrites=true
   JWT_SECRET=your_secret_key
   EMAIL_USER=thanhvdfx31889@funix.edu.vn
   EMAIL_PASS=alujwkmkrhufevfq
   NODE_ENV=production
   PORT=5000
   ```

5. **Deploy** → Chờ ~3-5 phút

---

### Option 2: Keep existing + Troubleshoot

Nếu muốn giữ service cũ:

1. Vào service → **Settings** → **Environment**
2. Verify các biến environment đúng không
3. Check **Build & Deploy** → Logs → Xem chính xác error

---

## Testing sau deploy successful:

```bash
# Test API endpoint (thay URL Render của bạn)
curl https://your-render-service.onrender.com/hotels

# Xem logs
- Render Dashboard → Logs tab
- Kiếm "MongoDB connected" ✓
```

---

## JSON Build Config (nếu dùng render.json)

Tạo file `render.json` ở root:
```json
{
  "services": [
    {
      "type": "web",
      "name": "booking-website-api",
      "repo": "https://github.com/VuThanhunited/booking-website",
      "buildCommand": "npm install --prefix server",
      "startCommand": "node server/server.js",
      "envVars": [
        {
          "key": "MONGO_URI",
          "value": "mongodb+srv://vuthanh:vuthanh@product.xgsynmy.mongodb.net/assignment2?retryWrites=true"
        },
        {
          "key": "JWT_SECRET",
          "value": "your_secret"
        },
        {
          "key": "NODE_ENV",
          "value": "production"
        }
      ]
    }
  ]
}
```
