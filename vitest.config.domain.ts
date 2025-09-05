import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/domain/**/*.{test,spec}.{js,ts,jsx,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: 'coverage/domain',
      include: ['src/domain/**/*.ts'],
      exclude: [
        'src/domain/index.ts',
        'src/domain/data/index.ts',
        'src/domain/entities/index.ts',
        'src/domain/errors/index.ts',
        'src/domain/repositories/index.ts',
        'src/domain/usecases/index.ts',
        'src/domain/utils/index.ts',
      ],
      all: true,
    },
  },
});
