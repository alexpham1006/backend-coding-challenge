import { test } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';

import createApp from '../src/app.ts';

const app = createApp();

function uniqueEmail() {
    return `user-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`;
}

test('should create and get a user', async () => {
    const email = `alice-${Date.now()}@example.com`;

    // Create user
    const createResponse = await request(app)
        .post('/users')
        .send({
            name: 'Alex',
            email,
            status: 'active',
        });

    assert.equal(createResponse.status, 201);
    assert.equal(createResponse.body.data.name, 'Alex');

    const userId = createResponse.body.data.id;

    // Get the created user
    const getResponse = await request(app)
        .get(`/users/${userId}`);

    assert.equal(getResponse.status, 200);
    assert.equal(getResponse.body.data.id, userId);
    assert.equal(getResponse.body.data.email, email);
});

test('should reject invalid email', async () => {
    const response = await request(app)
        .post('/users')
        .send({
            name: 'Alex',
            email: 'invalid-email',
        });

    assert.equal(response.status, 400);
});

test('should update a user', async () => {
    const created = await request(app)
        .post('/users')
        .send({
            name: 'Alex',
            email: `alex-${Date.now()}@example.com`,
            status: 'active',
        });

    const userId = created.body.data.id;

    const response = await request(app)
        .put(`/users/${userId}`)
        .send({ name: 'Alex Updated' });

    assert.equal(response.status, 200);
    assert.equal(response.body.data.name, 'Alex Updated');
});

test('should delete a user', async () => {
    const created = await request(app)
        .post('/users')
        .send({
            name: 'Alex',
            email: `alex-${Date.now()}@example.com`,
            status: 'active',
        });

    const userId = created.body.data.id;

    const deleted = await request(app).delete(`/users/${userId}`);

    assert.equal(deleted.status, 200);

    const response = await request(app).get(`/users/${userId}`);

    assert.equal(response.status, 404);
});

test('should reject missing required fields', async () => {
    const response = await request(app)
        .post('/users')
        .send({});

    assert.equal(response.status, 400);
});

test('should return 404 when the user does not exist', async () => {
    const nonexistentId = 999999999;

    const getResponse = await request(app)
        .get(`/users/${nonexistentId}`);

    assert.equal(getResponse.status, 404);

    const updateResponse = await request(app)
        .patch(`/users/${nonexistentId}`)
        .send({ name: 'Updated User' });

    assert.equal(updateResponse.status, 404);

    const deleteResponse = await request(app)
        .delete(`/users/${nonexistentId}`);

    assert.equal(deleteResponse.status, 404);
});

test('should reject duplicate email addresses', async () => {
    const email = uniqueEmail();

    const firstResponse = await request(app)
        .post('/users')
        .send({ name: 'First User', email, status: 'active' });

    assert.equal(firstResponse.status, 201);

    const secondResponse = await request(app)
        .post('/users')
        .send({ name: 'Second User', email, status: 'active' });

    assert.equal(secondResponse.status, 409);
});
