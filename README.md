---

# Forum System Frontend

This is the frontend for the **Forum System** project, built with React and Vite. It serves as the user interface for interacting with the backend API. The frontend features a modular component structure, with different sections such as authentication, categories, messages, and topics.

## Project Structure

The project is structured as follows:

```
frontend
├── .dist/                # Distribution folder for build output (ignored in Git)
├── .vscode/              # Editor settings and configurations
├── node_modules/         # Project dependencies
├── public/               # Static assets (images, icons, etc.)
├── src/
│   ├── components/       # Reusable React components
│   │   ├── auth/         # Components related to user authentication
│   │   ├── category/     # Category-related components
│   │   ├── common/       # Common/shared components
│   │   ├── header/       # Header components for site navigation
│   │   ├── message/      # Message-related components
│   │   └── topics/       # Components for forum topics
│   ├── service/          # Service layer for API calls (using axios)
│   └── styles/           # Global and component-specific styles
├── App.jsx               # Root component
├── main.jsx              # Entry point for the React app
├── .gitignore            # Ignored files and folders
├── eslint.config.js      # ESLint configuration
├── index.html            # HTML template
├── package.json          # Project dependencies and scripts
├── package-lock.json     # Dependency version lock file
├── README.md             # Project documentation (this file)
└── vite.config.js        # Vite configuration
```

## Available Scripts

In the project directory, you can run:

- **`npm run dev`**: Starts the development server.
- **`npm run build`**: Builds the project for production.
- **`npm run preview`**: Previews the production build locally.
- **`npm run lint`**: Lints the codebase using ESLint.

## Key Dependencies

- **React**: Core library for building the user interface.
- **React DOM**: Enables React components to render in the DOM.
- **React Router DOM**: For routing within the application.
- **Material UI (MUI)**: Provides a set of React components for faster and easier web development.
  - `@mui/material`: Core Material UI components.
  - `@mui/icons-material`: Material icons for UI.
- **Emotion**: A CSS-in-JS library used with Material UI for styling.
- **Axios**: For making HTTP requests to the backend API.
- **Date-fns**: A date utility library for manipulating and formatting dates.
- **JWT Decode**: Used to decode JSON Web Tokens for handling authentication.

### Development Dependencies

- **Vite**: Frontend build tool for faster development.
- **ESLint**: Linter for identifying and reporting on patterns in JavaScript.
  - `eslint-plugin-react`: React-specific linting rules.
  - `eslint-plugin-react-hooks`: Ensures proper usage of React hooks.
  - `eslint-plugin-react-refresh`: Assists with React Fast Refresh during development.
- **Globals**: Provides global variable definitions for ESLint.

## ESLint Configuration

The project includes a customized ESLint configuration for consistent code style and error checking. Key configurations include:

- Support for ES2020 syntax and JSX.
- Recommended rules from `eslint-plugin-react` and `eslint-plugin-react-hooks`.
- Disables the `react/jsx-no-target-blank` rule.
- Warns if components are not exported properly when using `react-refresh`.

## Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/forum-system-frontend.git
   cd forum-system-frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

5. **Lint the code**:
   ```bash
   npm run lint
   ```

## API Integration

This frontend communicates with a backend API (not included in this repository) for data and authentication. The service layer, located in `src/service/`, handles API calls with `axios`. Make sure to configure the API base URL and any necessary environment variables.

## Contributing

If you’d like to contribute to this project, please fork the repository, create a new branch, and submit a pull request. 

## License

This project is licensed under [MIT License](LICENSE).

---
