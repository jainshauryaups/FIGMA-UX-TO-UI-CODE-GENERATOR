import fetch from 'node-fetch';

/**
 * IBM Cloud IAM Token Manager
 * Automatically exchanges API key for access tokens
 */
export class IBMTokenManager {
  private apiKey: string;
  private cachedToken: string | null = null;
  private tokenExpiry: number = 0;
  private iamEndpoint = 'https://iam.cloud.ibm.com/identity/token';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Get a valid access token (cached or fresh)
   */
  public async getAccessToken(): Promise<string> {
    // Return cached token if still valid (with 5-minute buffer)
    const now = Date.now();
    if (this.cachedToken && this.tokenExpiry > now + 300000) {
      return this.cachedToken;
    }

    // Fetch new token
    return await this.refreshToken();
  }

  /**
   * Exchange API key for access token
   */
  private async refreshToken(): Promise<string> {
    try {
      const response = await fetch(this.iamEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        body: new URLSearchParams({
          grant_type: 'urn:ibm:params:oauth:grant-type:apikey',
          apikey: this.apiKey
        }).toString()
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`IAM token request failed: ${response.status} - ${error}`);
      }

      const data = await response.json() as any;
      
      this.cachedToken = data.access_token;
      // Token typically expires in 3600 seconds (1 hour)
      this.tokenExpiry = Date.now() + (data.expires_in * 1000);

      return this.cachedToken!;

    } catch (error) {
      throw new Error(`Failed to get IBM access token: ${error instanceof Error ? error.message : error}`);
    }
  }

  /**
   * Check if current token is still valid
   */
  public isTokenValid(): boolean {
    return this.cachedToken !== null && this.tokenExpiry > Date.now();
  }

  /**
   * Force token refresh
   */
  public async forceRefresh(): Promise<string> {
    this.cachedToken = null;
    this.tokenExpiry = 0;
    return await this.refreshToken();
  }
}
