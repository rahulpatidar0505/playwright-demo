import { test, expect } from '@playwright/test';

test.beforeEach('Navigate to file operations page', async ({ page }) => {
  await page.goto('https://zenetratechnologies.com/practice-app');
  await page.locator('div').nth(2).click();
  await page.getByRole('button', { name: 'Accept All' }).click();
  await page.getByText('📁').click();
});

test.describe('File Operations Tests', () => {
  test('File Upload - Single and Multiple Files', async ({ page }) => {
    // Single file upload - target the actual file input element
    await page
      .locator('input[type="file"]')
      .first()
      .setInputFiles('testData/sample-notes.txt');
    await expect(page.getByTestId('removeSingleFile')).toBeVisible();

    // Multiple files upload - target the second file input element, and Verify remove buttons are available for both uploaded files
    await page
      .locator('input[type="file"]')
      .nth(1)
      .setInputFiles([
        'testData/sample-notes.txt',
        'testData/sample-notes-2.txt',
      ]);
    await expect(page.getByTestId('removeMultipleFile-0')).toBeVisible();
    await expect(page.getByTestId('removeMultipleFile-1')).toBeVisible();
  });

  test('File Downloads - Various File Types', async ({ page }) => {
    // Download and Verify PDF file
    const downloadPdfPromise = page.waitForEvent('download'); // Purpose: Sets up a promise that will resolve when a download event occurs on the page. This must be done BEFORE triggering the download action because it's listening for the event.
    await page.getByTestId('downloadSamplePdf').click();
    const pdfDownload = await downloadPdfPromise; //Purpose: Waits for the download event to complete and captures the download object. This object contains information about the downloaded file like filename, path, URL, etc.
    expect(pdfDownload.suggestedFilename()).toContain('.pdf');
    expect(pdfDownload).toBeTruthy();

    // Download and Verify CSV file
    const downloadCsvPromise = page.waitForEvent('download');
    await page.getByTestId('downloadSampleCsv').click();
    const csvDownload = await downloadCsvPromise;
    expect(csvDownload.suggestedFilename()).toContain('.csv');
    expect(csvDownload).toBeTruthy();

    // Download and Verify TXT file
    const downloadTxtPromise = page.waitForEvent('download');
    await page.getByTestId('downloadSampleTxt').click();
    const txtDownload = await downloadTxtPromise;
    expect(txtDownload.suggestedFilename()).toContain('.txt');
    expect(txtDownload).toBeTruthy();

    // Download and Verify JSON file
    const downloadJsonPromise = page.waitForEvent('download');
    await page.getByTestId('downloadSampleJson').click();
    const jsonDownload = await downloadJsonPromise;
    expect(jsonDownload.suggestedFilename()).toContain('.json');
    expect(jsonDownload).toBeTruthy();
  });
});
