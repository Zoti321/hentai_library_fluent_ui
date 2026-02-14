import { MangaData, ComicImageSourceType } from './types';

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

const fixedLibraryData: MangaData[] = [
  {
    id: '1',
    title: 'Sakura Blooming Days',
    description: 'In a world where magic is fueled by emotions, a young girl discovers her power lies not in strength, but in empathy.',
    coverUrl: 'https://picsum.photos/400/600?random=1',
    fileSize: '1.2 GB',
    format: 'CBZ',
    path: '/Internal/Comics/Fantasy/Sakura',
    rating: 4.8,
    dateAdded: '2023-01-15',
    series: 'Chronicles of the Heart',
    status: 'Reading',
    publicationStatus: '已完结',
    imageSourceType: 'Local',
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
    description: 'Neon lights hide the darkest shadows. A former mercenary takes on one last job.',
    coverUrl: 'https://picsum.photos/400/600?random=2',
    fileSize: '850 MB',
    format: 'ZIP',
    path: '/Internal/Comics/SciFi/Drifter',
    rating: 4.5,
    dateAdded: '2023-02-10',
    series: 'Neon Shadows',
    status: 'Plan to Read',
    publicationStatus: '连载中',
    imageSourceType: 'Network',
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
    description: 'A horror anthology centered around a mysterious forest where people go missing.',
    coverUrl: 'https://picsum.photos/400/600?random=3',
    fileSize: '2.1 GB',
    format: 'PDF',
    path: '/Internal/Comics/Horror/Forest',
    rating: 4.9,
    dateAdded: '2023-03-05',
    status: 'Completed',
    publicationStatus: '已完结',
    imageSourceType: 'Local',
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
    description: 'A relaxing slice-of-life story about a retired pilot opening a coffee shop.',
    coverUrl: 'https://picsum.photos/400/600?random=4',
    fileSize: '450 MB',
    format: 'CBZ',
    path: '/Internal/Comics/SoL/Azure',
    rating: 4.2,
    dateAdded: '2023-04-01',
    status: 'Reading',
    publicationStatus: '连载中',
    imageSourceType: 'Cloud',
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
    description: 'Late nights at the office lead to unexpected developments.',
    coverUrl: 'https://picsum.photos/400/600?random=5',
    fileSize: '320 MB',
    format: 'ZIP',
    path: '/Internal/Comics/Adult/Velvet',
    rating: 4.6,
    dateAdded: '2023-04-10',
    status: 'Completed',
    publicationStatus: '已完结',
    imageSourceType: 'Local',
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
    description: 'In a post-apocalyptic wasteland, humanity survives in giant moving cities.',
    coverUrl: 'https://picsum.photos/400/600?random=6',
    fileSize: '2.5 GB',
    format: 'FOLDER',
    path: '/Internal/Comics/SciFi/Mecha',
    rating: 4.7,
    dateAdded: '2023-05-15',
    series: 'Mecha Soul',
    status: 'Reading',
    publicationStatus: '连载中',
    imageSourceType: 'Network',
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
    description: 'A private tutor spends the summer teaching three sisters at a secluded villa.',
    coverUrl: 'https://picsum.photos/400/600?random=7',
    fileSize: '600 MB',
    format: 'CBZ',
    path: '/Internal/Comics/Adult/Summer',
    rating: 4.4,
    dateAdded: '2023-06-01',
    status: 'Plan to Read',
    publicationStatus: '已完结',
    imageSourceType: 'Cloud',
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
    description: 'A ronin travels the countryside during the Edo period.',
    coverUrl: 'https://picsum.photos/400/600?random=8',
    fileSize: '1.8 GB',
    format: 'PDF',
    path: '/Internal/Comics/Historical/Ronin',
    rating: 4.9,
    dateAdded: '2023-06-20',
    series: 'Edo Tales',
    status: 'Completed',
    publicationStatus: '已完结',
    imageSourceType: 'Local',
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
    description: 'Fan comics exploring what happens after the main party returns to the surface.',
    coverUrl: 'https://picsum.photos/400/600?random=9',
    fileSize: '200 MB',
    format: 'ZIP',
    path: '/Internal/Comics/Fantasy/Doujin',
    rating: 4.1,
    dateAdded: '2023-07-04',
    status: 'Reading',
    publicationStatus: '连载中',
    imageSourceType: 'Network',
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
    description: 'Strange things happen in the hospital ward at night.',
    coverUrl: 'https://picsum.photos/400/600?random=10',
    fileSize: '400 MB',
    format: 'CBZ',
    path: '/Internal/Comics/Adult/Nurse',
    rating: 4.3,
    dateAdded: '2023-07-15',
    status: 'Plan to Read',
    publicationStatus: '已完结',
    imageSourceType: 'Local',
    tags: {
      authors: ['Dark Artist'],
      characters: ['Nurse Joy'],
      general: ['Horror', 'Thriller', 'R18'],
      series: ['One-shot']
    },
    chapters: generateChapters(1, '10')
  }
];

