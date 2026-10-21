import type { Project } from '@/interfaces/project';
import { ProjectCard } from '../project-card';

const REVEAL_STAGGER_MS = 75;
const REVEAL_STAGGER_MAX_STEPS = 6;

export function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {projects.map((project, index) => {
        const { id, name, features, technologies, imageUrl, githubUrl, websiteUrl } = project;

        return (
          <ProjectCard
            key={id}
            id={id}
            name={name}
            features={features}
            technologies={technologies}
            imageUrl={imageUrl}
            githubUrl={githubUrl}
            websiteUrl={websiteUrl}
            priority={index === 0}
            delayMs={Math.min(index, REVEAL_STAGGER_MAX_STEPS) * REVEAL_STAGGER_MS}
          />
        );
      })}
    </ul>
  );
}
