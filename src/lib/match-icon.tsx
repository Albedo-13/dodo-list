import { Check, CircleDot, Loader } from 'lucide-react';
import type { ReactNode } from 'react';

export function matchIcon(icon: string, color?: string, size?: number) {
  const iconSize = size || 24;
  const iconColor = color || '#000';

  const iconsList: Record<string, ReactNode> = {
    done: <Check color={iconColor} size={iconSize} />,
    inProgress: <Loader color={iconColor} size={iconSize} />,
    todo: <CircleDot color={iconColor} size={iconSize} />,
  };

  return iconsList[icon] || null;
}
