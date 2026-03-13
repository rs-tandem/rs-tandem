import { vi } from 'vitest';

vi.mock('*.png', () => ({ default: 'test-file-stub' }));
vi.mock('*.svg', () => ({ default: 'test-file-stub' }));
vi.mock('*.css', () => ({ default: {} }));
