/*
  This file interacts with the app's database and is used by the app's REST APIs.
*/

import sqlite3 from "sqlite3";
import path from "path";

const DEFAULT_DB_FILE = path.join(process.cwd(), "media_icons_db.sqlite");

export const MediaIconsDb = {
    shopsTableName: "shopsTable",
    linksTableName: "linksTable",
    db: null,
    ready: null,
/*----------------------------------------------------------------------------------------------------------*/
    /* CURD methods on shops table */

    createShop: async function ({
                                    uuid,
                                    shopDomain,
                                    position,
                                    shape,
                                    appStatus,
                            }) {
        await this.ready;

        const query = `
      INSERT INTO ${this.shopsTableName}
      (uuid, shopDomain, position, shape, appStatus)
      VALUES (?, ?, ?, ?, ?)
      RETURNING id;
    `;

        return await this.__query(query, [
            uuid,
            shopDomain,
            position,
            shape,
            appStatus,
        ]);
    },

    updateShop: async function (
        uuid,
        {
            position,
            shape,
            appStatus,
        }
    ) {
        await this.ready;
        const query = `
      UPDATE ${this.shopsTableName}
      SET
        position = ?,
        shape = ?,
        appStatus = ?
      WHERE
        uuid = ?;
    `;

        return await this.__query(query, [
            position,
            shape,
            appStatus,
            uuid,
        ]);
    },


    readShop: async function (shopDomain) {
        await this.ready;
        const query = `
      SELECT * FROM ${this.shopsTableName}
      WHERE shopDomain = ?;
    `;
        return await this.__query(query, [shopDomain]);
    },

    getShop: async function (uuid) {
        await this.ready;
        const query = `
      SELECT * FROM ${this.shopsTableName}
      WHERE uuid = ?;
    `;
        return await this.__query(query, [uuid]);
    },

    /*deleteShop: async function (uuid) {
        await this.ready;
        const query = `
      DELETE FROM ${this.shopsTableName}
      WHERE uuid = ?;
    `;
        await this.__query(query, [uuid]);
        return true;
    },*/

    /*------------------------------------------------------------------------------------------------------------------------*/

    createLink: async function ({
                                    shop_id,
                                    displayOrder,
                                    title,
                                    link,
                                    icon,
                                    color,
                                    }) {

        await this.ready;

        const query = `
      INSERT INTO ${this.linksTableName}
      (shop_id, displayOrder, title, link, icon, color)
      VALUES (?, ?, ?, ?, ?, ?)
      RETURNING id;
    `;

        return await this.__query(query, [
            shop_id,
            displayOrder,
            title,
            link,
            icon,
            color,
        ]);

    },

    updateLink: async function (
        id, shop_id,
        {
            link,
            icon,
            color,
        }
    ) {
        await this.ready;

        const query = `
      UPDATE ${this.linksTableName}
      SET
        link = ?,
        icon = ?,
        color = ?
      WHERE
        id = ? AND shop_id =? ;
    `;

        await this.__query(query, [
            link,
            icon,
            color,
            id,
            shop_id,
        ]);
        return true;
    },

    displayOrder: async function (currentPosition, targetPosition, shop_id) {
        const navigation = targetPosition > currentPosition ? "down" : "up"
        await this.ready;
        const setDisplayOrderZeroQuery = `
          UPDATE ${this.linksTableName}
          SET
            displayOrder = ?
          WHERE
            displayOrder = ? AND shop_id = ?;
    `;

        await this.__query(setDisplayOrderZeroQuery, [
            0,
            currentPosition,
            shop_id,
        ]);

        if (navigation === "down") {
            const downQuery = `
                  UPDATE ${this.linksTableName}
                  SET
                    displayOrder = (displayOrder-1)
                  WHERE
                    displayOrder > ? And displayOrder <= ? AND shop_id = ?;
            `;
            await this.__query(downQuery, [
                currentPosition,
                targetPosition,
                shop_id,
            ]);

        } else if (navigation === "up") {
            const upQuery = `
                          UPDATE ${this.linksTableName}
                          SET
                            displayOrder = (displayOrder+1)
                          WHERE
                            displayOrder >= ? And displayOrder < ? AND shop_id = ?;
                    `;
            await this.__query(upQuery, [
                targetPosition,
                currentPosition,
                shop_id,
            ]);
        }


        const query = `
                          UPDATE ${this.linksTableName}
                          SET
                            displayOrder = ?
                          WHERE
                            displayOrder = ? AND shop_id = ?;
                    `;
        await this.__query(query, [
            targetPosition,
            0,
            shop_id,
        ]);
        return true
    },

    listLink: async function (shop_id) {
        await this.ready;
        const query = `
      SELECT * FROM ${this.linksTableName}
      WHERE shop_id = ?
      ORDER BY displayOrder ASC;
    `;

        return await this.__query(query, [shop_id]);
    },

    readLink: async function (id, shop_id) {
        console.log(id,shop_id)
        await this.ready;
        const query = `
      SELECT * FROM ${this.linksTableName}
      WHERE id = ? AND shop_id = ?;
    `;
        const rows = await this.__query(query, [id, shop_id]);
        if (!Array.isArray(rows) || rows?.length !== 1) return undefined;

        return rows[0];
    },

    countLink: async function (shop_id) {
        await this.ready;
        const query = `
      SELECT count(1) AS count FROM ${this.linksTableName}
      WHERE shop_id = ?;
    `;

        const results = await this.__query(query, [shop_id]);
        return results[0].count;
    },

    deleteLink: async function (id, shop_id) {
        await this.ready;
        const query = `
      DELETE FROM ${this.linksTableName}
      WHERE id = ? AND shop_id = ? ;
    `;
        await this.__query(query, [id, shop_id]);
        return true;
    },


    /* Private */

    /*
      Used to check whether to create the database.
      Also used to make sure the database and table are set up before the server starts.
    */

    __hasShopsTable: async function () {
        const query = `
      SELECT name FROM sqlite_schema
      WHERE
        type = 'table' AND
        name = ?;
    `;
        const rows = await this.__query(query, [this.shopsTableName]);
        return rows.length === 1;
    },


    __hasLinksTable: async function () {
        const query = `
      SELECT name FROM sqlite_schema
      WHERE
        type = 'table' AND
        name = ?;
    `;
        const rows = await this.__query(query, [this.linksTableName]);
        return rows.length === 1;
    },

    /* Initializes the connection with the app's sqlite3 database */
    initShops: async function () {

        /* Initializes the connection to the database */
        this.db = this.db ?? new sqlite3.Database(DEFAULT_DB_FILE);

        const hasShopsTable = await this.__hasShopsTable();

        if (hasShopsTable) {
            this.ready = Promise.resolve();

            /* Create the shop table if it hasn't been created */
        } else {
            const query = `
        CREATE TABLE ${this.shopsTableName} (
          id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
          uuid BLOB UNIQUE NOT NULL,
          shopDomain VARCHAR(511) NOT NULL,
          position VARCHAR(511) NOT NULL,
          shape VARCHAR(255) NOT NULL,
          appStatus VARCHAR(255) NOT NULL,
          createdAt DATETIME NOT NULL DEFAULT (datetime(CURRENT_TIMESTAMP, 'localtime'))
        )
      `;
            /* Tell the various CRUD methods that they can execute */
            this.ready = this.__query(query);
        }
    },

    initLinks: async function () {

        /* Initializes the connection to the database */
        this.db = this.db ?? new sqlite3.Database(DEFAULT_DB_FILE);

        const hasLinksTable = await this.__hasLinksTable();

        if (hasLinksTable) {
            this.ready = Promise.resolve();
            /* Create the link table if it hasn't been created */
        } else {
            const query = `
        CREATE TABLE ${this.linksTableName} (
          id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
          shop_id INTEGER NOT NULL,
          displayOrder INTEGER NOT NULL,
          title VARCHAR(511) NOT NULL,
          link VARCHAR(511) NOT NULL,
          icon VARCHAR(511) NOT NULL,
          color VARCHAR(511) NOT NULL,
          createdAt DATETIME NOT NULL DEFAULT (datetime(CURRENT_TIMESTAMP, 'localtime'))
        )
      `;
            /* Tell the various CRUD methods that they can execute */
            this.ready = this.__query(query);
        }
    },

    /* Perform a query on the database. Used by the various CRUD methods. */
    __query: function (sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result);
            });
        });
    },
};