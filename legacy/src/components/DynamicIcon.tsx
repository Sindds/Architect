import React from 'react';
import * as LucideIcons from 'lucide-react';

interface DynamicIconProps {
  name: string;
  className?: string;
  size?: number;
  strokeWidth?: number;
}

/**
 * Рендерит любую иконку Lucide по её строковому названию.
 * Например: name="ShieldCheck", name="Cpu", name="Award", name="Home", name="Car" и т.д.
 * Если иконка не найдена, отображается универсальная иконка Sparkles.
 */
export const DynamicIcon: React.FC<DynamicIconProps> = ({
  name,
  className = 'w-5 h-5',
  size,
  strokeWidth = 2,
}) => {
  // Normalize icon name (e.g. "shield-check" -> "ShieldCheck" or direct match)
  const formattedName = name
    .split(/[-_\s]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');

  // Find component in lucide-react exports
  const IconComponent = (LucideIcons as Record<string, any>)[formattedName] ||
    (LucideIcons as Record<string, any>)[name] ||
    LucideIcons.Sparkles;

  return <IconComponent className={className} size={size} strokeWidth={strokeWidth} />;
};
