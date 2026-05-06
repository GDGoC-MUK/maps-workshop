/**
 * Sample data for Google Maps Workshop demonstrations
 * Region: Kampala, Uganda (approximately 0.3° N, 32.5° E)
 * 
 * Each data point contains:
 * - lat: Latitude coordinate
 * - lng: Longitude coordinate
 * - weight: Optional weight for heatmap visualization (0-100)
 * - title: Optional marker title
 * - description: Optional marker description
 */

const samplePoints = [
    // Central Kampala
    { lat: 0.3476, lng: 32.5825, weight: 85, title: "Kampala City Center", description: "Heart of Uganda's capital" },
    { lat: 0.3156, lng: 32.5811, weight: 90, title: "Nakasero Market", description: "Historic central market" },
    { lat: 0.3136, lng: 32.5656, weight: 75, title: "Makerere University", description: "Premier university in East Africa" },
    { lat: 0.3167, lng: 32.5833, weight: 80, title: "Parliament of Uganda", description: "Legislative building" },
    { lat: 0.3200, lng: 32.5700, weight: 70, title: "Mulago Hospital", description: "National referral hospital" },

    // Northern areas
    { lat: 0.3600, lng: 32.5900, weight: 65, title: "Ntinda", description: "Residential and commercial area" },
    { lat: 0.3750, lng: 32.6100, weight: 60, title: "Kyanja", description: "Growing suburb" },
    { lat: 0.3850, lng: 32.5950, weight: 55, title: "Kiwatule", description: "Residential neighborhood" },
    { lat: 0.3950, lng: 32.6200, weight: 50, title: "Najjera", description: "Suburban area" },
    { lat: 0.3400, lng: 32.6000, weight: 68, title: "Nakawa", description: "Industrial area" },

    // Eastern areas
    { lat: 0.3300, lng: 32.6200, weight: 72, title: "Bugolobi", description: "Upscale residential area" },
    { lat: 0.3250, lng: 32.6350, weight: 65, title: "Luzira", description: "Port area on Lake Victoria" },
    { lat: 0.3100, lng: 32.6400, weight: 58, title: "Port Bell", description: "Historic port town" },
    { lat: 0.3350, lng: 32.6100, weight: 70, title: "Mbuya", description: "Military and residential area" },
    { lat: 0.3450, lng: 32.6250, weight: 62, title: "Butabika", description: "Eastern suburb" },

    // Southern areas
    { lat: 0.2900, lng: 32.5700, weight: 78, title: "Rubaga", description: "Historic cathedral area" },
    { lat: 0.2800, lng: 32.5500, weight: 73, title: "Ndeeba", description: "Residential area" },
    { lat: 0.2700, lng: 32.5600, weight: 66, title: "Kibuye", description: "Southern neighborhood" },
    { lat: 0.2950, lng: 32.5900, weight: 75, title: "Nsambya", description: "Hospital and residential area" },
    { lat: 0.2850, lng: 32.6000, weight: 68, title: "Kabalagala", description: "Entertainment district" },

    // Western areas
    { lat: 0.3300, lng: 32.5400, weight: 70, title: "Mengo", description: "Cultural center of Buganda" },
    { lat: 0.3200, lng: 32.5300, weight: 65, title: "Lubaga", description: "Cathedral and residential area" },
    { lat: 0.3100, lng: 32.5200, weight: 60, title: "Nateete", description: "Western suburb" },
    { lat: 0.3400, lng: 32.5200, weight: 62, title: "Nakulabye", description: "Residential neighborhood" },
    { lat: 0.3500, lng: 32.5300, weight: 58, title: "Kasubi", description: "Royal tombs area" },

    // Additional scattered points for better clustering demonstration
    { lat: 0.3550, lng: 32.5750, weight: 64, title: "Kamwokya", description: "Urban neighborhood" },
    { lat: 0.3650, lng: 32.5850, weight: 59, title: "Bukoto", description: "Residential area" },
    { lat: 0.3280, lng: 32.5950, weight: 71, title: "Kololo", description: "Diplomatic area" },
    { lat: 0.3380, lng: 32.5750, weight: 69, title: "Wandegeya", description: "Student area" },
    { lat: 0.3050, lng: 32.5750, weight: 67, title: "Kibuli", description: "Historic mosque area" },

    { lat: 0.3420, lng: 32.5650, weight: 63, title: "Makerere Hill", description: "University campus area" },
    { lat: 0.3220, lng: 32.5550, weight: 66, title: "Old Kampala", description: "Historic district" },
    { lat: 0.3320, lng: 32.5850, weight: 74, title: "Nakasero Hill", description: "Government area" },
    { lat: 0.3180, lng: 32.5950, weight: 72, title: "Naguru", description: "Residential hill" },
    { lat: 0.3080, lng: 32.6100, weight: 65, title: "Nakawa Market", description: "Commercial center" },

    { lat: 0.2950, lng: 32.5500, weight: 61, title: "Katwe", description: "Industrial area" },
    { lat: 0.2850, lng: 32.5650, weight: 64, title: "Makindye", description: "Southern suburb" },
    { lat: 0.2750, lng: 32.5750, weight: 58, title: "Ggaba", description: "Lake Victoria shore" },
    { lat: 0.3750, lng: 32.5700, weight: 56, title: "Kisaasi", description: "Northern suburb" },
    { lat: 0.3850, lng: 32.5800, weight: 54, title: "Kulambiro", description: "Residential area" },

    { lat: 0.3150, lng: 32.5450, weight: 68, title: "Namirembe", description: "Cathedral area" },
    { lat: 0.3250, lng: 32.5350, weight: 62, title: "Lungujja", description: "Residential neighborhood" },
    { lat: 0.3350, lng: 32.5450, weight: 65, title: "Nakulabye Market", description: "Local market" },
    { lat: 0.3450, lng: 32.5550, weight: 67, title: "Bwaise", description: "Dense residential area" },
    { lat: 0.3550, lng: 32.5450, weight: 60, title: "Kazo", description: "Northern neighborhood" },

    { lat: 0.3650, lng: 32.5550, weight: 58, title: "Kawempe", description: "Northern division" },
    { lat: 0.3120, lng: 32.6250, weight: 69, title: "Mutungo", description: "Eastern suburb" },
    { lat: 0.3220, lng: 32.6150, weight: 71, title: "Bugolobi Flats", description: "Residential complex" },
    { lat: 0.2920, lng: 32.5800, weight: 66, title: "Nsambya Hospital", description: "Medical facility" },
    { lat: 0.3020, lng: 32.5650, weight: 64, title: "Kibuli Hospital", description: "Healthcare center" },

    // Additional points for density
    { lat: 0.3380, lng: 32.5880, weight: 76, title: "Garden City", description: "Shopping mall" },
    { lat: 0.3280, lng: 32.5780, weight: 73, title: "Acacia Mall", description: "Shopping center" },
    { lat: 0.3480, lng: 32.5980, weight: 68, title: "Lugogo", description: "Sports and commercial area" },
    { lat: 0.3580, lng: 32.6080, weight: 62, title: "Ntinda Complex", description: "Shopping area" },
    { lat: 0.3180, lng: 32.5680, weight: 70, title: "Bat Valley", description: "Natural area" },

    { lat: 0.3050, lng: 32.5850, weight: 72, title: "Tank Hill", description: "Historic site" },
    { lat: 0.3150, lng: 32.6050, weight: 67, title: "Nakawa Trading Center", description: "Commercial hub" },
    { lat: 0.2980, lng: 32.5950, weight: 65, title: "Muyenga", description: "Upscale residential" },
    { lat: 0.2880, lng: 32.6050, weight: 63, title: "Kansanga", description: "University area" },
    { lat: 0.2780, lng: 32.5850, weight: 60, title: "Ggaba Road", description: "Main southern road" },

    { lat: 0.3420, lng: 32.5480, weight: 64, title: "Makerere Kivulu", description: "Residential area" },
    { lat: 0.3520, lng: 32.5580, weight: 61, title: "Mulago Paramedical", description: "Medical training" },
    { lat: 0.3320, lng: 32.5680, weight: 69, title: "Wandegeya Market", description: "Local market" },
    { lat: 0.3220, lng: 32.5480, weight: 66, title: "Namirembe Cathedral", description: "Historic church" },
    { lat: 0.3120, lng: 32.5580, weight: 68, title: "Rubaga Cathedral", description: "Catholic cathedral" },

    // Final points to reach 70
    { lat: 0.3680, lng: 32.5920, weight: 57, title: "Ntinda Shopping Center", description: "Retail area" },
    { lat: 0.3780, lng: 32.6020, weight: 55, title: "Kyanja Trading Center", description: "Local shops" },
    { lat: 0.3280, lng: 32.6280, weight: 64, title: "Bugolobi Market", description: "Fresh produce market" },
    { lat: 0.3080, lng: 32.6300, weight: 62, title: "Luzira Prison", description: "Correctional facility" },
    { lat: 0.2980, lng: 32.6200, weight: 65, title: "Muyenga Tank Hill", description: "Scenic viewpoint" },

    { lat: 0.2880, lng: 32.5850, weight: 63, title: "Kabalagala Market", description: "Night market area" },
    { lat: 0.3380, lng: 32.5350, weight: 61, title: "Mengo Palace", description: "Kabaka's palace" },
    { lat: 0.3580, lng: 32.5380, weight: 59, title: "Kasubi Tombs", description: "UNESCO World Heritage Site" }
];

// Make samplePoints available globally
window.samplePoints = samplePoints;
