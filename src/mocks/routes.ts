import type { TruckRouteOptimisation } from '@/types/route';

export const mockTruckOptimisations: TruckRouteOptimisation[] = [
  {
    vehicleId: 'v-001',
    plateNumber: 'MH 12 QW 3456',
    emptyReturnKm: 1400,
    revenueLost: 40000,
    returnLoadBooked: false,
    bookedOpportunityId: null,
    currentTrip: {
      origin: 'JNPT Port Terminal, Navi Mumbai',
      destination: 'Delhi ICD Tuglakabad',
      revenue: 45000,
      distanceKm: 1400,
      waypoints: [
        { lat: 18.9501, lng: 72.9511 }, // Mumbai Start
        { lat: 21.1458, lng: 79.0882 }, // Nagpur Bypass
        { lat: 23.0225, lng: 72.5714 }, // Ahmedabad Bypass
        { lat: 26.8544, lng: 75.6422 }, // Jaipur Bypass
        { lat: 28.5022, lng: 77.2844 }, // Delhi End
      ],
    },
    opportunities: [
      {
        id: 'opp-001a',
        origin: 'Delhi ICD Tuglakabad',
        destination: 'JNPT Port Terminal, Navi Mumbai',
        customerName: 'Reliance Retail Logistics',
        loadType: 'Textiles & Consumer Apparel',
        revenue: 42000,
        distanceKm: 1400,
        estimatedDuration: 1620, // 27 hours
        score: 96,
        waypoints: [
          { lat: 28.5022, lng: 77.2844 }, // Delhi Start
          { lat: 26.8544, lng: 75.6422 }, // Jaipur
          { lat: 23.0225, lng: 72.5714 }, // Ahmedabad
          { lat: 21.1458, lng: 79.0882 }, // Nagpur
          { lat: 18.9501, lng: 72.9511 }, // Mumbai End
        ],
      },
      {
        id: 'opp-001b',
        origin: 'Delhi ICD Tuglakabad',
        destination: 'Pune MIDC Chakan',
        customerName: 'Tata Motors Supply Chain',
        loadType: 'Fabricated Steel Auto Parts',
        revenue: 38500,
        distanceKm: 1430,
        estimatedDuration: 1680, // 28 hours
        score: 89,
        waypoints: [
          { lat: 28.5022, lng: 77.2844 }, // Delhi Start
          { lat: 27.1767, lng: 78.0081 }, // Agra
          { lat: 22.5726, lng: 88.3639 }, // Gwalior/Bhopal general
          { lat: 20.0050, lng: 73.7898 }, // Nashik
          { lat: 18.5204, lng: 73.8567 }, // Pune End
        ],
      }
    ]
  },
  {
    vehicleId: 'v-004',
    plateNumber: 'HR 26 DH 3456',
    emptyReturnKm: 350,
    revenueLost: 12500,
    returnLoadBooked: false,
    bookedOpportunityId: null,
    currentTrip: {
      origin: 'Bengaluru Whitefield Fulfillment',
      destination: 'Chennai Port Trust Terminal',
      revenue: 18000,
      distanceKm: 350,
      waypoints: [
        { lat: 12.9844, lng: 77.7211 }, // Bengaluru Start
        { lat: 12.9200, lng: 78.5000 }, // Kolar
        { lat: 13.0827, lng: 80.2707 }, // Chennai End
      ],
    },
    opportunities: [
      {
        id: 'opp-004a',
        origin: 'Chennai Port Trust Terminal',
        destination: 'Bengaluru Whitefield Fulfillment',
        customerName: 'Amazon Transportation India',
        loadType: 'Electronics & Mobile Consignments',
        revenue: 16500,
        distanceKm: 350,
        estimatedDuration: 360, // 6 hours
        score: 94,
        waypoints: [
          { lat: 13.0827, lng: 80.2707 }, // Chennai Start
          { lat: 12.9200, lng: 78.5000 }, // Kolar
          { lat: 12.9844, lng: 77.7211 }, // Bengaluru End
        ],
      },
      {
        id: 'opp-004b',
        origin: 'Chennai Port Trust Terminal',
        destination: 'Hubli Distribution Hub',
        customerName: 'Adani Logistics Services',
        loadType: 'Agricultural Fertilisers',
        revenue: 22000,
        distanceKm: 700,
        estimatedDuration: 750, // 12.5 hours
        score: 82,
        waypoints: [
          { lat: 13.0827, lng: 80.2707 }, // Chennai Start
          { lat: 12.9844, lng: 77.7211 }, // Bengaluru
          { lat: 15.3647, lng: 75.1240 }, // Hubli End
        ],
      }
    ]
  },
  {
    vehicleId: 'v-006',
    plateNumber: 'MH 43 AB 8899',
    emptyReturnKm: 620,
    revenueLost: 22000,
    returnLoadBooked: false,
    bookedOpportunityId: null,
    currentTrip: {
      origin: 'JNPT Port Terminal, Navi Mumbai',
      destination: 'Hyderabad Outer Ring Rd',
      revenue: 26000,
      distanceKm: 620,
      waypoints: [
        { lat: 18.9501, lng: 72.9511 }, // Mumbai Start
        { lat: 18.5204, lng: 73.8567 }, // Pune
        { lat: 17.3850, lng: 78.4867 }, // Hyderabad End
      ],
    },
    opportunities: [
      {
        id: 'opp-006a',
        origin: 'Hyderabad Outer Ring Rd',
        destination: 'JNPT Port Terminal, Navi Mumbai',
        customerName: 'Apollo Tyres India',
        loadType: 'Commercial Truck Tyres Pack',
        revenue: 24000,
        distanceKm: 620,
        estimatedDuration: 660, // 11 hours
        score: 91,
        waypoints: [
          { lat: 17.3850, lng: 78.4867 }, // Hyderabad Start
          { lat: 18.5204, lng: 73.8567 }, // Pune
          { lat: 18.9501, lng: 72.9511 }, // Mumbai End
        ],
      }
    ]
  },
  {
    vehicleId: 'v-009',
    plateNumber: 'MH 14 EU 9000',
    emptyReturnKm: 660,
    revenueLost: 24500,
    returnLoadBooked: false,
    bookedOpportunityId: null,
    currentTrip: {
      origin: 'Pune Chakan MIDC',
      destination: 'Sanand Industrial, Ahmedabad',
      revenue: 22000,
      distanceKm: 660,
      waypoints: [
        { lat: 18.7533, lng: 73.8544 }, // Pune Start
        { lat: 20.0050, lng: 73.7898 }, // Nashik
        { lat: 23.0033, lng: 72.3044 }, // Ahmedabad End
      ],
    },
    opportunities: [
      {
        id: 'opp-009a',
        origin: 'Sanand Industrial, Ahmedabad',
        destination: 'Pune Chakan MIDC',
        customerName: 'Flipkart Logistics Hub',
        loadType: 'FMCG & Groceries Assortment',
        revenue: 19500,
        distanceKm: 660,
        estimatedDuration: 720, // 12 hours
        score: 93,
        waypoints: [
          { lat: 23.0033, lng: 72.3044 }, // Ahmedabad Start
          { lat: 20.0050, lng: 73.7898 }, // Nashik
          { lat: 18.7533, lng: 73.8544 }, // Pune End
        ],
      }
    ]
  }
];

export default mockTruckOptimisations;
