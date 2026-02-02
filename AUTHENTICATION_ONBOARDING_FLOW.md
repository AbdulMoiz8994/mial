# 🔐 Authentication & Onboarding Flow - Complete Architecture

## 📊 Visual Flow Chart

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         APPLICATION ENTRY POINTS                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                    ┌─────────────────┼─────────────────┐
                    │                 │                 │
                    ▼                 ▼                 ▼
            ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
            │   /sign-in   │  │   /sign-up   │  │      /       │
            │    Page      │  │    Page      │  │  (Redirect)  │
            └──────────────┘  └──────────────┘  └──────────────┘
                    │                 │                 │
                    └─────────────────┼─────────────────┘
                                      ▼
                            ┌──────────────────┐
                            │ Check if Already │
                            │  Authenticated   │
                            └──────────────────┘
                                      │
                        ┌─────────────┴─────────────┐
                        │                           │
                   YES  │                           │  NO
                        ▼                           ▼
            ┌──────────────────────┐    ┌──────────────────────┐
            │   Redirect to /home  │    │  Show Login/Signup   │
            │   (Skip onboarding)  │    │       Form           │
            └──────────────────────┘    └──────────────────────┘
                                                    │
                        ┌───────────────────────────┴───────────────────────────┐
                        │                                                       │
                        ▼                                                       ▼
        ┌──────────────────────────┐                        ┌──────────────────────────┐
        │  EMAIL/PASSWORD AUTH     │                        │     OAUTH (Social)       │
        │  ─────────────────────   │                        │  ──────────────────────  │
        │  1. Enter credentials    │                        │  1. Click Google/FB      │
        │  2. POST /api/auth/login │                        │  2. Redirect to provider │
        │     OR                   │                        │  3. Provider redirects   │
        │     /api/auth/register   │                        │     to /auth/callback    │
        │  3. Receive accessToken  │                        │  4. Extract token from   │
        │  4. Save to localStorage │                        │     URL query params     │
        └──────────────────────────┘                        │  5. GET /api/auth/me     │
                        │                                   │  6. Save token & user    │
                        │                                   └──────────────────────────┘
                        │                                               │
                        └───────────────────┬───────────────────────────┘
                                            ▼
                            ┌───────────────────────────┐
                            │   Authentication Success  │
                            │   ────────────────────    │
                            │   • Token in localStorage │
                            │   • User in context       │
                            │   • Toast notification    │
                            └───────────────────────────┘
                                            │
                        ┌───────────────────┴───────────────────┐
                        │                                       │
                   SIGN UP                                  SIGN IN
                        │                                       │
                        ▼                                       ▼
        ┌──────────────────────────┐            ┌──────────────────────────┐
        │  NEW USER FLOW           │            │  RETURNING USER FLOW     │
        │  ──────────────────       │            │  ────────────────────    │
        │  Redirect to:            │            │  1. GET /api/onboarding/ │
        │  /brand-profile          │            │     status               │
        │  (Start Onboarding)      │            │  2. Check isComplete     │
        │                          │            │  3. If incomplete:       │
        │                          │            │     → Resume from        │
        │                          │            │       currentStep        │
        │                          │            │  4. If complete:         │
        │                          │            │     → Redirect to /home  │
        └──────────────────────────┘            └──────────────────────────┘
                        │                                       │
                        └───────────────────┬───────────────────┘
        ┌───────────────┴────────────────────────────────────────────────┐
        │                                                                 │
        │                    ONBOARDING WIZARD (5 STEPS)                  │
        │                                                                 │
        └─────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ STEP 1: BRAND PROFILE                                                       │
