/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // NextGen CMA Premium Color Palette
        brand: {
          dark: '#0A0A0A',       // Rich black background
          card: '#121212',       // Surface card black
          border: '#222222',     // Dark border gray
          muted: '#8E8E93',      // Muted gray text
          
          gold: {
            light: '#F3E5AB',    // Champagne gold
            DEFAULT: '#D4AF37',  // Primary Metallic Gold
            dark: '#AA7C11',     // Deep antique gold
          },
          
          purple: {
            light: '#DDA0DD',    // Mauve accent
            DEFAULT: '#6F2DA8',  // Royal Purple
            dark: '#4B0082',     // Deep Indigo Purple
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 15px rgba(212, 175, 55, 0.15)',
        'purple-glow': '0 0 15px rgba(111, 45, 168, 0.2)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
}
