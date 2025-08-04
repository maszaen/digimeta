// Get URL parameters
const params = new URLSearchParams(window.location.search);
const movieKey = params.get('movie') || 'fantastic-four';
const content = movieData[movieKey];
const env = ENV

// Fallback content for invalid movie keys
const fallback = {
    title: 'Unknown Movie',
    description: 'Movie not found or invalid link. Please try again.',
    image: '/assets/default.jpg',
    director: 'Unknown',
    writers: 'Unknown',
    stars: 'Unknown',
    tags: [],
    rating: '0.0',
    reviews: '0',
    content: 'No content available.',
    redirectUrl: null,
};

const finalContent = content || fallback;

// Initialize page content
function initializePage() {
    // Set dynamic content
    document.getElementById('contentTitle').textContent = finalContent.title;
    document.getElementById('contentTitle2').textContent = finalContent.title;
    document.getElementById('contentDesc').innerHTML = `<p>${finalContent.description}</p>`;
    document.getElementById('thumbnail').style.backgroundImage = `url('${finalContent.image}')`;
    document.getElementById('aboutTitle').textContent = `About ${finalContent.title}`;
    
    // Set movie details
    document.getElementById('directorValue').textContent = `: ${finalContent.director}`;
    document.getElementById('writersValue').textContent = `: ${finalContent.writers}`;
    document.getElementById('starsValue').textContent = `: ${finalContent.stars}`;
    document.getElementById('ratingScore').innerHTML = `${finalContent.rating}<span class="rating-star">&#9733;</span>`;
    document.getElementById('ratingTotal').textContent = `${finalContent.reviews} reviews`;

    populateOtherMovies();
    initializeHeaderInteractions();
    initializeVideoPlayer();
    
    // Set tags
    const movieTags = document.getElementById('movieTags');
    movieTags.innerHTML = '';
    if (finalContent.tags && finalContent.tags.length > 0) {
        finalContent.tags.forEach(tag => {
            const tagElement = document.createElement('span');
            tagElement.className = 'tag';
            tagElement.textContent = tag;
            movieTags.appendChild(tagElement);
        });
    } else {
        movieTags.style.display = 'none';
    }

    // Set movie content
    document.getElementById('movieContent').innerHTML = formatContentToHTML(finalContent.content);

    // Initialize resolution selection
    initializeResolutionSelection();

    // Check download state
    checkDownloadState();

    // Handle unavailable movies
    handleMovieAvailability();
}

// Format text content to HTML
function formatContentToHTML(text) {
    if (!text || typeof text !== 'string') {
        return '';
    }

    const html = text
        .replace(/\*(.*?)\*/g, '<strong>$1</strong>') 
        .replace(/\_(.*?)\_/g, '<em>$1</em>')         
        .replace(/\n\n/g, '<br><br>')
        .replace(/\n/g, '<br>');                   

    return html;
}

async function initializeVideoPlayer() {
  const videoContainer = document.getElementById('videoContainer');
  const finalUrl = `${env.ENDPOINT}/storage/buckets/${env.BUCKET}/files/${finalContent.fileId}/view?project=${env.PROJECT_ID}`;
  videoContainer.innerHTML = `
    <video
          id="videoPlayer"
          class="video-js vjs-theme-city"
          controls
          preload="auto"
          poster="assets/default-black.jpg"
          data-setup="{}"
        >
          <source src="${finalUrl}" type="video/mp4" />
          <p class="vjs-no-js">
            To view this video please enable JavaScript, and consider upgrading to a
            web browser that
            <a href="https://videojs.com/html5-video-support/" target="_blank"
              >supports HTML5 video</a
            >
          </p>
        </video>
  `;
  console.log('Video player initialized with source:', finalUrl);
}

// Handle movie availability
function handleMovieAvailability() {
    const watchBtn = document.getElementById('watchBtn');
    const redirectText = document.getElementById('redirectText');
    const subtitle = document.getElementById('subtitle');
    const progressContainer = document.getElementById('progressContainer');
    const resolutionContainer = document.getElementById('resolutionContainer');
    const movieTags = document.getElementById('movieTags');

    if (!movieKey || !movieData[movieKey] || !movieData[movieKey].redirectUrl) {
        // Movie not available
        if (progressContainer) progressContainer.style.display = 'none';
        if (resolutionContainer) resolutionContainer.style.display = 'none';
        if (movieTags) movieTags.style.display = 'none';
        
        watchBtn.disabled = true;
        watchBtn.textContent = 'Unavailable';
        redirectText.textContent = 'Video not found';
        subtitle.textContent = 'Please check the link or try another movie.';
    }
}

