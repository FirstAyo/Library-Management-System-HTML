# EduTrack LMS Template

> Polished documentation generated from the uploaded project.

## Overview
Multi‑page LMS theme (course catalog, lessons, quizzes, dashboards).

## Tech Stack
- HTML5, CSS3, JavaScript
- jQuery/Bootstrap/Tailwind/etc. if referenced below

## Structure
```
LMS-Template-v3/
├─ admin
│  ├─ css
│  │  ├─ add-book.css
│  │  ├─ books.css
│  │  ├─ dashboard.css
│  │  ├─ issue-book.css
│  │  ├─ members.css
│  │  ├─ reports.css
│  │  ├─ reservations.css
│  │  └─ return-book.css
│  ├─ js
│  │  ├─ add-book.js
│  │  ├─ books.js
│  │  ├─ dashboard.js
│  │  ├─ issue-book.js
│  │  ├─ members.js
│  │  ├─ reservations.js
│  │  └─ return-book.js
│  ├─ add-book.html
│  ├─ books.html
│  ├─ dashboard.html
│  ├─ issue-book.html
│  ├─ members.html
│  ├─ reports.html
│  ├─ reservations.html
│  └─ return-book.html
├─ client
│  ├─ css
│  │  ├─ book-details.css
│  │  ├─ catalog.css
│  │  ├─ home.css
│  │  ├─ my-account.css
│  │  ├─ my-loans.css
│  │  ├─ my-reservations.css
│  │  ├─ payments.css
│  │  └─ support.css
│  ├─ js
│  │  ├─ book-details.js
│  │  ├─ catalog.js
│  │  ├─ my-account.js
│  │  ├─ my-loans.js
│  │  └─ my-reservations.js
│  ├─ book-details.html
│  ├─ catalog.html
│  ├─ home.html
│  ├─ my-account.html
│  ├─ my-loans.html
│  ├─ my-reservations.html
│  ├─ payments.html
│  └─ support.html
├─ common
│  ├─ css
│  │  └─ base.css
│  └─ js
│     ├─ auth.js
│     ├─ data.js
│     └─ ui.js
├─ css
│  ├─ index.css
│  ├─ login.css
│  ├─ logout.css
│  └─ register.css
├─ data
│  ├─ books.json
│  ├─ loans.json
│  ├─ members.json
│  └─ reservations.json
├─ js
│  └─ login.js
├─ index.html
├─ login.html
├─ logout.html
└─ register.html
```

## Pages & Assets
- `admin/add-book.html` — **Add Book — LMS**
  - CSS: `../common/css/base.css`, `css/add-book.css`
  - JS: `https://code.jquery.com/jquery-3.7.1.min.js`, `../common/js/ui.js`, `../common/js/auth.js`, `../common/js/data.js`, `js/add-book.js`
  - Features: Form(s)
  - Counts: tables=0, forms=1
- `admin/books.html` — **Admin Books — LMS**
  - CSS: `../common/css/base.css`, `css/books.css`
  - JS: `https://code.jquery.com/jquery-3.7.1.min.js`, `../common/js/ui.js`, `../common/js/auth.js`, `../common/js/data.js`, `js/books.js`
  - Features: Table(s)
  - Counts: tables=1, forms=0
- `admin/dashboard.html` — **Admin Dashboard — LMS**
  - CSS: `../common/css/base.css`, `css/dashboard.css`
  - JS: `https://code.jquery.com/jquery-3.7.1.min.js`, `../common/js/ui.js`, `../common/js/auth.js`, `../common/js/data.js`, `js/dashboard.js`
  - Features: LMS-related strings detected
  - Counts: tables=0, forms=0
- `admin/issue-book.html` — **Issue Book — LMS**
  - CSS: `../common/css/base.css`, `css/issue-book.css`
  - JS: `https://code.jquery.com/jquery-3.7.1.min.js`, `../common/js/ui.js`, `../common/js/auth.js`, `../common/js/data.js`, `js/issue-book.js`
  - Features: Form(s)
  - Counts: tables=0, forms=1
- `admin/members.html` — **Admin Members — LMS**
  - CSS: `../common/css/base.css`, `css/members.css`
  - JS: `https://code.jquery.com/jquery-3.7.1.min.js`, `../common/js/ui.js`, `../common/js/auth.js`, `../common/js/data.js`, `js/members.js`
  - Features: Table(s)
  - Counts: tables=1, forms=0
- `admin/reports.html` — **Admin Reports — LMS**
  - CSS: `../common/css/base.css`, `css/reports.css`
  - JS: `https://code.jquery.com/jquery-3.7.1.min.js`, `../common/js/ui.js`, `../common/js/auth.js`, `../common/js/data.js`
  - Features: LMS-related strings detected
  - Counts: tables=0, forms=0
- `admin/reservations.html` — **Admin Reservations — LMS**
  - CSS: `../common/css/base.css`, `css/reservations.css`
  - JS: `https://code.jquery.com/jquery-3.7.1.min.js`, `../common/js/ui.js`, `../common/js/auth.js`, `../common/js/data.js`, `js/reservations.js`
  - Features: Table(s)
  - Counts: tables=1, forms=0
