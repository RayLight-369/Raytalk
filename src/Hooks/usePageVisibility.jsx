import { useState, useEffect } from 'react';

function usePageVisibility () {
  const [ isVisible, setIsVisible ] = useState( true );

  useEffect( () => {
    const handleVisibilityChange = () => {
      setIsVisible( document.visibilityState === 'visible' );
    };

    handleVisibilityChange();
    document.addEventListener( 'visibilitychange', handleVisibilityChange );

    return () => {
      document.removeEventListener( 'visibilitychange', handleVisibilityChange );
    };
  }, [] );

  return isVisible;
}

export default usePageVisibility;