/* ====== EDIT HERE ====== */
const SENDER = ""; // e.g. "Your name" -> shows "— Your name" on the last page. Leave empty to hide.
const PHOTOS = (typeof PHOTOS_EMBEDDED !== "undefined") ? PHOTOS_EMBEDDED : ["images/1.jpg", "images/2.jpg", "images/3.jpg", "images/4.jpg"];
const WISH = [
`Wish u a veryy Happy Birthday to the person who has become one of the most precious parts of my University life. ❤️‍🩹❤️
Happiest Birthday to u Arthi🍃`,
`I dont know what university life has given meh and what it hasnt, but if there’s one thing I will always be grateful for, it’s finding uh. Among all the people I have met and all the experiences I have had, you are someone I never knew I needed this much until u became a part of my life.`,
`Honestly, I dont think you realize how much u mean to meh. I have become so dependent on uh in ways I cant even explain. U have become a part of my everyday life, my comfort, my peace, and someone I instinctively look for whenever something happens, whether it’s something worth celebrating or something that quietly breaks me inside. Somehow, sharing things with u makes everything feel a little easier. Ur presence has become something I never want to take for granted.`,
`The beautiful thing is, I never planned on finding someone like uh. It just happened, and somewhere along the way, u became more than just a best friend to me. U became someone whose absence I would feel even in a crowded room, someone whose happiness genuinely matters to meh, and someone I cant imagine my university life being the same without.`,
`I dont know what the future holds for us, where life will take us, or how much things will change with time. But I sincerely hope that no matter how different our lives become, we never become strangers to each other. I hope we get to witness each other’s growth, celebrate each other’s victories, survive the difficult days together, and look back someday with a thousand memories that still make us smile.`,
`On your birthday, I wish u all the happiness this world has to offer. I hope life gives u the things u pray for silently, the peace u deserve, the success u work for, and the kind of love that makes u feel valued without ever having to ask for it. And whenever life gets difficult, I hope u always remember that you have someone who genuinely wants to see u happy and doing well.`,
`Thank u for being you. Thank u for existing in my life in a way that words will probably never be enough to explain. Maybe I dont express it all the time, and maybe I will never find the perfect words to tell u how important u are to me, but please know that having uh in my life is one of those things I will always be thankful for.
If university life gave me nothing else, it gave me uh, and honestly, that alone makes so much of it worth it. 🫂❤️`,
`Again Happy Birthday, Arthi. May you always find reasons to smile, people who understand ur heart, and a life that treats u as kindly as uh deserve. And I hope that, years from now, I will still be here wishing u on ur birthdays, reminding u of how much u mean to meh, and being grateful that, out of all the people in this world, life somehow brought us together.`,
`U r not just a part of my university life; u r a part of the memories I know I will carry with meh long after this chapter ends. Happy Birthday, dearest Barishaillah monu. ❤️‍🩹🫶🏻`
];
/* ======================= */

