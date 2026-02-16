import { useState, useEffect } from "react";

const CHECKLIST_DATA = [
  {
    category: "HTTPS & TLS",
    icon: "🔒",
    items: [
      { id: "tls-cert", text: "TLS certificate installed and auto-renewing (Let's Encrypt / managed cert)", priority: "critical" },
      { id: "tls-redirect", text: "HTTP to HTTPS redirect enforced (301 permanent redirect)", priority: "critical" },
      { id: "tls-version", text: "TLS 1.2 minimum enforced, TLS 1.3 preferred, SSL/TLS 1.0/1.1 disabled", priority: "critical" },
      { id: "hsts", text: "HSTS header enabled with long max-age (Strict-Transport-Security)", priority: "critical" },
      { id: "hsts-preload", text: "HSTS preload list submission (includeSubDomains + preload directive)", priority: "recommended" },
      { id: "tls-ciphers", text: "Strong cipher suites only, weak ciphers disabled (no RC4, DES, 3DES)", priority: "recommended" },
      { id: "cert-transparency", text: "Certificate Transparency monitoring configured", priority: "optional" },
    ],
  },
  {
    category: "CSRF Protection",
    icon: "🛡️",
    items: [
      { id: "csrf-tokens", text: "CSRF tokens on all state-changing forms and endpoints", priority: "critical" },
      { id: "csrf-samesite", text: "SameSite cookie attribute set (Lax minimum, Strict where possible)", priority: "critical" },
      { id: "csrf-origin", text: "Origin/Referer header validation on server side", priority: "recommended" },
      { id: "csrf-double", text: "Double-submit cookie pattern as defense-in-depth", priority: "optional" },
      { id: "csrf-custom-header", text: "Custom request header requirement for API calls (X-Requested-With)", priority: "recommended" },
    ],
  },
  {
    category: "CORS Configuration",
    icon: "🌐",
    items: [
      { id: "cors-whitelist", text: "Explicit origin whitelist, never wildcard (*) with credentials", priority: "critical" },
      { id: "cors-methods", text: "Allowed methods restricted to only what's needed", priority: "critical" },
      { id: "cors-headers", text: "Allowed headers explicitly listed, not wildcarded", priority: "recommended" },
      { id: "cors-preflight", text: "Preflight (OPTIONS) responses cached with appropriate max-age", priority: "recommended" },
      { id: "cors-credentials", text: "Access-Control-Allow-Credentials only when actually needed", priority: "critical" },
      { id: "cors-expose", text: "Exposed headers limited to only what frontend needs", priority: "recommended" },
    ],
  },
  {
    category: "Security Headers",
    icon: "📋",
    items: [
      { id: "csp", text: "Content-Security-Policy header configured (no unsafe-inline ideally)", priority: "critical" },
      { id: "csp-report", text: "CSP report-uri or report-to directive for violation monitoring", priority: "recommended" },
      { id: "x-content-type", text: "X-Content-Type-Options: nosniff", priority: "critical" },
      { id: "x-frame", text: "X-Frame-Options: DENY or SAMEORIGIN (clickjacking protection)", priority: "critical" },
      { id: "referrer-policy", text: "Referrer-Policy set (strict-origin-when-cross-origin or stricter)", priority: "recommended" },
      { id: "permissions-policy", text: "Permissions-Policy header restricting browser features (camera, mic, geolocation)", priority: "recommended" },
      { id: "x-xss", text: "Remove X-XSS-Protection (deprecated, can cause issues in modern browsers)", priority: "optional" },
      { id: "cache-control", text: "Cache-Control: no-store on sensitive pages (auth, account, PII)", priority: "critical" },
    ],
  },
  {
    category: "Cookie Security",
    icon: "🍪",
    items: [
      { id: "cookie-secure", text: "Secure flag on all cookies (HTTPS only transmission)", priority: "critical" },
      { id: "cookie-httponly", text: "HttpOnly flag on session/auth cookies (no JS access)", priority: "critical" },
      { id: "cookie-samesite", text: "SameSite attribute set on all cookies", priority: "critical" },
      { id: "cookie-prefix", text: "__Host- or __Secure- cookie prefixes for critical cookies", priority: "recommended" },
      { id: "cookie-expiry", text: "Reasonable expiration times, not perpetual sessions", priority: "recommended" },
      { id: "cookie-scope", text: "Cookie path and domain scoped as narrowly as possible", priority: "recommended" },
    ],
  },
  {
    category: "Authentication & Sessions",
    icon: "🔑",
    items: [
      { id: "auth-hash", text: "Passwords hashed with bcrypt/scrypt/argon2 (never MD5/SHA)", priority: "critical" },
      { id: "auth-mfa", text: "Multi-factor authentication available and encouraged", priority: "critical" },
      { id: "auth-lockout", text: "Account lockout or progressive delays after failed attempts", priority: "critical" },
      { id: "auth-session-regen", text: "Session ID regenerated after login (session fixation prevention)", priority: "critical" },
      { id: "auth-session-timeout", text: "Idle session timeout and absolute session expiry", priority: "recommended" },
      { id: "auth-logout", text: "Proper server-side session invalidation on logout", priority: "critical" },
      { id: "auth-password-policy", text: "Password length minimum (12+), check against breached password lists", priority: "recommended" },
      { id: "auth-reset", text: "Secure password reset flow (time-limited tokens, rate limited)", priority: "critical" },
      { id: "auth-enum", text: "Prevent user enumeration on login/register/reset forms", priority: "recommended" },
    ],
  },
  {
    category: "Input Validation & Injection",
    icon: "💉",
    items: [
      { id: "input-server", text: "Server-side validation on ALL inputs (never trust client)", priority: "critical" },
      { id: "input-sql", text: "Parameterized queries / prepared statements everywhere (SQL injection)", priority: "critical" },
      { id: "input-xss", text: "Output encoding/escaping for XSS prevention (context-aware)", priority: "critical" },
      { id: "input-sanitize", text: "HTML sanitization on any user-generated rich content", priority: "critical" },
      { id: "input-file", text: "File upload validation (type, size, name sanitization, storage outside webroot)", priority: "critical" },
      { id: "input-cmd", text: "OS command injection prevention (avoid shell exec, use parameterized alternatives)", priority: "critical" },
      { id: "input-path", text: "Path traversal protection on any file operations", priority: "critical" },
      { id: "input-deserialization", text: "Safe deserialization practices (no untrusted object deserialization)", priority: "recommended" },
      { id: "input-ssrf", text: "SSRF protection on any server-side URL fetching", priority: "recommended" },
    ],
  },
  {
    category: "Rate Limiting & Abuse Prevention",
    icon: "⏱️",
    items: [
      { id: "rate-api", text: "API rate limiting per user/IP with appropriate windows", priority: "critical" },
      { id: "rate-login", text: "Login endpoint rate limiting (brute force prevention)", priority: "critical" },
      { id: "rate-signup", text: "Registration rate limiting and bot prevention", priority: "recommended" },
      { id: "rate-headers", text: "Rate limit headers in responses (X-RateLimit-Limit, Remaining, Reset)", priority: "recommended" },
      { id: "rate-429", text: "Proper 429 Too Many Requests response with Retry-After header", priority: "recommended" },
      { id: "rate-ddos", text: "DDoS protection layer (Cloudflare, AWS Shield, etc.)", priority: "critical" },
      { id: "rate-request-size", text: "Request body size limits configured", priority: "critical" },
    ],
  },
  {
    category: "DNS & Domain",
    icon: "📡",
    items: [
      { id: "dns-caa", text: "CAA records limiting which CAs can issue certs for your domain", priority: "recommended" },
      { id: "dns-spf", text: "SPF record configured for email authentication", priority: "critical" },
      { id: "dns-dkim", text: "DKIM signing configured for outbound email", priority: "critical" },
      { id: "dns-dmarc", text: "DMARC policy set (p=quarantine or p=reject)", priority: "critical" },
      { id: "dns-dnssec", text: "DNSSEC enabled if registrar supports it", priority: "optional" },
      { id: "dns-registrar-lock", text: "Domain registrar lock enabled, transfer protection on", priority: "critical" },
      { id: "dns-ttl", text: "Appropriate DNS TTL values (not too long, not too short)", priority: "recommended" },
    ],
  },
  {
    category: "Error Handling & Information Leakage",
    icon: "🚨",
    items: [
      { id: "error-generic", text: "Generic error pages in production (no stack traces, no debug info)", priority: "critical" },
      { id: "error-server-header", text: "Server header removed or genericized (don't leak nginx/Apache version)", priority: "recommended" },
      { id: "error-powered-by", text: "X-Powered-By header removed (don't leak framework info)", priority: "recommended" },
      { id: "error-404", text: "Custom 404/500 pages that don't reveal directory structure", priority: "recommended" },
      { id: "error-api", text: "API error responses don't leak internal details (DB errors, paths, etc.)", priority: "critical" },
      { id: "error-source-maps", text: "Source maps not deployed to production (or access-restricted)", priority: "recommended" },
      { id: "error-directory", text: "Directory listing disabled on web server", priority: "critical" },
      { id: "error-debug", text: "Debug mode OFF in production (Django DEBUG=False, etc.)", priority: "critical" },
    ],
  },
  {
    category: "Logging & Monitoring",
    icon: "📊",
    items: [
      { id: "log-access", text: "Access logs with IP, timestamp, request, response code", priority: "critical" },
      { id: "log-auth", text: "Authentication events logged (login, logout, failed attempts, MFA)", priority: "critical" },
      { id: "log-sensitive", text: "Sensitive data NEVER logged (passwords, tokens, PII, credit cards)", priority: "critical" },
      { id: "log-centralized", text: "Centralized log aggregation (ELK, Datadog, CloudWatch, etc.)", priority: "recommended" },
      { id: "log-alerts", text: "Alerting on anomalous patterns (spike in 500s, auth failures, etc.)", priority: "recommended" },
      { id: "log-retention", text: "Log retention policy defined and implemented", priority: "recommended" },
      { id: "log-uptime", text: "Uptime monitoring with alerting (health check endpoint)", priority: "critical" },
      { id: "log-apm", text: "Application performance monitoring (response times, throughput)", priority: "recommended" },
    ],
  },
  {
    category: "Database & Data",
    icon: "🗄️",
    items: [
      { id: "db-no-public", text: "Database not publicly accessible (private subnet / firewall)", priority: "critical" },
      { id: "db-credentials", text: "Database credentials in env vars or secrets manager, never in code", priority: "critical" },
      { id: "db-least-priv", text: "App DB user has minimum required permissions (not root/admin)", priority: "critical" },
      { id: "db-encryption-rest", text: "Encryption at rest enabled for database storage", priority: "critical" },
      { id: "db-encryption-transit", text: "Encryption in transit (TLS) for database connections", priority: "critical" },
      { id: "db-backups", text: "Automated backups with tested restore procedures", priority: "critical" },
      { id: "db-backup-encryption", text: "Backups encrypted and stored in separate location", priority: "recommended" },
      { id: "db-migrations", text: "Database migration strategy and rollback plan", priority: "recommended" },
      { id: "db-connection-pool", text: "Connection pooling configured with sensible limits", priority: "recommended" },
    ],
  },
  {
    category: "Secrets & Configuration",
    icon: "🔐",
    items: [
      { id: "secrets-env", text: "Secrets in environment variables or secrets manager (never hardcoded)", priority: "critical" },
      { id: "secrets-git", text: ".gitignore covers .env, credentials, keys, and secrets files", priority: "critical" },
      { id: "secrets-scanning", text: "Git secret scanning enabled (GitHub secret scanning, gitleaks, etc.)", priority: "recommended" },
      { id: "secrets-rotation", text: "Secret/key rotation policy and process in place", priority: "recommended" },
      { id: "secrets-api-keys", text: "API keys scoped with minimum permissions needed", priority: "critical" },
      { id: "secrets-separate", text: "Separate credentials for dev/staging/production environments", priority: "critical" },
    ],
  },
  {
    category: "Deployment & Infrastructure",
    icon: "🏗️",
    items: [
      { id: "deploy-ci-cd", text: "CI/CD pipeline with automated testing before deploy", priority: "critical" },
      { id: "deploy-rollback", text: "Rollback strategy documented and tested", priority: "critical" },
      { id: "deploy-staging", text: "Staging environment that mirrors production", priority: "recommended" },
      { id: "deploy-iac", text: "Infrastructure as Code (Terraform, Pulumi, CloudFormation)", priority: "recommended" },
      { id: "deploy-containers", text: "Container images scanned for vulnerabilities before deploy", priority: "recommended" },
      { id: "deploy-non-root", text: "Application runs as non-root user", priority: "critical" },
      { id: "deploy-firewall", text: "Network firewall rules (only required ports open)", priority: "critical" },
      { id: "deploy-ssh", text: "SSH key-only auth, root login disabled, non-standard port", priority: "recommended" },
      { id: "deploy-updates", text: "OS and dependency security patches applied regularly", priority: "critical" },
      { id: "deploy-immutable", text: "Immutable deployments (don't patch live servers)", priority: "optional" },
    ],
  },
  {
    category: "Dependency Management",
    icon: "📦",
    items: [
      { id: "dep-audit", text: "Regular dependency vulnerability scanning (npm audit, pip-audit, etc.)", priority: "critical" },
      { id: "dep-lockfile", text: "Lockfiles committed (package-lock.json, poetry.lock, etc.)", priority: "critical" },
      { id: "dep-updates", text: "Automated dependency update PRs (Dependabot, Renovate)", priority: "recommended" },
      { id: "dep-supply-chain", text: "Supply chain security (verify package integrity, use trusted registries)", priority: "recommended" },
      { id: "dep-minimal", text: "Minimal dependency footprint, audit unused packages periodically", priority: "recommended" },
      { id: "dep-sbom", text: "Software Bill of Materials (SBOM) generated", priority: "optional" },
    ],
  },
  {
    category: "API Security",
    icon: "⚡",
    items: [
      { id: "api-auth", text: "All API endpoints require authentication (except explicitly public ones)", priority: "critical" },
      { id: "api-authz", text: "Authorization checks on every endpoint (not just authentication)", priority: "critical" },
      { id: "api-idor", text: "IDOR prevention, verify resource ownership on access", priority: "critical" },
      { id: "api-pagination", text: "Pagination enforced on list endpoints (prevent data dumps)", priority: "recommended" },
      { id: "api-versioning", text: "API versioning strategy implemented", priority: "recommended" },
      { id: "api-input-schema", text: "Request schema validation (reject unexpected fields)", priority: "recommended" },
      { id: "api-jwt", text: "JWT tokens: short expiry, proper signature verification, no sensitive data in payload", priority: "critical" },
      { id: "api-graphql", text: "GraphQL: query depth limiting, complexity analysis, introspection disabled in prod", priority: "recommended" },
    ],
  },
  {
    category: "Compliance & Privacy Basics",
    icon: "📜",
    items: [
      { id: "privacy-data-inventory", text: "Data inventory: know what PII you collect and where it's stored", priority: "critical" },
      { id: "privacy-consent", text: "Cookie consent mechanism if required by jurisdiction (GDPR, etc.)", priority: "critical" },
      { id: "privacy-encryption-pii", text: "PII encrypted at rest, not stored in plaintext logs or caches", priority: "critical" },
      { id: "privacy-retention", text: "Data retention policy, automated purge of old data", priority: "recommended" },
      { id: "privacy-deletion", text: "User data deletion capability (right to be forgotten)", priority: "recommended" },
      { id: "privacy-subprocessors", text: "Third-party/subprocessor data sharing documented", priority: "recommended" },
    ],
  },
  {
    category: "Backup & Disaster Recovery",
    icon: "💾",
    items: [
      { id: "dr-backup-schedule", text: "Automated backup schedule (DB, file storage, config)", priority: "critical" },
      { id: "dr-backup-test", text: "Backup restoration regularly tested (not just assumed working)", priority: "critical" },
      { id: "dr-rpo-rto", text: "RPO and RTO defined and achievable with current setup", priority: "recommended" },
      { id: "dr-runbook", text: "Disaster recovery runbook documented", priority: "recommended" },
      { id: "dr-multi-region", text: "Multi-region or multi-AZ deployment for high availability", priority: "optional" },
      { id: "dr-dns-failover", text: "DNS failover or load balancer health checks configured", priority: "recommended" },
    ],
  },
  {
    category: "Performance & Reliability",
    icon: "🚀",
    items: [
      { id: "perf-gzip", text: "Response compression enabled (gzip/brotli)", priority: "critical" },
      { id: "perf-cdn", text: "Static assets served via CDN with proper cache headers", priority: "recommended" },
      { id: "perf-cache-headers", text: "Cache-Control and ETag headers on static resources", priority: "recommended" },
      { id: "perf-timeout", text: "Request timeouts configured (don't let hung requests pile up)", priority: "critical" },
      { id: "perf-connection-limits", text: "Connection limits and queue depths configured", priority: "recommended" },
      { id: "perf-health-check", text: "Health check endpoint that tests downstream dependencies", priority: "critical" },
      { id: "perf-graceful-shutdown", text: "Graceful shutdown handling (finish in-flight requests)", priority: "recommended" },
      { id: "perf-load-test", text: "Load testing performed before launch", priority: "recommended" },
    ],
  },
];

