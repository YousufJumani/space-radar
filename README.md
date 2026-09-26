# 🛰️ Space Radar — Real-Time 3D Orbital Tracking & Telemetry Engine

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat&logo=react)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL-black?style=flat&logo=three.js)](https://threejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

An interactive, high-performance 3D satellite visualization and telemetry tracking platform built with **Next.js**, **Three.js / WebGL**, and **TypeScript**. **Space Radar** streams live orbital ephemeris data directly from **NORAD / CelesTrak**, calculating real-time Keplerian orbital propagation, velocity vectors, altitudes, and ground tracks for hundreds of active orbital assets orbiting Earth.

---

## 🚀 Key Highlights & Capabilities

- **🔴 Live NORAD / CelesTrak Telemetry Pipeline:** Continuous ingestion of two-line element sets (TLE) across space stations (ISS, Tiangong), Starlink constellations, GPS/Navstar constellations, scientific observatories (Hubble, Terra, Aqua), and geostationary communication satellites.
- **✨ Intelligent Live Density Control (Curated vs 11k Swarm):** Smart decluttering architecture that displays a pristine, curated live view (~400 major orbital assets and representative constellation planes) by default, alongside a 1-click toggle to unlock the full 11,000+ satellite swarm rendered as a luminous stellar particle cloud.
- **🛰️ Interactive Constellation Isolation:** Dedicated sidebar filtering allowing users to isolate specific satellite constellations (ISS, GPS, Starlink, Weather, Scientific, Comms) with real-time orbital geometry highlights.
- **🪐 Real-Time Keplerian Orbital Mechanics:** Precise mathematical propagation deriving mean anomaly, eccentric anomaly, true anomaly, semi-major axis, orbital period, perigee/apogee, and instantaneous orbital velocity in kilometers per second.
- **🌐 60 FPS 3D WebGL Visualization:** Custom Three.js Earth sphere rendering with high-resolution textures, dynamic day/night terminator shading, atmospheric halo glow, and illuminated orbital plane paths.
- **🎯 Dynamic Camera & Asset Locking:** Click-to-lock satellite tracking with smooth spherical coordinate camera interpolations, allowing users to ride along in orbit with any selected satellite.
- **⏱️ Time Dilation & Simulation Engine:** Built-in simulation clock supporting real-time (1x) up to accelerated speeds (1000x) and orbital scrubbing to project future orbital passes and ground conjunctions.
- **📊 Granular Telemetry Telemetry Inspector:** Side-panel drill-downs exposing NORAD ID, inclination angle, RAAN, period, altitude, velocity, eccentricity, and launch epochs.
- **🔍 Full Live Catalog Search:** Instant query across all 11,000+ satellites by name or NORAD catalog ID with immediate camera lock and orbital path propagation.

---

## 🛠️ Architecture & Tech Stack

| Layer | Technology | Rationale |
|---|---|---|
| **Framework** | Next.js 16 (App Router) + React 19 | Fast static prerendering, optimized client boundary routing, modern Turbopack bundling |
| **Graphics & 3D** | Three.js + WebGL Canvas | Direct hardware-accelerated 3D rendering with custom shaders, meshes, and camera controls |
| **Math & Physics** | Custom Keplerian Orbit Solver | Real-time conversion of NORAD TLE parameters into Earth-Centered Earth-Fixed (ECEF) and Earth-Centered Inertial (ECI) coordinate frames |
| **State Management** | Zustand | Zero-boilerplate, high-performance state store decoupling 60 FPS animation loops from React render cycles |
| **Styling & UI** | Tailwind CSS + Lucide Icons | Glassmorphic HUD overlay, telemetry meters, and sleek dark-mode radar aesthetics |
| **Language** | TypeScript (Strict Mode) | End-to-end type safety across orbital vectors, telemetry records, and scene graphs |

---

## 📐 System Architecture & Data Flow

```
   ┌───────────────────────────┐
   │ CelesTrak / NORAD Source  │
   └─────────────┬─────────────┘
                 │ Live TLE Stream
                 ▼
   ┌───────────────────────────┐
   │    TLE Parser Engine      │ ──> Categorization & Keplerian Constants
   └─────────────┬─────────────┘
                 │
                 ▼
   ┌───────────────────────────┐
   │  Zustand Telemetry Store  │ ──> Real-time State & Selected Entity
   └─────────────┬─────────────┘
                 │
        ┌────────┴────────┐
        ▼                 ▼
 ┌──────────────┐  ┌──────────────┐
 │ Three.js 3D  │  │ HUD Overlay  │
 │ Orbit Engine │  │ & Telemetry  │
 └──────────────┘  └──────────────┘
```

---

## 💻 Getting Started

### Prerequisites
- **Node.js**: v18.18.0 or higher
- **Package Manager**: `npm`, `pnpm`, or `yarn`

### Installation
```bash
# Clone the repository
git clone https://github.com/YousufJumani/space-radar.git

# Navigate to project directory
cd space-radar

# Install dependencies
npm install
```

### Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to explore the live 3D radar.

### Production Build
```bash
npm run build
npm run start
```

---

## 📈 Performance & Engineering Considerations

1. **Decoupled Animation Loop:** The orbital physics and Three.js render loop run independently of React's render lifecycle using `requestAnimationFrame`, guaranteeing silky-smooth 60 FPS even when rendering high-density constellations.
2. **Efficient Coordinate Transformations:** Orbit paths are rendered via lightweight buffer geometries, minimizing draw calls and GPU memory overhead.
3. **Resilient Network Fallback:** Automated retry mechanisms with verified live NORAD catalogs ensure instantaneous UI boot with zero disruption even during network connectivity issues.

---

## 👤 Author & Maintainer

**Yousuf Jumani**  
- GitHub: [@YousufJumani](https://github.com/YousufJumani)  
- Portfolio: [yousufjumani.github.io](https://yousufjumani.github.io)  

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).
