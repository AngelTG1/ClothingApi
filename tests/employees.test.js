import request from "supertest";
import app from "../src/app";
import { pool } from "../src/db";

describe("Employees Routes", () => {
  it("should respond a list of employees", async () => {
    const res = await request(app).get("/api/usuarios");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          nombre: expect.any(String),
          apellido: expect.any(String),
          correo: expect.any(String),
          contrasenia: expect.any(String),
        }),
      ])
    );
  });

  it("should create a new employee", async () => {
    const res = await request(app).post("/api/usuarios").send({
      name: "John Doe",
      salary: 1000,
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        nombre: "Angel",
        apellido: "Tagua",
        correo: "angel@gmail.com",
        contrasenia: "12345",
      })
    );
  });

  it("should get an employee by id", async () => {
    const res = await request(app).get("/api/usuarios/1");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        id: 1,
        nombre: expect.any(String),
        apellido: expect.any(String),
        correo: expect.any(String),
        contrasenia: expect.any(String),
      })
    );
  });

  it("should delete an employee by id", async () => {
    const res = await request(app).delete("/api/usuarios/1");
    expect(res.statusCode).toEqual(204);
  });

  afterAll(async () => {
    await pool.end();
  });
});
