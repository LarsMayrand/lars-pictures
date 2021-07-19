
// swiping logic, 

// Time in miliseconds till text is hidden
const WAIT_TIME = 2000;

// Variables for swipping logic 
// Adapted from Ana Tudor: https://css-tricks.com/simple-swipe-with-vanilla-javascript/
// Definitely rename / change
let i = 0, x0 = null, y0 = null, mousedown = false, swiping = false, scrolling = false, w;


// DOM elements 
const container = document.querySelector('.container');
const title = document.getElementById('title');
const metadata = document.getElementById('metadata');
const page = document.getElementById('page');
const gridView = document.getElementById('grid-view');

// Cursor variables 
let mouseTimer = null, cursorVisible = true;

// Container for swipe view? 
let N = container.children.length;
container.style.setProperty('--n', N);

// const photosDirectory = '1080_wide';
// const photos = fs.readdirSync(photosDirectory);


const photos = [ 'IMG_0237-Edit-2-Edit-3.jpg',
  'IMG_0689.jpg',
  'IMG_0773.jpg',
  'IMG_0828.jpg',
  'IMG_0838.jpg',
  'IMG_1900.jpg',
  'IMG_2231-Edit-Edit.jpg',
  'IMG_2450-Edit.jpg',
  'IMG_2552-Edit.jpg',
  'IMG_2600-Edit-2.jpg',
  'IMG_2726.jpg',
  'IMG_3043-Edit-2-Edit.jpg',
  'IMG_3136-Edit-Edit.jpg',
  'IMG_3158-Edit-2.jpg',
  'IMG_3310-Edit.jpg',
  'IMG_3376-Edit.jpg',
  'IMG_3591-Edit-Edit.jpg',
  'IMG_3610-Edit-2-Edit-2.jpg',
  'IMG_3610-Edit-2.jpg',
  'IMG_3668.jpg',
  'IMG_3682-Edit-3.jpg',
  'IMG_3802-Edit-2-Edit.jpg',
  'IMG_3826-Edit-Edit-2.jpg',
  'IMG_4339.jpg',
  'IMG_4513-Edit.jpg',
  'IMG_4676-Edit.jpg',
  'IMG_4688-Edit.jpg',
  'IMG_4959-Edit.jpg',
  'edited.jpg',
  'that_tree.jpg',
  'yellow.jpg',
  'zombie_tree.jpg',
];


photos.forEach(name => {
    gridView.innerHTML += `<img src="1080_wide/${name}" class="image"></img>`;
})

mouseMoved();
showText();


// emxample

// EXIF.getData(img, function() {
//     var make = EXIF.getTag(this, "Make");
//     var model = EXIF.getTag(this, "Model");
//     const 
//     var makeAndModel = document.getElementById("makeAndModel");
//     makeAndModel.innerHTML = `${make} ${model}`;
// });


// title.innerHTML = formatTitle(photos[i]);
// metadata.innerHTML = formatMetadata(photos[i]);


function formatInfo() {

    
}

function formatTitle(photo) {
    return photo.useTitle ? photo.title : photo.file;
}

function formatMetadata(photo) {
    const date = new Date(photo.date);
    
    let time;
    const minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();

    if (date.getHours() == 0) {
        time = '12:' + minutes + ' AM';
    } else if (date.getHours() > 12) {
        time = `${date.getHours() - 12}: minutes PM`;
    } else {
        time = `${date.getHours()}: minutes AM`;
    }

    return MONTHS[date.getMonth()] + " " + date.getDate() + " " + date.getFullYear() 
        + ", " + time + "<br>" + photo.shutterSpeed
        + " sec at f/" + photo.aperture + " ISO " + photo.iso;
}


// animations and dom stuff

function update(animate) {
    // if (cursorVisible) {
    //     mouseMoved();
    // }

    // container.classList.toggle("smooth", animate);    
    container.style.setProperty('--i', i);
    container.scrollIntoView();

    title.innerHTML = formatTitle(photos[i]);
    metadata.innerHTML = formatMetadata(photos[i]);
}

function hideText() {
    mouseTimer = null;
    page.classList.add('hidden');
    setTimeout(function(){
        document.body.style.cursor = 'none';
        cursorVisible = false;
    }, 1800);
}