// Resolution selection functionality
function initializeResolutionSelection() {
    const resolutionInputs = document.querySelectorAll('input[name="resolution"]');
    const downloadBtn = document.getElementById('watchBtn');

    resolutionInputs.forEach(input => {
        input.addEventListener('change', function() {
            const selectedResolution = this.value;
            if (!downloadBtn.disabled) {
                downloadBtn.innerHTML = `<img src="/assets/download.svg" alt="">Download ${selectedResolution}p`;
            }
        });
    });
}

// Download functionality with localStorage
function handleDownload() {
    const downloadBtn = document.getElementById('watchBtn');
    const selectedResolution = document.querySelector('input[name="resolution"]:checked').value;
    
    if (downloadBtn.disabled || !finalContent.redirectUrl) return;

    // Get current state from localStorage
    let downloadState = JSON.parse(localStorage.getItem('downloadState') || '{}');
    const now = Date.now();
    
    // Reset if expired (after 1 hour) or if max clicks reached
    if (downloadState.downloadButtonClickedAt && 
        (now - downloadState.downloadButtonClickedAt > 3600000 || downloadState.clickCount >= 3)) {
        downloadState = {};
        localStorage.removeItem('downloadState');
    }

    // Initialize click count
    if (!downloadState.clickCount) {
        downloadState.clickCount = 0;
    }

    // If not clicked before or reset, start countdown
    if (!downloadState.downloadBtnClicked) {
        downloadState.downloadBtnClicked = true;
        downloadState.downloadButtonClickedAt = now;
        downloadState.clickCount += 1;
        
        localStorage.setItem('downloadState', JSON.stringify(downloadState));
        
        startCountdown(15, selectedResolution);
    }
}

// Start countdown with specified duration
function startCountdown(seconds, resolution) {
    const redirectText = document.getElementById('redirectText');
    const subtitle = document.getElementById('subtitle');
    const progressContainer = document.getElementById('progressContainer');
    const progressFill = document.getElementById('progressFill');
    const downloadBtn = document.getElementById('watchBtn');
    const resolutionContainer = document.getElementById('resolutionContainer');

    // Show countdown UI
    redirectText.innerHTML = `Download ready in <span class="countdown" id="countdown">${seconds}s</span>`;
    subtitle.textContent = 'Please wait a moment...';
    progressContainer.style.display = 'block';
    downloadBtn.disabled = true;
    downloadBtn.textContent = 'Please wait...';
    resolutionContainer.style.display = 'none';

    let countdown = seconds;
    progressFill.style.width = '0%';

    const timer = setInterval(() => {
        countdown--;
        const countdownElement = document.getElementById('countdown');
        if (countdownElement) {
            countdownElement.textContent = countdown + 's';
        }
        progressFill.style.width = ((seconds - countdown) / seconds) * 100 + '%';

        if (countdown <= 0) {
            clearInterval(timer);
            // Open ad and reset UI
            window.open(finalContent.redirectUrl, '_blank');
            
            // Update localStorage
            let downloadState = JSON.parse(localStorage.getItem('downloadState') || '{}');
            downloadState.downloadBtnClicked = false;
            localStorage.setItem('downloadState', JSON.stringify(downloadState));
            
            resetDownloadUI(resolution);
        }
    }, 1000);
}

function resetDownloadUI(resolution) {
    const redirectText = document.getElementById('redirectText');
    const subtitle = document.getElementById('subtitle');
    const progressContainer = document.getElementById('progressContainer');
    const downloadBtn = document.getElementById('watchBtn');
    const resolutionContainer = document.getElementById('resolutionContainer');

    redirectText.textContent = 'Choose resolution';
    subtitle.textContent = 'Select quality and download';
    progressContainer.style.display = 'none';
    downloadBtn.disabled = false;
    downloadBtn.textContent = `Download ${resolution}p`;
    resolutionContainer.style.display = 'flex';
}

// Check download state on page load
function checkDownloadState() {
    const downloadState = JSON.parse(localStorage.getItem('downloadState') || '{}');
    const now = Date.now();

    if (downloadState.downloadBtnClicked && downloadState.downloadButtonClickedAt) {
        const timeElapsed = now - downloadState.downloadButtonClickedAt;
        const remainingTime = Math.max(0, 15 - Math.floor(timeElapsed / 1000));

        if (remainingTime > 0) {
            const selectedResolution = document.querySelector('input[name="resolution"]:checked').value;
            startCountdownFromRemaining(remainingTime, selectedResolution);
        }
    }
}

