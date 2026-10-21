const header = document.querySelector("header");

const feed = document.querySelector("#ad-feed");

function updateFeedHeight() {
  const headerHeight = header.getBoundingClientRect().height;
  feed.style.setProperty("--header-height", `${headerHeight}px`);
}

updateFeedHeight();
window.addEventListener("resize", updateFeedHeight);

const INITIAL_CARDS = 28;
const GAP = 5;

const formats = [
  { name: "square", w: 2.5, h: 2.5 },
  { name: "horizontal", w: 3.2, h: 2.3 },
  { name: "vertical", w: 2.3, h: 3.2 },
  { name: "small-vertical", w: 2.1, h: 2.7 },
];

const color = [
  "#e76f51",
  "#e9c46a",
  "#457b9d",
  "#8ab17d",
  "#9b5de5",
  "#f4a261",
  "#e63946",
  "#2a9d8f",
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
