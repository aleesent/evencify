import { EventItem, OrganiserProfile } from '../types';

export interface CityData {
  slug: string;
  name: string;
  state: string;
  stateSlug: string;
  tier: 1 | 2 | 3;
  priority: boolean;
  lat: number;
  lng: number;
  description: string;
  areas?: string[];
  popularVenues?: string[];
  faqs?: { q: string; a: string }[];
}

export interface StateData {
  slug: string;
  name: string;
  capital: string;
  description: string;
  priorityCities: string[];
}

export interface CategoryData {
  slug: string;
  name: string;
  iconName: string;
  headline: string;
  description: string;
  keywords: string[];
  relatedCategorySlugs: string[];
}

// ----------------------------------------------------
// Canonical City Aliases & Normalized Slugs
// ----------------------------------------------------
export const CITY_ALIASES: Record<string, string> = {
  bangalore: 'bengaluru',
  bombay: 'mumbai',
  baroda: 'vadodara',
  gurgaon: 'gurugram',
  calcutta: 'kolkata',
  madras: 'chennai',
  benares: 'varanasi',
  banaras: 'varanasi',
  kashi: 'varanasi',
  mysore: 'mysuru',
  'surat-gujarat': 'surat',
  'ahmedabad-gujarat': 'ahmedabad',
  'vadodara-gujarat': 'vadodara',
  'rajkot-gujarat': 'rajkot',
  'gandhinagar-gujarat': 'gandhinagar',
  'bharuch-gujarat': 'bharuch',
  'bhavnagar-gujarat': 'bhavnagar',
  'jamnagar-gujarat': 'jamnagar',
  'anand-gujarat': 'anand',
  'navsari-gujarat': 'navsari',
  'vapi-gujarat': 'vapi',
  'valsad-gujarat': 'valsad',
  'mehsana-gujarat': 'mehsana',
  'morbi-gujarat': 'morbi',
  'junagadh-gujarat': 'junagadh',
  'bhuj-gujarat': 'bhuj',
  'kutch': 'bhuj',
  'somnath-gujarat': 'somnath',
  veraval: 'somnath',
  'mumbai-maharashtra': 'mumbai',
  'delhi-ncr': 'delhi',
  newdelhi: 'delhi',
  'new-delhi': 'delhi',
  poona: 'pune',
  trichy: 'tiruchirappalli',
  cochint: 'kochi',
  cochin: 'kochi',
  vizag: 'visakhapatnam',
};

