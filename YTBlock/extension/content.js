(function() {
  const adblocker = true;
  const removePopup = false;
  const debugMessages = true;

  let isAdFound = false;
  let adLoop = 0;
  let adProcessed = false;
  let videoLoop  = 1;
  
  log("Script started");

  if (adblocker) removeAds();
  if (removePopup) popupRemover();

  function popupRemover() {
      const observer = new MutationObserver(() => {
          const modalOverlay = document.querySelector("tp-yt-iron-overlay-backdrop");
          const popup = document.querySelector(".style-scope ytd-enforcement-message-view-model");
          const popupButton = document.getElementById("dismiss-button");
          var video = document.querySelector('video');
          const bodyStyle = document.body.style;

          bodyStyle.setProperty('overflow-y', 'auto', 'important');

          if (modalOverlay) {
              modalOverlay.removeAttribute("opened");
              modalOverlay.remove();
          }

          if (popup && !adProcessed) {
              log("Popup detected, removing...");

              if (popupButton) popupButton.click();

              popup.remove();
              if (video.paused) video.play();

              setTimeout(() => {
                  if (video.paused) video.play();
              }, 500);

              log("Popup removed");
              adProcessed = true;
          }
      });

      const config = { childList: true, subtree: true };
      observer.observe(document.body, config);
  }

  function removeAds() {
      const observer = new MutationObserver(() => {
          var video = document.querySelector('video');
          const ad = [...document.querySelectorAll('.ad-showing')][0];

          if (ad && !adProcessed) {
              isAdFound = true;
              adLoop = adLoop + 1;

              if (adLoop < 10) {
                  const openAdCenterButton = document.querySelector('.ytp-ad-button-icon');
                  openAdCenterButton?.click();

                  var popupContainer = document.querySelector('body > ytd-app > ytd-popup-container > tp-yt-paper-dialog');
                  if (popupContainer) popupContainer.style.display = 'none';

                  const blockAdButton = document.querySelector('[label="Block ad"]');
                  blockAdButton?.click();

                  const blockAdButtonConfirm = document.querySelector('.Eddif [label="CONTINUE"] button');
                  blockAdButtonConfirm?.click();

                  const closeAdCenterButton = document.querySelector('.zBmRhe-Bz112c');
                  closeAdCenterButton?.click();
              } else {
                  if (video) video.play();
              }

              log("Found it");

              const skipButtons = ['ytp-ad-skip-button-container', 'ytp-ad-skip-button-modern', '.videoAdUiSkipButton', '.ytp-ad-skip-button', '.ytp-ad-skip-button-modern', '.ytp-ad-skip-button'];

              if (video) {
                  video.playbackRate = 16;
                  video.volume = 0;

                  skipButtons.forEach(selector => {
                      const elements = document.querySelectorAll(selector);

                      if (elements && elements.length > 0) {
                          elements.forEach(element => {
                              element?.click();
                          });
                      }
                  });

                  video.play();

                  let randomNumber = Math.random() * (0.5 - 0.1) + 0.1;
                  video.currentTime = video.duration + randomNumber || 0;
              }

              adProcessed = true;
          } else {
              if (video && video?.playbackRate == 16) {
                  video.playbackRate = videoLoop;
              }

              if (isAdFound) {
                  isAdFound = false;

                  if (videoLoop == 16) videoLoop = 1;
                  if (video && isFinite(videoLoop)) video.playbackRate = videoLoop;

                  adLoop = 0;
                  adProcessed = false;
              } else {
                  if (video) videoLoop = video.playbackRate;
              }
          }
      });

      const config = { childList: true, subtree: true };
      observer.observe(document.body, config);

      removePageAds();
  }

  function removePageAds() {
      const sponsor = document.querySelectorAll("div#player-ads.style-scope.ytd-watch-flexy, div#panels.style-scope.ytd-watch-flexy");
      const style = document.createElement('style');

      style.textContent = `
          ytd-action-companion-ad-renderer,
          ytd-display-ad-renderer,
          ytd-video-masthead-ad-advertiser-info-renderer,
          ytd-video-masthead-ad-primary-video-renderer,
          ytd-in-feed-ad-layout-renderer,
          ytd-ad-slot-renderer,
          yt-about-this-ad-renderer,
          yt-mealbar-promo-renderer,
          ytd-statement-banner-renderer,
          ytd-ad-slot-renderer,
          ytd-in-feed-ad-layout-renderer,
          ytd-banner-promo-renderer-background
          statement-banner-style-type-compact,
          .ytd-video-masthead-ad-v3-renderer,
          div#root.style-scope.ytd-display-ad-renderer.yt-simple-endpoint,
          div#sparkles-container.style-scope.ytd-promoted-sparkles-web-renderer,
          div#main-container.style-scope.ytd-promoted-video-renderer,
          div#player-ads.style-scope.ytd-watch-flexy,
          ad-slot-renderer,
          ytm-promoted-sparkles-web-renderer,
          tp-yt-iron-overlay-backdrop,
          masthead-ad,

          #masthead-ad {
              display: none !important;
          }
      `;

      document.head.appendChild(style);

      sponsor?.forEach((element) => {
          if (element.getAttribute("id") === "rendering-content") {
              element.childNodes?.forEach((childElement) => {
                  if (childElement?.data.targetId && childElement?.data.targetId !== "engagement-panel-macro-markers-description-chapters") {
                      element.style.display = 'none';
                  }
              });
          }
      });

      log("Removing ADs from Youtube");
  }

  function log(message, ...args) {
      if (!debugMessages) return;

      const prefix = 'Remove Adblock Thing:';
      console.log(`${prefix} ${message}`, ...args);
  }
})();