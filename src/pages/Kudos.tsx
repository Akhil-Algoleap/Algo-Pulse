import React from 'react';
import { Button } from '../components/UI';

export const Kudos: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <div className="w-4 h-6 bg-blue-400 rounded-sm" />
        <h1 className="text-xl font-bold text-slate-800">Kudos</h1>
      </div>
      
      <div className="border-b border-slate-200">
        <div className="flex gap-8 px-4">
          <button className="text-blue-600 border-b-2 border-blue-600 pb-3 text-sm font-medium">Received</button>
          <button className="text-slate-500 hover:text-slate-700 pb-3 text-sm font-medium">Given</button>
        </div>
      </div>
      
      <div className="flex flex-col items-center justify-center pt-16">
        <div className="w-48 h-48 bg-orange-100 rounded-full flex items-center justify-center relative mb-6">
           <span className="text-8xl">👍</span>
           <span className="absolute -top-4 -right-4 text-6xl drop-shadow-xl text-blue-500">★</span>
        </div>
        <h2 className="text-lg font-bold text-slate-800 mb-2">Get going!</h2>
        <p className="text-sm text-slate-500 mb-6">All the Kudos you have received will appear here.</p>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 rounded-lg shadow-md shadow-blue-200">
          Go to Engage
        </Button>
      </div>
    </div>
  );
};
