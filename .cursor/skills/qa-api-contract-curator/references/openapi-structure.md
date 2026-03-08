# OpenAPI 3.x Specification Structure Reference

Reference for building and validating OpenAPI 3.x specifications. Use when generating or curating API contracts.

## Document Root

```yaml
openapi: 3.0.3
info:
  title: API Title
  description: API description
  version: 1.0.0
  contact:
    name: API Support
    email: support@example.com
servers:
  - url: https://api.example.com/v1
    description: Production
  - url: https://staging-api.example.com/v1
    description: Staging
paths: {}
components: {}
```

## Paths

### Basic Path Structure

```yaml
paths:
  /users:
    get:
      summary: List users
      operationId: listUsers
      tags:
        - Users
      parameters: []
      responses:
        '200':
          description: Success
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserList'
    post:
      summary: Create user
      operationId: createUser
      tags:
        - Users
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UserCreate'
      responses:
        '201':
          description: Created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
        '400':
          description: Validation error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  /users/{userId}:
    parameters:
      - $ref: '#/components/parameters/UserId'
    get:
      summary: Get user by ID
      operationId: getUserById
      responses:
        '200':
          description: Success
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
        '404':
          description: Not found
```

### Path Parameters

```yaml
/users/{userId}/orders/{orderId}:
  parameters:
    - name: userId
      in: path
      required: true
      schema:
        type: string
        format: uuid
    - name: orderId
      in: path
      required: true
      schema:
        type: string
```

## Parameters

### Query Parameters

```yaml
parameters:
  - name: page
    in: query
    description: Page number (1-based)
    schema:
      type: integer
      minimum: 1
      default: 1
  - name: limit
    in: query
    description: Items per page
    schema:
      type: integer
      minimum: 1
      maximum: 100
      default: 20
  - name: sort
    in: query
    schema:
      type: string
      enum: [createdAt, updatedAt, name]
  - name: filter
    in: query
    description: JSON filter expression
    schema:
      type: string
```

### Header Parameters

```yaml
parameters:
  - name: X-Request-ID
    in: header
    description: Idempotency key
    schema:
      type: string
      format: uuid
  - name: X-Correlation-ID
    in: header
    schema:
      type: string
```

## Schemas (Components)

### Basic Schema

```yaml
components:
  schemas:
    User:
      type: object
      required:
        - id
        - email
      properties:
        id:
          type: string
          format: uuid
          readOnly: true
        email:
          type: string
          format: email
        name:
          type: string
          nullable: true
        createdAt:
          type: string
          format: date-time
          readOnly: true
```

### Schema with Examples

```yaml
User:
  type: object
  properties:
    id:
      type: string
      format: uuid
      example: "550e8400-e29b-41d4-a716-446655440000"
    email:
      type: string
      format: email
      example: "user@example.com"
  example:
    id: "550e8400-e29b-41d4-a716-446655440000"
    email: "user@example.com"
    name: "Jane Doe"
    createdAt: "2024-01-15T10:30:00Z"
```

### Array Schema

```yaml
UserList:
  type: object
  properties:
    items:
      type: array
      items:
        $ref: '#/components/schemas/User'
    total:
      type: integer
      description: Total count
    page:
      type: integer
    limit:
      type: integer
```

### Enum and OneOf

```yaml
OrderStatus:
  type: string
  enum: [pending, confirmed, shipped, delivered, cancelled]

PaymentMethod:
  oneOf:
    - $ref: '#/components/schemas/CardPayment'
    - $ref: '#/components/schemas/BankTransfer'
```

### Error Schema

```yaml
Error:
  type: object
  required:
    - code
    - message
  properties:
    code:
      type: string
      example: "VALIDATION_ERROR"
    message:
      type: string
      example: "Invalid input"
    details:
      type: array
      items:
        type: object
        properties:
          field:
            type: string
          reason:
            type: string
```

## Security Schemes

### API Key (Header)

```yaml
components:
  securitySchemes:
    ApiKeyAuth:
      type: apiKey
      in: header
      name: X-API-Key
      description: API key for authentication
```

### Bearer JWT

```yaml
BearerAuth:
  type: http
  scheme: bearer
  bearerFormat: JWT
  description: JWT token from /auth/login
```

### OAuth2

```yaml
OAuth2:
  type: oauth2
  flows:
    authorizationCode:
      authorizationUrl: https://auth.example.com/oauth/authorize
      tokenUrl: https://auth.example.com/oauth/token
      scopes:
        read: Read access
        write: Write access
```

### Applying Security

```yaml
# Global (all operations)
security:
  - ApiKeyAuth: []

# Per-operation override
paths:
  /users:
    get:
      security: []  # Public
    post:
      security:
        - BearerAuth: [write]
```

## Responses

### Success and Error Responses

```yaml
responses:
  '200':
    description: Success
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/User'
        examples:
          default:
            value:
              id: "550e8400-e29b-41d4-a716-446655440000"
              email: "user@example.com"
  '400':
    description: Bad request
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/Error'
  '401':
    description: Unauthorized
  '404':
    description: Not found
  '500':
    description: Internal server error
```

## Reusable Components

### Parameters

```yaml
components:
  parameters:
    UserId:
      name: userId
      in: path
      required: true
      schema:
        type: string
        format: uuid
    PageSize:
      name: limit
      in: query
      schema:
        type: integer
        default: 20
        maximum: 100
```

### Examples

```yaml
components:
  examples:
    UserExample:
      summary: Sample user
      value:
        id: "550e8400-e29b-41d4-a716-446655440000"
        email: "jane@example.com"
        name: "Jane Doe"
```

## Tags

```yaml
tags:
  - name: Users
    description: User management operations
  - name: Orders
    description: Order lifecycle operations
```

## Deprecation

```yaml
paths:
  /v1/legacy/users:
    deprecated: true
    get:
      summary: List users (deprecated)
      deprecated: true
      description: Use GET /v2/users instead. Will be removed in v3.
```
