const { test, expect } = require('@playwright/test');
const { BenefitsPage } = require('../pages/benefits.page');

test.describe('Employees - Add', () => {
  test('Add Employee @smoke @ui @employees - create and cleanup', async ({ page }, testInfo) => {
    // =====================================================
    // Test description (shows in HTML report)
    // =====================================================
    testInfo.annotations.push({
      type: 'description',
      description: 'Creates an employee via the UI, validates it appears in the table, then deletes it (cleanup).',
    });

    const benefits = new BenefitsPage(page);

    // =====================================================
    // Actions: Navigate
    // =====================================================
    await test.step('Navigate to Benefits Dashboard', async () => {
      await benefits.goto();
    });

    // =====================================================
    // App health check (known instability)
    // =====================================================
    await benefits.ensureAppIsUsableOrSkip(testInfo);

    // =====================================================
    // Test data
    // =====================================================
    // We use a fixed number of dependants so validations are predictable.
    const dependants = 1;

    // =====================================================
    // Test data
    // =====================================================
    // We generate a unique suffix to avoid collisions in shared environments.
    const stamp = Date.now().toString().slice(-6);

    // =====================================================
    // Test data
    // =====================================================
    // Employee data used for create + validation + cleanup.
    const employee = {
      firstName: `QA${stamp}`,
      lastName: `User${stamp}`,
      dependants,
    };

    let id;

    // =====================================================
    // Actions: Create employee
    // =====================================================
    await test.step('Create employee', async () => {
      id = await benefits.createEmployee(employee);

      await testInfo.attach('created-employee', {
        body: JSON.stringify({ id, ...employee }, null, 2),
        contentType: 'application/json',
      });
    });

    // =====================================================
    // Validation: Verify employee row exists
    // =====================================================
    await test.step('Validate employee exists in table', async () => {
      const row = await benefits.waitForRowById(id, 30000);

      await expect(row).toContainText(employee.firstName);
      await expect(row).toContainText(employee.lastName);
      await expect(row.locator('td').nth(3)).toHaveText(String(employee.dependants));
    });

    // =====================================================
    // Cleanup
    // =====================================================
    await test.step('Cleanup: delete created employee', async () => {
      await benefits.deleteEmployeeById(id, {
        firstName: employee.firstName,
        lastName: employee.lastName,
      });
    });

    // =====================================================
    // Final sanity check
    // =====================================================
    await test.step('Final check: employee removed from table', async () => {
      await expect(page.locator('#employeesTable')).not.toContainText(employee.firstName);
    });
  });
});