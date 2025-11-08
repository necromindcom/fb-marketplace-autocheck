# Tailwind CSS Build Setup

## 📦 Instalace

```bash
npm install
```

## 🛠️ Development

Pro vývoj spusť watch režim, který automaticky rebuilds CSS při změnách:

```bash
npm run dev
```

Tento příkaz spustí Tailwind v watch módu:
- ✅ Automaticky sleduje změny v HTML souborech
- ✅ Okamžitě rebuilds CSS při změnách
- ✅ **Bez minifikace** pro rychlejší rebuildy
- ✅ Lepší pro debugging (čitelný CSS)

Nech tento příkaz běžet během celého vývoje. Otevři nový terminál pro další příkazy.

## 🚀 Production Build

Pro finální build s minifikací:

```bash
npm run build
```

Tento příkaz:
- ✅ Vygeneruje minifikovaný CSS
- ✅ Odstraní nepoužívané styly
- ✅ Optimalizuje pro produkci
- ✅ Menší velikost souboru

**Použij tento příkaz před:**
- Vytvořením production verze
- Nasazením na server
- Vytvořením release verze extension

## 📁 Struktura souborů

```
web/
├── src/
│   └── input.css          # Vstupní soubor s Tailwind direktivami
├── css/
│   └── output.css         # Vygenerovaný CSS (gitignored)
├── index.html             # Používá css/output.css
├── privacy.html           # Používá css/output.css
└── terms.html             # Používá css/output.css
```

## ⚙️ Tailwind Config

Custom barvy jsou definované v `tailwind.config.js`:

```js
primary: {
  50: '#e7f3ff',
  100: '#d2e9ff',
  500: '#1877f2',
  600: '#166fe5',
}
```

## 🔍 Tip

Pokud upravuješ HTML třídy:
1. ✅ Ujisti se, že běží `npm run dev`
2. ✅ Ulož HTML soubor
3. ✅ CSS se automaticky přebuilds
4. ✅ Refresh browser pro zobrazení změn
