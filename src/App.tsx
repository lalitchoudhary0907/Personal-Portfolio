/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { RootLayout } from './app/layout';
import { HomePage } from './app/page';

export default function App() {
  return (
    <RootLayout>
      <HomePage />
    </RootLayout>
  );
}
