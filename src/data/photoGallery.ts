export interface PhotoYear {
  year: number;
  photos: Photo[];
}

export interface Photo {
  id: string;
  year: number;
  url: string;
  thumbnail: string;
  caption: string;
  prahariId: number;
  photographer?: string;
  tags: string[];
}

// Generate 20 placeholder photos for each year from 2014-2025
const generateYearPhotos = (year: number): Photo[] => {
  const photos: Photo[] = [];
  const prahariMoments = [
    { id: 1, name: "Evening Prayers", desc: "As the sun sets, the first lamps are lit" },
    { id: 2, name: "Night Vigil", desc: "The village stays awake through the night" },
    { id: 3, name: "Midnight Chant", desc: "The deepest hour of devotion" },
    { id: 4, name: "Brahma Muhurta", desc: "The most auspicious time begins" },
    { id: 5, name: "Dawn Aarti", desc: "First light breaks over Chadheigaon" },
    { id: 6, name: "Morning Gathering", desc: "The whole village comes together" },
    { id: 7, name: "Noon Celebration", desc: "Peak energy and festivity" },
    { id: 8, name: "Afternoon Wind Down", desc: "The circle prepares to close" }
  ];

  const categories = ["prayer", "crowd", "decoration", "food", "music", "dance", "ritual", "lamp", "flower", "procession", "elders", "children"];
  
  for (let i = 1; i <= 20; i++) {
    const prahari = prahariMoments[Math.floor((i - 1) / 2.5) % 8];
    const category = categories[(i - 1) % categories.length];
    const uniqueId = `${year}-${prahari.id}-${String(i).padStart(3, '0')}`;
    
    photos.push({
      id: uniqueId,
      year: year,
      url: `/photos/${year}/${uniqueId}.jpg`,
      thumbnail: `/photos/${year}/thumbs/${uniqueId}.jpg`,
      caption: `${prahari.name} - ${category.charAt(0).toUpperCase() + category.slice(1)}`,
      prahariId: prahari.id,
      photographer: "Village Photographer",
      tags: [category, `prahari-${prahari.id}`, String(year), prahari.name.toLowerCase().replace(/\s+/g, '-')]
    });
  }
  
  return photos;
};

export const photoYears: PhotoYear[] = [
  2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025
].map(year => ({
  year,
  photos: generateYearPhotos(year)
}));

export const getPhotosByYear = (year: number): Photo[] => {
  return photoYears.find(py => py.year === year)?.photos || [];
};

export const getPhotosByPrahari = (prahariId: number): Photo[] => {
  return photoYears.flatMap(py => py.photos).filter(p => p.prahariId === prahariId);
};

export const getPhotosByTag = (tag: string): Photo[] => {
  return photoYears.flatMap(py => py.photos).filter(p => p.tags.includes(tag));
};

export const totalPhotos = photoYears.reduce((acc, py) => acc + py.photos.length, 0);
export const totalYears = photoYears.length;
