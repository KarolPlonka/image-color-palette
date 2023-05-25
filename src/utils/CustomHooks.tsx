import { useState } from 'react';

export function useSignal() {
    const [signal, setSignal] = useState<number>(0);
    
    const sendSignal = () => {
      if(signal === 0) setSignal(1);
      if(signal === 1) setSignal(2);
      if(signal === 2) setSignal(1);
    } 
  
    return [signal, sendSignal] as const;
};