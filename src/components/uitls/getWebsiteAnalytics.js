// Function to fetch visitor count data from Vercel Analytics API
export async function getWebsiteAnalytics() {
    const projectId = 'YOUR_VERCEL_PROJECT_ID'; // Replace with your Vercel project ID
    const accessToken = 'YOUR_VERCEL_ACCESS_TOKEN'; // Replace with your Vercel access token
  
    const apiUrl = `https://api.vercel.com/v1/projects/${projectId}/analytics/summary`;
    
    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch visitor count data');
      }
  
      const data = await response.json();
      const visitorCount = data?.visitors?.total ?? 0;
      return visitorCount;
    } catch (error) {
      console.error('Error fetching visitor count data:', error);
      return 0; // Return 0 if there's an error
    }
  }
  