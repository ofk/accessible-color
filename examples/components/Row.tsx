import { css, cx } from '@emotion/css';
import React from 'react';

export const Row: React.FC<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = ({ className, ...props }) => (
  <div
    className={cx(
      css`
        display: flex;
        flex-direction: row;
      `,
      className,
    )}
    {...props}
  />
);
