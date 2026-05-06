/**
 * Simple Test for StageManager Class
 * Run this in a browser console after loading app.js
 */

// Mock MapManager for testing
class MockMapManager {
    constructor() {
        this.map = { id: 'mock-map' };
        this.initialized = true;
    }
    getMap() { return this.map; }
    isInitialized() { return this.initialized; }
}

// Mock Module for testing
class MockModule {
    constructor(name) {
        this.name = name;
        this.active = false;
    }
    enable() { this.active = true; }
    disable() { this.active = false; }
    isActive() { return this.active; }
}

console.log('=== StageManager Test Suite ===\n');

let testsPassed = 0;
let testsFailed = 0;

// Test 1: Constructor
try {
    const mapManager = new MockMapManager();
    const stageManager = new StageManager(mapManager);
    console.log('✓ Test 1 PASSED: Constructor initializes correctly');
    testsPassed++;
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
    console.log('✓ Test 2 PASSED: Module registration works');
    testsPassed++;
} catch (error) {
    console.error('✗ Test 2 FAILED:', error.message);
    testsFailed++;
}

// Test 3: Enable Module
try {
    const mapManager = new MockMapManager();
    const stageManager = new StageManager(mapManager);
    const mockModule = new MockModule('test-module');
    stageManager.registerModule('test-module', mockModule);
    stageManager.enableModule('test-module');
    if (mockModule.isActive()) {
        console.log('✓ Test 3 PASSED: Module enable works');
        testsPassed++;
    } else {
        throw new Error('Module was not enabled');
    }
} catch (error) {
    console.error('✗ Test 3 FAILED:', error.message);
    testsFailed++;
}

// Test 4: Disable Module
try {
    const mapManager = new MockMapManager();
    const stageManager = new StageManager(mapManager);
    const mockModule = new MockModule('test-module');
    stageManager.registerModule('test-module', mockModule);
    stageManager.enableModule('test-module');
    stageManager.disableModule('test-module');
    if (!mockModule.isActive()) {
        console.log('✓ Test 4 PASSED: Module disable works');
        testsPassed++;
    } else {
        throw new Error('Module was not disabled');
    }
} catch (error) {
    console.error('✗ Test 4 FAILED:', error.message);
    testsFailed++;
}

// Test 5: Toggle Module
try {
    const mapManager = new MockMapManager();
    const stageManager = new StageManager(mapManager);
    const mockModule = new MockModule('test-module');
    stageManager.registerModule('test-module', mockModule);
    stageManager.toggleModule('test-module');
    if (mockModule.isActive()) {
        stageManager.toggleModule('test-module');
        if (!mockModule.isActive()) {
            console.log('✓ Test 5 PASSED: Toggle module works');
            testsPassed++;
        } else {
            throw new Error('Module was not toggled to inactive');
        }
    } else {
        throw new Error('Module was not toggled to active');
    }
} catch (error) {
    console.error('✗ Test 5 FAILED:', error.message);
    testsFailed++;
}

// Test 6: Get Active Modules
try {
    const mapManager = new MockMapManager();
    const stageManager = new StageManager(mapManager);
    const mockModule1 = new MockModule('module-1');
    const mockModule2 = new MockModule('module-2');
    stageManager.registerModule('module-1', mockModule1);
    stageManager.registerModule('module-2', mockModule2);
    stageManager.enableModule('module-1');
    const activeModules = stageManager.getActiveModules();
    if (activeModules.length === 1 && activeModules.includes('module-1')) {
        console.log('✓ Test 6 PASSED: Get active modules works');
        testsPassed++;
    } else {
        throw new Error('Active modules list is incorrect');
    }
} catch (error) {
    console.error('✗ Test 6 FAILED:', error.message);
    testsFailed++;
}

// Test 7: Is Module Active
try {
    const mapManager = new MockMapManager();
    const stageManager = new StageManager(mapManager);
    const mockModule = new MockModule('test-module');
    stageManager.registerModule('test-module', mockModule);
    if (!stageManager.isModuleActive('test-module')) {
        stageManager.enableModule('test-module');
        if (stageManager.isModuleActive('test-module')) {
            console.log('✓ Test 7 PASSED: Is module active works');
            testsPassed++;
        } else {
            throw new Error('Module should be active');
        }
    } else {
        throw new Error('Module should not be active initially');
    }
} catch (error) {
    console.error('✗ Test 7 FAILED:', error.message);
    testsFailed++;
}

// Test 8: Get Conflicts
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
        console.log('✓ Test 8 PASSED: Get conflicts works');
        testsPassed++;
    } else {
        throw new Error('Should have detected heatmap conflict');
    }
} catch (error) {
    console.error('✗ Test 8 FAILED:', error.message);
    testsFailed++;
}

// Test 9: Error on Non-Existent Module
try {
    const mapManager = new MockMapManager();
    const stageManager = new StageManager(mapManager);
    try {
        stageManager.enableModule('non-existent');
        throw new Error('Should have thrown error for non-existent module');
    } catch (error) {
        if (error.message.includes('not found')) {
            console.log('✓ Test 9 PASSED: Error on non-existent module works');
            testsPassed++;
        } else {
            throw error;
        }
    }
} catch (error) {
    console.error('✗ Test 9 FAILED:', error.message);
    testsFailed++;
}

// Test 10: Prevent Duplicate Registration
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
            console.log('✓ Test 10 PASSED: Duplicate registration prevented');
            testsPassed++;
        } else {
            throw error;
        }
    }
} catch (error) {
    console.error('✗ Test 10 FAILED:', error.message);
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
