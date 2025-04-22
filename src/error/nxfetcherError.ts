export class nxfetcherError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'nxfetcherError';
    }
  }
  