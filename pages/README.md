# 📄 Pages Directory

## 📌 Overview

This folder contains the Page Object Model implementation used by the Playwright UI automation framework.

Page objects centralize selectors, reusable actions, and page-specific behavior to keep tests clean and maintainable.

---

## 📁 Contents

### `benefits.page.js`

Main page object for the Benefits Dashboard application.

This file is responsible for encapsulating reusable UI interactions such as:

- Navigating through the employee dashboard
- Filling employee forms
- Submitting employee data
- Editing employee information
- Deleting employee records
- Reading calculated payroll values
- Validating visible dashboard state

---

## 🎯 Purpose

This folder exists to provide:

- Separation of concerns between tests and UI actions
- Reusable page interactions
- Cleaner and more readable test cases
- Easier framework maintenance as the application grows

---

## 🏗 Design Approach

The framework follows the **Page Object Model (POM)** pattern to improve:

- Readability
- Reusability
- Selector maintainability
- Long-term scalability

Tests should focus on validation logic, while page objects handle UI behavior and interactions.

---

## 🏁 Final Note

This directory represents the UI interaction layer of the framework and is a core part of the Playwright automation architecture.
