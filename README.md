# Recipe AI Finder

Recipe AI Finder is a Next.js application that helps users find recipes based on ingredients they have available. The application uses OpenAI to generate recipe suggestions and is deployed on AWS infrastructure.

## Features

- Search for recipes based on available ingredients
- View detailed recipe instructions
- Save favorite recipes
- User authentication
- Responsive design for mobile and desktop

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Next.js API routes
- **Authentication**: NextAuth.js
- **AI**: OpenAI API
- **Infrastructure**: AWS (EC2, ALB, Auto Scaling, Route 53, ACM)
- **IaC**: Terraform

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- AWS account (for deployment)
- OpenAI API key

### Local Development

1. Clone the repository:

```bash
git clone https://github.com/yourusername/recipe-ai-finder.git
cd recipe-ai-finder
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file with the required environment variables:

```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret
OPENAI_API_KEY=your-openai-api-key
```

4. Start the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

The application is deployed on AWS using Terraform. See the [infrastructure README](./infrastructure/README.md) for detailed deployment instructions.

## Project Structure

- `/src/app`: Next.js app router pages and API routes
- `/src/components`: React components
- `/src/lib`: Utility functions and API clients
- `/public`: Static assets
- `/infrastructure`: Terraform configuration for AWS deployment

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
