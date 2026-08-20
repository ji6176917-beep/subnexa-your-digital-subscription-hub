// Maps a product name to a Simple Icons slug (https://cdn.simpleicons.org/<slug>).
// Falls back to a generated slug, and the UI falls back to initials if the icon 404s.

const overrides: Record<string, string> = {
  chatgpt: "openai",
  "chatgpt plus": "openai",
  gemini: "googlegemini",
  "gemini pro": "googlegemini",
  claude: "claude",
  "claude plus": "claude",
  "microsoft copilot": "githubcopilot",
  "microsoft copilot pro": "githubcopilot",
  copilot: "githubcopilot",
  perplexity: "perplexity",
  "perplexity pro": "perplexity",
  grok: "x",
  deepseek: "deepseek",
  poe: "poe",
  "character.ai": "character-ai",
  "you.com": "you",
  "mistral le chat": "mistralai",
  qwen: "qwen",
  monica: "monica",
  jasper: "jasper",
  "copy.ai": "copyai",
  quillbot: "quillbot",
  grammarly: "grammarly",
  "notion ai": "notion",
  "otter.ai": "otter",
  "fireflies.ai": "fireflies",
  "notebooklm plus": "googlenotebooklm",
  notebooklm: "googlenotebooklm",
  canva: "canva",
  picsart: "picsart",
  "adobe lightroom": "adobelightroom",
  "adobe photoshop": "adobephotoshop",
  "adobe express": "adobe",
  "adobe firefly": "adobe",
  "adobe premiere rush": "adobepremierepro",
  "adobe premiere pro": "adobepremierepro",
  "adobe after effects": "adobeaftereffects",
  "adobe illustrator": "adobeillustrator",
  "adobe indesign": "adobeindesign",
  "adobe acrobat": "adobeacrobatreader",
  "adobe creative cloud": "adobecreativecloud",
  fotor: "fotor",
  pixlr: "pixlr",
  vsco: "vsco",
  "remove.bg": "removedotbg",
  capcut: "capcut",
  kinemaster: "kinemaster",
  inshot: "inshot",
  filmora: "wondersharefilmora",
  "davinci resolve studio": "davinciresolve",
  "davinci resolve": "davinciresolve",
  "final cut pro": "finalcutpro",
  spotify: "spotify",
  "spotify premium": "spotify",
  "youtube premium": "youtube",
  "youtube music": "youtubemusic",
  "apple music": "applemusic",
  deezer: "deezer",
  tidal: "tidal",
  soundcloud: "soundcloud",
  audible: "audible",
  netflix: "netflix",
  "prime video": "primevideo",
  "disney+": "disneyplus",
  hulu: "hulu",
  "hbo max": "hbo",
  crunchyroll: "crunchyroll",
  coursera: "coursera",
  udemy: "udemy",
  edx: "edx",
  skillshare: "skillshare",
  duolingo: "duolingo",
  "khan academy": "khanacademy",
  "brilliant.org": "brilliant",
  brilliant: "brilliant",
  codecademy: "codecademy",
  datacamp: "datacamp",
  pluralsight: "pluralsight",
  leetcode: "leetcode",
  "google drive": "googledrive",
  "google one": "googleone",
  dropbox: "dropbox",
  mega: "mega",
  pcloud: "pcloud",
  onedrive: "microsoftonedrive",
  icloud: "icloud",
  "microsoft 365": "microsoft365",
  "microsoft office": "microsoftoffice",
  "microsoft lens": "microsoftoffice",
  notion: "notion",
  evernote: "evernote",
  todoist: "todoist",
  trello: "trello",
  asana: "asana",
  slack: "slack",
  zoom: "zoom",
  airtable: "airtable",
  clickup: "clickup",
  miro: "miro",
  figma: "figma",
  github: "github",
  "github copilot": "githubcopilot",
  gitlab: "gitlab",
  jetbrains: "jetbrains",
  "jetbrains all products pack": "jetbrains",
  cursor: "cursor",
  replit: "replit",
  vercel: "vercel",
  netlify: "netlify",
  digitalocean: "digitalocean",
  heroku: "heroku",
  postman: "postman",
  docker: "docker",
  nordvpn: "nordvpn",
  expressvpn: "expressvpn",
  surfshark: "surfshark",
  protonvpn: "protonvpn",
  "proton vpn": "protonvpn",
  "proton mail": "protonmail",
  "mullvad vpn": "mullvad",
  windscribe: "windscribe",
  "1password": "1password",
  bitwarden: "bitwarden",
  dashlane: "dashlane",
  lastpass: "lastpass",
  malwarebytes: "malwarebytes",
  buffer: "buffer",
  hootsuite: "hootsuite",
  canvapro: "canva",
  mailchimp: "mailchimp",
  semrush: "semrush",
  ahrefs: "ahrefs",
  linkedin: "linkedin",
  "linkedin premium": "linkedin",
  tiktok: "tiktok",
  instagram: "instagram",
  telegram: "telegram",
  "telegram premium": "telegram",
  discord: "discord",
  "discord nitro": "discord",
  wetransfer: "wetransfer",
  smallpdf: "smallpdf",
  ilovepdf: "ilovepdf",
  deepl: "deepl",
  "deepl pro": "deepl",
  elevenlabs: "elevenlabs",
  midjourney: "midjourney",
  runway: "runway",
  "runway ml": "runway",
  "stability ai": "stabilityai",
  huggingface: "huggingface",
  "hugging face": "huggingface",
  wix: "wix",
  squarespace: "squarespace",
  shopify: "shopify",
  wordpress: "wordpress",
  "envato elements": "envato",
  freepik: "freepik",
  "shutterstock": "shutterstock",
  flaticon: "flaticon",
  steam: "steam",
  "xbox game pass": "xbox",
  "playstation plus": "playstation",
  "nintendo switch online": "nintendoswitch",
  duolingo_max: "duolingo",
};

