export const apiService = {
  async getSensors() {
    try {
      const response = await fetch('/api/sensors');
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error('Error fetching sensors:', error);
      return null;
    }
  },

  async toggleDevice(deviceId: string, state: boolean) {
    // In a real app, this would be a POST/PUT request to the backend
    console.log(`Toggling device ${deviceId} to ${state}`);
    return { success: true };
  }
};
