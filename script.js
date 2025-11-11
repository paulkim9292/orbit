// Circle position data
// Landing Page 1 positions (initial)
const page1Positions = {
  yellow: { x: -319, y: -498 },
  pink: { x: 975, y: 431 },
  purple2: { x: 807, y: -759 },
  purple1: { x: -383, y: 293 },
  navy2: { x: 995, y: 665 },
  navy1: { x: -108, y: -225 },
};

// Landing Page 2 positions (target)
const page2Positions = {
  yellow: { x: 284, y: -444 },
  pink: { x: 1012, y: -852 },
  purple2: { x: -174, y: 201 },
  purple1: { x: -515, y: -852 },
  navy2: { x: 568, y: 245 },
  navy1: { x: -34, y: -600 },
};

const page3Positions = {
  yellow: { x: -225, y: -573 },
  pink: { x: 77, y: 113 },
  purple2: { x: 360, y: 152 },
  purple1: { x: -515, y: -852 },
  navy2: { x: 411, y: -790 },
  navy1: { x: 97, y: 61 },
};

const page4Positions = {
  yellow: { x: -1338, y: -198 },
  pink: { x: 763, y: -233 },
  purple2: { x: 360, y: 152 },
  purple1: { x: -451, y: -706 },
  navy2: { x: 256, y: -572 },
  navy1: { x: 0, y: 527 },
};

const page5Positions = {
  yellow: { x: 236, y: -706 },
  pink: { x: -598, y: 611 },
  purple2: { x: 360, y: 152 },
  purple1: { x: 389, y: 684 },
  navy2: { x: -989, y: -706 },
  navy1: { x: 597, y: 558 },
};

const page6Positions = {
  yellow: { x: -146, y: -1783 },
  pink: { x: 643, y: -130 },
  purple2: { x: 899, y: 638 },
  purple1: { x: -672, y: -296 },
  navy2: { x: 128, y: 732 },
  navy1: { x: -63, y: -1072 },
};

const page7Positions = {
  yellow: { x: 284, y: -371 },
  pink: { x: 383, y: -147 },
  purple2: { x: 67, y: 989 },
  purple1: { x: -451, y: -706 },
  navy2: { x: -706, y: -992 },
  navy1: { x: 67, y: 1306 },
};

const page8Positions = {
  yellow: { x: -1338, y: -198 },
  pink: { x: 763, y: -233 },
  purple2: { x: 360, y: 152 },
  purple1: { x: -451, y: -706 },
  navy2: { x: 1120, y: 707 },
  navy1: { x: 360, y: -1043 },
};

const page9Positions = {
  yellow: { x: -1338, y: -198 },
  pink: { x: 763, y: -233 },
  purple2: { x: 0, y: 1259 },
  purple1: { x: 657, y: -1611 },
  navy2: { x: -381, y: 1177 },
  navy1: { x: 1132, y: -1116 },
};

const page10Positions = {
  yellow: { x: -1338, y: -198 },
  pink: { x: 763, y: -233 },
  purple2: { x: 360, y: 152 },
  purple1: { x: -451, y: -706 },
  navy2: { x: 256, y: -572 },
  navy1: { x: 0, y: 527 },
};

// Consolidate all page positions into an array
const allPagePositions = [
  page1Positions,
  page2Positions,
  page3Positions,
  page4Positions,
  page5Positions,
  page6Positions,
  page7Positions,
  page8Positions,
  page9Positions,
  page10Positions,
];

// Get circle elements
const circles = {
  yellow: document.getElementById('yellow'),
  pink: document.getElementById('pink'),
  purple2: document.getElementById('purple2'),
  purple1: document.getElementById('purple1'),
  navy2: document.getElementById('navy2'),
  navy1: document.getElementById('navy1'),
};

// Get expand-line elements
const expandLine = document.querySelector('.expand-line');
const page2 = document.getElementById('page2');
const page2Content = document.querySelector('.page2-content');

