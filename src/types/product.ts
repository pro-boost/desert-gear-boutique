
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: 'boots' | 'jackets' | 'accessories';
  images: string[];
  inStock: boolean;
  featured?: boolean;
  createdAt: number;
}

export interface ProductFilters {
  category?: 'boots' | 'jackets' | 'accessories' | 'all';
  inStock?: boolean;
  search?: string;
}

export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: 'boot-001',
    name: 'Tactical Combat Boot',
    description: 'Bottes militaires robustes et confortables pour toutes conditions. Résistantes à l\'eau et anti-dérapantes.',
    price: 129.99,
    category: 'boots',
    images: ['/images/boot-1.jpg'],
    inStock: true,
    featured: true,
    createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000, // 7 days ago
  },
  {
    id: 'boot-002',
    name: 'Ranger Pro Desert',
    description: 'Bottes légères conçues pour le climat désertique. Respirantes et durables.',
    price: 119.99,
    category: 'boots',
    images: ['/images/boot-2.jpg'],
    inStock: true,
    featured: false,
    createdAt: Date.now() - 14 * 24 * 60 * 60 * 1000, // 14 days ago
  },
  {
    id: 'boot-003',
    name: 'Urban Tactical Boot',
    description: 'Bottes tactiques pour environnement urbain. Style discret avec performances tactiques.',
    price: 149.99,
    discountPrice: 129.99,
    category: 'boots',
    images: ['/images/boot-3.jpg'],
    inStock: true,
    featured: true,
    createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000, // 3 days ago
  },
  {
    id: 'jacket-001',
    name: 'Veste Tactique Imperméable',
    description: 'Veste militaire imperméable avec multiples poches. Parfaite pour toutes les conditions météorologiques.',
    price: 179.99,
    category: 'jackets',
    images: ['/images/jacket-1.jpg'],
    inStock: true,
    featured: true,
    createdAt: Date.now() - 10 * 24 * 60 * 60 * 1000, // 10 days ago
  },
  {
    id: 'jacket-002',
    name: 'Blouson Militaire M65',
    description: 'Blouson militaire classique style M65. Robuste et polyvalent avec doublure amovible.',
    price: 159.99,
    discountPrice: 139.99,
    category: 'jackets',
    images: ['/images/jacket-2.jpg'],
    inStock: false,
    featured: false,
    createdAt: Date.now() - 21 * 24 * 60 * 60 * 1000, // 21 days ago
  },
  {
    id: 'accessory-001',
    name: 'Ceinturon Tactique',
    description: 'Ceinturon tactique robuste avec système MOLLE intégré. Ajustable et durable.',
    price: 49.99,
    category: 'accessories',
    images: ['/images/accessory-1.jpg'],
    inStock: true,
    featured: false,
    createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000, // 5 days ago
  },
  {
    id: 'accessory-002',
    name: 'Gants Tactiques',
    description: 'Gants tactiques avec renforts articulés et grip amélioré. Parfait pour les opérations tactiques.',
    price: 35.99,
    category: 'accessories',
    images: ['/images/accessory-2.jpg'],
    inStock: true,
    featured: true,
    createdAt: Date.now() - 8 * 24 * 60 * 60 * 1000, // 8 days ago
  },
  {
    id: 'accessory-003',
    name: 'Sac à dos Militaire',
    description: 'Sac à dos militaire de 40L avec système MOLLE et compartiments multiples.',
    price: 89.99,
    category: 'accessories',
    images: ['/images/accessory-3.jpg'],
    inStock: true,
    featured: false,
    createdAt: Date.now() - 12 * 24 * 60 * 60 * 1000, // 12 days ago
  }
];
