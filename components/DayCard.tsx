
import React from 'react';
import type { Meal } from '../types';

interface DayCardProps {
  meal: Meal;
}

const DayCard: React.FC<DayCardProps> = ({ meal }) => {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden h-full flex flex-col transition-transform duration-300 hover:scale-105 hover:shadow-cyan-500/50">
      <div className="relative">
        <img
          src={meal.imageUrl || 'https://picsum.photos/500'}
          alt={meal.mealName}
          className="w-full h-40 object-cover"
        />
        <div className="absolute top-0 right-0 bg-cyan-500 text-white font-bold px-3 py-1 rounded-bl-lg">
          {meal.day}
        </div>
      </div>
      <div className="p-4 flex-grow">
        <h3 className="text-md font-bold text-white text-center">{meal.mealName}</h3>
      </div>
    </div>
  );
};

export default DayCard;
