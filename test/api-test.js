const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const catwayController = require('../controller/catwayController');
const reservationController = require('../controller/reservationController');
const userController = require('../controller/userController');

chai.use(chaiHttp);
const expect = chai.expect;

describe('Tests des endpoints', function() {
  it('devrait retourner une réponse 200 pour /users', async function() {
    const res = await chai.request(app).get('/users/users');
    expect(res).to.have.status(200);
  });

  it('devrait retourner une réponse 200 pour /reservations', async function() {
    const res = await chai.request(app).get('/reservations/reservations');
    expect(res).to.have.status(200);
  });

  it('devrait retourner une réponse 200 pour /catways', async function() {
    const res = await chai.request(app).get('/catways/catways');
    expect(res).to.have.status(200);
  });

  it('devrait retourner une réponse 404 pour une route inexistante', async function() {
    const res = await chai.request(app).get('/route-inexistante');
    expect(res).to.have.status(404);
  });
  it('devrait retourner une réponse 201 pour /createCatway', async function() {
    const catwayData = { catwayNumber: '2', type: 'short', catwayState: 'Parfait' };
    const res = await chai.request(app).post('/catways/createCatway').send(catwayData);
    expect(res).to.have.status(201);
  });

  it('devrait retourner une réponse 200 pour /createReservation', async function() {
    const reservationData = { catwayNumber: '7', clientName: 'Bouba', boatName: 'Bko', checkIn: new Date(), checkOut: new Date() };
    const res = await chai.request(app).post('/reservations/createReservation').send(reservationData);
    expect(res).to.have.status(201);
  });

  it('devrait retourner une réponse 401 pour une tentative de connexion avec un email inexistant', async function() {
    const loginData = { email: 'inexistant@example.com', password: 'password' };
    const res = await chai.request(app).post('/users/login').send(loginData);
    expect(res).to.have.status(401);
  });

  it('devrait retourner une réponse 401 pour une tentative de connexion avec un mot de passe incorrect', async function() {
    const loginData = { email: 'john@example.com', password: 'motdepasseincorrect' };
    const res = await chai.request(app).post('/users/login').send(loginData);
    expect(res).to.have.status(401);
  });
  it('devrait retourner une réponse 200 pour la mise à jour d\'un utilisateur existant', async function() {
  
    const existingUserId = '660050f5489085c3ab94fc31';  //  l'ID d'un utilisateur existant
  
    const updateUser = { userId: existingUserId, name: 'New Name', email: 'newemail@example.com', password: 'newpassword' };
    const res = await chai.request(app).post('/users/deleteUser').send(updateUser);
    expect(res).to.have.status(200);
  });
  it('devrait retourner une réponse 200 pour la suppression d\'un utilisateur existant', async function() {
    
    const existingUserId = '660064860fd01275759eb4c0'; // l'ID d'un utilisateur existant
  
    const deleteUser = { userId: existingUserId };
    const res = await chai.request(app).post('/users/deleteUser').send(deleteUser);
    expect(res).to.have.status(200);
  });
  
  
  it('devrait retourner une réponse 200 pour la mise à jour d\'un catway existant', async function() {
    const existingCatwayId = '6601d20a4c34ab64254a7644'; // l'ID d'un catway existant
  
    const updateCatway = { catwayId: existingCatwayId, catwayState: 'Nouvel état' };
    const res = await chai.request(app).post('/catways/updateCatwayState').send(updateCatway);
    expect(res).to.have.status(200);
  });

  it('devrait retourner une réponse 200 pour la suppression d\'un catway existant', async function() {
    const existingCatwayId = '66040feb4422bd9e78f47f9c'; // l'ID d'un catway existant
  
    const deleteCatway = { catwayId: existingCatwayId };
    const res = await chai.request(app).post('/catways/deleteCatway').send(deleteCatway);
    expect(res).to.have.status(200);
  });

  it('devrait retourner une réponse 200 pour la suppression d\'une réservation existante', async function() {
    const existingReservationId = '6601d98e6c5541d229d7114d'; //  l'ID d'une réservation existante
  
    const deleteReservation = { reservationId: existingReservationId };
    const res = await chai.request(app).post('/reservations/deleteReservation').send(deleteReservation);
    expect(res).to.have.status(200);
  });
  it('devrait retourner une réponse 200 pour /getCatwayDetails', async function() {
   
    const existingCatwayId = '6601d1f54c34ab64254a7642'; //  l'ID d'un catway existant
  
    const res = await chai.request(app).get(`/catways/getCatwayDetails?catwayId=${existingCatwayId}`);
    expect(res).to.have.status(200);
  });
  
  it('devrait retourner une réponse 200 pour /getReservationDetails', async function() {
    
    const existingReservationId = '660411d21cccd8c3bc4ffa89'; // l'ID d'une réservation existante
  
    const res = await chai.request(app).get(`/reservations/getReservationDetails?reservationId=${existingReservationId}`);
    expect(res).to.have.status(200);
  });
  
 
});
