/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type CursorVariant = 'default' | 'link' | 'project' | 'text' | 'hidden';

export interface CursorContextValue {
  variant: CursorVariant;
  isOnDark: boolean;
  label?: string;
  setCursorVariant: (variant: CursorVariant, label?: string) => void;
  setIsOnDark: (onDark: boolean) => void;
}

const CursorContext = createContext<CursorContextValue | undefined>(undefined);

export const CursorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [variant, setVariant] = useState<CursorVariant>('default');
  const [isOnDark, setIsOnDark] = useState<boolean>(false);
  const [label, setLabel] = useState<string | undefined>(undefined);

  const setCursorVariant = (newVariant: CursorVariant, newLabel?: string) => {
    setVariant(newVariant);
    setLabel(newLabel);
  };

  return (
    <CursorContext.Provider
      value={{
        variant,
        isOnDark,
        label,
        setCursorVariant,
        setIsOnDark,
      }}
    >
      {children}
    </CursorContext.Provider>
  );
};

export function useCursor(): CursorContextValue {
  const context = useContext(CursorContext);
  if (!context) {
    return {
      variant: 'default',
      isOnDark: false,
      setCursorVariant: () => {},
      setIsOnDark: () => {},
    };
  }
  return context;
}
