# Conftest Action

<img width="1983" height="793" alt="image" src="https://github.com/user-attachments/assets/35397f75-0710-4a4e-82ea-40cd6cf5067e" />


<p align="center">

<img src="https://img.shields.io/github/license/YOUR_ORG/conftest-action?style=for-the-badge" />
<img src="https://img.shields.io/github/actions/workflow/status/YOUR_ORG/conftest-action/release.yml?style=for-the-badge" />
<img src="https://img.shields.io/github/v/release/YOUR_ORG/conftest-action?style=for-the-badge" />
<img src="https://img.shields.io/badge/OPA-Rego-blue?style=for-the-badge" />
<img src="https://img.shields.io/badge/SARIF-GitHub%20Security-red?style=for-the-badge" />

</p>

---

# 🚀 Overview

Advanced Conftest GitHub Action is a powerful Policy-as-Code scanner for Infrastructure-as-Code repositories.

It brings together:

- ✅ Conftest
- ✅ OPA/Rego
- ✅ GitHub Security Code Scanning
- ✅ SARIF Upload
- ✅ Terraform Plan Scanning
- ✅ Kubernetes YAML Validation
- ✅ Helm Template Evaluation
- ✅ Dockerfile Security Policies

Tiny Rego rules become giant laser fences around your cloud ☁️⚡

---

# ✨ Features

| Feature | Supported |
|---|---|
| Terraform Plan JSON | ✅ |
| Kubernetes YAML | ✅ |
| Helm Templates | ✅ |
| Dockerfiles | ✅ |
| SARIF Upload | ✅ |
| GitHub Security Tab | ✅ |
| PR Inline Annotations | ✅ |
| Multi-format IaC Scanning | ✅ |
| GitHub Marketplace Ready | ✅ |
| Node20 Runtime | ✅ |

---

# 🧠 Supported Scan Types

| Scan Type | Description |
|---|---|
| `terraform` | Terraform Plan JSON scanning |
| `kubernetes` | Kubernetes manifest validation |
| `helm` | Helm rendered template scanning |
| `dockerfile` | Dockerfile best practice validation |

---

# 📦 Installation

## GitHub Marketplace

```yaml
uses: your-org/conftest-action@v1
```

---

# ⚡ Quick Start

## Terraform Example

```yaml
name: Terraform Security Scan

on:
  pull_request:
  push:

permissions:
  security-events: write
  contents: read

jobs:
  conftest:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: hashicorp/setup-terraform@v3

      - name: Run Conftest
        uses: anantacloud-actions/conftest-action@v1
        with:
          scan-type: terraform
          files: terraform/
          policy-path: policy/

      - name: Upload SARIF
        uses: github/codeql-action/upload-sarif@v3
        with:
          sarif_file: conftest-results.sarif
```

---

# ☸️ Kubernetes Example

```yaml
name: Kubernetes Policy Scan

on:
  pull_request:

jobs:
  scan:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Scan Kubernetes YAML
        uses: anantacloud-actions/conftest-action@v1
        with:
          scan-type: kubernetes
          files: manifests/
          policy-path: policy/
```

---

# ⛵ Helm Example

```yaml
name: Helm Policy Scan

on:
  pull_request:

jobs:
  scan:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: azure/setup-helm@v4

      - name: Scan Helm Chart
        uses: anantacloud-actions/conftest-action@v1
        with:
          scan-type: helm
          files: charts/mychart
          policy-path: policy/
```

---

# 🐳 Dockerfile Example

```yaml
name: Dockerfile Security Scan

on:
  pull_request:

jobs:
  scan:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Scan Dockerfile
        uses: anantacloud-actions/conftest-action@v1
        with:
          scan-type: dockerfile
          files: Dockerfile
          policy-path: policy/
```

---

# ⚙️ Inputs

| Input | Required | Default | Description |
|---|---|---|---|
| `scan-type` | ✅ | - | terraform/kubernetes/helm/dockerfile |
| `files` | ✅ | - | Files or directories to scan |
| `policy-path` | ❌ | `policy` | Path to Rego policies |
| `conftest-version` | ❌ | `0.58.0` | Conftest version |
| `upload-sarif` | ❌ | `true` | Generate SARIF report |

---

# 📂 Repository Structure

```txt
.
├── action.yml
├── package.json
├── index.js
├── dist/
├── lib/
│   ├── scanner.js
│   ├── sarif.js
│   ├── terraform.js
│   ├── helm.js
│   └── installer.js
├── policy/
└── README.md
```

---

# 🛡️ Example Policies

## Kubernetes Non-Root Policy

```rego
package main

deny[msg] {

  input.kind == "Deployment"

  not input.spec.template.spec.securityContext.runAsNonRoot

  msg := "Containers must run as non-root"
}
```

---

## Dockerfile Latest Tag Policy

```rego
package main

deny[msg] {

  input[i].Cmd == "from"

  contains(lower(input[i].Value[0]), "latest")

  msg := "Avoid latest image tags"
}
```

---

## Terraform Public S3 Policy

```rego
package main

deny[msg] {

  input.resource_changes[_].type == "aws_s3_bucket"

  input.resource_changes[_].change.after.acl == "public-read"

  msg := "Public S3 buckets are forbidden"
}
```

---

# 🔥 SARIF + GitHub Security

This action generates:

- ✅ SARIF Reports
- ✅ Inline Pull Request Annotations
- ✅ GitHub Security Alerts
- ✅ Centralized Code Scanning Findings

After upload, findings appear in:

```txt
GitHub Repository
└── Security
    └── Code Scanning Alerts
```

Your infrastructure policies become visible security signals across the entire engineering organization ⚡

---

# 🧪 Local Development

## Install Dependencies

```bash
npm install
```

---

## Build Dist Folder

```bash
npm run build
```

---

## Run Locally

```bash
node index.js
```

---

# 📦 Build Using NCC

This project uses:

- `@vercel/ncc`
- GitHub Actions Node20 runtime

Generate production bundle:

```bash
npm run build
```

Generated output:

```txt
dist/
└── index.js
```

---

# 🧬 Future Roadmap

| Feature | Status |
|---|---|
| Severity Mapping | 🚧 |
| OPA Bundle Support | 🚧 |
| OCI Policy Registry | 🚧 |
| AI Policy Recommendations | 🚧 |
| Drift Detection | 🚧 |
| Slack / Teams Notifications | 🚧 |
| Parallel Scanning | 🚧 |
| Trivy Integration | 🚧 |
| Kyverno Compatibility | 🚧 |

---

# 🤝 Contributing

PRs are welcome.

Ideas, policies, integrations, and cloud defense wizardry are always appreciated 🧙‍♂️☁️

---

# 📜 License

MIT License

---

# ⭐ Support

If this project helped secure your cloud infrastructure:

- ⭐ Star the repository
- 🍴 Fork it
- 🛡️ Share it with your platform engineering team

---

# 💥 Philosophy

Infrastructure should fail policy validation before it fails production.

Shift security left.
Automate guardrails.
Secure everything.

