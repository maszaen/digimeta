// scripts/utils.js
const params = new URLSearchParams(window.location.search);
const movieKey = params.get('movie');
const fallback = {
    title: 'Unknown Movie',
    description: 'Movie not found or invalid link. Please try again.',
    image: '/assets/default.jpg',
    redirectUrl: 'https://dwightcherrykings.com/sa275vh7?key=ad56867b7c2622a482d3367dcd098b66'
};

const content = movieData[movieKey] || fallback;

// Set dynamic content
document.getElementById('contentTitle').textContent = content.title;
document.getElementById('contentDesc').textContent = content.description;
document.getElementById('thumbnail').style.backgroundImage = `url('${content.image}')`;

// Countdown logic
let countdown = 5;
const countdownElements = document.querySelectorAll('.countdown');
const progressFill = document.getElementById('progressFill');
const watchBtn = document.getElementById('watchBtn');
const targetUrl = content.redirectUrl;
const manualUrl = content.redirectUrl2 || content.redirectUrl;

progressFill.style.width = '0%';

const timer = setInterval(() => {
    countdown--;
    countdownElements.forEach(el => el.textContent = countdown);
    progressFill.style.width = ((5 - countdown) / 5) * 100 + '%';
    
    if (countdown <= 0) {
        clearInterval(timer);
        const progressContainer = document.querySelector('.progress-container');
          if (progressContainer) {
              progressContainer.style.display = 'none';
          }
        watchBtn.disabled = false;
        watchBtn.textContent = 'Watch Movie';
        document.querySelector('.redirect-text').textContent = 'Ready to watch!';
        document.querySelector('.subtitle').textContent = 'Click the button below to start watching';
    }
}, 1000);

function watchMovie() {
    if (!watchBtn.disabled) {
        clearInterval(timer);
        window.location.href = targetUrl;
    }
}

function manualRedirect() {
    clearInterval(timer);
    window.location.href = manualUrl;
}

// Prefetch
const link = document.createElement('link');
link.rel = 'prefetch';
link.href = targetUrl;
document.head.appendChild(link);