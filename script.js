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

// Animate stat box on page 5
let page5Animated = false;
const statBoxLarge = document.querySelector('.stat-box-large');
const statBoxNumber = statBoxLarge ? statBoxLarge.querySelector('p') : null;
const arrowImg = document.querySelector('.arrow img');

function animateStatBox() {
  if (page5Animated || !statBoxLarge || !statBoxNumber) return;

  const page5 = document.getElementById('page5');
  if (!page5) return;

  const windowHeight = window.innerHeight;
  const page5Rect = page5.getBoundingClientRect();

  // Trigger when page 5 is 50% visible
  if (page5Rect.top < windowHeight * 0.3 && page5Rect.bottom > 0) {
    page5Animated = true;

    // Animate height
    statBoxLarge.style.height = '22rem';

    // Animate arrow reveal
    if (arrowImg) {
      arrowImg.style.clipPath = 'inset(0 0 0 0)';
    }

    // Animate counter
    const duration = 2000; // 2 seconds
    const start = 0;
    const end = 5500;
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.floor(start + (end - start) * progress);

      statBoxNumber.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    }

    requestAnimationFrame(updateCounter);
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

  // Update stat box animation
  animateStatBox();

  // Request next frame
  requestAnimationFrame(updateCircles);
}

// Initialize animation loop
requestAnimationFrame(updateCircles);

// Optional: Add scroll event listener for additional effects
window.addEventListener('scroll', () => {
  // Can add additional scroll-based effects here if needed
});

// Carousel functionality for Page 7
const carouselWrapper = document.querySelector('.carousel-wrapper');
const carouselBoxes = document.querySelectorAll('.carousel-box');
const dots = document.querySelectorAll('.dot');
let currentSlide = 0;
let box1Animated = false;

function animateBox1Pie() {
  const piePath = document.getElementById('box1-pie-path');
  if (!piePath) return;

  let angle = 0;
  const targetAngle = 306; // 85% of 360
  const duration = 1000; // ms
  const startTime = Date.now();
  const π = Math.PI;

  function draw() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    angle = progress * targetAngle;

    const r = (angle * π) / 180;
    const x = Math.sin(r) * 100;
    const y = Math.cos(r) * -100;
    const mid = angle > 180 ? 1 : 0;
    const path = `M 0 0 v -100 A 100 100 1 ${mid} 1 ${x} ${y} z`;

    piePath.setAttribute('d', path);

    if (progress < 1) {
      requestAnimationFrame(draw);
    }
  }

  draw();
}

function triggerBox1Animation() {
  if (!box1Animated && currentSlide === 0) {
    carouselBoxes[0].classList.add('animated');
    animateBox1Pie();
    box1Animated = true;
  }
}

function updateActiveSlide() {
  // Calculate which box is currently in the center
  const scrollLeft = carouselWrapper.scrollLeft;
  const boxWidth = carouselBoxes[0].offsetWidth;
  const gap = 32; // 2rem = 32px

  // Calculate the index of the centered box
  const newSlide = Math.round(scrollLeft / (boxWidth + gap));

  if (newSlide !== currentSlide && newSlide >= 0 && newSlide < carouselBoxes.length) {
    // Remove active class from previous elements
    carouselBoxes[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');

    // Update current slide
    currentSlide = newSlide;

    // Add active class to new elements
    carouselBoxes[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');

    // Trigger animations based on current slide
    if (currentSlide === 0) {
      triggerBox1Animation();
    } else if (currentSlide === 1) {
      triggerBox2Animation();
    } else if (currentSlide === 2) {
      triggerBox3Animation();
    }
  }
}

function goToSlide(slideIndex) {
  currentSlide = slideIndex;

  // Scroll to the selected box
  carouselBoxes[slideIndex].scrollIntoView({
    behavior: 'smooth',
    block: 'nearest',
    inline: 'center',
  });

  // Trigger animations based on slide index
  setTimeout(() => {
    if (slideIndex === 0) {
      triggerBox1Animation();
    } else if (slideIndex === 1) {
      triggerBox2Animation();
    } else if (slideIndex === 2) {
      triggerBox3Animation();
    }
  }, 100);
}

// Add scroll event listener to update active state
carouselWrapper.addEventListener('scroll', updateActiveSlide);

// Add click event listeners to dots
dots.forEach((dot) => {
  dot.addEventListener('click', () => {
    const slideIndex = parseInt(dot.getAttribute('data-slide'));
    goToSlide(slideIndex);
  });
});

// Page 6 button navigation to Page 7 carousel
const page6Buttons = document.querySelectorAll('#page6 button');
const page7 = document.getElementById('page7');

page6Buttons.forEach((button) => {
  button.addEventListener('click', () => {
    const boxIndex = parseInt(button.getAttribute('data-box'));

    // Calculate exact scroll position for page 7
    const page7Position = page7.offsetTop;

    // Scroll to page 7 with precise positioning
    window.scrollTo({
      top: page7Position,
      behavior: 'smooth',
    });

    // Wait for scroll to complete, then navigate to the specific carousel box
    setTimeout(() => {
      goToSlide(boxIndex);
    }, 600); // Adjusted timing for smooth scroll completion
  });
});

// Trigger box 1 animation when page 7 comes into view
const observerOptions = {
  root: null,
  threshold: 0.5,
};

const page7Observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting && currentSlide === 0) {
      triggerBox1Animation();
    }
  });
}, observerOptions);

