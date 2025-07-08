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
- **Avanceret Markdown Renderer** - Understøtter callouts, custom tabeller, stjerner, og HTML blocks

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
- **Content**: Markdown med custom renderer (`components/MarkdownRenderer.js`)
- **Icons**: Heroicons
- **Localization**: Custom context-based system
- **Deployment**: Vercel-ready
- **Ekstra**: Python scraper til indhold (se `/scraper`)

## 📁 Projektstruktur

```
ai-teaching-website/
├── components/          # React komponenter
│   ├── Layout.js
│   ├── MarkdownRenderer.js # Custom markdown renderer (callouts, tabeller, stjerner, HTML)
│   ├── ScrollToTop.js
│   ├── Breadcrumb.js
│   └── AdSense.js
├── content/            # Markdown indhold
│   ├── da/            # Dansk indhold
│   └── en/            # Engelsk indhold
├── locales/           # Lokalisering
│   ├── da.json        # Dansk oversættelser
│   └── en.json        # Engelsk oversættelser
├── pages/             # Next.js sider
│   ├── _app.js
│   ├── _document.js
│   ├── index.js
│   ├── ai-foraeldremoede.js
│   ├── ai-i-dansk-fag-detailed.js
│   ├── ai-i-historie-detailed.js
│   ├── ai-i-matematik-detailed.js
│   ├── ai-inklusion.js
│   ├── ai-lovgivning.js
│   ├── ai-teaching.js
│   ├── ai-vaerktoejssammenligning.js
│   ├── comparison.js
│   ├── guide.js
│   └── quiz-generator.js
├── scraper/            # Python scripts til indholdsscraping
│   ├── aiskoleScraper.py
│   └── aiskole_content.json
├── styles/            # CSS styling
│   └── globals.css    # Global styling med nordisk tema
├── start-prod.sh      # Linux/macOS start script
├── start-prod.ps1     # Windows PowerShell script
├── tailwind.config.js
├── postcss.config.js
├── next.config.js
└── README.md
```

## 🚀 Kom i gang

### Prerequisites
- Node.js 18+ 
- npm eller yarn

### Installation

1. **Klon repository**
```bash
git clone https://github.com/dit-username/ai-teaching-website.git
cd ai-teaching-website
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

1. **Forside** (`/`)
2. **AI i Forældremøde** (`/ai-foraeldremoede`)
3. **AI i Dansk (detaljeret)** (`/ai-i-dansk-fag-detailed`)
4. **AI i Historie (detaljeret)** (`/ai-i-historie-detailed`)
5. **AI i Matematik (detaljeret)** (`/ai-i-matematik-detailed`)
6. **AI Inklusion** (`/ai-inklusion`)
7. **AI Lovgivning** (`/ai-lovgivning`)
8. **AI i Undervisning** (`/ai-teaching`)
9. **AI Værktøjssammenligning** (`/ai-vaerktoejssammenligning`)
10. **Sammenligning** (`/comparison`)
11. **Guide** (`/guide`)
12. **Quiz Generator** (`/quiz-generator`)

### Indholdstyper

- **Praktiske guides** med konkrete eksempler
- **Prompt templates** til forskellige fag
- **Værktøjssammenligninger** med ratings og stjerner
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

- **Email**: info@ai-skole.dk
- **Website**: [ai-undervisning.dk](https://ai-undervisning.dk)

## 🙏 Tak

Tak til alle lærere og undervisere der har bidraget med feedback og idéer til dette projekt.

---

**Husk**: AI er et værktøj, ikke en erstatning for god undervisning. De bedste resultater opnås når AI bruges strategisk sammen med menneskelig ekspertise og omsorg. 