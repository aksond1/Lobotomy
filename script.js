const feed = document.querySelector("#ad-feed");
const searchBox = document.querySelector("#search-box");
const subscriptionOverlay = document.querySelector(".subscription-overlay");
const subscriptionButtons = document.querySelectorAll(
  ".subscription-footer button",
);
const subscriptionClose = document.querySelector(".subscription-close");
const subscriptionMessage = document.querySelector(".subscription-message");
const messageClose = document.querySelector(".message-close");
const shuffleBtn = document.querySelector(".shuffle");
const logoBtn = document.querySelector("#logo");
const themeToggle = document.querySelector(".theme-toggle");

const GAP = 5;

const formats = [
  { name: "square", w: 2.5, h: 2.5 },
  { name: "horizontal", w: 3.2, h: 2.3 },
  { name: "vertical", w: 2.3, h: 3.2 },
  { name: "small-vertical", w: 2.1, h: 2.7 },
];

const colors = [
  "#c73b18",
  "#f0b727",
  "#2f83b8",
  "#4fac30",
  "#8442d4",
  "#cf7226",
  "#e71d2e",
  "#17a594",
];

const ads = [
  {
    label: "LIFE IMPROVEMENT",
    title: "BECOME 73% MORE INTERESTING",
    footer: "Limited nonsense",
    action: "DO IT",
  },
  {
    label: "URGENT!!!",
    title: "YOUR FRIDGE IS JUDGING YOU",
    footer: "Find out why",
    action: "EXPLAIN",
  },
  {
    label: "NEW TECHNOLOGY",
    title: "AI THAT REPLACES YOUR OTHER AI",
    footer: "Now with 4% more AI",
    action: "UPGRADE",
  },
  {
    label: "HEALTH",
    title: "STOP BLINKING IMMEDIATELY",
    footer: "Doctors are confused",
    action: "LEARN",
  },
  {
    label: "FINANCIAL FREEDOM",
    title: "BECOME A MILLIONAIRE BY TUESDAY",
    footer: "Probably legal",
    action: "GET RICH",
  },
  {
    label: "EXCLUSIVE OFFER",
    title: "BUY NOTHING. PAY DOUBLE.",
    footer: "You deserve it",
    action: "BUY",
  },
  {
    label: "PERSONALITY TEST",
    title: "WHICH TYPE OF POTATO ARE YOU?",
    footer: "100% scientifically made up",
    action: "FIND OUT",
  },
  {
    label: "IMPORTANT NEWS",
    title: "NOTHING HAS CHANGED",
    footer: "More at 11",
    action: "READ",
  },
  {
    label: "PRODUCTIVITY",
    title: "WASTE TIME MORE EFFICIENTLY",
    footer: "Work smarter",
    action: "START",
  },
  {
    label: "YOU WON!",
    title: "A PRIZE YOU NEVER ASKED FOR",
    footer: "Terms may not exist",
    action: "CLAIM",
  },
  {
    label: "SELF CARE",
    title: "YOUR PROBLEMS NEED A SUBSCRIPTION",
    footer: "Cancel your feelings",
    action: "JOIN",
  },
  {
    label: "ADVERTISEMENT",
    title: "HEY. LOOK AT THIS INSTEAD.",
    footer: "You are looking",
    action: "LOOK",
  },
];

let placed = [];
let nextId = 0;
let zIndex = 1;
let cellSize = 0;
let screenWidth = 0;
let screenHeight = 0;

const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  document.documentElement.setAttribute("data-theme", savedTheme);
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    if (currentTheme === "light") {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
    }
  });
}

function openSubscriptionOffers() {
  subscriptionOverlay.classList.add("is-visible");
}

function closeSubscriptionOffers() {
  subscriptionOverlay.classList.remove("is-visible");
}

searchBox.addEventListener("click", openSubscriptionOffers);

subscriptionClose.addEventListener("click", closeSubscriptionOffers);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeSubscriptionOffers();
  }
});

subscriptionOverlay.addEventListener("click", (event) => {
  if (event.target === subscriptionOverlay) {
    closeSubscriptionOffers();
  }
});

subscriptionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    subscriptionMessage.classList.add("is-visible");
  });
});

subscriptionMessage.addEventListener("click", (event) => {
  if (event.target === subscriptionMessage) {
    subscriptionMessage.classList.remove("is-visible");
    closeSubscriptionOffers();
  }
});

messageClose.addEventListener("click", () => {
  subscriptionMessage.classList.remove("is-visible");
  closeSubscriptionOffers();
});

if (shuffleBtn) {
  shuffleBtn.addEventListener("click", () => {
    renderFeed();
  });
}

