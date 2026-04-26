import { getPalette } from './colorPalettes'
import { getStyleRecommendations } from './styleRecommendations'
import { TIERS } from './constants'

export interface OutfitItem {
  category: string
  name: string
  description: string
  suggestedColors: string[]
  colorNames: string[]
  fabric?: string
}

export interface Outfit {
  id: string
  name: string
  occasion: string
  description: string
  items: OutfitItem[]
  colorSeason: string
  culturalContext: string
  gender: string
  styleNotes: string
  shoppingQuery: string
}

export interface OutfitSet {
  outfits: Outfit[]
  locked: number
  shown: number
  tier: 'free' | 'pro'
}

const OCCASIONS = [
  'everyday casual',
  'work professional',
  'evening formal',
  'wedding guest',
  'date night',
  'weekend brunch',
  'beach resort',
  'business casual',
  'cocktail party',
  'black tie',
  'festival',
  'travel'
]

function generateId(): string {
  return Math.random().toString(36).substring(2, 10)
}

function pickColors(palette: any, count: number): { colors: string[]; names: string[] } {
  const best = palette.best.slice(0, count)
  const names = best.map((hex: string) => palette.names.best[palette.best.indexOf(hex)] || hex)
  return { colors: best, names }
}

function buildOutfitTemplate(
  occasion: string,
  season: string,
  palette: any,
  gender: string,
  culturalContext: string
): Outfit {
  const isFeminine = gender === 'feminine'
  const isMasculine = gender === 'masculine'
  const { colors, names } = pickColors(palette, 4)

  let items: OutfitItem[] = []
  let outfitName = ''
  let description = ''
  let shoppingQuery = ''

  // Occasion templates
  switch (occasion) {
    case 'everyday casual':
      outfitName = 'Effortless Day'
      description = 'Relaxed yet polished for daily wear'
      shoppingQuery = isFeminine ? 'casual dress relaxed fit' : 'casual chinos crew neck'
      items = isFeminine
        ? [
            { category: 'Top', name: 'Soft knit tee', description: 'Breathable cotton in your palette', suggestedColors: [colors[0], colors[1]], colorNames: [names[0], names[1]], fabric: 'cotton' },
            { category: 'Bottom', name: 'Tailored jeans', description: 'Mid-rise with a clean leg line', suggestedColors: ['#3D405B'], colorNames: ['Neutral Denim'], fabric: 'denim' },
            { category: 'Layer', name: 'Light cardigan', description: 'Easy throw-on for layering', suggestedColors: [colors[2]], colorNames: [names[2]], fabric: 'cashmere' },
            { category: 'Shoes', name: 'Leather loafers', description: 'Comfortable walk-all-day style', suggestedColors: ['#6B5B4F'], colorNames: ['Tan Leather'], fabric: 'leather' }
          ]
        : [
            { category: 'Top', name: 'Crew neck tee', description: 'Premium cotton in your best colour', suggestedColors: [colors[0]], colorNames: [names[0]], fabric: 'cotton' },
            { category: 'Bottom', name: 'Slim chinos', description: 'Versatile neutral with a clean taper', suggestedColors: ['#5C5C5C'], colorNames: ['Stone'], fabric: 'cotton' },
            { category: 'Layer', name: 'Lightweight overshirt', description: 'Structured without being heavy', suggestedColors: [colors[1]], colorNames: [names[1]], fabric: 'linen' },
            { category: 'Shoes', name: 'Minimal trainers', description: 'Clean, understated silhouette', suggestedColors: ['#FFFFFF'], colorNames: ['White'], fabric: 'leather' }
          ]
      break

    case 'work professional':
      outfitName = 'Boardroom Ready'
      description = 'Commanding presence with colour confidence'
      shoppingQuery = isFeminine ? 'tailored blazer trousers suit women' : 'tailored suit mens professional'
      items = isFeminine
        ? [
            { category: 'Top', name: 'Silk blouse', description: 'Fluid drape, structured collar', suggestedColors: [colors[0]], colorNames: [names[0]], fabric: 'silk' },
            { category: 'Bottom', name: 'Tailored trousers', description: 'High-waisted, wide-leg', suggestedColors: [colors[3]], colorNames: [names[3]], fabric: 'wool' },
            { category: 'Layer', name: 'Structured blazer', description: 'Single-breasted, nipped waist', suggestedColors: [colors[1]], colorNames: [names[1]], fabric: 'wool' },
            { category: 'Shoes', name: 'Pointed pumps', description: 'Classic heel height for all-day wear', suggestedColors: ['#1A1A1A'], colorNames: ['Black'], fabric: 'leather' }
          ]
        : [
            { category: 'Top', name: 'Crisp dress shirt', description: 'Structured collar, tailored fit', suggestedColors: [colors[0]], colorNames: [names[0]], fabric: 'cotton' },
            { category: 'Bottom', name: 'Tailored trousers', description: 'Flat front, slight taper', suggestedColors: [colors[3]], colorNames: [names[3]], fabric: 'wool' },
            { category: 'Layer', name: 'Two-button blazer', description: 'Classic notch lapel', suggestedColors: [colors[1]], colorNames: [names[1]], fabric: 'wool' },
            { category: 'Shoes', name: 'Oxford shoes', description: 'Cap-toe, polished leather', suggestedColors: ['#1A1A1A'], colorNames: ['Black'], fabric: 'leather' }
          ]
      break

    case 'evening formal':
      outfitName = 'After Hours'
      description = 'Sophisticated evening elegance'
      shoppingQuery = isFeminine ? 'evening gown formal dress' : 'tuxedo dinner jacket formal mens'
      items = isFeminine
        ? [
            { category: 'Dress', name: 'Floor-length gown', description: 'Fluid silhouette in your best evening shade', suggestedColors: [colors[0], colors[3]], colorNames: [names[0], names[3]], fabric: 'silk' },
            { category: 'Accessory', name: 'Metallic clutch', description: `${palette.metallic}-tone evening bag`, suggestedColors: palette.metallic === 'gold' ? ['#D4AF37'] : ['#C0C0C0'], colorNames: [palette.metallic] },
            { category: 'Shoes', name: 'Strappy heels', description: 'Elegant height with secure ankle strap', suggestedColors: ['#1A1A1A'], colorNames: ['Black Satin'], fabric: 'satin' }
          ]
        : [
            { category: 'Top', name: 'Dinner jacket', description: 'Silk lapel, tailored cut', suggestedColors: ['#1A1A1A'], colorNames: ['Midnight'], fabric: 'wool' },
            { category: 'Bottom', name: 'Tuxedo trousers', description: 'Satin stripe detail', suggestedColors: ['#1A1A1A'], colorNames: ['Black'], fabric: 'wool' },
            { category: 'Shirt', name: 'Pleated bib shirt', description: 'Wing collar, French cuffs', suggestedColors: ['#FFFFFF'], colorNames: ['White'], fabric: 'cotton' },
            { category: 'Accessory', name: 'Bow tie & cummerbund', description: 'Silk in a tonal accent', suggestedColors: [colors[0]], colorNames: [names[0]], fabric: 'silk' }
          ]
      break

    case 'wedding guest':
      outfitName = 'Celebration Chic'
      description = 'Respectful, radiant, and photogenic'
      shoppingQuery = isFeminine ? 'wedding guest dress elegant' : 'wedding guest suit smart'
      items = isFeminine
        ? [
            { category: 'Dress', name: 'Midi cocktail dress', description: 'Flattering length, no white or ivory', suggestedColors: [colors[0], colors[2]], colorNames: [names[0], names[2]], fabric: 'chiffon' },
            { category: 'Accessory', name: 'Statement earrings', description: `${palette.metallic} drops or chandelier style`, suggestedColors: palette.metallic === 'gold' ? ['#D4AF37'] : ['#C0C0C0'], colorNames: [palette.metallic] },
            { category: 'Shoes', name: 'Block-heel sandals', description: 'Stable for outdoor venues', suggestedColors: [colors[3]], colorNames: [names[3]], fabric: 'leather' }
          ]
        : [
            { category: 'Top', name: 'Lightweight suit jacket', description: 'Unlined or half-lined for comfort', suggestedColors: [colors[1]], colorNames: [names[1]], fabric: 'linen' },
            { category: 'Bottom', name: 'Tailored trousers', description: 'Cropped or full length', suggestedColors: [colors[3]], colorNames: [names[3]], fabric: 'cotton' },
            { category: 'Shirt', name: 'Patterned shirt', description: 'Subtle print in your palette', suggestedColors: [colors[0]], colorNames: [names[0]], fabric: 'cotton' },
            { category: 'Shoes', name: 'Leather brogues', description: 'Polished but not overly formal', suggestedColors: ['#8B7355'], colorNames: ['Tan'], fabric: 'leather' }
          ]
      break

    case 'date night':
      outfitName = 'Romantic Edge'
      description = 'Alluring without trying too hard'
      shoppingQuery = isFeminine ? 'date night dress top jeans' : 'date night shirt dark jeans mens'
      items = isFeminine
        ? [
            { category: 'Top', name: 'Satin camisole', description: 'Delicate straps, flattering neckline', suggestedColors: [colors[0]], colorNames: [names[0]], fabric: 'silk' },
            { category: 'Bottom', name: 'High-waisted trousers', description: 'Wide-leg or tapered', suggestedColors: ['#1A1A1A'], colorNames: ['Black'], fabric: 'crepe' },
            { category: 'Layer', name: 'Cropped blazer', description: 'Structured shoulder, nipped waist', suggestedColors: [colors[1]], colorNames: [names[1]], fabric: 'wool' },
            { category: 'Shoes', name: 'Strappy stilettos', description: 'Minimal straps, maximum impact', suggestedColors: [colors[3]], colorNames: [names[3]], fabric: 'leather' }
          ]
        : [
            { category: 'Top', name: 'Fine-gauge knit polo', description: 'Textured, fitted, modern', suggestedColors: [colors[0]], colorNames: [names[0]], fabric: 'merino' },
            { category: 'Bottom', name: 'Dark selvedge jeans', description: 'Slim straight, clean hem', suggestedColors: ['#2D3142'], colorNames: ['Indigo'], fabric: 'denim' },
            { category: 'Layer', name: 'Unstructured blazer', description: 'Soft shoulder, casual elegance', suggestedColors: [colors[1]], colorNames: [names[1]], fabric: 'cotton' },
            { category: 'Shoes', name: 'Chelsea boots', description: 'Sleek leather, minimal detail', suggestedColors: ['#3D405B'], colorNames: ['Dark Brown'], fabric: 'leather' }
          ]
      break

    case 'weekend brunch':
      outfitName = 'Sunday Best'
      description = 'Bright, fresh, and effortlessly social'
      shoppingQuery = isFeminine ? 'brunch dress casual sundress' : 'brunch shirt chinos casual mens'
      items = isFeminine
        ? [
            { category: 'Dress', name: 'Wrap sundress', description: 'Flattering, adjustable, easy', suggestedColors: [colors[0], colors[1]], colorNames: [names[0], names[1]], fabric: 'linen' },
            { category: 'Accessory', name: 'Woven bag', description: 'Natural texture, neutral tone', suggestedColors: ['#E8D5B7'], colorNames: ['Natural'], fabric: 'raffia' },
            { category: 'Shoes', name: 'Espadrille wedges', description: 'Comfortable height, casual glamour', suggestedColors: [colors[2]], colorNames: [names[2]], fabric: 'canvas' }
          ]
        : [
            { category: 'Top', name: 'Oxford shirt', description: 'Relaxed fit, rolled sleeves', suggestedColors: [colors[0]], colorNames: [names[0]], fabric: 'linen' },
            { category: 'Bottom', name: 'Chino shorts', description: 'Tailored length, just above knee', suggestedColors: [colors[3]], colorNames: [names[3]], fabric: 'cotton' },
            { category: 'Layer', name: 'Lightweight sweater', description: 'Draped over shoulders', suggestedColors: [colors[1]], colorNames: [names[1]], fabric: 'cotton' },
            { category: 'Shoes', name: 'Leather boat shoes', description: 'Classic, comfortable, casual', suggestedColors: ['#8B7355'], colorNames: ['Tan'], fabric: 'leather' }
          ]
      break

    case 'beach resort':
      outfitName = 'Coastal Luxe'
      description = 'Sun-ready sophistication'
      shoppingQuery = isFeminine ? 'resort wear maxi dress beach' : 'resort shirt linen beach mens'
      items = isFeminine
        ? [
            { category: 'Swim', name: 'One-piece swimsuit', description: 'Sculpted, supportive, chic', suggestedColors: [colors[0]], colorNames: [names[0]], fabric: 'lycra' },
            { category: 'Cover', name: 'Sheer maxi kaftan', description: 'Airflow and elegance combined', suggestedColors: [colors[1]], colorNames: [names[1]], fabric: 'chiffon' },
            { category: 'Accessory', name: 'Wide-brim hat', description: 'Sun protection with style', suggestedColors: ['#F5E6D3'], colorNames: ['Natural Straw'] },
            { category: 'Shoes', name: 'Leather sandals', description: 'Flat, strappy, walkable', suggestedColors: [colors[2]], colorNames: [names[2]], fabric: 'leather' }
          ]
        : [
            { category: 'Top', name: 'Cuban collar shirt', description: 'Relaxed, camp collar, vacation energy', suggestedColors: [colors[0]], colorNames: [names[0]], fabric: 'linen' },
            { category: 'Bottom', name: 'Tailored swim shorts', description: 'Quick-dry, tailored cut', suggestedColors: [colors[1]], colorNames: [names[1]], fabric: 'nylon' },
            { category: 'Layer', name: 'Linen overshirt', description: 'Sun protection, easy layers', suggestedColors: [colors[2]], colorNames: [names[2]], fabric: 'linen' },
            { category: 'Shoes', name: 'Espadrilles', description: 'Breathable, casual, coastal', suggestedColors: ['#E8D5B7'], colorNames: ['Natural'], fabric: 'canvas' }
          ]
      break

    case 'business casual':
      outfitName = 'Smart Casual'
      description = 'Polished without being stiff'
      shoppingQuery = isFeminine ? 'business casual women blazer trousers' : 'business casual mens chinos blazer'
      items = isFeminine
        ? [
            { category: 'Top', name: 'Knit polo', description: 'Structured collar, fitted body', suggestedColors: [colors[0]], colorNames: [names[0]], fabric: 'merino' },
            { category: 'Bottom', name: 'Cigarette trousers', description: 'Cropped, slim, versatile', suggestedColors: [colors[3]], colorNames: [names[3]], fabric: 'crepe' },
            { category: 'Layer', name: 'Soft blazer', description: 'Unlined, comfortable, professional', suggestedColors: [colors[1]], colorNames: [names[1]], fabric: 'wool' },
            { category: 'Shoes', name: 'Loafers', description: 'Slip-on, leather, polished', suggestedColors: ['#6B5B4F'], colorNames: ['Tan'], fabric: 'leather' }
          ]
        : [
            { category: 'Top', name: 'Button-down shirt', description: 'Subtle texture, tailored fit', suggestedColors: [colors[0]], colorNames: [names[0]], fabric: 'cotton' },
            { category: 'Bottom', name: 'Chinos', description: 'Slim fit, clean break', suggestedColors: [colors[3]], colorNames: [names[3]], fabric: 'cotton' },
            { category: 'Layer', name: 'Unstructured blazer', description: 'Soft shoulder, modern cut', suggestedColors: [colors[1]], colorNames: [names[1]], fabric: 'cotton' },
            { category: 'Shoes', name: 'Derby shoes', description: 'Open lacing, versatile', suggestedColors: ['#8B7355'], colorNames: ['Tan'], fabric: 'leather' }
          ]
      break

    case 'cocktail party':
      outfitName = 'Cocktail Hour'
      description = 'Chic, spirited, and memorable'
      shoppingQuery = isFeminine ? 'cocktail dress party midi' : 'cocktail attire mens dark suit'
      items = isFeminine
        ? [
            { category: 'Dress', name: 'Cocktail midi', description: 'Structured bodice, fluid skirt', suggestedColors: [colors[0], colors[3]], colorNames: [names[0], names[3]], fabric: 'satin' },
            { category: 'Accessory', name: 'Statement clutch', description: 'Embellished or metallic', suggestedColors: palette.metallic === 'gold' ? ['#D4AF37'] : ['#C0C0C0'], colorNames: [palette.metallic] },
            { category: 'Shoes', name: 'Slingback heels', description: 'Elegant, secure, danceable', suggestedColors: [colors[1]], colorNames: [names[1]], fabric: 'satin' }
          ]
        : [
            { category: 'Top', name: 'Silk dinner shirt', description: 'French cuffs, no tie needed', suggestedColors: [colors[0]], colorNames: [names[0]], fabric: 'silk' },
            { category: 'Bottom', name: 'Dark trousers', description: 'Slim, no break', suggestedColors: ['#2D3142'], colorNames: ['Charcoal'], fabric: 'wool' },
            { category: 'Layer', name: 'Velvet blazer', description: 'Rich texture, slim lapel', suggestedColors: [colors[1]], colorNames: [names[1]], fabric: 'velvet' },
            { category: 'Shoes', name: 'Patent loafers', description: 'Glossy, minimal, modern', suggestedColors: ['#1A1A1A'], colorNames: ['Black'], fabric: 'leather' }
          ]
      break

    case 'black tie':
      outfitName = 'Black Tie'
      description = 'Peak formal elegance'
      shoppingQuery = isFeminine ? 'black tie gown formal evening' : 'black tie tuxedo white tie mens'
      items = isFeminine
        ? [
            { category: 'Dress', name: 'Evening gown', description: 'Floor-length, formal fabric', suggestedColors: [colors[0], colors[3]], colorNames: [names[0], names[3]], fabric: 'silk' },
            { category: 'Accessory', name: 'Evening clutch', description: 'Minimal, metallic', suggestedColors: palette.metallic === 'gold' ? ['#D4AF37'] : ['#C0C0C0'], colorNames: [palette.metallic] },
            { category: 'Shoes', name: 'Evening sandals', description: 'Strappy, refined', suggestedColors: [colors[2]], colorNames: [names[2]], fabric: 'satin' }
          ]
        : [
            { category: 'Top', name: 'Tuxedo jacket', description: 'Peak or shawl lapel, satin trim', suggestedColors: ['#1A1A1A'], colorNames: ['Black'], fabric: 'wool' },
            { category: 'Bottom', name: 'Tuxedo trousers', description: 'Satin side stripe', suggestedColors: ['#1A1A1A'], colorNames: ['Black'], fabric: 'wool' },
            { category: 'Shirt', name: 'Pleated front shirt', description: 'Wing collar, studs', suggestedColors: ['#FFFFFF'], colorNames: ['White'], fabric: 'cotton' },
            { category: 'Accessory', name: 'Cummerbund & bow tie', description: 'Colour-matched to your season', suggestedColors: [colors[0]], colorNames: [names[0]], fabric: 'silk' }
          ]
      break

    case 'festival':
      outfitName = 'Festival Spirit'
      description = 'Bold, free, and sun-soaked'
      shoppingQuery = isFeminine ? 'festival outfit boho dress' : 'festival shirt shorts mens'
      items = isFeminine
        ? [
            { category: 'Top', name: 'Cropped bohemian top', description: 'Flowing sleeves, embroidered detail', suggestedColors: [colors[0], colors[1]], colorNames: [names[0], names[1]], fabric: 'cotton' },
            { category: 'Bottom', name: 'High-waisted shorts', description: 'Denim or lightweight fabric', suggestedColors: [colors[2]], colorNames: [names[2]], fabric: 'denim' },
            { category: 'Layer', name: 'Kimono or cape', description: 'Sheer, patterned, dramatic', suggestedColors: [colors[3]], colorNames: [names[3]], fabric: 'chiffon' },
            { category: 'Shoes', name: 'Ankle boots', description: 'Comfortable, sturdy, stylish', suggestedColors: ['#6B5B4F'], colorNames: ['Tan Suede'], fabric: 'suede' }
          ]
        : [
            { category: 'Top', name: 'Graphic or patterned shirt', description: 'Open collar, relaxed fit', suggestedColors: [colors[0]], colorNames: [names[0]], fabric: 'cotton' },
            { category: 'Bottom', name: 'Cargo or utility shorts', description: 'Relaxed, practical', suggestedColors: [colors[1]], colorNames: [names[1]], fabric: 'cotton' },
            { category: 'Layer', name: 'Denim or utility jacket', description: 'Layered, weather-ready', suggestedColors: ['#3D405B'], colorNames: ['Dark Denim'], fabric: 'denim' },
            { category: 'Shoes', name: 'Boots or trainers', description: 'Comfortable for all-day standing', suggestedColors: ['#6B5B4F'], colorNames: ['Tan'], fabric: 'leather' }
          ]
      break

    case 'travel':
      outfitName = 'Jet Set'
      description = 'Comfortable, crease-free, and polished'
      shoppingQuery = isFeminine ? 'travel outfit comfortable dress leggings' : 'travel outfit comfortable mens chinos'
      items = isFeminine
        ? [
            { category: 'Top', name: 'Soft tunic or longline tee', description: 'Draped, breathable, layerable', suggestedColors: [colors[0]], colorNames: [names[0]], fabric: 'modal' },
            { category: 'Bottom', name: 'Ponte leggings or joggers', description: 'Structured comfort, no sag', suggestedColors: [colors[3]], colorNames: [names[3]], fabric: 'ponte' },
            { category: 'Layer', name: 'Cashmere wrap or cardigan', description: 'Warmth without bulk', suggestedColors: [colors[1]], colorNames: [names[1]], fabric: 'cashmere' },
            { category: 'Shoes', name: 'Slip-on loafers or trainers', description: 'Easy on/off, walkable', suggestedColors: ['#8B7355'], colorNames: ['Taupe'], fabric: 'leather' }
          ]
        : [
            { category: 'Top', name: 'Performance polo', description: 'Wrinkle-resistant, breathable', suggestedColors: [colors[0]], colorNames: [names[0]], fabric: 'merino' },
            { category: 'Bottom', name: 'Travel chinos', description: 'Stretch, wrinkle-free', suggestedColors: [colors[3]], colorNames: [names[3]], fabric: 'nylon blend' },
            { category: 'Layer', name: 'Lightweight bomber or blazer', description: 'Structured, packable', suggestedColors: [colors[1]], colorNames: [names[1]], fabric: 'cotton' },
            { category: 'Shoes', name: 'Slip-on trainers or loafers', description: 'Comfortable, easy security check', suggestedColors: ['#6B5B4F'], colorNames: ['Taupe'], fabric: 'leather' }
          ]
      break

    default:
      outfitName = 'Signature Look'
      description = 'Your palette, your way'
      shoppingQuery = 'smart casual outfit'
      items = [
        { category: 'Top', name: 'Essential top', description: 'Your best colour, tailored fit', suggestedColors: [colors[0]], colorNames: [names[0]], fabric: 'cotton' },
        { category: 'Bottom', name: 'Versatile bottoms', description: 'Neutral, flattering cut', suggestedColors: [colors[3]], colorNames: [names[3]], fabric: 'cotton' }
      ]
  }

  // Cultural adjustments
  let styleNotes = ''
  if (culturalContext === 'south-asian' && occasion === 'wedding guest') {
    styleNotes = 'Consider a lehenga or saree in your seasonal palette. Rich brocades and zari work in your metallic tone elevate the look.'
    if (isFeminine) {
      items.unshift({ category: 'Alternative', name: 'Lehenga set', description: 'Skirt, blouse (choli), and dupatta in palette colours', suggestedColors: [colors[0], colors[1], colors[2]], colorNames: [names[0], names[1], names[2]], fabric: 'silk brocade' })
    }
  } else if (culturalContext === 'middle-eastern' && (occasion === 'evening formal' || occasion === 'black tie')) {
    styleNotes = 'An abaya or kaftan in your palette with metallic embroidery creates stunning modest elegance.'
    if (isFeminine) {
      items.unshift({ category: 'Alternative', name: 'Embellished kaftan', description: 'Flowing silhouette with subtle beading in your metallic', suggestedColors: [colors[0], colors[3]], colorNames: [names[0], names[3]], fabric: 'chiffon' })
    }
  } else if (culturalContext === 'west-african' && (occasion === 'wedding guest' || occasion === 'evening formal')) {
    styleNotes = 'Aso-ebi or Ankara styles in your seasonal colours make a vibrant, respectful statement.'
    if (isFeminine) {
      items.unshift({ category: 'Alternative', name: 'Aso-ebi set', description: 'Co-ordinated wrap skirt and blouse in wax print', suggestedColors: [colors[0], colors[1]], colorNames: [names[0], names[1]], fabric: 'wax cotton' })
    }
  } else {
    styleNotes = `This outfit is tailored for ${occasion} within your ${season} palette and ${culturalContext} context.`
  }

  return {
    id: generateId(),
    name: outfitName,
    occasion,
    description,
    items,
    colorSeason: season,
    culturalContext,
    gender,
    styleNotes,
    shoppingQuery
  }
}

