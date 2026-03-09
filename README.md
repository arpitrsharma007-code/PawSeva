# 🐾 PawSeva — Pet Services Marketplace for India

**Uber-style two-sided marketplace connecting pet owners with pet service providers. Book grooming, vet visits, training & 19+ services in 60 seconds.**

[Download on Google Play →](https://play.google.com/store/apps/details?id=com.pawseva.app) *(Coming Soon)*

---

## What is PawSeva?

PawSeva (पॉ सेवा — "service for your pet") is a real-time, request-driven marketplace for pet services in India. Pet owners post what they need → nearby pet shops see it instantly with a 60-second countdown → a shop accepts → booking confirmed. Like Swiggy, but for your pet.

**Tagline:** *Apke Pet Ki Seva, Har Baar* (Your Pet's Service, Every Time)

## How It Works

```
Pet Owner posts request
        ↓
Request appears on ALL nearby shop dashboards
        ↓
60-second countdown timer starts
        ↓
Shop accepts → Booking confirmed
        ↓
Service completed → Analytics updated
```

## Features

### For Pet Owners
🐕 **19+ Services** — Grooming, haircut, vet checkup, vaccination, training, pet walking, sitting, boarding, dentistry, spa, nail trimming, ear cleaning, flea treatment, pet taxi, photography, birthday party, physiotherapy, breeding consultation, and more.

📍 **GPS Location** — Auto-detect your location to connect with nearby shops.

📱 **Real-time Tracking** — Track request status: Posted → Accepted → In Progress → Completed.

🐾 **Pet Profiles** — Manage all your pets (dogs, cats, birds, rabbits, fish).

### For Pet Shops
⏱️ **60-Second Timer** — Swiggy-style countdown on incoming requests. Accept or skip.

💰 **Flexible Pricing** — Set fixed prices or price ranges for each of the 19 services.

📊 **Analytics Dashboard** — Track earnings, completion rate, job breakdown, and business insights.

🟢 **Online/Offline Toggle** — Go online when available, offline when busy.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React Native + Expo SDK 54 |
| Backend | Firebase (Cloud Firestore + Auth) |
| Database | Firestore (asia-south1 Mumbai) |
| Auth | Firebase Email/Password with AsyncStorage |
| Navigation | React Navigation v6 (Bottom Tabs + Stack) |
| Location | expo-location with reverse geocoding |
| Build | EAS Build (Android .aab) |
| Distribution | Google Play Store |

## Project Structure

```
PawSeva/
├── App.js                     — Entry point
├── app.json                   — Expo config
├── src/
│   ├── utils/
│   │   ├── theme.js           — Purple + gold design system
│   │   └── services.js        — 19 service definitions
│   ├── components/
│   │   └── UI.js              — Reusable components
│   ├── hooks/
│   │   └── useAuth.js         — Auth context
│   ├── services/
│   │   ├── firebase.js        — Firebase init
│   │   ├── authService.js     — Register, login, logout, password reset
│   │   ├── requestService.js  — CRUD for service requests
│   │   └── locationService.js — GPS location
│   ├── navigation/
│   │   ├── RootNavigator.js   — Auth → Owner/Shop routing
│   │   ├── OwnerNavigator.js  — Pet owner tab navigation
│   │   └── ShopNavigator.js   — Pet shop tab navigation
│   └── screens/
│       ├── auth/              — Splash, Register, Login
│       ├── owner/             — Home, NewRequest, RequestDetail, Bookings, Profile
│       └── shop/              — Dashboard, History, Analytics, Profile
└── assets/                    — Icons, splash screen
```

## Run Locally

```bash
# Clone
git clone https://github.com/arpitrsharma007-code/PawSeva.git
cd PawSeva

# Install dependencies
npm install

# Start Expo
npx expo start
```

Scan the QR code with Expo Go on your phone.

**Note:** You'll need your own Firebase project. Create one at [console.firebase.google.com](https://console.firebase.google.com) and update `src/services/firebase.js` with your config.

## Firebase Schema

**Users Collection:**
```javascript
{
  uid, email, name, role: 'owner' | 'shop',
  phone, createdAt,
  // Owner: pets[]
  // Shop: businessName, services[], serviceDetails[], 
  //       isOnline, rating, totalJobs, earnings
}
```

**Requests Collection:**
```javascript
{
  ownerId, ownerName, service, petName, petType,
  notes, preferredDate, preferredTime,
  location: { latitude, longitude, address },
  status: 'pending' | 'accepted' | 'in-progress' | 'completed' | 'cancelled',
  acceptedShopId, acceptedShopName, createdAt
}
```

## Branding

- **Primary:** Deep Royal Purple (#0F0620)
- **Accent:** Gold (#E6B422)
- **Style:** Premium & elegant
- **Icon:** Paw with crown and heart

## Roadmap

- [x] Two-sided marketplace (owner + shop)
- [x] 19 pet services with pricing
- [x] Real-time Firestore matching
- [x] 60-second countdown timer
- [x] GPS location detection
- [x] Shop analytics dashboard
- [x] Android build (.aab)
- [x] Google Play Store submission
- [ ] Push notifications (Firebase Cloud Messaging)
- [ ] Razorpay payment integration
- [ ] In-app chat (owner ↔ shop)
- [ ] Google Maps view
- [ ] Ratings & reviews
- [ ] Price confirmation flow
- [ ] Service area selection
- [ ] iOS build

## Market Opportunity

India's pet care market is growing 20%+ annually. Urban Company proved the hyperlocal services model at scale. PawSeva applies this to the underserved pet services vertical — connecting pet parents with trusted providers in real-time.

## About the Builder

Built by [Arpit Sharma](https://github.com/arpitrsharma007-code) — a 26-year-old aspiring entrepreneur building AI-powered products through vibe coding.

**Other projects:**
- [Aatman](https://github.com/arpitrsharma007-code/Aatman) — Hindu spiritual AI companion (live)
- [Aria AI Assistant](https://github.com/arpitrsharma007-code/aria-ai-assistant) — WhatsApp AI assistant

## License

MIT License — see [LICENSE](LICENSE) for details.

---

*🐾 Apke Pet Ki Seva, Har Baar*
