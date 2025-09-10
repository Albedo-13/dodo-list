import type { ReactNode } from 'react';

import { matchIcon } from '@/lib/match-icon';

type TagProps = {
  children: ReactNode;
  icon?: string;
  color?: string;
  iconSize?: number;
};

function Tag({ children, icon, color, iconSize, ...props }: TagProps) {
  return (
    <div className="flex" aria-label="tag">
      <div
        className="text-gray-500 border-1 rounded-md flex items-center gap-1.5 basis-0 px-3 py-0.5 text-sm"
        {...props}
      >
        {icon && matchIcon(icon, color, iconSize || 16)}
        {children}
      </div>
    </div>
  );
}

export { Tag };
