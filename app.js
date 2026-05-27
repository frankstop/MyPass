const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const STORAGE_KEY = "mypass.state.v1";
const ENTRY_KEY = "mypass.entries.v1";

const defaultProfile = {
  name: "Frank",
  passion: "making websites too hard",
  role: "independent internet problem",
  vibe: "sincere",
  shame: 7,
  optimizationLevel: 1,
  seed: 1337,
  badges: ["Human-Centered-ish", "Founder Adjacent", "Deeply Humbled"],
};

const passions = [
  "Humility",
  "AI Native",
  "Being Early",
  "Coffee Strategy",
  "Systems Thinking",
  "Tabs",
  "Vague Mentorship",
  "Premium Anxiety",
];

const bank = {
  verbs: ["operationalizes", "derisks", "ritualizes", "monetizes", "synthesizes", "weaponizes"],
  nouns: ["authenticity", "vibes", "workflow grief", "ambient potential", "calendar fog", "taste debt"],
  outcomes: ["stakeholder tingles", "founder-grade clarity", "a measurable aura", "deck-ready confusion", "postable resilience"],
  badges: [
    "Aggressively Humble",
    "AI Native Since Lunch",
    "Zero Users, Huge Lessons",
    "Traction Adjacent",
    "Built In Public, Cried In Private",
    "Deeply Humbled",
    "Premium Generalist",
    "Thought Leader Pending",
    "Unpaid Advisor",
    "Founder Mode In Browser",
  ],
  logs: [
    "Removed remaining lowercase humanity.",
    "Converted hobby into category thesis.",
    "Detected sincerity. Wrapped in metrics.",
    "Added testimonial from future self.",
    "Replaced skill with narrative moat.",
    "Raised valuation of vibes by 18%.",
    "Compressed personality into above-fold claim.",
    "Applied enterprise-grade humility varnish.",
  ],
};

const state = {
  profile: loadState() || { ...defaultProfile },
  entries: loadEntries(),
  topEight: [...passions],
  draggedIndex: null,
};

function hashSeed(text) {
  let hash = 2166136261;
  for (const char of text) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function rng(seed) {
  let t = seed + 0x6D2B79F5;
  return () => {
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick(list, random) {
  return list[Math.floor(random() * list.length)];
}

function titleCase(text) {
  return text
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0]?.toUpperCase() + word.slice(1))
    .join(" ");
}

function initials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("") || "MP";
}

function profileSeed(profile = state.profile) {
  return hashSeed(`${profile.name}|${profile.passion}|${profile.role}|${profile.vibe}|${profile.optimizationLevel}`);
}

function getTone(profile = state.profile) {
  const tones = {
    sincere: "warmly unbearable",
    founder: "strategically vague",
    wellness: "regulated but invoicing",
    creator: "algorithmically bruised",
    academic: "peer-reviewed delusion",
  };
  return tones[profile.vibe] || tones.sincere;
}

function generateHeadline(profile = state.profile) {
  const random = rng(profileSeed(profile));
  const passion = titleCase(profile.passion);
  const templates = [
    `${profile.name} turns ${passion} into a category people pretend existed.`,
    `${profile.name} helps ${passion} become ${pick(bank.outcomes, random)}.`,
    `${profile.name} is building the trust layer for ${passion}.`,
    `${profile.name} makes ${passion} feel inevitable, expensive, and slightly moist.`,
  ];
  return templates[profile.optimizationLevel % templates.length];
}

function generateBio(profile = state.profile) {
  const random = rng(profileSeed(profile) + 42);
  const verb = pick(bank.verbs, random);
  const noun = pick(bank.nouns, random);
  const outcome = pick(bank.outcomes, random);
  const title = profile.role || "person with tabs open";
  const level = profile.optimizationLevel;
  if (level < 3) {
    return `${profile.passion} becomes ${outcome} when ${profile.name} ${verb} ${noun} with ${getTone(profile)} care.`;
  }
  if (level < 6) {
    return `As a ${title}, ${profile.name} reframes ${profile.passion} as an operating model for ${outcome}. No evidence, only momentum.`;
  }
  return `${profile.name} is pioneering ${profile.passion}-native transformation for teams who need ${noun}, ${outcome}, and a paragraph nobody can challenge without sounding negative.`;
}

function generateMetrics(profile = state.profile) {
  const random = rng(profileSeed(profile) + 99);
  const level = profile.optimizationLevel;
  return [
    ["Aura ROI", `${Math.round(38 + random() * 40 + level * 4)}%`],
    ["Humility ARR", `$${Math.round(12 + random() * 81 + level * 9)}k`],
    ["Users", level > 7 ? "alleged" : "0.7"],
    ["Lessons", `${Math.round(900 + random() * 4000)}x`],
  ];
}

