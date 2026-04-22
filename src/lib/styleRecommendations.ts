import { getPalette } from './colorPalettes'

export interface StyleRecommendations {
  patterns: string[]
  avoidPatterns: string[]
  fabrics: string[]
  metals: string
  necklineAdvice: string
  silhouetteAdvice: string
  hemlineAdvice: string
  layeringAdvice: string
  culturalNotes: string
}

export function getStyleRecommendations(
  season: string,
  faceShape: string,
  bodyProportions: any,
  gender: string,
  culturalContext: string
): StyleRecommendations {
  const palette = getPalette(season)
  const isWarm = season.toLowerCase().includes('spring') || season.toLowerCase().includes('autumn')
  const isSoft = season.toLowerCase().includes('soft') || season.toLowerCase().includes('light')
  const isDeep = season.toLowerCase().includes('deep') || season.toLowerCase().includes('bright')

  // Base recommendations
  const patterns = isSoft
    ? ['soft florals', 'watercolour prints', 'subtle textures', 'tone-on-tone']
    : isDeep
      ? ['bold geometrics', 'strong stripes', 'abstract prints', 'high contrast']
      : ['classic florals', 'small prints', 'subtle checks', 'soft textures']

  const avoidPatterns = isWarm
    ? ['icy pastels', 'neon brights', 'cool-toned patterns']
    : ['earthy browns', 'orange-reds', 'warm mustard']

  const fabrics = isSoft
    ? ['cashmere', 'silk', 'chiffon', 'fine cotton', 'linen']
    : ['wool', 'tweed', 'leather', 'denim', 'structured cotton']

  const metals = palette.metallic

  // Neckline advice based on face shape
  const necklineMap: Record<string, string> = {
    'oval': 'Most necklines suit you — V-necks and scoop necks are especially flattering',
    'round': 'V-necks and deep scoop necks elongate your face. Avoid high necklines',
    'square': 'Soft necklines like cowl and scoop balance your jawline. Avoid square necklines',
    'heart': 'Boat necks and wide necklines balance a narrower jaw. Avoid plunging V-necks',
    'oblong': 'High necklines and turtlenecks shorten your face. Avoid deep V-necks',
    'diamond': 'Halter and high necklines complement your cheekbones'
  }

  // Silhouette advice based on body proportions
  const shoulder = bodyProportions?.shoulderToHip || 'balanced'
  const torso = bodyProportions?.torsoLength || 'average'

  let silhouetteAdvice = 'A balanced silhouette works well for your proportions'
  if (shoulder === 'broad-shoulders') {
    silhouetteAdvice = 'A-line and fit-and-flare styles balance broader shoulders. Avoid puff sleeves'
  } else if (shoulder === 'broad-hips') {
    silhouetteAdvice = 'Structured shoulders and boat necks add width up top. Avoid hip details'
  } else if (shoulder === 'narrow') {
    silhouetteAdvice = 'Shoulder pads and structured jackets add width. Avoid drop shoulders'
  }

  if (torso === 'long') {
    silhouetteAdvice += '. High-waisted styles shorten your torso'
  } else if (torso === 'short') {
    silhouetteAdvice += '. Empire waist and vertical lines elongate your torso'
  }

  // Hemline advice
  const hemlineAdvice = gender === 'feminine'
    ? 'Midi and knee-length hemlines are universally flattering. Adjust based on leg proportion'
    : 'Trousers should break at the shoe for a clean line. Shorts should end above the knee'

  // Layering advice
  const layeringAdvice = isSoft
    ? 'Soft, flowing layers in coordinating tones create depth without harshness'
    : 'Structured layers with clear contrast between pieces create visual interest'

  // Cultural notes
  const culturalNotes = getCulturalStyleNotes(culturalContext, season)

  return {
    patterns,
    avoidPatterns,
    fabrics,
    metals,
    necklineAdvice: necklineMap[faceShape] || 'V-necks and scoop necks are generally flattering',
    silhouetteAdvice,
    hemlineAdvice,
    layeringAdvice,
    culturalNotes
  }
}

function getCulturalStyleNotes(context: string, season: string): string {
  const notes: Record<string, string> = {
    'global-western': 'Contemporary Western styling applies directly to your palette',
    'south-asian': 'Consider rich silks, brocades, and traditional embroidery in your seasonal colours. Saree and lehenga styling benefits from your palette\'s warmth or coolness',
    'west-african': 'Bold wax prints and Ankara fabrics work beautifully when colour-matched to your season. Wrap styles and structured tailoring both suit',
    'east-asian': 'Clean lines and minimal silhouettes complement your palette. Consider hanbok-inspired colour blocking or cheongsam elegance in your colours',
    'middle-eastern': 'Luxurious fabrics like silk and chiffon in your palette create stunning abaya and kaftan styling. Gold or silver accents based on your metallic',
    'latin-american': 'Vibrant colours in your palette work for fiesta and formal wear. Flowing silhouettes with bold accessories'
  }
  return notes[context] || notes['global-western']
}
