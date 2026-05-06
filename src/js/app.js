/**
 * Google Maps Workshop - Main Application File
 * 
 * This file will contain the core management classes and feature modules
 * for demonstrating Google Maps JavaScript API capabilities.
 * 
 * Current Status: Implementing MapManager class
 * Next Steps: Implement StageManager, StateManager, and feature modules
 */

/**
 * MapManager Class
 * 
 * Manages the Google Maps instance lifecycle and provides centralized access.
 * Handles map initialization, API key validation, and error handling.
 */
class MapManager {
    /**
     * Create a MapManager instance
     * @param {string} containerId - The ID of the HTML element to contain the map
     * @param {Object} config - Map configuration object
     * @param {Object} config.center - Map center coordinates {lat: number, lng: number}
     * @param {number} config.zoom - Initial zoom level
     * @param {string} config.mapTypeId - Map type (roadmap, satellite, hybrid, terrain)
     * @param {boolean} config.zoomControl - Enable zoom control
     * @param {boolean} config.mapTypeControl - Enable map type control
     * @param {boolean} config.streetViewControl - Enable street view control
     * @param {boolean} config.fullscreenControl - Enable fullscreen control
     */
    constructor(containerId, config) {
        this.containerId = containerId;
        this.config = config;
        this.map = null;
        this.initialized = false;
    }

    /**
     * Validate that the Google Maps API is loaded and available
     * @returns {boolean} True if API is available, false otherwise
     */
    validateApiKey() {
        if (typeof google === 'undefined' || !google.maps) {
            return false;
        }
        return true;
    }

    /**
     * Initialize the Google Maps instance
     * @returns {Promise<google.maps.Map>} Promise that resolves with the map instance
     * @throws {Error} If Google Maps API is not loaded or container element not found
     */
    async initMap() {
        // Validate API key
        if (!this.validateApiKey()) {
            const errorMessage = 'Google Maps API not loaded. Please check your API key and ensure the Google Maps JavaScript API is included in your HTML.';
            console.error(errorMessage);

            // Display error in map container
            const container = document.getElementById(this.containerId);
            if (container) {
                container.innerHTML = `
          <div style="padding: 20px; text-align: center; color: #d32f2f; background-color: #ffebee; border: 2px solid #d32f2f; border-radius: 4px;">
            <h2>Google Maps API Error</h2>
            <p>${errorMessage}</p>
            <p>Please follow the setup instructions in README.md</p>
          </div>
        `;
            }

            throw new Error(errorMessage);
        }

        // Check if container element exists
        const container = document.getElementById(this.containerId);
        if (!container) {
            const errorMessage = `Map container element with ID "${this.containerId}" not found.`;
            console.error(errorMessage);
            throw new Error(errorMessage);
        }

        try {
            // Create the map instance
            this.map = new google.maps.Map(container, {
                center: this.config.center || { lat: 0, lng: 0 },
                zoom: this.config.zoom || 10,
                mapTypeId: this.config.mapTypeId || 'roadmap',
                zoomControl: this.config.zoomControl !== undefined ? this.config.zoomControl : true,
                mapTypeControl: this.config.mapTypeControl !== undefined ? this.config.mapTypeControl : true,
                streetViewControl: this.config.streetViewControl !== undefined ? this.config.streetViewControl : true,
                fullscreenControl: this.config.fullscreenControl !== undefined ? this.config.fullscreenControl : true
            });

            this.initialized = true;

            console.log('Map initialized successfully');
            console.log('Map center:', this.config.center);
            console.log('Map zoom:', this.config.zoom);

            return this.map;
        } catch (error) {
            const errorMessage = `Failed to initialize map: ${error.message}`;
            console.error(errorMessage);
            throw new Error(errorMessage);
        }
    }

    /**
     * Get the map instance
     * @returns {google.maps.Map|null} The map instance or null if not initialized
     */
    getMap() {
        return this.map;
    }

    /**
     * Check if the map has been initialized
     * @returns {boolean} True if map is initialized, false otherwise
     */
    isInitialized() {
        return this.initialized;
    }
}

/**
 * StageManager Class
 * 
 * Orchestrates feature modules and provides toggle functionality.
 * Manages module lifecycle, prevents conflicts, and tracks active modules.
 */
class StageManager {
    /**
     * Create a StageManager instance
     * @param {MapManager} mapManager - The MapManager instance providing access to the map
     */
    constructor(mapManager) {
        this.mapManager = mapManager;
        this.modules = new Map(); // Internal registry of modules
    }

