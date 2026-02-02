/**
 * LocalStorage Storage Engine
 * Manages user projects and basic session data for the V1 Alpha.
 */

const PROJECTS_KEY = 'infinity_builder_projects';
const USER_KEY = 'infinity_builder_user';

export const saveProject = (blueprint) => {
    const projects = getProjects();
    const index = projects.findIndex(p => p.id === blueprint.id);

    if (index >= 0) {
        projects[index] = { ...blueprint, updatedAt: new Date().toISOString() };
    } else {
        projects.push({ ...blueprint, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }

    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
    return projects;
};

export const getProjects = () => {
    const stored = localStorage.getItem(PROJECTS_KEY);
    return stored ? JSON.parse(stored) : [];
};

export const deleteProject = (id) => {
    const projects = getProjects().filter(p => p.id !== id);
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
    return projects;
};

export const loginUser = (email) => {
    localStorage.setItem(USER_KEY, JSON.stringify({ email, isLoggedIn: true }));
};

export const getSession = () => {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
};

export const logout = () => {
    localStorage.removeItem(USER_KEY);
};
