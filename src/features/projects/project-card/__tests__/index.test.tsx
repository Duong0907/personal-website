import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { useInView } from '@/hooks/use-in-view';
import { FALLBACK_CARD_IMAGE_URL } from '@/lib/constant';
import { ProjectCard } from '..';

jest.mock('next-intl', () => ({ useTranslations: () => (key: string) => key }));
jest.mock('@/hooks/use-in-view', () => ({ useInView: jest.fn() }));

function mockVisible(isVisible: boolean) {
  jest.mocked(useInView).mockReturnValue({ ref: createRef<HTMLElement>(), isVisible });
}

const props = {
  id: 'p1',
  name: 'Portfolio',
  features: 'i18n, dark mode',
  technologies: 'Next.js',
  imageUrl: 'https://example.com/a.png',
  priority: false,
  delayMs: 150,
  githubUrl: 'https://github.com/me/portfolio',
  websiteUrl: 'https://portfolio.dev',
};

describe('ProjectCard', () => {
  beforeEach(() => {
    mockVisible(false);
  });

  it('links to the article page and shows the project text', () => {
    render(<ProjectCard {...props} />);

    expect(screen.getByRole('link', { name: 'Portfolio' })).toHaveAttribute('href', '/articles/p1');
    expect(screen.getByRole('heading', { level: 4, name: 'Portfolio' })).toBeInTheDocument();
    expect(screen.getByText('Next.js')).toBeInTheDocument();
    expect(screen.getByText('i18n, dark mode')).toBeInTheDocument();
  });

  it('links to GitHub and the website in a new tab', () => {
    render(<ProjectCard {...props} />);

    const github = screen.getByRole('link', { name: 'GitHub' });
    const website = screen.getByRole('link', { name: 'website' });

    expect(github).toHaveAttribute('href', 'https://github.com/me/portfolio');
    expect(website).toHaveAttribute('href', 'https://portfolio.dev');
    for (const link of [github, website]) {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    }
  });

  it('hides the GitHub and website links when their URLs are empty', () => {
    render(<ProjectCard {...props} githubUrl="" websiteUrl="" />);

    expect(screen.getAllByRole('link')).toHaveLength(1);
  });

  it('shows the project image', () => {
    render(<ProjectCard {...props} />);

    const image = screen.getByRole('img', { name: 'Portfolio' });

    expect(image).toHaveAttribute('src', 'https://example.com/a.png');
    expect(image).toHaveAttribute('width', '40');
    expect(image).toHaveAttribute('height', '40');
    expect(image).not.toHaveAttribute('data-priority');
  });

  it('uses the fallback image when imageUrl is empty', () => {
    render(<ProjectCard {...props} imageUrl="" />);

    expect(screen.getByRole('img', { name: 'Portfolio' })).toHaveAttribute('src', FALLBACK_CARD_IMAGE_URL);
  });

  it('marks the image as priority when asked', () => {
    render(<ProjectCard {...props} priority />);

    expect(screen.getByRole('img', { name: 'Portfolio' })).toHaveAttribute('data-priority', 'true');
  });

  it('delays the reveal transition by delayMs', () => {
    const { container } = render(<ProjectCard {...props} />);

    expect(container.firstChild).toHaveStyle({ transitionDelay: '150ms' });
  });

  it('stays hidden until it scrolls into view', () => {
    const { container } = render(<ProjectCard {...props} />);

    expect(container.firstChild).toHaveClass('opacity-0', 'translate-y-6');
  });

  it('is shown once it is in view', () => {
    mockVisible(true);

    const { container } = render(<ProjectCard {...props} />);

    expect(container.firstChild).toHaveClass('opacity-100', 'translate-y-0');
  });
});