    /**
     * Register a module with the stage manager
     * @param {string} name - Unique identifier for the module
     * @param {Object} module - Module instance with enable(), disable(), and isActive() methods
     * @throws {Error} If module name is already registered or module is invalid
     */
    registerModule(name, module) {
        if (this.modules.has(name)) {
            throw new Error(`Module "${name}" is already registered`);
        }

        // Validate module interface
        if (!module || typeof module.enable !== 'function' ||
            typeof module.disable !== 'function' ||
            typeof module.isActive !== 'function') {
            throw new Error(`Module "${name}" must implement enable(), disable(), and isActive() methods`);
        }

        this.modules.set(name, module);
        console.log(`Module "${name}" registered successfully`);
    }

    /**
     * Enable a module by name
     * @param {string} name - Name of the module to enable
     * @returns {Promise<void>}
     * @throws {Error} If module does not exist
     */
    async enableModule(name) {
        if (!this.modules.has(name)) {
            throw new Error(`Module "${name}" not found. Available modules: ${Array.from(this.modules.keys()).join(', ')}`);
        }

        const module = this.modules.get(name);

        // Check for conflicts and warn (but don't block)
        const conflicts = this.getConflicts(name);
        if (conflicts.length > 0) {
            console.warn(`Enabling "${name}" while ${conflicts.join(', ')} are active may cause visual overlap.`);
        }

        try {
            await module.enable();
            console.log(`Module "${name}" enabled successfully`);
        } catch (error) {
            console.error(`Failed to enable module "${name}":`, error);
            throw error;
        }
    }

    /**
     * Disable a module by name
     * @param {string} name - Name of the module to disable
     * @throws {Error} If module does not exist
     */
    disableModule(name) {
        if (!this.modules.has(name)) {
            throw new Error(`Module "${name}" not found. Available modules: ${Array.from(this.modules.keys()).join(', ')}`);
        }

        const module = this.modules.get(name);

        try {
            module.disable();
            console.log(`Module "${name}" disabled successfully`);
        } catch (error) {
            console.error(`Failed to disable module "${name}":`, error);
            throw error;
        }
    }

    /**
     * Toggle a module - enable if inactive, disable if active
     * @param {string} name - Name of the module to toggle
     * @returns {Promise<void>}
     * @throws {Error} If module does not exist
     */
    async toggleModule(name) {
        if (!this.modules.has(name)) {
            throw new Error(`Module "${name}" not found. Available modules: ${Array.from(this.modules.keys()).join(', ')}`);
        }

        const module = this.modules.get(name);

        if (module.isActive()) {
            this.disableModule(name);
        } else {
            await this.enableModule(name);
        }
    }

    /**
     * Get array of currently active module names
     * @returns {string[]} Array of active module names
     */
    getActiveModules() {
        const activeModules = [];

        for (const [name, module] of this.modules.entries()) {
            if (module.isActive()) {
                activeModules.push(name);
            }
        }

        return activeModules;
    }

    /**
     * Check if a specific module is currently active
     * @param {string} name - Name of the module to check
     * @returns {boolean} True if module is active, false otherwise
     * @throws {Error} If module does not exist
     */
    isModuleActive(name) {
        if (!this.modules.has(name)) {
            throw new Error(`Module "${name}" not found. Available modules: ${Array.from(this.modules.keys()).join(', ')}`);
        }

        const module = this.modules.get(name);
        return module.isActive();
    }

    /**
     * Get conflicts for a given module
     * Returns array of currently active modules that may conflict with the specified module
     * @param {string} name - Name of the module to check for conflicts
     * @returns {string[]} Array of conflicting module names that are currently active
     */
    getConflicts(name) {
        // Define conflict rules - modules that may have visual overlap
        const conflictMap = {
            'clustering': ['heatmap'],
            'heatmap': ['clustering']
        };

        const potentialConflicts = conflictMap[name] || [];

        // Return only conflicts that are currently active
        return potentialConflicts.filter(conflictName => {
            if (this.modules.has(conflictName)) {
                const module = this.modules.get(conflictName);
                return module.isActive();
            }
            return false;
        });
    }
}

/**
 * StateManager Class
 * 
 * Tracks application state for debugging and persistence.
 * Provides methods for state management, export, and import.
 */
class StateManager {
    /**
     * Create a StateManager instance
     */
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

    /**
     * Get the current state object
     * @returns {Object} Current state with mapInitialized, apiKeyValid, activeModules, mapCenter, mapZoom, and moduleStates
     */
    getState() {
        return { ...this.state };
    }

    /**
     * Update a state property
     * @param {string} key - The state property key to update
     * @param {*} value - The new value for the property
     */
    setState(key, value) {
        this.state[key] = value;
    }

    /**
     * Reset state to initial values
     */
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

