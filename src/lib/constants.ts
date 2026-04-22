// ─── Brand ───────────────────────────────────────────────────────────
export const APP_NAME        = 'Vêtu'
export const APP_NAME_CLEAN  = 'Vetu'        // for URLs, filenames, npm
export const APP_DOMAIN      = 'vetu.ai'
export const TAGLINE         = 'Dressed with intention.'
export const ADVISOR_NAME_DEFAULT = 'Aria'
// ─────────────────────────────────────────────────────────────────────

export const CLAUDE_MODEL = process.env.CLAUDE_MODEL_ID || 'claude-opus-4-5'
// MAINTENANCE: check anthropic.com/api quarterly for model deprecation notices
// When claude-opus-4-5 is deprecated: set CLAUDE_MODEL_ID env var to new model ID
// Do NOT hardcode a new model ID here — update the env var only
// Advisor uses Haiku for cheap extraction: update CLAUDE_HAIKU_MODEL similarly
export const CLAUDE_HAIKU_MODEL = process.env.CLAUDE_HAIKU_MODEL_ID || 'claude-haiku-4-5-20251001'
export const SDXL_MODEL = process.env.SDXL_MODEL_ID
  || 'stability-ai/sdxl:39ed52f2319f9b75ef8b50ca7b05f8a4e8c7a13bfd06f6db39f3fde5b3f9e74b'
export const IDMVTON_MODEL = process.env.IDMVTON_MODEL_ID
  || 'yisol/idm-vton:906425dbca90663ff5427624839572cc56ea7d380343d13e2a4c4b09d7f0f23'
export const MAX_COST_PER_SESSION_GBP = 0.80
export const REPLICATE_TIMEOUT_MS = 120000
export const ANALYSIS_IMAGE_SIZE = 720
export const TRYON_IMAGE_WIDTH = 768
export const TRYON_IMAGE_HEIGHT = 1024
export const ADVISOR_NAME = process.env.ADVISOR_NAME || ADVISOR_NAME_DEFAULT
export const ADVISOR_CONTEXT_WINDOW = 10  // last N messages sent to Claude
export const ADVISOR_MAX_TOKENS = 600     // keep responses conversational, not essays

export const TIERS = {
  FREE: {
    analysesPerMonth: 2,
    tryonEnabled: false,
    advisorMessagesPerMonth: 3,
    pdfExport: false,
    wardrobeHistory: false,
    outfitsShown: 2,         // other 2 are blurred
    outfitsLocked: 2,
  },
  PRO: {
    analysesPerMonth: Infinity,
    tryonEnabled: true,
    advisorMessagesPerMonth: Infinity,
    pdfExport: true,
    wardrobeHistory: true,
    outfitsShown: 4,
    outfitsLocked: 0,
  },
  API: {
    analysesPerMonth: Infinity,
    tryonEnabled: true,
    advisorMessagesPerMonth: Infinity,
    pdfExport: true,
    wardrobeHistory: true,
    outfitsShown: 4,
    outfitsLocked: 0,
  }
}

export const COLOR_SEASONS = [
  'True Spring','Bright Spring','Light Spring',
  'True Summer','Light Summer','Soft Summer',
  'True Autumn','Soft Autumn','Deep Autumn',
  'True Winter','Deep Winter','Bright Winter'
]

export const CULTURAL_CONTEXTS = [
  'global-western', 'south-asian', 'west-african',
  'east-asian', 'middle-eastern', 'latin-american'
]

// MAINTENANCE: Affiliate base URLs change without notice.
// AFFILIATE_PROGRAMMES is the canonical definition — update base URLs here only.
// Commission rates are approximate and change with programme terms — verify quarterly.
// If a programme becomes unavailable, set its publisherIdEnvKey to null.
export const AFFILIATE_PROGRAMMES = {
  ASOS:     { network: 'awin',     baseUrl: process.env.ASOS_BASE_URL     || 'https://www.asos.com/search/?q=',                             commission: '4%' },
  HM:       { network: 'cj',       baseUrl: process.env.HM_BASE_URL       || 'https://www2.hm.com/en_gb/search-results.html?q=',            commission: '7%' },
  MS:       { network: 'awin',     baseUrl: process.env.MS_BASE_URL        || 'https://www.marksandspencer.com/search?q=',                   commission: '3%' },
  FARFETCH: { network: 'farfetch', baseUrl: process.env.FARFETCH_BASE_URL || 'https://www.farfetch.com/shopping/women/search/items.aspx?q=', commission: '8%' },
  AMAZON:   { network: 'amazon',   baseUrl: process.env.AMAZON_BASE_URL   || 'https://www.amazon.co.uk/s?k=',                               commission: '3%' }
}

export const PRICING = {
  PRO_MONTHLY: 9.99,
  PRO_ANNUAL: 79.99,
  API_STARTER: 199,
  API_GROWTH: 799,
  API_SCALE: 2499,
}

export const TIER_NAMES = {
  FREE: 'Vêtu Free',
  PRO:  'Vêtu Pro',
  API:  'Vêtu for Brands',
}

// ─── Caching ──────────────────────────────────────────────────────
export const CACHE_TTL_ANALYSIS_SECONDS   = 60 * 60 * 24 * 30  // 30 days — season rarely changes
export const CACHE_TTL_OUTFITS_SECONDS    = 60 * 60 * 24        // 24 hours per season+prefs combo

// ─── Growth ───────────────────────────────────────────────────────
export const CREATOR_REFERRAL_COMMISSION  = 0.20   // 20% of referred user's first Pro month
export const REFERRAL_REWARD_ANALYSES     = 1      // free analyses rewarded per successful referral
export const SHARE_CARD_WATERMARK_TEXT    = 'Created with Vêtu'
export const PREWARM_ON_OUTFIT_VIEW       = true   // pre-warm Replicate when outfit cards load

// ─── Analytics ────────────────────────────────────────────────────
export const ANALYTICS_EVENTS = {
  ANALYSIS_COMPLETE:     'analysis_complete',
  SEASON_REVEALED:       'season_revealed',
  TRYON_REQUESTED:       'tryon_requested',
  TRYON_COMPLETE:        'tryon_complete',
  SHARE_CARD_CREATED:    'share_card_created',
  SHARE_CARD_SHARED:     'share_card_shared',
  REFERRAL_SENT:         'referral_sent',
  REFERRAL_CONVERTED:    'referral_converted',
  ADVISOR_MESSAGE_SENT:  'advisor_message_sent',
  UPGRADE_MODAL_SHOWN:   'upgrade_modal_shown',
  UPGRADE_CLICKED:       'upgrade_clicked',
  UPGRADED_TO_PRO:       'upgraded_to_pro',
  OUTFIT_SAVED:          'outfit_saved',
  OUTFIT_LIKED:          'outfit_liked',
  SHOPPING_LINK_CLICKED: 'shopping_link_clicked',
}

// ─── White label ──────────────────────────────────────────────────
export const WHITE_LABEL_MODE = process.env.WHITE_LABEL_MODE === 'true'
export const WHITE_LABEL_BRAND = process.env.WHITE_LABEL_BRAND || APP_NAME
export const WHITE_LABEL_LOGO  = process.env.WHITE_LABEL_LOGO  || null
