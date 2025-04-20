import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom', // ブラウザ環境をシミュレート
    setupFiles: './setupTests.ts', // テストの初期化ファイル
    globals: true, // JestライクなグローバルAPI（describe, it, expect）を有効
    css: true, // CSS（Tailwind CSSなど）をテストで処理
  },
});