    /**
     * Export current state as JSON string
     * @returns {string} JSON string representation of current state
     */
    exportState() {
        return JSON.stringify(this.state, null, 2);
    }

    /**
     * Import state from JSON string
     * @param {string} stateJson - JSON string containing state to import
     * @throws {Error} If stateJson is invalid JSON
     */
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

// Global map instance (will be initialized by initMap callback)
let map;

/**
 * Initialize the Google Map
 * This function is called by the Google Maps API callback
 */
function initMap() {
    // Check if Google Maps API is loaded
    if (typeof google === 'undefined' || !google.maps) {
        console.error('Google Maps API not loaded');
        return;
    }

    // Create map centered on Kampala, Uganda
    const kampalaCenter = { lat: 0.3476, lng: 32.5825 };

    map = new google.maps.Map(document.getElementById('map'), {
        center: kampalaCenter,
        zoom: 12,
        mapTypeId: 'roadmap',
        zoomControl: true,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true
    });

    console.log('Map initialized successfully');
    console.log('Map center:', kampalaCenter);
    console.log('Available sample points:', samplePoints.length);

    // Log available features for workshop demonstration
    console.log('\n=== Google Maps Workshop ===');
    console.log('Map is ready for feature demonstrations');
    console.log('Sample data loaded:', samplePoints.length, 'points');
    console.log('\nFeature modules will be implemented in subsequent tasks:');
    console.log('- Marker Clustering');
    console.log('- Heatmap Visualization');
    console.log('- Places API Autocomplete');
    console.log('- GeoJSON Overlay');
}

/**
 * ClusterModule Class
 * 
 * Implements marker clustering using @googlemaps/markerclusterer library.
 * Creates markers from data points and groups them into clusters for better visualization.
 */
class ClusterModule {
    /**
     * Create a ClusterModule instance
     * @param {google.maps.Map} map - The Google Maps instance
     * @param {Array} dataPoints - Array of data points with lat, lng, title, and description
     */
    constructor(map, dataPoints) {
        this.map = map;
        this.dataPoints = dataPoints;
        this.markers = [];
        this.clusterer = null;
        this.infoWindow = null;
        this.active = false;
    }

    /**
     * Enable the clustering module
     * Creates markers from dataPoints and initializes MarkerClusterer
     */
    enable() {
        // Check if MarkerClusterer library is loaded
        if (typeof markerClusterer === 'undefined' || !markerClusterer.MarkerClusterer) {
            const errorMessage = 'MarkerClusterer library not loaded. Please ensure @googlemaps/markerclusterer is included in your HTML.';
            console.error(errorMessage);
            alert(errorMessage);
            return;
        }

        // Create info window for marker clicks
        this.infoWindow = new google.maps.InfoWindow();

        // Create markers from data points
        this.markers = this.dataPoints.map((dataPoint) => {
            const marker = new google.maps.Marker({
                position: { lat: dataPoint.lat, lng: dataPoint.lng },
                title: dataPoint.title || `Location (${dataPoint.lat.toFixed(4)}, ${dataPoint.lng.toFixed(4)})`,
                map: null // Don't add to map yet - clusterer will handle this
            });

            // Add click event listener to show info window
            marker.addListener('click', () => {
                const content = `
                    <div style="padding: 10px;">
                        <h3 style="margin: 0 0 8px 0; color: #1a73e8;">${marker.title}</h3>
                        ${dataPoint.description ? `<p style="margin: 0; color: #5f6368;">${dataPoint.description}</p>` : ''}
                        <p style="margin: 8px 0 0 0; font-size: 12px; color: #80868b;">
                            Coordinates: ${dataPoint.lat.toFixed(4)}, ${dataPoint.lng.toFixed(4)}
                        </p>
                    </div>
                `;
                this.infoWindow.setContent(content);
                this.infoWindow.open(this.map, marker);
            });

            return marker;
        });

        // Initialize MarkerClusterer
        this.clusterer = new markerClusterer.MarkerClusterer({
            map: this.map,
            markers: this.markers
        });

        this.active = true;
        console.log(`Clustering enabled with ${this.markers.length} markers`);
    }

    /**
     * Disable the clustering module
     * Clears all markers and removes clusterer from map
     */
    disable() {
        if (!this.active) {
            return;
        }

        // Close info window if open
        if (this.infoWindow) {
            this.infoWindow.close();
        }

        // Clear clusterer
        if (this.clusterer) {
            this.clusterer.clearMarkers();
            this.clusterer.setMap(null);
            this.clusterer = null;
        }

        // Clear markers
        this.markers.forEach(marker => {
            marker.setMap(null);
        });
        this.markers = [];

        this.active = false;
        console.log('Clustering disabled');
    }