const $ = s => document.querySelector(s);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Music: Happy Birthday tune via Web Audio (no mp3 needed) ---------- */
let ac, master, muted = false;
const F = {G4:392, A4:440, B4:493.88, C5:523.25, D5:587.33, E5:659.25, F5:698.46, G5:783.99};
const TUNE = [
  ["G4 G4 A4 G4 C5 B4", [.75,.25,1,1,1,2]],
  ["G4 G4 A4 G4 D5 C5", [.75,.25,1,1,1,2]],
  ["G4 G4 G5 E5 C5 B4 A4", [.75,.25,1,1,1,1,2]],
  ["F5 F5 E5 C5 D5 C5", [.75,.25,1,1,1,3]]
];
function note(f, t, d) {
  [[f,"sine",.22],[f*2,"triangle",.07],[f*3,"sine",.03]].forEach(([fr, ty, v]) => {
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = ty; o.frequency.value = fr;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(v, t + .02);
    g.gain.exponentialRampToValueAtTime(.0001, t + d + .6);
    o.connect(g); g.connect(master); o.start(t); o.stop(t + d + .7);
  });
}
function playTune() {
  const beat = .5; let t = ac.currentTime + .1;
  TUNE.forEach(([n, d]) => n.split(" ").forEach((k, i) => { note(F[k], t, d[i] * beat); t += d[i] * beat; }));
  setTimeout(playTune, (t - ac.currentTime + 1.5) * 1000);
}
function startMusic() {
  if (ac) { ac.resume(); return; }
  ac = new (window.AudioContext || window.webkitAudioContext)();
  master = ac.createGain(); master.gain.value = muted ? 0 : .55; master.connect(ac.destination);
  playTune();
}
function whoosh() {
  if (!ac) return;
  const n = ac.sampleRate * .5, b = ac.createBuffer(1, n, ac.sampleRate), d = b.getChannelData(0);
  for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
  const s = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain();
  f.type = "bandpass"; f.frequency.value = 900; g.gain.value = .5;
  s.buffer = b; s.connect(f); f.connect(g); g.connect(master); s.start();
}
$("#mute").onclick = () => {
  if (!ac) startMusic();
  muted = !muted; master.gain.value = muted ? 0 : .55;
  $("#mute").textContent = muted ? "🔇" : "🔊";
};

/* ---------- Confetti ---------- */
const cv = $("#fx"), cx = cv.getContext("2d");
let P = [], running = false;
const COL = ["#ff6f91","#ffc872","#ffd6df","#fff5ee","#c77dff","#7bdff2"];
const size = () => { cv.width = innerWidth; cv.height = innerHeight; };
size(); addEventListener("resize", size);
function piece(x, y, vx, vy, i) {
  P.push({x, y, vx, vy, w: 6 + Math.random() * 6, h: 4 + Math.random() * 5, c: COL[i % COL.length], r: Math.random() * 6, vr: (Math.random() - .5) * .4});
}
function kick() { if (!running) { running = true; tick(); } }
function burst(x = innerWidth / 2, y = innerHeight * .55, n = 140) {
  for (let i = 0; i < n; i++) { const a = Math.random() * Math.PI * 2, s = 4 + Math.random() * 9; piece(x, y, Math.cos(a) * s, Math.sin(a) * s - 6, i); }
  kick();
}
function rain(ms) {
  const end = Date.now() + ms;
  const iv = setInterval(() => {
    for (let i = 0; i < 6; i++) piece(Math.random() * innerWidth, -10, (Math.random() - .5) * 2, 2 + Math.random() * 3, i);
    kick(); if (Date.now() > end) clearInterval(iv);
  }, 120);
}
function tick() {
  cx.clearRect(0, 0, cv.width, cv.height);
  P = P.filter(p => p.y < cv.height + 20);
  P.forEach(p => {
    p.x += p.vx; p.y += p.vy; p.vy += .16; p.vx *= .99; p.r += p.vr;
    cx.save(); cx.translate(p.x, p.y); cx.rotate(p.r); cx.fillStyle = p.c; cx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); cx.restore();
  });
  if (P.length) requestAnimationFrame(tick); else running = false;
}

/* ---------- Floating balloons / hearts ---------- */
setInterval(() => {
  if (reduce) return;
  const st = document.querySelector(".stage.active");
  if (!st || st.id === "s1") return;
  const heart = st.id === "s3" || st.id === "s4";
  const e = document.createElement("div");
  const s = heart ? 14 + Math.random() * 18 : 46 + Math.random() * 30;
  e.className = heart ? "heart" : "balloon";
  if (heart) { e.textContent = "♥"; e.style.fontSize = s + "px"; }
  else { e.style.width = s + "px"; e.style.height = s * 1.25 + "px"; }
  e.style.left = Math.random() * 95 + "vw";
  e.style.setProperty("--c", COL[Math.floor(Math.random() * 3)]);
  e.style.setProperty("--sw", (Math.random() * 80 - 40) + "px");
  e.style.animationDuration = 9 + Math.random() * 7 + "s";
  e.addEventListener("animationend", () => e.remove());
  document.body.appendChild(e);
}, 900);

