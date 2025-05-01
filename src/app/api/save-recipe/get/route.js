import { getSavedRecipesByUser } from '@/lib/dynamo';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(req) {
  const session = await getServerSession(authOptions); // for app router

  if (!session || !session.user?.email) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const recipes = await getSavedRecipesByUser(session.user.email);
    return new Response(JSON.stringify({ recipes }), { status: 200 });
  } catch (err) {
    console.error("Error fetching recipes:", err);
    return new Response(JSON.stringify({ error: 'Failed to fetch recipes' }), { status: 500 });
  }
}