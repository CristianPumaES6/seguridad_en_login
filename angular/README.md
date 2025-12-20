# Angular Frontend Security & Features

This project is a professional Angular 21 application implementing secure authentication (JWT), modular architecture, and SEO features.

## Features

- **Authentication**: Login, Register, Logout with JWT handling.
- **Security**: HttpInterceptor for Token injection, Auth Guards, Auto-logout logic.
- **User Management**: Public user list, Profile view, Profile editing with Image Upload.
- **Architecture**: Modular (Core, Shared, Features), Standalone Components, Lazy Loading.
- **UI**: Angular Material with custom theme.
- **SEO**: Dynamic Title and Meta tags per route.
- **RSS**: Integration link for backend RSS feed.

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   ng serve
   ```
   Navigate to `http://localhost:4200/`.

3. **Build for Production**:
   ```bash
   ng build
   ```

4. **Run Tests**:
   ```bash
   ng test
   ```

## Configuration

- `src/environments/environment.ts`: API URL configuration.
