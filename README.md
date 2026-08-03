# TaskApp
Ini Task Management system yang bisa insert, update, dan delete tasks, tapi sebelumnya user harus login atau register dulu bagi yang belum punya account. Aplikasi ini membutuhkan node dan npm yang sudah terinstall

# Cara penggunaan backend
1. Gunakan data import pada MySQL workbench dan import schema.sql di folder backend
2. Ganti .env.example menjadi .env dan isi config berdasarkan database yang ada
3. Di .env terdapat JWT_SECRET_KEY. Isi dengan SHA256
4. Untuk menjalankan backend, ketik node .\app.js di direktori backend di terminal/CMD
5. Dokumentasi API dapat diakses di http://localhost:7000/api-docs

# Cara penggunaan frontend
1. Buka terminal/CMD lalu masuk ke direktori frontend
2. Ketik npm run start
3. Aplikasi dapat diakses di http://localhost:3000

