# 📡 PulseOps — Realtime Infrastructure Observability

[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2014-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/Backend-NestJS%2010-E0234E?style=for-the-badge&logo=nestjs)](https://nestjs.org/)
[![Prisma](https://img.shields.io/badge/ORM-Prisma-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Socket.io](https://img.shields.io/badge/Realtime-Socket.io-010101?style=for-the-badge&logo=socket.io)](https://socket.io/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)

**PulseOps** adalah prototype *realtime observability dashboard* dan *centralized monitoring command center* yang dirancang untuk memberikan visibilitas instan terhadap kesehatan infrastruktur, baik layanan internal maupun eksternal.

> **Built by Renaldi Mohamad**  
> *Technical Test Submission — Fullstack Software Engineer*

---

## 🖼️ Preview

| Dashboard Overview | Documentation Page |
| :--- | :--- |
| ![Dashboard Overview](./web/public/docs/dashboard-page.png) | ![Documentation Page](./web/public/docs/docs-page.png) |

| Services Management | Dark & Light Mode |
| :--- | :--- |
| ![Services Management](./web/public/docs/services-page.png) | ![Dark Mode](./web/public/docs/dashboard-dark-page.png) |

| Mobile Responsive | Realtime Engine Sync |
| :--- | :--- |
| ![Mobile Responsive](./web/public/docs/mobile-page-dashboard.png) | ![Services Dark](./web/public/docs/services-dark-page.png) |

---

## 🎯 Latar Belakang Project

Dalam ekosistem *microservices* modern, **observability** bukan lagi sekadar fitur tambahan, melainkan kebutuhan kritikal. Masalah operasional sering kali terlambat terdeteksi karena sistem monitoring yang bersifat *reactive* (hanya memberitahu setelah terjadi kegagalan fatal) atau bergantung pada *manual refresh*.

**PulseOps** hadir untuk menjembatani celah ini dengan pendekatan *proactive monitoring*. Dengan memusatkan telemetri kesehatan layanan ke dalam satu panel kontrol yang sinkron secara *realtime*, tim engineering dapat mendeteksi degradasi performa sebelum menjadi *downtime* yang merugikan bisnis.

---

## ✨ Fitur Utama

-   🔄 **Realtime WebSocket Synchronization**: Update status instan di semua klien tanpa *refresh*.
-   📊 **Live Status Monitoring**: Dashboard observabilitas yang intuitif dan teknis.
-   🩺 **Automated Health Checking**: Mesin pemantau otomatis berbasis *scheduler*.
-   🌓 **Premium Dark/Light Mode**: Dukungan tema penuh dengan estetika SaaS modern.
-   🌐 **Multilingual Support**: Mendukung Bahasa Indonesia & English secara dinamis.
-   📱 **Mobile-First Responsive**: Pengalaman premium di desktop maupun perangkat seluler.
-   🚀 **Event-Driven Architecture**: Arsitektur backend yang *decoupled* dan skalabel.
-   📜 **Live Activity Feed**: Log aktivitas sistem yang disiarkan langsung via WebSocket.
-   ⚡ **Force Re-check**: Kemampuan memicu pemeriksaan ulang layanan secara manual.

---

## 🏗️ Arsitektur Sistem

PulseOps dibangun dengan arsitektur yang memisahkan tanggung jawab antara mesin pemantau (*engine*) dan lapisan presentasi (*UI*).

```text
Frontend (Next.js)  <----->  Socket.io (Realtime Sync)  <----->  Backend (NestJS)
       |                                                         |
       |---------------------> REST API (CRUD) ------------------|
                                                                 |
                                                            Prisma ORM
                                                                 |
                                                           PostgreSQL DB
```

### Bagaimana Realtime Update Bekerja?
1.  **Scheduler**: Backend menjalankan *cron-job* setiap interval tertentu.
2.  **Worker**: Menjalankan *health check* ke URL layanan target.
3.  **Evaluator**: Menentukan status berdasarkan kode respons dan latensi.
4.  **Persistence**: Menyimpan hasil ke PostgreSQL melalui Prisma.
5.  **Broadcaster**: Memancarkan event `service.updated` melalui Socket.io Gateway.
6.  **Sync**: Semua klien yang terhubung menerima payload dan memperbarui cache UI secara instan.

---

## 🧠 Alasan Pemilihan Stack ("The Why")

Keputusan pemilihan teknologi didasarkan pada keseimbangan antara produktivitas, performa, dan relevansi teknis dalam konteks *technical test*.

### Frontend: Next.js vs Angular
-   **Productivity**: Next.js memberikan kecepatan development yang lebih tinggi dengan ekosistem library (seperti Framer Motion & Tailwind) yang sangat matang untuk UI *high-end*.
-   **State Management**: Penggunaan React Query dalam Next.js sangat superior dalam menangani sinkronisasi data *asynchronous* dan *realtime cache invalidation* dibanding pendekatan boilerplate yang berat di Angular.

### Backend: NestJS vs Spring Boot
-   **Architecture Similarity**: NestJS dipilih karena memiliki konsep yang identik dengan Spring Boot (Dependency Injection, Modularization, Decorators), namun berjalan di atas Node.js yang lebih ringan dan efisien untuk aplikasi berbasis I/O intensif seperti WebSocket.
-   **Unified Language**: Menggunakan TypeScript di kedua sisi (frontend & backend) mempercepat validasi tipe data dan meminimalkan *overhead* kognitif selama pengerjaan test yang terbatas waktu.
-   **Realtime Native Support**: NestJS memiliki integrasi WebSockets (Socket.io) yang sangat intuitif dan *first-class*, menjadikannya pilihan ideal untuk sistem monitoring.

---

## 🩺 Logic Monitoring Intelligence

PulseOps tidak hanya melihat "Up" atau "Down", tapi memahami konteks operasional:

-   🟢 **200 OK** → **Operational**: Layanan berfungsi normal.
-   🟡 **401 / 403** → **Protected**: Titik akhir dapat dijangkau namun memerlukan autentikasi. Layanan dianggap *healthy* dari sisi infrastruktur.
-   🟠 **404** → **Misconfigured**: Titik akhir tidak ditemukan. Ini menandakan masalah konfigurasi URL, bukan kegagalan server.
-   🔴 **Timeout / 500+** → **Offline**: Terjadi kegagalan koneksi atau *internal server error*.

## 📂 Struktur Repository

PulseOps menggunakan struktur *monorepo-style* sederhana untuk memisahkan tanggung jawab antara *monitoring engine* dan *user interface*.

```text
/server          # Backend NestJS (Monitoring Engine, WebSocket Gateway, Prisma)
  ├── .env.example       # Template konfigurasi environment backend
  ├── prisma/            # Skema database & file migrasi
  └── src/               # Source code logika bisnis
/web             # Frontend Next.js (Dashboard UI, Realtime Sync, I18n)
  ├── .env.example       # Template konfigurasi environment frontend
  └── src/               # Source code antarmuka pengguna
README.md        # Dokumentasi utama proyek
```

---

## ⚙️ Environment Setup

Sebelum menjalankan proyek, Anda perlu menyiapkan konfigurasi *environment variables* pada masing-masing direktori.

### 1. Server Configuration (`/server`)
Salin file `.env.example` menjadi `.env` dan sesuaikan nilainya:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/pulseops?schema=public"
PORT=3001
FRONTEND_URL="http://localhost:3000"
```

### 2. Web Configuration (`/web`)
Salin file `.env.example` menjadi `.env` dan sesuaikan nilainya:
```env
NEXT_PUBLIC_API_URL="http://localhost:3001/api"
NEXT_PUBLIC_WS_URL="http://localhost:3001"
```

---

## 🚀 Setup Guide

### 1. Clone & Install
```bash
git clone https://github.com/renaldimohamad/PulseOps.git
cd PulseOps
```

### 2. Backend Setup (NestJS)
```bash
cd server
npm install
# Setup .env (DATABASE_URL)
npx prisma migrate dev
npm run start:dev
```

### 3. Frontend Setup (Next.js)
```bash
cd web
npm install
# Setup .env (NEXT_PUBLIC_API_URL & NEXT_PUBLIC_SOCKET_URL)
npm run dev
```

---

## 📂 Struktur Folder

```text
/server (NestJS)
  ├── src/modules/services      # Business logic monitoring
  ├── src/modules/health-check  # Engine pemantauan otomatis
  ├── src/gateways              # WebSocket logic
  └── prisma/                   # Database schema & migrations

/web (Next.js)
  ├── src/app/                  # App Router & Pages
  ├── src/components/           # Reusable UI & Layouts
  ├── src/hooks/                # Custom hooks & Realtime Sync
  └── src/locales/              # I18n translation files
```

---

## 🛠️ API Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/services` | Mengambil semua daftar layanan & status terbaru. |
| `POST` | `/services` | Menambahkan layanan baru untuk dipantau. |
| `PATCH` | `/services/:id` | Memperbarui konfigurasi layanan. |
| `DELETE` | `/services/:id` | Menghapus layanan dari sistem pemantauan. |

---

## 🚧 Challenge Log: Realtime Multi-Client Sync

Salah satu tantangan terbesar adalah memastikan **konsistensi state** di banyak tab/klien saat terjadi update otomatis. Awalnya, penggunaan *simple polling* menyebabkan beban server yang tidak perlu.

**Solusi**: Saya mengimplementasikan sistem **Realtime Invalidation**. Alih-alih mengirim seluruh payload data melalui WebSocket (yang bisa menjadi sangat besar), sistem hanya mengirim sinyal event. Frontend kemudian menggunakan React Query untuk melakukan *smart refetch* hanya pada bagian data yang berubah. Hal ini menjamin data selalu akurat dengan *bandwidth* minimal.

---

## 📈 Future Improvements

-   [ ] **Authentication**: Implementasi JWT untuk akses dashboard yang aman.
-   [ ] **Notification System**: Integrasi Slack/Telegram/Email untuk *alerting*.
-   [ ] **Uptime Analytics**: Grafik historis persentase *uptime* bulanan.
-   [ ] **Incident History**: Log kejadian *downtime* secara kronologis.
-   [ ] **Distributed Nodes**: Kemampuan memantau dari berbagai lokasi geografis.

---

## 🌐 Production Deployment

PulseOps sudah berhasil di-deploy ke environment production dengan konfigurasi berikut:

### Frontend (Dashboard)
- URL: [https://pulseops.renaldi.fun](https://pulseops.renaldi.fun)
- Status: Active ✅
- Description: Main dashboard for monitoring services health status in real-time

### Backend API
- URL: [https://pulseops-api.renaldi.fun](https://pulseops-api.renaldi.fun)
- Status: In Progress ⏳ (SSL Certificate still generating / DNS propagation ongoing)
- Base Endpoint: `/api`
- Description: REST API service for PulseOps monitoring system

> [!IMPORTANT]
> ⚠️ Note: Backend API custom domain is still propagating DNS and SSL certificate. If not accessible, fallback API is still running on Railway default domain:
> [https://pulseops-production.up.railway.app/api](https://pulseops-production.up.railway.app/api)

### 🏗️ Deployment Architecture

```text
[ User Browser ] <---- HTTPS/WSS ----> [ Vercel (Frontend) ]
                                             |
                                         REST / WS
                                             |
[ Neon Tech (DB) ] <---- SSL/TCP ----> [ Railway/Render (Backend) ]
```

### 📋 Environment Variables (Production)

| Variable | Description | Example |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | URL REST API Backend | `https://api-pulseops.renaldi.fun/api` |
| `NEXT_PUBLIC_SOCKET_URL` | URL WebSocket Backend | `https://api-pulseops.renaldi.fun` |
| `DATABASE_URL` | Koneksi Neon PostgreSQL | `postgresql://user:pass@ep-noisy.neon.tech/pulseops` |
| `FRONTEND_URL` | URL Frontend (CORS) | `https://pulseops.renaldi.fun` |

---

## 📝 Penutup

PulseOps bukan sekadar aplikasi CRUD, melainkan manifestasi dari pemahaman mendalam tentang sistem *real-time*, arsitektur modular, dan pentingnya pengalaman pengguna dalam sebuah produk engineering. Project ini siap dikembangkan lebih lanjut menjadi platform *observability* tingkat *enterprise*.

**Designed & engineered with ❤️ by Renaldi Mohamad.**

