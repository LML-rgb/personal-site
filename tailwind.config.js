export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: { extend: {
    fontFamily: { body: ['Inter', 'Noto Sans SC', 'sans-serif'], display: ['Instrument Serif', 'serif'] },
    colors: { bg: 'hsl(var(--bg))', surface: 'hsl(var(--surface))', 'text-primary': 'hsl(var(--text))', muted: 'hsl(var(--muted))', stroke: 'hsl(var(--stroke))' }
  } },
  plugins: []
}