const noiseWords =
  /\b(pro|plus|premium|max|ultra|team|business|enterprise|lifetime|edition|subscription|account|standard|advanced|individual|personal|student|family|annual|yearly|monthly|studio|ai)\b/gi;

export function brandSlug(name: string): string {
  const lower = name.toLowerCase().trim();
  if (overrides[lower]) return overrides[lower];

  // strip version numbers / suffixes like "-5.6"
  const cleaned = lower
    .replace(/[-–]\s?\d+(\.\d+)?$/g, "")
    .replace(/\b\d+(\.\d+)?\b/g, "")
    .trim();
  if (overrides[cleaned]) return overrides[cleaned];

  const base = cleaned.replace(noiseWords, "").trim();
  if (overrides[base]) return overrides[base];

  return (base || cleaned)
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "")
    .trim();
}

export function brandLogoUrl(name: string): string {
  return `https://cdn.simpleicons.org/${brandSlug(name)}`;
}

// Some brands were removed from Simple Icons; fall back to the site favicon.
const domainOverrides: Record<string, string> = {
  openai: "openai.com",
  claude: "claude.ai",
  googlegemini: "gemini.google.com",
  githubcopilot: "copilot.microsoft.com",
  perplexity: "perplexity.ai",
  x: "x.com",
  character: "character.ai",
  characterai: "character.ai",
  you: "you.com",
  mistralai: "mistral.ai",
  capcut: "capcut.com",
  microsoftoffice: "microsoft.com",
  microsoft365: "microsoft.com",
  microsoftonedrive: "onedrive.live.com",
  googlenotebooklm: "notebooklm.google.com",
  googleone: "one.google.com",
  googledrive: "drive.google.com",
  removedotbg: "remove.bg",
  wondersharefilmora: "filmora.wondershare.com",
  primevideo: "primevideo.com",
  disneyplus: "disneyplus.com",
  applemusic: "music.apple.com",
  youtubemusic: "music.youtube.com",
  brilliant: "brilliant.org",
  copyai: "copy.ai",
  otter: "otter.ai",
  fireflies: "fireflies.ai",
  stabilityai: "stability.ai",
  huggingface: "huggingface.co",
  elevenlabs: "elevenlabs.io",
  runway: "runwayml.com",
  midjourney: "midjourney.com",
  jetbrains: "jetbrains.com",
  finalcutpro: "apple.com",
  davinciresolve: "blackmagicdesign.com",
};

const favicon = (domain: string) => `https://icons.duckduckgo.com/ip3/${domain}.ico`;

/** Ordered logo candidates: official icon set first, then brand favicons. */
export function brandLogoCandidates(name: string): string[] {
  const slug = brandSlug(name);
  const known = domainOverrides[slug];
  const domains = known ? [known] : [`${slug}.com`, `${slug}.ai`, `${slug}.io`];
  return [brandLogoUrl(name), ...domains.map(favicon)];
}

export function brandInitials(name: string): string {
  return name.slice(0, 2).toUpperCase();
}
