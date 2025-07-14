'use client';

import { useEffect } from 'react';

export default function TablerInitializer() {
  useEffect(() => {
    import('@tabler/core/dist/js/tabler.min.js');
  }, []);

  return null;
}