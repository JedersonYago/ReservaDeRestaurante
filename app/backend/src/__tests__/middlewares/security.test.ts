import {
  cacheControl,
  cleanHeaders,
  performanceHeaders,
  staticCacheBusting,
  sanitizeData
} from '../../middlewares/security';

describe('security middlewares', () => {
  const next = jest.fn();
  let req: any;
  let res: any;

  beforeEach(() => {
    req = { path: '', originalUrl: '', headers: {}, body: {} };
    res = {
      setHeader: jest.fn(),
      removeHeader: jest.fn(),
    };
    next.mockClear();
  });

  describe('cacheControl', () => {
    it('define cache longo para recursos estáticos', () => {
      req.path = '/img/logo.png';
      cacheControl(req, res, next);
      expect(res.setHeader).toHaveBeenCalledWith('Cache-Control', expect.stringContaining('max-age=2592000'));
      expect(next).toHaveBeenCalled();
    });
    it('não cacheia rotas de API', () => {
      req.path = '/api/test';
      cacheControl(req, res, next);
      expect(res.setHeader).toHaveBeenCalledWith('Cache-Control', expect.stringContaining('no-cache'));
      expect(res.setHeader).toHaveBeenCalledWith('Pragma', 'no-cache');
      expect(next).toHaveBeenCalled();
    });
  });

  describe('cleanHeaders', () => {
    it('remove headers sensíveis', () => {
      cleanHeaders(req, res, next);
      expect(res.removeHeader).toHaveBeenCalledWith('X-Powered-By');
      expect(res.removeHeader).toHaveBeenCalledWith('Server');
      expect(next).toHaveBeenCalled();
    });
  });

  describe('performanceHeaders', () => {
    it('adiciona headers de performance', () => {
      req.path = '/main.js';
      req.originalUrl = '/main.js';
      performanceHeaders(req, res, next);
      expect(res.setHeader).toHaveBeenCalledWith('Vary', 'Accept-Encoding');
      expect(res.setHeader).toHaveBeenCalledWith('X-Content-Type-Options', 'nosniff');
      expect(res.setHeader).toHaveBeenCalledWith('X-DNS-Prefetch-Control', 'off');
      expect(next).toHaveBeenCalled();
    });
  });

  describe('staticCacheBusting', () => {
    it('adiciona cache busting para recursos estáticos', () => {
      req.path = '/main.js';
      req.originalUrl = '/main.js';
      staticCacheBusting(req, res, next);
      expect(res.setHeader).toHaveBeenCalledWith('Cache-Control', expect.stringContaining('max-age=31536000'));
      expect(res.setHeader).toHaveBeenCalledWith('X-Cache-Busting', 'enabled');
      expect(next).toHaveBeenCalled();
    });
  });

  describe('sanitizeData', () => {
    it('trima strings do body', () => {
      req.body = { nome: '  teste  ', email: '  a@b.com  ' };
      sanitizeData(req, res, next);
      expect(req.body.nome).toBe('teste');
      expect(req.body.email).toBe('a@b.com');
      expect(next).toHaveBeenCalled();
    });
  });
});
