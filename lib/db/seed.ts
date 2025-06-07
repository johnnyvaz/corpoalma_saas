
import { db } from './drizzle';
import { users, teams, teamMembers, weeklyThemes, dailyTasks } from './schema';
import bcrypt from 'bcryptjs';

async function seed() {
  const passwordHash = await bcrypt.hash('admin123', 10);

  // Create test user
  const [user] = await db.insert(users).values({
    email: 'test@test.com',
    passwordHash,
    name: 'Test User',
    programStartDate: new Date(),
    currentWeek: 1,
  }).returning();

  // Create test team
  const [team] = await db.insert(teams).values({
    name: 'Programa Alimentando Corpo e Alma',
  }).returning();

  // Add user to team
  await db.insert(teamMembers).values({
    teamId: team.id,
    userId: user.id,
    role: 'owner',
  });

  // Seed weekly themes (if not already present)
  const existingThemes = await db.select().from(weeklyThemes);
  if (existingThemes.length === 0) {
    await db.insert(weeklyThemes).values([
      {
        weekNumber: 1,
        title: 'Amor Próprio e o Templo do Espírito Santo',
        description: 'Compreendendo que nosso corpo é templo do Espírito Santo e merece cuidado e respeito.',
        bibleVerse: '1 Coríntios 6:19 - Ou não sabeis que o nosso corpo é o templo do Espírito Santo, que habita em vós?'
      },
      {
        weekNumber: 2,
        title: 'A Glutonaria e o Controle Emocional',
        description: 'Aprendendo a distinguir entre fome física e emocional, desenvolvendo autocontrole.',
        bibleVerse: 'Provérbios 25:28 - Como a cidade derrubada, que não tem muros, assim é o homem que não pode conter o seu espírito.'
      },
      {
        weekNumber: 3,
        title: 'Hidratação, Descanso e Espírito',
        description: 'A importância do descanso e hidratação para o bem-estar físico e espiritual.',
        bibleVerse: 'Salmos 23:2 - Deitar-me faz em verdes pastos, guia-me mansamente a águas tranquilas.'
      },
      {
        weekNumber: 4,
        title: 'Disciplina, Jejum e Exercício',
        description: 'Desenvolvendo disciplina através do jejum e exercícios físicos como forma de adoração.',
        bibleVerse: '1 Coríntios 9:27 - Antes subjugo o meu corpo, e o reduzo à servidão, para que, pregando aos outros, eu mesmo não venha de alguma maneira a ficar reprovado.'
      },
      {
        weekNumber: 5,
        title: 'Renovação da Mente e Perseverança',
        description: 'Renovando nossa mentalidade sobre saúde e mantendo a perseverança na jornada.',
        bibleVerse: 'Romanos 12:2 - E não sede conformados com este mundo, mas sede transformados pela renovação do vosso entendimento.'
      }
    ]);
  }

  // Seed some daily tasks
  const existingTasks = await db.select().from(dailyTasks);
  if (existingTasks.length === 0) {
    const tasks = [
      // Week 1 tasks
      { weekNumber: 1, dayNumber: 1, title: 'Reflexão sobre o Templo', description: 'Degustar lentamente um quadrado de chocolate por 15 minutos, refletindo sobre como Deus nos criou para desfrutar de Suas bênçãos com moderação.', audioUrl: null },
      { weekNumber: 1, dayNumber: 2, title: 'Salada Colorida', description: 'Comer uma salada colorida com atenção plena, sem distrações, agradecendo a Deus por cada cor e sabor.', audioUrl: null },
      { weekNumber: 1, dayNumber: 3, title: 'Águas Vivas', description: 'Beber 2L de água no dia e refletir sobre João 4:14 - a água viva que Jesus oferece.', audioUrl: null },
      { weekNumber: 1, dayNumber: 4, title: 'Caminhada de Louvor', description: 'Fazer uma caminhada de 20 minutos ouvindo louvores e agradecendo a Deus pela capacidade de se mover.', audioUrl: null },
      { weekNumber: 1, dayNumber: 5, title: 'Mindful Eating', description: 'Comer com talheres menores e perceber o tempo da refeição, praticando a gratidão por cada alimento.', audioUrl: null },
      { weekNumber: 1, dayNumber: 6, title: 'Jejum de Reflexão', description: 'Jejuar por 12h e anotar como se sentiu espiritualmente durante esse período.', audioUrl: null },
      { weekNumber: 1, dayNumber: 7, title: 'Troca Consciente', description: 'Trocar um alimento processado por um natural e agradecer a Deus por essa escolha saudável.', audioUrl: null },

      // Week 2 tasks
      { weekNumber: 2, dayNumber: 1, title: 'Mesa da Gratidão', description: 'Sentar à mesa, orar e saborear cada alimento com gratidão, praticando o controle emocional.', audioUrl: null },
      { weekNumber: 2, dayNumber: 2, title: 'Regra dos 80%', description: 'Comer apenas até 80% da saciedade e registrar os sentimentos que surgem.', audioUrl: null },
      { weekNumber: 2, dayNumber: 3, title: 'Meditação Noturna', description: 'Ouvir um salmo antes de dormir e meditar por 5 minutos sobre o controle emocional.', audioUrl: null },
      { weekNumber: 2, dayNumber: 4, title: 'Bebida Saudável', description: 'Trocar refrigerante por água com limão durante todo o dia, refletindo sobre escolhas conscientes.', audioUrl: null },
      { weekNumber: 2, dayNumber: 5, title: 'Pesagem sem Julgamento', description: 'Registrar seu peso sem julgamento, mas com fé na mudança que Deus está operando.', audioUrl: null },
      { weekNumber: 2, dayNumber: 6, title: 'Compartilhando a Palavra', description: 'Compartilhar um versículo com alguém do grupo sobre autocontrole e encorajamento.', audioUrl: null },
      { weekNumber: 2, dayNumber: 7, title: 'Novo Sabor', description: 'Experimentar um alimento saudável que você geralmente rejeita, orando antes por abertura.', audioUrl: null },

      // Week 3 tasks  
      { weekNumber: 3, dayNumber: 1, title: 'Compromisso Corporal', description: 'Refletir sobre 1 Coríntios 6:19 e escrever um compromisso pessoal com o cuidado do corpo.', audioUrl: null },
      { weekNumber: 3, dayNumber: 2, title: 'Ato de Amor', description: 'Preparar uma refeição saudável para alguém como ato de amor e serviço cristão.', audioUrl: null },
      { weekNumber: 3, dayNumber: 3, title: 'Exercício de Gratidão', description: 'Fazer 10 minutos de exercício físico e agradecer pela capacidade de se mover que Deus nos deu.', audioUrl: null },
      { weekNumber: 3, dayNumber: 4, title: 'Descanso Sagrado', description: 'Dormir 8h e deixar o celular longe da cama, honrando o descanso como ordenança divina.', audioUrl: null },
      { weekNumber: 3, dayNumber: 5, title: 'Testemunho Semanal', description: 'Escrever um testemunho da semana em sua área do usuário sobre as mudanças percebidas.', audioUrl: null },
      { weekNumber: 3, dayNumber: 6, title: 'Visualização de Fé', description: 'Visualizar sua melhor versão e orar por força para alcançá-la conforme o plano de Deus.', audioUrl: null },
      { weekNumber: 3, dayNumber: 7, title: 'Café da Manhã Sagrado', description: 'Tomar um café da manhã equilibrado sem distrações, consagrando o início do dia ao Senhor.', audioUrl: null },
    ];

    await db.insert(dailyTasks).values(tasks);
  }

  console.log('Seed completed successfully!');
}

seed().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
