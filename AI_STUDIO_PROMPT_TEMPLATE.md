# Google AI Studio Prompt Template

Use this template to get AI assistance for building your AirQo pollution visualization project.

## How to Use This Template

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Create a new prompt
3. Copy the template below
4. Replace the placeholders with your actual API keys
5. Start asking questions about integrating AirQo data with Google Maps

---

## Template

```
You are an expert JavaScript developer helping me build a pollution visualization web application.

PROJECT CONTEXT:
I'm building a web app that visualizes air quality data from the AirQo API on Google Maps. 
This project is based on the Google Maps Workshop repository which includes:
- MapManager for Google Maps initialization
- StateManager for application state
- StageManager for module orchestration
- Feature modules: Clustering, Heatmap, Places, GeoJSON

MY API KEYS:
- Google Maps API Key: [PASTE YOUR GOOGLE MAPS API KEY HERE]
- AirQo API Key: [PASTE YOUR AIRQO API KEY HERE]

AIRQO API INFORMATION:
- Base URL: https://api.airqo.net/api/v2/devices/measurements
- Authentication: Include API key in request headers as 'Authorization: Bearer YOUR_API_KEY'
- Returns: Array of air quality measurements with location coordinates and PM2.5 values

WHAT I NEED HELP WITH:
[Describe what you want to build or the problem you're trying to solve]

Examples:
- "Help me fetch data from the AirQo API and display it as markers on the map"
- "Show me how to create a heatmap using AirQo PM2.5 values"
- "Help me add marker clustering for AirQo monitoring stations"
- "How do I transform AirQo data into the format needed for the HeatmapModule?"
```

---

## Quick Start Guide

### Step 1: Get Your API Keys

**Google Maps API Key:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Maps JavaScript API, Places API, and Visualization Library
4. Create credentials (API Key)

**AirQo API Key:**
- Provided by the AirQo team during the workshop

### Step 2: Test the Repository Code

1. Open `index.html` in your browser
2. Open the browser console (F12)
3. Try the example functions:
   - `enableClustering()`
   - `enableHeatmap()`
   - `enablePlaces()`
   - `enableGeoJSON()`

### Step 3: Plan Your Integration

Think about:
- What AirQo data do you want to visualize? (PM2.5, PM10, location)
- Which visualization works best? (markers, heatmap, clusters)
- Do you need real-time updates or static data?

### Step 4: Use AI Studio

Paste the template above into Google AI Studio and start asking specific questions about:
- Fetching data from AirQo API
- Transforming data formats
- Integrating with the existing modules
- Adding custom styling or features

---

## Common Project Ideas

1. **Basic Pollution Map**: Display AirQo monitoring stations as markers with PM2.5 values
2. **Pollution Heatmap**: Show pollution density across Kampala using heatmap visualization
3. **Station Finder**: Use Places API to search for locations and find nearby AirQo stations
4. **Comparison View**: Show both current and historical pollution data side-by-side
5. **Alert System**: Highlight areas with dangerous pollution levels in red

---

## Tips for Working with AI

- Be specific about what you want to achieve
- Share error messages if something doesn't work
- Ask for explanations if you don't understand the code
- Request step-by-step instructions for complex tasks
- Ask AI to explain how to integrate with the existing modules in the repo

---

## Need Help?

- Check the [README.md](README.md) for repository documentation
- Review the existing code in `src/js/app.js` for examples
- Ask workshop facilitators for assistance
- Refer to [Google Maps Documentation](https://developers.google.com/maps/documentation/javascript)

Good luck building your pollution visualization project!
