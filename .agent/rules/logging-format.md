---
trigger: always_on
---

# Logging Rules

When implementing logging in the `trailblazer-backend` project, you must follow the structured logging format using the `winston` logger. This ensures consistency and makes logs easier to search and filter in monitoring tools like New Relic.

## Import
Always import the logger from the project's winston library:
```typescript
import logger from "@/libs/winston";
```

## Structure
All log calls must include a message string as the first argument and a metadata object as the second argument. The metadata object must include `layer` and `context`.

```typescript
logger.<level>(message: string, meta: {
    layer: string;
    context: string;
    data?: any;
    error?: any;
});
```

- **layer**: The architectural layer (e.g., "controller", "service", "repository", "middleware", "event").
- **context**: A dot-separated string indicating the specific location (e.g., "controller.user.login").
- **data**: (Optional) Relevant data context, such as request query parameters or user object.
- **error**: (Optional) Error object or message, primarily for `warn` and `error` levels.

## Usage Examples

### Info
Use `logger.info` for successful operations, key events, and general information flow.

**Format:**
```typescript
logger.info("Message describing the event", { 
    layer: "layer_name", 
    context: "domain.feature.action", 
    data: variableOkToLog 
});
```

**Example:**
```typescript
logger.info("Login successful", { 
    layer: "controller", 
    context: "controller.user.login", 
    data: user 
});
```

### Warn
Use `logger.warn` for expected implementation issues, validation errors, or missing data that doesn't crash the app but should be noted.

**Format:**
```typescript
logger.warn("Warning message", { 
    layer: "layer_name", 
    context: "domain.feature.action", 
    data: inputData,
    error: errorMessageOrObject 
});
```

**Example:**
```typescript
logger.warn("Validation error", { 
    layer: "controller", 
    context: "controller.user.login", 
    data: req.query, 
    error: err.message 
});
```

### Error
Use `logger.error` for exceptions, unexpected failures, and critical issues.

**Format:**
```typescript
logger.error("Error message", { 
    layer: "layer_name", 
    context: "domain.feature.action", 
    error: errorObject 
});
```

**Example:**
```typescript
logger.error("Login failed", { 
    layer: "controller", 
    context: "controller.user.login", 
    data: req.query, 
    error: err 
});
```
