const { test, expect } = require('@playwright/test');
const { BenefitsPage } = require('../pages/benefits.page');

test.describe('Employees - Calculations', () => {
  test('Benefits calculations @regression @ui @employees @calculations - gross, benefits cost, net', async ({ page }, testInfo) => {
    // =====================================================
    // Test description (shows in HTML report)
    // =====================================================
    testInfo.annotations.push({
      type: 'description',
      description: 'Creates an employee and validates salary, gross pay, benefits cost, and net pay using the business rules.',
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
    // We use a fixed number of dependants so the expected values are predictable.
    const dependants = 2;

    // =====================================================
    // Test data
    // =====================================================
    // We generate a unique suffix to avoid collisions in shared environments.
    const stamp = Date.now().toString().slice(-6);

    // =====================================================
    // Test data
    // =====================================================
    // Employee object used for create + validations + cleanup.
    const employee = {
      firstName: `CALC${stamp}`,
      lastName: `User${stamp}`,
      dependants,
    };

    let id;

    // =====================================================
    // Actions: Create employee (precondition)
    // =====================================================
    await test.step('Create employee for calculation checks', async () => {
      id = await benefits.createEmployee(employee);

      await testInfo.attach('calculation-test-employee', {
        body: JSON.stringify({ id, ...employee }, null, 2),
        contentType: 'application/json',
      });
    });

    // =====================================================
    // Validation: Monetary values
    // =====================================================
    await test.step('Validate salary, benefits cost, and net pay values', async () => {
      const row = await benefits.waitForRowById(id, 30000);

      // =====================================================
      // Reference: Column indexes (based on UI rendering)
      // =====================================================
      // 4 = Salary
      // 5 = Gross Pay
      // 6 = Benefits Cost
      // 7 = Net Pay

      // =====================================================
      // Expected values (based on business rules)
      // =====================================================
      const expectedSalary = 2000.0;
      const expectedGross = 2000.0;

      const annualBenefits = 1000 + dependants * 500;
      const expectedBenefitsCost = annualBenefits / 26;
      const expectedNet = expectedGross - expectedBenefitsCost;

      await benefits.assertMoneyCell(row, 4, expectedSalary);
      await benefits.assertMoneyCell(row, 5, expectedGross);
      await benefits.assertMoneyCell(row, 6, expectedBenefitsCost);
      await benefits.assertMoneyCell(row, 7, expectedNet);

      await testInfo.attach('expected-calculation-values', {
        body: JSON.stringify(
          {
            salary: BenefitsPage.formatMoney(expectedSalary),
            gross: BenefitsPage.formatMoney(expectedGross),
            benefitsCost: BenefitsPage.formatMoney(expectedBenefitsCost),
            net: BenefitsPage.formatMoney(expectedNet),
          },
          null,
          2
        ),
        contentType: 'application/json',
      });
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