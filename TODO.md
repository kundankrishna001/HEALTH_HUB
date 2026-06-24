# TODO - Remove demo/mock data (NEW23)

- [x] Get repo understanding (found mockApi.js, defaultState.js, aiEngine.js, Dashboard hardcoded demo data)
- [x] Update server default state to be empty (remove demo badges/default data)
- [x] Update server/db state creation to avoid injecting demo defaults
- [x] Remove demo guidance/data from src/services/aiEngine.js (symptomMap/recipe templates/food scan samples)
- [x] Update src/pages/Dashboard.jsx to derive from DB state only; remove chart/topTasks/demo stats
- [x] Remove hardcoded demo default input values where they represent sample data

- [x] Run build/compile to ensure no errors
- [x] Clean up unused imports/vars
- [x] Verify empty DB shows empty state only (no demo UI)

