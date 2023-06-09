// vite.config.js

import react from '@vitejs/plugin-react';

export default {
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: 'src/main.js', // change this to your app's entry point
        external: ['@fortawesome/fontawesome-svg-core']
      },
    },
  },
};

