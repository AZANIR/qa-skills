# ISO/IEC/IEEE 29148 SRS Structure Reference

ISO/IEC/IEEE 29148 defines the structure and content of Software Requirements Specifications (SRS). Use this reference when generating requirements documents.

## Document Sections

### 1. Introduction

#### 1.1 Purpose
Identifies the product and describes the purpose of the SRS document.

**Example:**
> This Software Requirements Specification defines the functional and non-functional requirements for the Customer Portal application. It serves as the authoritative source for development, testing, and validation activities.

#### 1.2 Scope
Describes the product scope, major functions, and exclusions.

**Example:**
> The Customer Portal enables authenticated users to manage their profile, view order history, and submit support tickets. Out of scope: payment processing (handled by external gateway), mobile native apps.

#### 1.3 Definitions, Acronyms, and Abbreviations
Glossary of terms used in the document.

**Example:**
> - **User:** An authenticated individual with access to the system
> - **Session:** A period of authenticated interaction bounded by login and logout
> - **API:** Application Programming Interface

---

### 2. Overall Description

#### 2.1 Product Perspective
Describes the product in context: interfaces to other systems, hardware, software, users.

**Example:**
> The Customer Portal integrates with the Order Management System (OMS) via REST API, authenticates against Microsoft Entra ID, and runs in a containerized environment on Azure.

#### 2.2 User Classes and Characteristics
Identifies user roles and their characteristics.

**Example:**
> - **End User:** General customer; requires simple, guided workflows
> - **Support Agent:** Internal staff; requires bulk operations and search
> - **Administrator:** System config; requires audit trails and role management

#### 2.3 Operating Environment
Hardware, software, and network constraints.

**Example:**
> - Browsers: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
> - Resolution: 1280×720 minimum
> - Network: HTTPS required; offline mode not supported

---

### 3. Functional Requirements

Each requirement follows the format:

```
[REQ-FN-XXX] Title
Description: [Clear, unambiguous statement]
Priority: Critical | High | Medium | Low
Acceptance Criteria:
  Given [precondition]
  When [action]
  Then [expected outcome]
Source: [URL | Figma | Code | Description]
Dependencies: [REQ-FN-YYY, ...]
Status: Draft | Reviewed | Approved
```

**Numbering:** Use sequential numbering (001, 002, ...) within each type.

---

### 4. Non-Functional Requirements

Categories per ISO 25010:

| Category | Examples |
|----------|----------|
| Performance | Response time, throughput, resource usage |
| Security | Authentication, authorization, data protection |
| Usability | Learnability, accessibility (WCAG) |
| Reliability | Availability, fault tolerance |
| Maintainability | Modularity, testability |
| Portability | Platform independence |

**Format:** `[REQ-NFR-XXX]` with same structure as functional requirements.

---

### 5. External Interface Requirements

#### 5.1 User Interfaces
Screens, layouts, interaction patterns.

#### 5.2 Hardware Interfaces
Devices, sensors, peripherals.

#### 5.3 Software Interfaces
APIs, databases, third-party services.

#### 5.4 Communication Interfaces
Protocols, formats, ports.

---

### 6. Constraints

Regulatory, technical, or business constraints.

**Example:**
> - GDPR: Personal data must be deletable within 30 days of request
> - PCI-DSS: No storage of full card numbers
> - Must support RTL languages for future localization

---

### 7. Dependencies

External systems, libraries, or conditions the product depends on.

**Example:**
> - OMS API v2.1 or later
> - Entra ID tenant configuration
> - CDN for static assets

---

## Requirement Quality Attributes (ISO 29148)

| Attribute | Description |
|-----------|-------------|
| Complete | No missing information |
| Correct | Accurately reflects stakeholder needs |
| Unambiguous | Single interpretation |
| Verifiable | Can be tested or demonstrated |
| Consistent | No conflicts with other requirements |
| Traceable | Links to source and downstream artifacts |
| Modifiable | Structured for change management |

---

## Requirement Writing Rules

1. **Use "shall"** for mandatory requirements (not "should", "may", "might")
2. **One requirement per statement** — avoid compound sentences
3. **Avoid vague terms** — "user-friendly", "fast", "robust" need quantification
4. **Include measurable criteria** — "within 2 seconds", "99.9% uptime"
5. **Link to source** — traceability for each requirement
