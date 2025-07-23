/**
 * Teste simples para verificar se o ambiente Jest está funcionando
 */

describe('Simple Test', () => {
  it('should pass basic test', () => {
    expect(1 + 1).toBe(2);
  });

  it('should test async function', async () => {
    const result = await Promise.resolve('test');
    expect(result).toBe('test');
  });
});