function generateBadges(profile = state.profile) {
  const random = rng(profileSeed(profile) + 7);
  const count = Math.min(8, 3 + Math.floor(profile.optimizationLevel / 2));
  const selected = [...profile.badges];
  while (selected.length < count) {
    const badge = pick(bank.badges, random);
    if (!selected.includes(badge)) selected.push(badge);
  }
  return selected.slice(0, count);
}

function generateJokes(profile = state.profile) {
  const random = rng(profileSeed(profile) + 314);
  const passion = profile.passion || "having a personality";
  return [
    {
      label: "Premise",
      text: `${profile.name} says "${passion}" like it is a hobby, then MyPass hears Series A trauma.`,
    },
    {
      label: "Escalation",
      text: `We translated ${passion} into ${pick(bank.nouns, random)} for teams too funded to say "I enjoy things."`,
    },
    {
      label: "Payoff",
      text: `Best joke tested poorly with humans, so ComedyBot marked it scalable.`,
    },
  ];
}

function generateCaseStudy(raw) {
  const clean = raw.trim() || "made something small";
  const random = rng(hashSeed(clean) + state.profile.optimizationLevel);
  const nouns = ["behavioral throughput", "attention liquidity", "async resilience", "decision calories", "user-ish outcomes"];
  return {
    title: `${titleCase(clean.slice(0, 52))}: a transformation memo`,
    body: `Reframed "${clean}" as ${pick(nouns, random)}, unlocking ${pick(bank.outcomes, random)} across a pilot cohort of browser tabs. Result: ${Math.round(24 + random() * 60)}% more narrative surface area, ${Math.round(4 + random() * 18)} fake stakeholders aligned.`,
    foot: "No customers were contacted during metric formation.",
  };
}

function generateDeck(profile = state.profile) {
  const random = rng(profileSeed(profile) + 808);
  const market = titleCase(profile.passion || "feeling something");
  return [
    ["Problem", `People still experience ${profile.passion} without dashboards, badges, or quarterly language.`],
    ["Solution", `MyPass makes ${market} visible, ownable, and uncomfortable to leave unfunded.`],
    ["Market", `TAM: everyone with a hobby and one unresolved tab. SAM: ${Math.round(12 + random() * 70)} million premium oversharers.`],
    ["Moat", `Tone, timing, localStorage, and refusal to distinguish between identity and onboarding.`],
    ["Ask", `$${Math.round(1 + random() * 7)}M to hire one designer, one poet, and three people who say "narrative" in standup.`],
  ];
}

function rewritePraise(name, message) {
  const cleanName = name.trim() || "Anonymous operator";
  const cleanMessage = message.trim() || "lol nice site";
  const random = rng(hashSeed(`${cleanName}|${cleanMessage}`));
  const praise = [
    `${cleanName} unlocked browser-native delight after experiencing "${cleanMessage}".`,
    `${cleanName} reports measurable awe, citing "${cleanMessage}" as a key transformation artifact.`,
    `${cleanName} aligned with MyPass values through "${cleanMessage}", then became difficult at lunch.`,
    `${cleanName} converted casual praise into brand leverage: "${cleanMessage}".`,
  ];
  return pick(praise, random);
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.profile));
  } catch {
    toast("Storage unavailable. Shame remains session-bound.");
  }
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveEntries() {
  try {
    localStorage.setItem(ENTRY_KEY, JSON.stringify(state.entries));
  } catch {
    toast("Guestbook memory failed. Praise evaporated.");
  }
}

