export type Artwork = {
  id: string;
  title: string;
  author: string;
  authorAvatar?: string;
  price: number;
  description: string;
  imageUrl: string;
  aspectRatio: number;
  createdAt: number;
  uploadedBy?: string; // user_id of uploader
};

export const SEED_ARTWORKS: Artwork[] = [
  {
    id: 'seed-1',
    title: 'Neon Dreams',
    author: 'CyberPunk_99',
    price: 120,
    description: 'A dive into the vibrant rain-lit streets of a neon-drenched metropolis.',
    imageUrl: 'https://images.unsplash.com/photo-1701697966302-39b785a3380b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMjd8MHwxfHNlYXJjaHw0fHxkaWdpdGFsJTIwYXJ0JTIwaWxsdXN0cmF0aW9ufGVufDB8fHx8MTc3Njg1OTkzMXww&ixlib=rb-4.1.0&q=85',
    aspectRatio: 1.0,
    createdAt: Date.now() - 12 * 3600_000,
  },
  {
    id: 'seed-2',
    title: 'Yoga in the Void',
    author: 'ZenMaster',
    price: 45,
    description: 'Serene figure dissolving into cosmic geometry — ink on obsidian.',
    imageUrl: 'https://images.unsplash.com/photo-1657584942205-c34fec47404d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMjd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwYXJ0JTIwaWxsdXN0cmF0aW9ufGVufDB8fHx8MTc3Njg1OTkzMXww&ixlib=rb-4.1.0&q=85',
    aspectRatio: 1.5,
    createdAt: Date.now() - 13 * 3600_000,
  },
  {
    id: 'seed-3',
    title: 'Pink Geometrics',
    author: 'AbstractVibes',
    price: 85,
    description: 'Soft pastel geometry layered with hand-drawn noise textures.',
    imageUrl: 'https://images.unsplash.com/photo-1764258560296-5e228e6a20f3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMjd8MHwxfHNlYXJjaHwzfHxkaWdpdGFsJTIwYXJ0JTIwaWxsdXN0cmF0aW9ufGVufDB8fHx8MTc3Njg1OTkzMXww&ixlib=rb-4.1.0&q=85',
    aspectRatio: 1.2,
    createdAt: Date.now() - 14 * 3600_000,
  },
  {
    id: 'seed-4',
    title: 'Jungle Tablet',
    author: 'NatureSketch',
    price: 50,
    description: 'Digital foliage sketches from a humid afternoon in the canopy.',
    imageUrl: 'https://images.pexels.com/photos/26563068/pexels-photo-26563068.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    aspectRatio: 1.4,
    createdAt: Date.now() - 15 * 3600_000,
  },
  {
    id: 'seed-5',
    title: 'Gothic Spires',
    author: 'DarkCastleArt',
    price: 200,
    description: 'Moonlit spires piercing a charcoal sky — a study in stillness.',
    imageUrl: 'https://images.unsplash.com/photo-1758930908621-550b64b0b1c1?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NzF8MHwxfHNlYXJjaHwzfHxmYW50YXN5JTIwbGFuZHNjYXBlJTIwY29uY2VwdCUyMGFydHxlbnwwfHx8fDE3NzY4NTk5MzF8MA&ixlib=rb-4.1.0&q=85',
    aspectRatio: 0.8,
    createdAt: Date.now() - 16 * 3600_000,
  },
  {
    id: 'seed-6',
    title: 'Medieval Well',
    author: 'FantasyWorld',
    price: 110,
    description: 'Old stone and moss — the kind of well where stories begin.',
    imageUrl: 'https://images.unsplash.com/photo-1775193823752-84a3c871f93a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NzF8MHwxfHNlYXJjaHw0fHxmYW50YXN5JTIwbGFuZHNjYXBlJTIwY29uY2VwdCUyMGFydHxlbnwwfHx8fDE3NzY4NTk5MzF8MA&ixlib=rb-4.1.0&q=85',
    aspectRatio: 1.2,
    createdAt: Date.now() - 17 * 3600_000,
  },
  {
    id: 'seed-7',
    title: 'Sunset Reflection',
    author: 'GeoAbstracts',
    price: 90,
    description: 'Geometric sunset rendered with generative gradients.',
    imageUrl: 'https://images.unsplash.com/photo-1760693318333-d3ae15709511?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NzF8MHwxfHNlYXJjaHwxfHxmYW50YXN5JTIwbGFuZHNjYXBlJTIwY29uY2VwdCUyMGFydHxlbnwwfHx8fDE3NzY4NTk5MzF8MA&ixlib=rb-4.1.0&q=85',
    aspectRatio: 1.3,
    createdAt: Date.now() - 18 * 3600_000,
  },
  {
    id: 'seed-8',
    title: 'Desert Portal',
    author: 'SurrealScapes',
    price: 150,
    description: 'Doorway to nowhere, or to everywhere — you decide.',
    imageUrl: 'https://images.unsplash.com/photo-1760693052314-d71e8b493c84?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NzF8MHwxfHNlYXJjaHwyfHxmYW50YXN5JTIwbGFuZHNjYXBlJTIwY29uY2VwdCUyMGFydHxlbnwwfHx8fDE3NzY4NTk5MzF8MA&ixlib=rb-4.1.0&q=85',
    aspectRatio: 1.1,
    createdAt: Date.now() - 19 * 3600_000,
  },
  {
    id: 'seed-9',
    title: 'Cloudy Stream',
    author: 'LandscapeLover',
    price: 75,
    description: 'Mountain stream under a low quilted sky.',
    imageUrl: 'https://images.pexels.com/photos/15575235/pexels-photo-15575235.png?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    aspectRatio: 1.4,
    createdAt: Date.now() - 20 * 3600_000,
  },
  {
    id: 'seed-10',
    title: 'The Thinker',
    author: 'PortraitPro',
    price: 60,
    description: 'Character portrait study — lost in thought, found in shadow.',
    imageUrl: 'https://images.unsplash.com/photo-1667381515897-5c35f4da0c24?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzZ8MHwxfHNlYXJjaHwxfHxjaGFyYWN0ZXIlMjBkZXNpZ24lMjBwb3J0cmFpdHxlbnwwfHx8fDE3NzY4NTk5MzF8MA&ixlib=rb-4.1.0&q=85',
    aspectRatio: 1.0,
    createdAt: Date.now() - 21 * 3600_000,
  },
  {
    id: 'seed-11',
    title: 'Elder Tablet',
    author: 'DigitalCreator',
    price: 80,
    description: 'An artifact painted with layered digital brushwork.',
    imageUrl: 'https://images.pexels.com/photos/17890948/pexels-photo-17890948.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    aspectRatio: 1.4,
    createdAt: Date.now() - 22 * 3600_000,
  },
  {
    id: 'seed-12',
    title: 'Forest Elf',
    author: 'FantasyFaces',
    price: 135,
    description: 'Watchful eyes under a crown of leaves.',
    imageUrl: 'https://images.pexels.com/photos/35989558/pexels-photo-35989558.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    aspectRatio: 1.4,
    createdAt: Date.now() - 23 * 3600_000,
  },
];
