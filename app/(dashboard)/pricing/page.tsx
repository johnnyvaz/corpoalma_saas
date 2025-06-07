
'use client';

import { Check } from 'lucide-react';
// import { Button } from '@/components/ui/button'; // Button não é mais usado diretamente para o submit
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SubmitButton } from './submit-button';
import { createCheckoutSession } from '@/lib/payments/actions';
import { useFormState } from 'react-dom';

interface PricingPageActionState {
  error?: string;
  message?: string; // Pode ser usado para mensagens de sucesso ou informativas
}

const initialState: PricingPageActionState = {
  // error e message serão undefined por padrão, o que é aceitável para campos opcionais
};

export default function PricingPage() {
  const [state, formAction] = useFormState<PricingPageActionState, FormData>(createCheckoutSession, initialState);
  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          Programa "Alimentando Corpo e Alma"
        </h1>
        <p className="text-xl text-muted-foreground">
          Transforme sua relação com a saúde através dos princípios bíblicos
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Program Details */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-2xl">O que você receberá</CardTitle>
            <CardDescription>
              Um programa completo de 5 semanas para transformar sua vida
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {[
                'Acesso ao eBook "Alimentando Corpo e Alma"',
                'Grupo exclusivo da comunidade',
                'Áudio diário com palavra de encorajamento',
                'Tarefas práticas personalizadas',
                'Acompanhamento de peso e progresso',
                'Área pessoal para testemunhos',
                'Comparação anônima com outros participantes',
                'Certificado de conclusão',
                'Suporte durante toda a jornada'
              ].map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pricing Card */}
        <Card className="border-2 border-primary">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Investimento</CardTitle>
            <CardDescription>
              Valor único para toda a transformação
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div>
              <div className="text-5xl font-bold text-primary">R$ 50</div>
              <div className="text-muted-foreground">pagamento único</div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                ✨ Sem mensalidades
              </p>
              <p className="text-sm text-muted-foreground">
                ✨ Acesso completo por 5 semanas
              </p>
              <p className="text-sm text-muted-foreground">
                ✨ Todos os materiais inclusos
              </p>
            </div>

            <form action={formAction}>
              <SubmitButton />
              {state?.error && <p className="text-sm text-red-500 mt-2 text-center">{state.error}</p>}
            </form>

            <div className="text-xs text-muted-foreground space-y-1">
              <p>💳 Pagamento seguro via Stripe</p>
              <p>🔒 Seus dados estão protegidos</p>
              <p>📱 Acesso imediato após o pagamento</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Program Structure */}
      <div className="mt-16">
        <h2 className="text-3xl font-bold text-center mb-8">
          Estrutura do Programa
        </h2>
        <div className="grid md:grid-cols-5 gap-4">
          {[
            {
              week: 1,
              title: 'Amor Próprio e o Templo do Espírito Santo',
              description: 'Compreendendo que nosso corpo é templo do Espírito Santo'
            },
            {
              week: 2,
              title: 'A Glutonaria e o Controle Emocional',
              description: 'Aprendendo a distinguir fome física de emocional'
            },
            {
              week: 3,
              title: 'Hidratação, Descanso e Espírito',
              description: 'A importância do descanso e hidratação'
            },
            {
              week: 4,
              title: 'Disciplina, Jejum e Exercício',
              description: 'Desenvolvendo disciplina através de práticas saudáveis'
            },
            {
              week: 5,
              title: 'Renovação da Mente e Perseverança',
              description: 'Renovando a mentalidade sobre saúde'
            }
          ].map((week) => (
            <Card key={week.week} className="text-center">
              <CardHeader>
                <div className="text-2xl font-bold text-primary mb-2">
                  Semana {week.week}
                </div>
                <CardTitle className="text-lg">{week.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {week.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Testimonials Placeholder */}
      <div className="mt-16 text-center">
        <h2 className="text-3xl font-bold mb-8">
          Depoimentos de Participantes
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              name: 'Maria Silva',
              text: 'Esse programa mudou completamente minha relação com a comida. Aprendi a enxergar meu corpo como templo do Espírito Santo.',
              lost: '5kg'
            },
            {
              name: 'João Santos',
              text: 'Mais do que perder peso, ganhei uma nova perspectiva sobre saúde e espiritualidade. Recomendo muito!',
              lost: '8kg'
            },
            {
              name: 'Ana Costa',
              text: 'As reflexões bíblicas diárias me fortaleceram não apenas fisicamente, mas espiritualmente também.',
              lost: '6kg'
            }
          ].map((testimonial, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <p className="text-sm italic mb-4">"{testimonial.text}"</p>
                <div className="font-medium">{testimonial.name}</div>
                <div className="text-sm text-green-600">Perdeu {testimonial.lost}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Final CTA */}
      <div className="mt-16 text-center bg-gradient-to-r from-purple-50 to-blue-50 p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">
          Pronto para transformar sua vida?
        </h2>
        <p className="text-muted-foreground mb-6">
          Inicie hoje mesmo sua jornada de 5 semanas rumo a uma vida mais saudável e equilibrada, 
          fundamentada nos princípios bíblicos.
        </p>
        <form action={formAction}>
          <SubmitButton />
          {state?.error && <p className="text-sm text-red-500 mt-2 text-center">{state.error}</p>}
        </form>
      </div>
    </div>
  );
}
