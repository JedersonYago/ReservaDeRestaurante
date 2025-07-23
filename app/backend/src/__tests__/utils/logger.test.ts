describe('logger', () => {
  let originalDebug: string | undefined;
  let logSpy: jest.SpyInstance;
  let errorSpy: jest.SpyInstance;
  let warnSpy: jest.SpyInstance;

  beforeEach(() => {
    originalDebug = process.env.DEBUG;
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    process.env.DEBUG = originalDebug;
    logSpy.mockRestore();
    errorSpy.mockRestore();
    warnSpy.mockRestore();
    jest.resetModules();
  });

  it('logger.info deve logar com prefixo ℹ️', () => {
    const { logger } = require('../../utils/logger');
    logger.info('mensagem info', 1, 2);
    expect(logSpy).toHaveBeenCalledWith('ℹ️  mensagem info', 1, 2);
  });

  it('logger.error deve logar com prefixo ❌', () => {
    const { logger } = require('../../utils/logger');
    logger.error('mensagem erro', 'detalhe');
    expect(errorSpy).toHaveBeenCalledWith('❌ mensagem erro', 'detalhe');
  });

  it('logger.success deve logar com prefixo ✅', () => {
    const { logger } = require('../../utils/logger');
    logger.success('mensagem ok');
    expect(logSpy).toHaveBeenCalledWith('✅ mensagem ok');
  });

  it('logger.warn deve logar com prefixo ⚠️', () => {
    const { logger } = require('../../utils/logger');
    logger.warn('mensagem warn');
    expect(warnSpy).toHaveBeenCalledWith('⚠️  mensagem warn');
  });

  it('logger.debug só loga se DEBUG=true', () => {
    process.env.DEBUG = 'true';
    jest.resetModules();
    const { logger } = require('../../utils/logger');
    logger.debug('debug ativo', 123);
    expect(logSpy).toHaveBeenCalledWith('🐛 [DEBUG] debug ativo', 123);
  });

  it('logger.debug não loga se DEBUG=false', () => {
    process.env.DEBUG = 'false';
    jest.resetModules();
    const { logger } = require('../../utils/logger');
    logger.debug('debug inativo');
    expect(logSpy).not.toHaveBeenCalled();
  });
});
