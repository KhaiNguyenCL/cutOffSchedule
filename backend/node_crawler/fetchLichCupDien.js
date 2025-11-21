const puppeteer = require('puppeteer');

async function fetchLichCupDien() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto('https://cskh.npc.com.vn/DichVuTTCSKH/DichVuTTCSKHNPC?index=7');

    await page.click('li:nth-child(2) a'); // tab thứ 2

    await page.select('#frmLichNgungGiamCungCapDien_CTyDienLuc', 'PA01');
    await page.select('#frmLichNgungGiamCungCapDien_DienLuc', 'PA1901');

    await page.click('#frmTraCuu_LichNgungGiamCungCapDien_DL');

    await page.waitForSelector('#frmTraCuu_Data_LichNgungGiamCungCapDien_DienLuc');

    const data = await page.evaluate(() => {
        const rows = [...document.querySelectorAll('#frmTraCuu_Data_LichNgungGiamCungCapDien_DienLuc table tbody tr')];
        return rows.map(row => {
            const cols = row.querySelectorAll('td');
            return {
                dienLuc: cols[0]?.innerText.trim(),
                ngay: cols[1]?.innerText.trim(),
                thoiGianTu: cols[2]?.innerText.trim(),
                thoiGianDen: cols[3]?.innerText.trim(),
                khuVuc: cols[4]?.innerText.trim(),
                lyDo: cols[5]?.innerText.trim()
            };
        });
    });

    await browser.close();
    console.log(JSON.stringify(data));   // IMPORTANT: in ra JSON để Python đọc
}

fetchLichCupDien();
