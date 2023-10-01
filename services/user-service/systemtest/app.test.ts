import {expect, describe, it} from 'vitest'

import app from "../src/app"

import request from 'supertest';

const fullNewUser = { uid: '1', displayName: 'Test User', photoUrl: "fakeUrl", matchDifficulty: 0,
  matchProgrammingLanguage: "Python" };

const updatedNewUser = { uid: '1', displayName: 'Test User', photoUrl: "fakeUrl", matchDifficulty: 1,
  matchProgrammingLanguage: "Python"};

const updatePayload = { matchDifficulty: 1 };

describe('/index', () => {
  describe('Sample App Workflow', () => {
    it('Step 1: Add user 1 to database should pass', async () => {
      // The function being tested
      const response = await request(app).post('/').send(fullNewUser);
      expect(response.status).toStrictEqual(201);
      expect(response.body).toStrictEqual(fullNewUser);
    })

    it('Step 2: Retrieve details of user 1 from database should pass', async () => {
      // The function being tested
      const response = await request(app).get('/1').send();
      expect(response.status).toStrictEqual(200);
      expect(response.body).toStrictEqual(fullNewUser);
    })

    it('Step 3: Update details of user 1 from database should pass', async () => {
      // The function being tested
      const response = await request(app).put('/1').send(updatePayload);
      expect(response.status).toStrictEqual(200);
      expect(response.body).toStrictEqual(updatedNewUser);
    })

    it('Step 4: Retrieve details of updated user 1 from database should pass', async () => {
      // The function being tested
      const response = await request(app).get('/1').send();
      expect(response.status).toStrictEqual(200);
      expect(response.body).toStrictEqual(updatedNewUser);
    })

    it('Step 5: Attempt to add duplicate user 1 to database should fail with error', async () => {
      const response = await request(app).post('/').send(fullNewUser);
      expect(response.status).toStrictEqual(400);
    })

    it('Step 6: Delete user 1 from database', async () => {
      const response = await request(app).delete('/1').send();
      expect(response.status).toStrictEqual(204);
    })

    it('Step 7: Retrieve details of now deleted user 1 should fail', async () => {
      // The function being tested
      const response = await request(app).get('/1').send();
      expect(response.status).toStrictEqual(404);
    })

    it('Step 8: Update details of now deleted user 1 should fail', async () => {
      // The function being tested
      const response = await request(app).put('/1').send(updatePayload);
      expect(response.status).toStrictEqual(404);
    })

    it('Step 9: Deleting the now deleted user 1 should fail', async () => {
      // The function being tested
      const response = await request(app).delete('/1').send();
      expect(response.status).toStrictEqual(404);
    })
  })

})
