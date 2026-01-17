OrangeHRM Automation Testing

Cypress + Page Object Model (POM)

📘 Project Overview

Project ini merupakan automation testing framework untuk website OrangeHRM Demo
https://opensource-demo.orangehrmlive.com

Framework dibangun menggunakan Cypress dengan pendekatan Page Object Model (POM) untuk memastikan:

struktur kode rapi

mudah di-maintain

scalable untuk penambahan fitur di masa depan

🎯 Objectives

Mengimplementasikan best practice automation testing

Menerapkan Page Object Model (POM)

Menggabungkan UI Testing & API Intercept

Mengelola session login reusable

Menjadi automation framework template untuk project enterprise

🚀 Scope of Automation
✅ Authentication

Login

Forgot Password

✅ Dashboard

Directory

🧰 Tech Stack
Tool	Description
Cypress	End-to-End Automation Framework
JavaScript	Test scripting language
Page Object Model	Design pattern
Cypress Intercept	Network request handling
Fixtures	Test data management

📁 Project Structure
cypress/
│
├── e2e/final-project
│   ├── auth/
│   │   └── auth-session.cy.js
|   |
|   ├── dashboard/
│   |   └── directory.cy.js
│   ├── forgot-password.cy.js
│   └── login.cy.js
│
├── pages/
│   ├── LoginPage.js
│   ├── ForgotPasswordPage.js
│   └── dashboard
|       └── DirectoryPage.js
│
├── fixtures/
│   ├── LoginData.js
|   ├── DirectoryData.js
│   └── ForgotPasswordData.js
│
├── support/
│   ├── commands.js
│   └── e2e.js
│
└── cypress.config.js

🧱 Framework Design – Page Object Model

Setiap halaman direpresentasikan sebagai class terpisah yang berisi:

Element selector

Page actions

Reusable methods

Contoh Implementasi:
class LoginPage {
  visit() {
    cy.visit('/auth/login');
  }

  login(username, password) {
    cy.get('input[name="username"]').type(username);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').click();
  }
}

export default new LoginPage();


📌 Keuntungan POM:

Mengurangi duplikasi kode

Mudah update jika UI berubah

Test case lebih readable

🔐 Session & Authentication Strategy

Login dilakukan melalui custom command

Session disimpan dan digunakan ulang

Menghindari login berulang di setiap test dashboard

cy.loginAsAdmin();


Benefit:

Test execution lebih cepat

Lebih stabil

Cocok untuk skenario dashboard / protected pages

🌐 API Intercept Strategy

cy.intercept() digunakan untuk:

Memastikan API terpanggil

Menunggu request sebelum assert UI

Validasi response API

Contoh:
cy.intercept('GET', '**/directory/viewDirectory').as('getDirectory');
cy.wait('@getDirectory')
  .its('response.statusCode')
  .should('eq', 200);


📌 Intercept tidak memanggil API, hanya menangkap request yang dipanggil oleh aplikasi.

🧪 Test Case Coverage
🔑 Login
ID	Test Case
TS-LOGIN-001	Login dengan credential valid
TS-LOGIN-002	Redirect ke dashboard setelah login
🔁 Forgot Password
ID	Test Case
TS-FP-001	Akses halaman forgot password
TS-FP-002	Submit username valid
TS-FP-003	Validasi API reset password
📁 Directory
ID	Test Case
TS-DIR-001	Akses menu Directory
TS-DIR-002	Validasi API directory terpanggil
TS-DIR-003	Menampilkan list employee
▶️ How to Run the Tests
1️⃣ Install Dependencies
npm install

2️⃣ Run Cypress (Interactive Mode)
npx cypress open

3️⃣ Run Cypress (Headless Mode)
npx cypress run

⚠️ Notes & Limitations

Menggunakan OrangeHRM Demo Environment

Data dan API response dapat berubah sewaktu-waktu

Test bergantung pada ketersediaan demo server

📌 Future Enhancements

✅ Negative test cases

✅ API-only test

⏳ Reporting (Allure / Mochawesome)

⏳ CI Integration (GitHub Actions)

⏳ Role-based testing

👨‍💻 Author
Adhitya Suharningsih | Automation QA / Frontend Engineer
Project ini dibuat sebagai bagian dari pengembangan skill Automation Testing menggunakan Cypress & POM.