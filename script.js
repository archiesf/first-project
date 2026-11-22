// Каталог курсов. Чтобы добавить курс, просто допишите объект в этот список.
const COURSES = [
  { id: 1,  title: "Python с нуля",              cat: "Программирование", level: "Новичок",     lessons: 24, hours: 12, icon: "🐍", color: "#ffe9a8", desc: "Переменные, циклы, функции и первые небольшие программы." },
  { id: 2,  title: "Основы HTML и CSS",          cat: "Программирование", level: "Новичок",     lessons: 18, hours: 8,  icon: "🌐", color: "#cfe3ff", desc: "Сверстайте свою первую веб-страницу и опубликуйте её." },
  { id: 3,  title: "JavaScript для сайтов",      cat: "Программирование", level: "Средний",     lessons: 30, hours: 16, icon: "⚡", color: "#fff1b8", desc: "Сделайте страницы интерактивными: события, DOM, fetch." },
  { id: 4,  title: "Git и GitHub",               cat: "Программирование", level: "Новичок",     lessons: 10, hours: 4,  icon: "🌿", color: "#d4f5dd", desc: "Коммиты, ветки, пулл-реквесты и совместная работа." },
  { id: 5,  title: "Работа с ИИ-ассистентами",   cat: "Искусственный интеллект", level: "Новичок", lessons: 12, hours: 5, icon: "🤖", color: "#e5dcff", desc: "Как писать хорошие запросы и использовать ИИ в работе и учёбе." },
  { id: 6,  title: "Машинное обучение: введение",cat: "Искусственный интеллект", level: "Продвинутый", lessons: 28, hours: 20, icon: "🧠", color: "#ffd9e4", desc: "Регрессия, классификация и оценка моделей на практике." },
  { id: 7,  title: "SQL для анализа данных",     cat: "Данные",           level: "Новичок",     lessons: 16, hours: 7,  icon: "🗄️", color: "#d6f0ff", desc: "SELECT, JOIN, группировки и реальные задачи аналитика." },
  { id: 8,  title: "Excel и таблицы",            cat: "Данные",           level: "Новичок",     lessons: 14, hours: 6,  icon: "📊", color: "#d8f7e6", desc: "Формулы, сводные таблицы и наглядные графики." },
  { id: 9,  title: "Основы UI/UX-дизайна",       cat: "Дизайн",           level: "Новичок",     lessons: 15, hours: 9,  icon: "🎨", color: "#ffe0cc", desc: "Сетки, типографика, цвет и удобные интерфейсы." },
  { id: 10, title: "Figma на практике",          cat: "Дизайн",           level: "Средний",     lessons: 20, hours: 10, icon: "✏️", color: "#f3dcff", desc: "Компоненты, автолейауты и прототипы мобильного приложения." },
  { id: 11, title: "Английский: уровень A2→B1",  cat: "Языки",            level: "Средний",     lessons: 40, hours: 30, icon: "🇬🇧", color: "#dfe8ff", desc: "Грамматика, словарный запас и разговорная практика." },
  { id: 12, title: "Испанский для начинающих",   cat: "Языки",            level: "Новичок",     lessons: 25, hours: 15, icon: "🇪🇸", color: "#ffe5b5", desc: "Базовые фразы, произношение и простые диалоги." },
  { id: 13, title: "Личные финансы",             cat: "Саморазвитие",     level: "Новичок",     lessons: 10, hours: 4,  icon: "💰", color: "#e2f7d2", desc: "Бюджет, подушка безопасности и первые инвестиции." },
  { id: 14, title: "Тайм-менеджмент",            cat: "Саморазвитие",     level: "Новичок",     lessons: 8,  hours: 3,  icon: "⏱️", color: "#ffe1e1", desc: "Планирование, приоритеты и борьба с прокрастинацией." },
  { id: 15, title: "Публичные выступления",      cat: "Саморазвитие",     level: "Средний",     lessons: 12, hours: 6,  icon: "🎤", color: "#fde3f0", desc: "Структура речи, работа с волнением и аудиторией." },
];

