import { render, screen } from '@testing-library/react';
import type { Project } from '@/interfaces/project';
import { ProjectCard } from '../../project-card';
import { ProjectList } from '..';

jest.mock('../../project-card', () => ({ ProjectCard: jest.fn() }));

const cardMock = jest.mocked(ProjectCard);

function project(id: string): Project {
  return {
    id,
    name: `Name ${id}`,
    status: 'Published',
    technologies: `Tech ${id}`,
    features: `Features ${id}`,
    imageUrl: `https://example.com/${id}.png`,
  };
}

function cardProps() {
  return cardMock.mock.calls.map(([props]) => props);
}

describe('ProjectList', () => {
  it('renders an empty list when there is no project', () => {
    render(<ProjectList projects={[]} />);

    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(cardMock).not.toHaveBeenCalled();
  });

  it('passes each project to a card without the status field', () => {
    render(<ProjectList projects={[project('a')]} />);

    expect(cardProps()).toEqual([
      {
        id: 'a',
        name: 'Name a',
        technologies: 'Tech a',
        features: 'Features a',
        imageUrl: 'https://example.com/a.png',
        priority: true,
        delayMs: 0,
      },
    ]);
  });

  it('gives image priority to the first card only', () => {
    render(<ProjectList projects={[project('a'), project('b'), project('c')]} />);

    expect(cardProps().map((props) => props.priority)).toEqual([true, false, false]);
  });

  it('staggers the reveal by 75ms and caps it at 6 steps', () => {
    const projects = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map(project);

    render(<ProjectList projects={projects} />);

    expect(cardProps().map((props) => props.delayMs)).toEqual([0, 75, 150, 225, 300, 375, 450, 450]);
  });
});
