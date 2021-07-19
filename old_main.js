/*


One js file for parsing and loading?
another for dom stuff 

todo
    - get the ORIGINALS into new lightroom
    - instagram
    - redo the fucking code fuck
/todo

FASTER 

photo title and metadata looks like shit 

Load metadata directly from the files. Duh. 

change format: it's difficult to see landscale photos

wait for photo to finish loading before starting fade text timer

more gestures?
zoom, tap, hold, ...

tap to show, tap to hide? 

first to last photo buggy

add readme

ADD ABOUT PAGE

add photos? 

shop, fullscreen, share...

SHARE feature

*/


// swiping logic, adapted from Ana Tudor: https://css-tricks.com/simple-swipe-with-vanilla-javascript/

// biggest photos: manor hosue, corbett house, portlandia IV, marssh, enchanted

// Time in milliseconds till text is hidden
const WAIT_TIME = 2000;

var mouseTimer = null, cursorVisible = true;

var photos;

// uhh fucking label these wtf 
let i = 0, x0 = null, y0 = null, mousedown = false, swiping = false, scrolling = false, w;

var container = document.querySelector(".container"),
    title = document.getElementById("title")
    metadata = document.getElementById("metadata"),
    page = document.getElementById("page");

// loadData();

// loadPhotos();
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

var N = container.children.length;
container.style.setProperty("--n", N);

// function size() { w = window.innerWidth };
// size();

// addEventListener("resize", size, false);

// loading photos and formatting photo data

// function loadData() {
//     var xmlhttp = new XMLHttpRequest();
//     xmlhttp.onreadystatechange = function() {
//         if (this.readyState == 4 && this.status == 200) {
//             photos = JSON.parse(xmlhttp.responseText); 
//         }
//     };
//     xmlhttp.open("GET", "photo_metadata.txt", false); // synchronous, this should be fine
//     xmlhttp.send();
// }

// function loadPhotos() {
//     // populate grid view
//     const viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
//     const columns = viewportWidth < 480 ? 1 : 2; // display 1 columns to mobile users, 2 to desktop users
//     // var columns = 2;
//     for (let i = 0; i < columns; i++) {
//         let column = document.getElementById("column_" + i);
//         for (var j = i; j < photos.length; j += columns) {
//             column.innerHTML += "<img src=photos/1080_wide/" + photos[j].file + " class='preview-image' onclick='photo(" + j + ")'>";
//         }    
//     }    

//     // populate swipe view
//     for (let i = 0; i < photos.length; i++) {
//         container.innerHTML += "<div class='frame'><img src=photos/small/" + photos[i].file + " class='image'></div>";
//     }   
// }



// go through folder and add photos to array 

// var photos = loadPhotos;

// function loadPhotos() { 

//     const folder = "1080_wide/";
    
//     var photos = [];


    // document.querySelector('#photos').append(`<img src= ${folder} ${val}>`);


//     $.ajax({
//         url : folder,
//         success: function (data) {
//             $(data).find("a").attr("href", function (i, val) {
//                 if( val.match(/\.(jpe?g|png|gif)$/) ) { 
//                     photos.add(val);
//                     $("photos").append( "<img src='"+ folder + val +"'>" );
//                     console.log("ishera?");
//                 } 
//             });
//         }
//     });

//     replace with 

//     fetch('/api.json')
//   .then(response => response.text())
//   .then(body => console.log(body))

//     return photos;
// }


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

// function lock(e) {
//     console.log("locking");
//     x0 = unify(e).clientX;
//     container.classList.toggle('smooth', !(mousedown = true)); 
// }

// function swipe(e) {
//     // console.log("drag");
//     // x0 = unify(e).clientX;
//     // console.log("in swipe " + e);
    
//     // mouseMoved(); // this is going to be a problem

//     e.preventDefault();
//     if (mousedown) {
//         // console.log("dx = " + (unify(e).clientX - x0));
//         container.style.setProperty("--tx", `${Math.round(unify(e).clientX - x0)}px`);
//     }
// }

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
        console.log("am i not togglin'????");
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


