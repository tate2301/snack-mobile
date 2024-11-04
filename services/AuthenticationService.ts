import AsyncStorage from '@react-native-async-storage/async-storage';
import useStore from '@/stores/useStore';

export interface IUser {
  id: string;
  nickname: string;
  email?: string;
  preferences?: IUserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserPreferences {
  theme: 'light' | 'dark' | 'system';
  notificationsEnabled: boolean;
  preferredCategories?: string[];
}

class AuthenticationService {
  private static instance: AuthenticationService;
  private STORAGE_KEY = 'user';
  private ONBOARDING_KEY = 'hasCompletedOnboarding';

  private constructor() {}

  public static getInstance(): AuthenticationService {
    if (!AuthenticationService.instance) {
      AuthenticationService.instance = new AuthenticationService();
    }
    return AuthenticationService.instance;
  }

  public async registerUser(nickname: string, email?: string): Promise<IUser> {
    const user: IUser = {
      id: 'user_' + Date.now(),
      nickname,
      email,
      preferences: {
        theme: 'system',
        notificationsEnabled: true,
        preferredCategories: [],
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
    useStore.getState().setUser(user);
    return user;
  }

  public async getUser(): Promise<IUser | null> {
    const userData = await AsyncStorage.getItem(this.STORAGE_KEY);
    if (!userData) return null;

    const user = JSON.parse(userData);
    useStore.getState().setUser(user);
    return user;
  }

  public async updateUser(updates: Partial<IUser>): Promise<void> {
    const currentUser = await this.getUser();
    if (!currentUser) throw new Error('No user found');

    const updatedUser = {
      ...currentUser,
      ...updates,
      updatedAt: new Date(),
    };

    await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedUser));
    useStore.getState().setUser(updatedUser);
  }

  public async signOut(): Promise<void> {
    await AsyncStorage.multiRemove([this.STORAGE_KEY, this.ONBOARDING_KEY]);
    useStore.getState().setUser(null);
  }

  public async hasCompletedOnboarding(): Promise<boolean> {
    return AsyncStorage.getItem(this.ONBOARDING_KEY).then(Boolean);
  }

  public async setOnboardingComplete(): Promise<void> {
    await AsyncStorage.setItem(this.ONBOARDING_KEY, 'true');
  }
}

export default AuthenticationService; 