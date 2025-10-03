const STRAPI_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';

export const strapiClient = {
  baseURL: STRAPI_URL,
  apiURL: `${STRAPI_URL}/api`,
  
  async fetch(endpoint: string, options: RequestInit = {}) {
    const url = `${this.apiURL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`Strapi API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }
};

export default strapiClient;
