var photos,
	slideIndex = 1,
	w;

var carousel = document.getElementById("carousel"),
	page = document.getElementById("page"),
	slides = document.getElementById("slides");

loadData();
loadPhotos();
loadCarousel();
showSlides(slideIndex);
size();

addEventListener("resize", size, false);

// previous and next button areas too big
// doesn't work for vertical images
carousel.addEventListener("click", (e) => {
	if (e.target === e.currentTarget) {
		closeCarousel();
	}
});

function size() {
	w = window.innerWidth;
	// check if w size has changed?
	// the media queries should handle it right
}

function toggleMobileMenu(menu) {
	menu.classList.toggle("open");
}

// load photo metadata
function loadData() {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			photos = JSON.parse(xmlhttp.responseText);
		}
	};
	xmlhttp.open("GET", "photo_metadata.txt", false); // synchronous, this should be fine
	xmlhttp.send();
}

// populate grid view
function loadPhotos() {
	var viewportWidth = Math.max(
		document.documentElement.clientWidth,
		window.innerWidth || 0
	);
	let columns = viewportWidth < 600 ? 2 : 3;
	for (let i = 0; i < columns; i++) {
		let column = document.getElementById("column_" + i);
		for (let j = i; j < photos.length; j += columns) {
			column.innerHTML += `<img src="photos/previews/${
				photos[j].file
			}" class="preview-image" onclick="openCarousel();currentSlide(${
				j + 1
			})">`;
		}
	}
}

function loadCarousel() {
	for (let photo of photos) {
		slides.innerHTML += `<div class="slides"><img src="photos/1080-wide/${photo.file}"/></div>`;
	}
}

function openCarousel() {
	// carousel.style.display = "block";
	carousel.classList.add("open");
	document.getElementsByTagName("body")[0].classList.add("no-scroll");
}

function closeCarousel() {
	carousel.classList.remove("open");
	document.getElementsByTagName("body")[0].classList.remove("no-scroll");
	// carousel.style.display = "none";
}

function updateSlide(n) {
	showSlides((slideIndex += n));
}

function currentSlide(n) {
	showSlides((slideIndex = n));
}

function showSlides(n) {
	let slidesArray = slides.children;
	if (n > slidesArray.length) {
		slideIndex = 1;
	}
	if (n < 1) {
		slideIndex = slidesArray.length;
	}
	[...slidesArray].forEach((slide) => (slide.style.display = "none"));
	slidesArray[slideIndex - 1].style.display = "block";
}

// handling Internet Explorer issue with window.event
// @see http://stackoverflow.com/a/3985882/517705
function checkKeycode(event) {
	let keyDownEvent = event || window.event,
		keycode = keyDownEvent.which
			? keyDownEvent.which
			: keyDownEvent.keyCode;
	if (keycode == 37) {
		// left arrow
		updateSlide(-1);
	} else if (keycode == 39) {
		// right arroww
		updateSlide(1);
	} else if (keycode == 27) {
		closeCarousel();
	}
}

document.onkeydown = checkKeycode;