function showText() {
    // showText();
    if (mouseTimer) {
        window.clearTimeout(mouseTimer);
    }
    // if (!cursorVisible) {
    //     showText();
    // }
    mouseTimer = window.setTimeout(hideText, WAIT_TIME);
    
    page.classList.remove('hidden');
    document.body.style.cursor = 'default';
    cursorVisible = true;
}

// handling Internet Explorer stupidity with window.event
// @see http://stackoverflow.com/a/3985882/517705    
function checkKeycode(event) {
    window.clearTimeout(mouseTimer);
    // if (cursorVisible) {
    //     mouseMoved();
    // }
    var keyDownEvent = event || window.event,
        keycode = (keyDownEvent.which) ? keyDownEvent.which : keyDownEvent.keyCode;
    if (keycode == 37) { // left arrow
        previous();
    } else if (keycode == 39) { // right arrow
        next();
    }
}

function previous() {
    i = i == 0 ? photos.length - 1 : i - 1;
    update(true);      
}

function next() {
    i = i == photos.length - 1 ? 0 : i + 1;
    update(true);
}

function photo(index) {
    i = index;
    update(false);
}

window.setTimeout(hideBanner, WAIT_TIME);

function hideBanner() {
    document.getElementById('banner').classList.add('hidden');
}

function unify(e) { 
    // console.log("unify");
    return e.changedTouches ? e.changedTouches[0] : e;
}

function move(e) {
    // console.log("why isn't it lockeding?? " + locked);
    if (swiping) {
        let dx = unify(e).clientX - x0, 
            // dy = unify(e).clientY - y0,
            s = Math.sign(dx),
            f = +(s*dx/w).toFixed(2);
        if ((i > 0 || s < 0) && (i < N - 1 || s > 0) && f > .07) {
            container.style.setProperty('--i', i -= s);
            f = 1 - f;
            update(false);
        }
        container.style.setProperty("--tx", "0px");
        container.style.setProperty("--f", f);
        // container.classList.toggle("smooth");
        // console.log("am i not togglin'????");
        swiping = false;
        mousedown = false;
        x0 = null;
        // y0 = null;
    } else if (scrolling) {
        scrolling = false;
        container.addEventListener('mousemove', mouseMoved, false);
        container.addEventListener('touchmove', mouseMoved, false);
    } else {
        mousedown = false;
        x0 = null;
        y0 = null;
    }
}

function mouseMoved(e){
    console.log('in mouse moved ' + e);
    if (!mousedown) {
        showText();
        if (mouseTimer) {
            window.clearTimeout(mouseTimer);
        }
        if (!cursorVisible) {
            showText();
        }
        mouseTimer = window.setTimeout(hideText, WAIT_TIME);
    } else if (swiping) {
        e.preventDefault();
        container.style.setProperty('--tx', `${Math.round(unify(e).clientX - x0)}px`);
    } else if (scrolling) {
        return;
    } else {
        let dx = Math.abs(unify(e).clientX - x0),
            dy = Math.abs(unify(e).clientY - y0);
        if (dx == dy && dx == 0) {
            showText();    
        } else if (dx > dy) {
            swiping = true;
            
        } else {
            scrolling = true;
            // container.removeEventListener("mousemove", mouseMoved, false);
            // container.removeEventListener("touchmove", mouseMoved, false);
        }
    } 
}

function mousePressed(e) {
    mousedown = true;
    x0 = unify(e).clientX;
    y0 = unify(e).clientY;
    // console.log("x0 = " + x0);
    // console.log("woaowaowa d??????");
}

function isMobile() {
    return window.innerWidth <= 800 && window.innerHeight <= 600;
}

// var mousedown;

document.onkeydown = checkKeycode;

container.addEventListener('mousedown', mousePressed, false);
container.addEventListener('touchstart', mousePressed, false);

container.addEventListener('mousemove', mouseMoved, false);
container.addEventListener('touchmove', mouseMoved, false);

// container.addEventListener("mousemove", drag, false);
// container.addEventListener("touchmove", drag, false);

container.addEventListener('mouseup', move, false);
container.addEventListener('touchend', move, false);

window.onresize = function(){ 
    w = window.innerWidth;
    mobile = isMobile(); 
}