- `admin/return-book.html` — **Return Book — LMS**
  - CSS: `../common/css/base.css`, `css/return-book.css`
  - JS: `https://code.jquery.com/jquery-3.7.1.min.js`, `../common/js/ui.js`, `../common/js/auth.js`, `../common/js/data.js`, `js/return-book.js`
  - Features: Form(s)
  - Counts: tables=0, forms=1
- `client/book-details.html` — **Book Details — LMS**
  - CSS: `../common/css/base.css`, `css/book-details.css`
  - JS: `https://code.jquery.com/jquery-3.7.1.min.js`, `../common/js/ui.js`, `../common/js/auth.js`, `../common/js/data.js`, `js/book-details.js`
  - Features: —
  - Counts: tables=0, forms=0
- `client/catalog.html` — **Catalog — LMS**
  - CSS: `../common/css/base.css`, `css/catalog.css`
  - JS: `https://code.jquery.com/jquery-3.7.1.min.js`, `../common/js/ui.js`, `../common/js/auth.js`, `../common/js/data.js`, `js/catalog.js`
  - Features: —
  - Counts: tables=0, forms=0
- `client/home.html` — **Client Home — LMS**
  - CSS: `../common/css/base.css`, `css/home.css`
  - JS: `https://code.jquery.com/jquery-3.7.1.min.js`, `../common/js/ui.js`, `../common/js/auth.js`, `../common/js/data.js`
  - Features: —
  - Counts: tables=0, forms=0
- `client/my-account.html` — **My Account — LMS**
  - CSS: `../common/css/base.css`, `css/my-account.css`
  - JS: `https://code.jquery.com/jquery-3.7.1.min.js`, `../common/js/ui.js`, `../common/js/auth.js`, `../common/js/data.js`, `js/my-account.js`
  - Features: —
  - Counts: tables=0, forms=0
- `client/my-loans.html` — **My Loans — LMS**
  - CSS: `../common/css/base.css`, `css/my-loans.css`
  - JS: `https://code.jquery.com/jquery-3.7.1.min.js`, `../common/js/ui.js`, `../common/js/auth.js`, `../common/js/data.js`, `js/my-loans.js`
  - Features: Table(s)
  - Counts: tables=1, forms=0
- `client/my-reservations.html` — **My Reservations — LMS**
  - CSS: `../common/css/base.css`, `css/my-reservations.css`
  - JS: `https://code.jquery.com/jquery-3.7.1.min.js`, `../common/js/ui.js`, `../common/js/auth.js`, `../common/js/data.js`, `js/my-reservations.js`
  - Features: Table(s)
  - Counts: tables=1, forms=0
- `client/payments.html` — **Payments — LMS**
  - CSS: `../common/css/base.css`, `css/payments.css`
  - JS: `https://code.jquery.com/jquery-3.7.1.min.js`, `../common/js/ui.js`, `../common/js/auth.js`, `../common/js/data.js`
  - Features: —
  - Counts: tables=0, forms=0
- `client/support.html` — **Support — LMS**
  - CSS: `../common/css/base.css`, `css/support.css`
  - JS: `https://code.jquery.com/jquery-3.7.1.min.js`, `../common/js/ui.js`, `../common/js/auth.js`, `../common/js/data.js`
  - Features: —
  - Counts: tables=0, forms=0
- `index.html` — **LMS Starter** (H1: Library Management System — Starter Template)
  - CSS: `./common/css/base.css`, `css/index.css`
  - JS: `https://code.jquery.com/jquery-3.7.1.min.js`, `./common/js/ui.js`, `./common/js/auth.js`, `./common/js/data.js`
  - Features: —
  - Counts: tables=0, forms=0
- `login.html` — **Login — LMS**
  - CSS: `./common/css/base.css`, `css/login.css`
  - JS: `https://code.jquery.com/jquery-3.7.1.min.js`, `./common/js/ui.js`, `./common/js/auth.js`, `./common/js/data.js`, `js/login.js`
  - Features: Form(s), LMS-related strings detected
  - Counts: tables=0, forms=1
- `logout.html` — **Logout — LMS**
  - CSS: `./common/css/base.css`, `css/logout.css`
  - JS: `https://code.jquery.com/jquery-3.7.1.min.js`, `./common/js/ui.js`, `./common/js/auth.js`, `./common/js/data.js`
  - Features: —
  - Counts: tables=0, forms=0
- `register.html` — **Register — LMS**
  - CSS: `./common/css/base.css`, `css/register.css`
  - JS: `https://code.jquery.com/jquery-3.7.1.min.js`, `./common/js/ui.js`, `./common/js/auth.js`, `./common/js/data.js`
  - Features: Form(s)
  - Counts: tables=0, forms=1

## Local Development
1. Open `index.html` directly or serve locally for accurate relative paths:

   - Python: `python3 -m http.server 5173`

   - Node: `npx serve .`

2. Visit `http://localhost:5173/`

## Dependencies (from asset paths)
- **jQuery** — e.g., `https://code.jquery.com/jquery-3.7.1.min.js`


## Notes
- Keep thumbnails and course cover images optimized (modern formats where possible).

- If using external CDNs, pin versions and add SRI attributes.

- Run Lighthouse on landing/catalog/lesson pages for performance and a11y.


See **DEPLOYMENT.md** for hosting instructions.
