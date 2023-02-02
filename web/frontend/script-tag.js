import fetch from 'node-fetch';
export default async function createScriptTag(req, res) {
    const accessToken = res.locals.shopify.session.accessToken;
    console.log(accessToken)
    const shop = res.locals.shopify.session.shop;
    const host = process.env.HOST
    const url = `https://${shop}/admin/api/2023-01/script_tags.json`;
    const src = `${host}/script.js`;

    let scriptTagExist = false;

    const shopifyHeader = (token) => ({
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': token,
    });

    const scriptTagBody = JSON.stringify({
        script_tag: {
            event: 'onload',
            src
        },
    });

    const getScriptTags = await fetch(url, {
        method: "GET",
        headers: shopifyHeader(accessToken)
    });
    if(getScriptTags.ok){
        const data = await getScriptTags.json();
        data.script_tags.map((script) => {
            if(script.src === src) {
                scriptTagExist = true;
            }
        });
    }

    if(!scriptTagExist) {
        const response = await fetch(url, {
            method: "POST",
            body : scriptTagBody,
            headers: shopifyHeader(accessToken)
        });
        if(response.ok){
            return response
        }

    } else {
        return JSON.stringify({scriptTagStatus: true});
    }
}