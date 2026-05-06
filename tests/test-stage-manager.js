/**
 * Test Suite for StageManager Class
 * 
 * This file contains unit tests for the StageManager class to verify
 * module registration, enabling, disabling, toggling, and conflict detection.
 */

// Mock MapManager for testing
class MockMapManager {
    constructor() {
        this.map = { id: 'mock-map' };
        this.initialized = true;
    }

    getMap() {
        return this.map;
    }

    isInitialized() {
        return this.initialized;
    }
}

// Mock Module for testing
class MockModule {
    constructor(name) {
        this.name = name;
        this.active = false;
    }

    enable() {
        this.active = true;
        console.log(`MockModule "${this.name}" enabled`);
    }

    disable() {
        this.active = false;
        console.log(`MockModule "${this.name}" disabled`);
    }

    isActive() {
        return this.active;
    }
}

// Test Suite
function runTests() {
    console.log('=== StageManager Test Suite ===\n');

    let testsPassed = 0;
    let testsFailed = 0;

    // Test 1: Constructor
    try {
        const mapManager = new MockMapManager();
        const stageManager = new StageManager(mapManager);

        if (stageManager.mapManager === mapManager && stageManager.modules instanceof Map) {
            console.log('✓ Test 1 PASSED: Constructor initializes correctly');
            testsPassed++;
        } else {
            throw new Error('Constructor did not initialize correctly');
        }
    } catch (error) {
        console.error('✗ Test 1 FAILED:', error.message);
        testsFailed++;
    }

    // Test 2: Register Module
    try {
        const mapManager = new MockMapManager();
        const stageManager = new StageManager(mapManager);
        const mockModule = new MockModule('test-module');

        stageManager.registerModule('test-module', mockModule);

        if (stageManager.modules.has('test-module')) {
            console.log('✓ Test 2 PASSED: Module registration works');
            testsPassed++;
        } else {
            throw new Error('Module was not registered');
        }
    } catch (error) {
        console.error('✗ Test 2 FAILED:', error.message);
        testsFailed++;
    }

    // Test 3: Prevent Duplicate Registration
    try {
        const mapManager = new MockMapManager();
        const stageManager = new StageManager(mapManager);
        const mockModule1 = new MockModule('test-module');
        const mockModule2 = new MockModule('test-module');

        stageManager.registerModule('test-module', mockModule1);

        try {
            stageManager.registerModule('test-module', mockModule2);
            throw new Error('Should have thrown error for duplicate registration');
        } catch (error) {
            if (error.message.includes('already registered')) {
                console.log('✓ Test 3 PASSED: Duplicate registration prevented');
                testsPassed++;
            } else {
                throw error;
            }
        }
    } catch (error) {
        console.error('✗ Test 3 FAILED:', error.message);
        testsFailed++;
    }

    // Test 4: Validate Module Interface
    try {
        const mapManager = new MockMapManager();
        const stageManager = new StageManager(mapManager);
        const invalidModule = { enable: function () { } }; // Missing disable and isActive

        try {
            stageManager.registerModule('invalid-module', invalidModule);
            throw new Error('Should have thrown error for invalid module interface');
        } catch (error) {
            if (error.message.includes('must implement')) {
                console.log('✓ Test 4 PASSED: Module interface validation works');
                testsPassed++;
            } else {
                throw error;
            }
        }
    } catch (error) {
        console.error('✗ Test 4 FAILED:', error.message);
        testsFailed++;
    }

    // Test 5: Enable Module
    try {
        const mapManager = new MockMapManager();
        const stageManager = new StageManager(mapManager);
        const mockModule = new MockModule('test-module');

        stageManager.registerModule('test-module', mockModule);
        stageManager.enableModule('test-module');

        if (mockModule.isActive()) {
            console.log('✓ Test 5 PASSED: Module enable works');
            testsPassed++;
        } else {
            throw new Error('Module was not enabled');
        }
    } catch (error) {
        console.error('✗ Test 5 FAILED:', error.message);
        testsFailed++;
    }

    // Test 6: Disable Module
    try {
        const mapManager = new MockMapManager();
        const stageManager = new StageManager(mapManager);
        const mockModule = new MockModule('test-module');

        stageManager.registerModule('test-module', mockModule);
        stageManager.enableModule('test-module');
        stageManager.disableModule('test-module');

        if (!mockModule.isActive()) {
            console.log('✓ Test 6 PASSED: Module disable works');
            testsPassed++;
        } else {
            throw new Error('Module was not disabled');
        }
    } catch (error) {
        console.error('✗ Test 6 FAILED:', error.message);
        testsFailed++;
    }

    // Test 7: Toggle Module (inactive to active)
    try {
        const mapManager = new MockMapManager();
        const stageManager = new StageManager(mapManager);
        const mockModule = new MockModule('test-module');

        stageManager.registerModule('test-module', mockModule);
        stageManager.toggleModule('test-module');

        if (mockModule.isActive()) {
            console.log('✓ Test 7 PASSED: Toggle module (inactive to active) works');
            testsPassed++;
        } else {
            throw new Error('Module was not toggled to active');
        }
    } catch (error) {
        console.error('✗ Test 7 FAILED:', error.message);
        testsFailed++;
    }

    // Test 8: Toggle Module (active to inactive)
    try {
        const mapManager = new MockMapManager();
        const stageManager = new StageManager(mapManager);
        const mockModule = new MockModule('test-module');

        stageManager.registerModule('test-module', mockModule);
        stageManager.enableModule('test-module');
        stageManager.toggleModule('test-module');

        if (!mockModule.isActive()) {
            console.log('✓ Test 8 PASSED: Toggle module (active to inactive) works');
            testsPassed++;
        } else {
            throw new Error('Module was not toggled to inactive');
        }
    } catch (error) {
        console.error('✗ Test 8 FAILED:', error.message);
        testsFailed++;
    }

    // Test 9: Get Active Modules
    try {
        const mapManager = new MockMapManager();
        const stageManager = new StageManager(mapManager);
        const mockModule1 = new MockModule('module-1');
        const mockModule2 = new MockModule('module-2');
        const mockModule3 = new MockModule('module-3');

        stageManager.registerModule('module-1', mockModule1);
        stageManager.registerModule('module-2', mockModule2);
        stageManager.registerModule('module-3', mockModule3);

        stageManager.enableModule('module-1');
        stageManager.enableModule('module-3');

        const activeModules = stageManager.getActiveModules();

        if (activeModules.length === 2 &&
            activeModules.includes('module-1') &&
            activeModules.includes('module-3')) {
            console.log('✓ Test 9 PASSED: Get active modules works');
            testsPassed++;
        } else {
            throw new Error('Active modules list is incorrect');
        }
    } catch (error) {
        console.error('✗ Test 9 FAILED:', error.message);
        testsFailed++;
    }

    // Test 10: Is Module Active
    try {
        const mapManager = new MockMapManager();
        const stageManager = new StageManager(mapManager);
        const mockModule = new MockModule('test-module');

        stageManager.registerModule('test-module', mockModule);

        if (!stageManager.isModuleActive('test-module')) {
            stageManager.enableModule('test-module');

            if (stageManager.isModuleActive('test-module')) {
                console.log('✓ Test 10 PASSED: Is module active works');
                testsPassed++;
            } else {
                throw new Error('Module should be active');
            }
        } else {
            throw new Error('Module should not be active initially');
        }
    } catch (error) {
        console.error('✗ Test 10 FAILED:', error.message);
        testsFailed++;
    }

    // Test 11: Get Conflicts (no conflicts)
    try {
        const mapManager = new MockMapManager();
        const stageManager = new StageManager(mapManager);
        const mockModule = new MockModule('places');

        stageManager.registerModule('places', mockModule);

        const conflicts = stageManager.getConflicts('places');

        if (conflicts.length === 0) {
            console.log('✓ Test 11 PASSED: Get conflicts (no conflicts) works');
            testsPassed++;
        } else {
            throw new Error('Should have no conflicts');
        }
    } catch (error) {
        console.error('✗ Test 11 FAILED:', error.message);
        testsFailed++;
    }

    // Test 12: Get Conflicts (with conflicts)
    try {
        const mapManager = new MockMapManager();
        const stageManager = new StageManager(mapManager);
        const clusteringModule = new MockModule('clustering');
        const heatmapModule = new MockModule('heatmap');

        stageManager.registerModule('clustering', clusteringModule);
        stageManager.registerModule('heatmap', heatmapModule);

        stageManager.enableModule('heatmap');

        const conflicts = stageManager.getConflicts('clustering');

        if (conflicts.length === 1 && conflicts.includes('heatmap')) {
            console.log('✓ Test 12 PASSED: Get conflicts (with conflicts) works');
            testsPassed++;
        } else {
            throw new Error('Should have detected heatmap conflict');
        }
    } catch (error) {
        console.error('✗ Test 12 FAILED:', error.message);
        testsFailed++;
    }

    // Test 13: Error on Non-Existent Module (enable)
    try {
        const mapManager = new MockMapManager();
        const stageManager = new StageManager(mapManager);

        try {
            stageManager.enableModule('non-existent');
            throw new Error('Should have thrown error for non-existent module');
        } catch (error) {
            if (error.message.includes('not found')) {
                console.log('✓ Test 13 PASSED: Error on non-existent module (enable) works');
                testsPassed++;
            } else {
                throw error;
            }
        }
    } catch (error) {
        console.error('✗ Test 13 FAILED:', error.message);
        testsFailed++;
    }

    // Test 14: Error on Non-Existent Module (disable)
    try {
        const mapManager = new MockMapManager();
        const stageManager = new StageManager(mapManager);

        try {
            stageManager.disableModule('non-existent');
            throw new Error('Should have thrown error for non-existent module');
        } catch (error) {
            if (error.message.includes('not found')) {
                console.log('✓ Test 14 PASSED: Error on non-existent module (disable) works');
                testsPassed++;
            } else {
                throw error;
            }
        }
    } catch (error) {
        console.error('✗ Test 14 FAILED:', error.message);
        testsFailed++;
    }

    // Test 15: Error on Non-Existent Module (isModuleActive)
    try {
        const mapManager = new MockMapManager();
        const stageManager = new StageManager(mapManager);

        try {
            stageManager.isModuleActive('non-existent');
            throw new Error('Should have thrown error for non-existent module');
        } catch (error) {
            if (error.message.includes('not found')) {
                console.log('✓ Test 15 PASSED: Error on non-existent module (isModuleActive) works');
                testsPassed++;
            } else {
                throw error;
            }
        }
    } catch (error) {
        console.error('✗ Test 15 FAILED:', error.message);
        testsFailed++;
    }

    // Summary
    console.log('\n=== Test Summary ===');
    console.log(`Total Tests: ${testsPassed + testsFailed}`);
    console.log(`Passed: ${testsPassed}`);
    console.log(`Failed: ${testsFailed}`);

    if (testsFailed === 0) {
        console.log('\n✓ All tests passed!');
    } else {
        console.log(`\n✗ ${testsFailed} test(s) failed`);
    }
}

// Load StageManager class in Node.js environment
if (typeof window === 'undefined') {
    // Node.js environment - load app.js
    const fs = require('fs');
    const appJsContent = fs.readFileSync('app.js', 'utf8');

    // Extract and evaluate the StageManager class
    // We need to evaluate the class definitions without the Google Maps specific code
    const classDefinitions = appJsContent.split('// Global map instance')[0];
    eval(classDefinitions);
}

// Run tests when the page loads
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', runTests);
} else {
    // For Node.js environment
    runTests();
}
