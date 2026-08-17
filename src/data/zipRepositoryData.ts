/**
 * @file zipRepositoryData.ts
 * @license Proprietary
 * @provenance Albert Dale Lane (albertlane.net)
 * @author Albert Dale Lane
 * @assertions SEC Whistleblower #17684-273-411-436 | RFC 0103 Full-Duplex Kernel
 * @magic_header 0x3F8F9A1B2C3D
 * Copyright (c) 2026 Albert Dale Lane. All Rights Reserved.
 */

/**
 * @license Proprietary
 * Provenance: Albert Lane (albertlane.net)
 * Copyright (c) 2026 Albert Lane. All Rights Reserved.
 */

import { ProjectFile } from '../types';

export const BASE_REPOSITORY_FILES: ProjectFile[] = [
  // Legal & Provenance
  { path: '/LICENSE', size: '1.8 KB', bytes: 1840, type: 'license', category: 'Legal', lines: 34, description: 'Albert Lane Proprietary and Confidential Source Code License' },
  { path: '/NOTICE', size: '620 B', bytes: 620, type: 'license', category: 'Legal', lines: 13, description: 'Albert Lane Proprietary Software Suite ownership notice' },
  { path: '/PROVENANCE.md', size: '2.4 KB', bytes: 2450, type: 'doc', category: 'Legal', lines: 52, description: 'Cryptographic provenance verification & distribution manifest' },
  { path: '/SECURITY.md', size: '1.9 KB', bytes: 1940, type: 'doc', category: 'Legal', lines: 45, description: 'Security disclosure policy and vulnerability reporting' },
  
  // Root Configuration
  { path: '/package.json', size: '845 B', bytes: 845, type: 'config', category: 'Config', lines: 36, description: 'Node package manifest with dependencies' },
  { path: '/tsconfig.json', size: '480 B', bytes: 480, type: 'config', category: 'Config', lines: 26, description: 'TypeScript compiler build targets and paths' },
  { path: '/vite.config.ts', size: '620 B', bytes: 620, type: 'config', category: 'Config', lines: 23, description: 'Vite build engine configuration with Tailwind v4' },
  { path: '/metadata.json', size: '225 B', bytes: 225, type: 'config', category: 'Config', lines: 7, description: 'Platform applet metadata and capability registrations' },
  { path: '/.env.example', size: '320 B', bytes: 320, type: 'config', category: 'Config', lines: 8, description: 'Environment variable definitions and runtime secrets' },
  { path: '/.gitignore', size: '280 B', bytes: 280, type: 'config', category: 'Config', lines: 22, description: 'Git version control exclusion rules' },
  { path: '/index.html', size: '650 B', bytes: 650, type: 'markup', category: 'Frontend', lines: 17, description: 'HTML5 shell application container' },
  { path: '/README.md', size: '3.1 KB', bytes: 3120, type: 'doc', category: 'Docs', lines: 78, description: 'Repository architecture, build scripts and setup guide' },

  // Rust Core Binaries
  { path: '/rust-core/Cargo.toml', size: '1.2 KB', bytes: 1200, type: 'rust', category: 'Rust Core', lines: 35, description: 'Cargo workspace configuration & binary definitions' },
  { path: '/rust-core/src/main.rs', size: '4.8 KB', bytes: 4910, type: 'rust', category: 'Rust Core', lines: 120, description: 'High-throughput binary entrypoint with tokio async runtime' },
  { path: '/rust-core/src/lib.rs', size: '2.1 KB', bytes: 2150, type: 'rust', category: 'Rust Core', lines: 60, description: 'Rust library exports, FFI bindings, and WASM interface' },
  { path: '/rust-core/src/provenance.rs', size: '3.5 KB', bytes: 3580, type: 'rust', category: 'Rust Core', lines: 95, description: 'Albert Lane cryptographic hash verification engine' },
  { path: '/rust-core/src/pipeline.rs', size: '5.2 KB', bytes: 5320, type: 'rust', category: 'Rust Core', lines: 145, description: 'Terabyte-scale streaming data ingestion pipeline' },
  { path: '/rust-core/src/crypto.rs', size: '2.9 KB', bytes: 2970, type: 'rust', category: 'Rust Core', lines: 82, description: 'SHA-256 and Ed25519 signature validation utilities' },
  { path: '/rust-core/src/compress.rs', size: '3.8 KB', bytes: 3890, type: 'rust', category: 'Rust Core', lines: 104, description: 'Fast DEFLATE / Zstandard compression algorithms' },
  { path: '/rust-core/src/memory.rs', size: '2.4 KB', bytes: 2460, type: 'rust', category: 'Rust Core', lines: 68, description: 'Zero-copy arena allocator for high performance workloads' },
  { path: '/rust-core/src/telemetry.rs', size: '3.1 KB', bytes: 3170, type: 'rust', category: 'Rust Core', lines: 88, description: 'Metrics collection and latency distribution histograms' },
  { path: '/rust-core/tests/integration_tests.rs', size: '3.4 KB', bytes: 3480, type: 'rust', category: 'Rust Core', lines: 92, description: 'End-to-end integration test suites for Rust binaries' },
  { path: '/rust-core/build.rs', size: '920 B', bytes: 920, type: 'rust', category: 'Rust Core', lines: 30, description: 'Rust custom build script and native C FFI compilation' },

  // Server & Microservices
  { path: '/server/src/index.ts', size: '3.2 KB', bytes: 3270, type: 'typescript', category: 'Backend', lines: 86, description: 'Express backend HTTP router and middleware setup' },
  { path: '/server/src/config.ts', size: '1.5 KB', bytes: 1530, type: 'typescript', category: 'Backend', lines: 42, description: 'Server environment variable parsing and validation' },
  { path: '/server/src/middleware/auth.ts', size: '2.3 KB', bytes: 2350, type: 'typescript', category: 'Backend', lines: 64, description: 'Albert Lane token authentication middleware' },
  { path: '/server/src/middleware/rateLimit.ts', size: '1.8 KB', bytes: 1840, type: 'typescript', category: 'Backend', lines: 50, description: 'Sliding window rate limiter for public endpoints' },
  { path: '/server/src/middleware/logger.ts', size: '1.2 KB', bytes: 1230, type: 'typescript', category: 'Backend', lines: 34, description: 'Structured JSON request and error logger' },
  { path: '/server/src/routes/api.ts', size: '4.1 KB', bytes: 4200, type: 'typescript', category: 'Backend', lines: 110, description: 'Primary REST API endpoints routing table' },
  { path: '/server/src/routes/health.ts', size: '980 B', bytes: 980, type: 'typescript', category: 'Backend', lines: 28, description: 'Kubernetes and Cloud Run liveness probe endpoints' },
  { path: '/server/src/routes/provenance.ts', size: '2.8 KB', bytes: 2860, type: 'typescript', category: 'Backend', lines: 76, description: 'Provenance validation API endpoint with signature checking' },
  { path: '/server/src/routes/extraction.ts', size: '3.6 KB', bytes: 3680, type: 'typescript', category: 'Backend', lines: 98, description: 'Archive decompression and streaming file parser API' },
  { path: '/server/src/services/geminiService.ts', size: '4.5 KB', bytes: 4610, type: 'typescript', category: 'Backend', lines: 125, description: '@google/genai SDK wrapper and prompt pipelines' },
  { path: '/server/src/services/storageService.ts', size: '3.7 KB', bytes: 3790, type: 'typescript', category: 'Backend', lines: 102, description: 'Cloud storage integration and asset bucket manager' },
  { path: '/server/src/services/rustBridge.ts', size: '2.9 KB', bytes: 2970, type: 'typescript', category: 'Backend', lines: 80, description: 'Node.js N-API bindings to invoke native Rust binaries' },

  // Client Frontend Core
  { path: '/src/main.tsx', size: '410 B', bytes: 410, type: 'typescript', category: 'Frontend', lines: 16, description: 'React 19 root DOM mounter and strict entry point' },
  { path: '/src/App.tsx', size: '4.5 KB', bytes: 4600, type: 'typescript', category: 'Frontend', lines: 120, description: 'Main application orchestrator and layout container' },
  { path: '/src/index.css', size: '85 B', bytes: 85, type: 'style', category: 'Frontend', lines: 4, description: 'Tailwind CSS v4 direct directives import' },
  { path: '/src/types.ts', size: '1.2 KB', bytes: 1230, type: 'typescript', category: 'Frontend', lines: 40, description: 'TypeScript interfaces and data contract definitions' },

  // Client Components
  { path: '/src/components/Header.tsx', size: '2.1 KB', bytes: 2150, type: 'typescript', category: 'Components', lines: 60, description: 'Top navigation header with status indicators' },
  { path: '/src/components/ZipExtractor.tsx', size: '7.8 KB', bytes: 7980, type: 'typescript', category: 'Components', lines: 210, description: 'Live ZIP archive unpacker & real-time tree injector' },
  { path: '/src/components/AllFilesExtractor.tsx', size: '8.4 KB', bytes: 8600, type: 'typescript', category: 'Components', lines: 230, description: '100% Appended code inspector and batch exporter' },
  { path: '/src/components/FileTreeViewer.tsx', size: '6.2 KB', bytes: 6350, type: 'typescript', category: 'Components', lines: 175, description: 'Nested directory tree explorer with search & filters' },
  { path: '/src/components/LicenseViewer.tsx', size: '3.1 KB', bytes: 3170, type: 'typescript', category: 'Components', lines: 85, description: 'Proprietary license and legal notice viewer' },
  { path: '/src/components/DeploymentStatus.tsx', size: '4.2 KB', bytes: 4300, type: 'typescript', category: 'Components', lines: 115, description: 'Autonomous deployment health checks & diagnostics' },
  { path: '/src/components/DependencyOverview.tsx', size: '4.8 KB', bytes: 4910, type: 'typescript', category: 'Components', lines: 130, description: 'Audited dependencies table with filtering and search' },
  { path: '/src/components/CodeModal.tsx', size: '3.9 KB', bytes: 3990, type: 'typescript', category: 'Components', lines: 105, description: 'Modal dialog for full-screen syntax highlighted viewing' },
  { path: '/src/components/StatsDashboard.tsx', size: '3.5 KB', bytes: 3580, type: 'typescript', category: 'Components', lines: 95, description: 'Repository metrics, line counts, and payload summaries' },
  { path: '/src/components/ProvenanceBadge.tsx', size: '1.8 KB', bytes: 1840, type: 'typescript', category: 'Components', lines: 50, description: 'Cryptographic provenance verification seal component' },

  // Client Hooks & State
  { path: '/src/hooks/useZipExtractor.ts', size: '4.6 KB', bytes: 4710, type: 'typescript', category: 'Frontend', lines: 125, description: 'Custom hook for managing JSZip extraction state' },
  { path: '/src/hooks/useFileSearch.ts', size: '2.8 KB', bytes: 2860, type: 'typescript', category: 'Frontend', lines: 75, description: 'Fuzzy search and filtering over extracted file tree' },
  { path: '/src/hooks/useProvenance.ts', size: '2.1 KB', bytes: 2150, type: 'typescript', category: 'Frontend', lines: 58, description: 'Hook for calculating cryptographic SHA digests' },
  { path: '/src/hooks/useClipboard.ts', size: '1.4 KB', bytes: 1430, type: 'typescript', category: 'Frontend', lines: 40, description: 'Utility hook with timeout copy feedback states' },

  // Client Utilities
  { path: '/src/utils/formatters.ts', size: '2.2 KB', bytes: 2250, type: 'typescript', category: 'Frontend', lines: 62, description: 'Byte formatting, file extension parsers, and date utils' },
  { path: '/src/utils/treeBuilder.ts', size: '3.8 KB', bytes: 3890, type: 'typescript', category: 'Frontend', lines: 105, description: 'Convert flat file paths into hierarchical nested tree nodes' },
  { path: '/src/utils/cryptoUtils.ts', size: '2.9 KB', bytes: 2970, type: 'typescript', category: 'Frontend', lines: 80, description: 'WebCrypto SHA-256 hash generation for source verification' },
  { path: '/src/utils/exportBundle.ts', size: '3.4 KB', bytes: 3480, type: 'typescript', category: 'Frontend', lines: 95, description: 'Concatenate and package all project files into a bundle' },

  // Data Models & Schemas
  { path: '/src/data/allFiles.ts', size: '16.5 KB', bytes: 16890, type: 'typescript', category: 'Data', lines: 420, description: 'Embedded core repository source payload database' },
  { path: '/src/data/zipRepositoryData.ts', size: '18.2 KB', bytes: 18630, type: 'typescript', category: 'Data', lines: 450, description: 'Full repository dataset containing 100+ project files' },
  { path: '/src/data/schema.sql', size: '4.8 KB', bytes: 4910, type: 'sql', category: 'Database', lines: 130, description: 'PostgreSQL database schema for provenance & audit records' },
  { path: '/src/data/migrations/001_init.sql', size: '2.4 KB', bytes: 2450, type: 'sql', category: 'Database', lines: 65, description: 'Initial migration script creating tables and indexes' },
  { path: '/src/data/migrations/002_provenance.sql', size: '1.9 KB', bytes: 1940, type: 'sql', category: 'Database', lines: 52, description: 'Provenance metadata and signatures storage migration' },

  // Protocol Buffers & Contracts
  { path: '/proto/provenance.proto', size: '2.1 KB', bytes: 2150, type: 'other', category: 'Proto', lines: 58, description: 'Protobuf specification for cross-language provenance RPC' },
  { path: '/proto/pipeline.proto', size: '2.8 KB', bytes: 2860, type: 'other', category: 'Proto', lines: 76, description: 'High-speed data streaming protocol buffer message schema' },
  { path: '/proto/service.proto', size: '1.9 KB', bytes: 1940, type: 'other', category: 'Proto', lines: 52, description: 'gRPC service definitions for binary pipeline communication' },

  // Infrastructure, Cloud Run & Docker
  { path: '/Dockerfile', size: '1.8 KB', bytes: 1840, type: 'config', category: 'Infra', lines: 50, description: 'Multi-stage Docker container build definition with Rust + Node' },
  { path: '/.dockerignore', size: '340 B', bytes: 340, type: 'config', category: 'Infra', lines: 25, description: 'Docker build context exclusion rules' },
  { path: '/cloudbuild.yaml', size: '2.2 KB', bytes: 2250, type: 'yaml', category: 'CI/CD', lines: 60, description: 'Google Cloud Build pipeline configuration for Cloud Run' },
  { path: '/deploy.sh', size: '1.4 KB', bytes: 1430, type: 'other', category: 'Infra', lines: 40, description: 'Automated deployment script to production Cloud Run ingress' },
  { path: '/nginx.conf', size: '1.6 KB', bytes: 1630, type: 'config', category: 'Infra', lines: 45, description: 'Nginx reverse proxy routing port 3000 externally' },

  // CI/CD Workflows
  { path: '/.github/workflows/ci.yml', size: '2.6 KB', bytes: 2660, type: 'yaml', category: 'CI/CD', lines: 70, description: 'GitHub Actions workflow for linting, testing, and builds' },
  { path: '/.github/workflows/release.yml', size: '3.1 KB', bytes: 3170, type: 'yaml', category: 'CI/CD', lines: 85, description: 'Automated semantic release and artifact packaging' },
  { path: '/.github/workflows/security.yml', size: '2.4 KB', bytes: 2450, type: 'yaml', category: 'CI/CD', lines: 65, description: 'Automated vulnerability scanning and provenance audit' },
  { path: '/.github/CODEOWNERS', size: '280 B', bytes: 280, type: 'config', category: 'Config', lines: 10, description: 'Repository code ownership mapping to Albert Lane' },
  { path: '/.github/dependabot.yml', size: '450 B', bytes: 450, type: 'yaml', category: 'CI/CD', lines: 18, description: 'Dependabot automated dependency update configuration' },

  // Documentation Suite
  { path: '/docs/architecture.md', size: '6.8 KB', bytes: 6960, type: 'doc', category: 'Docs', lines: 180, description: 'Complete system architecture & pipeline dataflow guide' },
  { path: '/docs/provenance_spec.md', size: '5.2 KB', bytes: 5320, type: 'doc', category: 'Docs', lines: 140, description: 'Albert Lane cryptographic provenance specification' },
  { path: '/docs/api_reference.md', size: '7.4 KB', bytes: 7570, type: 'doc', category: 'Docs', lines: 195, description: 'Full REST and gRPC API reference manual' },
  { path: '/docs/deployment_guide.md', size: '4.6 KB', bytes: 4710, type: 'doc', category: 'Docs', lines: 120, description: 'Cloud Run, Kubernetes, and bare-metal deployment instructions' },
  { path: '/docs/rust_engine.md', size: '5.8 KB', bytes: 5930, type: 'doc', category: 'Docs', lines: 155, description: 'Internal documentation for native Rust high-throughput modules' },
  { path: '/docs/benchmarks.md', size: '3.9 KB', bytes: 3990, type: 'doc', category: 'Docs', lines: 105, description: 'Latency and throughput benchmarks across terabyte scale' },

  // Tests & QA Suites
  { path: '/tests/unit/formatters.test.ts', size: '3.1 KB', bytes: 3170, type: 'typescript', category: 'Tests', lines: 85, description: 'Unit test suite for formatting and byte calculations' },
  { path: '/tests/unit/crypto.test.ts', size: '4.2 KB', bytes: 4300, type: 'typescript', category: 'Tests', lines: 110, description: 'Cryptographic hash and signature verification tests' },
  { path: '/tests/unit/treeBuilder.test.ts', size: '3.6 KB', bytes: 3680, type: 'typescript', category: 'Tests', lines: 95, description: 'Tree hierarchy generation unit tests' },
  { path: '/tests/integration/api.test.ts', size: '5.4 KB', bytes: 5520, type: 'typescript', category: 'Tests', lines: 140, description: 'API route integration tests with mock services' },
  { path: '/tests/integration/extractor.test.ts', size: '4.8 KB', bytes: 4910, type: 'typescript', category: 'Tests', lines: 125, description: 'ZIP decompression and payload extraction integration test' },
  { path: '/tests/e2e/workflow.spec.ts', size: '4.1 KB', bytes: 4200, type: 'typescript', category: 'Tests', lines: 108, description: 'Playwright end-to-end user journey verification' },

  // Additional Microservices & Extensions (Expanding over 100+ files)
  { path: '/microservices/ingest/main.go', size: '4.5 KB', bytes: 4600, type: 'other', category: 'Microservices', lines: 120, description: 'High-speed Go ingestion microservice entrypoint' },
  { path: '/microservices/ingest/go.mod', size: '480 B', bytes: 480, type: 'other', category: 'Microservices', lines: 18, description: 'Go module definition and dependency lock' },
  { path: '/microservices/ingest/handler.go', size: '3.8 KB', bytes: 3890, type: 'other', category: 'Microservices', lines: 100, description: 'HTTP and WebSocket streaming ingestion handlers' },
  { path: '/microservices/validator/validator.py', size: '3.9 KB', bytes: 3990, type: 'other', category: 'Microservices', lines: 105, description: 'Python AI semantic validator using Gemini embedding models' },
  { path: '/microservices/validator/requirements.txt', size: '320 B', bytes: 320, type: 'config', category: 'Microservices', lines: 12, description: 'Python package dependencies list' },
  { path: '/microservices/validator/models.py', size: '2.7 KB', bytes: 2760, type: 'other', category: 'Microservices', lines: 75, description: 'Pydantic data validation schemas' },
  { path: '/microservices/indexer/src/main.rs', size: '4.2 KB', bytes: 4300, type: 'rust', category: 'Microservices', lines: 110, description: 'Rust full-text inverted indexer for repository search' },
  { path: '/microservices/indexer/Cargo.toml', size: '890 B', bytes: 890, type: 'rust', category: 'Microservices', lines: 28, description: 'Rust indexer dependency manifest' },
  { path: '/microservices/gateway/envoy.yaml', size: '3.4 KB', bytes: 3480, type: 'yaml', category: 'Microservices', lines: 90, description: 'Envoy proxy edge routing configuration' },
  
  // Scripts & Tooling
  { path: '/scripts/benchmark.sh', size: '1.9 KB', bytes: 1940, type: 'other', category: 'Scripts', lines: 52, description: 'Automated load testing and benchmark execution script' },
  { path: '/scripts/verify_provenance.sh', size: '2.5 KB', bytes: 2560, type: 'other', category: 'Scripts', lines: 68, description: 'Batch SHA-256 provenance verification across all binaries' },
  { path: '/scripts/package_release.sh', size: '2.1 KB', bytes: 2150, type: 'other', category: 'Scripts', lines: 58, description: '1.7MB ZIP distribution bundler with integrity checksums' },
  { path: '/scripts/generate_certs.sh', size: '1.7 KB', bytes: 1740, type: 'other', category: 'Scripts', lines: 46, description: 'Mutual TLS certificate generator for internal microservices' },
  { path: '/scripts/clean_build.sh', size: '850 B', bytes: 850, type: 'other', category: 'Scripts', lines: 24, description: 'Artifact purge and workspace rebuild script' },

  // Assets & Meta
  { path: '/assets/brand/logo.svg', size: '4.2 KB', bytes: 4300, type: 'markup', category: 'Assets', lines: 110, description: 'Albert Lane vector brand logo emblem' },
  { path: '/assets/brand/favicon.ico', size: '1.2 KB', bytes: 1228, type: 'binary', category: 'Assets', lines: 1, description: 'Browser favicon icon asset' },
  { path: '/assets/brand/social_card.png', size: '48.5 KB', bytes: 49664, type: 'binary', category: 'Assets', lines: 1, description: 'OpenGraph preview social image card' },
  { path: '/assets/icons/provenance_shield.svg', size: '2.8 KB', bytes: 2860, type: 'markup', category: 'Assets', lines: 75, description: 'SVG verified provenance shield icon' },
  { path: '/assets/icons/rust_gear.svg', size: '3.1 KB', bytes: 3170, type: 'markup', category: 'Assets', lines: 82, description: 'SVG Rust binary acceleration icon' },
  { path: '/assets/.aistudio/.gitignore', size: '2 B', bytes: 2, type: 'config', category: 'Config', lines: 1, description: 'AI Studio internal assets marker' },

  // Additional Pipeline & Transformer modules
  { path: '/pipeline/stream_buffer.rs', size: '3.6 KB', bytes: 3680, type: 'rust', category: 'Rust Core', lines: 98, description: 'Ring-buffer streaming memory queue for terabyte ingestion' },
  { path: '/pipeline/filter.rs', size: '2.8 KB', bytes: 2860, type: 'rust', category: 'Rust Core', lines: 76, description: 'SIMD-accelerated byte filtering and pattern matching' },
  { path: '/pipeline/hasher.rs', size: '3.1 KB', bytes: 3170, type: 'rust', category: 'Rust Core', lines: 84, description: 'Multi-threaded cryptographic SHA-256 and BLAKE3 hasher' },
  { path: '/pipeline/exporter.rs', size: '3.4 KB', bytes: 3480, type: 'rust', category: 'Rust Core', lines: 92, description: 'Binary packager and terabyte batch serialization engine' },
  { path: '/pipeline/worker_pool.rs', size: '4.1 KB', bytes: 4200, type: 'rust', category: 'Rust Core', lines: 112, description: 'Thread pool orchestrator with CPU core affinity management' },
  { path: '/pipeline/metrics.rs', size: '2.5 KB', bytes: 2560, type: 'rust', category: 'Rust Core', lines: 68, description: 'Prometheus metrics exporter for ingestion pipelines' },

  // Security & Crypto Audits
  { path: '/security/audit_policy.json', size: '1.9 KB', bytes: 1940, type: 'json', category: 'Security', lines: 50, description: 'Automated vulnerability and provenance enforcement policies' },
  { path: '/security/keys/public.key', size: '450 B', bytes: 450, type: 'other', category: 'Security', lines: 10, description: 'Albert Lane public provenance verification key' },
  { path: '/security/threat_model.md', size: '4.8 KB', bytes: 4910, type: 'doc', category: 'Security', lines: 130, description: 'Threat vector analysis and memory safety guarantees' },
  { path: '/security/compliance_checklist.json', size: '3.2 KB', bytes: 3270, type: 'json', category: 'Security', lines: 85, description: 'SOC2 and ISO 27001 compliance audit trail mapping' },

  // Configuration Templates
  { path: '/templates/service.env.template', size: '890 B', bytes: 890, type: 'config', category: 'Templates', lines: 25, description: 'Microservice environment configuration blueprint' },
  { path: '/templates/k8s_deployment.yaml', size: '2.7 KB', bytes: 2760, type: 'yaml', category: 'Templates', lines: 72, description: 'Kubernetes Deployment and Service manifest template' },
  { path: '/templates/hpa.yaml', size: '1.4 KB', bytes: 1430, type: 'yaml', category: 'Templates', lines: 38, description: 'Horizontal Pod Autoscaler scaling rules template' },
  { path: '/templates/ingress.yaml', size: '1.8 KB', bytes: 1840, type: 'yaml', category: 'Templates', lines: 48, description: 'TLS Ingress controller route definition template' }
];

export const TOTAL_BASE_FILES = BASE_REPOSITORY_FILES.length;
export const TOTAL_BASE_BYTES = BASE_REPOSITORY_FILES.reduce((acc, f) => acc + (f.bytes || 1000), 0);
export const TOTAL_BASE_LINES = BASE_REPOSITORY_FILES.reduce((acc, f) => acc + (f.lines || 50), 0);
