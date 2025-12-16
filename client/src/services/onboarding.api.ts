const API_URL = import.meta.env.VITE_API_URL || 'https://api.miayouragent.com';

export interface OnboardingStatus {
  currentStep: number;
  isComplete: boolean;
  completedSteps: number[];
}

export interface BusinessType {
  id: string;
  name: string;
  description?: string;
}

export interface Goal {
  id: string;
  name: string;
  description?: string;
}

export interface Platform {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface BrandProfileData {
  brandName: string;
  productsOrServices: string;
  customerDescription: string;
  customerLocation: string;
}

export interface BusinessTypeData {
  businessTypeId: string;
}

export interface GoalsData {
  goalIds: string[];
}

export interface BrandingData {
  logo: File;
  accentColor: string;
}

export interface PlatformsData {
  platformIds: string[];
}

class OnboardingAPI {
  private getAuthHeader(): HeadersInit {
    const token = localStorage.getItem('mia_auth_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async getStatus(): Promise<OnboardingStatus> {
    const response = await fetch(`${API_URL}/api/onboarding/status`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch onboarding status');
    }

    return response.json();
  }

  async getBusinessTypes(): Promise<BusinessType[]> {
    const response = await fetch(`${API_URL}/api/onboarding/business-types`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch business types');
    }

    const data = await response.json();
    return data.businessTypes || data; // Handle both wrapped and unwrapped responses
  }

  async getGoals(): Promise<Goal[]> {
    const response = await fetch(`${API_URL}/api/onboarding/goals`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch goals');
    }

    const data = await response.json();
    return data.goals || data; // Handle both wrapped and unwrapped responses
  }

  async getPlatforms(): Promise<Platform[]> {
    const response = await fetch(`${API_URL}/api/onboarding/platforms`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch platforms');
    }

    const data = await response.json();
    return data.platforms || data; // Handle both wrapped and unwrapped responses
  }

  async submitStep1(data: BrandProfileData): Promise<void> {
    const response = await fetch(`${API_URL}/api/onboarding/step-1`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to submit brand profile');
    }
  }

  async submitStep2(data: BusinessTypeData): Promise<void> {
    const response = await fetch(`${API_URL}/api/onboarding/step-2`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to submit business type');
    }
  }

  async submitStep3(data: GoalsData): Promise<void> {
    const response = await fetch(`${API_URL}/api/onboarding/step-3`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to submit goals');
    }
  }

  async submitStep4(data: BrandingData): Promise<void> {
    const formData = new FormData();
    formData.append('logo', data.logo);
    formData.append('accentColor', data.accentColor);

    const response = await fetch(`${API_URL}/api/onboarding/step-4`, {
      method: 'POST',
      headers: {
        ...this.getAuthHeader(),
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to submit branding');
    }
  }

  async submitStep5(data: PlatformsData): Promise<void> {
    const response = await fetch(`${API_URL}/api/onboarding/step-5`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to submit platforms');
    }
  }

  async restart(): Promise<void> {
    const response = await fetch(`${API_URL}/api/onboarding/restart`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to restart onboarding');
    }
  }
}

export const onboardingAPI = new OnboardingAPI();
