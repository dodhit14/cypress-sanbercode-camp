class ForgotPasswordPage {
  get elements() {
    return {
      forgotPasswordLink: () => cy.get('.orangehrm-login-forgot-header'),
      usernameInput: () => cy.get('input[name="username"]'),
      resetButton: () => cy.get('button[type="submit"]'),
      cancelButton: () => cy.get('button[type="button"]'),
      successTitle: () => cy.get('.orangehrm-forgot-password-title'),
      errorMessage: () => cy.get('.oxd-input-group__message')
    }
  }

  visit() {
    cy.visit('/web/index.php/auth/login', { timeout: 30000});
    this.elements.forgotPasswordLink().click();
    cy.url().should('include', '/auth/requestPasswordResetCode');
    this.elements.usernameInput().should('be.visible');
  }
}

export default new ForgotPasswordPage();