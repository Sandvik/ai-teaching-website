import requests
from bs4 import BeautifulSoup
import json
import time
import re
from urllib.parse import urljoin, urlparse
from datetime import datetime
import logging
import urllib3

# Disable SSL warnings
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# Opsætning af logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class AISkoleScraper:
    def __init__(self):
        self.base_url = "https://www.aiskole.dk"
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
        # Disable SSL verification to handle certificate issues
        self.session.verify = False
        self.courses = []
        self.articles = []

    def get_page_content(self, url, retry_count=3):
        """Henter indhold fra en URL med retry funktionalitet og SSL handling"""
        for attempt in range(retry_count):
            try:
                response = self.session.get(url, timeout=30, verify=False)
                response.raise_for_status()
                return response
            except requests.exceptions.SSLError as e:
                logger.warning(f"SSL fejl for {url}: {e}")
                # Prøv med http i stedet
                if url.startswith('https://'):
                    http_url = url.replace('https://', 'http://')
                    try:
                        response = self.session.get(http_url, timeout=30)
                        response.raise_for_status()
                        return response
                    except Exception as http_e:
                        logger.warning(f"HTTP fallback fejlede for {http_url}: {http_e}")
                
                if attempt < retry_count - 1:
                    time.sleep(2 ** attempt)
                else:
                    logger.error(f"SSL fejl - kunne ikke hente {url} efter {retry_count} forsøg")
                    return None
            except requests.RequestException as e:
                logger.warning(f"Forsøg {attempt + 1} fejlede for {url}: {e}")
                if attempt < retry_count - 1:
                    time.sleep(2 ** attempt)
                else:
                    logger.error(f"Kunne ikke hente {url} efter {retry_count} forsøg")
                    return None

    def find_known_urls(self):
        """Returnerer kendte URLs baseret på undersøgelse af siden"""
        known_urls = {
            'courses': [
                "https://www.aiskole.dk/courses/ai-vejleder-til-naturfagseksamen/",
                "https://www.aiskole.dk/courses/mit-eget-ai-eventyr/",
                "https://www.aiskole.dk/courses/historietimen-med-timegpt/",
                "https://www.aiskole.dk/courses/laer-med-h-c-andersen/",
                "https://www.aiskole.dk/courses/ai-tutor-prompt-til-eksamensforberedelse-i-gymnasiet/"
            ],
            'articles': [
                "https://www.aiskole.dk/kunstig-intelligens-i-skolen-saadan-bruger-i-ai-lovligt-sikkert-og-ansvarligt/",
                "https://www.aiskole.dk/sprogmodeller-i-skolen/",
                "https://www.aiskole.dk/ai-i-skolen/",
                "https://www.aiskole.dk/promptstrategier/",
                "https://www.aiskole.dk/ai-i-skolen-din-guide-til-ai-i-undervisningen/",
                "https://www.aiskole.dk/kunstig-intelligens-i-skolen-saadan-bruger-i-ai-lovligt-sikkert-og-ansvarligt/"
            ]
        }
        return known_urls

    def discover_urls_from_sitemap(self):
        """Prøver at finde URLs fra sitemap"""
        sitemap_urls = [
            f"{self.base_url}/sitemap.xml",
            f"{self.base_url}/sitemap_index.xml",
            f"{self.base_url}/wp-sitemap.xml"
        ]
        
        found_urls = {'courses': set(), 'articles': set()}
        
        for sitemap_url in sitemap_urls:
            logger.info(f"Checker sitemap: {sitemap_url}")
            response = self.get_page_content(sitemap_url)
            if response:
                try:
                    soup = BeautifulSoup(response.content, 'xml')
                    urls = soup.find_all('url')
                    for url in urls:
                        loc = url.find('loc')
                        if loc:
                            url_text = loc.text
                            if '/courses/' in url_text:
                                found_urls['courses'].add(url_text)
                                logger.info(f"Fandt course URL: {url_text}")
                            elif any(keyword in url_text for keyword in ['/ai-i-skolen/', '/sprogmodeller/', '/prompt']):
                                found_urls['articles'].add(url_text)
                                logger.info(f"Fandt article URL: {url_text}")
                except Exception as e:
                    logger.warning(f"Kunne ikke parse sitemap {sitemap_url}: {e}")
        
        return {'courses': list(found_urls['courses']), 'articles': list(found_urls['articles'])}

    def scrape_main_page_for_links(self):
        """Scraper hovedsiden for links til kurser og artikler"""
        found_urls = {'courses': set(), 'articles': set()}
        
        logger.info(f"Scraper hovedside: {self.base_url}")
        response = self.get_page_content(self.base_url)
        
        if response:
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Find alle links på hovedsiden
            links = soup.find_all('a', href=True)
            for link in links:
                href = link['href']
                full_url = urljoin(self.base_url, href)
                
                # Kategoriser links
                if '/courses/' in full_url and full_url.startswith(self.base_url):
                    found_urls['courses'].add(full_url)
                elif any(keyword in full_url for keyword in ['/ai-i-skolen/', '/sprogmodeller/', '/prompt']):
                    found_urls['articles'].add(full_url)
        
        return {'courses': list(found_urls['courses']), 'articles': list(found_urls['articles'])}

    def extract_course_content(self, url):
        """Ekstraherer indhold fra et kursus"""
        logger.info(f"Scraper kursus: {url}")
        
        response = self.get_page_content(url)
        if not response:
            return None
            
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Ekstraher titel
        title = ""
        title_selectors = ['h1', '.course-title', '.entry-title', 'title']
        for selector in title_selectors:
            title_element = soup.select_one(selector)
            if title_element:
                title = title_element.get_text().strip()
                break
        
        if not title and soup.title:
            title = soup.title.get_text().strip()
            title = re.sub(r'\s*-\s*AI Skole.*$', '', title)
        
        # Ekstraher beskrivelse/indhold
        content = ""
        content_selectors = [
            '.course-description',
            '.course-content', 
            '.entry-content',
            '.content',
            'main',
            'article'
        ]
        
        content_element = None
        for selector in content_selectors:
            content_element = soup.select_one(selector)
            if content_element:
                break
        
        if content_element:
            # Fjern uønskede elementer
            for unwanted in content_element(["script", "style", "nav", "footer", "header", ".sidebar"]):
                unwanted.decompose()
            content = content_element.get_text(separator=' ', strip=True)
        
        # Rens indhold
        content = re.sub(r'\s+', ' ', content).strip()
        
        # Ekstraher metadata
        target_level = ""
        subject = ""
        prompt_count = 0
        
        # Find uddannelsesniveau
        level_indicators = {
            'indskoling': ['indskoling', '0.-3. klasse'],
            'mellemtrin': ['mellemtrin', '4.-6. klasse'],
            'udskoling': ['udskoling', '7.-9. klasse', '9. klasse'],
            'gymnasiel/erhverv': ['gymnasiel', 'erhverv', 'gymnasium', 'stx', 'htx']
        }
        
        content_lower = content.lower()
        for level, indicators in level_indicators.items():
            if any(indicator in content_lower for indicator in indicators):
                target_level = level
                break
        
        # Find fag baseret på indhold og URL
        subjects = {
            'matematik': ['matematik', 'tal', 'regning', 'integral'],
            'dansk': ['dansk', 'sprog', 'litteratur', 'h.c. andersen'],
            'historie': ['historie', 'churchill', 'verdenskrig', 'timegpt'],
            'naturfag': ['naturfag', 'biologi', 'fysik', 'kemi'],
            'ai-værktøjer': ['midjourney', 'chatgpt', 'ai-værktøj'],
            'eksamen': ['eksamen', 'forberedelse', 'test']
        }
        
        for subj, keywords in subjects.items():
            if any(keyword in content_lower for keyword in keywords):
                subject = subj
                break
        
        # Find antal prompts (hvis nævnt)
        prompt_match = re.search(r'(\d+)\s*prompt', content_lower)
        if prompt_match:
            prompt_count = int(prompt_match.group(1))
        
        # Lav resume
        summary = content[:200] + "..." if len(content) > 200 else content
        
        return {
            'url': url,
            'title': title,
            'summary': summary,
            'content': content,
            'type': 'course',
            'target_level': target_level,
            'subject': subject,
            'prompt_count': prompt_count,
            'scraped_at': datetime.now().isoformat(),
            'word_count': len(content.split()),
            'source': 'AI Skole'
        }

    def extract_article_content(self, url):
        """Ekstraherer indhold fra en artikel"""
        logger.info(f"Scraper artikel: {url}")
        
        response = self.get_page_content(url)
        if not response:
            logger.warning(f"Ingen respons for artikel: {url}")
            return None
            
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Ekstraher titel
        title = ""
        title_selectors = ['h1', '.article-title', '.entry-title', 'title']
        for selector in title_selectors:
            title_element = soup.select_one(selector)
            if title_element:
                title = title_element.get_text().strip()
                break
        
        if not title and soup.title:
            title = soup.title.get_text().strip()
            title = re.sub(r'\s*-\s*AI Skole.*$', '', title)
        
        # Ekstraher indhold
        content_selectors = [
            'article',
            '.article-content',
            '.entry-content',
            '.content',
            'main',
            '.elementor-widget-container',
            '.elementor-section',
            '.elementor',
            '.site-main',
            '#main',
            '.post',
            '.page-content',
            '.elementor-widget-text-editor',
            '.elementor-widget-theme-post-content',
            '.elementor-container',
            '.elementor-row',
            '.page'
        ]

        content = ""
        found_any = False
        for selector in content_selectors:
            elements = soup.select(selector)
            if elements:
                found_any = True
                for el in elements:
                    for unwanted in el(["script", "style", "nav", "footer", "header", ".sidebar"]):
                        unwanted.decompose()
                    content += el.get_text(separator=' ', strip=True) + " "
        if not found_any:
            logger.warning(f"Ingen content_element fundet for artikel: {url}")
        content = re.sub(r'\s+', ' ', content).strip()
        logger.info(f"Artikel content længde for {url}: {len(content)} tegn")
        
        # Kategoriser artikel type
        article_type = "general"
        if 'sprogmodel' in title.lower() or 'chatgpt' in content.lower():
            article_type = "ai-tools"
        elif 'prompt' in title.lower():
            article_type = "prompt-guide"
        elif 'undervisning' in content.lower():
            article_type = "teaching-guide"
        
        # Lav resume
        summary = content[:200] + "..." if len(content) > 200 else content
        
        return {
            'url': url,
            'title': title,
            'summary': summary,
            'content': content,
            'type': 'article',
            'article_type': article_type,
            'scraped_at': datetime.now().isoformat(),
            'word_count': len(content.split()),
            'source': 'AI Skole'
        }

    def scrape_all_content(self):
        """Hovedfunktion der scraper alt indhold"""
        logger.info("Starter scraping af AI Skole...")
        
        # Find alle URLs
        all_urls = {'courses': set(), 'articles': set()}
        
        # Metode 1: Fra kendte URLs
        known = self.find_known_urls()
        all_urls['courses'].update(known['courses'])
        all_urls['articles'].update(known['articles'])
        logger.info(f"Fandt {len(known['courses'])} kendte course URLs og {len(known['articles'])} kendte article URLs")
        
        # Metode 2: Fra sitemap
        try:
            sitemap = self.discover_urls_from_sitemap()
            all_urls['courses'].update(sitemap['courses'])
            all_urls['articles'].update(sitemap['articles'])
            logger.info(f"Fandt {len(sitemap['courses'])} course URLs og {len(sitemap['articles'])} article URLs fra sitemap")
        except Exception as e:
            logger.warning(f"Sitemap scraping fejlede: {e}")
        
        # Metode 3: Fra hovedside
        try:
            main_page = self.scrape_main_page_for_links()
            all_urls['courses'].update(main_page['courses'])
            all_urls['articles'].update(main_page['articles'])
            logger.info(f"Fandt {len(main_page['courses'])} course URLs og {len(main_page['articles'])} article URLs fra hovedside")
        except Exception as e:
            logger.warning(f"Hovedside scraping fejlede: {e}")
        
        # Konvertér til lister
        course_urls = list(all_urls['courses'])
        article_urls = list(all_urls['articles'])
        
        logger.info(f"Total: {len(course_urls)} kurser og {len(article_urls)} artikler at scrape")
        
        # Scrape kurser
        successful_courses = 0
        for i, url in enumerate(course_urls, 1):
            logger.info(f"Scraper kursus {i}/{len(course_urls)}: {url}")
            
            course = self.extract_course_content(url)
            if course and course['content'].strip():
                self.courses.append(course)
                successful_courses += 1
            
            time.sleep(1)  # Vær høflig
        
        # Scrape artikler
        successful_articles = 0
        for i, url in enumerate(article_urls, 1):
            logger.info(f"Scraper artikel {i}/{len(article_urls)}: {url}")
            
            article = self.extract_article_content(url)
            if article and article['content'].strip():
                self.articles.append(article)
                successful_articles += 1
            
            time.sleep(1)  # Vær høflig
        
        logger.info(f"Scraping færdig! {successful_courses}/{len(course_urls)} kurser og {successful_articles}/{len(article_urls)} artikler scraped succesfuldt")
        
        return {
            'courses': self.courses,
            'articles': self.articles
        }

    def save_to_json(self, filename="aiskole_content.json"):
        """Gemmer alt indhold til JSON fil"""
        output = {
            'scraped_at': datetime.now().isoformat(),
            'source': 'AI Skole (aiskole.dk)',
            'total_courses': len(self.courses),
            'total_articles': len(self.articles),
            'courses': self.courses,
            'articles': self.articles
        }
        
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(output, f, ensure_ascii=False, indent=2)
        
        logger.info(f"Data gemt til {filename}")
        return filename

    def get_statistics(self):
        """Returnerer statistikker om det scrapede indhold"""
        # Kursus statistikker
        course_levels = {}
        course_subjects = {}
        total_prompts = 0
        
        for course in self.courses:
            level = course.get('target_level', 'ukendt')
            subject = course.get('subject', 'ukendt')
            prompts = course.get('prompt_count', 0)
            
            course_levels[level] = course_levels.get(level, 0) + 1
            course_subjects[subject] = course_subjects.get(subject, 0) + 1
            total_prompts += prompts
        
        # Artikel statistikker
        article_types = {}
        for article in self.articles:
            art_type = article.get('article_type', 'ukendt')
            article_types[art_type] = article_types.get(art_type, 0) + 1
        
        # Ordantal
        total_words = sum(item['word_count'] for item in self.courses + self.articles)
        avg_words = total_words // (len(self.courses) + len(self.articles)) if (self.courses or self.articles) else 0
        
        return {
            'total_courses': len(self.courses),
            'total_articles': len(self.articles),
            'total_content': len(self.courses) + len(self.articles),
            'total_words': total_words,
            'average_words_per_item': avg_words,
            'total_prompts': total_prompts,
            'course_levels': sorted(course_levels.items(), key=lambda x: x[1], reverse=True),
            'course_subjects': sorted(course_subjects.items(), key=lambda x: x[1], reverse=True),
            'article_types': sorted(article_types.items(), key=lambda x: x[1], reverse=True)
        }

