# IELTS Free Tutor (Node + Static Frontend)

## Tính năng
- Tạo đề ngẫu nhiên chuẩn IELTS (Speaking, Writing, Reading, Listening, Vocabulary)
- Chấm và giải thích bằng Gemini (Google Generative Language API)
- Web Speech API: phát âm và ghi âm transcript
- Auth JWT cơ bản, lưu tiến độ vào file JSON (free, không DB)
- Dashboard hiển thị lịch sử và biểu đồ

## Cấu trúc
- `server.js`: Backend Express, endpoints `/api/auth/*`, `/api/progress`, `/api/tutor`, `/api/prompt`, `/api/health`
- `public/`: Frontend tĩnh dùng JS thuần
- `data/`: Lưu người dùng và tiến độ

## Chạy local
1. `npm install`
2. Tạo `.env`:
   - `GEMINI_API_KEY=<YOUR_GEMINI_KEY>`
   - `JWT_SECRET=<random_long_string>`
3. `npm start`
4. Mở `http://localhost:3000`

## Deploy qua GitHub + Vercel
### Đẩy mã lên GitHub
1. `git init`
2. `git add .`
3. `git commit -m "init"`
4. Tạo repo trên GitHub
5. `git remote add origin https://github.com/<your-username>/<repo>.git`
6. `git branch -M main`
7. `git push -u origin main`

### Kết nối Vercel
1. Đăng nhập `https://vercel.com` bằng GitHub
2. “Add New Project” → chọn repo
3. Thiết lập:
   - Framework: Other
   - Output directory: `public`
   - Build command: `npm install`
   - Start command: `node server.js`
4. Environment Variables:
   - `GEMINI_API_KEY`
   - `JWT_SECRET`
5. Deploy, kiểm tra:
   - `https://<project>.vercel.app/api/health`
   - `https://<project>.vercel.app/`

## CI cơ bản (GitHub Actions)
Workflow có sẵn ở `.github/workflows/ci.yml`, cài dependencies và kiểm tra build script.

## Khắc phục lỗi Gemini
- Nếu `gemini_error` 404 model:
  - Tạo API key từ AI Studio `ai.google.dev`
  - Bật Generative Language API trong Google Cloud
  - Kiểm tra `GET /api/models` phải thấy model Gemini text

## Bảo mật
- Không commit `.env`, đã chặn trong `.gitignore`
- Không để lộ API key ở frontend

