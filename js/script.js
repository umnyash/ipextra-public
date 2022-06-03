const page = document.querySelector(".page__body");
const modals = page.querySelectorAll(".modal");
const infoModal = page.querySelector(".modal--info");
const linksModal = page.querySelector(".modal--cards");
const linkToAllDns = page.querySelector(".addresses__link");
const dnsLinks = page.querySelectorAll(".card");
let pageShift;
let history = [];

if (linkToAllDns) {
  linkToAllDns.addEventListener("click", (evt) => {
    evt.preventDefault();

    openModal(linksModal);
  });
}

for (let dnsLink of dnsLinks) {
  dnsLink.addEventListener("click", (evt) => {
    evt.preventDefault();

    openModal(infoModal);
  });
}

for (let modal of modals) {
  const modalWindow = modal.querySelector(".modal__window");
  const modalCloseButton = modal.querySelector(".modal__close");

  modal.addEventListener("scroll", () => {
    changeModalHeaderStyle(modalWindow);

    appHeight();
  });

  modalCloseButton.addEventListener("click", () => {
    closeModal(modal);
  });
}

function openModal(modal) {
  modal.classList.remove("modal--closed");
  history.push(modal);

  if (history.length === 1) {
    disablePageScrolling();
    window.addEventListener("keydown", closeModalWithEsc);
  }

  appHeight();

  modal.style.setProperty("--modal-header-height", `${modal.querySelector(".modal__header").offsetHeight}px`);
}

function closeModal(modal) {
  modal.classList.add("modal--closed");
  history.pop();

  if (!history.length) {
    enablePageScrolling();
    window.removeEventListener("keydown", closeModalWithEsc);
  }
}

function closeModalWithEsc(evt) {
  if (evt.key === "Esc" || evt.key === "Escape") {
    closeModal(history[history.length - 1]);
  }
}

function disablePageScrolling() {
  pageShift = window.pageYOffset;
  page.style.top = `${-pageShift}px`;
  page.classList.add("page__body--no-scroll");
}

function enablePageScrolling() {
  page.classList.remove("page__body--no-scroll");
  page.style.top = 0;
  window.scrollTo(0, pageShift);
}

function changeModalHeaderStyle(modalWindow) {
  const modalHeader = modalWindow.querySelector(".modal__header");
  const modalShift = -29;

  if (modalWindow.getBoundingClientRect().top <= modalShift) {
    modalHeader.classList.add("modal__header--sticky");
  } else if (modalWindow.getBoundingClientRect().top > modalShift) {
    modalHeader.classList.remove("modal__header--sticky");
  }
}

function appHeight() {
  for (let modal of modals) {
    modal.style.setProperty("--app-height", `${window.innerHeight}px`);
  }
}

window.addEventListener("resize", appHeight);

appHeight();

const torrentSection = page.querySelector(".torrent");

if (torrentSection) {
  activateTorrentSection();
}

function activateTorrentSection() {
  const torrentButtonActivate = torrentSection.querySelector(".torrent__button--activate");
  const torrentContent = torrentSection.querySelector(".torrent__content-wrapper");

  const torrentRefreshButton = torrentSection.querySelector(".torrent__button--refresh");
  const torrentCardViewToggler = torrentSection.querySelector(".torrent__button--view-toggler");

  torrentButtonActivate.addEventListener("click", () => {
    activateTorrentDetection(0);
    showContentBlock();
  });

  torrentRefreshButton.addEventListener("click", () => {
    activateTorrentDetection(1);
  });

  torrentCardViewToggler.addEventListener("click", () => {
    const torrentCards = torrentSection.querySelectorAll(".torrent-card");

    for (let torrentCard of torrentCards) {
      torrentCard.classList.toggle("torrent-card--open");
    }
  });

  function activateTorrentDetection(data) {
    if (data) {
      torrentSection.querySelector(".torrent__content--no-data").classList.add("hidden");
      torrentSection.querySelector(".torrent__content--data").classList.remove("hidden");

      torrentCardViewToggler.disabled = false;
    }
  }

  function showContentBlock() {
    torrentContent.classList.remove("hidden");
    torrentButtonActivate.classList.add("hidden");
  }
}

function initMap() {
  let userIpLocationDiv = document.querySelector(".user-info__ip-location");

  if (userIpLocationDiv) {
    let userIpMap = new google.maps.Map(userIpLocationDiv,
      {
        center: {lat: 47.81024872679566, lng: 13.055978604242434},
        zoom: 14,
      });
  }

  let anyIpLocationDiv = document.querySelector(".main__ip-location");

  if (anyIpLocationDiv) {
    let userGeoMap = new google.maps.Map(anyIpLocationDiv,
      {
        center: {lat: 47.81024872679566, lng: 13.055978604242434},
        zoom: 14,
      });
  }

  let anyIpLocationModalDiv = document.querySelector(".modal__ip-location");

  if (anyIpLocationModalDiv) {
    let userGeoMap = new google.maps.Map(anyIpLocationModalDiv,
      {
        center: {lat: 47.81024872679566, lng: 13.055978604242434},
        zoom: 14,
      });
  }
}

const geolocationSection = page.querySelector(".geolocation");

if (geolocationSection) {
  activateGeolocationSection();
}

function activateGeolocationSection() {
  const geolocationButtonActivate = geolocationSection.querySelector(".geolocation__button--activate");
  const geolocationComment = geolocationSection.querySelector(".geolocation__comment");

  let userGeoOptions = {
    enableHighAccuracy: true,
    timeout: 20000,
    maximumAge: 0
  };

  geolocationButtonActivate.addEventListener("click", (evt) => {
    evt.preventDefault();

    navigator.geolocation.getCurrentPosition(userGeoSuccess, userGeoError, userGeoOptions);
  });

  function userGeoSuccess(pos) {
    removeGeoIntro();

    let crd = pos.coords;
    let userGeoLocationDiv = document.querySelector(".geolocation__map");

    geolocationSection.querySelector(".geolocation__content--permission").classList.remove("hidden");

    let userGeoMap = new google.maps.Map(userGeoLocationDiv,
      {
        center: {lat: crd.latitude, lng: crd.longitude},
        zoom: 17,
      });
  };

  function userGeoError(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);

    removeGeoIntro();
    geolocationSection.querySelector(".geolocation__content--no-permission").classList.remove("hidden");
  };

  function removeGeoIntro() {
    geolocationButtonActivate.classList.add("hidden");
    geolocationComment.classList.add("hidden");
  }
}

const preloader = document.querySelector(".preloader");

window.onload = function () {
  preloader.classList.add("preloader--loaded-hiding");
  window.setTimeout(function () {
    preloader.classList.add("preloader--loaded");
    preloader.classList.remove("preloader--loaded_hiding");
  }, 500);
}
