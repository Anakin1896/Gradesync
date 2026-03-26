import React, { useState } from 'react';
import Sidebar from './components/Sidebar';

function App() {

  const [activeTab, setActiveTab] = useState('Dashboard');

  return (

    <div className="flex h-screen bg-[#FCFBF8] font-sans"> 

      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-10">
          <h1 className="text-4xl font-serif font-bold text-gray-900">{activeTab}</h1>
          <p className="text-gray-500 mt-2">
            The {activeTab} content will be built here next!
          </p>
        </main>
      </div>

    </div>
  );
}

export default App;