// ----------------------------------------------------
// Scalable Indian Cities Database
// ----------------------------------------------------
export const CITIES_DATABASE: Record<string, CityData> = {
  surat: {
    slug: 'surat',
    name: 'Surat',
    state: 'Gujarat',
    stateSlug: 'gujarat',
    tier: 2,
    priority: true,
    lat: 21.1702,
    lng: 72.8311,
    description:
      'Surat is Gujarat’s vibrant commercial and cultural hub, renowned globally for diamond manufacturing, textile excellence, luxury weddings, high-energy concerts, and international business conventions.',
    areas: [
      'Adajan',
      'Vesu',
      'City Light',
      'Piplod',
      'Athwa',
      'Varachha',
      'Katargam',
      'Nanpura',
      'Ring Road',
      'Majura Gate',
      'Dumas Road',
      'Palanpur',
    ],
    popularVenues: [
      'Surat International Exhibition & Convention Centre (SIECC), Sarsana',
      'Surat Diamond Bourse Exhibition Complex, DREAM City',
      'VR Arena Ground, Dumas Road',
      'Avadh Utopia Luxury Resort, Dumas Road',
      'Pandit Dindayal Upadhyay Indoor Stadium, Athwalines',
      'Sanjeev Kumar Auditorium, Pal',
    ],
    faqs: [
      {
        q: 'What events are happening in Surat?',
        a: 'Surat hosts year-round luxury weddings, diamond & textile trade expos at SIECC, live music concerts at VR Arena Ground, technology summits, and cultural festivals like Navratri and Uttarayan.',
      },
      {
        q: 'Where can I find upcoming events in Surat?',
        a: 'You can discover verified upcoming events across Vesu, Adajan, Dumas Road, and City Light directly on Evencify with venue details, schedules, tickets, and verified crew opportunities.',
      },
      {
        q: 'What events are happening this weekend in Surat?',
        a: 'Visit Evencify’s "This Weekend in Surat" section to explore live music gigs, food festivals, theatre performances, and weekend corporate workshops.',
      },
      {
        q: 'How can I hire event crew or staff for an event in Surat?',
        a: 'Evencify enables Surat event organisers to hire background-verified registration desk personnel, bouncers/security, hospitality staff, promoters, and setup crew with same-day escrow settlements.',
      },
    ],
  },
  ahmedabad: {
    slug: 'ahmedabad',
    name: 'Ahmedabad',
    state: 'Gujarat',
    stateSlug: 'gujarat',
    tier: 1,
    priority: true,
    lat: 23.0225,
    lng: 72.5714,
    description:
      'Ahmedabad, India’s first UNESCO World Heritage city and Gujarat’s largest metropolitan center, is an epicenter of world-class trade fairs, pharmaceutical summits, heritage cultural festivals, and mega stadium concerts.',
    areas: ['SG Highway', 'Prahlad Nagar', 'Bodakdev', 'Vastrapur', 'Navrangpura', 'Satellite', 'Sindhu Bhavan Road', 'Maninagar'],
    popularVenues: ['Narendra Modi Stadium, Motera', 'Mahatma Mandir (Gandhinagar/Ahmedabad)', 'Gujarat University Convention Centre', 'Riverfront Event Ground', 'EKA Club, Kankaria'],
    faqs: [
      {
        q: 'What are the top annual events in Ahmedabad?',
        a: 'Major annual events include the International Kite Festival (Uttarayan), vibrant Garba nights, Vibrant Gujarat Global Summit, and international cricket matches at Narendra Modi Stadium.',
      },
      {
        q: 'How do I find business and startup conferences in Ahmedabad?',
        a: 'Check Evencify’s Ahmedabad Business & Tech category for upcoming investor summits, startup demo days, and trade expos on SG Highway and Sindhu Bhavan Road.',
      },
    ],
  },
  vadodara: {
    slug: 'vadodara',
    name: 'Vadodara',
    state: 'Gujarat',
    stateSlug: 'gujarat',
    tier: 2,
    priority: true,
    lat: 22.3072,
    lng: 73.1812,
    description:
      'Known as the Cultural Capital of Gujarat (Sanskari Nagari), Vadodara is celebrated for its majestic Laxmi Vilas Palace events, classical fine arts festivals, Navratri celebrations, and industrial conventions.',
    areas: ['Alkapuri', 'Gotri', 'Vasna-Bhayli', 'Sayajigunj', 'Manjalpur', 'Karelibaug'],
    popularVenues: ['Laxmi Vilas Palace Banquet Grounds', 'Vadodara Navratri Festival Grounds', 'Sir Sayajirao Diamond Jubilee Hall', 'VCCI Exhibition Center'],
  },
  rajkot: {
    slug: 'rajkot',
    name: 'Rajkot',
    state: 'Gujarat',
    stateSlug: 'gujarat',
    tier: 2,
    priority: true,
    lat: 22.3039,
    lng: 70.8022,
    description:
      'The industrial and economic nerve center of Saurashtra, Rajkot regularly hosts engineering expos, agricultural summits, regional musical concerts, and grand traditional celebrations.',
    areas: ['Kalawad Road', '150 Feet Ring Road', 'Yagnik Road', 'University Road', 'Madhapar'],
    popularVenues: ['Race Course Ground', 'Shri Atal Bihari Vajpayee Auditorium', 'NSIC Exhibition Complex'],
  },
  gandhinagar: {
    slug: 'gandhinagar',
    name: 'Gandhinagar',
    state: 'Gujarat',
    stateSlug: 'gujarat',
    tier: 2,
    priority: true,
    lat: 23.2156,
    lng: 72.6369,
    description:
      'The green capital city of Gujarat, home to the sprawling Mahatma Mandir convention complex and GIFT City, hosting international policy summits, FinTech expos, and national exhibitions.',
    areas: ['Sector 10', 'Infocity', 'GIFT City', 'Kudasan', 'Randesan', 'Sargasan'],
    popularVenues: ['Mahatma Mandir Convention & Exhibition Centre', 'GIFT City Club & Arena', 'Dandi Kutir Grounds'],
  },
  mumbai: {
    slug: 'mumbai',
    name: 'Mumbai',
    state: 'Maharashtra',
    stateSlug: 'maharashtra',
    tier: 1,
    priority: true,
    lat: 19.076,
    lng: 72.8777,
    description:
      'India’s financial and entertainment capital, Mumbai hosts blockbuster arena concerts, Bollywood award ceremonies, global financial summits, comic cons, and high-fashion galas.',
    areas: ['Bandra Kurla Complex (BKC)', 'Andheri West', 'Lower Parel', 'Juhu', 'Colaba', 'Powai', 'Worli', 'Goregaon'],
    popularVenues: ['Jio World Convention Centre, BKC', 'Bombay Exhibition Centre (NESCO), Goregaon', 'Mahalaxmi Racecourse', 'D.Y. Patil Stadium', 'NCPA Nariman Point'],
    faqs: [
      {
        q: 'What major events take place at Jio World Centre in Mumbai?',
        a: 'Jio World Convention Centre hosts premier international conferences, luxury weddings, fashion weeks, and financial forums.',
      },
    ],
  },
  pune: {
    slug: 'pune',
    name: 'Pune',
    state: 'Maharashtra',
    stateSlug: 'maharashtra',
    tier: 1,
    priority: true,
    lat: 18.5204,
    lng: 73.8567,
    description:
      'The Oxford of the East and Maharashtra’s IT and manufacturing giant, Pune is renowned for high-energy music festivals, college techfests, hackathons, and automotive conferences.',
    areas: ['Koregaon Park', 'Baner', 'Kalyani Nagar', 'Viman Nagar', 'Hinjawadi', 'Aundh', 'Kothrud'],
    popularVenues: ['Auto Cluster Exhibition Center, Chinchwad', 'Mahalaxmi Lawns', 'Royal Palms, Koregaon Park', 'Balewadi Stadium'],
  },
  delhi: {
    slug: 'delhi',
    name: 'Delhi',
    state: 'Delhi',
    stateSlug: 'delhi',
    tier: 1,
    priority: true,
    lat: 28.7041,
    lng: 77.1025,
    description:
      'India’s national capital city, home to world-class diplomatic summits, India Art Fair, Auto Expo, massive stadium concerts, and national trade exhibitions.',
    areas: ['Connaught Place', 'Chanakyapuri', 'Dwarka', 'Saket', 'Nehru Place', 'Pragati Maidan', 'Hauz Khas'],
    popularVenues: ['Bharat Mandapam (IECC), Pragati Maidan', 'Yashobhoomi (IICC), Dwarka', 'Jawaharlal Nehru Stadium', 'Major Dhyan Chand National Stadium'],
  },
  bengaluru: {
    slug: 'bengaluru',
    name: 'Bengaluru',
    state: 'Karnataka',
    stateSlug: 'karnataka',
    tier: 1,
    priority: true,
    lat: 12.9716,
    lng: 77.5946,
    description:
      'The Silicon Valley of India, Bengaluru leads the nation in developer conferences, AI summits, founder meetups, indie music gigs, craft beer festivals, and startup demo days.',
    areas: ['Koramangala', 'Indiranagar', 'HSR Layout', 'Whitefield', 'Electronic City', 'MG Road', 'JP Nagar', 'Hebbal'],
    popularVenues: ['Bangalore International Exhibition Centre (BIEC)', 'Palace Grounds', 'Manpho Convention Centre', 'Jayamahal Palace'],
  },
  hyderabad: {
    slug: 'hyderabad',
    name: 'Hyderabad',
    state: 'Telangana',
    stateSlug: 'telangana',
    tier: 1,
    priority: true,
    lat: 17.385,
    lng: 78.4867,
    description:
      'Cyberabad and the City of Pearls, Hyderabad offers state-of-the-art facilities for pharmaceutical conferences, software conventions, royal Hyderabadi weddings, and sports leagues.',
    areas: ['HITEC City', 'Gachibowli', 'Banjara Hills', 'Jubilee Hills', 'Madhapur', 'Kondapur'],
    popularVenues: ['Hyderabad International Convention Centre (HICC / Novotel)', 'HITEX Exhibition Center', 'Gachibowli Indoor Stadium'],
  },
  chennai: {
    slug: 'chennai',
    name: 'Chennai',
    state: 'Tamil Nadu',
    stateSlug: 'tamil-nadu',
    tier: 1,
    priority: true,
    lat: 13.0827,
    lng: 80.2707,
    description:
      'The cultural heart of South India and an automotive manufacturing capital, known for the December Margazhi Music Season, healthcare summits, trade expos, and film galas.',
    areas: ['T. Nagar', 'Adyar', 'Mylapore', 'OMR (Old Mahabalipuram Road)', 'Nungambakkam', 'Anna Nagar'],
    popularVenues: ['Chennai Trade Centre (CTC), Nandambakkam', 'The Music Academy, TTK Road', 'Jawaharlal Nehru Stadium'],
  },
  kolkata: {
    slug: 'kolkata',
    name: 'Kolkata',
    state: 'West Bengal',
    stateSlug: 'west-bengal',
    tier: 1,
    priority: true,
    lat: 22.5726,
    lng: 88.3639,
    description:
      'The Cultural Capital of India, internationally acclaimed for Durga Puja carnivals, Kolkata International Book Fair, classical music concerts, and literature festivals.',
    areas: ['Park Street', 'Salt Lake (Bidhannagar)', 'New Town', 'Ballygunge', 'Alipore'],
    popularVenues: ['Biswa Bangla Mela Prangan, EM Bypass', 'Biswa Bangla Convention Centre, New Town', 'Science City Auditorium'],
  },
  jaipur: {
    slug: 'jaipur',
    name: 'Jaipur',
    state: 'Rajasthan',
    stateSlug: 'rajasthan',
    tier: 2,
    priority: true,
    lat: 26.9124,
    lng: 75.7873,
    description:
      'The Pink City of Rajasthan, world-famous for the Jaipur Literature Festival, destination royal weddings at heritage havelis, gem & jewellery shows, and craft expos.',
    areas: ['C-Scheme', 'Malviya Nagar', 'Vaishali Nagar', 'Mansarovar', 'Tonk Road', 'Amer'],
    popularVenues: ['Jaipur Exhibition & Convention Centre (JECC), Sitapura', 'Diggi Palace', 'Birla Auditorium'],
  },
  lucknow: {
    slug: 'lucknow',
    name: 'Lucknow',
    state: 'Uttar Pradesh',
    stateSlug: 'uttar-pradesh',
    tier: 2,
    priority: false,
    lat: 26.8467,
    lng: 80.9462,
    description:
      'The City of Nawabs, celebrated for rich culinary festivals, literary conventions, handicrafts exhibitions, and political summits.',
    areas: ['Gomti Nagar', 'Hazratganj', 'Aliganj', 'Indira Nagar'],
    popularVenues: ['Indira Gandhi Pratishthan, Gomti Nagar', 'Awadh Shilpgram'],
  },
  indore: {
    slug: 'indore',
    name: 'Indore',
    state: 'Madhya Pradesh',
    stateSlug: 'madhya-pradesh',
    tier: 2,
    priority: false,
    lat: 22.7196,
    lng: 75.8577,
    description:
      'India’s cleanest city and Madhya Pradesh’s commercial engine, hosting industrial trade fairs, food carnivals at Sarafa/Chappan, and education conclaves.',
    areas: ['Vijay Nagar', 'Palasia', 'Bhawarkua', 'Super Corridor'],
    popularVenues: ['Brilliant Convention Centre', 'Labhganga Exhibition Centre'],
  },
  chandigarh: {
    slug: 'chandigarh',
    name: 'Chandigarh',
    state: 'Punjab',
    stateSlug: 'punjab',
    tier: 2,
    priority: false,
    lat: 30.7333,
    lng: 76.7794,
    description:
      'The City Beautiful, planned by Le Corbusier, hosting Punjabi music concerts, corporate conclaves, golf tournaments, and garden festivals.',
    areas: ['Sector 17', 'Sector 35', 'Sector 26', 'IT Park', 'Mohali Phase 7'],
    popularVenues: ['CII Northern Region Headquarters, Sector 31', 'Tagore Theatre, Sector 18'],
  },
  noida: {
    slug: 'noida',
    name: 'Noida',
    state: 'Uttar Pradesh',
    stateSlug: 'uttar-pradesh',
    tier: 2,
    priority: false,
    lat: 28.5355,
    lng: 77.391,
    description:
      'A premier hub of Delhi NCR, boasting the India Expo Mart for mega international exhibitions, electronics summits, and media conclaves.',
    areas: ['Sector 18', 'Sector 62', 'Greater Noida Expressway', 'Knowledge Park'],
    popularVenues: ['India Expo Centre & Mart, Greater Noida', 'Noida Indoor Stadium'],
  },
  gurugram: {
    slug: 'gurugram',
    name: 'Gurugram',
    state: 'Haryana',
    stateSlug: 'haryana',
    tier: 2,
    priority: false,
    lat: 28.4595,
    lng: 77.0266,
    description:
      'The Millennium City of NCR, hosting Fortune 500 corporate conventions, tech summits on Cyber Hub, theatre shows, and luxury lifestyle pop-ups.',
    areas: ['Cyber City', 'Golf Course Road', 'Sohna Road', 'Sector 29', 'Udyog Vihar'],
    popularVenues: ['Kingdom of Dreams / Sector 29 Open Grounds', 'Appu Ghar Amphitheatre', 'The Leela Ambience Convention Hall'],
  },
  kochi: {
    slug: 'kochi',
    name: 'Kochi',
    state: 'Kerala',
    stateSlug: 'kerala',
    tier: 2,
    priority: false,
    lat: 9.9312,
    lng: 76.2673,
    description:
      'The Queen of the Arabian Sea, home to the world-renowned Kochi-Muziris Biennale, maritime conventions, and destination coastal weddings.',
    areas: ['Fort Kochi', 'Marine Drive', 'Kaloor', 'Edappally', 'Kakkanad (Infopark)'],
    popularVenues: ['Jawaharlal Nehru International Stadium', 'Lulu Bolgatty International Convention Centre'],
  },
  coimbatore: {
    slug: 'coimbatore',
    name: 'Coimbatore',
    state: 'Tamil Nadu',
    stateSlug: 'tamil-nadu',
    tier: 2,
    priority: false,
    lat: 11.0168,
    lng: 76.9558,
    description:
      'The Manchester of South India, hosting major industrial machinery expos (INTEC), textile summits, and motorsports rallies.',
    areas: ['RS Puram', 'Gandhipuram', 'Peelamedu', 'Avinashi Road'],
    popularVenues: ['CODISSIA Trade Fair Complex', 'Kari Motor Speedway'],
  },
  goa: {
    slug: 'goa',
    name: 'Goa',
    state: 'Goa',
    stateSlug: 'goa',
    tier: 2,
    priority: true,
    lat: 15.2993,
    lng: 74.124,
    description:
      'India’s sunshine state and party destination, internationally famous for Sunburn Festival, International Film Festival of India (IFFI), beach weddings, and electronic music concerts.',
    areas: ['Panaji', 'Candolim', 'Vagator', 'Calangute', 'Bambolim', 'Margao'],
    popularVenues: ['Dr. Shyama Prasad Mukherjee Stadium', 'Vagator Hilltop Arena', 'Kala Academy, Panaji'],
  },
  bharuch: {
    slug: 'bharuch',
    name: 'Bharuch',
    state: 'Gujarat',
    stateSlug: 'gujarat',
    tier: 2,
    priority: true,
    lat: 21.7051,
    lng: 72.9959,
    description:
      'Ancient port city and chemical-industrial nerve centre on the Narmada River in Gujarat, hosting trade summits, industrial exhibitions, and corporate conclaves.',
    areas: ['Zadeshwar Road', 'Link Road', 'Station Road', 'Dahej Industrial Corridor', 'Ankleshwar GIDC'],
    popularVenues: ['Pandit Omkarnath Natyagruh', 'Matariya Talav Cultural Amphitheatre', 'BAPS Sanskrutik Hall'],
    faqs: [
      {
        q: 'What events are happening in Bharuch?',
        a: 'Bharuch hosts industrial engineering expos, chemical & manufacturing summits in the Dahej/Ankleshwar belt, cultural festival nights, and corporate conferences.',
      },
      {
        q: 'Where can I find upcoming events in Bharuch?',
        a: 'Discover verified events in Bharuch and Ankleshwar on Evencify with venue details, ticket information, and crew staffing positions.',
      },
    ],
  },
  bhavnagar: {
    slug: 'bhavnagar',
    name: 'Bhavnagar',
    state: 'Gujarat',
    stateSlug: 'gujarat',
    tier: 2,
    priority: true,
    lat: 21.7645,
    lng: 72.1519,
    description:
      'Cultural and maritime capital of Saurashtra, Gujarat, celebrated for theatrical arts, industrial trade meets, and vibrant coastal cultural festivals.',
    areas: ['Waghawadi Road', 'Kaliabid', 'Ghogha Circle', 'Takhteshwar', 'Subhashnagar'],
    popularVenues: ['Yashwantrai Natyagruh', 'Nilambag Palace Banquets', 'MKBU University Convention Ground'],
    faqs: [
      {
        q: 'What events take place in Bhavnagar?',
        a: 'Bhavnagar hosts trade fairs, Gujarati theatrical plays at Yashwantrai Natyagruh, academic summits, and large-scale Navratri mahotsavs.',
      },
    ],
  },
  jamnagar: {
    slug: 'jamnagar',
    name: 'Jamnagar',
    state: 'Gujarat',
    stateSlug: 'gujarat',
    tier: 2,
    priority: true,
    lat: 22.4707,
    lng: 70.0577,
    description:
      'The Jewel of Kathiawar and industrial petroleum capital in Gujarat, renowned for brass manufacturing expos, grand destination celebrations, and Ayurveda summits.',
    areas: ['Bedeshwar', 'Patel Colony', 'Digjam Plot', 'Panchvati', 'Khambhalia Road'],
    popularVenues: ['Town Hall Jamnagar', 'Oshwal Centre', 'Reliance Greens Convention Arena'],
    faqs: [
      {
        q: 'What kind of events are hosted in Jamnagar?',
        a: 'Jamnagar hosts international industrial summits, brass & engineering trade fairs, destination weddings, and cultural folk celebrations.',
      },
    ],
  },
  anand: {
    slug: 'anand',
    name: 'Anand',
    state: 'Gujarat',
    stateSlug: 'gujarat',
    tier: 2,
    priority: true,
    lat: 22.5645,
    lng: 72.9289,
    description:
      'The Milk Capital of India and leading educational hub in Gujarat, hosting international dairy & agri-tech summits, collegiate youth festivals, and academic conferences.',
    areas: ['Vidyanagar Road', 'Amul Dairy Road', 'Vallabh Vidyanagar', 'Bakrol', 'Bhaikaka Marg'],
    popularVenues: ['Shastri Maidan', 'Amul Diamond Jubilee Hall', 'Bhaikaka Hall, VV Nagar'],
    faqs: [
      {
        q: 'What events happen in Anand & Vallabh Vidyanagar?',
        a: 'Anand hosts agri-business conferences, collegiate fests and hackathons across Vallabh Vidyanagar campuses, and dairy technology expositions.',
      },
    ],
  },
  navsari: {
    slug: 'navsari',
    name: 'Navsari',
    state: 'Gujarat',
    stateSlug: 'gujarat',
    tier: 2,
    priority: true,
    lat: 20.9467,
    lng: 72.9520,
    description:
      'Historic Twin City of Surat in South Gujarat, known for diamond polishing, heritage Parsi culture, agricultural festivals, and arts conclaves.',
    areas: ['Lunsikui', 'Station Road', 'Chhapra Road', 'Vijalpore', 'Dandi Road'],
    popularVenues: ['Tata Memorial Hall', 'Sayaji Vaibhav Library Grounds', 'Navsari Club & Banquets'],
    faqs: [
      {
        q: 'What events are organized in Navsari?',
        a: 'Navsari hosts cultural festivals, horticulture expos, youth talent meets, and diamond industry gatherings in South Gujarat.',
      },
    ],
  },
  vapi: {
    slug: 'vapi',
    name: 'Vapi',
    state: 'Gujarat',
    stateSlug: 'gujarat',
    tier: 2,
    priority: true,
    lat: 20.3893,
    lng: 72.9106,
    description:
      'Major industrial and commercial powerhouse in South Gujarat, hosting national manufacturing expos, chemical conclaves, and high-footfall business fairs.',
    areas: ['Chala', 'GIDC', 'Gunjan', 'Daman Road', 'Koparli Road'],
    popularVenues: ['VIA Convention Center', 'Morarji Desai Auditorium', 'Fortune Park Galaxy Banquets'],
    faqs: [
      {
        q: 'What business and cultural events take place in Vapi?',
        a: 'Vapi hosts the VIA Industrial Expo, chemical & paper manufacturing conferences, corporate seminars, and grand festival celebrations.',
      },
    ],
  },
  valsad: {
    slug: 'valsad',
    name: 'Valsad',
    state: 'Gujarat',
    stateSlug: 'gujarat',
    tier: 2,
    priority: true,
    lat: 20.5992,
    lng: 72.9342,
    description:
      'Picturesque coastal district in South Gujarat celebrated for Tithal beach festivals, mango trade expos, destination weddings, and cultural celebrations.',
    areas: ['Tithal Road', 'Dharampur Road', 'Koliwad', 'Mograwadi', 'Abrama'],
    popularVenues: ['Tithal Beach Promenade Arena', 'Valsad District Sports Complex', 'Avabai High School Grounds'],
    faqs: [
      {
        q: 'What events happen in Valsad?',
        a: 'Valsad hosts annual Tithal Beach Festival gatherings, coastal sports tournaments, music concerts, and agro-business exhibitions.',
      },
    ],
  },
  mehsana: {
    slug: 'mehsana',
    name: 'Mehsana',
    state: 'Gujarat',
    stateSlug: 'gujarat',
    tier: 2,
    priority: true,
    lat: 23.5880,
    lng: 72.3693,
    description:
      'North Gujarat’s commercial and cultural epicentre, famous for Modhera Sun Temple dance festivals, oil & gas industrial meets, and dairy expositions.',
    areas: ['Radhanpur Road', 'Modhera Road', 'Nagalpur', 'Panchot', 'Highway Road'],
    popularVenues: ['Town Hall Mehsana', 'Modhera Cultural Arena', 'Shanku Resort Grounds'],
    faqs: [
      {
        q: 'What events are organized in Mehsana?',
        a: 'Mehsana hosts the historic Uttarardh Mahotsav classical dance festival at Modhera Sun Temple, dairy farming exhibitions, and trade expos.',
      },
    ],
  },
  morbi: {
    slug: 'morbi',
    name: 'Morbi',
    state: 'Gujarat',
    stateSlug: 'gujarat',
    tier: 2,
    priority: true,
    lat: 22.8173,
    lng: 70.8377,
    description:
      'Ceramic Capital of the World located in Gujarat, hosting international ceramic expos, tile machinery summits, clock & export conferences.',
    areas: ['Sanala Road', 'Lakhdhirpur Road', 'Kandla Highway', 'Trajpar', 'Navlakhi Road'],
    popularVenues: ['Ceramic Association Exhibition Centre', 'Morbi Royal Palace Grounds', 'Town Hall Morbi'],
    faqs: [
      {
        q: 'What international events happen in Morbi?',
        a: 'Morbi hosts the mega Vibrant Ceramics Expo, global buyer-seller meets, and tile manufacturing symposiums with international delegates.',
      },
    ],
  },
  junagadh: {
    slug: 'junagadh',
    name: 'Junagadh',
    state: 'Gujarat',
    stateSlug: 'gujarat',
    tier: 2,
    priority: true,
    lat: 21.5222,
    lng: 70.4579,
    description:
      'Historic city at the foothills of Mount Girnar in Gujarat, world-renowned for the sacred Bhavnath Fair, Girnar mountaineering competitions, and heritage arts festivals.',
    areas: ['Zanzarda Road', 'Motibaug', 'Kalwa Chowk', 'Talav Gate', 'Bhavnath Taleti'],
    popularVenues: ['Bhavnath Fair Grounds', 'Girnar Convention Hall', 'Shamaldas Gandhi Town Hall'],
    faqs: [
      {
        q: 'What major festivals and events happen in Junagadh?',
        a: 'Junagadh hosts the Maha Shivratri Bhavnath Fair, Girnar Parikrama, state mountaineering competitions, and Saurashtra folk heritage meets.',
      },
    ],
  },
  bhuj: {
    slug: 'bhuj',
    name: 'Bhuj',
    state: 'Gujarat',
    stateSlug: 'gujarat',
    tier: 2,
    priority: true,
    lat: 23.2420,
    lng: 69.6669,
    description:
      'Gateway to the Great Rann of Kutch in Gujarat, world-famous for Rann Utsav cultural carnivals, handicraft exhibitions, and international desert tourism summits.',
    areas: ['Mirzapar Highway', 'Mundra Road', 'Hospital Road', 'Jubilee Ground', 'Madhapar'],
    popularVenues: ['Rann Utsav Gateway Grounds', 'Kutch Cultural Hall', 'Town Hall Bhuj'],
    faqs: [
      {
        q: 'What world-class events are held in Bhuj & Kutch?',
        a: 'Bhuj is the epicenter of the 4-month international Rann Utsav festival, Kutch handicrafts expos, white desert music concerts, and kite flying championships.',
      },
    ],
  },
  somnath: {
    slug: 'somnath',
    name: 'Somnath',
    state: 'Gujarat',
    stateSlug: 'gujarat',
    tier: 2,
    priority: true,
    lat: 20.8880,
    lng: 70.4013,
    description:
      'Sacred pilgrimage and coastal heritage hub in Gujarat, hosting divine temple light-and-sound spectacles, classical music festivals, and maritime conclaves.',
    areas: ['Veraval Bypass', 'Prabhas Patan', 'Somnath Beach Road', 'Rajendra Bhuvan Road'],
    popularVenues: ['Somnath Trust Auditorium', 'Prabhas Patan Cultural Grounds', 'Veraval Town Hall'],
    faqs: [
      {
        q: 'What events take place in Somnath & Veraval?',
        a: 'Somnath hosts Kartik Purnima fair celebrations, coastal cultural concerts, maritime fisheries summits in Veraval, and classical spiritual arts recitals.',
      },
    ],
  },
};

