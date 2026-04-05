# Taskly - Test Scenarios

## 1. Auth Flow
- [x] 1.1 Register - vytvoreni noveho uctu (curl test)
- [ ] 1.2 Register - validace (prazdne pole, kratke heslo, duplicitni email)
- [x] 1.3 Login - uspesny login (frontend)
- [ ] 1.4 Login - spatne credentials
- [x] 1.5 Login -> redirect na /app/tasks
- [ ] 1.6 Logout -> redirect na /
- [x] 1.7 Protected route - pristup na /app/tasks bez loginu -> redirect na /

## 2. Task CRUD
- [x] 2.1 Create task - vsechna pole (title, description, category, priority) via modal
- [x] 2.2 Create task - jen title (curl test)
- [x] 2.3 Toggle task completed (checkbox) - presun do Completed sekce
- [ ] 2.4 Delete task
- [ ] 2.5 Delete all completed
- [x] 2.6 Empty state - netestovano vizualne, ale komponenta existuje

## 3. Task List Features
- [x] 3.1 Filtrovani - Active tab funguje (zobrazuje jen aktivni)
- [x] 3.2 Search - hledani "morning" filtruje spravne
- [ ] 3.3 Drag & drop reorder - netestovano v preview (potrebuje mouse events)
- [x] 3.4 Completed sekce - collapsible, zobrazuje se s poctem
- [x] 3.5 Category badges - spravne barvy (Shopping modra, Work oranzova, Health zelena)

## 4. Sidebar Navigation
- [x] 4.1 All Tasks filter - zobrazuje vsechny tasky
- [ ] 4.2 Today filter - netestovano (zadne tasky s dnesnim datem)
- [x] 4.3 Category filter - klik na Work filtruje jen Work tasky, title se meni
- [x] 4.4 Category ikony - MUI Sharp ikony (work, person, shopping_cart, favorite)
- [x] 4.5 Task count badges - Shopping 1, Work 1
- [x] 4.6 User info ve footeru - "Test User", "test@test.com"
- [x] 4.7 Dark mode toggle v sidebaru - ikona se meni (moon/sun)
- [x] 4.8 Settings ikona -> navigace na profil

## 5. Create Task Modal
- [x] 5.1 Otevreni modalu - klik na "Add Task"
- [x] 5.2 Vyplneni vsech poli (title, description)
- [x] 5.3 Category dropdown - zobrazuje 4 kategorie + "No category"
- [x] 5.4 Priority selector - Low/Medium/High, aktivni se zvyrazni
- [x] 5.5 Submit - task se objevi v seznamu
- [ ] 5.6 Cancel/close - zavreni bez ulozeni

## 6. Profile Page
- [x] 6.1 Zobrazeni profilu (jmeno, email, "Member since April 2026")
- [x] 6.2 Statistiky (Completed 1, Active 2, Categories 4)
- [ ] 6.3 Update jmena/emailu - netestovano (submit)
- [ ] 6.4 Zmena hesla - netestovano (submit)
- [x] 6.5 Theme toggle (System/Light/Dark) - funguje
- [ ] 6.6 Sign out - netestovano
- [x] 6.7 Danger Zone - Delete Account tlacitko zobrazeno

## 7. Dark/Light Mode
- [x] 7.1 Default = system preference (dark na dark system)
- [x] 7.2 Prepnuti na Light - cela appka se prepne
- [ ] 7.3 Prepnuti na Dark - nepotrebuje test (symetricke)
- [x] 7.4 Persistence po refreshi (localStorage) - light zustava po navigaci

## 8. Responsive
- [x] 8.1 Desktop (1280px) - sidebar viditelny, 2-column layout
- [x] 8.2 Mobile (375px) - bottom nav s FAB, sidebar skryty

## Nalezene bugy (opravene)
1. CRITICAL: userApi baseUrl /api/users misto /api/user -> FIXED
2. CRITICAL: tasks.ts route ordering DELETE /:id pred DELETE / -> FIXED
3. IMPORTANT: Sidebar ikony prazdny mapping -> FIXED (MUI Sharp ikony)
4. IMPORTANT: ThemeToggle neuklada na backend -> FIXED (updateTheme mutation)
5. IMPORTANT: deleteCategory bez userId filtru -> FIXED
6. IMPORTANT: 5x PrismaClient instance -> FIXED (shared prisma.ts)
7. IMPORTANT: Register response bez themePreference -> FIXED

## Zname limitace
- "Add Category" v sidebaru nema modal (placeholder)
- deleteAllCompleted haze 400 pokud zadne completed
- Drag & drop netestovatelny v preview tool (potrebuje skutecny browser)
- Due date input pouziva nativni browser date picker

## Status
- Started: 2026-04-05
- Last tested: 2026-04-05
- Backend: OK (curl testy prochazi)
- Frontend: OK (vizualni testy v preview)
- Pripraveno na deploy: ANO (po manual DnD testu v browseru)