// --- Generation Logic for 100+ Items ---
const adjectives = ['Silent', 'Holy', 'Broken', 'Eternal', 'Crimson', 'Azure', 'Dark', 'Light', 'Lost', 'Fallen', 'Rising', 'Hidden', 'Secret', 'Mystic', 'Crystal', 'Iron', 'Golden', 'Silver', 'Forgotten', 'Forbidden', 'Shattered', 'Infinite', 'Divine', 'Cursed', 'Bleeding', 'Frozen', 'Burning', 'Twisted', 'Sacred', 'Phantom'];
const nouns = ['Sword', 'Blade', 'Soul', 'Heart', 'World', 'Sky', 'Ocean', 'Forest', 'City', 'Tower', 'Legend', 'Chronicle', 'Saga', 'Dream', 'Nightmare', 'Empire', 'Kingdom', 'Warrior', 'Mage', 'Dragon', 'Angel', 'Demon', 'Ghost', 'Machine', 'System', 'Gate', 'Abyss', 'Horizon', 'Memory', 'Tear'];
const genres = ['Fantasy', 'Action', 'Adventure', 'Romance', 'Sci-Fi', 'Slice of Life', 'Comedy', 'Drama', 'Horror', 'Mystery', 'Psychological', 'Sports', 'Supernatural', 'Thriller', 'Harem', 'Isekai', 'Mecha'];
const authors = ['Akira Toriyama', 'Eiichiro Oda', 'Masashi Kishimoto', 'Tite Kubo', 'Hirohiko Araki', 'Kentaro Miura', 'Yoshihiro Togashi', 'Junji Ito', 'Rumiko Takahashi', 'Clamp', 'One', 'Yusuke Murata', 'Naoki Urasawa', 'Inio Asano', 'Makoto Shinkai', 'Hayao Miyazaki'];
const statuses: ('Reading' | 'Completed' | 'Plan to Read')[] = ['Reading', 'Completed', 'Plan to Read'];
const pubStatuses: ('连载中' | '已完结')[] = ['连载中', '已完结'];
const formats: ('CBZ' | 'ZIP' | 'PDF' | 'FOLDER')[] = ['CBZ', 'ZIP', 'PDF', 'FOLDER'];

const generateMoreManga = (startIndex: number, count: number): MangaData[] => {
  return Array.from({ length: count }, (_, i) => {
    const id = (startIndex + i).toString();
    const titleAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const titleNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const title = `The ${titleAdjective} ${titleNoun}`;
    
    const chapterCount = Math.floor(Math.random() * 50) + 1;
    const rating = parseFloat((Math.random() * 2 + 3).toFixed(1)); // 3.0 to 5.0
    
    // Random Tags
    const shuffledGenres = [...genres].sort(() => 0.5 - Math.random());
    const selectedGenres = shuffledGenres.slice(0, Math.floor(Math.random() * 3) + 1);
    if (Math.random() > 0.85) selectedGenres.push('R18');

    const author = authors[Math.floor(Math.random() * authors.length)];
    const status = Math.random() > 0.4 ? statuses[Math.floor(Math.random() * statuses.length)] : undefined;
    
    // Simulate some history
    let lastOpened: string | undefined = undefined;
    if (Math.random() > 0.7) {
        const times = ['Just now', '5 mins ago', '1 hour ago', 'Yesterday', '2 days ago', 'Last week'];
        lastOpened = times[Math.floor(Math.random() * times.length)];
    }

    // Random Date
    const today = new Date();
    const pastDate = new Date(today.getTime() - Math.floor(Math.random() * 10000000000));
    const dateAdded = pastDate.toISOString().split('T')[0];

    return {
      id,
      title,
      description: `A story about the ${titleAdjective.toLowerCase()} ${titleNoun.toLowerCase()} that changes the world forever. This is a generated mock data entry #${id} designed to populate the library for testing purposes.`,
      coverUrl: `https://picsum.photos/400/600?random=${id}`,
      fileSize: `${(Math.random() * 500 + 50).toFixed(0)} MB`,
      format: formats[Math.floor(Math.random() * formats.length)],
      path: `/Internal/Comics/${selectedGenres[0]}/${titleNoun}`,
      rating: rating,
      dateAdded: dateAdded,
      status: status,
      publicationStatus: pubStatuses[Math.floor(Math.random() * pubStatuses.length)],
      imageSourceType: 'Local',
      lastOpened: lastOpened,
      tags: {
        authors: [author],
        characters: ['Protagonist', 'Antagonist', 'Sidekick'],
        general: selectedGenres,
        series: Math.random() > 0.7 ? [`${titleAdjective} Series`] : []
      },
      chapters: generateChapters(chapterCount, id)
    };
  });
};

export const libraryData: MangaData[] = [
    ...fixedLibraryData,
    ...generateMoreManga(11, 90)
];