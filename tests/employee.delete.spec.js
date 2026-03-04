const { test, expect } = require('@playwright/test');
const { BenefitsPage } = require('../pages/benefits.page');

test.describe('Employees - Delete', () => {
  test('Delete Employee @smoke @ui @employees @delete - confirm modal and remove row', async ({ page }, testInfo) => {
    // =====================================================
    // Test description (shows in HTML report)
    // =====================================================
    testInfo.annotations.push({
      type: 'description',
      description: 'Creates an employee, deletes it using the delete modal, and verifies it disappears from the table.',
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

    const employee = {
      firstName: `DEL${stamp}`,
      lastName: `User${stamp}`,
      dependants: 0,
    };

    let id;

    // =====================================================
    // Actions: Create employee (precondition)
    // =====================================================
    await test.step('Create employee to delete', async () => {
      id = await benefits.createEmployee(employee);

      await testInfo.attach('created-employee-for-delete', {
        body: JSON.stringify({ id, ...employee }, null, 2),
        contentType: 'application/json',
      });
    });

    // =====================================================
    // Actions: Delete employee
    // =====================================================
    await test.step('Delete employee using delete modal', async () => {
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