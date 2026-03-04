# 🧪 benefits-dashboard-ui-automation-playwright

## 📌 Overview

Automated UI testing framework built to validate the Employees & Benefits Dashboard application.

This project demonstrates end-to-end UI automation using Playwright, validating CRUD workflows, financial calculations, and overall system behavior through deterministic CLI execution.

This automation framework includes:

- Playwright Test  
- Page Object Model (POM) architecture  
- Session reuse via storageState  
- HTML reporting  
- Screenshot & video evidence capture  
- Business rule validation at UI level  
- Full CRUD workflow validation  

---

## 🎯 Objective

Validate employer ability to:

- Add employees  
- Calculate benefit costs correctly  
- Edit employee data  
- Delete employees  
- Maintain UI data consistency  

All tests are designed to be reproducible via CLI execution and suitable for CI/CD pipelines.

---

## 🏗 Architecture & Test Design Principles

The automation suite follows:

- Page Object Model structure  
- Deterministic test execution  
- Dynamic ID capture from UI  
- No hardcoded identifiers  
- Reusable authenticated session  
- Self-cleaning test behavior  
- Evidence-driven reporting  
- Controlled handling of demo environment instability  

---

## 🔁 Execution Flow

The Playwright execution sequence is:

1. Login Setup – Save authenticated session  
2. Create Employee – Validate UI persistence  
3. Edit Employee – Validate update behavior  
4. Delete Employee – Validate row removal  
5. Benefits Calculation Validation – Validate financial logic  

Each test independently validates a complete UI workflow while maintaining system stability.

---

## 💰 Business Rules Assumptions

Financial model validated at UI level:

- Employee Gross Pay = $2000 per paycheck  
- 26 paychecks per year  
- Annual Employee Benefit Cost = $1000  
- Dependent Cost = $500 per dependent  

### Calculation Model

Yearly Benefits = 1000 + (Dependents × 500)  
Benefits per Paycheck = Yearly Benefits ÷ 26  
Net Paycheck = 2000 − Benefits per Paycheck  

Assertions validate:

- Gross value correctness  
- Benefit calculation accuracy  
- Net < Gross validation  
- Non-negative benefit values  
- 2-decimal precision consistency  

---

## 🧪 Test Coverage Scenarios

### ✅ Add Employee

- Modal interaction validation  
- Dynamic ID extraction  
- UI table verification  
- Automatic cleanup  

---

### ✅ Edit Employee

- Form update validation  
- UI persistence confirmation  
- Table refresh verification  
- Cleanup execution  

---

### ✅ Delete Employee

- Delete confirmation modal validation  
- Row removal verification  
- Negative scenario validation  

---

### ✅ Benefits Calculation Validation

- Gross paycheck verification  
- Benefits cost validation  
- Net paycheck validation  
- Financial rule consistency  

---

## ⚠️ Demo Stability Handling

The demo application may occasionally fail to load employee data.

The framework includes protective validation logic:

- Application health check before executing UI actions  
- Automatic test skip when employee table fails to load  
- Screenshot evidence attachment  
- JSON diagnostic logging  
- Clear separation between system defect and automation failure  

---

## 🔍 Technical Validation Strategies

- storageState session reuse  
- Dynamic timestamp-based test data  
- No hardcoded employee IDs  
- UI-based business rule validation  
- HTML report generation  
- Automatic screenshot capture on failure  
- Video retention on failure  
- Trace collection on failure/retry for debugging  

---

## 🛠 Technology Stack

- Playwright Test  
- Node.js  
- Playwright HTML Reporter  

---

## 📁 Project Structure

```text
benefits-dashboard-ui-automation-playwright
│
├── pages
│   └── benefits.page.js
│
├── tests
│   ├── setup
│   │   └── login.setup.spec.js
│   │
│   ├── employee.add.spec.js
│   ├── employee.edit.spec.js
│   ├── employee.delete.spec.js
│   └── employee.calculations.spec.js
│
├── auth
│   └── storageState.json
│
├── playwright.config.js
├── package.json
└── README.md
