/** 
 * Mock AI Engine for Alpha Launch.
 * Simulates a delay and returns a structured JSON Blueprint.
 */
import { createInitialBlueprint } from './blueprint';

export const interpretPrompt = async (prompt) => {
    // Simulate network/latency for "ChatGPT feel"
    await new Promise(resolve => setTimeout(resolve, 2000));

    const blueprint = createInitialBlueprint();

    // Basic heuristic-based "interpretation" for the Alpha
    if (prompt.toLowerCase().includes('fitness')) {
        blueprint.name = 'FitFlow';
        blueprint.pages = [
            { id: '1', name: 'Workouts', icon: 'Activity' },
            { id: '2', name: 'Diet', icon: 'Coffee' },
            { id: '3', name: 'Profile', icon: 'User' }
        ];
        blueprint.features.push({ id: 'f3', name: 'HealthKit', enabled: true });
        blueprint.style.primaryColor = '#34D399'; // Greenish
    } else if (prompt.toLowerCase().includes('finance') || prompt.toLowerCase().includes('money')) {
        blueprint.name = 'CoinControl';
        blueprint.pages = [
            { id: '1', name: 'Transactions', icon: 'DollarSign' },
            { id: '2', name: 'Budgets', icon: 'PieChart' },
            { id: '3', name: 'Cards', icon: 'CreditCard' }
        ];
        blueprint.style.primaryColor = '#6366F1'; // Indigo
    } else {
        blueprint.name = prompt.split(' ').slice(0, 2).join(' ') || 'My AI App';
    }

    return blueprint;
};
