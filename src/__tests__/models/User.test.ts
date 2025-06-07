import { UserRole } from '../../interfaces/IUser';

describe('User Interface', () => {
  describe('UserRole enum', () => {
    it('should have correct role values', () => {
      expect(UserRole.ADMIN).toBe('admin');
      expect(UserRole.DRIVER).toBe('driver');
      expect(UserRole.PARENT).toBe('parent');
    });

    it('should have exactly 3 roles', () => {
      const roleValues = Object.values(UserRole);
      expect(roleValues.length).toBe(3);
    });
  });
});
