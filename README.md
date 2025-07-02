# AI i Undervisning - Komplet Guide og Værktøjer

En moderne Next.js hjemmeside med praktiske guides og værktøjer til brug af AI i undervisning og læring. Sitet er fuldt bilingual (dansk/engelsk) og indeholder massivt indhold om AI i undervisning.

## 🚀 Features

### 📚 **Komplet AI Guide**
- **2000+ ord** af praktisk indhold om AI i undervisning
- **Faglige anvendelser** for alle fag (dansk, matematik, naturvidenskab, historie, kunst)
- **Undervisningsstrategier** med AI (flipped classroom, differentieret undervisning, projektbaseret læring)
- **Praktiske værktøjer** og apps (gratis og betalte)
- **Etik og ansvar** i AI-brug
- **Implementeringsplan** med 3-fase tilgang

### 🛠️ **Interaktive Værktøjer**
- **AI-værktøjssammenligning** - Detaljeret sammenligning af forskellige AI-værktøjer
- **Quiz-generator** - Lav engagerende quizzer med AI-hjælp
- **Indholdsfortegnelse** - Smooth scrolling navigation på alle sider
- **Scroll to Top** - Hurtig navigation til toppen af siderne

### 🌍 **Bilingual Support**
- **Fuldt lokaliseret** på dansk og engelsk
- **Dynamisk sprogskift** med context API
- **Lokaliserede indhold** for alle sider og komponenter

### 🎨 **Modern Design**
- **Nordisk farvetema** med sage grøn, slate grå og cream
- **Responsivt design** der virker på alle enheder
- **Smooth animations** og hover effekter
- **Accessibility** med ARIA labels og keyboard navigation

## 🛠️ Tech Stack

- **Framework**: Next.js 15.3.4 (Pages Router)
- **Styling**: Tailwind CSS
- **Content**: Markdown med custom renderer
- **Icons**: Heroicons
- **Localization**: Custom context-based system
- **Deployment**: Vercel-ready

## 📁 Projektstruktur

```
newwww/
├── components/          # React komponenter
│   ├── Layout.js       # Hovedlayout med navigation
│   ├── MarkdownRenderer.js # Custom markdown renderer
│   ├── ScrollToTop.js  # Scroll to top knap
│   └── AdPlaceholder.js # Plads til reklamer
├── content/            # Markdown indhold
│   ├── da/            # Dansk indhold
│   └── en/            # Engelsk indhold
├── locales/           # Lokalisering
│   ├── da.json        # Dansk oversættelser
│   └── en.json        # Engelsk oversættelser
├── pages/             # Next.js sider
│   ├── _app.js        # App wrapper med context
│   ├── index.js       # Forside
│   ├── ai-teaching.js # AI i Undervisning
│   ├── guide.js       # Komplet guide
│   ├── comparison.js  # AI-værktøjssammenligning
│   └── quiz-generator.js # Quiz generator
├── styles/            # CSS styling
│   └── globals.css    # Global styling med nordisk tema
└── scripts/           # Start scripts
    ├── start-prod.sh  # Linux/macOS start script
    └── start-prod.ps1 # Windows PowerShell script
```

## 🚀 Kom i gang

### Prerequisites
- Node.js 18+ 
- npm eller yarn

### Installation

1. **Klon repository**
```bash
git clone https://github.com/dit-username/ai-undervisning.git
cd ai-undervisning
```

2. **Installer dependencies**
```bash
npm install
```

3. **Start udviklingsserver**
```bash
npm run dev
```

4. **Åbn browser**
Gå til [http://localhost:3000](http://localhost:3000)

### Produktion

**Windows:**
```powershell
.\start-prod.ps1
```

**Linux/macOS:**
```bash
./start-prod.sh
```

## 📝 Indhold

### Sider

1. **Forside** (`/`) - Hero sektion med quick links
2. **AI i Undervisning** (`/ai-teaching`) - Massiv guide til lærere
3. **Guide** (`/guide`) - Komplet guide til AI-værktøjer
4. **Sammenligning** (`/comparison`) - AI-værktøjssammenligning
5. **Quiz Generator** (`/quiz-generator`) - Interaktiv quiz-generator

### Indholdstyper

- **Praktiske guides** med konkrete eksempler
- **Prompt templates** til forskellige fag
- **Værktøjssammenligninger** med ratings
- **Interaktive quizzer** med feedback
- **Case studies** og success stories

## 🎨 Customization

### Farver
Nordiske farver defineret i `styles/globals.css`:
```css
:root {
  --nordic-sage: #9CAF88;
  --nordic-slate: #6B7280;
  --nordic-cream: #F5F5F0;
  --nordic-charcoal: #374151;
  --nordic-forest: #4A6741;
}
```

### Lokalisering
Tilføj nye sprog ved at:
1. Opret `locales/[sprog].json`
2. Tilføj oversættelser
3. Opdater `_app.js` context

### Indhold
Tilføj nye sider ved at:
1. Opret markdown fil i `content/[sprog]/`
2. Opret side i `pages/`
3. Tilføj til navigation i `Layout.js`

## 🚀 Deployment

### Vercel (Anbefalet)
1. Push til GitHub
2. Forbind til Vercel
3. Deploy automatisk

### Andre platforme
```bash
npm run build
npm start
```

## 📊 Performance

- **Lighthouse Score**: 95+ på alle kategorier
- **SEO Optimized**: Meta tags og structured data
- **Fast Loading**: Optimized images og code splitting
- **Mobile First**: Responsivt design

## 🤝 Bidrag

1. Fork repository
2. Opret feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit ændringer (`git commit -m 'Add some AmazingFeature'`)
4. Push til branch (`git push origin feature/AmazingFeature`)
5. Opret Pull Request

## 📄 Licens

Dette projekt er licenseret under MIT License - se [LICENSE](LICENSE) filen for detaljer.

## 📞 Kontakt

- **Email**: kontakt@ai-undervisning.dk
- **Website**: [ai-undervisning.dk](https://ai-undervisning.dk)

## 🙏 Tak

Tak til alle lærere og undervisere der har bidraget med feedback og idéer til dette projekt.

---

**Husk**: AI er et værktøj, ikke en erstatning for god undervisning. De bedste resultater opnås når AI bruges strategisk sammen med menneskelig ekspertise og omsorg. 