// ----------------------------------------------------
// Indian States Database (All 28 States & UTs)
// ----------------------------------------------------
export const STATES_DATABASE: Record<string, StateData> = {
  gujarat: {
    slug: 'gujarat',
    name: 'Gujarat',
    capital: 'Gandhinagar',
    description:
      'Gujarat is India’s industrial powerhouse on the western coast, famed for Vibrant Gujarat global summits, colossal Navratri celebrations, international diamond trade exhibitions, and opulent cultural festivals.',
    priorityCities: [
      'Surat',
      'Ahmedabad',
      'Vadodara',
      'Rajkot',
      'Gandhinagar',
      'Bharuch',
      'Bhavnagar',
      'Jamnagar',
      'Anand',
      'Navsari',
      'Vapi',
      'Valsad',
      'Mehsana',
      'Morbi',
      'Junagadh',
      'Bhuj',
      'Somnath',
    ],
  },
  maharashtra: {
    slug: 'maharashtra',
    name: 'Maharashtra',
    capital: 'Mumbai',
    description:
      'Home to India’s financial and entertainment capitals, Maharashtra hosts premier international arena concerts, film galas, global business conclaves, and tech summits in Mumbai and Pune.',
    priorityCities: ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Thane', 'Navi Mumbai', 'Aurangabad (Chhatrapati Sambhajinagar)'],
  },
  karnataka: {
    slug: 'karnataka',
    name: 'Karnataka',
    capital: 'Bengaluru',
    description:
      'The technology and biotechnology engine of India, Karnataka is celebrated for Bengaluru’s vibrant tech conference ecosystem, indie music culture, and heritage Mysuru Dasara festivals.',
    priorityCities: ['Bengaluru', 'Mysuru', 'Mangalore', 'Hubballi-Dharwad', 'Belagavi'],
  },
  'delhi-ncr': {
    slug: 'delhi',
    name: 'Delhi',
    capital: 'New Delhi',
    description:
      'The National Capital Region, hosting state-of-the-art international exhibitions at Bharat Mandapam and Yashobhoomi, diplomatic forums, world music festivals, and national conventions.',
    priorityCities: ['Delhi', 'Noida', 'Gurugram', 'Ghaziabad', 'Faridabad'],
  },
  rajasthan: {
    slug: 'rajasthan',
    name: 'Rajasthan',
    capital: 'Jaipur',
    description:
      'The royal state of palaces, havelis, and forts, acclaimed globally for fairy-tale destination weddings, the Jaipur Literature Festival, desert carnivals, and handicraft expos.',
    priorityCities: ['Jaipur', 'Udaipur', 'Jodhpur', 'Kota', 'Bikaner', 'Ajmer'],
  },
  'tamil-nadu': {
    slug: 'tamil-nadu',
    name: 'Tamil Nadu',
    capital: 'Chennai',
    description:
      'Renowned for the Margazhi Carnatic music season, international automotive trade expos, healthcare summits, and heritage temple festivals.',
    priorityCities: ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem'],
  },
  telangana: {
    slug: 'telangana',
    name: 'Telangana',
    capital: 'Hyderabad',
    description:
      'A powerhouse of pharmaceutical, life sciences, and information technology summits, hosting global investor meets at HICC and HITEX.',
    priorityCities: ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar'],
  },
  'west-bengal': {
    slug: 'west-bengal',
    name: 'West Bengal',
    capital: 'Kolkata',
    description:
      'The cultural epicenter of Eastern India, famed for the UNESCO-recognized Durga Puja festival, Kolkata International Book Fair, and artistic conferences.',
    priorityCities: ['Kolkata', 'Howrah', 'Siliguri', 'Durgapur', 'Asansol'],
  },
  'uttar-pradesh': {
    slug: 'uttar-pradesh',
    name: 'Uttar Pradesh',
    capital: 'Lucknow',
    description:
      'India’s most populous state, hosting the Kumbh Mela, international trade shows at India Expo Centre (Noida), cultural fests in Lucknow, and heritage events in Varanasi and Agra.',
    priorityCities: ['Lucknow', 'Noida', 'Kanpur', 'Agra', 'Varanasi', 'Prayagraj', 'Meerut'],
  },
  'madhya-pradesh': {
    slug: 'madhya-pradesh',
    name: 'Madhya Pradesh',
    capital: 'Bhopal',
    description:
      'The Heart of India, hosting clean city summits and industrial expos in Indore, cultural heritage festivals in Khajuraho and Gwalior, and lakefront meets in Bhopal.',
    priorityCities: ['Indore', 'Bhopal', 'Gwalior', 'Jabalpur', 'Ujjain'],
  },
  kerala: {
    slug: 'kerala',
    name: 'Kerala',
    capital: 'Thiruvananthapuram',
    description:
      'God’s Own Country, hosting the Kochi-Muziris Biennale, coastal destination weddings, Ayurveda and tourism summits, and traditional Thrissur Pooram festivals.',
    priorityCities: ['Kochi', 'Thiruvananthapuram', 'Kozhikode', 'Thrissur'],
  },
  punjab: {
    slug: 'punjab',
    name: 'Punjab',
    capital: 'Chandigarh',
    description:
      'The land of five rivers, hosting Punjabi live concerts, agricultural machinery summits, culinary fests, and cultural celebrations in Chandigarh, Amritsar, and Ludhiana.',
    priorityCities: ['Chandigarh', 'Amritsar', 'Ludhiana', 'Jalandhar', 'Patiala'],
  },
  haryana: {
    slug: 'haryana',
    name: 'Haryana',
    capital: 'Chandigarh',
    description:
      'Leading hub for corporate conventions in Gurugram, agricultural fairs, and international crafts expos like Surajkund Mela.',
    priorityCities: ['Gurugram', 'Faridabad', 'Panipat', 'Ambala', 'Karnal'],
  },
  goa: {
    slug: 'goa',
    name: 'Goa',
    capital: 'Panaji',
    description:
      'India’s premier beach and entertainment state, home to international music festivals, coastal destination weddings, and film conventions.',
    priorityCities: ['Panaji', 'Margao', 'Vasco da Gama', 'Mapusa'],
  },
};

