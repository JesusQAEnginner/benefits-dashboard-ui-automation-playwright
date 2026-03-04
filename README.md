<h1>🧪 benefits-dashboard-ui-automation-playwright</h1>

<h2>📌 Overview</h2>

<p>
Automated UI testing framework built to validate the Employees &amp; Benefits Dashboard application.
</p>

<p>
This project demonstrates end-to-end UI automation using Playwright, validating CRUD workflows, financial calculations,
and overall system behavior through deterministic CLI execution.
</p>

<p>This automation framework includes:</p>

<ul>
  <li>Playwright Test</li>
  <li>Page Object Model (POM) architecture</li>
  <li>Session reuse via storageState</li>
  <li>HTML reporting</li>
  <li>Screenshot &amp; video evidence capture</li>
  <li>Business rule validation at UI level</li>
  <li>Full CRUD workflow validation</li>
</ul>

<hr>

<h2>🎯 Objective</h2>

<p>Validate employer ability to:</p>

<ul>
  <li>Add employees</li>
  <li>Calculate benefit costs correctly</li>
  <li>Edit employee data</li>
  <li>Delete employees</li>
  <li>Maintain UI data consistency</li>
</ul>

<p>
All tests are designed to be reproducible via CLI execution and suitable for CI/CD pipelines.
</p>

<hr>

<h2>🏗 Architecture &amp; Test Design Principles</h2>

<ul>
  <li>Page Object Model structure</li>
  <li>Deterministic test execution</li>
  <li>Dynamic ID capture from UI</li>
  <li>No hardcoded identifiers</li>
  <li>Reusable authenticated session</li>
  <li>Self-cleaning test behavior</li>
  <li>Evidence-driven reporting</li>
  <li>Controlled handling of demo environment instability</li>
</ul>

<hr>

<h2>🔁 Execution Flow</h2>

<p>The Playwright execution sequence is:</p>

<ol>
  <li>Login Setup – Save authenticated session</li>
  <li>Create Employee – Validate UI persistence</li>
  <li>Edit Employee – Validate update behavior</li>
  <li>Delete Employee – Validate row removal</li>
  <li>Benefits Calculation Validation – Validate financial logic</li>
</ol>

<p>
Each test independently validates a complete UI workflow while maintaining system stability.
</p>

<hr>

<h2>💰 Business Rules Assumptions</h2>

<p>Financial model validated at UI level:</p>

<ul>
  <li>Employee Gross Pay = $2000 per paycheck</li>
  <li>26 paychecks per year</li>
  <li>Annual Employee Benefit Cost = $1000</li>
  <li>Dependent Cost = $500 per dependent</li>
</ul>

<h3>Calculation Model</h3>

<pre>
Yearly Benefits = 1000 + (Dependents × 500)
Benefits per Paycheck = Yearly Benefits ÷ 26
Net Paycheck = 2000 − Benefits per Paycheck
</pre>

<p>Assertions validate:</p>

<ul>
  <li>Gross value correctness</li>
  <li>Benefit calculation accuracy</li>
  <li>Net &lt; Gross validation</li>
  <li>Non-negative benefit values</li>
  <li>2-decimal precision consistency</li>
</ul>

<hr>

<h2>🧪 Test Coverage Scenarios</h2>

<h3>✅ Add Employee</h3>
<ul>
  <li>Modal interaction validation</li>
  <li>Dynamic ID extraction</li>
  <li>UI table verification</li>
  <li>Automatic cleanup</li>
</ul>

<h3>✅ Edit Employee</h3>
<ul>
  <li>Form update validation</li>
  <li>UI persistence confirmation</li>
  <li>Table refresh verification</li>
  <li>Cleanup execution</li>
</ul>

<h3>✅ Delete Employee</h3>
<ul>
  <li>Delete confirmation modal validation</li>
  <li>Row removal verification</li>
  <li>Negative scenario validation</li>
</ul>

<h3>✅ Benefits Calculation Validation</h3>
<ul>
  <li>Gross paycheck verification</li>
  <li>Benefits cost validation</li>
  <li>Net paycheck validation</li>
  <li>Financial rule consistency</li>
</ul>

<hr>

<h2>⚠️ Demo Stability Handling</h2>

<p>
The demo application may occasionally fail to load employee data.
</p>

<p>The framework includes protective validation logic:</p>

<ul>
  <li>Application health check before executing UI actions</li>
  <li>Automatic test skip when employee table fails to load</li>
  <li>Screenshot evidence attachment</li>
  <li>JSON diagnostic logging</li>
  <li>Clear separation between system defect and automation failure</li>