    /**
     * Check if the clustering module is currently active
     * @returns {boolean} True if active, false otherwise
     */
    isActive() {
        return this.active;
    }

    /**
     * Update the data points and refresh markers
     * @param {Array} dataPoints - New array of data points
     */
    updateData(dataPoints) {
        const wasActive = this.active;

        // Disable current clustering
        if (wasActive) {
            this.disable();
        }

        // Update data points
        this.dataPoints = dataPoints;

        // Re-enable if it was active
        if (wasActive) {
            this.enable();
        }

        console.log(`Clustering data updated with ${dataPoints.length} points`);
    }

    /**
     * Get the MarkerClusterer instance
     * @returns {markerClusterer.MarkerClusterer|null} The clusterer instance or null if not active
     */
    getClusterer() {
        return this.clusterer;
    }
}

/**
 * HeatmapModule Class
 * 
 * Implements heatmap visualization using Google Maps Visualization library.
 * Renders data density visualization with customizable gradient, radius, and opacity.
 */
class HeatmapModule {
    /**
     * Create a HeatmapModule instance
     * @param {google.maps.Map} map - The Google Maps instance
     * @param {Array} dataPoints - Array of data points with lat, lng, and optional weight
     */
    constructor(map, dataPoints) {
        this.map = map;
        this.dataPoints = dataPoints;
        this.heatmap = null;
        this.active = false;
    }

    /**
     * Enable the heatmap module
     * Converts dataPoints to google.maps.LatLng objects and creates HeatmapLayer
     */
    enable() {
        // Check if Visualization library is loaded
        if (typeof google === 'undefined' || !google.maps || !google.maps.visualization) {
            const errorMessage = 'Visualization library not loaded. Add "visualization" to libraries parameter in Google Maps API script tag.';
            console.error(errorMessage);
            alert(errorMessage);
            return;
        }

        // Convert data points to google.maps.LatLng objects with optional weights
        const heatmapData = this.dataPoints.map((dataPoint) => {
            const location = new google.maps.LatLng(dataPoint.lat, dataPoint.lng);

            // If weight is provided, create weighted location
            if (dataPoint.weight !== undefined && dataPoint.weight !== null) {
                return {
                    location: location,
                    weight: dataPoint.weight
                };
            }

            // Otherwise, return just the location
            return location;
        });

        // Create HeatmapLayer
        this.heatmap = new google.maps.visualization.HeatmapLayer({
            data: heatmapData,
            map: this.map
        });

        // Configure default gradient (blue -> cyan -> green -> yellow -> red)
        this.heatmap.set('gradient', [
            'rgba(0, 255, 255, 0)',
            'rgba(0, 255, 255, 1)',
            'rgba(0, 191, 255, 1)',
            'rgba(0, 127, 255, 1)',
            'rgba(0, 63, 255, 1)',
            'rgba(0, 0, 255, 1)',
            'rgba(0, 0, 223, 1)',
            'rgba(0, 0, 191, 1)',
            'rgba(0, 0, 159, 1)',
            'rgba(0, 0, 127, 1)',
            'rgba(63, 0, 91, 1)',
            'rgba(127, 0, 63, 1)',
            'rgba(191, 0, 31, 1)',
            'rgba(255, 0, 0, 1)'
        ]);

        // Configure default radius (in pixels)
        this.heatmap.set('radius', 20);

        // Configure default opacity (0.0 to 1.0)
        this.heatmap.set('opacity', 0.6);

        this.active = true;
        console.log(`Heatmap enabled with ${this.dataPoints.length} data points`);
    }

    /**
     * Disable the heatmap module
     * Removes heatmap layer from map
     */
    disable() {
        if (!this.active) {
            return;
        }

        // Remove heatmap from map
        if (this.heatmap) {
            this.heatmap.setMap(null);
        }

        this.active = false;
        console.log('Heatmap disabled');
    }

    /**
     * Check if the heatmap module is currently active
     * @returns {boolean} True if active, false otherwise
     */
    isActive() {
        return this.active;
    }

    /**
     * Update the data points and refresh heatmap
     * @param {Array} dataPoints - New array of data points
     */
    updateData(dataPoints) {
        this.dataPoints = dataPoints;

        // If heatmap is active, update the data
        if (this.active && this.heatmap) {
            // Convert new data points to heatmap data format
            const heatmapData = this.dataPoints.map((dataPoint) => {
                const location = new google.maps.LatLng(dataPoint.lat, dataPoint.lng);

                if (dataPoint.weight !== undefined && dataPoint.weight !== null) {
                    return {
                        location: location,
                        weight: dataPoint.weight
                    };
                }

                return location;
            });

            // Update heatmap data
            this.heatmap.setData(heatmapData);
            console.log(`Heatmap data updated with ${dataPoints.length} points`);
        }
    }

