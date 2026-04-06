/**
 * Gushwork Assignment - Mangalam HDPE Pipes
 * Vanilla JavaScript - No frameworks or libraries
 *
 * Features:
 * 1. Sticky header (appears on scroll, hides when scrolling back up)
 * 2. Image carousel with zoom-on-hover
 * 3. FAQ accordion
 * 4. Versatile applications carousel
 * 5. HDPE manufacturing process stepper
 */

document.addEventListener('DOMContentLoaded', () => {

  // ============================
  // 1. STICKY HEADER
  // ============================
  const stickyHeader = document.getElementById('stickyHeader');
  let lastScrollY = 0;
  const scrollThreshold = window.innerHeight * 0.25; // 25% of viewport

  /**
   * Shows/hides the sticky header based on scroll direction.
   * Header appears when scrolling UP past the first fold,
   * and disappears when scrolling back to the top or scrolling DOWN.
   */
  function handleStickyHeader() {
    const currentScrollY = window.scrollY;

    if (currentScrollY > scrollThreshold && currentScrollY < lastScrollY) {
      // Scrolling UP and past the first fold — show header
      stickyHeader.classList.add('visible');
    } else {
      // Scrolling DOWN or near top — hide header
      stickyHeader.classList.remove('visible');
    }

    lastScrollY = currentScrollY;
  }

  window.addEventListener('scroll', handleStickyHeader, { passive: true });


  // ============================
  // 2. MOBILE MENU
  // ============================
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileBackdrop = document.getElementById('mobileBackdrop');

  function toggleMobileMenu() {
    const isOpen = hamburger.classList.contains('active');
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    mobileBackdrop.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', !isOpen);
    document.body.style.overflow = isOpen ? '' : 'hidden';
  }

  hamburger.addEventListener('click', toggleMobileMenu);
  mobileBackdrop.addEventListener('click', toggleMobileMenu);

  // Close menu on link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (mobileMenu.classList.contains('active')) {
        toggleMobileMenu();
      }
    });
  });


  // ============================
  // 3. IMAGE CAROUSEL WITH ZOOM
  // ============================
  const galleryImages = [
    { src: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80', alt: 'Premium HDPE Pipe - Main View' },
    { src: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80', alt: 'HDPE Pipe - Detail View' },
    { src: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80', alt: 'HDPE Pipe - Side View' },
    { src: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80', alt: 'HDPE Pipe - Cross Section' },
    { src: 'https://images.unsplash.com/photo-1590959651373-a3db0f38a961?w=800&q=80', alt: 'HDPE Pipe - Installation' }
  ];

  let currentImageIndex = 0;
  const mainImage = document.getElementById('mainImage');
  const imageCounter = document.getElementById('imageCounter');
  const thumbnails = document.querySelectorAll('.hero__thumb');
  const mainImageWrapper = document.getElementById('mainImageWrapper');
  const magnifier = document.getElementById('magnifier');
  const zoomPreview = document.getElementById('zoomPreview');
  const zoomImage = document.getElementById('zoomImage');

  /**
   * Updates the main gallery image and active thumbnail state.
   * @param {number} index - The image index to show
   */
  function setGalleryImage(index) {
    currentImageIndex = index;
    mainImage.src = galleryImages[index].src;
    mainImage.alt = galleryImages[index].alt;
    imageCounter.textContent = `${index + 1} / ${galleryImages.length}`;

    // Update zoom image source
    zoomImage.src = galleryImages[index].src;

    // Update active thumbnail
    thumbnails.forEach((thumb, i) => {
      thumb.classList.toggle('active', i === index);
    });
  }

  // Previous/Next buttons
  document.getElementById('prevBtn').addEventListener('click', () => {
    const newIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    setGalleryImage(newIndex);
  });

  document.getElementById('nextBtn').addEventListener('click', () => {
    const newIndex = (currentImageIndex + 1) % galleryImages.length;
    setGalleryImage(newIndex);
  });

  // Thumbnail clicks
  thumbnails.forEach(thumb => {
    thumb.addEventListener('click', () => {
      const index = parseInt(thumb.dataset.index, 10);
      setGalleryImage(index);
    });
  });

  /**
   * Zoom-on-hover functionality (desktop only).
   * Shows a magnifier lens following the cursor on the main image,
   * and a larger zoom preview panel to the right.
   */
  mainImageWrapper.addEventListener('mouseenter', () => {
    // Only enable zoom on desktop (>1024px)
    if (window.innerWidth < 1024) return;
    magnifier.classList.add('active');
    zoomPreview.classList.add('active');
    zoomImage.src = galleryImages[currentImageIndex].src;
  });

  mainImageWrapper.addEventListener('mouseleave', () => {
    magnifier.classList.remove('active');
    zoomPreview.classList.remove('active');
  });

  mainImageWrapper.addEventListener('mousemove', (e) => {
    if (window.innerWidth < 1024) return;

    const rect = mainImageWrapper.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Position magnifier centered on cursor
    const magSize = 100;
    magnifier.style.left = `${x - magSize / 2}px`;
    magnifier.style.top = `${y - magSize / 2}px`;

    // Calculate zoom preview position (2x zoom)
    const percentX = x / rect.width;
    const percentY = y / rect.height;

    const zoomWidth = zoomPreview.offsetWidth;
    const zoomHeight = zoomPreview.offsetHeight;
    const imgWidth = zoomWidth * 2;
    const imgHeight = zoomHeight * 2;

    zoomImage.style.width = `${imgWidth}px`;
    zoomImage.style.height = `${imgHeight}px`;
    zoomImage.style.left = `${-(percentX * imgWidth - zoomWidth / 2)}px`;
    zoomImage.style.top = `${-(percentY * imgHeight - zoomHeight / 2)}px`;
  });

  // Keyboard navigation for carousel
  document.addEventListener('keydown', (e) => {
    // Only if hero gallery is in viewport
    const galleryRect = document.getElementById('heroGallery').getBoundingClientRect();
    if (galleryRect.top > window.innerHeight || galleryRect.bottom < 0) return;

    if (e.key === 'ArrowLeft') {
      setGalleryImage((currentImageIndex - 1 + galleryImages.length) % galleryImages.length);
    } else if (e.key === 'ArrowRight') {
      setGalleryImage((currentImageIndex + 1) % galleryImages.length);
    }
  });


  // ============================
  // 4. FAQ ACCORDION
  // ============================
  const faqItems = document.querySelectorAll('.faq__item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq__question');

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other items
      faqItems.forEach(other => other.classList.remove('active'));

      // Toggle current
      if (!isActive) {
        item.classList.add('active');
      }

      // Update aria
      faqItems.forEach(faq => {
        const btn = faq.querySelector('.faq__question');
        btn.setAttribute('aria-expanded', faq.classList.contains('active'));
      });
    });

    // Keyboard accessibility
    question.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        question.click();
      }
    });
  });


  // ============================
  // 5. VERSATILE APPLICATIONS CAROUSEL
  // ============================
  const versatileCarousel = document.getElementById('versatileCarousel');
  const versatilePrev = document.getElementById('versatilePrev');
  const versatileNext = document.getElementById('versatileNext');
  const scrollAmount = 340;

  versatilePrev.addEventListener('click', () => {
    versatileCarousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  });

  versatileNext.addEventListener('click', () => {
    versatileCarousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  });


  // ============================
  // 6. HDPE MANUFACTURING STEPPER
  // ============================
  const hdpeSteps = [
    {
      title: 'Raw Material Selection',
      desc: 'Premium PE100 grade polyethylene resin is carefully selected and tested for purity, melt flow index, and density to ensure consistent pipe quality.',
      features: ['PE100 grade resin', 'Purity testing protocols', 'Density verification'],
      image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&q=80'
    },
    {
      title: 'Extrusion Process',
      desc: 'The resin is melted and pushed through a die to form a continuous pipe profile at precisely controlled temperatures and speeds.',
      features: ['Temperature control ±1°C', 'Continuous monitoring', 'Automated die adjustment'],
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&q=80'
    },
    {
      title: 'Vacuum Cooling',
      desc: 'Pipes pass through a vacuum cooling tank where controlled water temperature ensures uniform wall thickness and roundness.',
      features: ['Vacuum calibration', 'Uniform wall thickness', 'Roundness control'],
      image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=600&q=80'
    },
    {
      title: 'Sizing & Calibration',
      desc: 'Precision sizing equipment ensures each pipe meets exact diameter and wall thickness specifications within tight tolerances.',
      features: ['±0.1mm tolerance', 'Laser measurement', 'Real-time adjustment'],
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&q=80'
    },
    {
      title: 'Quality Control',
      desc: 'Every pipe undergoes rigorous testing including hydrostatic pressure tests, dimensional checks, and material property verification.',
      features: ['Hydrostatic testing', 'Dimensional inspection', 'Material certification'],
      image: 'https://images.unsplash.com/photo-1590959651373-a3db0f38a961?w=600&q=80'
    },
    {
      title: 'Marking & Identification',
      desc: 'Permanent inkjet marking prints essential information including size, pressure rating, material grade, and production date.',
      features: ['Permanent inkjet marking', 'Full traceability', 'Standards compliance'],
      image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&q=80'
    },
    {
      title: 'Cutting to Length',
      desc: 'Automated saws cut pipes to standard or custom lengths while coiling machines wind smaller diameters onto spools.',
      features: ['Automated cutting', 'Custom lengths', 'Coil winding'],
      image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600&q=80'
    },
    {
      title: 'Packaging & Dispatch',
      desc: 'Finished pipes are bundled, strapped, and prepared for shipment with protective end caps and clear labeling.',
      features: ['Protective end caps', 'Bundle strapping', 'Shipment tracking'],
      image: 'https://images.unsplash.com/photo-1513828583688-c52646db42da?w=600&q=80'
    }
  ];

  const stepNames = [
    'Raw Material', 'Extrusion', 'Cooling', 'Sizing',
    'Quality Control', 'Marking', 'Cutting', 'Packaging'
  ];

  let currentStep = 0;
  const hdpeStepsDesktop = document.getElementById('hdpeStepsDesktop');
  const hdpeStepMobile = document.getElementById('hdpeStepMobile');

  // Build desktop step chips with connecting lines
  function buildDesktopSteps() {
    hdpeStepsDesktop.innerHTML = '';
    stepNames.forEach((name, i) => {
      if (i > 0) {
        const line = document.createElement('div');
        line.className = 'hdpe__step-line';
        hdpeStepsDesktop.appendChild(line);
      }
      const chip = document.createElement('button');
      chip.className = `hdpe__step-chip${i === currentStep ? ' active' : ''}`;
      chip.textContent = name;
      chip.addEventListener('click', () => setHDPEStep(i));
      hdpeStepsDesktop.appendChild(chip);
    });
  }

  // Check icon SVG for feature list items
  const checkSVG = `<svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="9" stroke="#16a34a" stroke-width="1.5"/><path d="M6 10l3 3 5-6" stroke="#16a34a" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  /**
   * Updates the HDPE stepper to show the given step.
   * @param {number} index - Step index (0-7)
   */
  function setHDPEStep(index) {
    currentStep = index;
    const step = hdpeSteps[index];

    // Update content
    document.getElementById('hdpeHeading').textContent = step.title;
    document.getElementById('hdpeDesc').textContent = step.desc;
    document.getElementById('hdpeImage').src = step.image;

    // Update features list
    const featuresList = document.getElementById('hdpeFeatures');
    featuresList.innerHTML = step.features.map(f =>
      `<li class="hdpe__content-feature">${checkSVG} ${f}</li>`
    ).join('');

    // Update mobile chip
    hdpeStepMobile.textContent = `Step ${index + 1}/8: ${stepNames[index]}`;

    // Update desktop chips
    hdpeStepsDesktop.querySelectorAll('.hdpe__step-chip').forEach((chip, i) => {
      chip.classList.toggle('active', i === index);
    });
  }

  // Mobile prev/next for HDPE stepper
  document.getElementById('hdpePrevMobile').addEventListener('click', () => {
    if (currentStep > 0) setHDPEStep(currentStep - 1);
  });

  document.getElementById('hdpeNextMobile').addEventListener('click', () => {
    if (currentStep < hdpeSteps.length - 1) setHDPEStep(currentStep + 1);
  });

  // Initialize stepper
  buildDesktopSteps();
  setHDPEStep(0);


  // ============================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ============================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
