import { useEffect } from 'react';

export interface ShortcutAction {
    key: string;
    ctrlOrCmd?: boolean;
    shiftKey?: boolean;
    description: string;
    action: () => void;
}

export function useKeyboardShortcuts(shortcuts: ShortcutAction[], enabled: boolean = true) {
    useEffect(() => {
        if (!enabled) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
            const modifier = isMac ? event.metaKey : event.ctrlKey;

            shortcuts.forEach((shortcut) => {
                const modifierMatch = shortcut.ctrlOrCmd ? modifier : true;
                const shiftMatch = shortcut.shiftKey ? event.shiftKey : !event.shiftKey;
                const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();

                if (modifierMatch && shiftMatch && keyMatch) {
                    // Prevent default browser behavior
                    event.preventDefault();
                    shortcut.action();
                }
            });
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [shortcuts, enabled]);
}

export const getModifierKey = () => {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    return isMac ? '⌘' : 'Ctrl';
};

