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

const page11Positions = {
  yellow: { x: -1200, y: -300 },
  pink: { x: 650, y: -350 },
  purple2: { x: 450, y: 200 },
  purple1: { x: -600, y: -650 },
  navy2: { x: 300, y: -500 },
  navy1: { x: -100, y: 600 },
};

const page12Positions = {
  yellow: { x: -1100, y: -250 },
  pink: { x: 800, y: -400 },
  purple2: { x: 500, y: 250 },
  purple1: { x: -700, y: -600 },
  navy2: { x: 350, y: -450 },
  navy1: { x: -150, y: 650 },
};

const page13Positions = {
  yellow: { x: -1250, y: -350 },
  pink: { x: 700, y: -450 },
  purple2: { x: 400, y: 300 },
  purple1: { x: -650, y: -700 },
  navy2: { x: 280, y: -520 },
  navy1: { x: -50, y: 700 },
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
  page11Positions,
  page12Positions,
  page13Positions,
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

// Animate page 2 elements
let page2Animated = false;

// Animate page 3 people image
let page3Animated = false;

// Animate page 4 HK icon
let page4Animated = false;

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

// Animate page 2 elements
function animatePage2Elements() {
  if (page2Animated) return;

  const page2 = document.getElementById('page2');
  if (!page2) return;

  const windowHeight = window.innerHeight;
  const page2Rect = page2.getBoundingClientRect();

  // Trigger when page 2 is 30% visible from top
  if (page2Rect.top < windowHeight * 0.3 && page2Rect.bottom > 0) {
    page2Animated = true;

    const orbitText = document.querySelector('.orbit-text');
    const orbitOverlay = document.querySelector('.orbit-text-overlay');

    setTimeout(() => orbitText?.classList.add('animate'), 0);
    setTimeout(() => orbitOverlay?.classList.add('animate'), 300);
  }
}

// Animate page 3 people image
function animatePage3People() {
  if (page3Animated) return;

  const page3 = document.getElementById('page3');
  if (!page3) return;

  const windowHeight = window.innerHeight;
  const page3Rect = page3.getBoundingClientRect();

  // Trigger when page 3 is 30% visible from top
  if (page3Rect.top < windowHeight * 0.3 && page3Rect.bottom > 0) {
    page3Animated = true;

    const peopleImg = document.querySelector('#page3 img');
    peopleImg?.classList.add('animate-pop');
  }
}

// Animate page 4 HK icon and content icons
function animatePage4Icon() {
  if (page4Animated) return;

  const page4 = document.getElementById('page4');
  if (!page4) return;

  const windowHeight = window.innerHeight;
  const page4Rect = page4.getBoundingClientRect();

  // Trigger when page 4 is 30% visible from top
  if (page4Rect.top < windowHeight * 0.3 && page4Rect.bottom > 0) {
    page4Animated = true;

    const hkIcon = document.querySelector('.hk-icon');
    hkIcon?.classList.add('animate-pop');

    const icon1 = document.querySelector('#page4-content div img[alt="Page 4 Icon 1"]');
    const icon2 = document.querySelector('#page4-content div img[alt="Page 4 Icon 2"]');

    setTimeout(() => icon1?.classList.add('animate'), 0);
    setTimeout(() => icon2?.classList.add('animate'), 0);
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
    const duration = 1000; // 2 seconds
    const start = 4000;
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

    // Animate hidden youth text
    const hiddenYouthText = document.getElementById('hidden-youth-txt');
    setTimeout(() => hiddenYouthText?.classList.add('animate'), 1000);
  }
}

// Animate page 6 divs
let page6Animated = false;

function animatePage6Divs() {
  if (page6Animated) return;

  const page6 = document.getElementById('page6');
  if (!page6) return;

  const windowHeight = window.innerHeight;
  const page6Rect = page6.getBoundingClientRect();

  // Trigger when page 6 is 30% visible from top
  if (page6Rect.top < windowHeight * 0.3 && page6Rect.bottom > 0) {
    page6Animated = true;

    const page6Divs = document.querySelectorAll('#page6 > div > div');

    setTimeout(() => page6Divs[0]?.classList.add('animate'), 0);
    setTimeout(() => page6Divs[1]?.classList.add('animate'), 300);
    setTimeout(() => page6Divs[2]?.classList.add('animate'), 600);
  }
}

// Animate page 8 images
let page8Animated = false;

function animatePage8Images() {
  if (page8Animated) return;

  const page8 = document.getElementById('page8');
  if (!page8) return;

  const windowHeight = window.innerHeight;
  const page8Rect = page8.getBoundingClientRect();

  // Trigger when page 8 is 30% visible from top
  if (page8Rect.top < windowHeight * 0.3 && page8Rect.bottom > 0) {
    page8Animated = true;

    const page8Images = document.querySelectorAll('.page8-image img');
    const delays = [0, 300, 600, 900, 1200]; // Sequential delays

    delays.forEach((delay, i) => {
      setTimeout(() => {
        if (page8Images[i + 1]) {
          page8Images[i + 1].classList.add('animate');
        }
      }, delay);
    });
  }
}

// Animate page 9 elements
let page9Animated = false;

function animatePage9Elements() {
  if (page9Animated) return;

  const page9 = document.getElementById('page9');
  if (!page9) return;

  const windowHeight = window.innerHeight;
  const page9Rect = page9.getBoundingClientRect();

  // Trigger when page 9 is 30% visible from top
  if (page9Rect.top < windowHeight * 0.3 && page9Rect.bottom > 0) {
    page9Animated = true;

    const orbitText = document.querySelector('#page9 img[alt="Orbit Text"]');
    const appIcon = document.querySelector('#page9 img[alt="App Icon"]');
    const paragraphs = document.querySelectorAll('#page9 p');

    setTimeout(() => orbitText?.classList.add('animate'), 0);
    setTimeout(() => appIcon?.classList.add('animate'), 150);
    setTimeout(() => paragraphs[0]?.classList.add('animate'), 300);
    setTimeout(() => paragraphs[1]?.classList.add('animate'), 600);
  }
}

// Animate page 10 phone grid
let page10Animated = false;

function animatePage10PhoneGrid() {
  if (page10Animated) return;

  const page10 = document.getElementById('page10');
  if (!page10) return;

  const windowHeight = window.innerHeight;
  const page10Rect = page10.getBoundingClientRect();

  // Trigger when page 10 is 30% visible from top
  if (page10Rect.top < windowHeight * 0.3 && page10Rect.bottom > 0) {
    page10Animated = true;

    const phoneItems = document.querySelectorAll('.page10-phone-item');

    setTimeout(() => phoneItems[0]?.classList.add('animate'), 0);
    setTimeout(() => phoneItems[1]?.classList.add('animate'), 150);
    setTimeout(() => phoneItems[2]?.classList.add('animate'), 300);
    setTimeout(() => phoneItems[3]?.classList.add('animate'), 450);
  }
}

// Animate page 11 elements
let page11Animated = false;

function animatePage11Elements() {
  if (page11Animated) return;

  const page11 = document.getElementById('page11');
  if (!page11) return;

  const windowHeight = window.innerHeight;
  const page11Rect = page11.getBoundingClientRect();

  // Trigger when page 11 is 30% visible from top
  if (page11Rect.top < windowHeight * 0.3 && page11Rect.bottom > 0) {
    page11Animated = true;

    const lv1 = document.querySelector('.page11-lv1');
    const lv2 = document.querySelector('.page11-lv2');
    const lv3 = document.querySelector('.page11-lv3');
    const lv4 = document.querySelector('.page11-lv4');
    const lv5 = document.querySelector('.page11-lv5');
    const lv6 = document.querySelector('.page11-lv6');
    const arrow = document.querySelector('.page11-arrow');
    const screen = document.querySelector('.page11-screen');

    setTimeout(() => lv1?.classList.add('animate'), 0);
    setTimeout(() => lv2?.classList.add('animate'), 300);
    setTimeout(() => lv3?.classList.add('animate'), 600);
    setTimeout(() => lv4?.classList.add('animate'), 900);
    setTimeout(() => lv5?.classList.add('animate'), 1200);
    setTimeout(() => lv6?.classList.add('animate'), 1500);
    setTimeout(() => arrow?.classList.add('animate'), 1800);
    setTimeout(() => screen?.classList.add('animate'), 2200);
  }
}

// Animate page 12 images
let page12Animated = false;

function animatePage12Images() {
  if (page12Animated) return;

  const page12 = document.getElementById('page12');
  if (!page12) return;

  const windowHeight = window.innerHeight;
  const page12Rect = page12.getBoundingClientRect();

  // Trigger when page 12 is 30% visible from top
  if (page12Rect.top < windowHeight * 0.3 && page12Rect.bottom > 0) {
    page12Animated = true;

    const images = document.querySelectorAll('.page12-image');

    setTimeout(() => images[0]?.classList.add('animate'), 300);
    setTimeout(() => images[2]?.classList.add('animate'), 1300);
  }
}

// Animate page 13 elements
let page13Animated = false;

function animatePage13Elements() {
  if (page13Animated) return;

  const page13 = document.getElementById('page13');
  if (!page13) return;

  const windowHeight = window.innerHeight;
  const page13Rect = page13.getBoundingClientRect();

  // Trigger when page 13 is 30% visible from top
  if (page13Rect.top < windowHeight * 0.3 && page13Rect.bottom > 0) {
    page13Animated = true;

    const progress = document.querySelector('.page13-progress');
    const title = document.querySelector('.page13-connect-title');
    const qrCode = document.querySelector('#page13 img[alt="QR Code"]');

    setTimeout(() => progress?.classList.add('animate'), 0);
    setTimeout(() => title?.classList.add('animate'), 300);
    setTimeout(() => qrCode?.classList.add('animate'), 600);
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

  // Update page 2 animations
  animatePage2Elements();

  // Update page 3 animations
  animatePage3People();

  // Update page 4 animations
  animatePage4Icon();

  // Update stat box animation
  animateStatBox();

  // Update page 6 divs animation
  animatePage6Divs();

  // Update page 8 images animation
  animatePage8Images();

  // Update page 9 elements animation
  animatePage9Elements();

  // Update page 10 phone grid animation
  animatePage10PhoneGrid();

  // Update page 11 elements animation
  animatePage11Elements();

  // Update page 12 images animation
  animatePage12Images();

  // Update page 13 elements animation
  animatePage13Elements();

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

// Page 2 navigation buttons
const page2InfoBtn = document.querySelector('.page2-2');
const page2BackgroundBtn = document.querySelector('.page2-3');
const page3 = document.getElementById('page3');
const page9 = document.getElementById('page9');

// "Click for more information" button - scrolls to page 9
if (page2InfoBtn && page9) {
  page2InfoBtn.addEventListener('click', () => {
    const page9Position = page9.offsetTop;

    window.scrollTo({
      top: page9Position,
      behavior: 'smooth',
    });
  });
}

// "Scroll to Read Background" button - scrolls to page 3
if (page2BackgroundBtn && page3) {
  page2BackgroundBtn.addEventListener('click', () => {
    const page3Position = page3.offsetTop;

    window.scrollTo({
      top: page3Position,
      behavior: 'smooth',
    });
  });
}

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

// Update bullet connector line position
function updateBulletLine() {
  const firstBullet = document.querySelector('.page10-bullet .bullet-icon');
  const lastBullet = document.querySelector('.page13-bullet2 .bullet-icon');
  const line = document.querySelector('.bullet-connector-line');

  if (firstBullet && lastBullet && line) {
    const firstRect = firstBullet.getBoundingClientRect();
    const lastRect = lastBullet.getBoundingClientRect();

    const firstTop = firstRect.top + window.scrollY + firstRect.height / 2;
    const lastTop = lastRect.top + window.scrollY + lastRect.height / 2;

    line.style.top = `${firstTop}px`;
    line.style.height = `${lastTop - firstTop}px`;
  }
}

window.addEventListener('load', updateBulletLine);
window.addEventListener('resize', updateBulletLine);
