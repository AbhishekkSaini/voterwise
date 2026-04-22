/**
 * VoterWise Haptics — iOS Taptic Engine-inspired feedback
 *
 * Uses the Web Vibration API on supported devices (Android Chrome, etc.)
 * On iOS/unsupported devices, the visual spring animations carry the feel.
 */

export type HapticPattern = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' | 'select';

// Vibration patterns (ms) — tuned to feel like iOS taptic patterns
const PATTERNS: Record<HapticPattern, number | number[]> = {
  light:   10,
  medium:  20,
  heavy:   35,
  select:  [8, 30, 8],
  success: [10, 40, 10, 40, 10],
  warning: [30, 60, 30],
  error:   [50, 30, 50, 30, 80],
};

let lastHaptic = 0;
const MIN_INTERVAL = 50; // debounce rapid haptics

export function haptic(type: HapticPattern = 'light'): void {
  const now = Date.now();
  if (now - lastHaptic < MIN_INTERVAL) return;
  lastHaptic = now;

  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(PATTERNS[type]);
    } catch {
      // silently fail — haptics are purely progressive enhancement
    }
  }
}

/** Convenience wrappers */
export const h = {
  tap:     () => haptic('light'),
  press:   () => haptic('medium'),
  select:  () => haptic('select'),
  confirm: () => haptic('success'),
  warn:    () => haptic('warning'),
  error:   () => haptic('error'),
};
