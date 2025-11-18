
import React, { useState, useEffect, useCallback } from 'react';
import Calendar from './components/Calendar';
import Header from './components/Header';
import LoadingSpinner from './components/LoadingSpinner';
import { generateNovemberMealPlan, generateMealImage } from './services/geminiService';
import type { MealPlan } from './types';

const App: React.FC = () => {
  const [mealPlan, setMealPlan] = useState<MealPlan>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [progressMessage, setProgressMessage] = useState<string>('กำลังเตรียมการ...');

  const fetchAndProcessMealPlan = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      setProgressMessage('กำลังสร้างแผนเมนูอาหารเดือนพฤศจิกายน...');
      const initialPlan = await generateNovemberMealPlan();
      
      if (!initialPlan || initialPlan.length === 0) {
        throw new Error("Failed to generate a valid meal plan.");
      }
      
      // Initialize plan without images
      setMealPlan(initialPlan);

      // Sequentially generate images and update state
      const updatedPlan = [...initialPlan];
      for (let i = 0; i < updatedPlan.length; i++) {
        setProgressMessage(`กำลังสร้างภาพเมนูวันที่ ${i + 1} จาก ${updatedPlan.length}...`);
        const imageUrl = await generateMealImage(updatedPlan[i].imagePrompt);
        updatedPlan[i] = { ...updatedPlan[i], imageUrl };
        
        // Update state with the new image to show progress visually
        setMealPlan([...updatedPlan]);
      }

    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดที่ไม่รู้จัก';
      setError(`ไม่สามารถสร้างตารางอาหารได้: ${errorMessage}`);
    } finally {
      setIsLoading(false);
      setProgressMessage('สร้างตารางอาหารสำเร็จ!');
    }
  }, []);

  useEffect(() => {
    fetchAndProcessMealPlan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex-grow flex items-center justify-center">
            <LoadingSpinner message={progressMessage} />
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex-grow flex items-center justify-center text-center text-red-400 bg-red-900/20 p-8 rounded-lg">
          <div>
            <h2 className="text-2xl font-bold mb-4">เกิดข้อผิดพลาด</h2>
            <p>{error}</p>
            <button
                onClick={() => fetchAndProcessMealPlan()}
                className="mt-6 bg-cyan-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-cyan-600 transition-colors"
            >
                ลองอีกครั้ง
            </button>
          </div>
        </div>
      );
    }
    
    if (mealPlan.length > 0) {
      return <Calendar mealPlan={mealPlan} />;
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 md:p-8 flex flex-col">
      <Header />
      <main className="container mx-auto flex-grow flex flex-col">
        {renderContent()}
      </main>
      <footer className="text-center text-gray-500 text-sm mt-8">
        <p>Powered by Google Gemini API</p>
      </footer>
    </div>
  );
};

export default App;
