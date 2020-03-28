import { CodeError } from '../../../src/utils/error-with-code';
import { Errors } from '../../../src/utils/errors';
import { makeTransporter } from '../../../src/utils/mail-transport';
import Mail from 'nodemailer/lib/mailer';
import multerUploader from '../../../src/utils/multer-uploader';

describe('utils test', () => {
  describe('error with code', () => {
    it('only with code', () => {
      const error = new CodeError(Errors.INSERT_ENTITY_ERROR);
      expect(error.code).toBe(Errors.INSERT_ENTITY_ERROR);
      expect(error.status).toBe(400);
      expect(error.message).toBe('');
    });

    it('with code and status', () => {
      const error = new CodeError(Errors.INSERT_ENTITY_ERROR, 502);
      expect(error.code).toBe(Errors.INSERT_ENTITY_ERROR);
      expect(error.status).toBe(502);
      expect(error.message).toBe('');
    });

    it('with code, status and message', () => {
      const error = new CodeError(Errors.INSERT_ENTITY_ERROR, 401, 'some msg');
      expect(error.code).toBe(Errors.INSERT_ENTITY_ERROR);
      expect(error.status).toBe(401);
      expect(error.message).toBe('some msg');
    });
  });

  describe('mail transport', () => {
    it('create', () => {
      const transport = makeTransporter();
      expect(transport).toBeInstanceOf(Mail);
    });
  });

  describe('multer', () => {
    it('create', () => {
      expect(multerUploader).toHaveProperty('storage');
    });
  });
});
