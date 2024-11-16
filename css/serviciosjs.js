// Seleccionar todos los elementos de imagen clickeables
const images = document.querySelectorAll('.clickable');
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImg');
const captionText = document.getElementById('caption');
const close = document.querySelector('.close');

// Abrir el modal al hacer clic en una imagen
images.forEach(image => {
    image.addEventListener('click', () => {
        modal.style.display = 'block';
        modalImg.src = image.src;
        captionText.innerText = image.alt;
    });
});

// Cerrar el modal al hacer clic en la "X"
close.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Cerrar el modal al hacer clic fuera de la imagen
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Lista de imágenes por galerías
const galleries = [
    ["img/malibu/malibu0.jpg", "img/malibu/malibu1.jpg", "img/malibu/malibu2.jpg", "img/malibu/malibu3.jpg", "img/malibu/malibu4.jpg", "img/malibu/malibu5.jpg", "img/malibu/malibu6.jpg"],
    ["img/camaro/camaro0.jpg", "img/camaro/camaro1.jpg", "img/camaro/camaro2.jpg", "img/camaro/camaro3.jpg", "img/camaro/camaro4.jpg", "img/camaro/camaro5.jpg", "img/camaro/camaro6.jpg", "img/camaro/camaro7.jpg", "img/camaro/camaro8.jpg", "img/camaro/camaro9.jpg", "img/camaro/camaro10.jpg", "img/camaro/camaro11.jpg"],
    ["img/chevelle/chevelle1.jpg", "img/chevelle/chevelle2.jpg", "img/chevelle/chevelle3.jpg", "img/chevelle/chevelle4.jpg", "img/chevelle/chevelle0.jpg", "img/chevelle/chevelle5.jpg", "img/chevelle/chevelle6.jpg", "img/chevelle/chevelle7.jpg", "img/chevelle/chevelle8.jpg"],
];

let currentGallery = [];
let currentIndex = 0;

// Función para abrir una galería
function openGallery(galleryIndex) {
    currentGallery = galleries[galleryIndex];
    currentIndex = 0;
    updateModalImage();
    document.getElementById("galleryModal").style.display = "block";
}

// Actualizar la imagen en el modal
function updateModalImage() {
    const currentImage = document.getElementById("currentImage");
    currentImage.src = currentGallery[currentIndex];
}

// Navegar a la imagen anterior
document.getElementById("prevBtn").onclick = function () {
    currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
    updateModalImage();
};

// Navegar a la siguiente imagen
document.getElementById("nextBtn").onclick = function () {
    currentIndex = (currentIndex + 1) % currentGallery.length;
    updateModalImage();
};

// Cerrar el modal
function closeGallery() {
    document.getElementById("galleryModal").style.display = "none";
}

// Cerrar modal al hacer clic fuera
window.onclick = function (event) {
    const modal = document.getElementById("galleryModal");
    if (event.target === modal) {
        closeGallery();
    }
};