/* ---------- Setup ---------- */
document.querySelectorAll(".split").forEach(el => {
  let i = 0;
  el.innerHTML = el.textContent.split(" ").map(w =>
    `<span class="w">${[...w].map(c => `<span class="l" style="--i:${i++}">${c}</span>`).join("")}</span>`).join(" ");
});
const go = id => { document.querySelectorAll(".stage").forEach(s => s.classList.toggle("active", s.id === id)); scrollTo(0, 0); };
if (SENDER) $("#sender").textContent = "— " + SENDER;

/* ---------- Flow ---------- */
$("#open").onclick = () => { startMusic(); go("s2"); setTimeout(() => burst(innerWidth / 2, innerHeight * .3, 90), 600); };

$("#blow").onclick = async () => {
  $("#blow").classList.add("gone");
  $("#cake").classList.add("out"); whoosh();
  burst(); setTimeout(() => burst(innerWidth * .25, innerHeight * .5, 80), 300); setTimeout(() => burst(innerWidth * .75, innerHeight * .5, 80), 550);
  $("#wishline").classList.add("show");
  await sleep(2600);
  $("#toLetter").classList.add("show");
};

let skip = false;
async function typeWish() {
  const card = $("#letter"); card.innerHTML = ""; skip = false;
  for (const para of WISH) {
    const p = document.createElement("p"); card.appendChild(p);
    p.scrollIntoView({behavior: "smooth", block: "center"});
    if (skip) { p.textContent = para; continue; }
    for (const ch of para) {
      if (skip) { p.textContent = para; break; }
      p.textContent += ch;
      await sleep(ch === "\n" ? 300 : /[.,!?;]/.test(ch) ? 130 : 22);
    }
    if (!skip) await sleep(500);
  }
  card.classList.remove("typing");
  $("#skip").classList.add("gone");
  $("#toGallery").classList.add("show");
  $("#toGallery").scrollIntoView({behavior: "smooth", block: "center"});
}
$("#toLetter").onclick = () => { go("s3"); typeWish(); };
$("#skip").onclick = () => { skip = true; };
$("#toGallery").onclick = () => go("s4");

/* ---------- Gallery + lightbox ---------- */
const rot = [-3, 2.5, 3, -2];
PHOTOS.forEach((src, i) => {
  const b = document.createElement("button");
  b.className = "pol"; b.style.setProperty("--r", rot[i % rot.length] + "deg");
  b.innerHTML = `<img src="${src}" alt="Photo ${i + 1}">`;
  b.onclick = () => show(i);
  $("#gallery").appendChild(b);
});
const lb = $("#lb"), lbi = $("#lb img");
let cur = 0;
function show(i) { cur = (i + PHOTOS.length) % PHOTOS.length; lbi.src = PHOTOS[cur]; lbi.style.animation = "none"; lbi.offsetHeight; lbi.style.animation = ""; lb.hidden = false; }
const close = () => { lb.hidden = true; };
$("#lb .x").onclick = close;
$("#lb .prev").onclick = e => { e.stopPropagation(); show(cur - 1); };
$("#lb .next").onclick = e => { e.stopPropagation(); show(cur + 1); };
lb.onclick = e => { if (e.target === lb) close(); };
addEventListener("keydown", e => {
  if (lb.hidden) return;
  if (e.key === "Escape") close();
  if (e.key === "ArrowLeft") show(cur - 1);
  if (e.key === "ArrowRight") show(cur + 1);
});
let tx = 0;
lb.addEventListener("touchstart", e => { tx = e.touches[0].clientX; });
lb.addEventListener("touchend", e => { const d = e.changedTouches[0].clientX - tx; if (Math.abs(d) > 50) show(cur + (d < 0 ? 1 : -1)); });

/* ---------- Finale ---------- */
$("#toFinale").onclick = () => { go("s5"); burst(); rain(7000); };
$("#again").onclick = () => location.reload();
