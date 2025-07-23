import { EmailService } from "../../services/emailService";
jest.mock("nodemailer");
const nodemailerMock = require("nodemailer");
const sendMailMock = nodemailerMock.sendMailMock;
const verifyMock = nodemailerMock.verifyMock;

describe("emailService", () => {
  beforeEach(() => {
    sendMailMock.mockClear();
    verifyMock.mockClear();
    jest.resetModules();
  });

  it("deve enviar email com sucesso", async () => {
    const { createEmailService } = await import("../../services/emailService");
    const emailService = createEmailService();
    const result = await emailService.sendEmail({
      to: "test@example.com",
      subject: "Assunto",
      html: "<b>Mensagem</b>",
      text: "Mensagem",
    });
    expect(result).toBe(true);
    expect(sendMailMock).toHaveBeenCalled();
    expect(verifyMock).toHaveBeenCalled();
  }, 20000);

  it("deve enviar email de recuperação de senha", async () => {
    const { createEmailService } = await import("../../services/emailService");
    const emailService = createEmailService();
    const result = await emailService.sendPasswordResetEmail(
      "test@example.com",
      "https://link-reset.com",
      "usuario"
    );
    expect(result).toBe(true);
    expect(sendMailMock).toHaveBeenCalled();
    expect(verifyMock).toHaveBeenCalled();
  }, 20000);

  it("deve retornar false se sendMail lançar erro", async () => {
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    const emailServiceInstance = new EmailService();
    jest
      .spyOn(emailServiceInstance.transporter, "sendMail")
      .mockImplementation(() => {
        throw new Error("fail");
      });
    const result = await emailServiceInstance.sendEmail({
      to: "fail@example.com",
      subject: "fail",
      html: "<p>fail</p>",
    });
    expect(result).toBe(false);
    errorSpy.mockRestore();
  });
});
