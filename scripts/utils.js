const params = new URLSearchParams(window.location.search);
const movieKey = params.get('movie');
const content = movieData[movieKey];

const fallback = {
    title: 'Unknown Movie',
    description: 'Movie not found or invalid link. Please try again.',
    image: '/assets/default.jpg',
    redirectUrl: null,
};

const finalContent = content || fallback;

// Set dynamic content
document.getElementById('contentTitle').textContent = finalContent.title;
document.getElementById('contentDesc').textContent = finalContent.description;
document.getElementById('thumbnail').style.backgroundImage = `url('${finalContent.image}')`;

// Atur tombol dan teks berdasarkan validitas data
const watchBtn = document.getElementById('watchBtn');
const redirectText = document.querySelector('.redirect-text');
const subtitle = document.querySelector('.subtitle');
const progressContainer = document.querySelector('.progress-container');
const movieTags = document.getElementById('movieTags');

if (!movieKey || !movieData[movieKey] || !movieData[movieKey].redirectUrl) {
    if (progressContainer) progressContainer.style.display = 'none';
    movieTags.style.display = 'none';
    watchBtn.disabled = true;
    watchBtn.textContent = 'Unavailable';
    redirectText.textContent = 'Video unavailable or not found';
    subtitle.textContent = 'You can still try watching manually';
} else {
    const countdownElements = document.querySelectorAll('.countdown');
    const progressFill = document.getElementById('progressFill');
    const targetUrl = finalContent.redirectUrl;
    const manualUrl = finalContent.redirectUrl2 || finalContent.redirectUrl;
    const movieTagList = finalContent.tags || [];

    movieTags.innerHTML = '';
    movieTagList.forEach(tag => {
        const tagElement = document.createElement('span');
        tagElement.className = 'tag';
        tagElement.textContent = tag;
        movieTags.appendChild(tagElement);
    });

    progressFill.style.width = '0%';
    let countdown = 10;
    
    const timer = setInterval(() => {
        countdown--;
        countdownElements.forEach(el => el.textContent = countdown + ' seconds');
        progressFill.style.width = ((10 - countdown) / 10) * 100 + '%';
    
        if (countdown <= 0) {
            clearInterval(timer);
            if (progressContainer) progressContainer.remove();
            watchBtn.disabled = false;
            watchBtn.innerHTML = '<img src="assets/play.svg" alt=""> Watch Movie';
            redirectText.textContent = 'Ready to watch!';
            subtitle.textContent = 'Click the button below to start watching';
        }
    }, 1000);

    watchBtn.onclick = () => {
        if (!watchBtn.disabled) {
            clearInterval(timer);
            window.location.href = targetUrl;
        }
    };

    function manualRedirect() {
        clearInterval(timer);
        window.location.href = manualUrl;
    }

    // Prefetch link
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = targetUrl;
    document.head.appendChild(link);
}
