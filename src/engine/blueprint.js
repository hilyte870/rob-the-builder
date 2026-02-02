/**
 * The core Blueprint schema for Infinity Builder.
 * This is the Single Source of Truth for any app generated.
 */
export const createInitialBlueprint = (name = 'New App') => ({
    id: crypto.randomUUID(),
    name: name,
    app_type: 'general',
    pages: [
        { id: '1', name: 'Home', icons: 'Home' },
        { id: '2', name: 'Settings', icons: 'Settings' }
    ],
    features: [
        { id: 'f1', name: 'Auth', enabled: true },
        { id: 'f2', name: 'DarkMode', enabled: false }
    ],
    roles: ['User'],
    monetization: {
        type: 'free',
        description: 'No charge for basic features.'
    },
    style: {
        theme: 'minimal',
        primaryColor: '#7EDBFF',
        font: 'Outfit'
    }
});

export const validateBlueprint = (blueprint) => {
    const required = ['id', 'name', 'pages', 'features', 'style'];
    return required.every(key => Object.hasOwn(blueprint, key));
};
