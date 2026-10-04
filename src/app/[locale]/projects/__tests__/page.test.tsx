import { render, screen } from '@testing-library/react';
import { getTranslations } from 'next-intl/server';
import { getAllProjects } from '@/features/notion/services/project';
import { ProjectList } from '@/features/projects/project-list';
import ProjectPage from '../page';

jest.mock('next-intl/server', () => ({ getTranslations: jest.fn() }));
jest.mock('@/features/notion/services/project', () => ({ getAllProjects: jest.fn() }));
jest.mock('@/features/projects/project-list', () => ({ ProjectList: jest.fn() }));

const projects = [
  { id: 'p1', name: 'One', status: 'Published', technologies: '', features: '', imageUrl: '' },
  { id: 'p2', name: 'Two', status: 'Published', technologies: '', features: '', imageUrl: '' },
];

beforeEach(() => {
  jest.mocked(getTranslations).mockResolvedValue(((key: string) => key) as never);
  jest.mocked(getAllProjects).mockResolvedValue(projects);
});

describe('ProjectPage', () => {
  it('renders the header from the projects messages', async () => {
    render(await ProjectPage());

    expect(getTranslations).toHaveBeenCalledWith('projects');
    expect(screen.getByRole('heading', { level: 1, name: 'title' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 4, name: 'description' })).toBeInTheDocument();
  });

  it('passes the published projects to the list', async () => {
    render(await ProjectPage());

    expect(jest.mocked(ProjectList).mock.calls[0][0]).toEqual({ projects });
  });
});
