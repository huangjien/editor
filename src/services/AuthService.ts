import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics';
import * as Keychain from 'react-native-keychain';

const rnBiometrics = new ReactNativeBiometrics();

export class AuthService {
  static async checkBiometricSupport(): Promise<
    (typeof BiometryTypes)[keyof typeof BiometryTypes] | null
  > {
    try {
      const { available, biometryType } =
        await rnBiometrics.isSensorAvailable();
      if (available && biometryType) {
        return biometryType;
      }
      return null;
    } catch (error) {
      console.warn('Biometric support check failed:', error);
      return null;
    }
  }

  static async authenticate(): Promise<boolean> {
    try {
      const biometryType = await AuthService.checkBiometricSupport();

      if (biometryType) {
        const { success } = await rnBiometrics.simplePrompt({
          promptMessage: 'Authenticate to access Modern Fleet App',
          cancelButtonText: 'Cancel',
        });
        return success;
      } else {
        // Fallback to a simple passcode or other method if biometrics not available
        // For now, we'll just return true if no biometrics are available, assuming no other guard.
        console.warn('Biometrics not available. Skipping authentication.');
        return true;
      }
    } catch (error) {
      console.error('Authentication error:', error);
      return false;
    }
  }

  static async storeUserCredentials(
    username: string,
    password: string,
  ): Promise<void> {
    try {
      await Keychain.setGenericPassword(username, password);
    } catch (error) {
      console.error('Failed to store credentials:', error);
      throw error;
    }
  }

  static async retrieveUserCredentials(): Promise<
    Keychain.UserCredentials | false
  > {
    try {
      return await Keychain.getGenericPassword();
    } catch (error) {
      console.error('Failed to retrieve credentials:', error);
      return false;
    }
  }

  static async resetUserCredentials(): Promise<void> {
    try {
      await Keychain.resetGenericPassword();
    } catch (error) {
      console.error('Failed to reset credentials:', error);
      throw error;
    }
  }
}
