class DemoPage {
  constructor(page) {
    this.page = page;
    this.demoLink = page.locator('a', { hasText: 'Demo' });
    this.demoHeader = page.locator('h1', { hasText: 'Demo' });
  }

  async navigateToApp() {
    await this.demoLink.click();
  }
}

export default DemoPage;