    /**
     * Set custom color gradient for heatmap
     * @param {Array<string>} colors - Array of CSS color strings (e.g., ['rgba(0,255,0,0)', 'rgba(255,0,0,1)'])
     */
    setGradient(colors) {
        if (this.heatmap) {
            this.heatmap.set('gradient', colors);
            console.log('Heatmap gradient updated');
        }
    }

    /**
     * Set heat radius in pixels
     * @param {number} radius - Radius of influence for each data point in pixels
     */
    setRadius(radius) {
        if (this.heatmap) {
            this.heatmap.set('radius', radius);
            console.log(`Heatmap radius set to ${radius} pixels`);
        }
    }

    /**
     * Set heatmap layer opacity
     * @param {number} opacity - Opacity value between 0.0 (transparent) and 1.0 (opaque)
     */
    setOpacity(opacity) {
        if (this.heatmap) {
            this.heatmap.set('opacity', opacity);
            console.log(`Heatmap opacity set to ${opacity}`);
        }
    }

    /**
     * Get the HeatmapLayer instance
     * @returns {google.maps.visualization.HeatmapLayer|null} The heatmap instance or null if not active
     */
    getHeatmap() {
        return this.heatmap;
    }
}

/**
 * PlacesModule Class
 * 
 * Implements location search with autocomplete functionality using Google Places API.
 * Allows users to search for locations and automatically centers the map on selected places.
 */
class PlacesModule {
    /**
     * Create a PlacesModule instance
     * @param {google.maps.Map} map - The Google Maps instance
     * @param {string} inputElementId - The ID of the HTML input element for autocomplete
     */
    constructor(map, inputElementId) {
        this.map = map;
        this.inputElementId = inputElementId;
        this.autocomplete = null;
        this.marker = null;
        this.infoWindow = null;
        this.placeChangedListener = null;
        this.active = false;
    }

    /**
     * Enable the places module
     * Creates Autocomplete instance and attaches it to the input element
     */
    enable() {
        // Check if Places library is loaded
        if (typeof google === 'undefined' || !google.maps || !google.maps.places) {
            const errorMessage = 'Places library not loaded. Add "places" to libraries parameter in Google Maps API script tag.';
            console.error(errorMessage);
            alert(errorMessage);
            return;
        }

        // Get the input element
        const inputElement = document.getElementById(this.inputElementId);
        if (!inputElement) {
            const errorMessage = `Input element with ID "${this.inputElementId}" not found.`;
            console.error(errorMessage);
            alert(errorMessage);
            return;
        }

        // Create Autocomplete instance
        this.autocomplete = new google.maps.places.Autocomplete(inputElement);

        // Bind autocomplete to map bounds (optional - biases results to visible area)
        this.autocomplete.bindTo('bounds', this.map);

        // Create info window for place details
        this.infoWindow = new google.maps.InfoWindow();

        // Add place_changed event listener
        this.placeChangedListener = this.autocomplete.addListener('place_changed', () => {
            this.handlePlaceSelection();
        });

        this.active = true;
        console.log('Places autocomplete enabled');
    }

    /**
     * Handle place selection from autocomplete
     * Centers map on selected place and adds marker
     */
    handlePlaceSelection() {
        // Close any open info window
        if (this.infoWindow) {
            this.infoWindow.close();
        }

        // Get the selected place
        const place = this.autocomplete.getPlace();

        // Validate place has geometry
        if (!place.geometry || !place.geometry.location) {
            const errorMessage = `No details available for input: '${place.name}'`;
            console.warn(errorMessage);
            alert(errorMessage);
            return;
        }

        // Clear existing marker if any
        this.clearMarker();

        // Center map on place location
        if (place.geometry.viewport) {
            // If place has a viewport (e.g., city, region), fit to viewport
            this.map.fitBounds(place.geometry.viewport);
        } else {
            // Otherwise, center on the location and set zoom
            this.map.setCenter(place.geometry.location);
            this.map.setZoom(15);
        }

        // Create marker at place location
        this.marker = new google.maps.Marker({
            map: this.map,
            position: place.geometry.location,
            title: place.name || 'Selected Place',
            animation: google.maps.Animation.DROP
        });

        // Prepare info window content
        const contentParts = [];

        if (place.name) {
            contentParts.push(`<h3 style="margin: 0 0 8px 0; color: #1a73e8;">${place.name}</h3>`);
        }

        if (place.formatted_address) {
            contentParts.push(`<p style="margin: 0; color: #5f6368;">${place.formatted_address}</p>`);
        }

        if (place.geometry && place.geometry.location) {
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            contentParts.push(`<p style="margin: 8px 0 0 0; font-size: 12px; color: #80868b;">Coordinates: ${lat.toFixed(4)}, ${lng.toFixed(4)}</p>`);
        }

        const content = `<div style="padding: 10px;">${contentParts.join('')}</div>`;

        // Display info window
        this.infoWindow.setContent(content);
        this.infoWindow.open(this.map, this.marker);

        console.log('Place selected:', place.name || place.formatted_address);
    }

