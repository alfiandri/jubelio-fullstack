export const SQL = {
    list: `SELECT t.*, i.item_name FROM transactions t
LEFT JOIN items i ON i.item_id=t.item_id
ORDER BY t.trx_id DESC LIMIT $1 OFFSET $2`,
    get: `SELECT t.*, i.item_name FROM transactions t LEFT JOIN items i ON i.item_id=t.item_id WHERE trx_id=$1`,
    insert: `INSERT INTO transactions(item_id,qty,amount) VALUES($1,$2,$3) RETURNING *`,
    update: `UPDATE transactions SET item_id=$1, qty=$2, amount=$3 WHERE trx_id=$4 RETURNING *`,
    delete: `DELETE FROM transactions WHERE trx_id=$1`,
    priceByItem: `SELECT price FROM items WHERE item_id=$1`,
    transactionsMonthly: `SELECT SUM(amount) AS total FROM transactions WHERE date_trunc('month', created_date) = date_trunc('month', NOW())`,
};