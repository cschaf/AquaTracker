import React from 'react';
import { render, screen } from '@testing-library/react';
import AchievementModal from './AchievementModal';
import type { Achievement } from '../../core/entities/achievement';

const mockAchievements: Achievement[] = [
  { id: '1', name: 'First Achievement', description: 'Desc 1', icon: 'fas fa-star' },
  { id: '2', name: 'Second Achievement', description: 'Desc 2', icon: 'fas fa-moon' },
];

describe('AchievementModal', () => {
  it('renders nothing when isOpen is false', () => {
    render(<AchievementModal isOpen={false} achievements={[]} onClose={() => {}} isUnlocked={true} />);
    expect(screen.queryByText(/New Achievement Unlocked!/)).not.toBeInTheDocument();
  });

  it('renders nothing when there are no achievements', () => {
    render(<AchievementModal isOpen={true} achievements={[]} onClose={() => {}} isUnlocked={true} />);
    expect(screen.queryByText(/New Achievement Unlocked!/)).not.toBeInTheDocument();
  });

  it('renders a single achievement', () => {
    render(<AchievementModal isOpen={true} achievements={[mockAchievements[0]]} onClose={() => {}} isUnlocked={true} />);
    expect(screen.getByText('New Achievement Unlocked!')).toBeInTheDocument();
    expect(screen.getByText('First Achievement')).toBeInTheDocument();
  });

  it('renders multiple achievements', () => {
    render(<AchievementModal isOpen={true} achievements={mockAchievements} onClose={() => {}} isUnlocked={true} />);
    expect(screen.getByText('2 New Achievements Unlocked!')).toBeInTheDocument();
    expect(screen.getByText('First Achievement')).toBeInTheDocument();
    expect(screen.getByText('Second Achievement')).toBeInTheDocument();
  });
});
