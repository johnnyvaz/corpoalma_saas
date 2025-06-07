
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { addWeightRecord } from '@/lib/db/queries';
import { useRouter } from 'next/navigation';

interface WeightTrackerProps {
  userId: number;
  currentWeek: number;
}

export function WeightTracker({ userId, currentWeek }: WeightTrackerProps) {
  const [weight, setWeight] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!weight || isLoading) return;

    setIsLoading(true);
    try {
      await addWeightRecord(userId, parseFloat(weight), currentWeek);
      setWeight('');
      router.refresh();
    } catch (error) {
      console.error('Erro ao registrar peso:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="weight">Peso atual (kg)</Label>
        <Input
          id="weight"
          type="number"
          step="0.1"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="Ex: 70.5"
          required
        />
      </div>
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Registrando...' : 'Registrar Peso'}
      </Button>
    </form>
  );
}