    /**
     * Disable the places module
     * Removes event listeners and clears marker
     */
    disable() {
        if (!this.active) {
            return;
        }

        // Remove place_changed event listener
        if (this.placeChangedListener) {
            google.maps.event.removeListener(this.placeChangedListener);
            this.placeChangedListener = null;
        }

        // Close and clear info window
        if (this.infoWindow) {
            this.infoWindow.close();
            this.infoWindow = null;
        }

        // Clear marker
        this.clearMarker();

        // Clear autocomplete reference (but don't remove from input - it's part of the UI)
        this.autocomplete = null;

        this.active = false;
        console.log('Places autocomplete disabled');
    }

    /**
     * Check if the places module is currently active
     * @returns {boolean} True if active, false otherwise
     */
    isActive() {
        return this.active;
    }

    /**
     * Get the Autocomplete instance
     * @returns {google.maps.places.Autocomplete|null} The autocomplete instance or null if not active
     */
    getAutocomplete() {
        return this.autocomplete;
    }

    /**
     * Clear the current place marker
     */
    clearMarker() {
        if (this.marker) {
            this.marker.setMap(null);
            this.marker = null;
        }
    }
}

// Make initMap available globally for Google Maps callback
window.initMap = initMap;

/**
 * GeoJSONModule Class
 * 
 * Implements GeoJSON data overlay functionality using Google Maps Data layer.
 * Loads external GeoJSON data and displays it on the map with custom styling and interactivity.
 */
class GeoJSONModule {
    /**
     * Create a GeoJSONModule instance
     * @param {google.maps.Map} map - The Google Maps instance
     * @param {string} geoJsonUrl - URL to the GeoJSON file (local or remote)
     */
    constructor(map, geoJsonUrl) {
        this.map = map;
        this.geoJsonUrl = geoJsonUrl;
        this.infoWindow = null;
        this.clickListener = null;
        this.active = false;
    }

    /**
     * Enable the GeoJSON module
     * Loads GeoJSON data from the specified URL and displays it on the map
     * @returns {Promise<void>}
     */
    async enable() {
        try {
            // Load GeoJSON data
            await this.loadGeoJson(this.geoJsonUrl);

            // Apply custom styling to features
            this.map.data.setStyle({
                fillColor: '#4285F4',
                strokeColor: '#1967D2',
                strokeWeight: 2,
                fillOpacity: 0.3
            });

            // Create info window for feature clicks
            this.infoWindow = new google.maps.InfoWindow();

            // Add click event listener to features
            this.clickListener = this.map.data.addListener('click', (event) => {
                this.handleFeatureClick(event);
            });

            this.active = true;
            console.log('GeoJSON overlay enabled');
        } catch (error) {
            console.error('Failed to enable GeoJSON module:', error);
            throw error;
        }
    }

    /**
     * Load GeoJSON data from a URL
     * @param {string} url - URL to the GeoJSON file
     * @returns {Promise<void>}
     * @throws {Error} If fetch fails, JSON is invalid, or GeoJSON structure is invalid
     */
    async loadGeoJson(url) {
        try {
            // Fetch GeoJSON data
            const response = await fetch(url);

            // Validate response status
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            // Parse JSON
            const data = await response.json();

            // Validate GeoJSON structure
            if (!data.type || data.type !== 'FeatureCollection') {
                throw new Error('Invalid GeoJSON format: expected type "FeatureCollection"');
            }

            // Load GeoJSON into map data layer
            this.map.data.addGeoJson(data);

            console.log(`GeoJSON loaded successfully from ${url}`);
            console.log(`Features loaded: ${data.features ? data.features.length : 0}`);
        } catch (error) {
            // Handle different error types
            if (error instanceof TypeError) {
                // Network error or fetch failure
                const errorMessage = `Failed to fetch GeoJSON from ${url}: Network error or invalid URL`;
                console.error(errorMessage);
                alert(errorMessage);
                throw new Error(errorMessage);
            } else if (error instanceof SyntaxError) {
                // JSON parsing error
                const errorMessage = `Failed to parse GeoJSON from ${url}: Invalid JSON format`;
                console.error(errorMessage);
                alert(errorMessage);
                throw new Error(errorMessage);
            } else {
                // Other errors (validation, HTTP errors)
                const errorMessage = `Failed to load GeoJSON: ${error.message}`;
                console.error(errorMessage);
                alert(errorMessage);
                throw error;
            }
        }
    }

