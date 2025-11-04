To-Do List web app (pure HTML/CSS/JS) - Local storage demo

Files:
- index.html       -> Login screen
- dashboard.html   -> Tasks list + filters + add button (FAB inside frame)
- task.html        -> Create / Edit task screen
- stats.html       -> Productivity dashboard (progress bar)
- styles.css       -> Shared styles
- app.js           -> Shared JS logic (data management, rendering)
- README.txt       -> This file

How it stores data:
- Current user email is saved as 'todo_current_user'
- Tasks for each user stored at 'todo_data_{email}'
- No server: data stays in browser localStorage

Usability and Steve Krug:
This app follows key usability ideas (in spirit of Krug's "Don't Make Me Think"):
- Clear primary actions (Login, + to add, Save) visible and easy to use
- Consistent visual language and hierarchy (headers, cards, primary button color)
- Immediate feedback after actions (lists refresh, progress updates)
- Minimal choices and clear labels to reduce cognitive load
- Navigation is obvious (back, dashboard, stats)
- Text and icon affordances use conventions users expect