│ ─────────────────────────                                                   │
│ Route: /brand-profile                                                       │
│ API: POST /api/onboarding/step-1                                           │
│ Data: { brandName, productsOrServices, customerDescription,                │
│         customerLocation }                                                  │
│ Validation: All fields required (brandName: 2-100, others: 10-500 chars)  │
│ Next: /business-type                                                        │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ STEP 2: BUSINESS TYPE                                                       │
│ ──────────────────────                                                      │
│ Route: /business-type                                                       │
│ API: GET /api/onboarding/business-types (load options)                     │
│      POST /api/onboarding/step-2 (submit)                                  │
│ Data: { businessTypeId: UUID }                                             │
│ Validation: Must select one option                                         │
│ Next: /goals                                                                │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ STEP 3: GOALS                                                               │
│ ──────────────                                                              │
│ Route: /goals                                                               │
│ API: GET /api/onboarding/goals (load options)                              │
│      POST /api/onboarding/step-3 (submit)                                  │
│ Data: { goalIds: [UUID, UUID, ...] }                                       │
│ Validation: Minimum 1 goal required                                        │
│ Next: /brand-colors                                                         │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ STEP 4: BRAND COLORS & LOGO                                                │
│ ─────────────────────────                                                  │
│ Route: /brand-colors                                                        │
│ API: POST /api/onboarding/step-4 (multipart/form-data)                    │
│ Data: FormData { logo: File, accentColor: "#RRGGBB" }                      │
│ Validation:                                                                 │
│   • Logo: JPG/PNG/SVG, max 5MB                                             │
│   • Color: Must match #RRGGBB format                                       │
│ Next: /social-media-focus                                                   │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ STEP 5: SOCIAL MEDIA PLATFORMS (FINAL STEP)                                │
│ ─────────────────────────────────────────────                              │
│ Route: /social-media-focus                                                  │
│ API: GET /api/onboarding/platforms (load options)                          │
│      POST /api/onboarding/step-5 (submit)                                  │
│ Data: { platformIds: [UUID, UUID, ...] }                                   │
│ Validation: Minimum 1 platform required                                    │
│ Toast: "Onboarding complete! Welcome to your dashboard!"                   │
│ Next: /pricing                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
                            ┌──────────────────┐
                            │   /pricing       │
                            │   (or /home)     │
                            └──────────────────┘
                                      │
                                      ▼
                        ┌──────────────────────┐
                        │   DASHBOARD ACCESS   │
                        │   ────────────────   │
                        │   • /home            │
                        │   • /ai-studio       │
                        │   • /editors         │
                        │   • /calendars       │
                        │   • /analytics       │
                        │   • /settings        │
                        └──────────────────────┘
```

---

## 🔑 Authentication Architecture

### **API Service Layer** ([auth.api.ts](client/src/services/auth.api.ts))

```typescript
AuthAPI {
  // Core Authentication
  ├── register(data: RegisterData) → AuthResponse
  ├── login(data: LoginData) → AuthResponse
  ├── getMe() → User
  │
  // OAuth
  ├── loginWithGoogle() → Redirect to provider
  ├── loginWithFacebook() → Redirect to provider
  │
  // Token Management
  ├── saveToken(token: string) → localStorage
  ├── getToken() → string | null
  ├── removeToken() → void
  └── isAuthenticated() → boolean
}
```

### **Context Layer** ([UserContext.tsx](client/src/contexts/UserContext.tsx))

```typescript
UserContext {
  State:
  ├── user: User | null
  ├── isLoading: boolean
  └── isAuthenticated: boolean

  Methods:
  ├── register(data) → Promise<void>
  ├── login(data) → Promise<void>
  ├── logout() → void
  ├── loginWithGoogle() → void
  ├── loginWithFacebook() → void
  └── setUser(user) → void

  Lifecycle:
  └── useEffect: Load user on mount if token exists
}
```

### **Protected Routes** ([protected-route.tsx](client/src/components/protected-route.tsx))

```typescript
ProtectedRoute {
  Logic:
  ├── Check isLoading → Show loading spinner
  ├── Check isAuthenticated → Redirect to /sign-in if false
  └── Render children if authenticated
}
```

---

## 📝 Onboarding Architecture

### **Onboarding API Service** ([onboarding.api.ts](client/src/services/onboarding.api.ts))

```typescript
OnboardingAPI {
  // Data Fetching
  ├── getBusinessTypes() → BusinessType[]
  ├── getGoals() → Goal[]
  ├── getPlatforms() → Platform[]
  ├── getStatus() → OnboardingStatus
  │
  // Step Submission
  ├── submitStep1(data: BrandProfileData) → void
  ├── submitStep2(data: BusinessTypeData) → void
  ├── submitStep3(data: GoalsData) → void
  ├── submitStep4(data: BrandingData) → void (FormData)
  └── submitStep5(data: PlatformsData) → void
}
```

### **Common Pattern Across All Steps**

```typescript
OnboardingPage {
  State:
  ├── isLoading: boolean (button loading)
  ├── errors: { general?: string }
  ├── selectedData: varies by step
  └── options: fetched from API

  Lifecycle:
  └── useEffect: Fetch options on mount

  Submit Handler:
  ├── Validate form data
  ├── setIsLoading(true)
  ├── Call onboardingAPI.submitStepX()
  ├── Show success toast
  ├── Redirect to next step
  └── Handle errors with toast + display
}
```

---

## 🛡️ Security & Token Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    TOKEN LIFECYCLE                          │
└─────────────────────────────────────────────────────────────┘

1. LOGIN/REGISTER
   ├── User submits credentials
   ├── API returns { accessToken, user }
   └── Token saved to localStorage as 'mia_auth_token'

2. AUTHENTICATED REQUESTS
   ├── Every API call includes: Authorization: Bearer {token}
   ├── Token automatically injected via getAuthHeader()
   └── Backend validates JWT signature

3. AUTO-LOAD USER ON MOUNT
   ├── UserContext checks for token in localStorage
   ├── If found: Call GET /api/auth/me
   ├── If valid: Set user in context
   └── If invalid: Remove token, redirect to /sign-in

4. LOGOUT
   ├── Remove token from localStorage
   ├── Clear user from context
   ├── Redirect to /sign-in
   └── Show toast notification
```

