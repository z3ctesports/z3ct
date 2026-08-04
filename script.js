(() => {
  const header = document.querySelector('.header');
  const menu = document.querySelector('.menu');
  const nav = document.querySelector('#nav');
  const page = document.body.dataset.page;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Short branded transition for the initial reveal and internal navigation.
  if (!reduce) {
    const transition = document.createElement('div');
    transition.className = 'page-transition';
    transition.setAttribute('aria-hidden', 'true');
    transition.innerHTML = '<span class="transition-line"></span><div class="transition-mark"><img src="assets/z3ct-icon.png" alt=""><strong>Z3CT</strong><small>ESPORTS</small></div><span class="transition-line"></span>';
    document.body.prepend(transition);
    requestAnimationFrame(() => requestAnimationFrame(() => transition.classList.add('is-leaving')));
    document.querySelectorAll('a[href]').forEach(link => {
      link.addEventListener('click', event => {
        const url = new URL(link.href, location.href);
        const sameOrigin = url.origin === location.origin;
        const samePageHash = url.pathname === location.pathname && url.hash;
        if (!sameOrigin || samePageHash || link.target === '_blank' || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        transition.classList.remove('is-leaving');
        transition.classList.add('is-entering');
        setTimeout(() => { location.href = url.href; }, 480);
      });
    });
  }

  document.querySelector(`[data-nav="${page}"]`)?.classList.add('active');
  const closeMenu = () => {
    nav.classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-label', 'メニューを開く');
    document.body.style.overflow = '';
  };
  menu.addEventListener('click', () => {
    const open = !nav.classList.contains('open');
    nav.classList.toggle('open', open);
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
    document.body.style.overflow = open ? 'hidden' : '';
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  addEventListener('scroll', () => header.classList.toggle('scrolled', scrollY > 16), { passive: true });
  const year = document.querySelector('#year');
  if (year) year.textContent = new Date().getFullYear();

  const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  }), { threshold: .12 });
  document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));

  const form = document.querySelector('.contact-form');
  if (form) {
    const status = form.querySelector('.form-status');
    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const button = form.querySelector('button');
      button.disabled = true;
      status.textContent = '送信中です…';
      try {
        const response = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
        if (!response.ok) throw new Error();
        form.reset();
        status.textContent = '送信しました。お問い合わせありがとうございます。';
      } catch {
        status.textContent = '送信できませんでした。時間をおいて再度お試しください。';
      } finally { button.disabled = false; }
    });
  }

  const canvas = document.querySelector('#field');
  if (!canvas || reduce) return;
  const ctx = canvas.getContext('2d');
  let points = [], frame = 0, mx = 0, my = 0, visible = true;
  const resize = () => {
    const dpr = Math.min(devicePixelRatio || 1, 1.5), rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr; canvas.height = rect.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    points = Array.from({ length: innerWidth < 700 ? 18 : 34 }, () => ({ x: Math.random()*rect.width, y: Math.random()*rect.height, vx:(Math.random()-.5)*.18, vy:(Math.random()-.5)*.18 }));
  };
  const draw = () => {
    if (!visible) return;
    const w=canvas.clientWidth,h=canvas.clientHeight; ctx.clearRect(0,0,w,h);
    points.forEach((p,i)=>{p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>w)p.vx*=-1;if(p.y<0||p.y>h)p.vy*=-1;for(let j=i+1;j<points.length;j++){const q=points[j],d=Math.hypot(p.x-q.x,p.y-q.y);if(d<150){ctx.strokeStyle=`rgba(245,217,10,${(1-d/150)*.11})`;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke()}}});
    const g=ctx.createRadialGradient(mx,my,0,mx,my,210);g.addColorStop(0,'rgba(245,217,10,.08)');g.addColorStop(1,'transparent');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);frame=requestAnimationFrame(draw);
  };
  addEventListener('resize', resize, { passive:true });
  document.querySelector('.hero').addEventListener('pointermove', event => { mx=event.clientX;my=event.clientY; });
  document.addEventListener('visibilitychange',()=>{visible=!document.hidden;if(visible)draw();else cancelAnimationFrame(frame)});
  resize(); draw();
})();
