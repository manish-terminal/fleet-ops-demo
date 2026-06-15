import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

afterEach(cleanup);

// Mock env variables for tests
vi.stubEnv('VITE_ENABLE_REAL_API', 'false');
vi.stubEnv('VITE_MOCK_DELAY_MS', '0');
