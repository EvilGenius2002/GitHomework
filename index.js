const maxtime = 1000; //Просто изменить скорость таймера, должно быть больше 100
let timeLeft = maxtime;
let timer;
let curImgIndex; //Изображение выбранное в данный момент
let images = []; //Текущая страница изображений
let loadingImgs = 5;

// Таймер и взаимодействие с ним
function timerUpdate() {
  timeLeft -= 1;
  if (timeLeft <= 0) {
    timeLeft = maxtime;
    curImgIndex += 1;
    selectImage(curImgIndex);
  }
  document.querySelector(".actualBar").style.width =
    timeLeft / Math.floor(maxtime / 100) + "%";
  timer = setTimeout(timerUpdate, 10);
}

function timerToggle(event) {
  if (event.target.textContent === "STOP") {
    event.target.textContent = "START";
    timerStop();
  } else if (event.target.textContent === "START") {
    event.target.textContent = "STOP";
    timerUpdate();
  }
}

function timerStop() {
  clearTimeout(timer);
  timeLeft = maxtime;
  document.querySelector(".actualBar").style.width =
    timeLeft / Math.floor(maxtime / 100) + "%";
}

// Изображения
function getImages() {
  timerStop();
  fetch(
    "https://picsum.photos/v2/list?page=" +
      Math.floor(Math.random() * (800 / 4)) +
      "&limit=" +
      4
  )
    .then((responce) => {
      return responce.json();
    })
    .then((page) => {
      images = page;
      displayImages();
    });
}

function displayImages() {
  loadingImgs = 5;
  let imgSlots = document.querySelectorAll(".flex img");
  images.forEach((img, i) => {
    imgSlots[i].src = img.download_url;
    imgSlots[i].classList.add("loading");
  });
  selectImage(0);
}

function selectImage(ind) {
  curImgIndex = ind;
  if (curImgIndex === 4) {
    getImages();
  }
  document.querySelector(".largeView img").src = images[ind].download_url;
  document.querySelector(".largeView img").classList.add("loading");
  document.getElementById("authorName").textContent = images[ind].author;
  document.querySelectorAll(".flex img").forEach((img, i) => {
    if (i === ind) {
      img.classList.add("selected");
    } else {
      img.classList.remove("selected");
    }
  });
}

function removeLoading(event) {
  console.log("loading", loadingImgs);
  loadingImgs -= 1;
  if (
    loadingImgs === 0 &&
    document.getElementById("toggleButton").textContent === "STOP"
  ) {
    timerUpdate();
  }
  event.target.classList.remove("loading");
}

function imgClick(event) {
  if (event.target.tagName === "IMG") {
    timerStop();
    document.getElementById("toggleButton").textContent = "START";
    selectImage(Number(event.target.id));
  }
}

function init() {
  document.getElementById("rldButton").addEventListener("click", getImages);
  document
    .getElementById("toggleButton")
    .addEventListener("click", timerToggle);
  document.getElementById("previewBar").addEventListener("click", imgClick);
  document.querySelectorAll("img").forEach((item) => {
    item.onload = removeLoading;
  });
  getImages();
}

window.addEventListener("DOMContentLoaded", init);
