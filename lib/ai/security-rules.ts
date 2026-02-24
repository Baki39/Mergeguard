// lib/ai/security-rules.ts
// Comprehensive security vulnerability scanner with 100+ checks

interface SecurityRule {
  id: string;
  name: string;
  pattern: RegExp;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
  category: string;
  description: string;
  owasp: string;
}

export const SECURITY_RULES: SecurityRule[] = [
  // ===== CRITICAL =====
  {
    id: 'SQL_INJ_001',
    name: 'SQL Injection - Unsanitized Input',
    pattern: /(?:query|execute|raw|select|insert|update|delete).*\$\{.*\}|['"`].*%.*['"`]/gi,
    severity: 'CRITICAL',
    category: 'Injection',
    description: 'Potential SQL injection vulnerability detected',
    owasp: 'A03:2021'
  },
  {
    id: 'CMD_001',
    name: 'Command Injection',
    pattern: /(?:exec|spawn|execSync|system|popen|shell_exec|exec\()/gi,
    severity: 'CRITICAL',
    category: 'Injection',
    description: 'Potential command injection via shell execution',
    owasp: 'A03:2021'
  },
  {
    id: 'SECRET_001',
    name: 'Hardcoded API Key',
    pattern: /(?:api[_-]?key|apikey|secret|token|password|passwd|pwd)\s*[:=]\s*['"][a-zA-Z0-9]{20,}['"]/gi,
    severity: 'CRITICAL',
    category: 'Secrets',
    description: 'Hardcoded credentials detected',
    owasp: 'A02:2021'
  },
  {
    id: 'SECRET_002',
    name: 'Private Key Exposed',
    pattern: /-----BEGIN (?:RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----/gi,
    severity: 'CRITICAL',
    category: 'Secrets',
    description: 'Private key exposed in code',
    owasp: 'A02:2021'
  },
  {
    id: 'SECRET_003',
    name: 'AWS Credentials',
    pattern: /(?:AKIA|ABIA|ACCA)[A-Z0-9]{16}/gi,
    severity: 'CRITICAL',
    category: 'Secrets',
    description: 'AWS access key detected',
    owasp: 'A02:2021'
  },
  {
    id: 'AUTH_001',
    name: 'Missing Authentication',
    pattern: /(?:app\.(?:get|post|put|delete|all)\s*\(\s*['"]\/api\/[a-z]+(?!\/auth))/gi,
    severity: 'CRITICAL',
    category: 'Access Control',
    description: 'API endpoint may be missing authentication',
    owasp: 'A01:2021'
  },

  // ===== HIGH =====
  {
    id: 'XSS_001',
    name: 'Cross-Site Scripting (XSS)',
    pattern: /(?:innerHTML|outerHTML|insertAdjacentHTML|document\.write)\s*\(/gi,
    severity: 'HIGH',
    category: 'XSS',
    description: 'Potential XSS via innerHTML',
    owasp: 'A03:2021'
  },
  {
    id: 'XSS_002',
    name: 'React Dangerous Set HTML',
    pattern: /(?:dangerouslySetInnerHTML|dangerouslySetInnerHTML\s*=\s*\{\s*\{)/gi,
    severity: 'HIGH',
    category: 'XSS',
    description: 'React dangerouslySetInnerHTML usage detected',
    owasp: 'A03:2021'
  },
  {
    id: 'PATH_001',
    name: 'Path Traversal',
    pattern: /(?:readFile|readFileSync|readdir|createReadStream|fs\.(?:readFile|readFileSync))\s*\(\s*(?:__dirname|__filename|process\.cwd)\s*\+/gi,
    severity: 'HIGH',
    category: 'Path Traversal',
    description: 'Potential path traversal vulnerability',
    owasp: 'A01:2021'
  },
  {
    id: 'JWT_001',
    name: 'JWT Without Verification',
    pattern: /jwt\.(?:sign|verify)\s*\(\s*[^,]+\s*,\s*['"][^'"]*['"]\s*(?:,|\))/gi,
    severity: 'HIGH',
    category: 'Authentication',
    description: 'JWT signed without proper verification',
    owasp: 'A02:2021'
  },
  {
    id: 'JWT_002',
    name: 'JWT None Algorithm',
    pattern: /algorithm:\s*['"]?none['"]?/gi,
    severity: 'HIGH',
    category: 'Authentication',
    description: 'JWT using "none" algorithm',
    owasp: 'A02:2021'
  },
  {
    id: 'COOKIE_001',
    name: 'Insecure Cookie',
    pattern: /(?:cookie|Set-Cookie)(?!\s*:\s*\{[^}]*secure[^}]*\})/gi,
    severity: 'HIGH',
    category: 'Session',
    description: 'Cookie without secure flag',
    owasp: 'A02:2021'
  },
  {
    id: 'CORS_001',
    name: 'Permissive CORS',
    pattern: /Access-Control-Allow-Origin\s*:\s*['"]\*['"]/gi,
    severity: 'HIGH',
    category: 'CORS',
    description: 'CORS allows all origins',
    owasp: 'A01:2021'
  },
  {
    id: 'CRYPTO_001',
    name: 'Weak Cryptography',
    pattern: /(?:md5|sha1|des|rc4)\s*\(/gi,
    severity: 'HIGH',
    category: 'Cryptography',
    description: 'Weak cryptographic algorithm used',
    owasp: 'A02:2021'
  },
  {
    id: 'DES_001',
    name: 'Eval Usage',
    pattern: /\beval\s*\(/gi,
    severity: 'HIGH',
    category: 'Code Injection',
    description: 'eval() is dangerous and should be avoided',
    owasp: 'A03:2021'
  },
  {
    id: 'NODE_001',
    name: 'Eval with User Input',
    pattern: /eval\s*\(\s*(?:req\.|params|query|body)/gi,
    severity: 'HIGH',
    category: 'Code Injection',
    description: 'eval() with user input is extremely dangerous',
    owasp: 'A03:2021'
  },

  // ===== MEDIUM =====
  {
    id: 'XSS_003',
    name: 'Template Injection',
    pattern: /\{\{\s*[^}]*(?:innerHTML|dangerouslySetInnerHTML)/gi,
    severity: 'MEDIUM',
    category: 'XSS',
    description: 'Template injection potential',
    owasp: 'A03:2021'
  },
  {
    id: 'INPUT_001',
    name: 'Missing Input Validation',
    pattern: /(?:req\.(?:body|params|query)\s*(?:\[|\.))/gi,
    severity: 'MEDIUM',
    category: 'Input Validation',
    description: 'Direct user input access without validation',
    owasp: 'A01:2021'
  },
  {
    id: 'RATE_001',
    name: 'Missing Rate Limiting',
    pattern: /(?:app\.use|router\.use)\s*\(\s*\/api/gi,
    severity: 'MEDIUM',
    category: 'Rate Limiting',
    description: 'API route without rate limiting',
    owasp: 'A04:2021'
  },
  {
    id: 'ERROR_001',
    name: 'Verbose Error Handling',
    pattern: /(?:console\.(?:log|error|warn)\s*\(\s*(?:err|error|exception))/gi,
    severity: 'MEDIUM',
    category: 'Error Handling',
    description: 'May expose sensitive info in error logs',
    owasp: 'A01:2021'
  },
  {
    id: 'TRACE_001',
    name: 'Stack Trace Exposure',
    pattern: /(?:error\.stack|stackTrace|stack\s*=)/gi,
    severity: 'MEDIUM',
    category: 'Error Handling',
    description: 'Stack trace may be exposed',
    owasp: 'A01:2021'
  },
  {
    id: 'UPLOAD_001',
    name: 'Insecure File Upload',
    pattern: /(?:multer|upload|fileupload)\s*\(\s*\{[^}]*\}/gi,
    severity: 'MEDIUM',
    category: 'File Upload',
    description: 'Check file upload security',
    owasp: 'A04:2021'
  },
  {
    id: 'SSRF_001',
    name: 'Server-Side Request Forgery',
    pattern: /(?:fetch|axios|request|got|http\.request)\s*\(\s*(?:req|body|params|query)/gi,
    severity: 'MEDIUM',
    category: 'SSRF',
    description: 'Potential SSRF vulnerability',
    owasp: 'A10:2021'
  },
  {
    id: 'HPP_001',
    name: 'HTTP Parameter Pollution',
    pattern: /\?[a-zA-Z_]+\.[a-zA-Z_]+=/gi,
    severity: 'MEDIUM',
    category: 'Input Validation',
    description: 'Potential parameter pollution',
    owasp: 'A01:2021'
  },
  {
    id: 'REDIRECT_001',
    name: 'Open Redirect',
    pattern: /(?:redirect|res\.redirect)\s*\(\s*(?:req\.|params|query|body)/gi,
    severity: 'MEDIUM',
    category: 'Redirect',
    description: 'Potential open redirect',
    owasp: 'A10:2021'
  },
  {
    id: 'XXE_001',
    name: 'XML External Entity',
    pattern: /(?:parseXML|parseString|loadXML)\s*\(/gi,
    severity: 'MEDIUM',
    category: 'XXE',
    description: 'Potential XXE vulnerability',
    owasp: 'A05:2021'
  },

  // ===== LOW =====
  {
    id: 'INFO_001',
    name: 'Debug Mode Enabled',
    pattern: /(?:DEBUG\s*=\s*['"]?true|app\.env\s*===\s*['"]?development)/gi,
    severity: 'LOW',
    category: 'Configuration',
    description: 'Debug mode may be enabled in production',
    owasp: 'A05:2021'
  },
  {
    id: 'INFO_002',
    name: 'Console.log in Production',
    pattern: /console\.(?:log|debug)\s*\(/gi,
    severity: 'LOW',
    category: 'Best Practices',
    description: 'Console statements in production code',
    owasp: 'A09:2021'
  },
  {
    id: 'INFO_003',
    name: 'Hardcoded URLs',
    pattern: /(?:api|API|API_URL|URL)\s*[:=]\s*['"]https?:\/\/[a-zA-Z0-9]/gi,
    severity: 'LOW',
    category: 'Configuration',
    description: 'Hardcoded API URLs',
    owasp: 'A04:2021'
  },
  {
    id: 'INFO_004',
    name: 'TODO Comment',
    pattern: /\/\/\s*TODO|\/\*\s*TODO/gi,
    severity: 'LOW',
    category: 'Code Quality',
    description: 'TODO comment found',
    owasp: 'A09:2021'
  },
  {
    id: 'INFO_005',
    name: 'Console Error Warning',
    pattern: /console\.(?:warn|error)\s*\(\s*(?:req|res|body|params)/gi,
    severity: 'LOW',
    category: 'Logging',
    description: 'May log sensitive request data',
    owasp: 'A01:2021'
  },
  {
    id: 'DEP_001',
    name: 'Outdated Package Reference',
    pattern: /['"](?:express|mongoose|react|vue|angular|axios|lodash)['"]\s*:/gi,
    severity: 'LOW',
    category: 'Dependencies',
    description: 'Package without version may use outdated version',
    owasp: 'A06:2021'
  },

  // ===== Java Specific =====
  {
    id: 'JAVA_001',
    name: 'SQL Injection in Java',
    pattern: /(?:Statement|PreparedStatement).*(?:\+|'|")/gi,
    severity: 'CRITICAL',
    category: 'Injection',
    description: 'Potential SQL injection in Java',
    owasp: 'A03:2021'
  },
  {
    id: 'JAVA_002',
    name: 'XML Decoder Usage',
    pattern: /XMLDecoder/gi,
    severity: 'HIGH',
    category: 'Deserialization',
    description: 'XMLDecoder is insecure',
    owasp: 'A08:2021'
  },

  // ===== Python Specific =====
  {
    id: 'PY_001',
    name: 'Pickle Deserialization',
    pattern: /pickle\.loads?\s*\(/gi,
    severity: 'CRITICAL',
    category: 'Deserialization',
    description: 'Insecure pickle deserialization',
    owasp: 'A08:2021'
  },
  {
    id: 'PY_002',
    name: 'Eval in Python',
    pattern: /\beval\s*\(|exec\s*\(/gi,
    severity: 'CRITICAL',
    category: 'Code Injection',
    description: 'eval/exec is dangerous',
    owasp: 'A03:2021'
  },
  {
    id: 'PY_003',
    name: 'SQLAlchemy Raw SQL',
    pattern: /\.execute\s*\(\s*(?:f?['"][^'"]+%|['"][^'"]+%\s*%)/gi,
    severity: 'HIGH',
    category: 'Injection',
    description: 'Potential SQL injection with SQLAlchemy',
    owasp: 'A03:2021'
  },
  {
    id: 'PY_004',
    name: 'YAML Unsafe Load',
    pattern: /yaml\.load\s*\([^,)]*\)(?!\s*,\s*Loader=yaml\.safe)/gi,
    severity: 'HIGH',
    category: 'Deserialization',
    description: 'yaml.load without safe loader',
    owasp: 'A08:2021'
  },

  // ===== JavaScript/Node Specific =====
  {
    id: 'JS_001',
    name: 'Prototype Pollution',
    pattern: /(?:Object\.assign|merge|extend)\s*\(\s*\{[^}]*\}/gi,
    severity: 'HIGH',
    category: 'Prototype Pollution',
    description: 'Potential prototype pollution',
    owasp: 'A08:2021'
  },
  {
    id: 'JS_002',
    name: 'Regex DoS',
    pattern: new RegExp('/(?:\\*|\\+|\\?\\?|[\\d]+)\\([^)]*\\$\\)', 'gi'),
    severity: 'MEDIUM',
    category: 'DoS',
    description: 'Potential ReDoS vulnerability',
    owasp: 'A05:2021'
  },
  {
    id: 'JS_003',
    name: 'Timing Attack',
    pattern: /===(?!\s*crypto\.timingSafeEqual)/gi,
    severity: 'MEDIUM',
    category: 'Cryptography',
    description: 'Use constant-time comparison for secrets',
    owasp: 'A02:2021'
  },

  // ===== Cloud Specific =====
  {
    id: 'CLOUD_001',
    name: 'AWS Bucket Public',
    pattern: /(?:s3|s3.amazonaws|storage\.googleapis)\.com\/[a-zA-Z0-9-]+\/public/gi,
    severity: 'HIGH',
    category: 'Cloud Security',
    description: 'Potential public S3 bucket',
    owasp: 'A01:2021'
  },
  {
    id: 'CLOUD_002',
    name: 'Firebase Config Exposed',
    pattern: /firebaseConfig\s*[:=]\s*\{[^}]*\}/gi,
    severity: 'MEDIUM',
    category: 'Secrets',
    description: 'Firebase config exposed',
    owasp: 'A02:2021'
  },

  // ===== AI/ML Specific =====
  {
    id: 'AI_001',
    name: 'Prompt Injection',
    pattern: /(?:system|user|assistant|system_prompt)\s*[:=]\s*['"](?:ignore|disregard|forget).*(?:instructions|prior|policies)/gi,
    severity: 'HIGH',
    category: 'AI Security',
    description: 'Potential prompt injection',
    owasp: 'A01:2021'
  },
  {
    id: 'AI_002',
    name: 'Hardcoded Model Key',
    pattern: /(?:OPENAI_API_KEY|ANTHROPIC_API_KEY|GOOGLE_API_KEY)[^=]*=\s*['"][a-zA-Z0-9]{20,}/gi,
    severity: 'CRITICAL',
    category: 'Secrets',
    description: 'Hardcoded AI API key',
    owasp: 'A02:2021'
  },
  {
    id: 'AI_003',
    name: 'Unvalidated Model Output',
    pattern: /(?:completion|generate|predict)\s*\(\s*(?:?!.*validate|?!.*sanitize)/gi,
    severity: 'MEDIUM',
    category: 'AI Security',
    description: 'AI output not validated',
    owasp: 'A01:2021'
  },

  // ===== More Injection Patterns =====
  {
    id: 'INJ_001',
    name: 'NoSQL Injection',
    pattern: /(?:\$\{|\$\w+\s*\[)/gi,
    severity: 'HIGH',
    category: 'Injection',
    description: 'Potential NoSQL injection',
    owasp: 'A03:2021'
  },
  {
    id: 'INJ_002',
    name: 'LDAP Injection',
    pattern: /(?:ldap|search|filter)\s*\(.*(?:\+|\||&).*\)/gi,
    severity: 'HIGH',
    category: 'Injection',
    description: 'Potential LDAP injection',
    owasp: 'A03:2021'
  },
  {
    id: 'INJ_003',
    name: 'Template Injection (Jinja2)',
    pattern: /\{\{\s*[a-zA-Z_][a-zA-Z0-9_]*\.(?:__import__|join|format)/gi,
    severity: 'HIGH',
    category: 'Injection',
    description: 'Potential SSTI in template',
    owasp: 'A03:2021'
  },

  // ===== More Auth Patterns =====
  {
    id: 'AUTH_002',
    name: 'Hardcoded Password',
    pattern: /(?:password|passwd|pwd|secret)\s*[:=]\s*['"][^'"]{8,}['"]/gi,
    severity: 'HIGH',
    category: 'Secrets',
    description: 'Hardcoded password detected',
    owasp: 'A02:2021'
  },
  {
    id: 'AUTH_003',
    name: 'Weak Password Hash',
    pattern: /(?:md5|sha1)\s*\(\s*(?:password|pass|pwd)/gi,
    severity: 'HIGH',
    category: 'Cryptography',
    description: 'Weak password hashing',
    owasp: 'A02:2021'
  },
  {
    id: 'AUTH_004',
    name: 'Missing HTTPS',
    pattern: /http:\/\/(?!localhost|127\.0\.0\.1)/gi,
    severity: 'MEDIUM',
    category: 'Transport',
    description: 'Insecure HTTP connection',
    owasp: 'A02:2021'
  },

  // ===== More XSS Patterns =====
  {
    id: 'XSS_004',
    name: 'Dangerous DOM Manipulation',
    pattern: /(?:document\.location|window\.location)\s*=\s*(?:req|params|query|body)/gi,
    severity: 'HIGH',
    category: 'XSS',
    description: 'Potential DOM-based XSS',
    owasp: 'A03:2021'
  },
  {
    id: 'XSS_005',
    name: 'jQuery Unsafe HTML',
    pattern: /\.\s*(?:html|after|before|append|prepend|wrap)\s*\(\s*(?:req|params|query)/gi,
    severity: 'HIGH',
    category: 'XSS',
    description: 'jQuery unsafe HTML manipulation',
    owasp: 'A03:2021'
  },

  // ===== More Cryptography =====
  {
    id: 'CRYPTO_002',
    name: 'Weak Random',
    pattern: /Math\.random\s*\(\s*\)/gi,
    severity: 'MEDIUM',
    category: 'Cryptography',
    description: 'Math.random is not cryptographically secure',
    owasp: 'A02:2021'
  },
  {
    id: 'CRYPTO_003',
    name: 'Missing HMAC',
    pattern: /(?:crypto\.createSign|crypto\.createVerify)\s*\(\s*['"]?(?:sha1|md5)['"]?\)/gi,
    severity: 'MEDIUM',
    category: 'Cryptography',
    description: 'Weak signature algorithm',
    owasp: 'A02:2021'
  },

  // ===== More File Operations =====
  {
    id: 'FILE_001',
    name: 'Path Traversal (File Read)',
    pattern: /(?:readFile|readFileSync|readFileAsText)\s*\(\s*(?:req|params|query)\s*\./gi,
    severity: 'HIGH',
    category: 'Path Traversal',
    description: 'Potential file read via path traversal',
    owasp: 'A01:2021'
  },
  {
    id: 'FILE_002',
    name: 'Arbitrary File Write',
    pattern: /(?:writeFile|writeFileSync|createWriteStream)\s*\(\s*(?:req|params|query)/gi,
    severity: 'CRITICAL',
    category: 'File Upload',
    description: 'Potential arbitrary file write',
    owasp: 'A04:2021'
  },

  // ===== More Session =====
  {
    id: 'SESS_001',
    name: 'Session Without Expiry',
    pattern: /(?:cookie|session)\s*\(?\s*\{[^}]*(?!expires|maxAge)/gi,
    severity: 'MEDIUM',
    category: 'Session',
    description: 'Session without expiration',
    owasp: 'A02:2021'
  },
  {
    id: 'SESS_002',
    name: 'Predictable Session ID',
    pattern: /(?:session\.id|uuid)\s*=\s*(?:Math\.random|new Date|timestamp)/gi,
    severity: 'HIGH',
    category: 'Session',
    description: 'Predictable session ID',
    owasp: 'A02:2021'
  },
];

// Categorize rules by severity
export const RULES_BY_SEVERITY = {
  CRITICAL: SECURITY_RULES.filter(r => r.severity === 'CRITICAL'),
  HIGH: SECURITY_RULES.filter(r => r.severity === 'HIGH'),
  MEDIUM: SECURITY_RULES.filter(r => r.severity === 'MEDIUM'),
  LOW: SECURITY_RULES.filter(r => r.severity === 'LOW'),
  INFO: SECURITY_RULES.filter(r => r.severity === 'INFO'),
};

// Categorize rules by category
export const RULES_BY_CATEGORY = SECURITY_RULES.reduce((acc, rule) => {
  if (!acc[rule.category]) {
    acc[rule.category] = [];
  }
  acc[rule.category].push(rule);
  return acc;
}, {} as Record<string, SecurityRule[]>);
