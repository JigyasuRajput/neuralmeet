# Contributing to NeuralMeet

Thank you for your interest in contributing to NeuralMeet! We welcome contributions from the community and are excited to collaborate with you.

## 🤝 Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. We expect all contributors to be respectful, inclusive, and constructive in their interactions.

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js 18+**
- **npm** or **yarn**
- **Git**
- **PostgreSQL** (local or remote)

### Development Setup

1. **Fork the repository**
   ```bash
   # Click the "Fork" button on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/neuralmeet.git
   cd neuralmeet
   ```

2. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/JigyasuRajput/neuralmeet.git
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Fill in your environment variables (see README.md for details)
   ```

5. **Set up the database**
   ```bash
   npm run db:push
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

## 📝 How to Contribute

### Reporting Issues

1. **Search existing issues** first to avoid duplicates
2. **Use issue templates** when creating new issues
3. **Provide detailed information**:
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details
   - Screenshots/logs if applicable

### Suggesting Features

1. **Check the roadmap** and existing feature requests
2. **Open a discussion** before implementing large features
3. **Provide clear use cases** and implementation ideas

### Code Contributions

#### Branch Naming Convention
- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring

#### Development Workflow

1. **Create a new branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, readable code
   - Follow existing code style
   - Add tests for new functionality
   - Update documentation as needed

3. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

4. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create a Pull Request**
   - Use the PR template
   - Link related issues
   - Provide clear description of changes

## 🎯 Coding Standards

### Code Style

- **TypeScript**: Use strict typing, avoid `any`
- **ESLint**: Follow the existing ESLint configuration
- **Prettier**: Code formatting is handled automatically
- **File naming**: Use kebab-case for files and folders

### Code Quality

- **Components**: Use functional components with hooks
- **Error handling**: Implement proper error boundaries
- **Performance**: Consider React performance best practices
- **Accessibility**: Follow WCAG guidelines

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(auth): add biometric authentication
fix(video): resolve connection timeout issue
docs: update API documentation
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- components/ui/button.test.tsx
```

### Writing Tests

- Write unit tests for utilities and components
- Write integration tests for API routes
- Use React Testing Library for component tests
- Mock external services appropriately

## 📚 Documentation

### Code Documentation

- **JSDoc comments** for complex functions
- **README updates** for new features
- **Type definitions** should be self-documenting

### API Documentation

- Document new tRPC procedures
- Update API examples in README
- Include request/response schemas

## 🔍 Pull Request Guidelines

### Before Submitting

- [ ] Code follows project style guidelines
- [ ] Self-review of code completed
- [ ] Tests added/updated and passing
- [ ] Documentation updated
- [ ] No console.log statements left behind
- [ ] TypeScript errors resolved

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] New tests added (if applicable)

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
```

### Review Process

1. **Automated checks** must pass
2. **At least one maintainer** approval required
3. **Address feedback** promptly and respectfully
4. **Squash commits** before merging (if requested)

## 🏗 Project Structure

When adding new features, follow the existing structure:

```
src/
├── app/                    # Next.js App Router pages
├── components/
│   ├── ui/                # Reusable UI components
│   └── features/          # Feature-specific components
├── modules/               # Feature modules
├── lib/                   # Utility libraries
├── db/                    # Database schema and queries
├── trpc/                  # API procedures
└── inngest/               # Background jobs
```

## 🤔 Need Help?

### Getting Support

- **Documentation**: Check README.md and existing docs
- **Issues**: Search existing issues for solutions
- **Discussions**: Use GitHub Discussions for questions
- **Discord**: Join our community Discord server

### Maintainers

- **Jigyasu Rajput** - [@JigyasuRajput](https://github.com/JigyasuRajput)

## 🏆 Recognition

Contributors will be recognized in:
- Project README
- Release notes
- Contributors section

Thank you for contributing to NeuralMeet! 🧠✨

---

<div align="center">
  <p>Happy Coding! 🚀</p>
</div>
