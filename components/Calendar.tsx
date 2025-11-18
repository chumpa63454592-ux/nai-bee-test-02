
import React from 'react';
import DayCard from './DayCard';
import type { MealPlan } from '../types';

interface CalendarProps {
  mealPlan: MealPlan;
}

const WEEK_DAYS = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];

// November 2024 starts on a Friday (index 5)
const getStartDayOffset = () => 5;

const Calendar: React.FC<CalendarProps> = ({ mealPlan }) => {
  const offset = getStartDayOffset();
  const emptyCells = Array.from({ length: offset }, (_, i) => <div key={`empty-${i}`} className="hidden md:block border-r border-b border-gray-700"></div>);

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 md:grid-cols-7 gap-2 text-center font-bold text-cyan-400 mb-2">
        {WEEK_DAYS.map(day => (
          <div key={day} className="py-2">{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
        {emptyCells}
        {mealPlan.map((meal) => (
          <DayCard key={meal.day} meal={meal} />
        ))}
      </div>
    </div>
  );
};

export default Calendar;
