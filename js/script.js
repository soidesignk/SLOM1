// Header effect S
var didScroll = false;
var lastScrollTop = 0;
var delta = 5;
var navbarHeight = $('#header_wrap').outerHeight();

$(window).on('scroll', function () {
  didScroll = true;
});

setInterval(function () {
  if (didScroll) {
    hasScrolled();
    didScroll = false;
  }
}, 250);

function hasScrolled() {
  var st = $(window).scrollTop();

  // 너무 작은 스크롤은 무시
  if (Math.abs(lastScrollTop - st) <= delta) return;

  // 아래로 스크롤 + 헤더 높이 지나면 숨김
  if (st > lastScrollTop && st > navbarHeight) {
    $('#header_wrap')
      .removeClass('nav-down')
      .addClass('nav-up');
  }
  // 위로 스크롤하면 다시 표시
  else {
    if (st + $(window).height() < $(document).height()) {
      $('#header_wrap')
        .removeClass('nav-up')
        .addClass('nav-down');
    }
  }

  lastScrollTop = st;
}
// Header effect E


// Archive 스크롤 업 걸림 문제 해결

let ticking = false;

function onScroll() {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      // 여기 안에 “스크롤 때 하는 일”을 모두 넣기
      // 예: updateArchive(); updateEventBanner(); updateSomething();
      ticking = false;
    });
    ticking = true;
  }
}

window.addEventListener("scroll", onScroll, { passive: true });

var archiveDidScroll = false;

$(window).on('scroll', function () {
  archiveDidScroll = true;
});

setInterval(function () {
  if (archiveDidScroll) {
    updateArchiveSteps();
    archiveDidScroll = false;
  }
}, 120); // 250보다 빠르게(부드럽게) 하고 싶으면 80~150 추천

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function updateArchiveSteps() {
  var wrap = document.querySelector(".Archive_wrap");
  if (!wrap) return;

  var rect = wrap.getBoundingClientRect();
  var vh = window.innerHeight;
  var progress = clamp((vh - rect.top) / (wrap.offsetHeight - vh), 0, 1);

  // 카드1
  if (progress >= 0.12) wrap.classList.add("step1");
  else wrap.classList.remove("step1");

  // 카드2 (히스테리시스: 업/다운 흔들림 방지)
  if (progress >= 0.82) {
    wrap.classList.add("step2");
  } else if (progress < 0.72) {
    wrap.classList.remove("step2");
  }
}

// 최초 1회 실행
updateArchiveSteps();




document.addEventListener('DOMContentLoaded', () => {
  const support = document.getElementById('support');
  if (!support) return;

  const cards = support.querySelectorAll('.support_card');
  if (!cards.length) return;

  cards.forEach(card => {
    // 초기 aria 상태
    updateAria(card, card.classList.contains('is-flipped'));

    card.querySelectorAll('.flip_btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation(); // ⭐ 핵심
        e.preventDefault();

        const isOpen = card.classList.contains('is-flipped');

        cards.forEach(c => {
          c.classList.remove('is-flipped');
          updateAria(c, false);
        });

        if (!isOpen) {
          card.classList.add('is-flipped');
          updateAria(card, true);
        }
      });
    });

    // 키보드 접근성
    const btns = card.querySelectorAll('.flip_btn');
    btns.forEach(btn => {
      btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();

          const isOpen = card.classList.contains('is-flipped');

          cards.forEach(c => {
            c.classList.remove('is-flipped');
            updateAria(c, false);
          });

          if (!isOpen) {
            card.classList.add('is-flipped');
            updateAria(card, true);
          }
        }
      });
    });
  });

  function updateAria(card, expanded) {
    const btns = card.querySelectorAll('.flip_btn');
    btns.forEach(btn =>
      btn.setAttribute('aria-expanded', expanded ? 'true' : 'false')
    );
  }
});

