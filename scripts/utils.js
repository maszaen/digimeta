// const params = new URLSearchParams(window.location.search);
// const movieKey = params.get('movie');
// const fallback = {
//     title: 'Unknown Movie',
//     description: 'Movie not found or invalid link. Please try again.',
//     image: '/assets/default.jpg',
//     redirectUrl: 'https://www.profitableratecpm.com/mucgga0tpq?key=3f058edeedd092210797305094c5afa4'
// };

// const content = movieData[movieKey] || fallback;

// // Set dynamic content
// document.getElementById('contentTitle').textContent = content.title;
// document.getElementById('contentDesc').innerHTML = content.description.replace('{count}', '<span class="countdown" id="countdown">10</span>');
// document.getElementById('thumbnail').style.backgroundImage = `url('${content.image}')`;

// // Countdown logic
// let countdown = 5;
// const countdownElements = document.querySelectorAll('.countdown');
// const progressFill = document.getElementById('progressFill');
// const targetUrl = content.redirectUrl;
// progressFill.style.width = '0%';
// const timer = setInterval(() => {
//     countdown--;
//     countdownElements.forEach(el => el.textContent = countdown);
//     progressFill.style.width = ((5 - countdown) / 5) * 100 + '%';
//     if (countdown <= 0) {
//         clearInterval(timer);
//         setTimeout(() => window.location.href = targetUrl, 200);
//     }
// }, 1000);

// function redirectNow() {
//     clearInterval(timer);
//     window.location.href = targetUrl;
// }

// // Prefetch
// const link = document.createElement('link');
// link.rel = 'prefetch';
// link.href = targetUrl;
// document.head.appendChild(link);





// scripts/utils.js



const params = new URLSearchParams(window.location.search);
const movieKey = params.get('movie');
const fallback = {
    title: 'Unknown Movie',
    description: 'Movie not found or invalid link. Please try again.',
    image: '/assets/default.jpg',
    redirectUrl: 'https://www.profitableratecpm.com/mucgga0tpq?key=3f058edeedd092210797305094c5afa4'
};

const content = movieData[movieKey] || fallback;

// Set dynamic content
document.getElementById('contentTitle').textContent = content.title;
document.getElementById('contentDesc').innerHTML = content.description.replace('{count}', '<span class="countdown" id="countdown">10</span>');
document.getElementById('thumbnail').style.backgroundImage = `url('${content.image}')`;

// Countdown logic (DISABLED REDIRECT)
let countdown = 5;
const countdownElements = document.querySelectorAll('.countdown');
const progressFill = document.getElementById('progressFill');
const targetUrl = content.redirectUrl;
progressFill.style.width = '0%';

// Timer masih jalan tapi redirect dimatiin
const timer = setInterval(() => {
    countdown--;
    countdownElements.forEach(el => el.textContent = countdown);
    progressFill.style.width = ((5 - countdown) / 5) * 100 + '%';
    if (countdown <= 0) {
        clearInterval(timer);
        // REDIRECT OTOMATIS DINONAKTIFKAN
        console.log('Countdown selesai, tapi redirect dimatiin');
        // setTimeout(() => window.location.href = targetUrl, 200); // COMMENTED OUT
    }
}, 1000);

// Fungsi redirect manual (opsional - hanya jika user klik)
function redirectNow() {
    clearInterval(timer);
    // window.location.href = targetUrl; // COMMENTED OUT
    console.log('Manual redirect dimatiin juga');
}

// Prefetch juga dimatiin (opsional)
// const link = document.createElement('link');
// link.rel = 'prefetch';
// link.href = targetUrl;
// document.head.appendChild(link);