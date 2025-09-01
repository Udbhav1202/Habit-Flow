import React from 'react';

function Home() {
  return (
    <div className="flex flex-col items-center justify-center text-center" style={{ height: 'calc(100vh - 100px)' }}>
      <h1 className="text-5xl font-bold mb-4">Welcome to HabitFlow</h1>
      <p className="text-xl text-gray-600">Please login to start managing your tasks!</p>
    </div>
  );
}

export default Home;
