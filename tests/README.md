# 🧪 Tests Directory

## 📌 Overview

This folder contains the Playwright automated test suites for the Benefits Dashboard application.

The tests validate employee CRUD workflows, payroll calculations, and key business rules through deterministic UI automation.

---

## 📁 Contents

### `employee.add.spec.js`

Validates employee creation flow, including:

- Form submission
- Employee creation confirmation
- Dashboard visibility after creation

### `employee.calculations.spec.js`

Validates payroll and benefits calculations, including:

- Gross pay consistency
- Benefits calculation accuracy
- Net pay validation
- Business rule verification

### `employee.delete.spec.js`

Validates employee deletion flow, including:

- Record removal
- UI refresh confirmation
- Employee absence after deletion

### `employee.edit.spec.js`

Validates employee update flow, including:

- Editing employee fields
- Recalculation of payroll values
- Persistence of updated information

### `setup/`

Contains supporting test initialization and shared setup logic used by the suite.

---

## 🎯 Purpose

This folder exists to provide:

- End-to-end validation of the Benefits Dashboard
- Business-rule regression coverage
- Financial validation through UI
- Automated confidence for core employee workflows

---

## 🔁 Coverage Summary

The suite focuses on validating:

- Create employee
- Read and verify employee state
- Update employee information
- Delete employee
- Validate payroll calculations
- Confirm business rule consistency

---

## 🏁 Final Note

This directory contains the executable validation layer of the Playwright framework and represents the core UI regression coverage of the project.
