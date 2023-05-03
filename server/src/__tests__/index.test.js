const request = require('supertest');
const { mocksOpenIa } = require('../mocks');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

describe('Test of the endpoints', () => {
  it('GET /Send an array of meals', async () => {
    const response = await request('http://localhost:3001').get('/meals');
    expect(response.status).toEqual(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it('GET /meals/:id send back a specific meal', async () => {
    const response = await request('http://localhost:3001').get('/meals/1');
    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty('id', 1);
    expect(response.body).toHaveProperty('title', 'test1');
  });

  it('GET /meals/:id should return 404 if the meal does not exist', async () => {
    const response = await request('http://localhost:3001').get('/meals/99999');
    expect(response.status).toEqual(404);
    expect(response.body).toHaveProperty('error', 'Meal not found');
  });


  it('DELETE /meals/:id should delete a meal', async () => {
    // First, create a new meal for testing purposes
    const testMeal = await prisma.mealInfo.create({
      data: {
        description: 'Beach Diet',
         userId: 'github|122622286',
        mealInfoId: 2,
      },
    });
  
    // Now, test the deletion of the created meal
    const response = await request('http://localhost:3001')
      .delete(`/meals/${meal.id}`);
    expect(response.status).toEqual(204);
  
    // Verify that the meal has been deleted from the database
    const deletedMeal = await prisma.mealInfo.findUnique({
      where: { id: meal.id },
    });
    expect(deletedMeal).toBeNull();
  });






  // it('DELETE /meals/:id delete the diet', async () => {
  //   const meal = await prisma.mealAI.create({
  //     data: {
  //       description: 'hello',
  //       userId: 'github|122622286',
  //       mealInfoId: 1,
  //     },
  //   });
  //   console.log('id du meal', meal.id);
  //   const response = await request('http://localhost:3001').delete(
  //     `/meals/${meal.id}`
  //   );
  //   expect(response.status).toEqual(204);
  // });






  it('PUT /meals/:id update title of the diet', async () => {
    const mealToUpdate = { title: 'test1' };
    const response = await request('http://localhost:3001')
      .put('/meals/1')
      .send(mealToUpdate);
    expect(response.status).toEqual(200);
    expect(response.body.title).toEqual('test1');
    const updatedMeal = await prisma.mealInfo.findUnique({
      where: { id: 1 },
    });
    expect(updatedMeal.title).toEqual('test1');
  });

  it.skip('POST /ai-generate generate a meal with ', async () => {
    const response = await request('http://localhost:3001')
      .post('/ai-generate')
      .send(mocksOpenIa);
    expect(response.status).toEqual(200);
  }, 90000);

  it.skip('POST /Should send 500 status if plan is not correctly generated', async () => {
    const response = await request('http://localhost:3001')
      .post('/ai-generate')
      .send({});
    expect(response.status).toEqual(500);
  }, 90000);
});