// ----------------------------------------------------
// Event Categories Database
// ----------------------------------------------------
export const CATEGORIES_DATABASE: Record<string, CategoryData> = {
  concerts: {
    slug: 'concerts',
    name: 'Concerts',
    iconName: 'Music',
    headline: 'Live Music Concerts & Gigs Across India',
    description:
      'Experience electrifying live music concerts, arena tours, Bollywood musical nights, EDM festivals, classical recitals, and underground gigs across top venues in India.',
    keywords: ['concerts near me', 'upcoming concerts in India', 'live music concerts', 'music festivals', 'concert tickets'],
    relatedCategorySlugs: ['festivals', 'entertainment', 'cultural'],
  },
  workshops: {
    slug: 'workshops',
    name: 'Workshops',
    iconName: 'BookOpen',
    headline: 'Interactive Workshops & Masterclasses',
    description:
      'Learn high-demand creative, technical, and business skills with hands-on masterclasses, bootcamps, culinary workshops, pottery classes, and professional training sessions.',
    keywords: ['workshops near me', 'upcoming workshops in India', 'creative workshops', 'masterclasses', 'skill bootcamps'],
    relatedCategorySlugs: ['conferences', 'education', 'technology'],
  },
  conferences: {
    slug: 'conferences',
    name: 'Conferences',
    iconName: 'Users',
    headline: 'Professional Summits, Seminars & Conferences',
    description:
      'Connect with industry leaders, founders, researchers, and global experts at top-tier business summits, medical symposiums, technology conclaves, and academic conferences.',
    keywords: ['conferences near me', 'business conferences in India', 'tech summits', 'annual symposium', 'industry conclave'],
    relatedCategorySlugs: ['business', 'technology', 'networking'],
  },
  exhibitions: {
    slug: 'exhibitions',
    name: 'Exhibitions',
    iconName: 'Layers',
    headline: 'Trade Shows, Expos & Consumer Exhibitions',
    description:
      'Explore premier jewellery expos, diamond trade fairs, textile expos, art galleries, auto expos, and international B2B trade conventions.',
    keywords: ['exhibitions near me', 'trade fairs in India', 'jewellery expo Surat', 'consumer exhibitions', 'art exhibits'],
    relatedCategorySlugs: ['business', 'corporate', 'festivals'],
  },
  festivals: {
    slug: 'festivals',
    name: 'Festivals',
    iconName: 'Sparkles',
    headline: 'Cultural, Music & Food Festivals',
    description:
      'Immerse in joyful celebrations, Navratri Dandiya raas, lit fests, food carnivals, indie music fests, and multi-day celebrations throughout India.',
    keywords: ['festivals near me', 'upcoming festivals India', 'cultural festivals', 'food festivals', 'music fests'],
    relatedCategorySlugs: ['concerts', 'cultural', 'entertainment'],
  },
  business: {
    slug: 'business',
    name: 'Business',
    iconName: 'Briefcase',
    headline: 'Business Summits, Investor Meets & Trade Expos',
    description:
      'Accelerate your enterprise with investor pitch days, MSME summits, franchise expos, industry leadership forums, and trade showcases.',
    keywords: ['business events near me', 'investor summits India', 'MSME expo', 'startup demo days', 'commercial trade meets'],
    relatedCategorySlugs: ['conferences', 'networking', 'corporate'],
  },
  networking: {
    slug: 'networking',
    name: 'Networking',
    iconName: 'Share2',
    headline: 'Professional Networking Mixers & Founder Meetups',
    description:
      'Build meaningful connections with founders, creative professionals, angel investors, executives, and event industry peers at curated mixers and roundtable meetups.',
    keywords: ['networking events near me', 'founder mixers', 'professional networking India', 'business meetups', 'speed networking'],
    relatedCategorySlugs: ['business', 'conferences', 'technology'],
  },
  corporate: {
    slug: 'corporate',
    name: 'Corporate',
    iconName: 'Building2',
    headline: 'Corporate Offsites, Gala Dinners & Annual Meets',
    description:
      'World-class corporate conventions, awards nights, employee offsites, shareholder meetings, and brand launch galas executed with verified professional crew.',
    keywords: ['corporate events near me', 'annual awards night', 'corporate offsite', 'brand launch galas', 'company meets'],
    relatedCategorySlugs: ['business', 'conferences', 'exhibitions'],
  },
  sports: {
    slug: 'sports',
    name: 'Sports',
    iconName: 'Trophy',
    headline: 'Marathons, Sports Leagues & Tournaments',
    description:
      'Cheer for your team or participate in city marathons, cricket leagues, badminton championships, football tournaments, and fitness challenges.',
    keywords: ['sports events near me', 'city marathons India', 'cricket tournaments', 'fitness championships', 'live sports matches'],
    relatedCategorySlugs: ['entertainment', 'festivals'],
  },
  technology: {
    slug: 'technology',
    name: 'Technology',
    iconName: 'Cpu',
    headline: 'Tech Conclaves, AI Summits & Hackathons',
    description:
      'Dive into cutting-edge artificial intelligence conventions, Web3 summits, developer hackathons, robotics expos, and cloud architecture meetups.',
    keywords: ['tech events near me', 'AI conferences India', 'developer hackathons', 'cloud summits', 'robotics expos'],
    relatedCategorySlugs: ['conferences', 'workshops', 'business'],
  },
  entertainment: {
    slug: 'entertainment',
    name: 'Entertainment',
    iconName: 'Film',
    headline: 'Standup Comedy, Theatre & Entertainment Shows',
    description:
      'Laugh out loud with top stand-up comedians, dramatic theatre performances, magic shows, screening festivals, and entertainment galas.',
    keywords: ['comedy shows near me', 'standup comedy India', 'theatre plays', 'entertainment shows', 'live gigs'],
    relatedCategorySlugs: ['concerts', 'festivals'],
  },
  cultural: {
    slug: 'cultural',
    name: 'Cultural',
    iconName: 'Palette',
    headline: 'Cultural Gatherings, Folk Arts & Heritage Fests',
    description:
      'Experience India’s rich heritage with traditional folk performances, classical dance recitals, craft carnivals, and historic festivals.',
    keywords: ['cultural events near me', 'heritage festivals', 'classical dance recitals', 'folk music nights', 'traditional events'],
    relatedCategorySlugs: ['festivals', 'entertainment'],
  },
  college: {
    slug: 'college',
    name: 'College',
    iconName: 'GraduationCap',
    headline: 'College Festivals, Techfests & Campus Carnivals',
    description:
      'The most vibrant university fest guides featuring rock band battles, collegiate dance face-offs, esports tournaments, and campus celebrations.',
    keywords: ['college festivals near me', 'campus techfests India', 'cultural college fests', 'university carnivals', 'student hackathons'],
    relatedCategorySlugs: ['festivals', 'technology', 'sports'],
  },
  startup: {
    slug: 'startup',
    name: 'Startup',
    iconName: 'Sparkles',
    headline: 'Startup Pitch Days, Founder Mixers & Investor Demo Days',
    description:
      'Connect with venture capitalists, angel networks, incubators, and fellow founders at premier startup events, accelerator demo days, and pitch battles.',
    keywords: ['startup events near me', 'pitch competitions India', 'investor demo day', 'founder meetups', 'venture capital events'],
    relatedCategorySlugs: ['business', 'networking', 'technology'],
  },
};

