# Web App Infrastructure Checklist

An interactive React checklist covering 130+ often-overlooked infrastructure, security, and operational hardening items for web applications. Built as a single-file React component.

## What This Covers

This is not a content or design checklist. It focuses on the underlying plumbing that's easy to forget and painful to fix after launch:

- **HTTPS & TLS** -- cert management, HSTS, cipher suites, protocol versions
- **CSRF Protection** -- tokens, SameSite cookies, origin validation
- **CORS Configuration** -- origin whitelisting, credential handling, preflight caching
- **Security Headers** -- CSP, X-Frame-Options, Referrer-Policy, Permissions-Policy, cache control
- **Cookie Security** -- Secure/HttpOnly/SameSite flags, prefixes, scoping
- **Authentication & Sessions** -- hashing, MFA, session fixation, lockout, enumeration prevention
- **Input Validation & Injection** -- SQL injection, XSS, SSRF, path traversal, file uploads, deserialization
- **Rate Limiting & Abuse Prevention** -- brute force, DDoS, request size limits
- **DNS & Domain** -- SPF, DKIM, DMARC, CAA records, registrar locks
- **Error Handling & Information Leakage** -- stack traces, server headers, debug mode, source maps
- **Logging & Monitoring** -- access logs, auth event logging, sensitive data exclusion, alerting
- **Database & Data** -- network isolation, encryption at rest/transit, backup testing, connection pooling
- **Secrets & Configuration** -- env vars, git hygiene, secret scanning, rotation, credential separation
- **Deployment & Infrastructure** -- CI/CD, rollback, non-root execution, firewall rules, patching
- **Dependency Management** -- vulnerability scanning, lockfiles, supply chain security
- **API Security** -- authorization, IDOR, JWT handling, pagination, schema validation
- **Compliance & Privacy Basics** -- data inventory, consent, PII encryption, retention, deletion
- **Backup & Disaster Recovery** -- backup testing, RPO/RTO, runbooks, failover
- **Performance & Reliability** -- compression, CDN, timeouts, health checks, graceful shutdown

## Priority Levels

Each item is tagged with a priority:

| Level | Meaning |
|---|---|
| **Critical** | Your app is actively vulnerable or unreliable without this |
| **Recommended** | Strong hardening that should be in place for any production app |
| **Optional** | Nice-to-have for mature setups or specific compliance needs |

## Features

- Click items to check them off
- Filter by priority level (Critical / Recommended / Optional)
- Hide completed items to focus on what's left
- Per-category progress bars
- Overall progress and critical item counter
- Collapsible category sections

## Usage

This is a standalone React component (JSX) designed to run in any React environment. It has no external dependencies beyond React itself.

### In an existing React project

Drop the file into your components directory and import it:

```jsx
import WebAppChecklist from "./webapp-checklist";

function App() {
  return <WebAppChecklist />;
}
```

### Fonts

The component imports JetBrains Mono and Space Grotesk from Google Fonts via CSS. If you're in an environment without external font access, it falls back to system monospace fonts.

## Customization

The checklist data lives in the `CHECKLIST_DATA` array at the top of the file. Each category is an object with:

```js
{
  category: "Category Name",
  icon: "🔒",
  items: [
    {
      id: "unique-id",
      text: "Description of the checklist item",
      priority: "critical" | "recommended" | "optional"
    }
  ]
}
```

Add, remove, or edit items directly in that array.

## State

Checked state is held in React component state and resets on page reload. If you need persistence, wire the `checked` state to localStorage, a database, or the storage API of your host environment.

## License

Use however you want. No attribution required.
