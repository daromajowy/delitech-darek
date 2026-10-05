# DESIGN.md – Delitech Smart Automation

> **Projekt:** Delitech – Profesjonalna automatyka budynkowa KNX & DALI dla biur, domów i apartamentów.  
> **Koncepcja wizualna:** Dyskretna inżynieria architektoniczna, elegancja klasy premium, brak taniej technogadżetości.  
> **Status:** Wersja produkcyjna / referencyjna dla zespołu (Darek & Janek).

---

## 1. Filozofia i DNA Marki (Design Philosophy)

* **Architectural Quiet Tech:** Automatyka budynkowa jako integralna część architektury wnętrza, a nie krzykliwa elektronika użytkowa.
* **Inżynierska precyzja i spokój:** Przejrzysta struktura siatki (*architectural grid*), czytelna hierarchia typograficzna, naturalne materiałowe odcienie.
* **Brak "AI Slop" i tanich stocków:** Rezygnacja z generycznych ilustracji 3D, neonowych niebieskich gradientów i świecących w ciemności kul. Stawiamy na autentyczne komponenty osprzętu (JUNG LS 990 / LS TOUCH, Gira, Theben), naturalne światło i prawdziwą architekturę.
* **B2B & High-End B2C:** Przekaz dostosowany zarówno do inwestorów instytucjonalnych (biura, zarząd, komercyjne), architektów wnętrz, jak i właścicieli luksusowych rezydencji.

---

## 2. Paleta Barw (Color Palette)

System kolorów oparty jest na naturalnych tonach lasu, kamienia i grafitu z precyzyjnym akcentem technologicznym.

| Zmienna / Nazwa | Wartość HEX | Zastosowanie |
| :--- | :--- | :--- |
| **Deep Forest Green** (`--color-green-deep`) | `#0E4637` | Główny kolor marki, nagłówki, wyraziste tła sekcji, primary buttons, logo. |
| **Architectural Graphite** (`--color-graphite`) | `#17211C` | Tekst główny, tło stopki, ciemne panele, ramki wideo banera. |
| **Soft Sand BG** (`--color-bg`) | `#F7F8F5` | Główne tło witryny – ciepła, papierowa biel architektoniczna (nie męczy wzroku). |
| **Sage / Soft Green** (`--color-green-soft`) | `#CFE3C4` | Delikatne tła kart, tagi, akcenty statusu, subtelne ramki w dark mode. |
| **Warm Sand** (`--color-sand`) | `#EDE9DF` | Tła sekcji wyróżnionych, alternatywne bloki informacyjne. |
| **Electric Lime** (`--color-lime`) | `#E6F15A` | Wyrazisty akcent mikro-interakcji, wskaźniki CTA, hover-efekty, badge "NOWOŚĆ / LIVE". |
| **Subtle Border** | `rgba(23, 33, 28, 0.08)` | Precyzyjne, cienkie linie podziału w duchu rysunku technicznego. |

---

## 3. Typografia (Typography System)

Wybór fontów łączy solidność nowoczesnego bezszeryfowca architektonicznego z doskonałą czytelnością na ekranach.

### Fonty:
* **Display / Nagłówki (H1–H4):** `Manrope` (lub sans-serif fallback)  
  *Właściwości:* `font-bold` / `font-semibold`, lekko zacieśniony tracking (`letter-spacing: -0.025em`), wyważone proporcje geometryczne.
* **Body / Tekst ciągły:** `Plus Jakarta Sans`, system-ui  
  *Właściwości:* czysty, czytelny rytm pionowy, wysoki współczynnik x-height.
* **Techniczny / Dane / Metadane:** `JetBrains Mono`  
  *Właściwości:* parametry instalacji, metraże, oznaczenia KNX/DALI, kody norm.

### Skala i hierarchia:
* **Hero H1:** `text-4xl sm:text-5xl lg:text-6xl`, line-height `1.1`, lead-in z akcentem Deep Green.
* **Section H2:** `text-2xl sm:text-3xl lg:text-4xl`, line-height `1.2`.
* **Card H3:** `text-lg sm:text-xl font-semibold`.
* **Lead Paragraph:** `text-lg sm:text-xl text-[#17211C]/80 leading-relaxed`.
* **Body Text:** `text-sm sm:text-base text-[#17211C]/75 leading-relaxed`.
* **Overline / Category Tag:** `text-xs font-mono uppercase tracking-wider text-[#0E4637] font-semibold`.

