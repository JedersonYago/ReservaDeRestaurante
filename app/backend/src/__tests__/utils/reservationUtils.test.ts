import {
  validateTimeSlot,
  validateTimeInterval,
  validateTableAvailabilityOverlaps
} from '../../utils/reservationUtils';

import Config from '../../models/Config';

describe('reservationUtils', () => {
  beforeAll(() => {
    jest.spyOn(Config, 'findOne').mockReturnValue({
      sort: () => Promise.resolve({ minIntervalBetweenReservations: 10, isIntervalEnabled: true })
    } as any);
  });
  it('validateTimeSlot deve aceitar horários dentro do funcionamento', async () => {
    expect(await validateTimeSlot('11:00')).toBe(true);
    expect(await validateTimeSlot('23:00')).toBe(true);
    expect(await validateTimeSlot('10:00')).toBe(false);
    expect(await validateTimeSlot('00:00')).toBe(false);
  }, 20000);

  it('validateTimeInterval deve aceitar horários válidos', async () => {
    expect(await validateTimeInterval('11:00')).toBe(true);
    expect(await validateTimeInterval('23:59')).toBe(true);
    expect(await validateTimeInterval('24:00')).toBe(false);
    expect(await validateTimeInterval('12:60')).toBe(false);
    expect(await validateTimeInterval('99:99')).toBe(false);
  });

  it('validateTableAvailabilityOverlaps deve detectar sobreposição de horários', () => {
    const valid = [
      { date: '2025-07-22', times: ['11:00-12:00', '12:00-13:00'] },
      { date: '2025-07-23', times: ['14:00-15:00'] }
    ];
    const invalid = [
      { date: '2025-07-22', times: ['11:00-13:00', '12:00-14:00'] }
    ];
    expect(validateTableAvailabilityOverlaps(valid).isValid).toBe(true);
    const result = validateTableAvailabilityOverlaps(invalid);
    expect(result.isValid).toBe(false);
    expect(result.error).toMatch(/sobrepostos/);
  });
});
