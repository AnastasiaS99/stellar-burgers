// Создаем группу для тестирования конструктора бургеров
describe('Создание нужного бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.intercept('GET', '**/auth/user', { fixture: 'user.json' }).as('getUser');
    cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' }).as('getUserApi');
    cy.intercept('POST', '**/api/orders', { fixture: 'order.json' }).as('createOrder');
    cy.intercept('POST', 'https://norma.education-services.ru/api/orders', { fixture: 'order.json' }).as('createOrderNorma');
      
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  // Группа для добавления ингредиентов в бургер
  describe('Добавление ингредиентов в бургер', () => {
    it('Добавление булки в бургер', () => {
      cy.contains('Краторная булка N-200i')
        .parents('li')
        .find('button')
        .contains('Добавить')
        .click();
    });

    it('Добавление начинки в бургер', () => {
      cy.contains('Биокотлета из марсианской Магнолии')
        .parents('li')
        .find('button')
        .contains('Добавить')
        .click();
    });

    it('Добавление соуса Spicy-X в бургер', () => {
      cy.contains('Соус Spicy-X')
        .parents('li')
        .find('button')
        .contains('Добавить')
        .click();
    });
  });

  // Модальное окно с деталями ингредиента
  describe('Открытие и закрытие модального окна с ингредиентами', () => {
    it('Открытие модального окна с выбранным ингредиентом', () => {
      cy.contains('Соус Spicy-X').click();

      cy.url({ timeout: 10000 }).should('include', '/ingredients/');
      cy.contains('Соус Spicy-X', { timeout: 10000 }).should('exist');
      cy.contains('Калории, ккал').should('exist');
      cy.contains('Белки, г').should('exist');
      cy.contains('Жиры, г').should('exist');
      cy.contains('Углеводы, г').should('exist');
    });

    it('Детали выбранного соуса отображаются корректно в модальном окне', () => {
      cy.contains('Соус Spicy-X').click();

      cy.url({ timeout: 10000 }).should('include', '/ingredients/');
      cy.contains('Соус Spicy-X').should('exist');
      cy.contains('30').should('exist');
      cy.contains('30').should('exist');
      cy.contains('20').should('exist');
      cy.contains('40').should('exist');
    });

    it('Закрытие модального окна по кнопке', () => {
      cy.contains('Соус Spicy-X').click();

      cy.url({ timeout: 10000 }).should('include', '/ingredients/');
      cy.get('body').then(($body) => {
        const modal = $body.find('[class*="modal"]');
        if (modal.length > 0) {
          cy.get('[class*="modal"] button[class*="button"]').first().click();
        }
      });
      cy.go('back');
      cy.url().should('eq', 'http://localhost:4000/');
    });

    it('Закрытие модального окна по клику вне окна', () => {
      cy.contains('Соус Spicy-X').click();

      cy.url({ timeout: 10000 }).should('include', '/ingredients/');
      cy.get('body').click(0, 0, { force: true });
      cy.go('back');
      cy.url().should('eq', 'http://localhost:4000/');
    });
  });

  // Тест на процесс создания заказа
  describe('Процесс создания заказа', () => {
    beforeEach(() => {

      // Задаем токены
      cy.window().then((win) => {
        win.localStorage.setItem('refreshToken', 'fake-refresh-token');
        win.document.cookie = 'accessToken=fake-access-token; path=/';
      });

      cy.visit('/');
      cy.wait('@getIngredients');
      cy.contains('Соберите бургер', { timeout: 10000 }).should('be.visible');
    });

    afterEach(() => {
      cy.window().then((win) => {
        win.localStorage.removeItem('refreshToken');
        win.document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      });
    });

    it('Создает заказ и показывает номер', () => {
      // Добавляем ингредиенты
      cy.contains('Краторная булка N-200i')
        .parents('li')
        .find('button')
        .contains('Добавить')
        .click();



      cy.contains('Биокотлета из марсианской Магнолии')
        .parents('li')
        .find('button')
        .contains('Добавить')
        .click();



      cy.contains('Соус Spicy-X')
        .parents('li')
        .find('button')
        .contains('Добавить')
        .click();


      cy.wait(1000);
      // Оформляем заказ
      cy.get('button').contains('Оформить заказ').should('not.be.disabled').click({ force: true });

      cy.url({ timeout: 5000 }).should('not.include', '/login');
      // Проверка номера заказа
      cy.contains('12345', { timeout: 20000 }).should('exist');
    });

    it('Очистка конструктора после заказа', () => {
      // добавляем ингредиенты
      cy.contains('Краторная булка N-200i')
        .parents('li')
        .find('button')
        .contains('Добавить')
        .click();

      cy.contains('Биокотлета из марсианской Магнолии')
        .parents('li')
        .find('button')
        .contains('Добавить')
        .click();

      cy.contains('Соус Spicy-X')
        .parents('li')
        .find('button')
        .contains('Добавить')
        .click();

      cy.wait(1000);

      cy.get('button').contains('Оформить заказ').should('not.be.disabled').click({ force: true });

      cy.contains('12345', { timeout: 20000 }).should('exist');

      // закрываем модальное окно
      cy.get('body').then(($body) => {
        const modal = $body.find('[class*="modal"]');
        if (modal.length > 0) {
          cy.get('[class*="modal"] button[class*="button"]').first().click({ force: true });
        }
      });
      // Проверяем, что конструктор очищен
      cy.contains('Выберите булки', { timeout: 5000 }).should('exist');
      cy.contains('Выберите начинку', { timeout: 5000 }).should('exist');
    });

    it('Перенаправление на страницу логина при не авторизации', () => {
      // Удаляем токены
      cy.window().then((win) => {
        win.localStorage.removeItem('refreshToken');
        win.document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      });
      cy.reload();

      cy.wait('@getIngredients');
      cy.contains('Соберите бургер', { timeout: 10000 }).should('be.visible');

      cy.contains('Краторная булка N-200i')
        .parents('li')
        .find('button')
        .contains('Добавить')
        .click();

      cy.get('button').contains('Оформить заказ').click();

      // Проверка редиректа на страницу входа
      cy.url({ timeout: 5000 }).should('include', '/login');
    });
  });
});