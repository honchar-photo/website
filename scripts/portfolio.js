document.addEventListener('DOMContentLoaded', function () {
    const container = document.querySelector('.gallery-container');
    if (!container) return;

    fetch('assets/images.txt')
        .then(response => response.text())
        .then(text => {
            if (!text) return;
            const data = { images: text.split(', ').filter(u => u && u.trim()) };

            // Randomize with seed for consistency
            const seed = 1336 ^ 0x4EAD1EEF;
            function sfc32(a, b, c, d) {
                return function () {
                    a |= 0; b |= 0; c |= 0; d |= 0;
                    let t = (a + b | 0) + d | 0;
                    d = d + 1 | 0;
                    a = b ^ b >>> 9;
                    b = c + (c << 3) | 0;
                    c = (c << 21 | c >>> 11);
                    c = c + t | 0;
                    return (t >>> 0) / 4294967296;
                }
            }
            var rand = sfc32(0x9E3779B9, 0x243F6A88, 0xB7E15162, seed);

            for (let i = data.images.length - 1; i > 0; i--) {
                const j = Math.floor(rand() * (i + 1));
                [data.images[i], data.images[j]] = [data.images[j], data.images[i]];
            }

            const gallery = document.createElement('ul');
            gallery.className = 'mosaic-gallery';
            container.appendChild(gallery);
            let currentIndex = 0;

            data.images.forEach((originalUrl, index) => {
                const url = originalUrl.trim()
                    .replace('https://drive.google.com/file/d/', 'https://lh3.googleusercontent.com/d/')
                    .split('/view')[0].split('?')[0];

                const li = document.createElement('li');
                const img = document.createElement('img');

                img.src = url;
                img.alt = `Gallery Image ${index + 1}`;

                li.appendChild(img);

                li.onclick = function () {
                    currentIndex = index;
                    updateModalImage(currentIndex);
                    const modal = document.getElementById('myModal');
                    if (modal) {
                        modal.style.display = "block";
                        document.body.style.overflow = 'hidden';
                    }
                };

                gallery.appendChild(li);
            });

            function updateModalImage(index) {
                const modalImg = document.getElementById('img01');
                const caption = document.getElementById('caption');
                if (modalImg) {
                    const url = data.images[index].trim()
                        .replace('https://drive.google.com/file/d/', 'https://lh3.googleusercontent.com/d/')
                        .split('/view')[0].split('?')[0];
                    modalImg.src = url;
                }
                if (caption) {
                    caption.innerHTML = `Image ${index + 1} of ${data.images.length}`;
                }
            }

            // Navigation
            const prev = document.querySelector('.prev');
            const next = document.querySelector('.next');
            const close = document.querySelector('.close');
            const modal = document.getElementById('myModal');

            if (prev) prev.onclick = (e) => { e.stopPropagation(); currentIndex = (currentIndex > 0) ? currentIndex - 1 : data.images.length - 1; updateModalImage(currentIndex); };
            if (next) next.onclick = (e) => { e.stopPropagation(); currentIndex = (currentIndex + 1) % data.images.length; updateModalImage(currentIndex); };
            if (close) close.onclick = () => { if (modal) { modal.style.display = "none"; document.body.style.overflow = 'auto'; } };
            if (modal) modal.onclick = (e) => { if (e.target === modal) close.onclick(); };

            // Keyboard
            document.addEventListener('keydown', (e) => {
                if (modal && modal.style.display === "block") {
                    if (e.key === 'ArrowLeft') prev.click();
                    else if (e.key === 'ArrowRight') next.click();
                    else if (e.key === 'Escape') close.click();
                }
            });
        })
        .catch(error => console.error('Error loading gallery:', error));
});