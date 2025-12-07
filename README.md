# 🏠 Property Rental Dashboard

A premium, modern Property Rental Dashboard built with React, featuring advanced filtering, favorites management, and smooth animations. Perfect for browsing properties across Pakistan's prime locations.

![Property Dashboard](https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.17-38B2AC?style=for-the-badge&logo=tailwind-css)
![GSAP](https://img.shields.io/badge/GSAP-3.12.5-88CE02?style=for-the-badge&logo=greensock)

## ✨ Features

### Core Features ✅
- 📊 **View Property Listings** - Browse through curated properties in grid or list view
- 🔍 **Advanced Filtering** - Filter by price range, city, property type, and rating
- 🔎 **Real-time Search** - Instant search by property name or area
- ❤️ **Favorites Management** - Save favorites with localStorage persistence
- 🎨 **View Modes** - Switch between Grid and List views seamlessly
- 🌓 **Dark/Light Mode** - Toggle between themes with smooth transitions
- 📱 **Fully Responsive** - Optimized for mobile, tablet, and desktop
- 🎭 **Property Details Modal** - Rich property information with image gallery

### Premium Features 🌟
- 🗺️ **Map Section** - Static map placeholder showing property locations
- ✨ **GSAP Animations** - Smooth, professional animations on property cards
- ⏳ **Skeleton Loading States** - Beautiful loading placeholders
- 🎯 **Hero Section** - Engaging landing section with statistics
- 💜 **Modern UI/UX** - Premium design with purple accent theme
- 🎨 **Gradient Overlays** - Eye-catching visual effects
- 📊 **Property Statistics** - Quick overview of platform metrics

## 🛠️ Tech Stack

- **Frontend Framework:** React 19.2.0 (Vite)
- **Styling:** Tailwind CSS 4.1.17
- **Animations:** 
  - Framer Motion 12.23.25
  - GSAP 3.12.5
- **Routing:** React Router DOM 7.10.0
- **Icons:** React Icons 5.5.0
- **State Management:** React Context API
- **Data Storage:** localStorage (for favorites)

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd property-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

## 📁 Project Structure

```
property-dashboard/
├── src/
│   ├── components/
│   │   ├── DwelloLogo.jsx          # App logo component
│   │   ├── FilterBar.jsx            # Advanced filter controls
│   │   ├── HeroSection.jsx          # Landing hero banner
│   │   ├── MapSection.jsx           # Property map placeholder
│   │   ├── Navbar.jsx               # Main navigation
│   │   ├── PriceRange.jsx           # Custom dual-range slider
│   │   ├── PropertyCard.jsx         # Property card with GSAP
│   │   ├── PropertyModal.jsx        # Detailed property view
│   │   └── PropertySkeleton.jsx     # Loading placeholders
│   ├── context/
│   │   └── PropertyContext.jsx      # Global state management
│   ├── data/
│   │   └── properties.json          # Property data (no backend)
│   ├── App.jsx                      # Main app component
│   ├── main.jsx                     # Entry point
│   └── index.css                    # Global styles
├── public/                          # Static assets
├── package.json                     # Dependencies
├── vite.config.js                   # Vite configuration
├── tailwind.config.js               # Tailwind configuration
└── README.md                        # This file
```

## 🎯 Key Components

### FilterBar
- **Location Filter** - Dropdown of all available cities
- **Property Type Filter** - Apartment, House, Villa, etc.
- **Rating Filter** - Minimum rating threshold
- **Price Range Slider** - Continuous dual-range slider (no steps)
- **Reset Button** - Clear all filters
- **View Toggle** - Switch between grid/list layouts

### PropertyCard (with GSAP)
- Hover animations (scale, shadow, image zoom)
- Entrance animations
- Favorite toggle with heart icon
- Price tags with gradients
- Rating badges
- Property amenities (beds, baths, area)

### PropertyModal
- Full-screen property details
- Image gallery with thumbnails
- Contact agent buttons
- Favorite management
- Amenities breakdown
- ESC key to close

### PriceRange Component
- Custom dual-thumb slider
- Continuous value selection (no stepping)
- Text inputs with blur/Enter commit
- Fully responsive (no overflow)
- Dark mode support

## 🎨 Design Features

### Color Scheme
- **Primary:** Purple gradient (#8b5cf6 → #7c3aed)
- **Accent:** Indigo, Yellow (ratings)
- **Background:** Slate/Gray gradient
- **Dark Mode:** Full support with smooth transitions

### Animations
- **GSAP:** Entrance, hover, and interaction animations
- **Framer Motion:** Page transitions and layout shifts
- **Smooth Transitions:** All color/theme changes

### Responsive Breakpoints
- **Mobile:** < 768px (stacked layout)
- **Tablet:** 768px - 1024px (two-row layout)
- **Desktop:** 1024px+ (single-row layout)

## 📊 Data Structure

Properties are stored in `src/data/properties.json` with the following schema:

```json
{
  "id": 1,
  "name": "Property Name",
  "city": "Islamabad",
  "area": "Sector F-10",
  "price": 5000000,
  "beds": 3,
  "baths": 2,
  "size": "2000 sq.ft",
  "type": "Apartment",
  "isRented": false,
  "rating": 4.5,
  "description": "Property description...",
  "image": "https://...",
  "images": ["https://...", "https://..."]
}
```

## 🚀 Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

### Preview Production Build
```bash
npm run preview
```

## 🔧 Configuration

### Tailwind CSS
Custom configuration in `tailwind.config.js`:
- Custom colors (primary, dark, etc.)
- Extended spacing and shadows
- Dark mode support

### Vite
Configuration in `vite.config.js`:
- React plugin
- Fast refresh
- Optimized builds

## 🎓 Learning Outcomes

This project demonstrates:
- ✅ React Hooks (useState, useEffect, useContext, useRef, useMemo, useCallback)
- ✅ Context API for global state
- ✅ React Router for navigation
- ✅ LocalStorage for data persistence
- ✅ Framer Motion animations
- ✅ GSAP animations
- ✅ Tailwind CSS styling
- ✅ Responsive design patterns
- ✅ Component composition
- ✅ Performance optimization

## 📝 Future Enhancements

- [ ] Real backend API integration
- [ ] User authentication
- [ ] Property comparison feature
- [ ] Advanced search with autocomplete
- [ ] Real-time map integration (Google Maps/Mapbox)
- [ ] Property booking/inquiry system
- [ ] Review and rating system
- [ ] Admin dashboard for property management
- [ ] Email notifications
- [ ] Social media sharing

## 🐛 Known Issues

- Map section uses static placeholder (integration pending)
- Contact agent buttons use alerts (backend needed)

## 📄 License

This project is created for educational purposes.

## 👨‍💻 Author

Built with ❤️ by Waqas Afridi, a React developer passionate about creating premium user experiences.

## 🙏 Acknowledgments

- Property images from Pexels and Pixabay
- Icons from React Icons
- Animations powered by GSAP and Framer Motion
- UI inspiration from modern real estate platforms

---

**Happy Property Hunting! 🏡**
