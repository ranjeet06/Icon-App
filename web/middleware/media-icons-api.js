/*
  The custom REST API to support the app frontend.
  Handlers combine application data from qr-codes-db.js with helpers to merge the Shopify GraphQL Admin API data.
  The Shop is the Shop that the current user belongs to. For example, the shop that is using the app.
  This information is retrieved from the Authorization header, which is decoded from the request.
  The authorization header is added by App Bridge in the frontend code.
*/


import { MediaIconsDb } from "../media-icons-db.js";
import {
    getMediaIconLinkOr404,
    getShopOr404,
    getShopUrlFromSession,
    parseIconLinkBody,
    parseShopBody,
    getDisplayOrderCount,
} from "../helpers/media-icons.js";
import { v4 as uuid } from 'uuid';


export default function applyMediaIconsApiEndpoints(app) {

    /* Endpoints for shops  */

    app.post("/api/media_icons/shops", async (req, res) => {
        try {
            const id = await MediaIconsDb.createShop({
                ...(await parseShopBody(req)),

                /* Get the shop from the authorization header to prevent users from spoofing the data */
                shopDomain: await getShopUrlFromSession(req, res),
                uuid: uuid()
            });
            res.status(201).send(id);
        } catch (error) {
            res.status(500).send(error.message);
        }
    });

    app.patch("/api/media_icons/shops/:uuid", async (req, res) => {
        const shop = await getShopOr404(req, res);
        if (shop) {
            try {
                const response = await MediaIconsDb.updateShop(req.params.uuid, await parseShopBody(req));
                console.log(response)
                res.status(200).send(response);
            } catch (error) {
                res.status(500).send(error.message);
            }
        }
    });

    app.get("/api/media_icons/shops", async (req, res) => {
        try {
            const rawCodeData = await MediaIconsDb.readShop(
                await getShopUrlFromSession(req, res)
            );
            res.status(201).send(rawCodeData);
        } catch (error) {
            res.status(500).send(error.message);
        }
    });

    app.get("/api/media_icons/shops/:uuid", async (req, res) => {
        try {
            const rawCodeData = await MediaIconsDb.getShop(
                req.params.uuid
            );
            res.status(201).send(rawCodeData);
        } catch (error) {
            res.status(500).send(error.message);
        }
    });

    /*----------------------------------------------------------------------------------------------------------*/

    /* Endpoints for links */

    app.post("/api/media_icons/links", async (req, res) => {
        const shop = await getShopOr404(req, res);
        try {
            const id = await MediaIconsDb.createLink({
                ...(await parseIconLinkBody(req)),
                shop_id: shop[0].id,
                displayOrder: (await getDisplayOrderCount(shop[0].id) + 1),
            });
            res.status(201).send(id);
        } catch (error) {
            res.status(500).send(error.message);
        }
    });

    app.get("/api/media_icons/links", async (req, res) => {
        const shop = await getShopOr404(req, res);
        try {
            const data = await MediaIconsDb.listLink(shop[0].id)
            res.status(201).send(data);
        } catch (error) {
            res.status(500).send(error.message);
        }
    });

    app.get("/api/media_icons/links/order", async (req, res) => {
        const shop = await getShopOr404(req,res)
        const currentPosition = req.query.currentPosition;
        const targetPosition = req.query.targetPosition;
        try {
            await MediaIconsDb.displayOrder(currentPosition, targetPosition, shop[0].id);
            const data = await MediaIconsDb.listLink(await shop[0].id)
            res.status(201).send(data);
        } catch (error) {
            res.status(500).send(error.message);
        }
    });

    app.patch("/api/media_icons/links/:id", async (req, res) => {
        const shop = await getShopOr404(req, res);
        console.log(shop)
        const link = await getMediaIconLinkOr404(req, res, shop[0].id);
        if (link) {
            try {
                const response = await MediaIconsDb.updateLink(req.params.id, shop[0].id, (await parseIconLinkBody(req, res)));
                res.status(200).send(response);
            } catch (error) {
                res.status(500).send(error.message)
            }
        }
    });

    app.delete("/api/media_icons/links/:id", async (req, res) => {
        const shop = await getShopOr404(req, res);
        const link = await getMediaIconLinkOr404(req, res, shop[0].id)

        if (link) {
            await MediaIconsDb.deleteLink(req.params.id, shop[0].id);
            res.status(200).send();
        }
    });
}