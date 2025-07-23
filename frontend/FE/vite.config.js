import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ["pdfjs-dist/build/pdf.worker.min.js"],
  },
  server: {
    host: true,
    port: 5173,
    allowedHosts: [
      "localhost",
      "127.0.0.1",
      "221f98c6-f62f-4b9d-aa4f-2fe775c8dc79-00-28kne3qielfos.sisko.replit.dev", // ✅ 너의 Replit 도메인
    ],
    proxy: {
      // 예시: '/api'로 시작하는 요청을 백엔드(포트 8000)로 전달
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
        //rewrite: (path) => path.replace(/^\/api/, ""), // '/api/hello' → '/hello'
      },
      // 필요하다면 추가 프록시 경로를 여기에 정의하세요.
    },
  },
});
