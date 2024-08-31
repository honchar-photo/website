document.addEventListener('DOMContentLoaded', function () {
    fetch('../assets/images.txt')
        .then(response => response.text())
        .then(text => {
            const data = { images: text.split(', ') };
            const seed = 1336 ^ 0x4EAD1EEF;

            // Randomize the order of the images using seed, so that the order is consistent across page loads
            // to do this, we use splitmix32 PRNG

            function sfc32(a, b, c, d) {
                return function() {
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

            data.images.forEach(url => {
                // convert link like 'https://drive.google.com/file/d/1Q2w3e4r5t6y7u8i9o0p/view?usp=sharing'
                // to 'https://lh3.googleusercontent.com/d/1Q2w3e4r5t6y7u8i9o0p'
                url = url.replace('https://drive.google.com/file/d/', 'https://lh3.googleusercontent.com/d/').split('/view')[0];

                const li = document.createElement('li');
                const img = document.createElement('img');
                img.src = url;
                img.alt = 'Gallery Image';
                img.onload = function () {
                    li.style.backgroundImage = `url(${url})`;
                    li.appendChild(img);
                };
                gallery.appendChild(li);
            });
            document.querySelector('.gallery-container').appendChild(gallery);
        })
        .catch(error => console.error('Error loading the images:', error));
});
