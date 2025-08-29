import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProgressBar } from './ProgressBar';

describe('ProgressBar', () => {
  it('should render with the default color when value is less than max', () => {
    render(<ProgressBar value={50} max={100} />);
    const progressBar = screen.getByRole('progressbar');
    const fill = progressBar.firstChild as HTMLElement;
    expect(fill.className).toContain('bg-accent-primary');
    expect(fill.className).not.toContain('bg-success');
  });

  it('should render with the default color when value is equal to max', () => {
    render(<ProgressBar value={100} max={100} />);
    const progressBar = screen.getByRole('progressbar');
    const fill = progressBar.firstChild as HTMLElement;
    expect(fill.className).toContain('bg-accent-primary');
    expect(fill.className).not.toContain('bg-success');
  });

  it('should render with the success color when value is greater than max', () => {
    render(<ProgressBar value={150} max={100} />);
    const progressBar = screen.getByRole('progressbar');
    const fill = progressBar.firstChild as HTMLElement;
    expect(fill.className).toContain('bg-success');
    expect(fill.className).not.toContain('bg-accent-primary');
  });

  it('should calculate the width correctly', () => {
    render(<ProgressBar value={50} max={100} />);
    const progressBar = screen.getByRole('progressbar');
    const fill = progressBar.firstChild as HTMLElement;
    expect(fill.style.width).toBe('50%');
  });

  it('should cap the width at 100%', () => {
    render(<ProgressBar value={150} max={100} />);
    const progressBar = screen.getByRole('progressbar');
    const fill = progressBar.firstChild as HTMLElement;
    expect(fill.style.width).toBe('100%');
  });
});
