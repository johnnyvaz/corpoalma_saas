
import { getCurrentUser } from '@/lib/auth/session';
import { getWeeklyTheme, getDailyTask, getUserProgress, getLatestWeight } from '@/lib/db/queries';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { WeightTracker } from './components/weight-tracker';
import { TaskCompletion } from './components/task-completion';
import { WeeklyProgress } from './components/weekly-progress';
import Link from 'next/link';

export default async function HomePage() {
  const user = await getCurrentUser();
  
  if (!user) {
    // Show landing page for non-authenticated users
    return (
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 py-20">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Alimentando Corpo e Alma
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Transforme sua relação com a saúde através de um programa de 5 semanas 
              baseado nos princípios bíblicos de cuidado integral.
            </p>
            <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
              <Link href="/sign-up">
                <Button size="lg" className="text-lg px-8 py-3">
                  Começar Minha Jornada - R$ 50
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                  Saber Mais
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Um Programa Diferente</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Não é apenas uma dieta ou programa de exercícios. É uma jornada de transformação 
                que integra corpo, alma e espírito conforme os ensinamentos bíblicos.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardHeader className="text-center">
                  <div className="text-4xl mb-4">📖</div>
                  <CardTitle>Base Bíblica</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p>Cada semana é fundamentada em princípios bíblicos sólidos sobre cuidado do corpo como templo do Espírito Santo.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <div className="text-4xl mb-4">🎯</div>
                  <CardTitle>Tarefas Práticas</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p>Atividades diárias que conectam teoria e prática, promovendo mudanças reais e duradouras.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <div className="text-4xl mb-4">👥</div>
                  <CardTitle>Comunidade</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p>Participe de um grupo exclusivo onde você pode compartilhar experiências e receber encorajamento.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Program Structure */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              5 Semanas de Transformação
            </h2>
            
            <div className="space-y-8">
              {[
                {
                  week: 1,
                  title: 'Amor Próprio e o Templo do Espírito Santo',
                  verse: '1 Coríntios 6:19',
                  description: 'Compreendendo que nosso corpo é templo do Espírito Santo e merece cuidado e respeito.',
                  color: 'from-purple-500 to-purple-600'
                },
                {
                  week: 2,
                  title: 'A Glutonaria e o Controle Emocional',
                  verse: 'Provérbios 25:28',
                  description: 'Aprendendo a distinguir entre fome física e emocional, desenvolvendo autocontrole.',
                  color: 'from-blue-500 to-blue-600'
                },
                {
                  week: 3,
                  title: 'Hidratação, Descanso e Espírito',
                  verse: 'Salmos 23:2',
                  description: 'A importância do descanso e hidratação para o bem-estar físico e espiritual.',
                  color: 'from-green-500 to-green-600'
                },
                {
                  week: 4,
                  title: 'Disciplina, Jejum e Exercício',
                  verse: '1 Coríntios 9:27',
                  description: 'Desenvolvendo disciplina através do jejum e exercícios físicos como forma de adoração.',
                  color: 'from-yellow-500 to-orange-600'
                },
                {
                  week: 5,
                  title: 'Renovação da Mente e Perseverança',
                  verse: 'Romanos 12:2',
                  description: 'Renovando nossa mentalidade sobre saúde e mantendo a perseverança na jornada.',
                  color: 'from-red-500 to-pink-600'
                }
              ].map((week) => (
                <Card key={week.week} className="overflow-hidden">
                  <div className="flex">
                    <div className={`w-4 bg-gradient-to-b ${week.color}`}></div>
                    <CardContent className="flex-1 p-6">
                      <div className="flex items-start gap-6">
                        <div className="text-center">
                          <div className={`text-3xl font-bold bg-gradient-to-br ${week.color} bg-clip-text text-transparent`}>
                            {week.week}
                          </div>
                          <div className="text-sm text-gray-500">SEMANA</div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-2">{week.title}</h3>
                          <p className="text-gray-600 mb-3">{week.description}</p>
                          <div className="text-sm text-blue-600 font-medium">
                            📖 Baseado em {week.verse}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* What's Included */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              O que está incluído
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: '📚', title: 'eBook Completo', desc: 'Guia digital "Alimentando Corpo e Alma"' },
                { icon: '🎵', title: 'Áudios Diários', desc: 'Palavra de encorajamento para cada dia' },
                { icon: '✅', title: 'Tarefas Práticas', desc: '35 atividades transformadoras' },
                { icon: '💬', title: 'Grupo Exclusivo', desc: 'Comunidade de apoio e encorajamento' },
                { icon: '📊', title: 'Acompanhamento', desc: 'Ferramentas para monitorar progresso' },
                { icon: '🏆', title: 'Certificado', desc: 'Reconhecimento por completar o programa' },
                { icon: '📱', title: 'Acesso Digital', desc: 'Plataforma online personalizada' },
                { icon: '🙏', title: 'Suporte', desc: 'Acompanhamento durante toda jornada' }
              ].map((item, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="pt-6">
                    <div className="text-3xl mb-3">{item.icon}</div>
                    <h3 className="font-bold mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-6">
              Comece Sua Transformação Hoje
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Por apenas R$ 50, você terá acesso a um programa completo que pode 
              transformar sua vida para sempre.
            </p>
            <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
              <Link href="/sign-up">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                  Quero Participar Agora
                </Button>
              </Link>
            </div>
            <p className="text-sm mt-6 opacity-75">
              ✨ Acesso imediato • 💳 Pagamento seguro • 🔒 Dados protegidos
            </p>
          </div>
        </section>
      </div>
    );
  }

  // Show dashboard for authenticated users
  const currentWeek = user.currentWeek || 1;
  const currentDay = Math.floor((Date.now() - new Date(user.programStartDate || Date.now()).getTime()) / (1000 * 60 * 60 * 24)) % 7 + 1;
  
  const weeklyTheme = await getWeeklyTheme(currentWeek);
  const dailyTask = await getDailyTask(currentWeek, Math.min(currentDay, 7));
  const userProgress = await getUserProgress(user.id, currentWeek);
  const latestWeight = await getLatestWeight(user.id);

  const completedTasks = userProgress.filter(p => p.completed).length;
  const totalTasks = 7; // 7 days per week
  const weekProgress = (completedTasks / totalTasks) * 100;

  const programStartDate = user.programStartDate ? new Date(user.programStartDate) : new Date();
  const daysSinceStart = Math.floor((Date.now() - programStartDate.getTime()) / (1000 * 60 * 60 * 24));
  const totalProgramDays = 35; // 5 weeks * 7 days
  const overallProgress = Math.min((daysSinceStart / totalProgramDays) * 100, 100);

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Olá, {user.name}! 🙏</h1>
        <p className="text-muted-foreground">
          Bem-vindo(a) ao programa "Alimentando Corpo e Alma" - Semana {currentWeek} de 5
        </p>
      </div>

      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Progresso Geral do Programa</CardTitle>
          <CardDescription>
            Sua jornada de transformação começou em {programStartDate.toLocaleDateString('pt-BR')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progresso</span>
              <span>{Math.round(overallProgress)}%</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
            <p className="text-sm text-muted-foreground">
              Dia {daysSinceStart + 1} de {totalProgramDays}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Current Week Theme */}
      {weeklyTheme && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📖 Tema da Semana {currentWeek}
            </CardTitle>
            <CardDescription>{weeklyTheme.title}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>{weeklyTheme.description}</p>
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
              <p className="font-medium text-blue-900">Versículo da Semana:</p>
              <p className="text-blue-800 italic">{weeklyTheme.bibleVerse}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Today's Task */}
        {dailyTask && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                ✅ Tarefa de Hoje (Dia {Math.min(currentDay, 7)})
              </CardTitle>
              <CardDescription>{dailyTask.title}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>{dailyTask.description}</p>
              {dailyTask.audioUrl && (
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-green-900 mb-2">🎵 Áudio do Dia:</p>
                  <audio controls className="w-full">
                    <source src={dailyTask.audioUrl} type="audio/mpeg" />
                    Seu navegador não suporta o elemento de áudio.
                  </audio>
                </div>
              )}
              <TaskCompletion 
                userId={user.id}
                weekNumber={currentWeek}
                dayNumber={Math.min(currentDay, 7)}
                isCompleted={userProgress.find(p => p.dayNumber === Math.min(currentDay, 7))?.completed || false}
              />
            </CardContent>
          </Card>
        )}

        {/* Weekly Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Progresso da Semana {currentWeek}</CardTitle>
            <CardDescription>Tarefas concluídas nesta semana</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Tarefas Completas</span>
                <span>{completedTasks} de {totalTasks}</span>
              </div>
              <Progress value={weekProgress} className="h-2" />
              <WeeklyProgress 
                userProgress={userProgress}
                currentWeek={currentWeek}
              />
            </div>
          </CardContent>
        </Card>

        {/* Weight Tracking */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              ⚖️ Acompanhamento de Peso
            </CardTitle>
            <CardDescription>
              {latestWeight 
                ? `Último registro: ${latestWeight.weight}kg em ${new Date(latestWeight.recordedAt).toLocaleDateString('pt-BR')}`
                : 'Nenhum peso registrado ainda'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <WeightTracker userId={user.id} currentWeek={currentWeek} />
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>Ferramentas úteis para sua jornada</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              📝 Escrever Testemunho
            </Button>
            <Button variant="outline" className="w-full justify-start">
              📊 Ver Histórico Completo
            </Button>
            <Button variant="outline" className="w-full justify-start">
              💬 Acessar Grupo da Comunidade
            </Button>
            <Button variant="outline" className="w-full justify-start">
              📖 Download do eBook
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Motivational Quote */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <p className="text-lg font-medium text-purple-900">
              "Tudo posso naquele que me fortalece."
            </p>
            <p className="text-purple-700">Filipenses 4:13</p>
            <p className="text-sm text-purple-600">
              Continue firme em sua jornada de transformação! Deus está com você a cada passo. 💪✨
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