// ----------------------------------------------------
// Canonical Category Aliases
// ----------------------------------------------------
export const CATEGORY_ALIASES: Record<string, string> = {
  'business-events': 'business',
  'networking-events': 'networking',
  'technology-events': 'technology',
  'tech-events': 'technology',
  tech: 'technology',
  'startup-events': 'startup',
  startups: 'startup',
  'college-events': 'college',
  'campus-events': 'college',
  concert: 'concerts',
  music: 'concerts',
  workshop: 'workshops',
  conference: 'conferences',
  festival: 'festivals',
  exhibition: 'exhibitions',
  expo: 'exhibitions',
  expos: 'exhibitions',
};

export function normalizeCategorySlug(rawSlug: string): string {
  const cleaned = slugify(rawSlug);
  return CATEGORY_ALIASES[cleaned] || cleaned;
}

// ----------------------------------------------------
// Slug Generation and Normalization Utilities
// ----------------------------------------------------
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-') // Replace spaces and underscores with -
    .replace(/[^\w-]+/g, '') // Remove non-word chars
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+|-+$/g, ''); // Trim leading/trailing -
}

export function getEventSlug(event: EventItem): string {
  return slugify(event.name);
}

export function getEventCanonicalUrl(event: EventItem): string {
  const citySlug = slugify(event.city || 'india');
  const eventSlug = getEventSlug(event);
  return `https://evencify.com/events/${citySlug}/${eventSlug}`;
}

export function normalizeCitySlug(rawSlug: string): string {
  const cleaned = slugify(rawSlug);
  return CITY_ALIASES[cleaned] || cleaned;
}

// ----------------------------------------------------
// SEO Metadata & Schema Generator Interface
// ----------------------------------------------------
export interface SEOOutput {
  title: string;
  description: string;
  canonicalUrl: string;
  robots: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogType: string;
  twitterCard: 'summary' | 'summary_large_image';
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  h1: string;
  structuredData: Record<string, unknown>[];
  breadcrumbItems: { name: string; url: string }[];
  keywords?: string;
}