</ul>

<hr>

<h2>🔍 Technical Validation Strategies</h2>

<ul>
  <li>storageState session reuse</li>
  <li>Dynamic timestamp-based test data</li>
  <li>No hardcoded employee IDs</li>
  <li>UI-based business rule validation</li>
  <li>HTML report generation</li>
  <li>Automatic screenshot capture on failure</li>
  <li>Video retention on failure</li>
  <li>Trace collection on failure/retry for debugging</li>
</ul>

<hr>

<h2>🛠 Technology Stack</h2>

<ul>
  <li>Playwright Test</li>
  <li>Node.js</li>
  <li>Playwright HTML Reporter</li>
</ul>

<hr>

<h2>📁 Project Structure</h2>

<pre>
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
</pre>

<hr>

<h2>⚙️ Installation and Execution</h2>

<h3>Install Dependencies</h3>
<pre><code>npm install</code></pre>

<h3>Install Playwright Browsers</h3>
<pre><code>npx playwright install</code></pre>

<hr>

<h2>🔐 Environment Configuration</h2>

<p>
Create a <code>.env</code> file based on <code>.env.example</code>.
</p>

<p>
<strong>Important:</strong> <code>BASE_URL</code> must include a trailing slash.
</p>

<p>Example:</p>

<pre>
BASE_URL=https://wmxrwq14uc.execute-api.us-east-1.amazonaws.com/Prod/
UI_USERNAME=YourUsername
UI_PASSWORD=YourPassword
</pre>

<hr>

<h3>Run Login Setup</h3>
<p>This creates the authenticated session file (<code>auth/storageState.json</code>).</p>

<pre><code>npx playwright test tests/setup/login.setup.spec.js --project=setup --headed</code></pre>

<h3>Run Full Test Suite</h3>
<pre><code>npx playwright test --project=chromium --headed</code></pre>

<hr>

<h2>📊 Test Report</h2>

<p>
Playwright generates an interactive HTML report after test execution.
</p>

<p>Open the last report:</p>

<pre><code>npx playwright show-report</code></pre>

<p>
The report includes:
</p>

<ul>
  <li>Total tests executed</li>
  <li>Pass / Fail / Skipped summary</li>
  <li>Step-by-step execution timeline</li>
  <li>Screenshot evidence on failure</li>
  <li>Video retention on failure</li>
  <li>Trace files when enabled</li>
  <li>JSON diagnostic attachments for blocked scenarios</li>
</ul>

<hr>

<h2>🐞 Known Application Issues</h2>

<p>
During automation development, several UI issues were identified in the demo application.
</p>

<p>
These behaviors are documented and handled safely by the automation tests.
</p>

<h3>Known Issues</h3>

<p><strong>1️⃣ Employees table sometimes loads empty</strong></p>
<ul>
  <li>The dashboard occasionally displays <strong>"No employees found"</strong> even when records exist.</li>
  <li>When this occurs, UI actions (Add/Edit/Delete) become unreliable or unavailable.</li>
</ul>

<p><strong>Automation Handling:</strong></p>
<ul>
  <li>Tests detect this condition and <strong>skip execution gracefully</strong>.</li>
  <li>Evidence (screenshot + UI state JSON) is attached to the Playwright report.</li>
</ul>

<p><strong>2️⃣ Employee modal sometimes does not close after submission</strong></p>
<ul>
  <li>After clicking <strong>Add Employee</strong>, the modal may remain visible.</li>
</ul>

<p><strong>Automation Handling:</strong></p>
<ul>
  <li>The framework uses a fallback approach (close button) before continuing.</li>
</ul>

<p>
These issues are documented as <strong>product defects</strong>, not automation failures.
</p>

<hr>

<h2>🚀 CI/CD Readiness</h2>

<ul>
  <li>Headless CLI execution</li>
  <li>Pipeline-ready automation</li>
  <li>GitHub Actions compatibility</li>
  <li>Version-controlled testing</li>
</ul>

<hr>

<h2>👤 Author</h2>

<p>
Jesus Ricardo Hernandez Campos<br>
QA Automation Engineer<br>
UI Automation | API Testing | Automation Strategy | CI/CD Awareness
</p>

<hr>

<h2>🏆 Quality Engineering Philosophy</h2>

<p>
The primary objective is not only defect detection, but risk mitigation,
business logic validation, and reliability assurance.
</p>
