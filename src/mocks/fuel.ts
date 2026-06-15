import type { FuelReading, FuelEfficiencyTrend } from '@/types/fuel';
import { mockVehicles } from './vehicles';

// Generate 7 days of hourly fuel readings for each vehicle (168 readings per vehicle)
function generateMockFuelReadings(): FuelReading[] {
  const readings: FuelReading[] = [];
  const now = new Date();
  
  mockVehicles.forEach((vehicle) => {
    // Determine average consumption based on model
    const baseConsumption = vehicle.make === 'Tata' ? 34 : vehicle.make === 'Volvo' ? 38 : 31;
    let currentPercentage = vehicle.fuelLevel; // Start from current vehicle fuel level
    let tankCapacity = 300; // Average truck tank capacity in litres
    let currentLitres = (currentPercentage / 100) * tankCapacity;

    for (let i = 168; i >= 0; i--) {
      const recordedAt = new Date(now.getTime() - i * 60 * 60 * 1000).toISOString();
      const readingId = `fr-${vehicle.id}-${168 - i}`;

      // Simulate truck driving or resting
      let consumption = 0;
      let litresDrained = 0;

      // 70% chance the truck was active during this hour if it's not maintenance/offline status
      const isActive = vehicle.status !== 'offline' && vehicle.status !== 'maintenance' && Math.random() < 0.7;

      if (isActive) {
        // Normal consumption with slight variance
        consumption = baseConsumption + (Math.random() * 4 - 2); 
        
        // Drained in one hour of driving (assuming ~60 km/h average)
        litresDrained = (60 / 100) * consumption;
      }

      // Inject anomalies
      // 1. Tata (v-001) has a high-consumption anomaly ~30 hours ago (fuel leak simulation)
      if (vehicle.id === 'v-001' && i === 30) {
        consumption = baseConsumption * 1.5; // 50% above average
        litresDrained = (60 / 100) * consumption;
      }
      
      // 2. Mahindra (v-004) has a critical anomaly ~12 hours ago (fuel theft simulation)
      if (vehicle.id === 'v-004' && i === 12) {
        consumption = baseConsumption * 1.95; // 95% above average (critical)
        litresDrained = baseConsumption * 1.5; // Drained a lot of fuel suddenly
      }

      currentLitres = Math.max(10, currentLitres - litresDrained);
      
      // Simulate refuel if fuel gets too low (< 15%)
      if (currentLitres < tankCapacity * 0.15) {
        currentLitres = tankCapacity * 0.9; // Refueled to 90%
      }

      currentPercentage = Math.round((currentLitres / tankCapacity) * 100);

      readings.push({
        id: readingId,
        vehicleId: vehicle.id,
        litres: Math.round(currentLitres * 10) / 10,
        percentage: currentPercentage,
        consumption: Math.round(consumption * 10) / 10,
        recordedAt,
      });
    }
  });

  return readings;
}

export const mockFuelReadings = generateMockFuelReadings();

// Generate daily fuel efficiency trends for the last 7 days
function generateMockFuelTrends(): FuelEfficiencyTrend[] {
  const trends: FuelEfficiencyTrend[] = [];
  const now = new Date();

  mockVehicles.forEach((vehicle) => {
    const baseConsumption = vehicle.make === 'Tata' ? 34 : vehicle.make === 'Volvo' ? 38 : 31;
    
    for (let day = 7; day >= 1; day--) {
      const dateStr = new Date(now.getTime() - day * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const dailyVariance = Math.random() * 2 - 1;
      const avgConsumption = baseConsumption + dailyVariance;
      const totalKm = Math.round(150 + Math.random() * 200); // 150 - 350 km traveled per day
      const totalLitres = Math.round((totalKm / 100) * avgConsumption);

      trends.push({
        date: dateStr,
        vehicleId: vehicle.id,
        avgConsumption: Math.round(avgConsumption * 10) / 10,
        totalLitres,
        totalKm,
      });
    }
  });

  return trends;
}

export const mockFuelTrends = generateMockFuelTrends();
export default mockFuelReadings;