---

## 4. Komponenty Kluczowe i Układ (Component Architecture)

### 4.1. Nawigacja (Navbar)
* **Położenie:** Sticky top ze szklistym tłem (`bg-[#F7F8F5]/90 backdrop-blur-md`).
* **Siatka:** Logo Delitech po lewej, rozbudowane menu kaskadowe pośrodku (z podkategoriami i bezpośrednimi kotwicami), szybki kontakt telefoniczny + przycisk CTA "Bezpłatna konsultacja" po prawej.
* **Podział stron:**
  1. `Dla biur` (Open space, sale konferencyjne, recepcje, gabinety, modernizacja, audyt)
  2. `Domy i apartamenty` (Domy jednorodzinne, rezydencje, modernizacja)
  3. `Rozwiązania` (DALI, fasady/rolety, HVAC, sceny, audyt energii, bezpieczeństwo)
  4. `Dla architektów` (Współpraca, schematy CAD, wsparcie specyfikacyjne)
  5. `Standard KNX` (Otwarte protokoły, gwarancja niezależności)
  6. `Realizacje`, `Baza wiedzy`, `O nas`, `Kontakt`

### 4.2. Baner Wideo Hero (`HeroVideo.tsx`)
* **Format:** Pełna szerokość (`100%`), elastyczna wysokość `clamp(240px, 43vw, 720px)`.
* **Treść:** Prawdziwy sprzęt premium – panel dotykowy **JUNG LS TOUCH** w eleganckim, ciemnym wnętrzu.
* **Zasady UX:**
  * Wyciszony (`muted`), automatycznie odtwarzany w pętli (`autoplay`, `loop`, `playsInline`).
  * Automatyczna pauza po zmianie karty przeglądarki (`visibilitychange`), brak uciążliwych kontrolek.
  * Zgodność z dostępnością: respektuje `prefers-reduced-motion` (całkowite ukrycie dla wrażliwych użytkowników).

### 4.3. Siatki Tła i Elementy Architektoniczne
* Klasa `.bg-grid-subtle` – subtelna siatka modułowa 40px × 40px w kolorze Deep Green o kryciu 4%, nawiązująca do deski kreślarskiej architekta.
* Karty z ostrymi lub subtelnymi zaokrągleniami (`rounded-xl`), bez przesadzonych cieni – nacisk na precyzyjny obrys (`border border-[#17211C]/10`).

### 4.4. Formularz Ofertowy (`ContactForm.tsx` & `ConsultationModal.tsx`)
* **Struktura wielokrokowa/kontekstowa:** Wybór typu inwestycji (biuro, dom, rezydencja), etapu (koncepcja, stan surowy, wykończenie), metrażu i pożądanego zakresu (DALI, HVAC, żaluzje, multiroom).
* **Obsługa załączników:** Możliwość dodania rzutów architektonicznych PDF/DWG.
* **Transparentność formalna:** Pełna zgodność RODO (`PrivacyModal.tsx`), informacja o czasie odpowiedzi (< 24h).

---

## 5. Responsywność i Dostępność (RWD & Accessibility)

* **Mobile First:** Hamburger menu z płynną akordeonową nawigacją po podstronach.
* **Obsługa dotykowa:** Przyciski i elementy klikalne o minimalnej strefie dotyku 44×44px.
* **Dostępność wizualna:** Kontrast kolorów spełniający kryteria **WCAG AA** dla tekstu podstawowego i nagłówków.
* **Wydajność:** Statyczna kompilacja Vite, optymalizacja fontów, formaty WebP/JPEG + nowoczesne wideo MP4 bez zbędnego obciążenia procesora.

---

## 6. Struktura Środowiska i Wdrożeń (Deployment Architecture)

Projekt posiada potrójny podgląd gałęzi w GitHub Actions (`.github/workflows/deploy.yml`):
* `https://daromajowy.github.io/delitech-darek/` – Wersja Główna (`main`)
* `https://daromajowy.github.io/delitech-darek/Darka/` – Wersja Robocza Darka (`Darka`)
* `https://daromajowy.github.io/delitech-darek/Janka/` – Wersja Robocza Janka (`Janka`)
