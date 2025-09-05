import firestore from '@react-native-firebase/firestore';

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string | null;
  role: 'user' | 'expert' | 'admin';
  stripeCustomerId: string | null;
  createdAt: any;
  updatedAt: any;
  // Add more fields as needed
  phoneNumber?: string;
  bio?: string;
  skills?: string[];
  hourlyRate?: number;
  rating?: number;
  completedTasks?: number;
}

export class UserService {
  private static COLLECTION = 'users';

  /**
   * Create a new user profile in Firestore
   */
  static async createUserProfile(uid: string, profileData: Partial<UserProfile>): Promise<void> {
    try {
      const profile: UserProfile = {
        uid,
        displayName: profileData.displayName || '',
        email: profileData.email || '',
        photoURL: profileData.photoURL || null,
        role: profileData.role || 'user',
        stripeCustomerId: profileData.stripeCustomerId || null,
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
        ...profileData,
      };

      await firestore().collection(this.COLLECTION).doc(uid).set(profile, { merge: true });
      console.log('✅ User profile created successfully');
    } catch (error) {
      console.error('❌ Error creating user profile:', error);
      throw error;
    }
  }

  /**
   * Get user profile from Firestore
   */
  static async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const userSnap = await firestore().collection(this.COLLECTION).doc(uid).get();
      
      if (userSnap.exists()) {
        return userSnap.data() as UserProfile;
      }
      
      return null;
    } catch (error) {
      console.error('❌ Error getting user profile:', error);
      throw error;
    }
  }

  /**
   * Update user profile in Firestore
   */
  static async updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<void> {
    try {
      await firestore().collection(this.COLLECTION).doc(uid).update({
        ...updates,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
      
      console.log('✅ User profile updated successfully');
    } catch (error) {
      console.error('❌ Error updating user profile:', error);
      throw error;
    }
  }

  /**
   * Check if user profile exists
   */
  static async userProfileExists(uid: string): Promise<boolean> {
    try {
      const profile = await this.getUserProfile(uid);
      return profile !== null;
    } catch (error) {
      console.error('❌ Error checking user profile existence:', error);
      return false;
    }
  }
}
