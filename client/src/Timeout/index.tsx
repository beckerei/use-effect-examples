import React, { useEffect } from 'react';

export const Timeout: React.FC = () => {
  const [navigation, setNavigation] = React.useState(0);
  const [_, setSomeState] = React.useState(navigation);

  useEffect(() => {
    const timeout = setTimeout(() => {
      console.log('useEffect called with', navigation);
      setSomeState(navigation);
    }, 1000);

    // return () => {
    //   console.log('useEffect cleanup called with', navigation);
    //   clearTimeout(timeout);
    // };
  }, [navigation]);

  return (
    <>
      <div>
        <button onClick={() => setNavigation(navigation - 1)}>&laquo;</button>
        &nbsp;{navigation}&nbsp;
        <button onClick={() => setNavigation(navigation + 1)}>&raquo;</button>
      </div>
    </>
  );
};
