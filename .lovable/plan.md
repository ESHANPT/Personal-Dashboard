# Reminders and Weekly Timetable

## Changes
- Replace the fixed Dashboard reminders with the existing to-do list behavior, while keeping reminder-specific wording, starter items, empty state, and the current browser storage key.
- Add an editable weekly timetable at the top of University, with editable day headings, time labels, and lesson cells.
- Save every timetable edit automatically in the browser, highlight the current weekday, support confirmed reset, and keep the table horizontally scrollable on small screens.
- Preserve all existing Dashboard, University, Skills, Sleep, notes, and sidebar behavior.

## Technical details
- Reuse and lightly extend the shared to-do list component so reminders receive their own input placeholder and empty-state copy without duplicating list logic.
- Add a focused timetable component with a stable default grid and local browser persistence.
- Verify the preview on desktop and mobile, including add/toggle/delete/clear reminders, inline timetable editing, persistence, reset confirmation, and existing page content.
