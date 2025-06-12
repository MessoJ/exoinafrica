/**
* Template Name: Bocor
* Updated: Mar 17 2024 with Bootstrap v5.3.3
*/

(function() {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  mobileNavToggleBtn.addEventListener('click', mobileNavToogle);

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.addEventListener('click', function() {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

  });

  // Testimonials slider
  const testimonialsSwiper = new Swiper('.testimonials-slider', {
    speed: 600,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    slidesPerView: 'auto',
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 20
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 20
      },
      1200: {
        slidesPerView: 3,
        spaceBetween: 20
      }
    }
  });

  // Freedom Calculator
  document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded. Initializing calculator.');
    const cleaningHoursInput = document.getElementById('cleaning-hours');
    const hoursValue = document.getElementById('hours-value');
    const roomCountSelect = document.getElementById('room-count');
    const serviceFrequencySelect = document.getElementById('service-frequency');
    const freedomScore = document.getElementById('freedom-score');
    const weeklySavings = document.getElementById('weekly-savings');
    const monthlySavings = document.getElementById('monthly-savings');
    const annualSavings = document.getElementById('annual-savings');
    const activitiesList = document.getElementById('activities-list');

    function updateCalculator() {
      const hours = parseInt(cleaningHoursInput.value);
      const rooms = parseInt(roomCountSelect.value);
      const frequency = serviceFrequencySelect.value;
      
      // Calculate time saved based on frequency
      let weeklyTimeSaved = hours;
      switch(frequency) {
        case 'weekly':
          weeklyTimeSaved = hours;
          break;
        case 'biweekly':
          weeklyTimeSaved = hours / 2;
          break;
        case 'monthly':
          weeklyTimeSaved = hours / 4;
          break;
      }
      
      // Adjust based on room count (more rooms = more time saved)
      weeklyTimeSaved *= (1 + (rooms * 0.1));
      
      const monthlyTimeSaved = weeklyTimeSaved * 4;
      const yearlyTimeSaved = monthlyTimeSaved * 12;
      
      // Update display
      weeklySavings.textContent = Math.round(weeklyTimeSaved) + ' hours';
      monthlySavings.textContent = Math.round(monthlyTimeSaved) + ' hours';
      annualSavings.textContent = Math.round(yearlyTimeSaved) + ' hours';
      
      // Calculate freedom score (0-100)
      const maxPossibleHours = 40; // Assuming 40 hours is maximum cleaning time
      const score = Math.min(100, Math.round((weeklyTimeSaved / maxPossibleHours) * 100));
      freedomScore.textContent = score;
      console.log('Freedom Score updated to:', score);
      
      // Update activities based on score
      let activities = [];
      if (score >= 80) {
        activities = [
          'Take a weekend getaway',
          'Learn a new hobby',
          'Start a side business',
          'Spend quality time with family',
          'Focus on personal development'
        ];
      } else if (score >= 50) {
        activities = [
          'Join a fitness class',
          'Read more books',
          'Take online courses',
          'Start a garden',
          'Volunteer in your community'
        ];
      } else {
        activities = [
          'Enjoy more family time',
          'Take longer walks',
          'Cook new recipes',
          'Practice meditation',
          'Start a journal'
        ];
      }
      
      // Update activities list with animations
      activitiesList.innerHTML = '';
      activities.forEach((activity, index) => {
        const li = document.createElement('li');
        li.textContent = activity;
        li.style.opacity = '0';
        li.style.transform = 'translateX(-20px)';
        li.style.transition = 'all 0.3s ease';
        activitiesList.appendChild(li);
        
        // Animate each item with a delay
        setTimeout(() => {
          li.style.opacity = '1';
          li.style.transform = 'translateX(0)';
        }, index * 100);
      });
    }

    // Add event listeners
    cleaningHoursInput.addEventListener('input', function() {
      hoursValue.textContent = this.value;
      updateCalculator();
    });

    roomCountSelect.addEventListener('change', updateCalculator);
    serviceFrequencySelect.addEventListener('change', updateCalculator);

    // Initial calculation
    updateCalculator();
  });

})();