import { getRecipeByID } from '@/lib/dynamo';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) {
    return new Response(JSON.stringify({ error: 'Missing ID' }), { status: 400 });
  }

  try {
    const recipe = await getRecipeByID(id, session.user.email);
    if (!recipe) {
      return new Response(JSON.stringify({ error: 'Recipe not found' }), { status: 404 });
    }
    return new Response(JSON.stringify({ recipe }), { status: 200 });
  } catch (err) {
    console.error('Fetch recipe by ID error:', err);
    return new Response(JSON.stringify({ error: 'Failed to fetch recipe' }), { status: 500 });
  }
}