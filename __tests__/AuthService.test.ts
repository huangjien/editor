import { AuthService } from '../src/services/AuthService';

describe('AuthService', () => {
  it('can be imported', () => {
    expect(AuthService).toBeDefined();
  });

  it('should have required static methods', () => {
    expect(typeof AuthService.checkBiometricSupport).toBe('function');
    expect(typeof AuthService.authenticate).toBe('function');
    expect(typeof AuthService.storeUserCredentials).toBe('function');
    expect(typeof AuthService.retrieveUserCredentials).toBe('function');
    expect(typeof AuthService.resetUserCredentials).toBe('function');
  });

  it('should handle biometric support check', async () => {
    const result = await AuthService.checkBiometricSupport();
    // Result should be either a BiometryTypes value or null
    expect(result === null || typeof result === 'string').toBe(true);
  });

  it('should handle authentication', async () => {
    const result = await AuthService.authenticate();
    expect(typeof result).toBe('boolean');
  });
});
