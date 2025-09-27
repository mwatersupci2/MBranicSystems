# Twisted Torus Visualization Website

A Next.js website featuring an interactive 3D Möbius Torus vector field visualization.

## Features

- **Landing Page**: Beautiful hero section with gradient background
- **Interactive Visualization**: 3D Möbius torus with point-energy dynamics
- **Real-time Controls**: Adjust vibration, twist, and toggle visual elements
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Built with Tailwind CSS and Next.js

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

This project is configured for deployment on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Landing page
│   └── visualization/     # Visualization page
├── components/            # React components
│   ├── Navigation.tsx     # Top navigation bar
│   └── TwistedCenterTorusVectorField.tsx  # Main visualization
└── ...config files
```

## Technologies Used

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type safety
- **Tailwind CSS**: Utility-first CSS framework
- **Canvas API**: For the 3D visualization rendering

## License

This project is open source and available under the [MIT License](LICENSE).

