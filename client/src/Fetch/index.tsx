import React, { useState, useEffect } from 'react';

export const Fetch: React.FC = () => {
  const [navigation, setNavigation] = useState(0);
  const [result, setResult] = useState(navigation);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const delayMs = 1000 * (Math.floor(Math.random() * 3) + 0.5);
    setIsLoading(true);

    const makeRequest = async () => {
      await fetch(
        `https://www.mocky.io/v2/5185415ba171ea3a00704eedAdd%20?mocky-delay=${delayMs}ms`,
        { signal: controller.signal },
      );

      console.log('fetched init with ', navigation);
      setResult(navigation);
      setIsLoading(false);
    };
    makeRequest();

    return () => controller.abort();
  }, [navigation]);
  return (
    <>
      <div>
        <button onClick={() => setNavigation(navigation - 1)}>&laquo;</button>
        &nbsp;{navigation}&nbsp;
        <button onClick={() => setNavigation(navigation + 1)}>&raquo;</button>
      </div>
      <div>Fetch result for: {isLoading ? '...' : result}</div>
    </>
  );
};