// Linear interpolation function
function lerp(start, end, progress) {
  return start + (end - start) * progress;
}

// Easing function for smoother animation
function easeInOutCubic(x) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

// Update expand-line based on scroll progress
function updateExpandLine() {
  if (!expandLine || !page2) return;

  const windowHeight = window.innerHeight;
  const page2Rect = page2.getBoundingClientRect();

  // Calculate how much of page2 is visible
  const pageTop = page2Rect.top;
  const pageHeight = page2Rect.height;

  // Calculate scroll progress (0 to 1)
  let progress = 0;
  if (pageTop < windowHeight && pageTop > -pageHeight) {
    // Page is partially or fully visible
    progress = Math.min(Math.max((windowHeight - pageTop) / windowHeight, 0), 1);
  }

  // Set line width based on progress (0% to 80%)
  expandLine.style.width = progress * 320 + 'px';
}

// Update parallax for all pages (2-10) based on scroll progress
function updateAllPagesParallax() {
  const windowHeight = window.innerHeight;

  // Loop through pages 2-10
  for (let i = 2; i <= 10; i++) {
    const page = document.getElementById(`page${i}`);
    if (!page) continue;

    const pageRect = page.getBoundingClientRect();
    const pageTop = pageRect.top;

    // Calculate scroll progress (0 to 1) - always calculate and clamp
    // This keeps the final position when scrolled past the page
    let rawProgress = (windowHeight - pageTop) / (windowHeight * 0.7);
    let progress = Math.min(Math.max(rawProgress, 0), 1);

    // Set translateY based on progress
    // progress = 0: content is 180px below
    // progress = 1: content is at normal position (0px)
    const translateY = (1 - progress) * 180;

    page.style.transform = `translateY(${translateY}px)`;
  }
}

// Update circle positions based on scroll progress
function updateCircles() {
  // Get scroll position
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const windowHeight = window.innerHeight;
  const totalPages = allPagePositions.length;
  const totalScrollHeight = windowHeight * (totalPages - 1);

  // Calculate overall progress (0 to 1 across all pages)
  let overallProgress = Math.min(Math.max(scrollTop / totalScrollHeight, 0), 1);

  // Calculate which segment we're in (0-8 for 10 pages)
  const segmentProgress = overallProgress * (totalPages - 1);
  const currentSegment = Math.floor(segmentProgress);
  const nextSegment = Math.min(currentSegment + 1, totalPages - 1);

  // Calculate progress within current segment (0 to 1)
  const segmentLocalProgress = segmentProgress - currentSegment;

  // Apply easing for smoother animation
  const easedProgress = easeInOutCubic(segmentLocalProgress);

  // Get positions for current and next page
  const currentPagePositions = allPagePositions[currentSegment];
  const nextPagePositions = allPagePositions[nextSegment];

  // Update each circle
  Object.keys(circles).forEach((id) => {
    const circle = circles[id];
    if (!circle) return;

    // Get start and end positions for this circle
    const startPos = currentPagePositions[id];
    const endPos = nextPagePositions[id];

    // Calculate interpolated position
    const currentX = lerp(startPos.x, endPos.x, easedProgress);
    const currentY = lerp(startPos.y, endPos.y, easedProgress);

    // Calculate translation from initial CSS position (page1)
    const initialPos = allPagePositions[0][id];
    const translateX = currentX - initialPos.x;
    const translateY = currentY - initialPos.y;

    // Apply transform (more performant than changing left/top)
    circle.style.transform = `translate(${translateX}px, ${translateY}px)`;
  });

  // Update expand-line animation
  updateExpandLine();

  // Update parallax animation for all pages
  updateAllPagesParallax();

  // Request next frame
  requestAnimationFrame(updateCircles);
}

// Initialize animation loop
requestAnimationFrame(updateCircles);

// Optional: Add scroll event listener for additional effects
window.addEventListener('scroll', () => {
  // Can add additional scroll-based effects here if needed
});
