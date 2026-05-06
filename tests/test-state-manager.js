/**
 * StateManager Unit Tests (Node.js)
 * 
 * Simple test suite to validate StateManager functionality
 */

// StateManager class
class StateManager {
    constructor() {
        this.state = {
            mapInitialized: false,
            apiKeyValid: false,
            activeModules: [],
            mapCenter: null,
            mapZoom: null,
            moduleStates: {}
        };
    }

    getState() {
        return { ...this.state };
    }

    setState(key, value) {
        this.state[key] = value;
    }

    clearState() {
        this.state = {
            mapInitialized: false,
            apiKeyValid: false,
            activeModules: [],
            mapCenter: null,
            mapZoom: null,
            moduleStates: {}
        };
    }

    exportState() {
        return JSON.stringify(this.state, null, 2);
    }

    importState(stateJson) {
        try {
            const importedState = JSON.parse(stateJson);
            this.state = {
                mapInitialized: importedState.mapInitialized || false,
                apiKeyValid: importedState.apiKeyValid || false,
                activeModules: importedState.activeModules || [],
                mapCenter: importedState.mapCenter || null,
                mapZoom: importedState.mapZoom || null,
                moduleStates: importedState.moduleStates || {}
            };
        } catch (error) {
            throw new Error(`Failed to import state: ${error.message}`);
        }
    }
}

// Simple test framework
class TestRunner {
    constructor() {
        this.passed = 0;
        this.failed = 0;
        this.tests = [];
    }

    assert(condition, message) {
        if (!condition) {
            throw new Error(message);
        }
    }

    assertEqual(actual, expected, message) {
        if (JSON.stringify(actual) !== JSON.stringify(expected)) {
            throw new Error(`${message}\nExpected: ${JSON.stringify(expected)}\nActual: ${JSON.stringify(actual)}`);
        }
    }

    test(name, fn) {
        try {
            fn();
            this.passed++;
            console.log(`✓ ${name}`);
        } catch (error) {
            this.failed++;
            console.log(`✗ ${name}`);
            console.log(`  Error: ${error.message}`);
        }
    }

    summary() {
        console.log('\n' + '='.repeat(50));
        console.log(`Total: ${this.passed + this.failed} | Passed: ${this.passed} | Failed: ${this.failed}`);
        if (this.failed === 0) {
            console.log('All tests passed! ✓');
        }
        return this.failed === 0;
    }
}

// Run tests
const runner = new TestRunner();

console.log('StateManager Unit Tests\n');

console.log('Initialization Tests:');
runner.test('should initialize with default state', () => {
    const stateManager = new StateManager();
    const state = stateManager.getState();

    runner.assert(state.mapInitialized === false, 'mapInitialized should be false');
    runner.assert(state.apiKeyValid === false, 'apiKeyValid should be false');
    runner.assertEqual(state.activeModules, [], 'activeModules should be empty array');
    runner.assert(state.mapCenter === null, 'mapCenter should be null');
    runner.assert(state.mapZoom === null, 'mapZoom should be null');
    runner.assertEqual(state.moduleStates, {}, 'moduleStates should be empty object');
});

console.log('\ngetState() Tests:');
runner.test('should return current state object with all properties', () => {
    const stateManager = new StateManager();
    const state = stateManager.getState();

    runner.assert(typeof state === 'object', 'state should be an object');
    runner.assert(state.hasOwnProperty('mapInitialized'), 'should have mapInitialized');
    runner.assert(state.hasOwnProperty('apiKeyValid'), 'should have apiKeyValid');
    runner.assert(state.hasOwnProperty('activeModules'), 'should have activeModules');
    runner.assert(state.hasOwnProperty('mapCenter'), 'should have mapCenter');
    runner.assert(state.hasOwnProperty('mapZoom'), 'should have mapZoom');
    runner.assert(state.hasOwnProperty('moduleStates'), 'should have moduleStates');
});

runner.test('should return a copy of state (not reference)', () => {
    const stateManager = new StateManager();
    const state1 = stateManager.getState();
    state1.mapInitialized = true;

    const state2 = stateManager.getState();
    runner.assert(state2.mapInitialized === false, 'modifying returned state should not affect internal state');
});

console.log('\nsetState() Tests:');
runner.test('should update mapInitialized', () => {
    const stateManager = new StateManager();
    stateManager.setState('mapInitialized', true);

    const state = stateManager.getState();
    runner.assert(state.mapInitialized === true, 'mapInitialized should be true');
});

runner.test('should update apiKeyValid', () => {
    const stateManager = new StateManager();
    stateManager.setState('apiKeyValid', true);

    const state = stateManager.getState();
    runner.assert(state.apiKeyValid === true, 'apiKeyValid should be true');
});

runner.test('should update activeModules', () => {
    const stateManager = new StateManager();
    stateManager.setState('activeModules', ['clustering', 'heatmap']);

    const state = stateManager.getState();
    runner.assertEqual(state.activeModules, ['clustering', 'heatmap'], 'activeModules should be updated');
});

runner.test('should update mapCenter', () => {
    const stateManager = new StateManager();
    const center = { lat: 0.3476, lng: 32.5825 };
    stateManager.setState('mapCenter', center);

    const state = stateManager.getState();
    runner.assertEqual(state.mapCenter, center, 'mapCenter should be updated');
});

runner.test('should update mapZoom', () => {
    const stateManager = new StateManager();
    stateManager.setState('mapZoom', 12);

    const state = stateManager.getState();
    runner.assert(state.mapZoom === 12, 'mapZoom should be 12');
});

