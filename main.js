/* 모션 원칙 (DESIGN.md §7): 로드 choreography 1개 + 스크롤 리빌 + signature 계절 빛 전환.
   그 외 추가 금지. reduced-motion이면 전부 스킵, 계절광은 겨울 고정. */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion && window.gsap) {
  gsap.registerPlugin(ScrollTrigger);

  gsap.timeline()
    .from('.hero__title', { y: 40, opacity: 0, duration: 0.8, ease: 'power3.out' })
    .from('.hero__sub', { y: 24, opacity: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4')
    .from('.hero__copy .btn', { y: 16, opacity: 0, duration: 0.5, ease: 'power3.out' }, '-=0.3')
    // 히어로 폰 — 3D 회전 등장 후 살짝 기운 포즈(CSS 정지 포즈와 동일 값)로 안착
    .fromTo('.hero__figure--app picture',
      { rotationY: -50, rotationX: 6, y: 44, transformPerspective: 1000 },
      { rotationY: 0, rotationX: 0, y: 0, duration: 1.3, ease: 'power3.out', transformPerspective: 1000 },
      '-=0.8');

  document.querySelectorAll('.season, .shot').forEach((el) => {
    gsap.from(el, {
      y: 24,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 85%' },
    });
  });

  // signature — 계절 섹션 진입 시 body[data-season] 교체 → CSS가 1.2s 크로스페이드
  document.querySelectorAll('.season[data-season]').forEach((el) => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 60%',
      end: 'bottom 60%',
      onEnter: () => { document.body.dataset.season = el.dataset.season; },
      onEnterBack: () => { document.body.dataset.season = el.dataset.season; },
    });
  });
  // 계절 구간을 벗어나 위(히어로)로 돌아가면 겨울로 복귀
  ScrollTrigger.create({
    trigger: '.hero',
    start: 'top top',
    end: 'bottom 60%',
    onEnterBack: () => { document.body.dataset.season = 'winter'; },
  });

  // band — 패럴랙스(사진이 스크롤보다 느리게) + 카피 리빌
  const band = document.querySelector('.band');
  if (band) {
    gsap.fromTo('.band__img',
      { yPercent: -9 },
      {
        yPercent: 9,
        ease: 'none',
        scrollTrigger: { trigger: band, start: 'top bottom', end: 'bottom top', scrub: true },
      }
    );
    gsap.from('.band__copy', {
      y: 28,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: { trigger: band, start: 'top 70%' },
    });
  }
}
