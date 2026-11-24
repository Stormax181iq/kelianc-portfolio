import type { Repositories } from "../repositories/types";
import { createContentService } from "./content.service";
import { createProjectService } from "./project.service";
import { createTimelineService } from "./timeline.service";
import { createContactService, type ContactServiceDeps } from "./contact.service";
import { createAuthService } from "./auth.service";
import { createGithubService, type GithubServiceDeps } from "./github.service";

export interface Services {
  content: ReturnType<typeof createContentService>;
  projects: ReturnType<typeof createProjectService>;
  timeline: ReturnType<typeof createTimelineService>;
  contact: ReturnType<typeof createContactService>;
  auth: ReturnType<typeof createAuthService>;
  github: ReturnType<typeof createGithubService>;
}

export function createServices(
  repos: Repositories,
  extra: { contact: Omit<ContactServiceDeps, "repo">; github: Omit<GithubServiceDeps, "cache"> },
): Services {
  return {
    content: createContentService(repos.content),
    projects: createProjectService(repos.projects),
    timeline: createTimelineService(repos.timeline),
    contact: createContactService({ repo: repos.contact, ...extra.contact }),
    auth: createAuthService({ admin: repos.admin }),
    github: createGithubService({ cache: repos.githubCache, ...extra.github }),
  };
}