    /**
     * Handle feature click events
     * Displays info window with feature properties
     * @param {google.maps.Data.MouseEvent} event - The click event
     */
    handleFeatureClick(event) {
        const feature = event.feature;
        const properties = {};

        // Extract all feature properties
        feature.forEachProperty((value, key) => {
            properties[key] = value;
        });

        // Build info window content
        const contentParts = [];

        // Add feature name if available
        if (properties.name) {
            contentParts.push(`<h3 style="margin: 0 0 8px 0; color: #1a73e8;">${properties.name}</h3>`);
        }

        // Add feature description if available
        if (properties.description) {
            contentParts.push(`<p style="margin: 0 0 8px 0; color: #5f6368;">${properties.description}</p>`);
        }

        // Add other properties
        const otherProperties = Object.entries(properties)
            .filter(([key]) => key !== 'name' && key !== 'description')
            .map(([key, value]) => `<strong>${key}:</strong> ${value}`)
            .join('<br>');

        if (otherProperties) {
            contentParts.push(`<div style="font-size: 12px; color: #80868b;">${otherProperties}</div>`);
        }

        // If no properties, show default message
        if (contentParts.length === 0) {
            contentParts.push('<p style="margin: 0; color: #5f6368;">No properties available</p>');
        }

        const content = `<div style="padding: 10px; max-width: 300px;">${contentParts.join('')}</div>`;

        // Set info window content and position
        this.infoWindow.setContent(content);
        this.infoWindow.setPosition(event.latLng);
        this.infoWindow.open(this.map);

        console.log('Feature clicked:', properties.name || 'Unnamed feature');
    }

    /**
     * Disable the GeoJSON module
     * Removes all features from the map
     */
    disable() {
        if (!this.active) {
            return;
        }

        // Close info window if open
        if (this.infoWindow) {
            this.infoWindow.close();
        }

        // Remove click event listener
        if (this.clickListener) {
            google.maps.event.removeListener(this.clickListener);
            this.clickListener = null;
        }

        // Remove all features from the map
        this.map.data.forEach((feature) => {
            this.map.data.remove(feature);
        });

        this.active = false;
        console.log('GeoJSON overlay disabled');
    }

    /**
     * Check if the GeoJSON module is currently active
     * @returns {boolean} True if active, false otherwise
     */
    isActive() {
        return this.active;
    }

    /**
     * Set custom styling for GeoJSON features
     * @param {google.maps.Data.StyleOptions|function} styleFunction - Style options or function
     */
    setStyle(styleFunction) {
        if (this.active) {
            this.map.data.setStyle(styleFunction);
            console.log('GeoJSON style updated');
        }
    }

