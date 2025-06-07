import { getUser } from '@/lib/db/queries';

export async function GET() {
  const user = await getUser(''); //TODO: ERRO, PRECISA CORRIGIR
  return Response.json(user);
}
