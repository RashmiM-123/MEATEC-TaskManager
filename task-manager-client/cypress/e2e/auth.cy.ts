describe('Authentication Flow', () => {
  it('should login successfully and redirect to dashboard', () => {
    cy.visit('/login');
    
    cy.get('input[name="username"]').type('test');
    cy.get('input[name="password"]').type('test123');
    cy.get('button[type="submit"]').click();

    // 1. Check URL
    cy.url().should('include', '/dashboard');

    // 2. Wait for loading spinner to disappear
    cy.get('.animate-spin').should('not.exist');

    // 3. Match the actual heading in your Dashboard.tsx
    cy.contains('h2', 'Dashboard').should('be.visible');
    
    
    cy.contains('tasks assigned').should('be.visible');
  });
});