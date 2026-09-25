export class ConflictError extends Error {
  constructor(message = "resource conflict") {
    super(message);
    this.name = "ConflictError";
    this.statusCode = 401;
  }
}