import { withAuth } from "next-auth/middleware";
import { NextResponse } from 'next/server';

// Create a custom middleware function that handles the index.html redirect
function redirectIndexHtml(request) {
  const url = request.nextUrl.clone();

  // If the path ends with /index.html, redirect to the path without it
  if (url.pathname.endsWith('/index.html')) {
    url.pathname = url.pathname.replace('/index.html', '/');
    return NextResponse.redirect(url);
  }

  return null; // Continue to the next middleware
}

// Combine the custom middleware with withAuth
export default function middleware(request) {
  // Skip middleware for health checks from the load balancer
  if (request.nextUrl.pathname === '/') {
    console.log('Health check detected, skipping middleware');
    return NextResponse.next();
  }

  // First check for index.html redirect
  const redirectResponse = redirectIndexHtml(request);
  if (redirectResponse) return redirectResponse;

  // For protected routes, apply authentication
  const protectedPaths = ['/enterIngredients', '/viewsavedrecipes'];
  const path = request.nextUrl.pathname;

  if (protectedPaths.some(protectedPath => path.startsWith(protectedPath))) {
    return withAuth({
      pages: {
        signIn: '/', // Redirect to landing page if not authenticated
      },
    })(request);
  }

  // For other routes, continue
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Include protected routes
    '/enterIngredients',
    '/viewsavedrecipes',
    // Also match all paths that might end with index.html
    '/:path*'
  ]
};
