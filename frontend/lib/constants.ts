// Countries list
export const COUNTRIES = [
  'Russia',
  'China',
  'Georgia',
  'Kazakhstan',
  'Kyrgyzstan',
  'Nepal',
  'Tajikistan',
  'Ukraine',
  'Uzbekistan',
  'Germany',
  'Australia',
  'United Kingdom',
  'United States',
  'Canada',
  'Other'
];

// Universities by country
export const UNIVERSITIES_BY_COUNTRY: { [key: string]: string[] } = {
  'Russia': [
    'Kazan Federal University',
    'Bashkir State Medical University',
    'Orenburg State Medical University',
    'Petrozavodsk State University',
    'Immanuel Kant Baltic Federal University',
    'Krasnoyarsk State Medical University',
    'National Research Nuclear University, MEPHI',
    'North Western State Medical University',
    'Northern State Medical University',
    'Tambov State University',
    'Ulyanovsk State University',
    'Ural State Medical University',
    'Crimea Federal University',
    'Perm State Medical University'
  ],
  'China': [
    'Zhejiang University',
    'Nanjing Medical University',
    'Shandong University',
    'China Medical University',
    'Xian Jiaotong University',
    'Xiamen University',
    'Southeast University',
    'Kunming Medical University',
    'Wenzhou Medical University',
    'Qingdao University',
    'Xinjiang Medical University'
  ],
  'Georgia': [],
  'Kazakhstan': [],
  'Kyrgyzstan': [],
  'Nepal': [],
  'Tajikistan': [],
  'Ukraine': [],
  'Uzbekistan': [],
  'Germany': [],
  'Australia': [],
  'United Kingdom': [],
  'United States': [
    'MIT',
    'Stanford',
    'Harvard',
    'Caltech',
    'UC Berkeley',
    'Princeton',
    'Yale',
    'Columbia',
    'University of Chicago',
    'University of Pennsylvania'
  ],
  'Canada': [],
  'Other': []
};

// Get all unique universities
export const getAllUniversities = (): string[] => {
  const allUniversities: string[] = [];
  Object.values(UNIVERSITIES_BY_COUNTRY).forEach(universities => {
    allUniversities.push(...universities);
  });
  return [...new Set(allUniversities)].sort();
};

// Get universities for a specific country
export const getUniversitiesByCountry = (country: string): string[] => {
  return UNIVERSITIES_BY_COUNTRY[country] || [];
};

