import { AuthService } from '../src/services/AuthService';
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics';
import * as Keychain from 'react-native-keychain';

// Mock react-native-biometrics
jest.mock('react-native-biometrics', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    isSensorAvailable: jest.fn(),
    simplePrompt: jest.fn(),
  })),
}));

// Mock react-native-keychain
jest.mock('react-native-keychain', () => ({
  setGenericPassword: jest.fn(),
  getGenericPassword: jest.fn(),
  resetGenericPassword: jest.fn(),
}));

const mockRnBiometrics =
  new ReactNativeBiometrics() as jest.Mocked<ReactNativeBiometrics>;

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock console.warn to prevent it from cluttering test output
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('checkBiometricSupport', () => {
    it('should return biometry type if available', async () => {
      mockRnBiometrics.isSensorAvailable.mockResolvedValue({
        available: true,
        biometryType: BiometryTypes.FaceID,
      });
      const result = await AuthService.checkBiometricSupport();
      expect(result).toBe(BiometryTypes.FaceID);
    });

    it('should return null if biometrics not available', async () => {
      mockRnBiometrics.isSensorAvailable.mockResolvedValue({
        available: false,
        biometryType: null,
      });
      const result = await AuthService.checkBiometricSupport();
      expect(result).toBeNull();
    });
  });

  describe('authenticate', () => {
    it('should return true if biometric authentication is successful', async () => {
      mockRnBiometrics.isSensorAvailable.mockResolvedValue({
        available: true,
        biometryType: BiometryTypes.TouchID,
      });
      mockRnBiometrics.simplePrompt.mockResolvedValue({ success: true });
      const result = await AuthService.authenticate();
      expect(result).toBe(true);
      expect(mockRnBiometrics.simplePrompt).toHaveBeenCalledTimes(1);
    });

    it('should return false if biometric authentication fails', async () => {
      mockRnBiometrics.isSensorAvailable.mockResolvedValue({
        available: true,
        biometryType: BiometryTypes.TouchID,
      });
      mockRnBiometrics.simplePrompt.mockResolvedValue({ success: false });
      const result = await AuthService.authenticate();
      expect(result).toBe(false);
      expect(mockRnBiometrics.simplePrompt).toHaveBeenCalledTimes(1);
    });

    it('should return true if biometrics not available (fallback)', async () => {
      mockRnBiometrics.isSensorAvailable.mockResolvedValue({
        available: false,
        biometryType: null,
      });
      const result = await AuthService.authenticate();
      expect(result).toBe(true);
      expect(mockRnBiometrics.simplePrompt).not.toHaveBeenCalled();
      expect(console.warn).toHaveBeenCalledWith(
        'Biometrics not available. Skipping authentication.',
      );
    });

    it('should handle errors during authentication', async () => {
      const error = new Error('Biometric sensor error');
      mockRnBiometrics.isSensorAvailable.mockResolvedValue({
        available: true,
        biometryType: BiometryTypes.FaceID,
      });
      mockRnBiometrics.simplePrompt.mockRejectedValue(error);
      const result = await AuthService.authenticate();
      expect(result).toBe(false);
      expect(console.error).toHaveBeenCalledWith(
        'Authentication error:',
        error,
      );
    });
  });

  describe('Keychain operations', () => {
    it('should store user credentials', async () => {
      await AuthService.storeUserCredentials('user', 'pass');
      expect(Keychain.setGenericPassword).toHaveBeenCalledWith('user', 'pass');
    });

    it('should retrieve user credentials', async () => {
      (Keychain.getGenericPassword as jest.Mock).mockResolvedValue({
        username: 'user',
        password: 'pass',
      });
      const credentials = await AuthService.retrieveUserCredentials();
      expect(credentials).toEqual({ username: 'user', password: 'pass' });
    });

    it('should reset user credentials', async () => {
      await AuthService.resetUserCredentials();
      expect(Keychain.resetGenericPassword).toHaveBeenCalledTimes(1);
    });
  });
});
