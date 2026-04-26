export interface BodyTypeAdvice {
  bodyShape: string
  silhouetteGoal: string
  fitAdvice: string[]
  proportionTips: string[]
  avoidShapes: string[]
  recommendedShapes: string[]
}

interface ProportionInput {
  shoulderToHip?: 'balanced' | 'broad-shoulders' | 'broad-hips' | 'narrow'
  torsoLength?: 'average' | 'long' | 'short'
  height?: 'petite' | 'average' | 'tall'
  build?: 'slender' | 'average' | 'curvy' | 'athletic'
}

export function getBodyTypeAdvice(proportions: ProportionInput): BodyTypeAdvice {
  const { shoulderToHip = 'balanced', torsoLength = 'average', height = 'average', build = 'average' } = proportions

  let bodyShape = 'balanced'
  if (shoulderToHip === 'broad-shoulders') bodyShape = 'inverted-triangle'
  else if (shoulderToHip === 'broad-hips') bodyShape = 'pear'
  else if (shoulderToHip === 'narrow') bodyShape = 'rectangle'
  else if (build === 'curvy') bodyShape = 'hourglass'
  else if (build === 'athletic') bodyShape = 'athletic'

  const adviceMap: Record<string, BodyTypeAdvice> = {
    'hourglass': {
      bodyShape: 'hourglass',
      silhouetteGoal: 'Highlight your defined waist and balanced proportions',
      fitAdvice: [
        'Tailored garments that follow your natural curves',
        'Wrap dresses and belted styles emphasize your waist',
        'Stretch fabrics with structure hold their shape'
      ],
      proportionTips: [
        'Keep top and bottom volumes balanced',
        'Avoid boxy cuts that hide your waist',
        'High-waisted bottoms elongate legs'
      ],
      avoidShapes: ['boxy tunics', 'straight-cut dresses', 'low-rise bottoms'],
      recommendedShapes: ['fit-and-flare', 'wrap', 'tailored sheath', 'high-waisted']
    },
    'pear': {
      bodyShape: 'pear',
      silhouetteGoal: 'Balance narrower shoulders with fuller hips and thighs',
      fitAdvice: [
        'Structured shoulders and details add width up top',
        'A-line skirts and dresses skim over hips',
        'Dark, clean colours on bottom with lighter or brighter tops'
      ],
      proportionTips: [
        'Boat necks and off-shoulder styles broaden shoulders visually',
        'Avoid pocket detail, pleats, or embellishments on hips',
        'Wide-leg trousers balance lower body volume'
      ],
      avoidShapes: ['pencil skirts', 'hip pockets', 'drop-waist dresses', 'skinny jeans'],
      recommendedShapes: ['A-line', 'empire waist', 'fit-and-flare', 'wide-leg', 'boat neck']
    },
    'inverted-triangle': {
      bodyShape: 'inverted-triangle',
      silhouetteGoal: 'Soften broad shoulders and add volume to lower body',
      fitAdvice: [
        'Avoid shoulder pads, epaulettes, and puff sleeves',
        'V-necks and vertical lines minimise shoulder width',
        'Fuller skirts and wide-leg trousers add lower-body balance'
      ],
      proportionTips: [
        'Keep tops simple and unembellished at the shoulder',
        'Bright or textured bottoms draw the eye downward',
        'Layer with open-front cardigans to break up shoulder line'
      ],
      avoidShapes: ['halter necks', 'boat necks', 'structured shoulders', 'cape sleeves'],
      recommendedShapes: ['A-line', 'peplum', 'wide-leg', 'bootcut', 'V-neck']
    },
    'rectangle': {
      bodyShape: 'rectangle',
      silhouetteGoal: 'Create the illusion of curves and waist definition',
      fitAdvice: [
        'Belts, ruching, and colour-blocking define the waist',
        'Layered pieces add dimension and shape',
        'Peplum and gathered styles create curves'
      ],
      proportionTips: [
        'Use contrasting colours at the waist to break up the line',
        'Scoop and sweetheart necklines add softness',
        'Volume on top or bottom — not both — creates shape'
      ],
      avoidShapes: ['boxy shifts', 'straight sheaths without waist detail', 'oversized everything'],
      recommendedShapes: ['peplum', 'belted', 'fit-and-flare', 'ruched', 'colour-blocked']
    },
    'athletic': {
      bodyShape: 'athletic',
      silhouetteGoal: 'Soften a strong frame while celebrating muscle tone',
      fitAdvice: [
        'Soft fabrics with drape contrast with a strong frame',
        'Feminine details like ruffles and draping add softness',
        'Stretch fabrics accommodate broader shoulders and thighs'
      ],
      proportionTips: [
        'Scoop and V-necks soften a strong shoulder line',
        'Draped or asymmetrical hemlines add movement',
        'Avoid overly tight or overly stiff cuts'
      ],
      avoidShapes: ['boxy utility jackets', 'skinny jeans on muscular legs', 'high necklines'],
      recommendedShapes: ['wrap', 'draped', 'A-line', 'soft tailoring', 'scoop neck']
    },
    'balanced': {
      bodyShape: 'balanced',
      silhouetteGoal: 'Maintain harmony with versatile, well-proportioned pieces',
      fitAdvice: [
        'Most silhouettes work — focus on fit quality',
        'Tailored pieces elevate any proportion',
        'Experiment with trends since your frame is forgiving'
      ],
      proportionTips: [
        'Use the rule of thirds when layering',
        'Monochrome looks elongate and unify',
        'A well-fitted blazer is your wardrobe MVP'
      ],
      avoidShapes: ['nothing specifically — focus on fit over shape'],
      recommendedShapes: ['tailored', 'A-line', 'straight', 'fit-and-flare', 'wrap']
    }
  }

  const baseAdvice = adviceMap[bodyShape] || adviceMap['balanced']

  // Height adjustments
  if (height === 'petite') {
    baseAdvice.proportionTips.push('Cropped lengths and vertical lines elongate your frame')
    baseAdvice.proportionTips.push('Avoid midi lengths that hit at the widest calf point')
    baseAdvice.avoidShapes.push('maxi skirts with no slit', 'oversized bags')
    baseAdvice.fitAdvice.push('Alterations are essential — hem everything to your proportions')
  } else if (height === 'tall') {
    baseAdvice.proportionTips.push('You can carry bold prints and long lines with ease')
    baseAdvice.proportionTips.push('Midi and maxi lengths are especially flattering')
    baseAdvice.fitAdvice.push('Seek out brands with tall ranges for sleeve and inseam length')
  }

  // Torso adjustments
  if (torsoLength === 'long') {
    baseAdvice.proportionTips.push('High-waisted bottoms visually shorten the torso')
    baseAdvice.proportionTips.push('Cropped tops and jackets balance your vertical proportions')
  } else if (torsoLength === 'short') {
    baseAdvice.proportionTips.push('Low-rise and mid-rise bottoms lengthen the torso')
    baseAdvice.proportionTips.push('Vertical colour-blocking and unbroken lines help')
    baseAdvice.avoidShapes.push('high-waisted everything', 'cropped tops')
  }

  return baseAdvice
}
