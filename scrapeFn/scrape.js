const puppeteer = require('puppeteer');
const fs = require('fs');
const data = {
    list: []
};


async function main(skill) {
    
    const browser = await puppeteer.launch({headless: false })                      //launches cromium 
    const page = await browser.newPage()                                                 //open new tab
    await page.goto(`https://in.indeed.com/jobs?q=${skill}&l=Bangalore%2C+Karnataka`,  {  //go to page
        timeout: 0,
        waitUntil: 'networkidle0'
    });
    console.log("Inside browser");


    await page.waitForSelector('td.resultContent');


    const jobData = await page.evaluate(async (data) => {
        const items = document.querySelectorAll('td.resultContent');

        console.log("Website data got");
        items.forEach((item, index) => {
            console.log(`scraping data of product: ${index}`)
            const title = item.querySelector('h2.jobTitle > a')?.innerText;
            const link = item.querySelector('h2.jobTitle > a')?.href;
            let salary = item.querySelector('div.metadata.salary-snippet-container > div')?.innerText;
            const companyName = item.querySelector('span.companyName')?.innerText;

            //edge cases
            if(salary == null){
                salary = "not defined"
            }

            data.list.push({
                title: title,
                salary: salary,
                companyName: companyName,
                link: link
            })
        }, data);
        return data;
    });

    console.log(`successfully collected ${jobData.list.length} products`)

    let response = await jobData;
    let json = await JSON.stringify(jobData, null, 2);
    fs.writeFile('job.json', json, 'utf-8', () => {
        console.log('written in job.json');
    });

    browser.close();
    return response;
};


module.exports = main;