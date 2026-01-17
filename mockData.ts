import { MangaData } from './types';

const generateChapters = (count: number, prefix: string) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `${prefix}-ch-${i + 1}`,
    number: i + 1,
    title: `Chapter ${i + 1}`,
    date: '2023-10-25',
    read: i < 3,
    size: '18 MB'
  })).reverse();
};

export const libraryData: MangaData[] = [
  {
    id: '1',
    title: 'Sakura Blooming Days',
    description: 'In a world where magic is fueled by emotions, a young girl discovers her power lies not in strength, but in empathy. As she navigates the prestigious academy, she uncovers dark secrets about the origin of magic itself.',
    coverUrl: 'https://picsum.photos/400/600?random=1',
    fileSize: '1.2 GB',
    format: 'CBZ',
    path: '/Internal/Comics/Fantasy/Sakura',
    rating: 4.8,
    dateAdded: '2023-01-15',
    series: 'Chronicles of the Heart',
    status: 'Reading',
    lastOpened: '2 hours ago',
    tags: {
      authors: ['Aiko Tanaka', 'Studio Bloom'],
      characters: ['Hikari', 'Ren', 'Professor Eldric'],
      general: ['Fantasy', 'Romance', 'School Life', 'Magic'],
      series: ['Sequel Announced', 'Vol 1-12 Complete']
    },
    chapters: generateChapters(12, '1')
  },
  {
    id: '2',
    title: 'Cyberpunk Drifter',
    description: 'Neon lights hide the darkest shadows. A former mercenary takes on one last job to clear his debt, only to find himself protecting a sentient AI that everyone wants to destroy.',
    coverUrl: 'https://picsum.photos/400/600?random=2',
    fileSize: '850 MB',
    format: 'ZIP',
    path: '/Internal/Comics/SciFi/Drifter',
    rating: 4.5,
    dateAdded: '2023-02-10',
    series: 'Neon Shadows',
    status: 'Plan to Read',
    tags: {
      authors: ['Kenji Sato'],
      characters: ['Kaito', 'Unit-734'],
      general: ['Sci-Fi', 'Action', 'Cyberpunk', 'R18'],
      series: ['Ongoing']
    },
    chapters: generateChapters(5, '2')
  },
  {
    id: '3',
    title: 'The Silent Forest',
    description: 'A horror anthology centered around a mysterious forest where people go missing, only to return changed.',
    coverUrl: 'https://picsum.photos/400/600?random=3',
    fileSize: '2.1 GB',
    format: 'PDF',
    path: '/Internal/Comics/Horror/Forest',
    rating: 4.9,
    dateAdded: '2023-03-05',
    status: 'Completed',
    tags: {
      authors: ['Junji Ito Inspired'],
      characters: ['The Forest'],
      general: ['Horror', 'Psychological', 'Supernatural'],
      series: ['Anthology']
    },
    chapters: generateChapters(8, '3')
  },
  {
    id: '4',
    title: 'Azure Blue Skies',
    description: 'A relaxing slice-of-life story about a retired pilot opening a coffee shop near the coast. The gentle sound of waves and the aroma of coffee creates a perfect haven.',
    coverUrl: 'https://picsum.photos/400/600?random=4',
    fileSize: '450 MB',
    format: 'CBZ',
    path: '/Internal/Comics/SoL/Azure',
    rating: 4.2,
    dateAdded: '2023-04-01',
    status: 'Reading',
    tags: {
      authors: ['Mika Yamata'],
      characters: ['Captain Joe', 'Sarah'],
      general: ['Slice of Life', 'Comedy', 'Cooking'],
      series: ['Ongoing']
    },
    chapters: generateChapters(20, '4')
  },
  {
    id: '5',
    title: 'Velvet Chains',
    description: 'Late nights at the office lead to unexpected developments between a strict boss and his new secretary. A tale of power dynamics and hidden desires.',
    coverUrl: 'https://picsum.photos/400/600?random=5',
    fileSize: '320 MB',
    format: 'ZIP',
    path: '/Internal/Comics/Adult/Velvet',
    rating: 4.6,
    dateAdded: '2023-04-10',
    status: 'Completed',
    tags: {
      authors: ['Crimson Pen'],
      characters: ['Mr. Tanaka', 'Yumi'],
      general: ['Romance', 'Office', 'Drama', 'R18'],
      series: ['Completed']
    },
    chapters: generateChapters(3, '5')
  },
  {
    id: '6',
    title: 'Mecha Soul: Override',
    description: 'In a post-apocalyptic wasteland, humanity survives in giant moving cities. A scavenger finds an ancient mecha that could change everything.',
    coverUrl: 'https://picsum.photos/400/600?random=6',
    fileSize: '2.5 GB',
    format: 'FOLDER',
    path: '/Internal/Comics/SciFi/Mecha',
    rating: 4.7,
    dateAdded: '2023-05-15',
    series: 'Mecha Soul',
    status: 'Reading',
    tags: {
      authors: ['Goro Mecha'],
      characters: ['Shin', 'Unit-01'],
      general: ['Sci-Fi', 'Mecha', 'Action'],
      series: ['Vol 1-5']
    },
    chapters: generateChapters(15, '6')
  },
  {
    id: '7',
    title: 'Summer Lessons',
    description: 'A private tutor spends the summer teaching three sisters at a secluded villa, but learns more about love and temptation than academics.',
    coverUrl: 'https://picsum.photos/400/600?random=7',
    fileSize: '600 MB',
    format: 'CBZ',
    path: '/Internal/Comics/Adult/Summer',
    rating: 4.4,
    dateAdded: '2023-06-01',
    status: 'Plan to Read',
    tags: {
      authors: ['Artist X'],
      characters: ['Sensei', 'The Sisters'],
      general: ['Harem', 'Romance', 'School Life', 'R18'],
      series: ['Complete']
    },
    chapters: generateChapters(6, '7')
  },
  {
    id: '8',
    title: 'The Wandering Swordsman',
    description: 'A ronin travels the countryside during the Edo period, solving problems with his blade and his wit. An epic historical drama.',
    coverUrl: 'https://picsum.photos/400/600?random=8',
    fileSize: '1.8 GB',
    format: 'PDF',
    path: '/Internal/Comics/Historical/Ronin',
    rating: 4.9,
    dateAdded: '2023-06-20',
    series: 'Edo Tales',
    status: 'Completed',
    tags: {
      authors: ['Takeshi Obata Inspired'],
      characters: ['Musashi'],
      general: ['Historical', 'Action', 'Seinen'],
      series: ['Masterpiece']
    },
    chapters: generateChapters(30, '8')
  },
  {
    id: '9',
    title: 'Dungeon Meshi: The Aftermath',
    description: 'Fan comics exploring what happens after the main party returns to the surface. A delightful mix of cooking and monster hunting.',
    coverUrl: 'https://picsum.photos/400/600?random=9',
    fileSize: '200 MB',
    format: 'ZIP',
    path: '/Internal/Comics/Fantasy/Doujin',
    rating: 4.1,
    dateAdded: '2023-07-04',
    status: 'Reading',
    tags: {
      authors: ['Circle A'],
      characters: ['Laios', 'Marcille'],
      general: ['Fantasy', 'Comedy', 'Doujinshi'],
      series: ['Shorts']
    },
    chapters: generateChapters(2, '9')
  },
  {
    id: '10',
    title: 'Midnight Shift',
    description: 'Strange things happen in the hospital ward at night. A psychological thriller with supernatural elements and adult themes.',
    coverUrl: 'https://picsum.photos/400/600?random=10',
    fileSize: '400 MB',
    format: 'CBZ',
    path: '/Internal/Comics/Adult/Nurse',
    rating: 4.3,
    dateAdded: '2023-07-15',
    status: 'Plan to Read',
    tags: {
      authors: ['Dark Artist'],
      characters: ['Nurse Joy'],
      general: ['Horror', 'Thriller', 'R18'],
      series: ['One-shot']
    },
    chapters: generateChapters(1, '10')
  },
  {
    id: '11',
    title: 'Space Truckers',
    description: 'Delivering cargo across the galaxy isn\'t as glamorous as it sounds, especially when pirates are involved. High-octane sci-fi adventure.',
    coverUrl: 'https://picsum.photos/400/600?random=11',
    fileSize: '1.1 GB',
    format: 'CBZ',
    path: '/Internal/Comics/SciFi/Truckers',
    rating: 4.0,
    dateAdded: '2023-08-01',
    status: 'Reading',
    tags: {
      authors: ['SciFi Weekly'],
      characters: ['Trucker Joe'],
      general: ['Sci-Fi', 'Comedy', 'Adventure'],
      series: ['Ongoing']
    },
    chapters: generateChapters(8, '11')
  },
  {
    id: '12',
    title: 'The Idol\'s Secret',
    description: 'Behind the glitz and glamour, an idol struggles with a stalker and finds solace in her bodyguard. Intense drama and romance.',
    coverUrl: 'https://picsum.photos/400/600?random=12',
    fileSize: '900 MB',
    format: 'ZIP',
    path: '/Internal/Comics/Adult/Idol',
    rating: 4.5,
    dateAdded: '2023-08-10',
    status: 'Completed',
    tags: {
      authors: ['Pop Culture'],
      characters: ['Mina', 'Guard'],
      general: ['Drama', 'Romance', 'R18', 'Music'],
      series: ['Limited Series']
    },
    chapters: generateChapters(4, '12')
  }
];