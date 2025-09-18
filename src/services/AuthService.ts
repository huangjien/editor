import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics';
import * as Keychain from 'react-native-keychain';

const rnBiometrics = new ReactNativeBiometrics();

export class AuthService {
  static async checkBiometricSupport(): Promise<BiometryTypes | null> {
    const { available, biometryType } = await rnBiometrics.isSensorAvailable();
    if (available && biometryType) {
      return biometryType;
    }
    return null;
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
    await Keychain.setGenericPassword(username, password);
  }

  static async retrieveUserCredentials(): Promise<Keychain.Options | false> {
    return await Keychain.getGenericPassword();
  }

  static async resetUserCredentials(): Promise<void> {
    await Keychain.resetGenericPassword();
  }
}
