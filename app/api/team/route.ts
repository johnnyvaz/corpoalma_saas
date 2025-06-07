import { getTeamForUser, getUser } from '@/lib/db/queries';
import { User } from '@/lib/db/schema';

export async function GET() {
  // TODO: Idealmente, o usuário viria da sessão/middleware de autenticação
  // Esta é uma forma de obter o usuário, mas pode precisar de ajuste
  // dependendo de como a autenticação está configurada para as API routes.
  // Se houver um helper de sessão (ex: getServerSession), seria melhor usá-lo.
  const user = await getUser(''); // TODO: ERRO, PRECISA CORRIGIR

  if (!user) {
    return Response.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const team = await getTeamForUser(user.id);
  return Response.json(team);
}