if (page7) {
  page7Observer.observe(page7);
}

// Box 2 Animation Variables
let box2Animated = false;

function animateBox2Pies() {
  const leftPiePath = document.getElementById('box2-pie-path-left');
  const rightPiePath = document.getElementById('box2-pie-path-right');

  if (!leftPiePath || !rightPiePath) return;

  const duration = 1000; // 1 second
  const startTime = Date.now();
  const π = Math.PI;

  // Left pie: 98% = 352.8 degrees
  const leftTargetAngle = 353;
  // Right pie: 57% = 205.2 degrees
  const rightTargetAngle = 205;

  function draw() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Animate left pie (98%)
    const leftAngle = progress * leftTargetAngle;
    const leftR = (leftAngle * π) / 180;
    const leftX = Math.sin(leftR) * 100;
    const leftY = Math.cos(leftR) * -100;
    const leftMid = leftAngle > 180 ? 1 : 0;
    const leftPath = `M 0 0 v -100 A 100 100 1 ${leftMid} 1 ${leftX} ${leftY} z`;
    leftPiePath.setAttribute('d', leftPath);

    // Animate right pie (57%)
    const rightAngle = progress * rightTargetAngle;
    const rightR = (rightAngle * π) / 180;
    const rightX = Math.sin(rightR) * 100;
    const rightY = Math.cos(rightR) * -100;
    const rightMid = rightAngle > 180 ? 1 : 0;
    const rightPath = `M 0 0 v -100 A 100 100 1 ${rightMid} 1 ${rightX} ${rightY} z`;
    rightPiePath.setAttribute('d', rightPath);

    if (progress < 1) {
      requestAnimationFrame(draw);
    }
  }

  draw();
}

function triggerBox2Animation() {
  if (!box2Animated && currentSlide === 1) {
    carouselBoxes[1].classList.add('animated');
    animateBox2Pies();
    box2Animated = true;
  }
}

// Box 3 Animation Variables
let box3Animated = false;

function animateBox3Pies() {
  const leftPiePath = document.getElementById('box3-pie-path-left');
  const rightPiePath = document.getElementById('box3-pie-path-right');

  if (!leftPiePath || !rightPiePath) return;

  const duration = 1000; // 1 second
  const startTime = Date.now();
  const π = Math.PI;

  // Left pie: 85% = 306 degrees
  const leftTargetAngle = 306;
  // Right pie: 30% = 108 degrees
  const rightTargetAngle = 108;

  function draw() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Animate left pie (85%)
    const leftAngle = progress * leftTargetAngle;
    const leftR = (leftAngle * π) / 180;
    const leftX = Math.sin(leftR) * 100;
    const leftY = Math.cos(leftR) * -100;
    const leftMid = leftAngle > 180 ? 1 : 0;
    const leftPath = `M 0 0 v -100 A 100 100 1 ${leftMid} 1 ${leftX} ${leftY} z`;
    leftPiePath.setAttribute('d', leftPath);

    // Animate right pie (30%)
    const rightAngle = progress * rightTargetAngle;
    const rightR = (rightAngle * π) / 180;
    const rightX = Math.sin(rightR) * 100;
    const rightY = Math.cos(rightR) * -100;
    const rightMid = rightAngle > 180 ? 1 : 0;
    const rightPath = `M 0 0 v -100 A 100 100 1 ${rightMid} 1 ${rightX} ${rightY} z`;
    rightPiePath.setAttribute('d', rightPath);

    if (progress < 1) {
      requestAnimationFrame(draw);
    }
  }

  draw();
}

function triggerBox3Animation() {
  if (!box3Animated && currentSlide === 2) {
    carouselBoxes[2].classList.add('animated');
    animateBox3Pies();
    box3Animated = true;
  }
}
