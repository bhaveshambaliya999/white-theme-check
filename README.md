# Uomo Next.js E-commerce

A modern e-commerce application built with Next.js, featuring a complete shopping experience with cart, wishlist, user authentication, and responsive design.

## Features

- 🛍️ Complete e-commerce functionality
- 🛒 Shopping cart and wishlist
- 👤 User authentication and dashboard
- 📱 Responsive design for all devices
- 🎨 Modern UI with Material-UI components
- 🔍 Product search and filtering
- 📦 Order management
- 🎯 SEO optimized

## Tech Stack

- **Framework:** Next.js 14 with App Router
- **Styling:** SCSS, Bootstrap, Material-UI
- **State Management:** Redux Toolkit with Redux Persist
- **HTTP Client:** Axios
- **Image Optimization:** Next.js Image component
- **Maps:** Google Maps API
- **Carousel:** Swiper.js
- **Icons:** Custom SVG components

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
\`\`\`bash
git clone <repository-url>
cd uomo-nextjs
\`\`\`

2. Install dependencies
\`\`\`bash
npm install
# or
yarn install
\`\`\`

3. Set up environment variables
\`\`\`bash
cp .env.example .env.local
\`\`\`

4. Run the development server
\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables

Create a `.env.local` file in the root directory:

\`\`\`env
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_BASE_URL_1=https://api.example.com
NEXT_PUBLIC_BASE_URL_2=https://api2.example.com
NEXT_PUBLIC_IMAGE_URL=https://images.example.com
NEXT_PUBLIC_DOMAIN=localhost:3000
\`\`\`

## Project Structure

\`\`\`
├── app/                    # Next.js App Router pages
├── components/            # Reusable React components
├── context/              # React Context providers
├── lib/                  # Utility functions and services
├── Redux/               # Redux store, actions, and reducers
├── public/              # Static assets
├── styles/              # Global styles and SCSS files
└── types/               # TypeScript type definitions
\`\`\`

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Deployment

The easiest way to deploy is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables
4. Deploy!

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
