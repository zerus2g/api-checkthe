# Chkr.cc API Wrapper

API wrapper cho chkr.cc được viết bằng Node.js và deploy trên Vercel.

## 🚀 Deploy lên Vercel

### Bước 1: Cài đặt Vercel CLI
```bash
npm install -g vercel
```

### Bước 2: Login vào Vercel
```bash
vercel login
```

### Bước 3: Deploy
```bash
vercel
```

### Bước 4: Deploy production
```bash
vercel --prod
```

## 📡 Sử dụng API

### URL Format
```
https://your-domain.vercel.app/api/chkr?data=CARD_DATA&key=API_KEY
```

### Ví dụ
```
https://your-domain.vercel.app/api/chkr?data=2342234241818564|03|2025|297&key=khang
```

### Parameters
- `data`: Dữ liệu thẻ (bắt buộc)
- `key`: API key (bắt buộc) - mặc định: `khang`

### Response Format
```json
{
  "status": "success",
  "message": "Card checked successfully",
  "data": {
    // Response từ chkr.cc
  }
}
```

## 🔧 Cấu hình

### Thay đổi API Key
Sửa file `api/chkr.js`:
```javascript
const REQUIRED_API_KEY = 'your-new-api-key';
```

### Thay đổi Timeout
```javascript
timeout: 30000, // 30 giây
```

## 📁 Cấu trúc Project
```
project/
├── api/
│   └── chkr.js          # API endpoint
├── package.json         # Dependencies
├── vercel.json          # Vercel config
└── README.md           # Documentation
```

## 🛡️ Bảo mật
- ✅ API Key authentication
- ✅ Input validation
- ✅ CORS headers
- ✅ Error handling
- ✅ Rate limiting (Vercel built-in)

## 📊 Vercel Limits
- **Free Tier**: 100GB bandwidth/tháng
- **Function Timeout**: 30 giây
- **Request Size**: 4.5MB
- **Response Size**: 6MB 