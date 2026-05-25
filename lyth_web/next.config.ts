import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Export toàn bộ app thành file tĩnh HTML/CSS/JS vào thư mục /out
  // Phù hợp với Firebase Hosting Spark Plan (miễn phí, không cần Cloud Functions)
  output: "export",

  images: {
    // BẮT BUỘC khi dùng output: 'export'
    // Next.js Image Optimization cần server runtime — không khả dụng trong static export
    unoptimized: true,
  },
};

export default nextConfig;
