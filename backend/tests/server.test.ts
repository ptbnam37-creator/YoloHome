import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../server.js';
import { Express } from 'express';

describe('Server API Endpoints', () => {
  let app: Express;

  beforeAll(async () => {
    // Set NODE_ENV to test to avoid starting Vite middleware
    process.env.NODE_ENV = 'test';
    app = await createApp();
  });

  describe('GET /api/sensors', () => {
    it('should return a 200 OK status', async () => {
      const response = await request(app).get('/api/sensors');
      expect(response.status).toBe(200);
    });

    it('should return a JSON object', async () => {
      const response = await request(app).get('/api/sensors');
      expect(response.type).toBe('application/json');
    });

    it('should have required sensor fields with correct types', async () => {
      const response = await request(app).get('/api/sensors');
      const data = response.body;

      // Check existence and types
      expect(data).toHaveProperty('temperature');
      expect(typeof data.temperature).toBe('number');

      expect(data).toHaveProperty('humidity');
      expect(typeof data.humidity).toBe('number');

      expect(data).toHaveProperty('light');
      expect(typeof data.light).toBe('number');

      expect(data).toHaveProperty('timestamp');
      expect(typeof data.timestamp).toBe('string');
    });

    it('should have sensor values within expected ranges', async () => {
      const response = await request(app).get('/api/sensors');
      const data = response.body;

      // temperature: 25 + Math.random() * 5 -> [25, 30]
      expect(data.temperature).toBeGreaterThanOrEqual(25);
      expect(data.temperature).toBeLessThanOrEqual(30);

      // humidity: 60 + Math.random() * 10 -> [60, 70]
      expect(data.humidity).toBeGreaterThanOrEqual(60);
      expect(data.humidity).toBeLessThanOrEqual(70);

      // light: 400 + Math.random() * 200 -> [400, 600]
      expect(data.light).toBeGreaterThanOrEqual(400);
      expect(data.light).toBeLessThanOrEqual(600);
    });

    it('should have a valid ISO timestamp string', async () => {
      const response = await request(app).get('/api/sensors');
      const data = response.body;

      // Check if it's a valid date string
      const date = new Date(data.timestamp);
      expect(date.getTime()).not.toBeNaN();

      // Check if it's in ISO format (very basic check)
      expect(data.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });
  });

  describe('GET /api/health', () => {
    it('should return a 200 OK status with correct payload', async () => {
      const response = await request(app).get('/api/health');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: 'ok',
        message: 'Smart Home Backend is running'
      });
    });
  });
});
