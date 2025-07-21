'use client';
import { globalSWRConfig } from '@/lib/swr-global-config';
import { SWRConfig } from 'swr'


export const SWRProvider = ({ children }) => {
  return <SWRConfig
    value={globalSWRConfig}
  >
    {children}
  </SWRConfig>
};