    /**
     * Clear all features from the map
     * This is a convenience method that can be called independently of disable()
     */
    clearFeatures() {
        this.map.data.forEach((feature) => {
            this.map.data.remove(feature);
        });
        console.log('All GeoJSON features cleared');
    }
}

// ============================================================================
// APPLICATION INITIALIZATION
// ============================================================================

// Global instances
let mapManager;
let stageManager;
let stateManager;

/**
 * Initialize the application on page load
 * Sets up MapManager, StateManager, StageManager, and all feature modules
 */
document.addEventListener('DOMContentLoaded', async () => {
    console.log('=== Google Maps Workshop - Application Initializing ===');

    try {
        // Wait for Google Maps API to load
        // The initMap callback will be called by the API
        console.log('Waiting for Google Maps API to load...');
    } catch (error) {
        console.error('Failed to initialize application:', error);
    }
});

/**
 * Initialize the application after Google Maps API is loaded
 * This function is called by the Google Maps API callback
 */
async function initializeApp() {
    try {
        // Create MapManager instance
        const kampalaCenter = { lat: 0.3476, lng: 32.5825 };
        mapManager = new MapManager('map', {
            center: kampalaCenter,
            zoom: 12,
            mapTypeId: 'roadmap',
            zoomControl: true,
            mapTypeControl: true,
            streetViewControl: true,
            fullscreenControl: true
        });

        // Initialize the map
        const map = await mapManager.initMap();
        console.log('✓ MapManager initialized');

        // Create StateManager instance
        stateManager = new StateManager();
        stateManager.setState('mapInitialized', true);
        stateManager.setState('apiKeyValid', true);
        stateManager.setState('mapCenter', kampalaCenter);
        stateManager.setState('mapZoom', 12);
        console.log('✓ StateManager initialized');

        // Create StageManager instance
        stageManager = new StageManager(mapManager);
        console.log('✓ StageManager initialized');

        // Create and register feature modules
        const clusterModule = new ClusterModule(map, samplePoints);
        stageManager.registerModule('clustering', clusterModule);
        console.log('✓ ClusterModule registered');

        const heatmapModule = new HeatmapModule(map, samplePoints);
        stageManager.registerModule('heatmap', heatmapModule);
        console.log('✓ HeatmapModule registered');

        const placesModule = new PlacesModule(map, 'search-input');
        stageManager.registerModule('places', placesModule);
        console.log('✓ PlacesModule registered');

        const geoJsonModule = new GeoJSONModule(map, 'src/data/sample-data.geojson');
        stageManager.registerModule('geojson', geoJsonModule);
        console.log('✓ GeoJSONModule registered');

        // Expose global toggle functions
        exposeGlobalFunctions();

        console.log('\n=== Application Ready ===');
        console.log('All modules registered and ready for demonstration');
        console.log('Available sample points:', samplePoints.length);
        console.log('\nTry these commands in the console:');
        console.log('  enableClustering()  - Show marker clusters');
        console.log('  enableHeatmap()     - Show heatmap visualization');
        console.log('  enablePlaces()      - Enable location search');
        console.log('  enableGeoJSON()     - Show GeoJSON overlay');
        console.log('  getActiveModules()  - List active modules');
        console.log('  getState()          - View application state');
        console.log('\nFor more commands, type: help()');

    } catch (error) {
        console.error('Failed to initialize application:', error);
    }
}

/**
 * Expose global toggle functions for live demonstrations
 * Makes all module controls accessible from browser console
 */
function exposeGlobalFunctions() {
    // Clustering module functions
    window.enableClustering = () => stageManager.enableModule('clustering');
    window.disableClustering = () => stageManager.disableModule('clustering');
    window.toggleClustering = () => stageManager.toggleModule('clustering');

    // Heatmap module functions
    window.enableHeatmap = () => stageManager.enableModule('heatmap');
    window.disableHeatmap = () => stageManager.disableModule('heatmap');
    window.toggleHeatmap = () => stageManager.toggleModule('heatmap');

    // Places module functions
    window.enablePlaces = () => stageManager.enableModule('places');
    window.disablePlaces = () => stageManager.disableModule('places');
    window.togglePlaces = () => stageManager.toggleModule('places');

    // GeoJSON module functions
    window.enableGeoJSON = () => stageManager.enableModule('geojson');
    window.disableGeoJSON = () => stageManager.disableModule('geojson');
    window.toggleGeoJSON = () => stageManager.toggleModule('geojson');

    // Utility functions
    window.getActiveModules = () => {
        const active = stageManager.getActiveModules();
        console.log('Active modules:', active.length > 0 ? active.join(', ') : 'None');
        return active;
    };

    window.getState = () => {
        const state = stateManager.getState();
        console.log('Application state:', state);
        return state;
    };

    // Help function
    window.help = () => {
        console.log('\n=== Available Commands ===\n');
        console.log('CLUSTERING:');
        console.log('  enableClustering()   - Enable marker clustering');
        console.log('  disableClustering()  - Disable marker clustering');
        console.log('  toggleClustering()   - Toggle marker clustering\n');

        console.log('HEATMAP:');
        console.log('  enableHeatmap()      - Enable heatmap visualization');
        console.log('  disableHeatmap()     - Disable heatmap visualization');
        console.log('  toggleHeatmap()      - Toggle heatmap visualization\n');

        console.log('PLACES:');
        console.log('  enablePlaces()       - Enable location search');
        console.log('  disablePlaces()      - Disable location search');
        console.log('  togglePlaces()       - Toggle location search\n');

        console.log('GEOJSON:');
        console.log('  enableGeoJSON()      - Enable GeoJSON overlay');
        console.log('  disableGeoJSON()     - Disable GeoJSON overlay');
        console.log('  toggleGeoJSON()      - Toggle GeoJSON overlay\n');

        console.log('UTILITIES:');
        console.log('  getActiveModules()   - List currently active modules');
        console.log('  getState()           - View application state');
        console.log('  help()               - Show this help message\n');
    };

    console.log('✓ Global toggle functions exposed');
}

// Override the original initMap function to call our initialization
const originalInitMap = window.initMap;
window.initMap = function () {
    // Call original initMap if it exists
    if (typeof originalInitMap === 'function') {
        originalInitMap();
    }

    // Initialize our application
    initializeApp();
};
