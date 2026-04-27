'use client';

import { type ComponentProps } from 'react';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { useSessionContext } from '@livekit/components-react';
import { PhoneOffIcon } from 'lucide-react';

/**
 * Props for the AgentDisconnectButton component.
 */
export interface AgentDisconnectButtonProps
  extends Omit<ComponentProps<typeof Button>, 'size' | 'variant' | 'children'> {
  /**
   * Custom icon to display. Defaults to PhoneOffIcon.
   */
  icon?: React.ReactNode;
  /**
   * The size of the button.
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * The variant of the button.
   * @default 'danger'
   */
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'white';
  /**
   * The children to render.
   */
  children?: React.ReactNode;
  /**
   * The callback for when the button is clicked.
   */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

/**
 * A button to disconnect from the current agent session.
 * Calls the session's end() method when clicked.
 *
 * @extends ComponentProps<'button'>
 *
 * @example
 * ```tsx
 * <AgentDisconnectButton onClick={() => console.log('Disconnecting...')} />
 * ```
 */
export function AgentDisconnectButton({
  icon,
  size = 'md',
  variant = 'danger',
  children,
  onClick,
  ...props
}: AgentDisconnectButtonProps) {
  const { end } = useSessionContext();
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (typeof end === 'function') {
      end();
    }
  };

  return (
    <Button size={size} variant={variant} onClick={handleClick} {...props}>
      {icon ?? <PhoneOffIcon />}
      {children ?? <span>END CALL</span>}
    </Button>
  );
}
