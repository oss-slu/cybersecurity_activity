# Shift Left - Software Supply Chain Security Activity

## Activity Description

Good security identifies vulnerabilities early, before they can be exploited. This hands-on activity examines real-world dependency chains and implements security updates in an active open source codebase.

Students will work with the p5.js ecosystem to understand how modern software relies on hundreds of dependencies, creating potential attack vectors through the supply chain. They'll use security scanning tools, analyze vulnerability reports, and implement fixes in a controlled environment that mirrors real-world development practices.

## Technical Overview

### Core Concepts

- **Supply Chain Security**: Understanding how dependencies introduce risk
- **Dependency Management**: Package.json, npm ecosystem, semantic versioning
- **Vulnerability Scanning**: Automated tools for identifying known issues
- **Security Patch Management**: Updating dependencies safely
- **"Shift Left" Philosophy**: Moving security testing earlier in development

### Tools & Technologies

- **GitHub Repository**: Fork of p5.js or related project
- **npm audit**: Built-in vulnerability scanner
- **Snyk or similar**: Advanced security scanning
- **package.json**: Dependency manifest analysis
- **GitHub Security Advisories**: Vulnerability database
- **Dependabot**: Automated dependency updates

### Learning Objectives

- Map software dependency trees and identify potential risks
- Use command-line security tools to scan for vulnerabilities
- Interpret security reports and prioritize fixes
- Implement dependency updates while maintaining compatibility
- Understand the broader implications of supply chain attacks

## 15-Minute Breakdown

### 0-15 minutes: The Supply Chain Problem

**Real-world supply chain attack demo** (5 min): Show impact of compromised dependencies

- Present the 2021 colors.js and faker.js sabotage incident
- Demonstrate how one malicious update affected thousands of projects
- Show the p5.js dependency tree: `npm ls --depth=2`
- Count total dependencies (likely 200+ including sub-dependencies)

**Interactive dependency exploration** (5 min): Students explore their project's dependencies

- Clone a prepared p5.js example project
- Run `npm install` and observe the node_modules folder size
- Use `npm list` to visualize the dependency tree
- Identify packages they've never heard of but are now trusting

**Vulnerability scanning introduction** (5 min): Show how security issues hide in dependencies

- Run `npm audit` on the project
- Explain severity levels (low, moderate, high, critical)
- Show a sample vulnerability report
- Discuss how old dependencies accumulate security debt

### 15-30 minutes: Scanning and Analysis

**Hands-on vulnerability scanning** (8 min): Students run security tools

- Execute `npm audit` and analyze results
- Install and run `npm audit fix` to see automated fixes
- Try advanced tools: `npx better-npm-audit` for detailed reporting
- Document findings in a security assessment template

**Dependency deep dive** (7 min): Trace specific vulnerabilities through the chain

- Pick one high-severity vulnerability from results
- Use `npm why <package-name>` to trace how it entered the project
- Check the CVE database entry for technical details
- Understand the attack vector and potential impact

### 30-45 minutes: Implementing Fixes

**Safe dependency updates** (8 min): Students update vulnerable packages

- Review semantic versioning (major.minor.patch)
- Update patch versions: `npm update`
- Carefully update minor versions for security fixes
- Test that the application still works after updates

**Testing and validation** (7 min): Ensure fixes don't break functionality

- Run the p5.js sketch to verify it still works
- Check for any new console errors or warnings
- Re-run security scan to confirm vulnerabilities are resolved
- Document the changes made

### 45-60 minutes: Advanced Security Measures

**Dependency policy creation** (5 min): Establish ongoing security practices

- Set up automated security scanning with GitHub Dependabot
- Configure package.json scripts for regular security checks
- Create a "security policy" document for the project
- Discuss update schedules and testing procedures

**Supply chain hardening** (8 min): Additional protection mechanisms

- Explore package-lock.json for dependency pinning
- Discuss npm package signatures and integrity checking
- Review GitHub's dependency graph and security alerts
- Consider tools like npm shrinkwrap for production deployments

**Wrap-up and reflection** (2 min): Connect to broader security practices

- Discuss how this applies to professional development workflows
- Preview how security scanning integrates into CI/CD pipelines
- Connect to the "shift left" philosophy of early security testing

## Technical Implementation Details

### Prepared Environment Setup

**Base Repository Structure:**

```
ShiftLeft/
├── package.json (with intentionally outdated dependencies)
├── package-lock.json
├── sketch.js (simple p5.js animation)
├── index.html
├── security-assessment.md (template)
└── README.md (activity instructions)
```

**Pre-configured Vulnerabilities:**

- Include dependencies with known CVEs from 2023-2024
- Mix of direct and transitive dependency vulnerabilities
- Range of severity levels for realistic assessment practice
- Ensure fixes are available and non-breaking

### Command Reference Sheet

**Basic Security Commands:**

```bash
# Basic vulnerability scan
npm audit

# Automated fix attempt
npm audit fix

# Force fix major version updates (advanced)
npm audit fix --force

# Show dependency tree
npm list

# Find why a package is installed
npm why <package-name>

# Update to latest patch versions
npm update

# Check for outdated packages
npm outdated
```

**Advanced Security Tools:**

```bash
# Enhanced audit reporting
npx better-npm-audit

# Snyk security scanning
npx snyk test

# License compliance checking
npx license-checker

# Package vulnerability details
npx audit-ci --report-type json
```

### Assessment Rubric

**Vulnerability Identification (25%)**

- Successfully runs security scans
- Correctly interprets severity levels
- Identifies direct vs. transitive dependencies

**Risk Assessment (25%)**

- Understands potential impact of vulnerabilities
- Prioritizes fixes appropriately
- Traces dependency chains effectively

**Implementation (25%)**

- Updates dependencies safely
- Maintains application functionality
- Documents changes properly

**Security Practices (25%)**

- Implements ongoing monitoring
- Understands automated security workflows
- Connects to broader security principles

## Real-World Connections

### Industry Examples

- **SolarWinds (2020)**: Supply chain compromise affecting 18,000+ organizations
- **Codecov (2021)**: Bash uploader script compromise
- **colors.js/faker.js (2022)**: Maintainer sabotage affecting thousands of projects
- **PyTorch (2022)**: Malicious dependency in nightly builds

### Professional Workflows

- **CI/CD Integration**: Security scanning in build pipelines
- **DevSecOps**: Security as code and automated compliance
- **Vendor Risk Management**: Third-party security assessments
- **Incident Response**: Supply chain compromise detection and response

## Materials Needed

- **Computers** with Node.js and npm installed
- **GitHub accounts** for repository access
- **Internet connection** for package registry access
- **Terminal/command line** access
- **Text editor** for viewing/editing files
- **Prepared repository** with vulnerable dependencies

## Extension Activities

### Beginner Extensions

- Create visual dependency graphs using npm-graph tools
- Write automated scripts to check for updates
- Set up GitHub security alerts for personal projects

### Advanced Extensions

- Implement Software Bill of Materials (SBOM) generation
- Create custom security policies with npm audit configurations
- Build a dashboard showing security metrics across multiple projects
- Investigate container scanning for Docker-based projects

### Research Projects

- Compare security postures across different package ecosystems (npm vs pip vs Maven)
- Analyze the economics of open source security maintenance
- Study the effectiveness of automated dependency update tools