// Start countdown from remaining time (for page refresh scenarios)
function startCountdownFromRemaining(remainingSeconds, resolution) {
    const redirectText = document.getElementById('redirectText');
    const subtitle = document.getElementById('subtitle');
    const progressContainer = document.getElementById('progressContainer');
    const progressFill = document.getElementById('progressFill');
    const downloadBtn = document.getElementById('watchBtn');
    const resolutionContainer = document.getElementById('resolutionContainer');

    redirectText.innerHTML = `Download ready in <span class="countdown" id="countdown">${remainingSeconds}s</span>`;
    subtitle.textContent = 'Please wait a moment...';
    progressContainer.style.display = 'block';
    downloadBtn.disabled = true;
    downloadBtn.textContent = 'Please wait...';
    resolutionContainer.style.display = 'none';

    const totalSeconds = 15;
    let countdown = remainingSeconds;
    progressFill.style.width = ((totalSeconds - countdown) / totalSeconds) * 100 + '%';

    const timer = setInterval(() => {
        countdown--;
        const countdownElement = document.getElementById('countdown');
        if (countdownElement) {
            countdownElement.textContent = countdown + 's';
        }
        progressFill.style.width = ((totalSeconds - countdown) / totalSeconds) * 100 + '%';

        if (countdown <= 0) {
            clearInterval(timer);
            window.open(finalContent.redirectUrl, '_blank');
            
            let downloadState = JSON.parse(localStorage.getItem('downloadState') || '{}');
            downloadState.downloadBtnClicked = false;
            localStorage.setItem('downloadState', JSON.stringify(downloadState));
            
            resetDownloadUI(resolution);
        }
    }, 1000);
}

// Right container expand/collapse functionality
let isExpanded = false;

function toggleExpand() {
  const rightContainer = document.getElementById('rightContainer');
  const showMoreBtn = document.getElementById('showMoreBtn');
  const textSpan = showMoreBtn.querySelector('.btn-text');
  const arrowIcon = showMoreBtn.querySelector('.arrow-icon');

  const isExpanded = rightContainer.classList.contains('expanded');

  // Update teks
  textSpan.textContent = isExpanded ? 'Show more' : 'Show less';

  arrowIcon.alt = isExpanded ? 'expand' : 'collapse';

  // Toggle class
  rightContainer.classList.toggle('expanded');
  showMoreBtn.classList.toggle('expanded');

  console.log('Button clicked');
  console.log('isExpanded?', isExpanded);
  console.log('arrowIcon', arrowIcon);
}

function populateOtherMovies() {
    const gridContainer = document.querySelector('.movie-grid');
    if (!gridContainer) return;

    gridContainer.innerHTML = ''; // Kosongkan kontainer terlebih dahulu

    for (const [key, movie] of Object.entries(movieData)) {
        // Lewati film jika key-nya sama dengan film yang sedang aktif
        if (key === movieKey) {
            continue;
        }

        // Buat elemen movie-card
        const movieCard = document.createElement('div');
        movieCard.className = 'movie-card';
        movieCard.setAttribute('onclick', `navigateToMovie('${key}')`);

        movieCard.innerHTML = `
            <img src="${movie.image}" alt="${movie.title}" class="movie-thumb">
            <div class="movie-name">${movie.title}</div>
        `;

        gridContainer.appendChild(movieCard);
    }
}

function initializeHeaderInteractions() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileSearchBtn = document.getElementById('mobile-search-btn');
    const searchContainer = document.querySelector('.search-container');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
        });
    }

    if (mobileSearchBtn && searchContainer) {
        mobileSearchBtn.addEventListener('click', () => {
            searchContainer.classList.toggle('active');
            // Optional: auto-focus on search input when shown
            if (searchContainer.classList.contains('active')) {
                document.getElementById('searchInput').focus();
            }
        });
    }
}

// Navigation functionality
function navigateToMovie(movieKey) {
    if (movieKey && movieData[movieKey]) {
        window.location.href = `?movie=${movieKey}`;
    } else {
        console.warn('Movie not found:', movieKey);
    }
}

// Manual redirect function (for legacy compatibility)
function manualRedirect() {
    const manualUrl = finalContent.redirectUrl2 || finalContent.redirectUrl;
    if (manualUrl) {
        window.location.href = manualUrl;
    }
}

// Search functionality (basic implementation)
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const searchTerm = this.value.toLowerCase().trim();
                // Simple search through movie titles
                for (const [key, movie] of Object.entries(movieData)) {
                    if (movie.title.toLowerCase().includes(searchTerm)) {
                        navigateToMovie(key);
                        return;
                    }
                }
                alert('Movie not found. Try searching for: Fantastic Four, Guardians, Atlas, Pacific Rim, or Spider-Man');
            }
        });
    }
}

// Prefetch functionality for performance
function prefetchContent() {
    if (finalContent.redirectUrl) {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = finalContent.redirectUrl;
        document.head.appendChild(link);
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    initializeSearch();
    prefetchContent();
});

// Expose functions to global scope for onclick handlers
window.handleDownload = handleDownload;
window.toggleExpand = toggleExpand;
window.navigateToMovie = navigateToMovie;
window.manualRedirect = manualRedirect;