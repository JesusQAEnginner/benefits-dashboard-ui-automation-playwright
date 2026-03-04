const { test, expect } = require('@playwright/test');
const { BenefitsPage } = require('../pages/benefits.page');

test.describe('Employees - Edit', () => {
  test('Edit Employee @smoke @ui @employees - create, update, cleanup', async ({ page }, testInfo) => {
    // =====================================================
    // Test description (shows in HTML report)
    // =====================================================
    testInfo.annotations.push({
      type: 'description',
      description: 'Creates an employee, edits it via the UI, validates the updated values, then deletes it (cleanup).',
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
    const stamp = Date.now().toString().slice(-6);

    const original = {
      firstName: `QA${stamp}`,
      lastName: `User${stamp}`,
      dependants: 1,
    };

    let id;

    // =====================================================
    // Actions: Create employee (precondition)
    // =====================================================
    await test.step('Create employee for edit scenario', async () => {
      id = await benefits.createEmployee(original);

      await testInfo.attach('created-employee', {
        body: JSON.stringify({ id, ...original }, null, 2),
        contentType: 'application/json',
      });
    });

    // =====================================================
    // Test data
    // =====================================================
    const updated = {
      id,
      firstName: `${original.firstName}_E`,
      lastName: `${original.lastName}_E`,
      dependants: 2,
    };

    // =====================================================
    // Actions: Edit employee
    // =====================================================
    await test.step('Update employee via Edit modal', async () => {
      await benefits.updateEmployee(updated);

      await testInfo.attach('updated-employee', {
        body: JSON.stringify(updated, null, 2),
        contentType: 'application/json',
      });
    });

    // =====================================================
    // Validation: Re-check row values (extra clarity)
    // =====================================================
    await test.step('Validate updated values in table row', async () => {
      const row = await benefits.waitForRowById(id, 30000);

      await expect(row).toContainText(updated.firstName);
      await expect(row).toContainText(updated.lastName);
      await expect(row.locator('td').nth(3)).toHaveText(String(updated.dependants));
    });

    // =====================================================
    // Cleanup
    // =====================================================
    await test.step('Cleanup: delete updated employee', async () => {
      await benefits.deleteEmployeeById(id, {
        firstName: updated.firstName,
        lastName: updated.lastName,
      });
    });

    // =====================================================
    // Final sanity check
    // =====================================================
    await test.step('Final check: employee removed from table', async () => {
      await expect(page.locator('#employeesTable')).not.toContainText(updated.firstName);
    });
  });
});