// ----------------------------------------------------
// Centralized Dynamic SEO Generator
// ----------------------------------------------------
export function getSEOData(params: {
  type:
    | 'homepage'
    | 'all-events'
    | 'near-me'
    | 'date'
    | 'city'
    | 'state'
    | 'category'
    | 'city-category'
    | 'state-category'
    | 'event'
    | 'organiser'
    | 'crew-jobs'
    | 'organiser-solution'
    | 'organise-event'
    | 'about'
    | 'contact'
    | 'privacy'
    | 'terms'
    | 'faq'
    | 'sitemap'
    | 'robots'
    | 'not-found';
  city?: CityData;
  state?: StateData;
  category?: CategoryData;
  dateKey?: string; // 'today' | 'tomorrow' | 'this-weekend' | 'this-week' | 'this-month' | 'upcoming'
  event?: EventItem;
  organiser?: OrganiserProfile;
  eventCount?: number;
  openRolesCount?: number;
}): SEOOutput {
  const fallbackImage = 'https://evencify.com/hero-banner.png';
  const logoImage = 'https://evencify.com/evencify.logo.png';

  switch (params.type) {
    case 'homepage': {
      const title = 'Evencify | #1 Events in Surat & Gujarat – Hire Verified Event Crew';
      const description =
        'Discover upcoming events in Surat & Gujarat or hire verified event crew in 60s. Find concerts, weddings, corporate expos & high-paying crew shifts with Evencify.';
      const canonicalUrl = 'https://evencify.com';
      const h1 = 'Events in Surat & Gujarat | Hire Verified Event Crew';

      const organizationSchema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Evencify',
        url: 'https://evencify.com',
        logo: logoImage,
        description: 'India’s event workforce operating system connecting verified event crew and event organisers.',
        sameAs: ['https://twitter.com/evencify', 'https://www.linkedin.com/company/evencify', 'https://instagram.com/evencify'],
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'Customer Support',
          email: 'support@evencify.com',
          telephone: '+91-98251-10022',
          areaServed: 'IN',
          availableLanguage: ['English', 'Hindi', 'Gujarati'],
        },
        address: {
          '@type': 'PostalAddress',
          streetAddress: '601, World Trade Center, Ring Road',
          addressLocality: 'Surat',
          addressRegion: 'Gujarat',
          postalCode: '395002',
          addressCountry: 'IN',
        },
        knowsAbout: [
          'Event Management',
          'Event Staffing',
          'Event Crew Hiring',
          'Concerts',
          'Conferences',
          'Exhibitions',
          'Surat Events',
          'Gujarat Events',
        ],
      };

      const localBusinessSchema = {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        '@id': 'https://evencify.com/#localbusiness',
        name: 'Evencify - Events & Crew Hiring Platform',
        image: fallbackImage,
        telephone: '+91-98251-10022',
        email: 'support@evencify.com',
        url: 'https://evencify.com',
        priceRange: '₹₹',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '601, World Trade Center, Ring Road',
          addressLocality: 'Surat',
          addressRegion: 'Gujarat',
          postalCode: '395002',
          addressCountry: 'IN',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 21.1702,
          longitude: 72.8311,
        },
      };

      const webApplicationSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'Evencify',
        url: 'https://evencify.com',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'All',
        description: 'India’s event workforce operating system connecting verified event crew and event organisers.',
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          reviewCount: '248',
          bestRating: '5',
          worstRating: '1',
        },
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'INR',
        },
      };

      const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What is Evencify?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Evencify is India’s event workforce operating system connecting event organisers with verified event crew. Organisers can build teams, publish shifts, and manage their workforce, while crew can discover and apply for high-paying event shifts.',
            },
          },
          {
            '@type': 'Question',
            name: 'How do I find upcoming events in Surat and Gujarat?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'You can discover upcoming concerts, exhibitions, workshops, and festivals in Surat across Vesu, Adajan, Dumas Road, and City Light directly on Evencify with live schedules, venue details, and ticketing.',
            },
          },
          {
            '@type': 'Question',
            name: 'How can organisers hire verified event crew in Surat?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Event organisers can publish crew requirements in 60 seconds and hire background-verified hospitality staff, registration desk coordinators, bouncers/security, and stage crew with same-day escrow settlements.',
            },
          },
          {
            '@type': 'Question',
            name: 'What event roles can crew members apply for on Evencify?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Crew members can apply for roles including Registration Desk, Hospitality Staff, Bouncers / Security, Sound & Light Technicians, Stage Coordinators, Ushers, Promoters, and VIP Liaisons.',
            },
          },
        ],
      };

      const webSiteSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Evencify',
        url: 'https://evencify.com',
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://evencify.com/events?search={search_term_string}',
          'query-input': 'required name=search_term_string',
        },
      };

      return {
        title,
        description,
        canonicalUrl,
        robots: 'index, follow',
        ogTitle: title,
        ogDescription: description,
        ogImage: fallbackImage,
        ogType: 'website',
        twitterCard: 'summary_large_image',
        twitterTitle: title,
        twitterDescription: description,
        twitterImage: fallbackImage,
        h1,
        structuredData: [organizationSchema, localBusinessSchema, webApplicationSchema, faqSchema, webSiteSchema],
        breadcrumbItems: [{ name: 'Home', url: 'https://evencify.com' }],
      };
    }

    case 'all-events': {
      const title = 'Upcoming Events 2026 in Surat & India | Concerts, Expos | Evencify';
      const description =
        'Explore verified upcoming events in Surat, Gujarat & across India. Real-time schedules, venues, booking links, and on-demand event crew hiring on Evencify.';
      const canonicalUrl = 'https://evencify.com/events';
      const h1 = 'Upcoming Events in India';

      const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://evencify.com' },
          { '@type': 'ListItem', position: 2, name: 'Events', item: canonicalUrl },
        ],
      };

      return {
        title,
        description,
        canonicalUrl,
        robots: 'index, follow',
        ogTitle: title,
        ogDescription: description,
        ogImage: fallbackImage,
        ogType: 'website',
        twitterCard: 'summary_large_image',
        twitterTitle: title,
        twitterDescription: description,
        twitterImage: fallbackImage,
        h1,
        structuredData: [breadcrumbSchema],
        breadcrumbItems: [
          { name: 'Home', url: 'https://evencify.com' },
          { name: 'Events', url: canonicalUrl },
        ],
      };
    }

    case 'near-me': {
      const title = 'Events Near Me | Upcoming Live Events & Things to Do | Evencify';
      const description =
        'Find upcoming events happening near you today and this weekend. Discover live concerts, workshops, food festivals, trade exhibitions, and sports meets nearby.';
      const canonicalUrl = 'https://evencify.com/events/near-me';
      const h1 = 'Events Happening Near You';

      const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://evencify.com' },
          { '@type': 'ListItem', position: 2, name: 'Events', item: 'https://evencify.com/events' },
          { '@type': 'ListItem', position: 3, name: 'Near Me', item: canonicalUrl },
        ],
      };

      return {
        title,
        description,
        canonicalUrl,
        robots: 'index, follow',
        ogTitle: title,
        ogDescription: description,
        ogImage: fallbackImage,
        ogType: 'website',
        twitterCard: 'summary_large_image',
        twitterTitle: title,
        twitterDescription: description,
        twitterImage: fallbackImage,
        h1,
        structuredData: [breadcrumbSchema],
        breadcrumbItems: [
          { name: 'Home', url: 'https://evencify.com' },
          { name: 'Events', url: 'https://evencify.com/events' },
          { name: 'Near Me', url: canonicalUrl },
        ],
      };
    }

    case 'date': {
      const dateKey = params.dateKey || 'upcoming';
      const dateLabels: Record<string, { label: string; h1: string }> = {
        today: { label: 'Events Today in India', h1: 'Events Happening Today in India' },
        tomorrow: { label: 'Events Tomorrow in India', h1: 'Upcoming Events Tomorrow in India' },
        'this-weekend': { label: 'Events This Weekend in India', h1: 'Events Happening This Weekend in India' },
        'this-week': { label: 'Events This Week in India', h1: 'Upcoming Events This Week in India' },
        'this-month': { label: 'Events This Month in India', h1: 'Upcoming Events This Month in India' },
        upcoming: { label: 'Upcoming Events in India', h1: 'Upcoming Events Across India' },
      };
      const info = dateLabels[dateKey] || dateLabels.upcoming;
      const title = `${info.label} | Live Music, Shows & Fests | Evencify`;
      const description = `Discover verified events happening ${dateKey.replace('-', ' ')} across India. Find concerts, theatre, tech expos, workshops, and nightlife near you on Evencify.`;
      const canonicalUrl = `https://evencify.com/events/${dateKey}`;

      return {
        title,
        description,
        canonicalUrl,
        robots: 'index, follow',
        ogTitle: title,
        ogDescription: description,
        ogImage: fallbackImage,
        ogType: 'website',
        twitterCard: 'summary_large_image',
        twitterTitle: title,
        twitterDescription: description,
        twitterImage: fallbackImage,
        h1: info.h1,
        structuredData: [
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://evencify.com' },
              { '@type': 'ListItem', position: 2, name: 'Events', item: 'https://evencify.com/events' },
              { '@type': 'ListItem', position: 3, name: info.label, item: canonicalUrl },
            ],
          },
        ],
        breadcrumbItems: [
          { name: 'Home', url: 'https://evencify.com' },
          { name: 'Events', url: 'https://evencify.com/events' },
          { name: info.label, url: canonicalUrl },
        ],
      };
    }

    case 'city': {
      const city = params.city || CITIES_DATABASE.surat;
      const isSurat = city.slug === 'surat';
      const isGujaratCity = city.stateSlug === 'gujarat';
      const title = isSurat
        ? 'Events in Surat 2026 | Upcoming Events, Concerts & Expos | Evencify'
        : `Events in ${city.name} 2026 | Upcoming Events & Shows | Evencify`;
      const description = isSurat
        ? 'Discover upcoming events in Surat 2026 with Evencify. Explore concerts, luxury weddings, diamond & textile expos at SIECC, and hire background-verified crew.'
        : `Discover upcoming events in ${city.name}, ${city.state} with Evencify. Find concerts, workshops, conferences, festivals, exhibitions, business events and more.`;
      const canonicalUrl = `https://evencify.com/events/${city.slug}`;
      const h1 = isSurat ? 'Events in Surat 2026' : `Upcoming Events in ${city.name}`;

      const breadcrumbItems = isGujaratCity
        ? [
            { name: 'Home', url: 'https://evencify.com' },
            { name: 'Events', url: 'https://evencify.com/events' },
            { name: 'Gujarat', url: 'https://evencify.com/events/gujarat' },
            { name: city.name, url: canonicalUrl },
          ]
        : [
            { name: 'Home', url: 'https://evencify.com' },
            { name: 'Events', url: 'https://evencify.com/events' },
            { name: city.name, url: canonicalUrl },
          ];

      const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbItems.map((item, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: item.name,
          item: item.url,
        })),
      };

      const structuredData: Record<string, unknown>[] = [breadcrumbSchema];

      if (city.faqs && city.faqs.length > 0) {
        structuredData.push({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: city.faqs.map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: {
              '@type': 'Answer',
              text: f.a,
            },
          })),
        });
      }

      return {
        title,
        description,
        canonicalUrl,
        robots: 'index, follow',
        ogTitle: title,
        ogDescription: description,
        ogImage: fallbackImage,
        ogType: 'website',
        twitterCard: 'summary_large_image',
        twitterTitle: title,
        twitterDescription: description,
        twitterImage: fallbackImage,
        h1,
        structuredData,
        breadcrumbItems,
      };
    }

    case 'state': {
      const state = params.state || STATES_DATABASE.gujarat;
      const isGujarat = state.slug === 'gujarat';
      const title = isGujarat
        ? 'Events in Gujarat | Upcoming Events & Things to Do | Evencify'
        : `Events in ${state.name} | Upcoming Events Across ${state.name} | Evencify`;
      const description = isGujarat
        ? 'Discover upcoming events in Gujarat with Evencify. Find concerts, workshops, conferences, festivals, exhibitions, business events and more across Surat, Ahmedabad, Vadodara, Rajkot and more.'
        : `Discover concerts, workshops, conferences, exhibitions, festivals and business events happening across ${state.name} with verified venue and ticket information.`;
      const canonicalUrl = `https://evencify.com/events/${state.slug}`;
      const h1 = `Upcoming Events in ${state.name}`;

      const breadcrumbItems = [
        { name: 'Home', url: 'https://evencify.com' },
        { name: 'Events', url: 'https://evencify.com/events' },
        { name: state.name, url: canonicalUrl },
      ];

      const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbItems.map((item, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: item.name,
          item: item.url,
        })),
      };

      return {
        title,
        description,
        canonicalUrl,
        robots: 'index, follow',
        ogTitle: title,
        ogDescription: description,
        ogImage: fallbackImage,
        ogType: 'website',
        twitterCard: 'summary_large_image',
        twitterTitle: title,
        twitterDescription: description,
        twitterImage: fallbackImage,
        h1,
        structuredData: [breadcrumbSchema],
        breadcrumbItems: [
          { name: 'Home', url: 'https://evencify.com' },
          { name: 'Events', url: 'https://evencify.com/events' },
          { name: state.name, url: canonicalUrl },
        ],
      };
    }

    case 'category': {
      const cat = params.category || CATEGORIES_DATABASE.concerts;
      const title = `Upcoming ${cat.name} in India | Live Events & Tickets | Evencify`;
      const description = `Find upcoming ${cat.name.toLowerCase()} happening across India on Evencify. Explore dates, venue addresses, schedules, organisers, and ticket information.`;
      const canonicalUrl = `https://evencify.com/events/${cat.slug}`;
      const h1 = `Upcoming ${cat.name} in India`;

      const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://evencify.com' },
          { '@type': 'ListItem', position: 2, name: 'Events', item: 'https://evencify.com/events' },
          { '@type': 'ListItem', position: 3, name: cat.name, item: canonicalUrl },
        ],
      };

      return {
        title,
        description,
        canonicalUrl,
        robots: 'index, follow',
        ogTitle: title,
        ogDescription: description,
        ogImage: fallbackImage,
        ogType: 'website',
        twitterCard: 'summary_large_image',
        twitterTitle: title,
        twitterDescription: description,
        twitterImage: fallbackImage,
        h1,
        structuredData: [breadcrumbSchema],
        breadcrumbItems: [
          { name: 'Home', url: 'https://evencify.com' },
          { name: 'Events', url: 'https://evencify.com/events' },
          { name: cat.name, url: canonicalUrl },
        ],
      };
    }

    case 'city-category': {
      const city = params.city || CITIES_DATABASE.surat;
      const cat = params.category || CATEGORIES_DATABASE.concerts;
      const isGujaratCity = city.stateSlug === 'gujarat';
      const title = `${cat.name} Events in ${city.name} | Evencify`;
      const description = `Discover upcoming ${cat.name.toLowerCase()} in ${city.name} with Evencify. Find concerts, workshops, conferences, festivals, exhibitions, business events and more with verified venue and ticket details.`;
      const canonicalUrl = `https://evencify.com/events/${city.slug}/${cat.slug}`;
      const h1 = `${cat.name} Events in ${city.name}`;

      const breadcrumbItems = isGujaratCity
        ? [
            { name: 'Home', url: 'https://evencify.com' },
            { name: 'Events', url: 'https://evencify.com/events' },
            { name: 'Gujarat', url: 'https://evencify.com/events/gujarat' },
            { name: city.name, url: `https://evencify.com/events/${city.slug}` },
            { name: cat.name, url: canonicalUrl },
          ]
        : [
            { name: 'Home', url: 'https://evencify.com' },
            { name: 'Events', url: 'https://evencify.com/events' },
            { name: city.name, url: `https://evencify.com/events/${city.slug}` },
            { name: cat.name, url: canonicalUrl },
          ];

      const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbItems.map((item, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: item.name,
          item: item.url,
        })),
      };

      return {
        title,
        description,
        canonicalUrl,
        robots: 'index, follow',
        ogTitle: title,
        ogDescription: description,
        ogImage: fallbackImage,
        ogType: 'website',
        twitterCard: 'summary_large_image',
        twitterTitle: title,
        twitterDescription: description,
        twitterImage: fallbackImage,
        h1,
        structuredData: [breadcrumbSchema],
        breadcrumbItems,
      };
    }

    case 'state-category': {
      const state = params.state || STATES_DATABASE.gujarat;
      const cat = params.category || CATEGORIES_DATABASE.concerts;
      const title = `${cat.name} Events in ${state.name} | Evencify`;
      const description = `Discover upcoming ${cat.name.toLowerCase()} in ${state.name} with Evencify. Find concerts, workshops, conferences, festivals, exhibitions, business events and more across ${state.name}.`;
      const canonicalUrl = `https://evencify.com/events/${state.slug}/${cat.slug}`;
      const h1 = `${cat.name} Events in ${state.name}`;

      const breadcrumbItems = [
        { name: 'Home', url: 'https://evencify.com' },
        { name: 'Events', url: 'https://evencify.com/events' },
        { name: state.name, url: `https://evencify.com/events/${state.slug}` },
        { name: cat.name, url: canonicalUrl },
      ];

      const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbItems.map((item, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: item.name,
          item: item.url,
        })),
      };

      return {
        title,
        description,
        canonicalUrl,
        robots: 'index, follow',
        ogTitle: title,
        ogDescription: description,
        ogImage: fallbackImage,
        ogType: 'website',
        twitterCard: 'summary_large_image',
        twitterTitle: title,
        twitterDescription: description,
        twitterImage: fallbackImage,
        h1,
        structuredData: [breadcrumbSchema],
        breadcrumbItems,
      };
    }

    case 'event': {
      const evt = params.event;
      if (!evt) {
        return getSEOData({ type: 'not-found' });
      }

      const citySlug = slugify(evt.city || 'india');
      const eventSlug = getEventSlug(evt);
      const isGujaratCity =
        STATES_DATABASE.gujarat.priorityCities.some(
          (c) => c.toLowerCase() === (evt.city || '').toLowerCase()
        ) || evt.city?.toLowerCase() === 'surat';

      const title = `${evt.name} in ${evt.city} | Date, Venue & Details | Evencify`;
      const description = `Discover ${evt.name} in ${evt.city} on Evencify. View event details, date (${evt.date}), venue (${evt.venue}), organiser (${evt.organiserName}) and other upcoming events.`;
      const canonicalUrl = `https://evencify.com/events/${citySlug}/${eventSlug}`;
      const h1 = evt.name;

      // Event Schema (Schema.org)
      const eventSchema = {
        '@context': 'https://schema.org',
        '@type': 'Event',
        name: evt.name,
        description: `${evt.name} taking place at ${evt.venue} in ${evt.city}. Expected attendance: ${evt.expectedAttendance || 500} guests. Organised by ${evt.organiserName}.`,
        startDate: `${evt.date}T${evt.startTime || '10:00'}:00+05:30`,
        endDate: `${evt.date}T${evt.endTime || '20:00'}:00+05:30`,
        eventStatus: 'https://schema.org/EventScheduled',
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        location: {
          '@type': 'Place',
          name: evt.venue,
          address: {
            '@type': 'PostalAddress',
            streetAddress: evt.fullAddress || evt.venue,
            addressLocality: evt.city,
            addressRegion: isGujaratCity ? 'Gujarat' : 'India',
            addressCountry: 'IN',
          },
        },
        image: [fallbackImage],
        organizer: {
          '@type': 'Organization',
          name: evt.organiserName,
          url: `https://evencify.com/organiser/${slugify(evt.organiserName)}`,
        },
        offers: {
          '@type': 'Offer',
          url: canonicalUrl,
          price: '0',
          priceCurrency: 'INR',
          availability: 'https://schema.org/InStock',
          validFrom: evt.createdAt ? `${evt.createdAt}T00:00:00+05:30` : '2026-09-01T00:00:00+05:30',
        },
      };

      const breadcrumbItems = isGujaratCity
        ? [
            { name: 'Home', url: 'https://evencify.com' },
            { name: 'Events', url: 'https://evencify.com/events' },
            { name: 'Gujarat', url: 'https://evencify.com/events/gujarat' },
            { name: evt.city, url: `https://evencify.com/events/${citySlug}` },
            { name: evt.name, url: canonicalUrl },
          ]
        : [
            { name: 'Home', url: 'https://evencify.com' },
            { name: 'Events', url: 'https://evencify.com/events' },
            { name: evt.city, url: `https://evencify.com/events/${citySlug}` },
            { name: evt.name, url: canonicalUrl },
          ];

      const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbItems.map((item, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: item.name,
          item: item.url,
        })),
      };

      return {
        title,
        description,
        canonicalUrl,
        robots: 'index, follow',
        ogTitle: title,
        ogDescription: description,
        ogImage: fallbackImage,
        ogType: 'website',
        twitterCard: 'summary_large_image',
        twitterTitle: title,
        twitterDescription: description,
        twitterImage: fallbackImage,
        h1,
        structuredData: [eventSchema, breadcrumbSchema],
        breadcrumbItems,
      };
    }

    case 'organiser': {
      const org = params.organiser;
      const orgName = org?.companyName || org?.name || 'Verified Event Organiser';
      const city = org?.city || 'India';
      const title = `${orgName} | Events & Organiser Profile | Evencify`;
      const description = `Explore upcoming events and productions by ${orgName} based in ${city}. Verified event management company on Evencify.`;
      const canonicalUrl = `https://evencify.com/organiser/${slugify(orgName)}`;
      const h1 = orgName;

      return {
        title,
        description,
        canonicalUrl,
        robots: 'index, follow',
        ogTitle: title,
        ogDescription: description,
        ogImage: fallbackImage,
        ogType: 'profile',
        twitterCard: 'summary',
        twitterTitle: title,
        twitterDescription: description,
        twitterImage: fallbackImage,
        h1,
        structuredData: [
          {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: orgName,
            url: canonicalUrl,
            address: {
              '@type': 'PostalAddress',
              addressLocality: city,
              addressCountry: 'IN',
            },
          },
        ],
        breadcrumbItems: [
          { name: 'Home', url: 'https://evencify.com' },
          { name: 'Organisers', url: 'https://evencify.com/event-organisers' },
          { name: orgName, url: canonicalUrl },
        ],
      };
    }

    case 'crew-jobs': {
      const title = 'Event Crew Jobs & Staffing in India | Apply for Shifts | Evencify';
      const description =
        'Find verified event crew jobs, part-time shifts, and freelance event staff openings in Surat, Mumbai, Ahmedabad & across India. Escrow-secured same-day payouts.';
      const canonicalUrl = 'https://evencify.com/crew-jobs';
      const h1 = 'Event Crew Jobs & Staffing Opportunities';

      return {
        title,
        description,
        canonicalUrl,
        robots: 'index, follow',
        ogTitle: title,
        ogDescription: description,
        ogImage: fallbackImage,
        ogType: 'website',
        twitterCard: 'summary_large_image',
        twitterTitle: title,
        twitterDescription: description,
        twitterImage: fallbackImage,
        h1,
        structuredData: [
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://evencify.com' },
              { '@type': 'ListItem', position: 2, name: 'Crew Jobs', item: canonicalUrl },
            ],
          },
        ],
        breadcrumbItems: [
          { name: 'Home', url: 'https://evencify.com' },
          { name: 'Crew Jobs', url: canonicalUrl },
        ],
      };
    }

    case 'organiser-solution': {
      const title = 'Event Management & Staffing Platform India | Evencify';
      const description =
        'Scale your event productions with India’s leading private event workforce operating system. Hire background-verified crew, manage shifts, and secure escrow payouts.';
      const canonicalUrl = 'https://evencify.com/organise-event';
      const h1 = 'Enterprise Event Workforce & Management Platform';

      return {
        title,
        description,
        canonicalUrl,
        robots: 'index, follow',
        ogTitle: title,
        ogDescription: description,
        ogImage: fallbackImage,
        ogType: 'website',
        twitterCard: 'summary_large_image',
        twitterTitle: title,
        twitterDescription: description,
        twitterImage: fallbackImage,
        h1,
        structuredData: [
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://evencify.com' },
              { '@type': 'ListItem', position: 2, name: 'For Organisers', item: canonicalUrl },
            ],
          },
        ],
        breadcrumbItems: [
          { name: 'Home', url: 'https://evencify.com' },
          { name: 'For Organisers', url: canonicalUrl },
        ],
      };
    }

    case 'organise-event': {
      const title = 'Hire Event Crew & Organise Events Across India | Evencify';
      const description =
        'Hire background-verified event staff, ushers, promoters, security, and stage managers. Guaranteed escrow payouts and on-demand replacement in Surat and across India.';
      const canonicalUrl = 'https://evencify.com/organise-event';
      const h1 = 'Hire Verified Event Crew Across India';

      return {
        title,
        description,
        canonicalUrl,
        robots: 'index, follow',
        ogTitle: title,
        ogDescription: description,
        ogImage: fallbackImage,
        ogType: 'website',
        twitterCard: 'summary_large_image',
        twitterTitle: title,
        twitterDescription: description,
        twitterImage: fallbackImage,
        h1,
        structuredData: [],
        breadcrumbItems: [
          { name: 'Home', url: 'https://evencify.com' },
          { name: 'Organise Event', url: canonicalUrl },
        ],
      };
    }

    case 'about': {
      const title = 'About Evencify | India’s Event Discovery & Verified Crew Platform';
      const description =
        'Learn about Evencify, our mission, verified workforce network, escrow security, and how we are transforming event experiences across India.';
      const canonicalUrl = 'https://evencify.com/about';
      const h1 = 'About Evencify';

      return {
        title,
        description,
        canonicalUrl,
        robots: 'index, follow',
        ogTitle: title,
        ogDescription: description,
        ogImage: fallbackImage,
        ogType: 'website',
        twitterCard: 'summary_large_image',
        twitterTitle: title,
        twitterDescription: description,
        twitterImage: fallbackImage,
        h1,
        structuredData: [],
        breadcrumbItems: [
          { name: 'Home', url: 'https://evencify.com' },
          { name: 'About Us', url: canonicalUrl },
        ],
      };
    }

    case 'contact': {
      const title = 'Contact Evencify | Support & Corporate Partnerships';
      const description =
        'Contact the Evencify team in Surat, Gujarat. Support for event attendees, organizers, and crew members across India.';
      const canonicalUrl = 'https://evencify.com/contact';
      const h1 = 'Contact Evencify';

      return {
        title,
        description,
        canonicalUrl,
        robots: 'index, follow',
        ogTitle: title,
        ogDescription: description,
        ogImage: fallbackImage,
        ogType: 'website',
        twitterCard: 'summary_large_image',
        twitterTitle: title,
        twitterDescription: description,
        twitterImage: fallbackImage,
        h1,
        structuredData: [],
        breadcrumbItems: [
          { name: 'Home', url: 'https://evencify.com' },
          { name: 'Contact Us', url: canonicalUrl },
        ],
      };
    }

    case 'privacy': {
      const title = 'Privacy Policy | Evencify';
      const description =
        'Evencify privacy policy and data security practices for event attendees, organizers, and verified crew members.';
      const canonicalUrl = 'https://evencify.com/privacy';
      const h1 = 'Privacy Policy';

      return {
        title,
        description,
        canonicalUrl,
        robots: 'index, follow',
        ogTitle: title,
        ogDescription: description,
        ogImage: fallbackImage,
        ogType: 'website',
        twitterCard: 'summary',
        twitterTitle: title,
        twitterDescription: description,
        twitterImage: fallbackImage,
        h1,
        structuredData: [],
        breadcrumbItems: [
          { name: 'Home', url: 'https://evencify.com' },
          { name: 'Privacy Policy', url: canonicalUrl },
        ],
      };
    }

    case 'terms': {
      const title = 'Terms of Service | Evencify';
      const description =
        'Terms of service, platform agreements, escrow conditions, and code of conduct for users of Evencify.';
      const canonicalUrl = 'https://evencify.com/terms';
      const h1 = 'Terms of Service';

      return {
        title,
        description,
        canonicalUrl,
        robots: 'index, follow',
        ogTitle: title,
        ogDescription: description,
        ogImage: fallbackImage,
        ogType: 'website',
        twitterCard: 'summary',
        twitterTitle: title,
        twitterDescription: description,
        twitterImage: fallbackImage,
        h1,
        structuredData: [],
        breadcrumbItems: [
          { name: 'Home', url: 'https://evencify.com' },
          { name: 'Terms of Service', url: canonicalUrl },
        ],
      };
    }

    case 'faq': {
      const title = 'Frequently Asked Questions (FAQ) | Evencify';
      const description =
        'Answers to frequently asked questions about discovering events, hiring event crew, escrow payouts, and shift attendance on Evencify.';
      const canonicalUrl = 'https://evencify.com/faq';
      const h1 = 'Frequently Asked Questions';

      return {
        title,
        description,
        canonicalUrl,
        robots: 'index, follow',
        ogTitle: title,
        ogDescription: description,
        ogImage: fallbackImage,
        ogType: 'website',
        twitterCard: 'summary_large_image',
        twitterTitle: title,
        twitterDescription: description,
        twitterImage: fallbackImage,
        h1,
        structuredData: [],
        breadcrumbItems: [
          { name: 'Home', url: 'https://evencify.com' },
          { name: 'FAQ', url: canonicalUrl },
        ],
      };
    }

    case 'sitemap': {
      const title = 'HTML Sitemap & Event Index | Evencify';
      const description =
        'Explore the full directory of event pages, city guides, category listings, and crew hiring portals on Evencify.';
      const canonicalUrl = 'https://evencify.com/sitemap';
      const h1 = 'Evencify XML & HTML Sitemap Directory';

      return {
        title,
        description,
        canonicalUrl,
        robots: 'index, follow',
        ogTitle: title,
        ogDescription: description,
        ogImage: fallbackImage,
        ogType: 'website',
        twitterCard: 'summary',
        twitterTitle: title,
        twitterDescription: description,
        twitterImage: fallbackImage,
        h1,
        structuredData: [],
        breadcrumbItems: [
          { name: 'Home', url: 'https://evencify.com' },
          { name: 'Sitemap', url: canonicalUrl },
        ],
      };
    }

    case 'robots': {
      const title = 'Robots.txt Specifications | Evencify';
      const description = 'Search engine indexing directives and robots.txt rules for Evencify.com.';
      const canonicalUrl = 'https://evencify.com/robots.txt';
      const h1 = 'Robots.txt Directives';

      return {
        title,
        description,
        canonicalUrl,
        robots: 'noindex, follow',
        ogTitle: title,
        ogDescription: description,
        ogImage: fallbackImage,
        ogType: 'website',
        twitterCard: 'summary',
        twitterTitle: title,
        twitterDescription: description,
        twitterImage: fallbackImage,
        h1,
        structuredData: [],
        breadcrumbItems: [
          { name: 'Home', url: 'https://evencify.com' },
          { name: 'Robots.txt', url: canonicalUrl },
        ],
      };
    }

    case 'not-found':
    default: {
      const title = 'Page Not Found (404) | Evencify';
      const description =
        'The requested event or page could not be found. Explore upcoming events in Surat, Mumbai, Ahmedabad, and across India on Evencify.';
      const canonicalUrl = 'https://evencify.com/404';
      const h1 = 'Event or Page Not Found';

      return {
        title,
        description,
        canonicalUrl,
        robots: 'noindex, nofollow',
        ogTitle: title,
        ogDescription: description,
        ogImage: fallbackImage,
        ogType: 'website',
        twitterCard: 'summary',
        twitterTitle: title,
        twitterDescription: description,
        twitterImage: fallbackImage,
        h1,
        structuredData: [],
        breadcrumbItems: [
          { name: 'Home', url: 'https://evencify.com' },
          { name: 'Page Not Found', url: canonicalUrl },
        ],
      };
    }
  }
}

