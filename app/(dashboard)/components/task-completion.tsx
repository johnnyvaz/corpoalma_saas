
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { markTaskCompleted } from '@/lib/db/queries';
import { useRouter } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';

interface TaskCompletionProps {
  userId: number;
  weekNumber: number;
  dayNumber: number;
  isCompleted: boolean;
}

export function TaskCompletion({ userId, weekNumber, dayNumber, isCompleted }: TaskCompletionProps) {
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      await markTaskCompleted(userId, weekNumber, dayNumber, notes);
      setNotes('');
      router.refresh();
    } catch (error) {
      console.error('Erro ao marcar tarefa como concluída:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isCompleted) {
    return (
      <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
        <CheckCircle2 className="h-5 w-5" />
        <span className="font-medium">Tarefa concluída! Parabéns! 🎉</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="notes">Reflexões sobre a tarefa (opcional)</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Compartilhe como foi sua experiência com esta tarefa..."
          rows={3}
        />
      </div>
      <Button onClick={handleComplete} disabled={isLoading} className="w-full">
        {isLoading ? 'Marcando...' : 'Marcar como Concluída'}
      </Button>
    </div>
  );
}
