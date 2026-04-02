const request = require("supertest");
const app = require("../server");

jest.mock("../models/contactMessageModel", () => ({
  create: jest.fn(),
}));

jest.mock("../utils/mailer", () => ({
  sendContactNotification: jest.fn().mockResolvedValue({ messageId: "123" }),
}));

const contactMessageModel = require("../models/contactMessageModel");
const { sendContactNotification } = require("../utils/mailer");

describe("Contact API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("POST /api/contact stores message and triggers email", async () => {
    contactMessageModel.create.mockResolvedValue({
      rows: [
        {
          id: 1,
          name: "Alice",
          email: "alice@example.com",
          message: "Hi",
          created_at: new Date().toISOString(),
        },
      ],
    });

    const response = await request(app)
      .post("/api/contact")
      .send({ name: "Alice", email: "alice@example.com", message: "Hi" });

    expect(response.status).toBe(201);
    expect(response.body.status).toBe("success");
    expect(contactMessageModel.create).toHaveBeenCalledWith({
      name: "Alice",
      email: "alice@example.com",
      message: "Hi",
    });
    expect(sendContactNotification).toHaveBeenCalledWith({
      name: "Alice",
      email: "alice@example.com",
      message: "Hi",
    });
  });

  test("POST /api/contact returns 400 on invalid payload", async () => {
    const response = await request(app)
      .post("/api/contact")
      .send({ name: "", email: "invalid", message: "" });

    expect(response.status).toBe(400);
    expect(response.body.status).toBe("error");
  });
});
