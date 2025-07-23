const g = global as any;

if (typeof g.sendMailMock === "undefined") {
  g.sendMailMock = jest.fn().mockResolvedValue({ messageId: "test" });
}
if (typeof g.verifyMock === "undefined") {
  g.verifyMock = jest.fn().mockResolvedValue(true);
}
if (typeof g.createTransport === "undefined") {
  g.createTransport = jest.fn().mockReturnValue({
    sendMail: g.sendMailMock,
    verify: g.verifyMock,
  });
}

module.exports = {
  createTransport: g.createTransport,
  sendMailMock: g.sendMailMock,
  verifyMock: g.verifyMock,
  default: { createTransport: g.createTransport },
};
