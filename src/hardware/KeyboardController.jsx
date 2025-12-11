import { useEffect } from 'react';
import { useController } from './ControllerContext';

/**
 * Keyboard Controller - Maps keyboard inputs to game controller actions
 *
 * Mappings:
 * - Enter → A button
 * - Backspace → B button
 * - Home → Home (navigate to home)
 * - Arrow Keys (Up/Down/Left/Right) → D-pad directions
 * - Arrow Left/Right → Scroll wheel (for ModelR)
 */
export default function KeyboardController() {
  const { sendAction } = useController();

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Prevent default behavior for navigation keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'Backspace'].includes(event.key)) {
        event.preventDefault();
      }

      switch (event.key) {
        case 'Enter':
          sendAction('A');
          break;

        case 'Backspace':
          sendAction('B');
          break;

        case 'Home':
          sendAction('HOME');
          break;

        case 'ArrowUp':
          sendAction('UP');
          break;

        case 'ArrowDown':
          sendAction('DOWN');
          break;

        case 'ArrowLeft':
          sendAction('LEFT');
          break;

        case 'ArrowRight':
          sendAction('RIGHT');
          break;

        default:
          break;
      }
    };

    // Add event listener
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [sendAction]);

  // This component doesn't render anything
  return null;
}
