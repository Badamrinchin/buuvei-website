# CMS Setup

1. Supabase дээр шинэ project үүсгэнэ.
2. SQL Editor дээр [supabase_setup.sql](supabase_setup.sql)-ийн бүх SQL-ийг ажиллуулна.
3. Authentication > Users хэсгээс admin user нэмнэ (email/password).
4. [config.js](config.js)-д дараах 2 утгаа бөглөнө:
   - supabaseUrl
   - supabaseAnonKey
5. [admin.html](admin.html)-ийг нээгээд admin эрхээр нэвтэрнэ.
6. Hero, Product, News, Footer мэдээллээ оруулж хадгална.
7. [index.html](index.html)-ийг нээхэд өгөгдөл Supabase-ээс автоматаар ачаална.

## Анхаарах зүйл

- Service role key-г frontend дээр бүү ашигла.
- Зөвхөн anon key ашиглана.
- Image URL нь public линк байх ёстой.