const PRIORITY_CONFIG = {
  critical: { label: "Critical", color: "#ef4444", bg: "#fef2f2", border: "#fecaca" },
  recommended: { label: "Recommended", color: "#f59e0b", bg: "#fffbeb", border: "#fde68a" },
  optional: { label: "Optional", color: "#6b7280", bg: "#f9fafb", border: "#e5e7eb" },
};

export default function WebAppChecklist() {
  const [checked, setChecked] = useState({});
  const [expandedCategories, setExpandedCategories] = useState(
    Object.fromEntries(CHECKLIST_DATA.map((c) => [c.category, true]))
  );
  const [filterPriority, setFilterPriority] = useState("all");
  const [hideCompleted, setHideCompleted] = useState(false);

  const toggle = (id) => setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  const toggleCategory = (cat) =>
    setExpandedCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));

  const totalItems = CHECKLIST_DATA.flatMap((c) => c.items).length;
  const checkedCount = Object.values(checked).filter(Boolean).length;
  const progress = totalItems > 0 ? (checkedCount / totalItems) * 100 : 0;

  const criticalTotal = CHECKLIST_DATA.flatMap((c) => c.items).filter((i) => i.priority === "critical").length;
  const criticalDone = CHECKLIST_DATA.flatMap((c) => c.items).filter((i) => i.priority === "critical" && checked[i.id]).length;

  const getFilteredItems = (items) => {
    let filtered = items;
    if (filterPriority !== "all") filtered = filtered.filter((i) => i.priority === filterPriority);
    if (hideCompleted) filtered = filtered.filter((i) => !checked[i.id]);
    return filtered;
  };

  const getCategoryProgress = (items) => {
    const done = items.filter((i) => checked[i.id]).length;
    return { done, total: items.length, pct: items.length > 0 ? (done / items.length) * 100 : 0 };
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0b",
      color: "#e4e4e7",
      fontFamily: "'JetBrains Mono', 'Fira Code', 'SF Mono', monospace",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #18181b; }
        ::-webkit-scrollbar-thumb { background: #3f3f46; border-radius: 3px; }
        .cat-row:hover { background: #18181b !important; }
        .check-item:hover { background: rgba(255,255,255,0.02); }
        .filter-btn { 
          border: 1px solid #27272a; background: transparent; color: #a1a1aa; 
          padding: 6px 14px; border-radius: 6px; cursor: pointer; font-size: 12px;
          font-family: 'JetBrains Mono', monospace; transition: all 0.15s;
        }
        .filter-btn:hover { border-color: #3f3f46; color: #e4e4e7; }
        .filter-btn.active { border-color: #22d3ee; color: #22d3ee; background: rgba(34,211,238,0.06); }
        .progress-glow { box-shadow: 0 0 20px rgba(34,211,238,0.15); }
      `}</style>

      {/* Header */}
      <div style={{ 
        borderBottom: "1px solid #1a1a1e",
        padding: "32px 24px 24px",
        background: "linear-gradient(180deg, #0f0f11 0%, #0a0a0b 100%)",
      }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 4 }}>
            <h1 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 26,
              fontWeight: 700,
              color: "#fafafa",
              letterSpacing: "-0.5px",
            }}>
              Web App Infrastructure Checklist
            </h1>
            <span style={{ fontSize: 11, color: "#52525b", fontWeight: 400 }}>v1.0</span>
          </div>
          <p style={{ fontSize: 12, color: "#71717a", marginBottom: 24 }}>
            Security, infrastructure, and operational hardening -- the stuff that's easy to forget.
          </p>

          {/* Progress */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 12 }}>
              <span style={{ color: "#a1a1aa" }}>
                <span style={{ color: "#22d3ee", fontWeight: 600 }}>{checkedCount}</span>
                <span style={{ color: "#52525b" }}> / {totalItems} completed</span>
              </span>
              <span style={{ color: criticalDone === criticalTotal ? "#22c55e" : "#ef4444" }}>
                {criticalDone}/{criticalTotal} critical
              </span>
            </div>
            <div style={{
              height: 6, background: "#18181b", borderRadius: 3, overflow: "hidden",
            }} className="progress-glow">
              <div style={{
                height: "100%",
                width: `${progress}%`,
                background: progress === 100
                  ? "linear-gradient(90deg, #22c55e, #4ade80)"
                  : "linear-gradient(90deg, #0891b2, #22d3ee)",
                borderRadius: 3,
                transition: "width 0.3s ease",
              }} />
            </div>
          </div>

          {/* Filters */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: 11, color: "#52525b", marginRight: 4 }}>FILTER:</span>
            {["all", "critical", "recommended", "optional"].map((p) => (
              <button
                key={p}
                className={`filter-btn ${filterPriority === p ? "active" : ""}`}
                onClick={() => setFilterPriority(p)}
              >
                {p === "all" ? "All" : PRIORITY_CONFIG[p]?.label || p}
              </button>
            ))}
            <div style={{ flex: 1 }} />
            <button
              className={`filter-btn ${hideCompleted ? "active" : ""}`}
              onClick={() => setHideCompleted(!hideCompleted)}
            >
              {hideCompleted ? "Show completed" : "Hide completed"}
            </button>
          </div>
        </div>
      </div>

      {/* Checklist */}
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "16px 24px 80px" }}>
        {CHECKLIST_DATA.map((section) => {
          const filteredItems = getFilteredItems(section.items);
          const { done, total, pct } = getCategoryProgress(section.items);
          const isExpanded = expandedCategories[section.category];

          if (filteredItems.length === 0 && filterPriority !== "all") return null;

          return (
            <div key={section.category} style={{
              marginBottom: 2,
              borderBottom: "1px solid #141416",
            }}>
              {/* Category header */}
              <div
                className="cat-row"
                onClick={() => toggleCategory(section.category)}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "14px 8px", cursor: "pointer",
                  transition: "background 0.1s",
                  borderRadius: 6,
                }}
              >
                <span style={{ fontSize: 16, width: 28, textAlign: "center" }}>{section.icon}</span>
                <span style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 14, fontWeight: 600, color: "#fafafa", flex: 1,
                }}>
                  {section.category}
                </span>
                <span style={{ fontSize: 11, color: "#52525b", marginRight: 8 }}>
                  {done}/{total}
                </span>
                <div style={{
                  width: 48, height: 3, background: "#1a1a1e", borderRadius: 2, overflow: "hidden", marginRight: 8,
                }}>
                  <div style={{
                    height: "100%", width: `${pct}%`, borderRadius: 2,
                    background: pct === 100 ? "#22c55e" : "#0891b2",
                    transition: "width 0.3s",
                  }} />
                </div>
                <span style={{
                  fontSize: 12, color: "#52525b",
                  transform: isExpanded ? "rotate(0deg)" : "rotate(-90deg)",
                  transition: "transform 0.15s",
                }}>▼</span>
              </div>

              {/* Items */}
              {isExpanded && (
                <div style={{ paddingLeft: 16, paddingBottom: 8 }}>
                  {filteredItems.map((item) => {
                    const pri = PRIORITY_CONFIG[item.priority];
                    const isDone = checked[item.id];
                    return (
                      <div
                        key={item.id}
                        className="check-item"
                        onClick={() => toggle(item.id)}
                        style={{
                          display: "flex", alignItems: "flex-start", gap: 12,
                          padding: "10px 8px 10px 28px",
                          cursor: "pointer", borderRadius: 4,
                          transition: "background 0.1s",
                          opacity: isDone ? 0.45 : 1,
                        }}
                      >
                        <div style={{
                          width: 16, height: 16, minWidth: 16, marginTop: 1,
                          border: isDone ? "none" : `1.5px solid #3f3f46`,
                          borderRadius: 3,
                          background: isDone ? "#0891b2" : "transparent",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          transition: "all 0.15s",
                        }}>
                          {isDone && (
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                              <path d="M2 5L4.5 7.5L8 3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </div>
                        <span style={{
                          fontSize: 12.5, lineHeight: 1.5, flex: 1,
                          textDecoration: isDone ? "line-through" : "none",
                          color: isDone ? "#52525b" : "#d4d4d8",
                        }}>
                          {item.text}
                        </span>
                        <span style={{
                          fontSize: 10, fontWeight: 500,
                          padding: "2px 8px", borderRadius: 4,
                          color: pri.color,
                          background: `${pri.color}11`,
                          border: `1px solid ${pri.color}22`,
                          whiteSpace: "nowrap",
                        }}>
                          {pri.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
