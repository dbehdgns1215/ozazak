
export const getProjects: (page?: number, size?: number) => Promise<{ content: any[], totalPages?: number }>;
export const getProject: (id: string | number | undefined) => Promise<{ data: any }>;
export const createProject: (data: any) => Promise<{ data: any }>;
export const updateProject: (id: string | number | undefined, data: any) => Promise<{ data: any }>;
export const deleteProject: (id: string | number | undefined) => Promise<{ success: boolean }>;
