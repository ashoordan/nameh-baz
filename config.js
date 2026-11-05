// تنظیمات مرکزی. کلید anon (JWT قدیمی) از Supabase > Project Settings > API. هرگز service_role اینجا نگذار.
export const CONFIG = {
  SUPABASE_URL: "https://YOUR-PROJECT.supabase.co",
  SUPABASE_ANON_KEY: "YOUR-ANON-KEY",
  PBKDF2_ITER: 310000, // بعد از ساخت اولین نامه تغییرش نده
  creator: {
    name: "ابراهیم آشوردن",
    title: "طراح، برندساز و توسعه‌دهنده اپلیکیشن",
    bio: "من ابراهیم آشوردنم و روی طراحی، برندینگ، تبلیغات و ساخت اپلیکیشن کار می‌کنم. نامه‌باز از یک ایده ساده شروع شد: بعضی حرف‌ها لایق یک نامه‌اند، نه یک پیام کوتاه که لابه‌لای هزار پیام گم بشه.",
    links: { instagram: "https://instagram.com/Ebrahim_ashourdan", telegram: "", whatsapp: "", email: "", website: "" }
  },
  app: { version: "1.0.0" }
};
