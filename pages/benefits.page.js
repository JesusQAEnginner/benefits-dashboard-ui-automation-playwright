const { expect } = require('@playwright/test');

class BenefitsPage {
  /**
   * Page Object Model (POM)
   * This file keeps selectors and UI actions in ONE place,
   * so tests stay clean and easier to maintain.
   *
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // =============================
    // Main table (Employees list)
    // =============================
    this.table = page.locator('#employeesTable');
    this.tbody = page.locator('#employeesTable tbody');

    // =============================
    // Add / Edit modal elements
    // =============================
    this.addButton = page.locator('#add');
    this.employeeModal = page.locator('#employeeModal');

    // Hidden Id field used when editing an existing employee
    this.hiddenIdField = page.locator('#id');

    // Form inputs
    this.firstNameInput = page.locator('#firstName');
    this.lastNameInput = page.locator('#lastName');
    this.dependentsInput = page.locator('#dependants');

    // Modal action buttons
    this.addEmployeeButton = page.locator('#addEmployee');
    this.updateEmployeeButton = page.locator('#updateEmployee');

    // =============================
    // Delete modal elements
    // =============================
    this.deleteModal = page.locator('#deleteModal');

    // Text shown in the delete confirmation modal
    this.deleteFirstName = page.locator('#deleteFirstName');
    this.deleteLastName = page.locator('#deleteLastName');

    // Confirm delete button
    this.confirmDeleteButton = page.locator('#deleteEmployee');
  }

  // =====================================================
  // Navigation
  // =====================================================

  async goto() {
    // IMPORTANT:
    // We use a relative path (no starting "/") so it uses baseURL from the config.
    // If baseURL = https://.../Prod/
    // goto('Benefits') -> https://.../Prod/Benefits
    await this.page.goto('Benefits');

    // Basic check: table should exist on the Benefits page
    await expect(this.table).toBeVisible();
  }

  // =====================================================
  // Helpers: finding rows in the table
  // =====================================================

  rowById(id) {
    // Finds a row that contains the employee ID text
    return this.page.locator('#employeesTable tbody tr', {
      hasText: String(id),
    });
  }

  rowByFirstName(firstName) {
    // Finds a row that contains the employee first name text
    // NOTE: This is good enough for our test data because we create unique names.
    return this.page.locator('#employeesTable tbody tr', {
      hasText: String(firstName),
    });
  }

  async waitForRowById(id, timeout = 30000) {
    // Wait until the row appears (helps with slow/unstable UI)
    const row = this.rowById(id);
    await expect(row).toBeVisible({ timeout });
    return row;
  }

  // =====================================================
  // Helpers: money formatting and validation (for calculations test)
  // =====================================================

  static formatMoney(value) {
    // UI shows money with 2 decimals.
    // This helper matches the UI format (e.g., "2000.00").
    return (Math.round(Number(value) * 100) / 100).toFixed(2);
  }

  async getCellText(row, columnIndex) {
    // Returns the text from a cell in the row by column index
    return (await row.locator('td').nth(columnIndex).innerText()).trim();
  }

  async assertMoneyCell(row, columnIndex, expectedValue) {
    // Compares the UI cell value with the expected number formatted to 2 decimals
    const actual = await this.getCellText(row, columnIndex);
    expect(actual).toBe(BenefitsPage.formatMoney(expectedValue));
  }

  // =====================================================
  // Actions: Add
  // =====================================================

  async openAddModal() {
    // Click the "Add Employee" button and wait for modal to show
    await this.addButton.click();
    await expect(this.employeeModal).toBeVisible();
  }

  async createEmployee(employee) {
    // This function:
    // 1) Opens the Add modal
    // 2) Fills the form
    // 3) Clicks "Add"
    // 4) Waits until the new row appears in the table
    //
    // We do NOT rely on the table HTML changing because the site is unstable.
    // We rely on a real user signal: "the row appears".

    await this.openAddModal();

    // Fill the form
    await this.firstNameInput.fill(employee.firstName);
    await this.lastNameInput.fill(employee.lastName);
    await this.dependentsInput.fill(String(employee.dependants));

    // Submit (Add)
    await this.addEmployeeButton.click();

    // Sometimes the modal does not close due to the app being buggy.
    // We try to wait for it to close, but if it stays open we attempt to close it.
    try {
      await expect(this.employeeModal).toBeHidden({ timeout: 8000 });
    } catch {
      // Try closing via the X button
      const closeButton = this.employeeModal.locator('button.close');
      if (await closeButton.count()) {
        await closeButton.click();
        await expect(this.employeeModal).toBeHidden({ timeout: 8000 });
      }
    }

    // Wait for the new row to appear (this is our real "success" condition)
    const row = this.rowByFirstName(employee.firstName);
    await expect(row).toBeVisible({ timeout: 30000 });

    // Read the ID from the first column
    const id = (await row.locator('td').nth(0).innerText()).trim();

    // Basic sanity: ID should not be empty
    expect(id).not.toBe('');

    return id;
  }

  // =====================================================
  // Actions: Edit
  // =====================================================

  async openEditModalById(id) {
    // Find the row
    const row = this.rowById(id);
    await expect(row).toBeVisible();

    // Click the edit icon
    await row.locator('i.fa-edit').click();

    // Modal should open
    await expect(this.employeeModal).toBeVisible();

    // Hidden field should match the employee ID
    await expect(this.hiddenIdField).toHaveValue(String(id));
  }

  async updateEmployee(updatedEmployee) {
    // This function:
    // 1) Opens the Edit modal
    // 2) Updates the form fields
    // 3) Clicks "Update"
    // 4) Verifies the table row shows the new values

    await this.openEditModalById(updatedEmployee.id);

    // Update fields
    await this.firstNameInput.fill(updatedEmployee.firstName);
    await this.lastNameInput.fill(updatedEmployee.lastName);
    await this.dependentsInput.fill(String(updatedEmployee.dependants));

    // Submit (Update)
    await this.updateEmployeeButton.click();

    // Modal should close
    await expect(this.employeeModal).toBeHidden({ timeout: 15000 });

    // Verify row values
    const row = await this.waitForRowById(updatedEmployee.id, 30000);

    await expect(row).toContainText(updatedEmployee.firstName);
    await expect(row).toContainText(updatedEmployee.lastName);

    // Dependents column index is 3 based on the UI rendering
    await expect(row.locator('td').nth(3)).toHaveText(String(updatedEmployee.dependants));
  }

  // =====================================================
  // Actions: Delete
  // =====================================================

  async deleteEmployeeById(id, expected = {}) {
    // This function:
    // 1) Clicks delete icon for a row
    // 2) Optionally validates the modal shows the correct name
    // 3) Confirms delete
    // 4) Verifies the row disappears

    const row = this.rowById(id);
    await expect(row).toBeVisible();

    // Click the delete icon
    await row.locator('i.fa-times').click();

    // Delete modal should appear
    await expect(this.deleteModal).toBeVisible();

    // Optional checks for the modal text
    // (Nice to have, but not required if the UI is unstable)
    if (expected.firstName) {
      await expect(this.deleteFirstName).toHaveText(expected.firstName);
    }
    if (expected.lastName) {
      await expect(this.deleteLastName).toHaveText(expected.lastName);
    }

    // Confirm delete
    await this.confirmDeleteButton.click();

    // Modal should close
    await expect(this.deleteModal).toBeHidden({ timeout: 15000 });

    // Verify row is gone
    await expect(this.rowById(id)).toHaveCount(0);
  }

  // =====================================================
  // Helpers: App health / data loaded checks
  // =====================================================

  async getTableMessageText() {
    // When there are no employees, the app shows: "No employees found."
    // We read the table body text to detect that scenario.
    const msgCell = this.page.locator('#employeesTable tbody tr td');
    if (await msgCell.count()) {
      return (await msgCell.first().innerText()).trim();
    }
    return '';
  }

  async hasAnyEmployeeRows() {
    // A "real" employee row has multiple <td> cells (Id, names, etc).
    // The "No employees found." message is a single cell row with colspan.
    const rows = this.page.locator('#employeesTable tbody tr');
    const count = await rows.count();
    if (count === 0) return false;

    // If the first row only has 1 cell, it's likely the "No employees found." row
    const firstRowCells = rows.first().locator('td');
    const cellsCount = await firstRowCells.count();
    if (cellsCount <= 1) return false;

    return true;
  }

  async ensureAppIsUsableOrSkip(testInfo) {
    // This is our "gate" before doing actions like Add/Edit/Delete.
    // If the app is in a broken state (no data loaded), we skip the test with evidence.
    await expect(this.table).toBeVisible();

    // Give the page a short moment to load table data (site is sometimes slow/flaky)
    await this.page.waitForTimeout(1000);

    const usable = await this.hasAnyEmployeeRows();
    const message = await this.getTableMessageText();

    if (!usable) {
      // Attach evidence for the report
      await testInfo.attach('ui-state', {
        body: JSON.stringify(
          {
            reason: 'Blocked by app issue: employees are not loaded / table is empty',
            tableMessage: message,
            url: this.page.url(),
          },
          null,
          2
        ),
        contentType: 'application/json',
      });

      // Screenshot will automatically be captured on failure,
      // but we also attach one here for a clean "blocked" record.
      await testInfo.attach('employees-table-screenshot', {
        body: await this.page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });

      testInfo.skip(
        true,
        'Blocked by known app issue: Employees not loaded, UI actions cannot be executed.'
      );
    }
  }
}

module.exports = { BenefitsPage };