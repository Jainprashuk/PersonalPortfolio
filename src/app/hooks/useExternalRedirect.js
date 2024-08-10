

import { useEffect } from 'react';
import { useRouter } from 'next/router';

const useExternalRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    switch (router.pathname) {
      case '/reactminds':
        window.location.href = 'https://www.reactminds.com';
        break;
      // Add more cases as needed
      default:
        break;
    }
  }, [router.pathname]);
};

export default useExternalRedirect;
