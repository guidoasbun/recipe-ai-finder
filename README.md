# Recipe AI Finder
[https://www.recipe-ai-finder.com](https://recipe-ai-finder.com/)


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

![infrastructure](/public/infrastructure.png "Optional title")

## Getting Started
Go to the website
- [https://www.recipe-ai-finder.com](https://recipe-ai-finder.com/)



## Local Development

### Prerequisites

- Node.js 18+ and npm
- AWS account (for deployment)
- OpenAI API key

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

