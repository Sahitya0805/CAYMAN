/**
 * Cayman Super Kings — Our Journey 3D Book Controller
 * Realistic 5-page interactive book with turning animations, chapter tabs, and touch swipe.
 */

document.addEventListener('DOMContentLoaded', () => {
  initJourneyBook();
});

function initJourneyBook() {
  const book = document.getElementById('journey-book');
  if (!book) return;

  const pages = book.querySelectorAll('.book-page');
  const prevBtn = document.getElementById('book-prev-btn');
  const nextBtn = document.getElementById('book-next-btn');
  const pageIndicator = document.getElementById('book-page-indicator');
  const progressBar = document.getElementById('book-progress-fill');
  const chapterTabs = document.querySelectorAll('.book-tab-btn');
  const totalPages = pages.length; // 5 pages (0 to 4)

  let currentPage = 0;

  function updateBookState() {
    pages.forEach((page, index) => {
      page.classList.remove('page-active', 'page-turned', 'page-incoming');
      
      if (index < currentPage) {
        // Already turned to the left
        page.classList.add('page-turned');
        page.style.zIndex = index + 1;
        page.setAttribute('aria-hidden', 'true');
      } else if (index === currentPage) {
        // Currently active / visible page
        page.classList.add('page-active');
        page.style.zIndex = 10;
        page.setAttribute('aria-hidden', 'false');
      } else {
        // Upcoming pages stacked to the right
        page.classList.add('page-incoming');
        page.style.zIndex = totalPages - index;
        page.setAttribute('aria-hidden', 'true');
      }
    });

    // Update controls
    if (prevBtn) {
      prevBtn.disabled = currentPage === 0;
      prevBtn.setAttribute('aria-disabled', String(currentPage === 0));
    }
    if (nextBtn) {
      nextBtn.disabled = currentPage === totalPages - 1;
      nextBtn.setAttribute('aria-disabled', String(currentPage === totalPages - 1));
    }

    // Update indicator
    if (pageIndicator) {
      pageIndicator.textContent = `Chapter 0${currentPage + 1} of 0${totalPages}`;
    }

    // Update Progress bar
    if (progressBar) {
      const progressPercent = ((currentPage + 1) / totalPages) * 100;
      progressBar.style.width = `${progressPercent}%`;
    }

    // Update Chapter Bookmark Tabs
    chapterTabs.forEach((tab, index) => {
      if (index === currentPage) {
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
      } else {
        tab.classList.remove('active');
        tab.setAttribute('aria-selected', 'false');
      }
    });
  }

  function turnToPage(index) {
    if (index < 0 || index >= totalPages || index === currentPage) return;
    currentPage = index;
    updateBookState();
  }

  function nextPage() {
    if (currentPage < totalPages - 1) {
      currentPage++;
      updateBookState();
    }
  }

  function prevPage() {
    if (currentPage > 0) {
      currentPage--;
      updateBookState();
    }
  }

  // Button Listeners
  if (nextBtn) nextBtn.addEventListener('click', nextPage);
  if (prevBtn) prevBtn.addEventListener('click', prevPage);

  // Tab Listeners
  chapterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetPage = parseInt(tab.getAttribute('data-page'), 10);
      if (!isNaN(targetPage)) {
        turnToPage(targetPage);
      }
    });
  });

  // Click on Page to Flip Forward or Backward
  pages.forEach((page, index) => {
    page.addEventListener('click', (e) => {
      // Don't flip if clicking interactive link/button inside page
      if (e.target.closest('a, button, input')) return;

      const rect = page.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      
      if (index === currentPage) {
        if (clickX > rect.width * 0.5) {
          nextPage();
        } else {
          prevPage();
        }
      }
    });
  });

  // Touch Swipe Support
  let touchStartX = 0;
  let touchEndX = 0;

  book.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  book.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const swipeDistance = touchEndX - touchStartX;
    if (Math.abs(swipeDistance) > 45) {
      if (swipeDistance < 0) {
        nextPage(); // Swipe Left -> Next Page
      } else {
        prevPage(); // Swipe Right -> Prev Page
      }
    }
  }

  // Keyboard navigation when book is in focus
  book.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'PageDown') {
      e.preventDefault();
      nextPage();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      prevPage();
    }
  });

  // Initialize first state
  updateBookState();
}
