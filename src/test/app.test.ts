import { createApp } from "../app";
import request from "supertest";
import { describe, expect, it } from "vitest";

const app = createApp();

it("returns health status", async () => {
  const response = await request(app).get("/health");

  expect(response.status).toBe(200);
  expect(response.body.status).toBe("ok");
});

it("returns 400 when create user body is invalid", async () => {
  const response = await request(app).post("/users").send({
    email: "not-an-email",
    password: "123",
  });

  expect(response.status).toBe(400);
  expect(response.body.message).toBe("Validation failed");
});

it("rejects role during signup", async () => {
  const response = await request(app).post("/users").send({
    name: "Hack Admin",
    email: "hack-admin@example.com",
    password: "Password123",
    role: "admin",
  });

  expect(response.status).toBe(400);
  expect(response.body.message).toBe("Validation failed");
});
