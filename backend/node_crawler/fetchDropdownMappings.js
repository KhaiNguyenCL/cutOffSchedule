const puppeteer = require("puppeteer");
const fs = require("fs");

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchDropdownMappings() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto("https://cskh.npc.com.vn/DichVuTTCSKH/DichVuTTCSKHNPC?index=7"); // URL thật của bạn

    await page.waitForSelector('#frmLichNgungGiamCungCapDien_CTyDienLuc');

    // Lấy dropdown tỉnh
    const ctyOptions = await page.evaluate(() => {
        return [...document.querySelectorAll('#frmLichNgungGiamCungCapDien_CTyDienLuc option')]
            .map(o => ({ value: o.value, text: o.text.trim() }))
            .filter(o => o.value);
    });

    const mapping = {};

    for (const cty of ctyOptions) {
        try {
            console.error(`→ Đang lấy: ${cty.text} (${cty.value})`);

            // chọn tỉnh
            await page.select('#frmLichNgungGiamCungCapDien_CTyDienLuc', cty.value);

            // Delay thay thế waitForTimeout
            await delay(1200);

            // lấy dropdown điện lực
            const dienLucOptions = await page.evaluate(() => {
                return [...document.querySelectorAll('#frmLichNgungGiamCungCapDien_DienLuc option')]
                    .map(o => ({ value: o.value, text: o.text.trim() }))
                    .filter(o => o.value);
            });

            mapping[cty.value] = dienLucOptions;

        } catch (err) {
            console.error("LỖI:", err.message);
        }
    }

    await browser.close();
    fs.writeFileSync("mapping_dropdown.json", JSON.stringify(mapping), "utf8");
    console.log(JSON.stringify(mapping));
}

fetchDropdownMappings();
