# Static Image Viewer + Telegram Notifier

Hiển thị một hình ảnh tĩnh, mỗi khi có người mở trang web sẽ tự động gửi thông báo về Telegram.

## Cấu trúc

- `app/page.tsx` — trang hiển thị ảnh (`public/display-image.svg`)
- `app/NotifyOnLoad.tsx` — gọi API thông báo ngay khi trang được mở (client component)
- `app/api/notify/route.ts` — API route gửi tin nhắn qua Telegram Bot API

## 1. Tạo Telegram Bot & lấy Chat ID

1. Mở Telegram, chat với **@BotFather** → gõ `/newbot` → làm theo hướng dẫn → nhận **Bot Token**.
2. Nhắn bất kỳ tin nhắn nào cho bot vừa tạo (hoặc thêm bot vào group/channel).
3. Lấy **Chat ID**: mở trình duyệt truy cập
   `https://api.telegram.org/bot<BOT_TOKEN>/getUpdates`
   sau khi đã nhắn tin cho bot, tìm trường `"chat":{"id": ...}` trong JSON trả về.
   (Hoặc dùng bot **@userinfobot** để lấy Chat ID của chính mình.)

## 2. Chạy thử ở local

```bash
npm install
cp .env.local.example .env.local
# rồi điền TELEGRAM_BOT_TOKEN và TELEGRAM_CHAT_ID vào .env.local
npm run dev
```

Mở `http://localhost:3000` — nếu cấu hình đúng, Telegram sẽ nhận được thông báo ngay.

## 3. Thay ảnh của bạn

Thay file `public/display-image.svg` bằng ảnh của bạn (jpg/png/svg đều được), rồi sửa `src` trong `app/page.tsx` cho khớp tên file.

## 4. Deploy lên Vercel (qua Dashboard)

1. Đẩy project này lên một repo GitHub:
   ```bash
   git add .
   git commit -m "Init static image + Telegram notifier"
   git remote add origin <URL_REPO_CUA_BAN>
   git push -u origin main
   ```
2. Vào [vercel.com](https://vercel.com) → **Add New Project** → chọn repo vừa push.
3. Ở bước cấu hình, mở **Environment Variables** và thêm:
   - `TELEGRAM_BOT_TOKEN` = token bot của bạn
   - `TELEGRAM_CHAT_ID` = chat id của bạn
4. Bấm **Deploy**. Sau khi xong, mỗi lần ai đó mở trang web đã deploy, bạn sẽ nhận thông báo trên Telegram.

> Lưu ý: nếu sau này đổi Bot Token/Chat ID, vào **Project Settings → Environment Variables** trên Vercel để cập nhật rồi **Redeploy**.