def main():
    """Hovedfunktion"""
    scraper = AISkoleScraper()
    
    # Scrape alt indhold
    content = scraper.scrape_all_content()
    
    if content['courses'] or content['articles']:
        # Gem til JSON
        filename = scraper.save_to_json()
        
        # Få statistikker
        stats = scraper.get_statistics()
        
        # Print resultater
        print(f"\n{'='*50}")
        print(f"AI SKOLE SCRAPING FÆRDIG!")
        print(f"{'='*50}")
        print(f"Kurser scraped: {stats['total_courses']}")
        print(f"Artikler scraped: {stats['total_articles']}")
        print(f"Total indhold: {stats['total_content']}")
        print(f"Data gemt til: {filename}")
        print(f"Total antal ord: {stats['total_words']:,}")
        print(f"Gennemsnitlig ordantal: {stats['average_words_per_item']}")
        print(f"Total prompts: {stats['total_prompts']}")
        
        if stats['course_levels']:
            print(f"\nKurser efter uddannelsesniveau:")
            for level, count in stats['course_levels']:
                print(f"  - {level}: {count} kurser")
        
        if stats['course_subjects']:
            print(f"\nKurser efter fag:")
            for subject, count in stats['course_subjects']:
                print(f"  - {subject}: {count} kurser")
        
        if stats['article_types']:
            print(f"\nArtikler efter type:")
            for art_type, count in stats['article_types']:
                print(f"  - {art_type}: {count} artikler")
        
        # Vis eksempler
        print(f"\nEksempler på kurser:")
        for i, course in enumerate(content['courses'][:3]):
            print(f"{i+1}. {course['title']} ({course.get('target_level', 'ukendt niveau')})")
        
        if content['articles']:
            print(f"\nEksempler på artikler:")
            for i, article in enumerate(content['articles'][:3]):
                print(f"{i+1}. {article['title']}")
                
    else:
        print("Intet indhold kunne scrapes!")

if __name__ == "__main__":
    main()