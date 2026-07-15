# ulcamp

Одностраничный лендинг-портфолио «Регина — веб дизайнер». Статика без сборки, деплой на Vercel.

## Структура
- `index.html` — вся разметка страницы (hero, package, skills, cases, cta, footer, меню, карточка кейса).
- `styles.css` — все стили.
- `script.js` — меню, parallax, reveal-анимации, turntable-портрет, роутинг карточки кейса по hash.
- `turntable.html` — отдельный демо-стенд с покадровой анимацией поворота портрета.
- `img/` — кадры поворота портрета (front/back/left1-4/right1-4), использует и index.html, и turntable.html.
- `images/` — иллюстрации секций (буквы, части лица, иконки меню/папки/курсора).
- `fonts/NOGGI Regular.otf` — единственный источник шрифта NOGGI (подключается через `@font-face` в styles.css).

## Деплой
`vercel.json` → `outputDirectory: "."`, без build-шага. `.vercelignore` исключает `.claude`, `references`, `*.pdf` и неиспользуемые тяжёлые экспорты (`img/turntable.*`, часть `images/*`, не referenced из index.html).

## Заметки
- Изображения-портреты обёрнуты в контейнеры с `aria-hidden="true"` — пустой `alt=""` у них корректен (декоративные).
- Секция «кейсы»: сейчас реализован только кейс «Этот сайт», остальные — заглушки «скоро».
