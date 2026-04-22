# ArtHub — DeviantArt-style Mobile App

## Overview
A mobile-first Expo (React Native) app for creators to browse, upload, and collect digital art. Built with dark theme + DeviantArt-style neon-green accent.

## Tech Stack
- Frontend: Expo SDK 54, React Native 0.81, expo-router, TypeScript
- Backend: FastAPI + MongoDB (auth only)
- Auth: Emergent-managed Google OAuth
- Local persistence: AsyncStorage (artworks & cart), SecureStore (session token on native / localStorage on web)

## Features
- **Login**: Continue with Google (Emergent Auth). Works on web via redirect + hash, on native via expo-web-browser auth session.
- **Home**: 2-column masonry feed of 12 pre-seeded artworks.
- **Artwork detail**: Full image hero, title, author, description, price, Add-to-Cart.
- **Upload**: Pick image from gallery (expo-image-picker, stored as base64), title/description/price; validates fields.
- **Cart**: List of items with thumbnails, remove, total, fake "Buy now" that clears cart.
- **Profile**: Google avatar, name, email, upload count, grid of your uploads, logout.
- **Bottom tabs**: Home, Upload, Cart (with badge), Profile.

## Design
- Pure black background (#0A0A0A), surface #171717, accent #00E59B.
- Fonts: Outfit (headings) + Manrope (body) via @expo-google-fonts.
- Icons: lucide-react-native.

## Smart enhancement
- **Cart badge**: live count on the Cart tab icon boosts shareability of "now in your cart" moments and nudges checkout, a key conversion lever for any marketplace.

## Endpoints
- `GET /api/` — health
- `POST /api/auth/session` — exchange Emergent session_id → session_token
- `GET /api/auth/me` — current user (Bearer token)
- `POST /api/auth/logout` — revoke session

## Test credentials
Seeded in Mongo for automated tests: session_token=`test_session_arthub_01` → user `artist@arthub.test`. See `/app/memory/test_credentials.md`.
