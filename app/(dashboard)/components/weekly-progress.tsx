
import { UserProgress } from '@/lib/db/schema';
import { CheckCircle2, Circle } from 'lucide-react';

interface WeeklyProgressProps {
  userProgress: UserProgress[];
  currentWeek: number;
}

export function WeeklyProgress({ userProgress, currentWeek }: WeeklyProgressProps) {
  const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  
  return (
    <div className="grid grid-cols-7 gap-2">
      {days.map((day, index) => {
        const dayNumber = index + 1;
        const dayProgress = userProgress.find(p => p.dayNumber === dayNumber);
        const isCompleted = dayProgress?.completed || false;
        
        return (
          <div key={dayNumber} className="text-center">
            <div className="text-xs text-muted-foreground mb-1">{day}</div>
            <div className="flex justify-center">
              {isCompleted ? (
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              ) : (
                <Circle className="h-6 w-6 text-gray-300" />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
