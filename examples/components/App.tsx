import { css } from '@emotion/css';
import React from 'react';

export const App: React.FC = () => (
  <div
    className={css`
      display: flex;
      flex-direction: column;
      color: #333;
    `}
  >
    examples
  </div>
);
