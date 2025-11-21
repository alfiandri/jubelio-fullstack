export const SQL = {
    list: 'SELECT * FROM items ORDER BY item_id DESC LIMIT $1 OFFSET $2',
    countAll: 'SELECT count(*) as count FROM items',
    get: 'SELECT * FROM items WHERE item_id=$1',
    create: `INSERT INTO items(item_code,item_name,price,description,image) VALUES($1,$2,$3,$4,$5) RETURNING *`,
    update: `UPDATE items SET item_code=$1,item_name=$2,price=$3,description=$4,image=$5 WHERE item_id=$6 RETURNING *`,
    delete: 'DELETE FROM items WHERE item_id=$1',
    findByCode: 'SELECT * FROM items WHERE item_code=$1'
};