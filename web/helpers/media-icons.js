import shopify from "../shopify.js";
import {MediaIconsDb} from "../media-icons-db.js";


export async function getMediaIconLinkOr404(req, res, shop_id) {
    try {
        const response = await MediaIconsDb.readLink(req.params.id, shop_id);
        if ( response === undefined ) {
            res.status(404).send();
        } else {
            return response;
        }
    } catch (error) {
        res.status(500).send(error.message);
    }

    return undefined;
}

export async function getShopOr404(req, res) {
    const shop = await getShopUrlFromSession(req, res)
    try {
        const response = await MediaIconsDb.readShop(shop);
        if ( response === undefined ) {
            res.status(404).send();
        } else {
            return response;
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export async function getShopUrlFromSession(req, res) {
    return `https://${res.locals.shopify.session.shop}`;
}

export async function parseIconLinkBody(req) {
    return {
        title: req.body.title,
        link: req.body.iconLink,
        icon: "req.body.icon",
        color: req.body.color,
    };
}

export async function parseShopBody(req) {
    return {
        position: req.body.position,
        shape: req.body.shape,
        appStatus : req.body.status,
    };
}

export  async  function  getDisplayOrderCount(shop_id){
    return await MediaIconsDb.countLink(shop_id)
}