const STORAGE_KEY = "learn-progress-v1";

// Прогресс хранится в браузере: { [courseId]: числоПройденныхУроков }
function loadProgress() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
  catch { return {}; }
}
function saveProgress() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); } catch {}
}

let progress = loadProgress();
let activeCat = "Все";

const $ = (id) => document.getElementById(id);

function renderChips() {
  const cats = ["Все", ...new Set(COURSES.map((c) => c.cat))];
  $("chips").innerHTML = cats
    .map((c) => `<button class="chip ${c === activeCat ? "active" : ""}" data-cat="${c}">${c}</button>`)
    .join("");
}

function cardHTML(c) {
  const done = progress[c.id];
  const started = done !== undefined;
  const finished = started && done >= c.lessons;
  const pct = started ? Math.round((done / c.lessons) * 100) : 0;

  let actions;
  if (!started) {
    actions = `<button class="btn" data-action="start" data-id="${c.id}">Начать</button>`;
  } else if (finished) {
    actions = `<button class="btn btn--done" disabled>✓ Пройден</button>
               <button class="btn btn--ghost" data-action="reset" data-id="${c.id}">Сбросить</button>`;
  } else {
    actions = `<button class="btn" data-action="next" data-id="${c.id}">Урок пройден</button>
               <button class="btn btn--ghost" data-action="reset" data-id="${c.id}">Сбросить</button>`;
  }

  return `
    <article class="card">
      <div class="card__cover" style="background:${c.color}">${c.icon}</div>
      <div class="card__body">
        <div class="card__cat">${c.cat}</div>
        <h3>${c.title}</h3>
        <p>${c.desc}</p>
        <div class="meta">
          <span>${c.level}</span><span>${c.lessons} уроков</span><span>~${c.hours} ч</span>
        </div>
        ${started ? `<div class="progress"><div style="width:${pct}%"></div></div>
                     <div class="progress-label">${done} из ${c.lessons} уроков · ${pct}%</div>` : ""}
        <div class="actions">${actions}</div>
      </div>
    </article>`;
}

function render() {
  const q = $("search").value.trim().toLowerCase();
  const level = $("level").value;

  const list = COURSES.filter((c) =>
    (activeCat === "Все" || c.cat === activeCat) &&
    (level === "all" || c.level === level) &&
    (c.title + " " + c.desc + " " + c.cat).toLowerCase().includes(q)
  );

  $("grid").innerHTML = list.map(cardHTML).join("");
  $("empty").hidden = list.length > 0;

  const mine = COURSES.filter((c) => progress[c.id] !== undefined);
  $("myGrid").innerHTML = mine.map(cardHTML).join("");
  $("myEmpty").hidden = mine.length > 0;
  $("myCount").textContent = mine.length;

  $("statCourses").textContent = COURSES.length;
  $("statCats").textContent = new Set(COURSES.map((c) => c.cat)).size;
  $("statDone").textContent = COURSES.filter((c) => progress[c.id] >= c.lessons).length;
}

document.addEventListener("click", (e) => {
  const chip = e.target.closest(".chip");
  if (chip) { activeCat = chip.dataset.cat; renderChips(); render(); return; }

  const btn = e.target.closest("[data-action]");
  if (!btn) return;
  const id = Number(btn.dataset.id);
  const course = COURSES.find((c) => c.id === id);

  if (btn.dataset.action === "start") progress[id] = 0;
  if (btn.dataset.action === "next") progress[id] = Math.min(course.lessons, progress[id] + 1);
  if (btn.dataset.action === "reset") delete progress[id];

  saveProgress();
  render();
});

$("search").addEventListener("input", render);
$("level").addEventListener("change", render);
$("year").textContent = new Date().getFullYear();

renderChips();
render();
