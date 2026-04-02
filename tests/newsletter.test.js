const request = require("supertest");
const app = require("../server");

jest.mock("../models/subscriberModel", () => ({
  findByEmail: jest.fn(),
  create: jest.fn(),
}));

const subscriberModel = require("../models/subscriberModel");

describe("Newsletter API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("POST /api/newsletter/subscribe creates a subscription", async () => {
    subscriberModel.findByEmail.mockResolvedValue({ rows: [] });
    subscriberModel.create.mockResolvedValue({
      rows: [
        {
          id: 1,
          email: "test@example.com",
          created_at: new Date().toISOString(),
        },
      ],
    });

    const response = await request(app)
      .post("/api/newsletter/subscribe")
      .send({ email: "test@example.com" });

    expect(response.status).toBe(201);
    expect(response.body.status).toBe("success");
    expect(response.body.data.email).toBe("test@example.com");
    expect(subscriberModel.findByEmail).toHaveBeenCalledWith(
      "test@example.com",
    );
  });

  test("POST /api/newsletter/subscribe returns 409 for duplicate email", async () => {
    subscriberModel.findByEmail.mockResolvedValue({
      rows: [{ id: 1, email: "test@example.com" }],
    });

    const response = await request(app)
      .post("/api/newsletter/subscribe")
      .send({ email: "test@example.com" });

    expect(response.status).toBe(409);
    expect(response.body.status).toBe("error");
    expect(response.body.message).toMatch(/already subscribed/i);
  });

  test("POST /api/newsletter/subscribe returns 400 for invalid email", async () => {
    const response = await request(app)
      .post("/api/newsletter/subscribe")
      .send({ email: "not-an-email" });

    expect(response.status).toBe(400);
    expect(response.body.status).toBe("error");
  });
});
