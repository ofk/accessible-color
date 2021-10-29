import { css, cx } from '@emotion/css';
import React from 'react';

export const Col: React.FC<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = ({ className, ...props }) => (
  <div
    className={cx(
      css`
        padding: 0.5em;
      `,
      className
    )}
    {...props}
  />
);

export const ColButton: React.FC<
  React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
> = ({ className, ...props }) => (
  <button
    type="button"
    className={cx(
      css`
        width: 2em;
      `,
      className
    )}
    {...props}
  />
);
