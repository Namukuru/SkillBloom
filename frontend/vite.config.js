import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from "path";
import { fileURLToPath } from "url";  // Import helper to get __dirname

const __dirname = path.dirname(fileURLToPath(import.meta.url)); // Define __dirname

export default defineConfig({
  plugins: [react(),],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), 
    },
  },
});