// ----------------------------------------------------
// Convenience Helper: Route to SEO Data
// ----------------------------------------------------
export function getSEODataFromRoute(
  route: {
    type: string;
    citySlug?: string;
    stateSlug?: string;
    categorySlug?: string;
    dateKey?: string;
    eventSlug?: string;
  },
  events: EventItem[] = []
): SEOOutput {
  switch (route.type) {
    case 'home':
      return getSEOData({ type: 'homepage', eventCount: events.length });
    case 'all-events':
      return getSEOData({ type: 'all-events', eventCount: events.length });
    case 'near-me':
      return getSEOData({ type: 'near-me', eventCount: events.length });
    case 'date':
      return getSEOData({
        type: 'date',
        dateKey: route.dateKey || 'today',
        eventCount: events.length,
      });
    case 'city': {
      const cityData = route.citySlug ? CITIES_DATABASE[route.citySlug] : undefined;
      return getSEOData({
        type: 'city',
        city: cityData,
        eventCount: events.filter((e) => e.city.toLowerCase() === (cityData?.name.toLowerCase() || '')).length,
      });
    }
    case 'state': {
      const stateData = route.stateSlug ? STATES_DATABASE[route.stateSlug] : undefined;
      return getSEOData({
        type: 'state',
        state: stateData,
        eventCount: events.length,
      });
    }
    case 'category': {
      const categoryData = route.categorySlug ? CATEGORIES_DATABASE[route.categorySlug] : undefined;
      return getSEOData({
        type: 'category',
        category: categoryData,
        eventCount: events.length,
      });
    }
    case 'city-category': {
      const cityData = route.citySlug ? CITIES_DATABASE[route.citySlug] : undefined;
      const categoryData = route.categorySlug ? CATEGORIES_DATABASE[route.categorySlug] : undefined;
      return getSEOData({
        type: 'city-category',
        city: cityData,
        category: categoryData,
        eventCount: events.length,
      });
    }
    case 'state-category': {
      const stateData = route.stateSlug ? STATES_DATABASE[route.stateSlug] : undefined;
      const categoryData = route.categorySlug ? CATEGORIES_DATABASE[route.categorySlug] : undefined;
      return getSEOData({
        type: 'state-category',
        state: stateData,
        category: categoryData,
        eventCount: events.length,
      });
    }
    case 'event': {
      const matchedEvent = events.find(
        (e) => slugify(e.name) === route.eventSlug || e.id === route.eventSlug
      );
      return getSEOData({
        type: 'event',
        event: matchedEvent,
      });
    }
    case 'crew-jobs':
      return getSEOData({ type: 'crew-jobs', openRolesCount: 45 });
    case 'organiser-solution':
    case 'organise-event':
      return getSEOData({ type: 'organise-event' });
    case 'about':
      return getSEOData({ type: 'about' });
    case 'contact':
      return getSEOData({ type: 'contact' });
    case 'privacy':
      return getSEOData({ type: 'privacy' });
    case 'terms':
      return getSEOData({ type: 'terms' });
    case 'faq':
      return getSEOData({ type: 'faq' });
    case 'sitemap':
      return getSEOData({ type: 'sitemap' });
    case 'robots':
      return getSEOData({ type: 'robots' });
    default:
      return getSEOData({ type: 'not-found' });
  }
}

