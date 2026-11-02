import {siteOrigin} from '../src/page-config.ts';

const images = {
  architects: ['architects-hero.webp', 'Wnętrze i materiały do projektu'],
  solutions: ['day-rhythm-morning-tv-wall.webp', 'Salon w porannej scenie automatyki'],
  projects: ['solutions-scene-morning.webp', 'Poranna scena w inteligentnym domu'],
};
const defaultImage = ['residential_residence_1790288136955.jpg', 'Nowoczesny dom z automatyką KNX'];

export function seoMetadata(id, page) {
  const canonical = siteOrigin + page.path;
  const [filename, alt] = images[id] ?? defaultImage;
  const image = siteOrigin + '/media/' + filename;
  const business = {
    '@type':'LocalBusiness', '@id':siteOrigin+'/#firma', name:'InteliSpaces', url:siteOrigin+'/',
    logo:siteOrigin+'/assets/brand/intelispaces-logo-poziome.svg', image, telephone:'+48 505 260 715',
    email:'biuro@intelispaces.pl', address:{'@type':'PostalAddress', streetAddress:'ul. Konwaliowa 7 lok. 103',
      addressLocality:'Warszawa', postalCode:'03-194', addressCountry:'PL'},
  };
  const graph = [
    {'@type': id==='contact' ? 'ContactPage' : id==='about' ? 'AboutPage' : 'WebPage',
      '@id':canonical+'#strona', url:canonical, name:page.title, description:page.description,
      inLanguage:'pl', isPartOf:{'@id':siteOrigin+'/#witryna'}},
  ];
  if (id==='home') graph.push(
    {'@type':'WebSite', '@id':siteOrigin+'/#witryna', name:'InteliSpaces', url:siteOrigin+'/', inLanguage:'pl', publisher:{'@id':business['@id']}},
    business,
  );
  return [
    `<link rel="canonical" href="${canonical}">`,
    `<meta property="og:url" content="${canonical}">`,
    '<meta property="og:site_name" content="InteliSpaces">',
    `<meta property="og:image" content="${image}">`,
    `<meta property="og:image:alt" content="${alt}">`,
    `<meta name="twitter:image" content="${image}">`,
    `<script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@graph':graph}).replace(/</g,'\\u003c')}</script>`,
  ].join('\n');
}