if (logoBtn) {
  logoBtn.style.cursor = "pointer";
  logoBtn.addEventListener("click", () => {
    window.location.reload();
  });
}

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function pick(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getDimensions(format) {
  const width = format.w * cellSize - GAP;
  const height = format.h * cellSize - GAP;

  return {
    width: Math.min(width, screenWidth),
    height: Math.min(height, screenHeight),
  };
}

function intersectionArea(a, b) {
  const width = Math.max(
    0,
    Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x),
  );

  const height = Math.max(
    0,
    Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y),
  );

  return width * height;
}

function findPosition(format, anchor = null) {
  const { width, height } = getDimensions(format);

  const maxX = Math.max(0, screenWidth - width);
  const maxY = Math.max(0, screenHeight - height);

  let best = null;
  let bestScore = Infinity;

  for (let i = 0; i < 100; i++) {
    let x;
    let y;

    if (anchor && Math.random() < 0.7) {
      x = anchor.x + random(-width * 0.8, anchor.width * 0.8);
      y = anchor.y + random(-height * 0.8, anchor.height * 0.8);
    } else {
      x = random(0, maxX);
      y = random(0, maxY);
    }

    x = Math.max(0, Math.min(x, maxX));
    y = Math.max(0, Math.min(y, maxY));

    const candidate = { x, y, width, height };
    const candidateArea = width * height;

    let totalOverlap = 0;
    let worstOverlap = 0;

    for (const other of placed) {
      const area = intersectionArea(candidate, other);

      if (area === 0) continue;

      totalOverlap += area;

      const smallerArea = Math.min(candidateArea, other.width * other.height);

      worstOverlap = Math.max(worstOverlap, area / smallerArea);
    }

    const overlapRatio = totalOverlap / candidateArea;

    if (worstOverlap > 0.48 || overlapRatio > 0.65) {
      continue;
    }

    const targetOverlap = anchor ? 0.18 : 0.12;

    const score = Math.abs(overlapRatio - targetOverlap) + random(0, 0.06);

    if (score < bestScore) {
      bestScore = score;
      best = candidate;
    }
  }

  if (!best) {
    let lowestOverlap = Infinity;

    for (let i = 0; i < 40; i++) {
      const candidate = {
        x: random(0, maxX),
        y: random(0, maxY),
        width,
        height,
      };

      let overlap = 0;

      for (const other of placed) {
        overlap += intersectionArea(candidate, other);
      }

      const ratio = overlap / (width * height);

      if (ratio < lowestOverlap) {
        lowestOverlap = ratio;
        best = candidate;
      }
    }
  }

  return best;
}

function createCard(anchor = null) {
  const format = pick(formats);
  const position = findPosition(format, anchor);

  if (!position) return null;

  const ad = pick(ads);
  const element = document.createElement("article");

  const id = nextId++;

  element.className = "ad-block";
  element.dataset.id = id;
  element.dataset.format = format.name;

  element.style.left = `${position.x + 16}px`;
  element.style.top = `${position.y}px`;
  element.style.width = `${position.width}px`;
  element.style.height = `${position.height}px`;
  element.style.backgroundColor = pick(colors);
  element.style.zIndex = zIndex++;

  element.innerHTML = `
        <button class="ad-close" aria-label="Close advertisement">
            ×
        </button>

        <div class="ad-label">${ad.label}</div>
        <div class="ad-title">${ad.title}</div>

        <div class="ad-footer">
            <span>${ad.footer}</span>
            <span class="ad-action">${ad.action} ↗</span>
        </div>
    `;

  const card = {
    id,
    element,
    ...position,
  };

  element.querySelector(".ad-close").addEventListener("click", () => {
    closeCard(card);
  });

  let hoverTimer = null;
  element.addEventListener("mouseenter", () => {
    hoverTimer = setTimeout(() => {
      element.classList.add("is-hovered");
    }, 20);
  });
  element.addEventListener("mouseleave", () => {
    clearTimeout(hoverTimer);
    element.classList.remove("is-hovered");
  });

  feed.appendChild(element);
  placed.push(card);

  return card;
}

function closeCard(card) {
  if (!placed.some((item) => item.id === card.id)) return;

  card.element.classList.add("is-closing");

  setTimeout(() => {
    card.element.remove();
    placed = placed.filter((item) => item.id !== card.id);

    const count = Math.random() < 0.5 ? 1 : 2;

    for (let i = 0; i < count; i++) {
      createCard(card);
    }
  }, 150);
}

function renderFeed() {
  feed.innerHTML = "";
  placed = [];
  nextId = 0;
  zIndex = 1;

  screenWidth = feed.clientWidth - 32;
  screenHeight = feed.clientHeight - 32;

  const columns = screenWidth < 600 ? 5.3 : 8.5;
  cellSize = screenWidth / columns;

  const cardCount = screenWidth < 600 ? 12 : 22;

  for (let i = 0; i < cardCount; i++) {
    createCard();
  }
}

renderFeed();

let resizeTimeout;

window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);

  resizeTimeout = setTimeout(() => {
    renderFeed();
  }, 200);
});
