Login screen          [PUBLIC]  → /login
Signup screen         [PUBLIC]  → /signup
Home dashboard        [AUTH]    → /
Search results        [AUTH]    → /search
Create / Upload asset [AUTH]    → /assets/new
My Library            [AUTH]    → /library
Dashboard stats       [AUTH]    → /dashboard
Profile               [AUTH]    → /profile
Category listing      [AUTH]    → /categories/:categoryName
Asset details         [AUTH]    → /assets/:assetId

/login               → LoginPage          → src/pages/Auth/LoginPage.jsx
/signup              → SignupPage         → src/pages/Auth/SignupPage.jsx
/                    → HomePage           → src/pages/Home/HomePage.jsx
/search              → SearchPage         → src/pages/Search/SearchPage.jsx
/assets/new          → CreateAssetPage    → src/pages/Assets/CreateAssetPage.jsx
/library             → LibraryPage        → src/pages/Library/LibraryPage.jsx
/dashboard           → DashboardPage      → src/pages/Dashboard/DashboardPage.jsx
/profile             → ProfilePage        → src/pages/Profile/ProfilePage.jsx
/categories/:cat     → CategoryPage       → src/pages/Category/CategoryPage.jsx
/assets/:assetId     → AssetDetailsPage   → src/pages/Assets/AssetDetailsPage.jsx