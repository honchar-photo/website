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
            document.querySelector('.gallery-container').appendChild(gallery);
            let currentIndex = 0; // to keep track of the current image index
    
            data.images.forEach((url, index) => {
                url = url.replace('https://drive.google.com/file/d/', 'https://lh3.googleusercontent.com/d/').split('/view')[0];
                
                const li = document.createElement('li');
                const img = document.createElement('img');
                img.src = url;
                img.alt = `Gallery Image ${index}`;
                img.onload = function () {
                    li.style.backgroundImage = `url(${url})`;
                    li.appendChild(img);
                };
                li.onclick = function() {
                    currentIndex = index; // update current index when image is clicked
                    updateModalImage(currentIndex);
                    document.getElementById('myModal').style.display = "block";
                };
                gallery.appendChild(li);
            });
    
            function updateModalImage(index) {
                const url = data.images[index].replace('https://drive.google.com/file/d/', 'https://lh3.googleusercontent.com/d/').split('/view')[0];
                document.getElementById('img01').src = url;
                document.getElementById('caption').innerHTML = `Gallery Image ${index}`;
            }
    
            // Navigation Buttons
            document.querySelector('.prev').onclick = function() {
                currentIndex = (currentIndex > 0) ? currentIndex - 1 : data.images.length - 1;
                updateModalImage(currentIndex);
            };
    
            document.querySelector('.next').onclick = function() {
                currentIndex = (currentIndex + 1) % data.images.length;
                updateModalImage(currentIndex);
            };
    
            // Close Modal
            document.querySelector('.close').onclick = function() {
                document.getElementById('myModal').style.display = "none";
            };
        })
        .catch(error => console.error('Error loading the images:', error));
    });