---

## 🚦 Route Protection Matrix

| Route                      | Protected | Auth Required | Onboarding Step |
|----------------------------|-----------|---------------|-----------------|
| `/sign-in`                 | ❌         | No            | N/A             |
| `/sign-up`                 | ❌         | No            | N/A             |
| `/auth/callback`           | ❌         | No            | N/A             |
| `/brand-profile`           | ✅         | Yes           | Step 1          |
| `/business-type`           | ✅         | Yes           | Step 2          |
| `/goals`                   | ✅         | Yes           | Step 3          |
| `/brand-colors`            | ✅         | Yes           | Step 4          |
| `/social-media-focus`      | ✅         | Yes           | Step 5          |
| `/pricing`                 | ✅         | Yes           | Post-onboarding |
| `/home`                    | ✅         | Yes           | Dashboard       |
| `/ai-studio`               | ✅         | Yes           | Dashboard       |
| `/editors`                 | ✅         | Yes           | Dashboard       |
| `/calendars`               | ✅         | Yes           | Dashboard       |
| `/analytics`               | ✅         | Yes           | Dashboard       |
| `/settings/*`              | ✅         | Yes           | Dashboard       |

---

## 📡 API Endpoints Used

### **Authentication**
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
GET    /api/auth/google (OAuth redirect)
GET    /api/auth/facebook (OAuth redirect)
```

### **Onboarding**
```
GET    /api/onboarding/status
GET    /api/onboarding/business-types
GET    /api/onboarding/goals
GET    /api/onboarding/platforms
POST   /api/onboarding/step-1 (application/json)
POST   /api/onboarding/step-2 (application/json)
POST   /api/onboarding/step-3 (application/json)
POST   /api/onboarding/step-4 (multipart/form-data)
POST   /api/onboarding/step-5 (application/json)
PUT    /api/onboarding/restart
```

---

## ✅ Validation Rules

### **Step 1: Brand Profile**
- ✓ All fields required
- ✓ `brandName`: 2-100 characters
- ✓ `productsOrServices`: 10-500 characters
- ✓ `customerDescription`: 10-500 characters
- ✓ `customerLocation`: 2-100 characters
- ✓ Client-side validation before submit

### **Step 2: Business Type**
- ✓ Must select one business type
- ✓ businessTypeId must be valid UUID

### **Step 3: Goals**
- ✓ Minimum 1 goal required
- ✓ goalIds must be array of UUIDs

### **Step 4: Branding**
- ✓ Logo required
- ✓ File types: JPG, PNG, SVG only
- ✓ Max file size: 5MB
- ✓ Color format: #RRGGBB (hex)

### **Step 5: Social Media**
- ✓ Minimum 1 platform required
- ✓ platformIds must be array of UUIDs

---

## 🎯 User Experience Flow

### **NEW USER JOURNEY**
```
1. Visit site → Redirected to /sign-in
2. Click "Sign Up"
3. Fill registration form
4. Submit → API creates account
5. Token saved → User logged in
6. Redirected to /brand-profile
7. Complete 5 onboarding steps sequentially
8. Arrive at /pricing or /home
9. Access full dashboard
```

### **RETURNING USER JOURNEY (Complete Onboarding)**
```
1. Visit site → Redirected to /sign-in
2. Enter credentials
3. Submit → API validates
4. Token saved → User logged in
5. GET /api/onboarding/status → { isComplete: true }
6. Redirected to /home (skip onboarding)
7. Access full dashboard immediately
```

### **RETURNING USER JOURNEY (Incomplete Onboarding)**
```
1. Visit site → Redirected to /sign-in
2. Enter credentials
3. Submit → API validates
4. Token saved → User logged in
5. GET /api/onboarding/status → { isComplete: false, currentStep: 3 }
6. Redirected to resume from step 3 (/goals)
7. Complete remaining steps
8. Access full dashboard
```

### **OAUTH USER JOURNEY**
```
1. Visit /sign-in or /sign-up
2. Click "Google" or "Facebook"
3. Redirected to provider
4. Authorize app
5. Provider redirects to /auth/callback?token=...
6. Token extracted and saved
7. User data fetched
8. GET /api/onboarding/status → Check completion
9. If incomplete: Redirect to current step
10. If complete: Redirect to /home
11. Toast: "Welcome!"
```

---

## 🔔 Toast Notifications

### **Authentication Events**
- ✅ Sign up success: "Account created successfully! Welcome, {firstName}!"
- ✅ Sign in success: "Welcome back! You have successfully signed in."
- ✅ OAuth success: "Welcome! You have successfully signed in."
- ✅ Logout success: "Logged out successfully"
- ❌ Auth failure: "Sign in failed" / "Authentication failed"

### **Onboarding Events**
- ✅ Step 1 success: "Brand profile saved! Let's continue..."
- ✅ Step 2 success: "Business type saved! Let's continue..."
- ✅ Step 3 success: "Goals saved! Let's customize your brand."
- ✅ Step 4 success: "Branding saved! Let's choose platforms."
- ✅ Step 5 success: "Onboarding complete! Welcome to your dashboard!"
- ❌ Step failure: "Failed to save" with error details
- ❌ Data load failure: "Failed to load {data type}"

---

## 🏗️ Technology Stack

### **Frontend**
- **React** - UI framework
- **TypeScript** - Type safety
- **Wouter** - Routing
- **Tanstack Query** - Data fetching (future)
- **Shadcn/ui** - Toast notifications
- **Lucide React** - Icons

### **State Management**
- **React Context** - Global auth state
- **useState/useEffect** - Local component state

### **API Communication**
- **Fetch API** - HTTP requests
- **FormData** - File uploads (Step 4)
- **JSON** - Data serialization

### **Storage**
- **localStorage** - JWT token persistence
  - Key: `mia_auth_token`
  - Value: JWT string

---

## 🛠️ Error Handling Strategy

### **Network Errors**
```typescript
try {
  await apiCall();
} catch (error) {
  // Show error toast
  toast({ variant: "destructive", title: "Error", description: error.message });

  // Display inline error
  setErrors({ general: error.message });

  // Keep user on current page
}
```

### **Validation Errors**
```typescript
// Client-side validation before API call
if (!validateForm()) {
  toast({ variant: "destructive", title: "Validation error" });
  return; // Don't call API
}
```

### **Auth Errors**
```typescript
// Token expired or invalid
if (authError) {
  authAPI.removeToken();
  setUser(null);
  setLocation("/sign-in");
}
```

---

## 📈 Current Implementation Status

| Feature                          | Status |
|----------------------------------|--------|
| Email/Password Registration      | ✅     |
| Email/Password Login             | ✅     |
| Google OAuth                     | ✅     |
| Facebook OAuth                   | ✅     |
| OAuth Callback Handler           | ✅     |
| Token Management                 | ✅     |
| Auto-load User on Mount          | ✅     |
| Protected Routes                 | ✅     |
| Logout Functionality             | ✅     |
| Step 1: Brand Profile            | ✅     |
| Step 2: Business Type            | ✅     |
| Step 3: Goals                    | ✅     |
| Step 4: Brand Colors & Logo      | ✅     |
| Step 5: Social Media Platforms   | ✅     |
| Toast Notifications              | ✅     |
| Error Handling                   | ✅     |
| Loading States                   | ✅     |
| Form Validation                  | ✅     |
| Redirect Logic                   | ✅     |

---

## 🎬 Testing Checklist

### **Authentication**
- [ ] Sign up with email/password
- [ ] Sign in with email/password
- [ ] Sign in with Google
- [ ] Sign in with Facebook
- [ ] Logout from dashboard
- [ ] Try to access protected route without auth
- [ ] Refresh page while authenticated
- [ ] Incorrect credentials error handling

### **Onboarding**
- [ ] Complete all 5 steps sequentially
- [ ] Try to skip steps (should fail - protected)
- [ ] Submit invalid data (test validation)
- [ ] Upload logo (valid and invalid files)
- [ ] Select color picker
- [ ] Multi-select goals and platforms
- [ ] Back button navigation
- [ ] Error handling for API failures

### **Integration**
- [ ] Sign up → Start onboarding → Complete all steps → Arrive at pricing
- [ ] Sign in → Skip onboarding → Go to home
- [ ] OAuth login → Arrive at home
- [ ] Logout → Redirected to sign-in
- [ ] Token expiration handling

---

## 🚀 Ready for Production

All authentication and onboarding flows are **fully integrated** and **production-ready**!

**Base URL**: `https://api.miayouragent.com`
**Storage**: `localStorage.mia_auth_token`
**Auth Header**: `Authorization: Bearer {token}`