export function generateOutfits(
  season: string,
  faceShape: string,
  bodyProportions: any,
  gender: string,
  culturalContext: string,
  occasion: string,
  tier: 'free' | 'pro'
): OutfitSet {
  const palette = getPalette(season)
  const styleRecs = getStyleRecommendations(season, faceShape, bodyProportions, gender, culturalContext)

  // Build primary outfit for requested occasion
  const primary = buildOutfitTemplate(occasion, season, palette, gender, culturalContext)
  primary.styleNotes += ` ${styleRecs.necklineAdvice} ${styleRecs.silhouetteAdvice}`

  // Build complementary outfits: one for same occasion with different vibe, one contrasting occasion
  const altOccasion = occasion === 'everyday casual' ? 'work professional' : 'everyday casual'
  const alt1 = buildOutfitTemplate(occasion, season, palette, gender, culturalContext)
  alt1.name = alt1.name + ' (Alt)'
  alt1.description = 'A fresh take on the same occasion'
  alt1.id = generateId()

  const alt2 = buildOutfitTemplate(altOccasion, season, palette, gender, culturalContext)
  alt2.id = generateId()

  const alt3 = buildOutfitTemplate('evening formal', season, palette, gender, culturalContext)
  alt3.id = generateId()

  const allOutfits = [primary, alt1, alt2, alt3]

  // Apply tier gating
  const shown = TIERS[tier.toUpperCase() as 'FREE' | 'PRO'].outfitsShown
  const locked = TIERS[tier.toUpperCase() as 'FREE' | 'PRO'].outfitsLocked

  return {
    outfits: allOutfits,
    locked,
    shown,
    tier
  }
}

export { OCCASIONS }
