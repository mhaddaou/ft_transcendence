import { useEffect, useState } from 'react';

const MyPage = () => {
  const [isPageReloaded, setIsPageReloaded] = useState(false);

  useEffect(() => {
    if (window.performance && window.performance.navigation.type === 1) {
      setIsPageReloaded(true);
    }
  }, []);

  return (
    <div className='min-h-screen w-screen bg-slate-400'>
      {isPageReloaded ? (
        <h1>Page has been reloaded</h1>
      ) : (
        <h1>Page has not been reloaded</h1>
      )}
      {/* Rest of your page content */}
    </div>
  );
};

export default MyPage;