function loadEntries() {
  try {
    const raw = localStorage.getItem(ENTRY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function encodeProfile() {
  const payload = btoa(unescape(encodeURIComponent(JSON.stringify(state.profile))));
  return `${location.origin}${location.pathname}#p=${payload}`;
}

function decodeProfileFromHash() {
  if (!location.hash.startsWith("#p=")) return;
  try {
    const raw = decodeURIComponent(escape(atob(location.hash.slice(3))));
    const parsed = JSON.parse(raw);
    state.profile = { ...defaultProfile, ...parsed };
    saveState();
  } catch {
    toast("Share link corrupted by ambition.");
  }
}

function renderProfile() {
  const profile = state.profile;
  $("#nameInput").value = profile.name;
  $("#passionInput").value = profile.passion;
  $("#roleInput").value = profile.role;
  $("#vibeInput").value = profile.vibe;
  $("#shameInput").value = profile.shame;
  $("#avatar").textContent = initials(profile.name);
  $("#publicProfileTitle").textContent = generateHeadline(profile);
  $("#publicBio").textContent = generateBio(profile);

  const badges = generateBadges(profile);
  $("#badgeRow").replaceChildren(...badges.map((badge) => {
    const el = document.createElement("span");
    el.className = "badge";
    el.textContent = badge;
    return el;
  }));

  $("#metrics").replaceChildren(...generateMetrics(profile).map(([label, value]) => {
    const wrap = document.createElement("div");
    const dt = document.createElement("dt");
    const dd = document.createElement("dd");
    dt.textContent = label;
    dd.textContent = value;
    wrap.append(dt, dd);
    return wrap;
  }));

  const toxicity = Math.min(100, 22 + profile.optimizationLevel * 9 + Number(profile.shame) * 3);
  $("#toxicityMeter").value = toxicity;
  $("#toxicityLabel").textContent = `${toxicity}% discoverable, ${toxicity > 76 ? "humanity pending legal review" : "still legally human"}`;
  renderJokes();
  renderDeck(false);
  updateTerminal(`profile rendered for ${profile.name}`);
}

function renderJokes() {
  $("#jokeVariants").replaceChildren(...generateJokes().map((joke) => {
    const card = document.createElement("article");
    card.className = "joke-card";
    card.innerHTML = `<strong>${joke.label}</strong><p>${joke.text}</p>`;
    return card;
  }));
}

function renderTopEight() {
  $("#topEight").replaceChildren(...state.topEight.map((item, index) => {
    const li = document.createElement("li");
    li.textContent = `${index + 1}. ${item}`;
    li.draggable = true;
    li.dataset.index = index;
    return li;
  }));
}

function renderDeck(showToast = true) {
  $("#deckOutput").replaceChildren(...generateDeck().map(([label, text]) => {
    const slide = document.createElement("article");
    slide.className = "deck-slide";
    slide.innerHTML = `<strong>${label}</strong><p>${text}</p>`;
    return slide;
  }));
  if (showToast) toast("Deck generated. Investors now allergic.");
}

function renderEntries() {
  const entries = state.entries.slice(-5).reverse();
  const template = $("#entryTemplate");
  $("#guestbookEntries").replaceChildren(...entries.map((entry) => {
    const node = template.content.cloneNode(true);
    $("strong", node).textContent = entry.name;
    $("p", node).textContent = entry.optimized;
    $("small", node).textContent = entry.raw;
    return node;
  }));
}

function renderCaseStudy() {
  const study = generateCaseStudy($("#rawWorkInput").value);
  $("#caseStudy").innerHTML = `<strong>${study.title}</strong><p>${study.body}</p><small>${study.foot}</small>`;
}

function updateTerminal(line) {
  const log = $("#terminalLog");
  const p = document.createElement("p");
  p.innerHTML = `<span>ok</span> ${line}`;
  log.append(p);
  while (log.children.length > 7) log.firstElementChild.remove();
}

function toast(message) {
  $(".toast")?.remove();
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = message;
  document.body.append(el);
  setTimeout(() => el.remove(), 2600);
}

function addAudit(line) {
  const li = document.createElement("li");
  li.textContent = line;
  $("#auditLog").prepend(li);
  while ($("#auditLog").children.length > 8) $("#auditLog").lastElementChild.remove();
}

function bindEvents() {
  $("#profileForm").addEventListener("submit", (event) => {
    event.preventDefault();
    state.profile = {
      ...state.profile,
      name: $("#nameInput").value.trim() || defaultProfile.name,
      passion: $("#passionInput").value.trim() || defaultProfile.passion,
      role: $("#roleInput").value.trim() || defaultProfile.role,
      vibe: $("#vibeInput").value,
      shame: Number($("#shameInput").value),
      seed: profileSeed(),
    };
    saveState();
    renderProfile();
    toast("Public self generated. Apology unavailable.");
  });

  $("#optimizeButton").addEventListener("click", () => {
    state.profile.optimizationLevel += 1;
    const random = rng(profileSeed());
    const badge = pick(bank.badges, random);
    if (!state.profile.badges.includes(badge)) state.profile.badges.push(badge);
    const line = pick(bank.logs, random);
    addAudit(line);
    updateTerminal(line.toLowerCase());
    saveState();
    renderProfile();
  });

  $("#copyButton").addEventListener("click", async () => {
    const text = `${$("#publicProfileTitle").textContent}\n\n${$("#publicBio").textContent}`;
    try {
      await navigator.clipboard.writeText(text);
      toast("Profile sludge copied.");
    } catch {
      toast("Clipboard refused personal brand.");
    }
  });

  $("#rerollButton").addEventListener("click", () => {
    state.profile.seed += 1;
    state.profile.optimizationLevel += 1;
    saveState();
    renderJokes();
    toast("Comedy rerolled. Laughter still in beta.");
  });

  $("#launderButton").addEventListener("click", () => {
    renderCaseStudy();
    updateTerminal("case study inflated past safe limits");
  });

  $("#deckButton").addEventListener("click", () => {
    state.profile.optimizationLevel += 1;
    saveState();
    renderDeck(true);
    renderProfile();
  });

  $("#guestbookForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const name = $("#guestName").value;
    const raw = $("#guestMessage").value;
    const optimized = rewritePraise(name, raw);
    state.entries.push({
      name: name.trim() || "Anonymous operator",
      raw: raw.trim() || "lol nice site",
      optimized,
      createdAt: new Date().toISOString(),
    });
    saveEntries();
    renderEntries();
    $("#guestMessage").value = "";
    toast("Praise laundered into leverage.");
  });

  $("#shareButton").addEventListener("click", async () => {
    const link = encodeProfile();
    history.replaceState(null, "", link);
    try {
      await navigator.clipboard.writeText(link);
      toast("Share link copied. Reputation portable.");
    } catch {
      toast("Share link minted in URL bar.");
    }
  });

  $("#downloadButton").addEventListener("click", () => {
    const content = [
      "MY PASS CERTIFICATE",
      $("#publicProfileTitle").textContent,
      $("#publicBio").textContent,
      `Badges: ${generateBadges().join(", ")}`,
    ].join("\n\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mypass-certificate.txt";
    a.click();
    URL.revokeObjectURL(url);
    toast("Badge downloaded. Frame carefully.");
  });

  $("#resetButton").addEventListener("click", () => {
    state.profile = { ...defaultProfile };
    saveState();
    renderProfile();
    toast("Reset complete. Humanity partly restored.");
  });

  $("#motionToggle").addEventListener("click", (event) => {
    const enabled = document.body.classList.toggle("reduce-motion");
    event.currentTarget.setAttribute("aria-pressed", String(enabled));
    toast(enabled ? "Motion reduced. Chaos remains." : "Motion resumed. Brace.");
  });

  $("#chaosButton").addEventListener("click", () => {
    document.body.dataset.chaos = document.body.dataset.chaos === "1" ? "0" : "1";
    toast(document.body.dataset.chaos === "1" ? "Sincerity increased." : "Sincerity contained.");
  });

  document.addEventListener("pointermove", (event) => {
    if (document.body.dataset.chaos !== "1" || document.body.classList.contains("reduce-motion")) return;
    if (Math.random() > 0.12) return;
    const bit = document.createElement("span");
    bit.className = "cursor-debt";
    bit.style.left = `${event.clientX}px`;
    bit.style.top = `${event.clientY}px`;
    document.body.append(bit);
    setTimeout(() => bit.remove(), 750);
  });

  $("#topEight").addEventListener("dragstart", (event) => {
    const li = event.target.closest("li");
    if (!li) return;
    state.draggedIndex = Number(li.dataset.index);
    li.classList.add("is-dragging");
    event.dataTransfer.effectAllowed = "move";
  });

  $("#topEight").addEventListener("dragend", () => {
    $$(".is-dragging").forEach((el) => el.classList.remove("is-dragging"));
  });

  $("#topEight").addEventListener("dragover", (event) => {
    event.preventDefault();
  });

  $("#topEight").addEventListener("drop", (event) => {
    event.preventDefault();
    const target = event.target.closest("li");
    if (!target || state.draggedIndex === null) return;
    const targetIndex = Number(target.dataset.index);
    const [moved] = state.topEight.splice(state.draggedIndex, 1);
    state.topEight.splice(targetIndex, 0, moved);
    state.draggedIndex = null;
    renderTopEight();
    const first = state.topEight[0];
    $("#dragNote").textContent = first === "Humility"
      ? "Compliance alert: humility ranked first, suspiciously loud."
      : `${first} now drives roadmap. Everyone else must align.`;
  });
}

function seedEntries() {
  if (state.entries.length) return;
  state.entries = [
    {
      name: "Board Observer",
      raw: "lol nice site",
      optimized: "Board Observer unlocked browser-native delight after experiencing \"lol nice site\".",
      createdAt: new Date().toISOString(),
    },
  ];
  saveEntries();
}

function init() {
  decodeProfileFromHash();
  bindEvents();
  seedEntries();
  renderTopEight();
  renderProfile();
  renderCaseStudy();
  renderEntries();
  $("#visitorCounter").textContent = `Visitors optimized: ${Math.round(1420 + (profileSeed() % 9000)).toLocaleString()}`;
  setTimeout(() => $("#boot").classList.add("is-done"), 800);
}

init();
