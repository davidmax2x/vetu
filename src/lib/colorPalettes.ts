export interface ColorPalette {
  best: string[]
  neutral: string[]
  avoid: string[]
  names: {
    best: string[]
    neutral: string[]
    avoid: string[]
  }
  metallic: 'gold' | 'silver' | 'rose-gold' | 'mixed'
  description: string
  culturalVariants: {
    'south-asian'?: string[]
    'west-african'?: string[]
    'east-asian'?: string[]
  }
}

const palettes: Record<string, ColorPalette> = {
  'True Spring': {
    best: ['#FF6B35', '#F7931E', '#FFD23F', '#06FFA5', '#3DDC97', '#00B4D8', '#FF006E', '#FB5607'],
    neutral: ['#F5E6D3', '#E8D5B7', '#D4A574', '#8B7355', '#6B5B4F'],
    avoid: ['#4A4E69', '#22223B', '#9A8C98', '#5C5470', '#2D3142'],
    names: {
      best: ['Tangerine', 'Golden Orange', 'Lemon Yellow', 'Mint Green', 'Seafoam', 'Sky Blue', 'Hot Pink', 'Coral'],
      neutral: ['Cream', 'Beige', 'Tan', 'Warm Brown', 'Coffee'],
      avoid: ['Slate Grey', 'Navy', 'Mauve', 'Purple Grey', 'Charcoal']
    },
    metallic: 'gold',
    description: 'Warm, clear, and vibrant — like a field of wildflowers in full sun.',
    culturalVariants: {
      'south-asian': ['#FF6B35', '#F7931E', '#FFD23F', '#FF006E', '#FB5607', '#FF9F1C'],
      'west-african': ['#FF6B35', '#FFD23F', '#06FFA5', '#FB5607', '#FF9F1C', '#FFBE0B'],
      'east-asian': ['#FF6B35', '#FFD23F', '#FF006E', '#FB5607', '#FF9F1C', '#FFBE0B']
    }
  },
  'Bright Spring': {
    best: ['#FF006E', '#FB5607', '#FFBE0B', '#06FFA5', '#00B4D8', '#8338EC', '#3A86FF', '#FF006E'],
    neutral: ['#FFF5E6', '#FFE4C4', '#DEB887', '#CD853F', '#8B4513'],
    avoid: ['#2D3142', '#4A4E69', '#9A8C98', '#5C5470', '#22223B'],
    names: {
      best: ['Hot Pink', 'Coral', 'Sunshine Yellow', 'Mint', 'Turquoise', 'Violet', 'Azure', 'Magenta'],
      neutral: ['Ivory', 'Peach', 'Burlywood', 'Peru', 'Saddle Brown'],
      avoid: ['Charcoal', 'Slate', 'Mauve', 'Purple Grey', 'Navy']
    },
    metallic: 'gold',
    description: 'Electric and alive — the brightest, clearest colours in the spectrum.',
    culturalVariants: {
      'south-asian': ['#FF006E', '#FB5607', '#FFBE0B', '#8338EC', '#FF9F1C', '#FF006E'],
      'west-african': ['#FF006E', '#FFBE0B', '#06FFA5', '#FB5607', '#FF9F1C', '#FFBE0B'],
      'east-asian': ['#FF006E', '#FFBE0B', '#8338EC', '#FB5607', '#FF9F1C', '#FFBE0B']
    }
  },
  'Light Spring': {
    best: ['#FFD23F', '#FF9F1C', '#FFB5A7', '#A8E6CF', '#B4E7CE', '#C7CEEA', '#FFDAC1', '#FF9AA2'],
    neutral: ['#FFF8F0', '#FAEBD7', '#F5DEB3', '#D2B48C', '#BC8F8F'],
    avoid: ['#2D3142', '#4A4E69', '#5C5470', '#22223B', '#1A1A2E'],
    names: {
      best: ['Lemon', 'Apricot', 'Peach', 'Mint', 'Sea Mist', 'Lavender', 'Creamsicle', 'Blush'],
      neutral: ['Snow', 'Antique White', 'Wheat', 'Tan', 'Rosy Brown'],
      avoid: ['Charcoal', 'Slate', 'Purple Grey', 'Navy', 'Deep Purple']
    },
    metallic: 'gold',
    description: 'Delicate and warm — like morning light through sheer curtains.',
    culturalVariants: {
      'south-asian': ['#FFD23F', '#FF9F1C', '#FFB5A7', '#FFDAC1', '#FF9AA2', '#FFD23F'],
      'west-african': ['#FFD23F', '#FFB5A7', '#A8E6CF', '#FFDAC1', '#FF9AA2', '#FFD23F'],
      'east-asian': ['#FFD23F', '#FF9F1C', '#FFB5A7', '#FFDAC1', '#FF9AA2', '#FFD23F']
    }
  },
  'True Summer': {
    best: ['#90E0EF', '#48CAE4', '#0077B6', '#CAF0F8', '#ADE8F4', '#B7E4C7', '#D4A5A5', '#9D8189'],
    neutral: ['#F0F4F8', '#E2E8F0', '#CBD5E0', '#A0AEC0', '#718096'],
    avoid: ['#FF6B35', '#F7931E', '#FFD23F', '#FF006E', '#FB5607'],
    names: {
      best: ['Sky Blue', 'Aqua', 'Cerulean', 'Ice Blue', 'Powder Blue', 'Seafoam', 'Dusty Rose', 'Mauve'],
      neutral: ['Alice Blue', 'Light Steel', 'Grey Blue', 'Cool Grey', 'Slate Grey'],
      avoid: ['Orange', 'Golden Orange', 'Yellow', 'Hot Pink', 'Coral']
    },
    metallic: 'silver',
    description: 'Cool, soft, and misty — like a garden after rain.',
    culturalVariants: {
      'south-asian': ['#90E0EF', '#48CAE4', '#0077B6', '#D4A5A5', '#9D8189', '#90E0EF'],
      'west-african': ['#90E0EF', '#48CAE4', '#B7E4C7', '#D4A5A5', '#9D8189', '#90E0EF'],
      'east-asian': ['#90E0EF', '#48CAE4', '#0077B6', '#D4A5A5', '#9D8189', '#90E0EF']
    }
  },
  'Light Summer': {
    best: ['#E0BBE4', '#957DAD', '#D291BC', '#FEC8D8', '#FFDFD3', '#AED9E0', '#B8F2E6', '#D4C5E2'],
    neutral: ['#FFF5F5', '#FFF0F5', '#F8F4FF', '#F0F0F0', '#E8E8E8'],
    avoid: ['#FF6B35', '#F7931E', '#FB5607', '#FF006E', '#D2691E'],
    names: {
      best: ['Lilac', 'Wisteria', 'Orchid', 'Candy Pink', 'Blush', 'Powder Blue', 'Aqua Mint', 'Lavender Grey'],
      neutral: ['Snow', 'Lavender Blush', 'Ghost White', 'White Smoke', 'Gainsboro'],
      avoid: ['Orange', 'Golden Orange', 'Coral', 'Hot Pink', 'Chocolate']
    },
    metallic: 'silver',
    description: 'Soft and ethereal — like watercolour on wet paper.',
    culturalVariants: {
      'south-asian': ['#E0BBE4', '#957DAD', '#D291BC', '#FEC8D8', '#FFDFD3', '#E0BBE4'],
      'west-african': ['#E0BBE4', '#957DAD', '#B8F2E6', '#FEC8D8', '#FFDFD3', '#E0BBE4'],
      'east-asian': ['#E0BBE4', '#957DAD', '#D291BC', '#FEC8D8', '#FFDFD3', '#E0BBE4']
    }
  },
  'Soft Summer': {
    best: ['#7B68EE', '#6A5ACD', '#9370DB', '#BC8F8F', '#D2B48C', '#8FBC8F', '#A9A9A9', '#778899'],
    neutral: ['#E8E8E8', '#D3D3D3', '#C0C0C0', '#A9A9A9', '#808080'],
    avoid: ['#FF6B35', '#FFD23F', '#FF006E', '#00FF00', '#FF4500'],
    names: {
      best: ['Medium Slate Blue', 'Slate Blue', 'Medium Purple', 'Rosy Brown', 'Tan', 'Dark Sea Green', 'Dark Grey', 'Light Slate Grey'],
      neutral: ['Light Grey', 'Grey', 'Silver', 'Dark Grey', 'Dim Grey'],
      avoid: ['Orange', 'Yellow', 'Hot Pink', 'Lime', 'Orange Red']
    },
    metallic: 'silver',
    description: 'Muted and sophisticated — like faded silk in an antique shop.',
    culturalVariants: {
      'south-asian': ['#7B68EE', '#6A5ACD', '#9370DB', '#BC8F8F', '#D2B48C', '#7B68EE'],
      'west-african': ['#7B68EE', '#6A5ACD', '#8FBC8F', '#BC8F8F', '#D2B48C', '#7B68EE'],
      'east-asian': ['#7B68EE', '#6A5ACD', '#9370DB', '#BC8F8F', '#D2B48C', '#7B68EE']
    }
  },
  'True Autumn': {
    best: ['#C97C3A', '#8B4513', '#D2691E', '#CD853F', '#DAA520', '#6B8E23', '#556B2F', '#A0522D'],
    neutral: ['#F5DEB3', '#DEB887', '#D2B48C', '#BC8F8F', '#8B7355'],
    avoid: ['#90E0EF', '#48CAE4', '#0077B6', '#E0BBE4', '#957DAD'],
    names: {
      best: ['Rust', 'Saddle Brown', 'Chocolate', 'Peru', 'Goldenrod', 'Olive Drab', 'Dark Olive Green', 'Sienna'],
      neutral: ['Wheat', 'Burlywood', 'Tan', 'Rosy Brown', 'Warm Brown'],
      avoid: ['Sky Blue', 'Aqua', 'Cerulean', 'Lilac', 'Wisteria']
    },
    metallic: 'gold',
    description: 'Warm, rich, and earthy — like fallen leaves in October.',
    culturalVariants: {
      'south-asian': ['#C97C3A', '#8B4513', '#D2691E', '#CD853F', '#DAA520', '#C97C3A'],
      'west-african': ['#C97C3A', '#8B4513', '#6B8E23', '#CD853F', '#DAA520', '#C97C3A'],
      'east-asian': ['#C97C3A', '#8B4513', '#D2691E', '#CD853F', '#DAA520', '#C97C3A']
    }
  },
  'Soft Autumn': {
    best: ['#BC8F8F', '#D2B48C', '#8B7355', '#A0522D', '#CD853F', '#6B8E23', '#556B2F', '#8FBC8F'],
    neutral: ['#F5F5DC', '#FAEBD7', '#FFE4C4', '#DEB887', '#D2B48C'],
    avoid: ['#90E0EF', '#48CAE4', '#0077B6', '#E0BBE4', '#FF006E'],
    names: {
      best: ['Rosy Brown', 'Tan', 'Warm Brown', 'Sienna', 'Peru', 'Olive Drab', 'Dark Olive Green', 'Dark Sea Green'],
      neutral: ['Beige', 'Antique White', 'Bisque', 'Burlywood', 'Tan'],
      avoid: ['Sky Blue', 'Aqua', 'Cerulean', 'Lilac', 'Hot Pink']
    },
    metallic: 'gold',
    description: 'Soft and warm — like aged parchment and dried herbs.',
    culturalVariants: {
      'south-asian': ['#BC8F8F', '#D2B48C', '#8B7355', '#A0522D', '#CD853F', '#BC8F8F'],
      'west-african': ['#BC8F8F', '#D2B48C', '#6B8E23', '#A0522D', '#CD853F', '#BC8F8F'],
      'east-asian': ['#BC8F8F', '#D2B48C', '#8B7355', '#A0522D', '#CD853F', '#BC8F8F']
    }
  },
  'Deep Autumn': {
    best: ['#8B0000', '#800000', '#A52A2A', '#556B2F', '#6B8E23', '#DAA520', '#B8860B', '#CD853F'],
    neutral: ['#DEB887', '#D2B48C', '#BC8F8F', '#8B7355', '#6B5B4F'],
    avoid: ['#90E0EF', '#48CAE4', '#E0BBE4', '#957DAD', '#FFB5A7'],
    names: {
      best: ['Dark Red', 'Maroon', 'Brown', 'Dark Olive Green', 'Olive Drab', 'Goldenrod', 'Dark Goldenrod', 'Peru'],
      neutral: ['Burlywood', 'Tan', 'Rosy Brown', 'Warm Brown', 'Coffee'],
      avoid: ['Sky Blue', 'Aqua', 'Lilac', 'Wisteria', 'Peach']
    },
    metallic: 'gold',
    description: 'Deep, warm, and intense — like burgundy wine and aged leather.',
    culturalVariants: {
      'south-asian': ['#8B0000', '#800000', '#A52A2A', '#DAA520', '#B8860B', '#8B0000'],
      'west-african': ['#8B0000', '#800000', '#556B2F', '#DAA520', '#B8860B', '#8B0000'],
      'east-asian': ['#8B0000', '#800000', '#A52A2A', '#DAA520', '#B8860B', '#8B0000']
    }
  },
  'True Winter': {
    best: ['#000080', '#0000CD', '#4169E1', '#9400D3', '#8A2BE2', '#FF1493', '#00CED1', '#1E90FF'],
    neutral: ['#FFFFFF', '#F0F0F0', '#D3D3D3', '#C0C0C0', '#A9A9A9'],
    avoid: ['#D2691E', '#CD853F', '#DAA520', '#8B7355', '#BC8F8F'],
    names: {
      best: ['Navy', 'Medium Blue', 'Royal Blue', 'Dark Violet', 'Blue Violet', 'Deep Pink', 'Dark Turquoise', 'Dodger Blue'],
      neutral: ['White', 'Snow', 'Light Grey', 'Silver', 'Dark Grey'],
      avoid: ['Chocolate', 'Peru', 'Goldenrod', 'Warm Brown', 'Rosy Brown']
    },
    metallic: 'silver',
    description: 'Cool, clear, and striking — like ice crystals and midnight sky.',
    culturalVariants: {
      'south-asian': ['#000080', '#0000CD', '#4169E1', '#9400D3', '#8A2BE2', '#000080'],
      'west-african': ['#000080', '#0000CD', '#00CED1', '#9400D3', '#8A2BE2', '#000080'],
      'east-asian': ['#000080', '#0000CD', '#4169E1', '#9400D3', '#8A2BE2', '#000080']
    }
  },
  'Deep Winter': {
    best: ['#000000', '#2F4F4F', '#483D8B', '#8B008B', '#4B0082', '#191970', '#00008B', '#8B0000'],
    neutral: ['#D3D3D3', '#C0C0C0', '#A9A9A9', '#808080', '#696969'],
    avoid: ['#D2691E', '#CD853F', '#DAA520', '#8B7355', '#F5DEB3'],
    names: {
      best: ['Black', 'Dark Slate Grey', 'Dark Slate Blue', 'Dark Magenta', 'Indigo', 'Midnight Blue', 'Dark Blue', 'Dark Red'],
      neutral: ['Light Grey', 'Silver', 'Dark Grey', 'Grey', 'Dim Grey'],
      avoid: ['Chocolate', 'Peru', 'Goldenrod', 'Warm Brown', 'Wheat']
    },
    metallic: 'silver',
    description: 'Dramatic and intense — like a starless night and polished onyx.',
    culturalVariants: {
      'south-asian': ['#000000', '#483D8B', '#8B008B', '#4B0082', '#191970', '#000000'],
      'west-african': ['#000000', '#2F4F4F', '#483D8B', '#8B008B', '#4B0082', '#000000'],
      'east-asian': ['#000000', '#483D8B', '#8B008B', '#4B0082', '#191970', '#000000']
    }
  },
  'Bright Winter': {
    best: ['#FF0000', '#0000FF', '#00FF00', '#FF00FF', '#00FFFF', '#FFFF00', '#FF1493', '#1E90FF'],
    neutral: ['#FFFFFF', '#F5F5F5', '#E8E8E8', '#D3D3D3', '#C0C0C0'],
    avoid: ['#D2691E', '#CD853F', '#DAA520', '#BC8F8F', '#F5DEB3'],
    names: {
      best: ['Pure Red', 'Pure Blue', 'Pure Green', 'Magenta', 'Cyan', 'Pure Yellow', 'Deep Pink', 'Dodger Blue'],
      neutral: ['White', 'White Smoke', 'Light Grey', 'Gainsboro', 'Silver'],
      avoid: ['Chocolate', 'Peru', 'Goldenrod', 'Rosy Brown', 'Wheat']
    },
    metallic: 'silver',
    description: 'Vivid and electric — like neon lights against black velvet.',
    culturalVariants: {
      'south-asian': ['#FF0000', '#0000FF', '#FF00FF', '#00FFFF', '#FF1493', '#FF0000'],
      'west-african': ['#FF0000', '#0000FF', '#00FF00', '#FF00FF', '#00FFFF', '#FF0000'],
      'east-asian': ['#FF0000', '#0000FF', '#FF00FF', '#00FFFF', '#FF1493', '#FF0000']
    }
  }
}

export function getPalette(season: string): ColorPalette {
  const palette = palettes[season]
  if (!palette) {
    throw new Error(`Unknown season: ${season}`)
  }
  return palette
}

export function getSeasonFromSubSeason(sub: string): string {
  const map: Record<string, string> = {
    'spring': 'True Spring',
    'summer': 'True Summer',
    'autumn': 'True Autumn',
    'winter': 'True Winter'
  }
  return map[sub.toLowerCase()] || 'True Autumn'
}

export function validateHex(hex: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(hex)
}

export function sanitizeHex(hex: string): string {
  let h = hex.trim()
  if (!h.startsWith('#')) h = '#' + h
  if (h.length === 4) {
    h = '#' + h[1] + h[1] + h[2] + h[2] + h[3] + h[3]
  }
  return h.toUpperCase()
}
