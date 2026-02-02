/**
 * AI Engine for Rob The Builder
 * Simulates a delay and returns a functional Workspace (VFS).
 */
import { createInitialBlueprint } from './blueprint';
import { createInitialWorkspace } from './vfs';

export const interpretPrompt = async (prompt) => {
    // Simulate network/latency for "Thinking" feel (Replit style)
    await new Promise(resolve => setTimeout(resolve, 2800));

    // For the Alpha/V1, we use deterministic mapping.
    // In V2, this will call actual LLM APIs.
    const blueprint = createInitialBlueprint();

    // Heuristic branding
    if (prompt.toLowerCase().includes('fitness')) {
        blueprint.name = 'FitFlow';
    } else if (prompt.toLowerCase().includes('task') || prompt.toLowerCase().includes('todo')) {
        blueprint.name = 'TaskMaster';
    } else {
        blueprint.name = 'My Rob App';
    }

    // Convert high-level blueprint into a functional workspace
    return createInitialWorkspace(prompt, blueprint);
};
