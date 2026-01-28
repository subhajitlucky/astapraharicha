export interface Memory {
  id: string;
  year: number;
  prahariId: number;
  url: string;
  thumbnail: string;
  caption: string;
  story?: string;
  photographer?: string;
  tags: string[];
}

export const memories: Memory[] = [
  // Example structure - populate with your 10 years of images
  {
    id: "2014-1-001",
    year: 2014,
    prahariId: 1,
    url: "https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=1920&q=80",
    thumbnail: "https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=400&q=70",
    caption: "First light of the decade",
    story: "The year we started the tradition of LED lamps alongside oil diyas...",
    photographer: "Ramesh Das",
    tags: ["lamps", "crowd", "opening"]
  },
  {
    id: "2018-3-015",
    year: 2018,
    prahariId: 3,
    url: "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?w=1920&q=80",
    thumbnail: "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?w=400&q=70",
    caption: "The longest night",
    story: "It rained during the 3rd Prahari, but no one moved. The chanting continued under umbrellas...",
    photographer: "Priya Patra",
    tags: ["rain", "night", "devotion"]
  },
  {
    id: "2020-5-001",
    year: 2020,
    prahariId: 5,
    url: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=1920&q=80",
    thumbnail: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&q=70",
    caption: "Silent Dawn",
    story: "The year of silence. Only the priests were allowed, but the chant echoed louder than ever in our hearts.",
    photographer: "Temple Trust",
    tags: ["dawn", "silence", "covid"]
  },
  {
    id: "2023-7-045",
    year: 2023,
    prahariId: 7,
    url: "https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=1920&q=80",
    thumbnail: "https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=400&q=70",
    caption: "Golden Peak",
    story: "Record attendance during the 7th Prahar. The Kirtan reached a fever pitch as the sun aligned with the chakra.",
    photographer: "Amit Kumar",
    tags: ["crowd", "gold", "energy"]
  }
];

export const years = [2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];
