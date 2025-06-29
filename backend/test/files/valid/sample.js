// Sample JavaScript file for testing
import React from 'react';
import { useState, useEffect } from 'react';

export const SampleComponent = () => {
  const [count, setCount] = useState(0);
  
  // TODO: Add prop validation
  useEffect(() => {
    console.log('Component mounted');
  }, []);
  
  function handleClick() {
    setCount(prev => prev + 1);
  }
  
  return (
    <div onClick={handleClick}>
      Count: {count}
    </div>
  );
};

export default SampleComponent;