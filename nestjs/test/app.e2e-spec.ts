
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

// Describe bloque principal de las pruebas E2E (End-to-End).
// "AppController (e2e)" es el nombre del conjunto de pruebas.
describe('AppController (e2e)', () => {
  // Aumentamos el tiempo de espera (timeout) a 30 segundos para evitar fallos por lentitud en la respuesta.
  jest.setTimeout(30000);

  // Variable para almacenar la instancia de la aplicación NestJS que se levantará para las pruebas.
  let app: INestApplication;

  // Variable para guardar el token de acceso (JWT) obtenido tras el login, para usarlo en peticiones protegidas.
  let accessToken: string;

  // Objeto con datos de un usuario de prueba para registrar y loguear.
  // Usamos Date.now() en el email para asegurar que sea único en cada ejecución.
  const testUser = {
    name: 'E2E User',
    email: `e2e_${Date.now()}@example.com`,
    password: 'password123',
  };

  // beforeAll se ejecuta UNA VEZ antes de que empiecen todos los tests de este bloque.
  // Aquí configuramos e inicializamos la aplicación NestJS.
  beforeAll(async () => {
    // Creamos un módulo de pruebas compilando el AppModule principal.
    // Esto simula el arranque real de la aplicación.
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    // Creamos la instancia de la aplicación NestJS a partir del módulo compilado.
    app = moduleFixture.createNestApplication();

    // Aplicamos los mismos pipes globales que en la app real (ej. validación de DTOs).
    app.useGlobalPipes(new ValidationPipe());

    // Establecemos el prefijo global de la API, igual que en main.ts.
    app.setGlobalPrefix('api/v1');

    // Inicializamos la aplicación (arranca el servidor interno para testing).
    await app.init();
  });

  // afterAll se ejecuta UNA VEZ al finalizar todos los tests.
  // Cerramos la aplicación para liberar recursos y puertos.
  afterAll(async () => {
    await app.close();
  });

  // Test 1: Registro de usuario.
  // Envía una petición POST a /auth/register con los datos del testUser.
  it('/auth/register (POST)', () => {
    return request(app.getHttpServer()) // Usamos supertest con el servidor de la app.
      .post('/api/v1/auth/register') // Endpoint a probar.
      .send(testUser) // Cuerpo de la petición (JSON).
      .expect(201) // Esperamos código HTTP 201 Created.
      .expect((res) => {
        // Validamos que la respuesta contenga el mensaje de éxito esperado.
        expect(res.body).toHaveProperty('message', 'User registered successfully');
      });
  });

  // Test 2: Login de usuario.
  // Envía una petición POST a /auth/login para obtener el JWT.
  it('/auth/login (POST)', () => {
    return request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: testUser.email, password: testUser.password }) // Credenciales.
      .expect(201) // Esperamos código HTTP 201 Created (o 200 según implementación).
      .expect((res) => {
        // Validamos que recibimos un token de acceso.
        expect(res.body).toHaveProperty('access_token');
        // Guardamos el token en la variable para usarlo en tests siguientes.
        accessToken = res.body.access_token;
      });
  });

  // Test 3: Acceso a perfil sin token.
  // Intenta acceder a una ruta protegida sin enviar el header de autorización.
  it('/users/profile (GET) - Fail without Token', () => {
    return request(app.getHttpServer())
      .get('/api/v1/users/profile')
      .expect(401); // Esperamos código HTTP 401 Unauthorized.
  });

  // Test 4: Acceso a perfil con token válido.
  // Usa el token obtenido en el login para acceder a la ruta protegida.
  it('/users/profile (GET) - Success with Token', () => {
    return request(app.getHttpServer())
      .get('/api/v1/users/profile')
      .set('Authorization', `Bearer ${accessToken}`) // Añadimos el token Bearer al header.
      .expect(200) // Esperamos código HTTP 200 OK.
      .expect((res) => {
        // Validamos que los datos devueltos coincidan con el usuario registrado.
        expect(res.body).toHaveProperty('email', testUser.email);
        // Validamos seguridad: NO debe devolver el hash del password.
        expect(res.body).not.toHaveProperty('passwordHash');
        expect(res.body).toHaveProperty('createdAt');
      });
  });

  // Test 5: Actualizar perfil.
  // Intenta modificar datos del perfil usando el token.
  it('/users/profile (PUT) - Update Profile', () => {
    return request(app.getHttpServer())
      .put('/api/v1/users/profile')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ name: 'Updated E2E User' }) // Nuevos datos.
      .expect(200) // Esperamos código HTTP 200 OK.
      .expect((res) => {
        // Validamos que el nombre se haya actualizado en la respuesta.
        expect(res.body.name).toBe('Updated E2E User');
        expect(res.body.updatedByUserId).toBeDefined();
      });
  });
});
