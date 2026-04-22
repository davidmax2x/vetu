import { CULTURAL_CONTEXTS } from './constants'

export { CULTURAL_CONTEXTS }

export function getCulturalStyleNotes(context: string, season: string): string {
  const isWarm = season.toLowerCase().includes('spring') || season.toLowerCase().includes('autumn')
  const isCool = season.toLowerCase().includes('summer') || season.toLowerCase().includes('winter')

  const baseNotes: Record<string, string> = {
    'global-western': 'Contemporary Western fashion applies your colour palette directly. Focus on modern silhouettes and versatile pieces.',
    'south-asian': isWarm
      ? 'Your warm palette shines in traditional South Asian wear: golden silks, rust brocades, and ivory chiffons. Opt for zari work in gold. Bridal wear benefits from your palette\'s richness — consider coral lehengas, mustard sarees, or burnt orange anarkalis.'
      : 'Your cool palette creates stunning South Asian ensembles: silver-threaded blues, lavender silks, and ice pink chiffons. Opt for zari work in silver. Consider powder blue lehengas, lilac sarees, or mint green anarkalis.',
    'west-african': isWarm
      ? 'Your warm undertones harmonise with traditional West African colour theory. Kente cloth in gold, rust, and olive complements your season beautifully. Aso-ebi styling in your palette creates cohesive group looks.'
      : 'Your cool undertones create striking contrast in West African prints. Select ankara with blue, purple, or cool green bases. Silver jewellery and cool-toned headwraps complete the look.',
    'east-asian': isWarm
      ? 'Your warm palette suits traditional East Asian aesthetics: auspicious reds and golds for celebrations, warm jade and amber for everyday elegance. Hanbok colour blocking in your palette creates modern heritage looks.'
      : 'Your cool palette aligns with East Asian aesthetics of serenity and refinement: cool jade, powder blue, and silvergrey create elegant cheongsam and modern hanbok styling.',
    'middle-eastern': isWarm
      ? 'Your warm palette creates luxurious Middle Eastern styling: gold-embellished kaftans in camel and rust, warm-toned hijabs, and amber jewellery. Evening wear in your palette\'s deep warm tones is stunning.'
      : 'Your cool palette creates ethereal Middle Eastern looks: silver-embellished abayas in midnight blue and dove grey, cool-toned hijabs, and sapphire jewellery.',
    'latin-american': isWarm
      ? 'Your warm palette vibrates with Latin American energy: coral quinceañera dresses, amber festival wear, and warm-toned traditional embroidery. Your colours are made for celebration.'
      : 'Your cool palette creates elegant Latin American styling: ice blue evening gowns, lavender formal wear, and silver-accented accessories. Sophisticated and striking.'
  }

  return baseNotes[context] || baseNotes['global-western']
}
