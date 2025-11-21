const puppeteer = require('puppeteer');

async function fetchDropdownOptions() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto('https://cskh.npc.com.vn/DichVuTTCSKH/DichVuTTCSKHNPC?index=7'); // URL thật tại đây

    // Đợi dropdown load
    await page.waitForSelector('#frmLichNgungGiamCungCapDien_CTyDienLuc');

    // Lấy dropdown Tỉnh/Thành phố
    const ctyDienLucOptions = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('#frmLichNgungGiamCungCapDien_CTyDienLuc option'))
            .map(option => ({
                value: option.value,
                text: option.text.trim()
            }));
    });

    // Lấy dropdown Điện lực
    const dienLucOptions = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('#frmLichNgungGiamCungCapDien_DienLuc option'))
            .map(option => ({
                value: option.value,
                text: option.text.trim()
            }));
    });

    await browser.close();

    const result = {
        ctyDienLucOptions,
        dienLucOptions,
    };

    console.log(JSON.stringify(result));  // Python cần JSON từ stdout
}

fetchDropdownOptions();
