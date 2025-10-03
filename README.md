# AUTOHUB - Modern Car Marketplace

A clean, modern car marketplace website built with Next.js, TypeScript, and Tailwind CSS. Features a beautiful home page, advanced search functionality, and detailed car listings.

## Features

- 🏠 **Home Page**: Beautiful hero section with search functionality and featured cars
- 🔍 **Search Results**: Advanced filtering with make, model, year, price, and transmission options
- 🚗 **Car Details**: Detailed car pages with image galleries, specifications, and similar vehicles
- 📱 **Responsive Design**: Mobile-first approach with Tailwind CSS
- 🎨 **Modern UI**: Clean, professional design with smooth animations
- ⚡ **Fast Performance**: Built with Next.js 14 and optimized for speed
- 🖼️ **Image Gallery**: Interactive car image galleries with thumbnails
- 🔗 **Smart Navigation**: Seamless routing between pages

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3.3.0
- **Icons**: React Icons
- **Images**: Unsplash for demo images

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd sbt-japan-clone
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/
│   ├── globals.css          # Tailwind CSS imports
│   ├── layout.tsx           # Root layout
│   ├── page.tsx            # Home page
│   ├── search/
│   │   └── page.tsx        # Search results page
│   └── cars/
│       └── [id]/
│           └── page.tsx    # Car details page
├── components/
│   ├── Header.tsx          # Navigation header
│   ├── Footer.tsx          # Site footer
│   ├── HeroSection.tsx     # Hero section with search
│   ├── FeaturedCars.tsx    # Featured cars grid
│   ├── FeaturesSection.tsx # Features showcase
│   ├── SearchResults.tsx   # Search results with filters
│   └── CarDetails.tsx     # Car details page
├── tailwind.config.js      # Tailwind configuration
├── postcss.config.js       # PostCSS configuration
├── package.json
├── next.config.js
└── tsconfig.json
```

## Key Components

### Home Page
- **Hero Section**: Beautiful background image with search overlay
- **Featured Cars**: Grid of popular cars with images and details
- **Features**: Three-column feature showcase

### Search Results Page
- **Filters Sidebar**: Make, year, price range, transmission, fuel type
- **Search Bar**: Real-time search functionality
- **Car Grid**: Responsive grid layout with car cards
- **Pagination**: Navigation between result pages

### Car Details Page
- **Image Gallery**: Main image with thumbnail navigation
- **Specifications**: Detailed car specs in organized layout
- **Description**: Car description and details
- **Similar Vehicles**: Related car recommendations
- **Action Buttons**: Quote request and contact options

## Customization

### Styling
The project uses Tailwind CSS with custom configuration:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        }
      }
    },
  },
}
```

### Adding New Car Data
Update the car data in the respective components:

```typescript
// In components/FeaturedCars.tsx or components/SearchResults.tsx
const cars = [
  {
    id: 1,
    make: 'Honda',
    model: 'Civic',
    year: 2016,
    mileage: '2140 miles',
    price: '$12,500',
    image: 'https://example.com/image.jpg'
  }
  // Add new cars here
]
```

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- DigitalOcean App Platform
- Railway

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for educational purposes. Please respect the original SBT Japan website's terms of use.

## Acknowledgments

- Inspired by [SBT Japan](https://www.sbtjapan.com/)
- Built with Next.js and Bootstrap
- Icons by React Icons
