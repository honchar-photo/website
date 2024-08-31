document.addEventListener('DOMContentLoaded', function () {
    fetch('/assets/images.json')
        .then(response => response.json())
        .then(data => {
            const gallery = document.createElement('ul');
            gallery.className = 'mosaic-gallery';
            
            data.images.forEach(url => {
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