runner.test('should update moduleStates', () => {
    const stateManager = new StateManager();
    const moduleStates = {
        clustering: { active: true, lastToggled: '2024-01-01' }
    };
    stateManager.setState('moduleStates', moduleStates);

    const state = stateManager.getState();
    runner.assertEqual(state.moduleStates, moduleStates, 'moduleStates should be updated');
});

console.log('\nclearState() Tests:');
runner.test('should reset all state properties to defaults', () => {
    const stateManager = new StateManager();

    // Set some values
    stateManager.setState('mapInitialized', true);
    stateManager.setState('apiKeyValid', true);
    stateManager.setState('activeModules', ['clustering']);
    stateManager.setState('mapCenter', { lat: 0.3476, lng: 32.5825 });
    stateManager.setState('mapZoom', 12);

    // Clear state
    stateManager.clearState();

    const state = stateManager.getState();
    runner.assert(state.mapInitialized === false, 'mapInitialized should be reset to false');
    runner.assert(state.apiKeyValid === false, 'apiKeyValid should be reset to false');
    runner.assertEqual(state.activeModules, [], 'activeModules should be reset to empty array');
    runner.assert(state.mapCenter === null, 'mapCenter should be reset to null');
    runner.assert(state.mapZoom === null, 'mapZoom should be reset to null');
    runner.assertEqual(state.moduleStates, {}, 'moduleStates should be reset to empty object');
});

console.log('\nexportState() Tests:');
runner.test('should return JSON string of current state', () => {
    const stateManager = new StateManager();
    stateManager.setState('mapInitialized', true);
    stateManager.setState('mapZoom', 12);

    const exported = stateManager.exportState();

    runner.assert(typeof exported === 'string', 'exported should be a string');

    // Verify it's valid JSON
    const parsed = JSON.parse(exported);
    runner.assert(parsed.mapInitialized === true, 'parsed state should have mapInitialized true');
    runner.assert(parsed.mapZoom === 12, 'parsed state should have mapZoom 12');
});

runner.test('should export complete state structure', () => {
    const stateManager = new StateManager();
    const exported = stateManager.exportState();
    const parsed = JSON.parse(exported);

    runner.assert(parsed.hasOwnProperty('mapInitialized'), 'exported should have mapInitialized');
    runner.assert(parsed.hasOwnProperty('apiKeyValid'), 'exported should have apiKeyValid');
    runner.assert(parsed.hasOwnProperty('activeModules'), 'exported should have activeModules');
    runner.assert(parsed.hasOwnProperty('mapCenter'), 'exported should have mapCenter');
    runner.assert(parsed.hasOwnProperty('mapZoom'), 'exported should have mapZoom');
    runner.assert(parsed.hasOwnProperty('moduleStates'), 'exported should have moduleStates');
});

console.log('\nimportState() Tests:');
runner.test('should import state from valid JSON string', () => {
    const stateManager = new StateManager();
    const stateJson = JSON.stringify({
        mapInitialized: true,
        apiKeyValid: true,
        activeModules: ['clustering', 'heatmap'],
        mapCenter: { lat: 0.3476, lng: 32.5825 },
        mapZoom: 12,
        moduleStates: { clustering: { active: true } }
    });

    stateManager.importState(stateJson);

    const state = stateManager.getState();
    runner.assert(state.mapInitialized === true, 'mapInitialized should be imported');
    runner.assert(state.apiKeyValid === true, 'apiKeyValid should be imported');
    runner.assertEqual(state.activeModules, ['clustering', 'heatmap'], 'activeModules should be imported');
    runner.assertEqual(state.mapCenter, { lat: 0.3476, lng: 32.5825 }, 'mapCenter should be imported');
    runner.assert(state.mapZoom === 12, 'mapZoom should be imported');
    runner.assertEqual(state.moduleStates, { clustering: { active: true } }, 'moduleStates should be imported');
});

runner.test('should handle partial state import with defaults', () => {
    const stateManager = new StateManager();
    const stateJson = JSON.stringify({
        mapInitialized: true,
        mapZoom: 15
    });

    stateManager.importState(stateJson);

    const state = stateManager.getState();
    runner.assert(state.mapInitialized === true, 'mapInitialized should be imported');
    runner.assert(state.mapZoom === 15, 'mapZoom should be imported');
    runner.assert(state.apiKeyValid === false, 'apiKeyValid should default to false');
    runner.assertEqual(state.activeModules, [], 'activeModules should default to empty array');
    runner.assert(state.mapCenter === null, 'mapCenter should default to null');
});

runner.test('should throw error for invalid JSON', () => {
    const stateManager = new StateManager();

    let threw = false;
    try {
        stateManager.importState('invalid json');
    } catch (error) {
        threw = true;
        runner.assert(error.message.includes('Failed to import state'), 'error message should be descriptive');
    }

    runner.assert(threw, 'should throw error for invalid JSON');
});

console.log('\nIntegration Tests:');
runner.test('should support export and import round-trip', () => {
    const stateManager1 = new StateManager();
    stateManager1.setState('mapInitialized', true);
    stateManager1.setState('apiKeyValid', true);
    stateManager1.setState('activeModules', ['clustering']);
    stateManager1.setState('mapCenter', { lat: 0.3476, lng: 32.5825 });
    stateManager1.setState('mapZoom', 12);

    const exported = stateManager1.exportState();

    const stateManager2 = new StateManager();
    stateManager2.importState(exported);

    const state1 = stateManager1.getState();
    const state2 = stateManager2.getState();

    runner.assertEqual(state2, state1, 'exported and imported state should match');
});

// Print summary and exit with appropriate code
const success = runner.summary();
process.exit(success ? 0 : 1);
