const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const db = new sqlite3.Database('./db/dua_main.sqlite');

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.get('/', (req, res) => {
    res.status(200).json({ msg: "working" });
})
app.get('/category', (req, res) => {
    const query = 'SELECT * FROM category';
    db.all(query, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(200).json(rows);
        }
    });
})
app.get('/sub-category', (req, res) => {
    const query = 'SELECT * FROM sub_category';
    db.all(query, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(200).json(rows);
        }
    });
})
app.get('/dua', (req, res) => {
    const catId = req.query.cat;
    if (!catId) {
        res.status(400).json({ msg: "provide category id" })
        return;
    }

    db.all('SELECT * FROM dua WHERE cat_id = ?', [catId], (err, rows) => {
        if (err) {
            console.error('Error retrieving subcategories:', err);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.json(rows); 
        }
    });
});
app.get('/dua-filter', (req, res) => {
    const catId = req.query.cat;
    const scatId = req.query.scat;    
    if (!catId || !scatId) {
        res.status(400).json({ msg: "provide category id and subcategory id" })
        return;
    }

    db.all('SELECT * FROM dua WHERE cat_id = ? AND subcat_id = ?', [catId, scatId], (err, rows) => {
        if (err) {
            console.error('Error retrieving subcategories:', err);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.json(rows); 
        }
    });
});

app.get('/subcategory', (req, res) => {
    const catId = req.query.cat;
    if (!catId) {
        res.status(400).json({ msg: "provide category id" })
        return;
    }

    db.all('SELECT * FROM sub_category WHERE cat_id = ?', [catId], (err, rows) => {
        if (err) {
            console.error('Error retrieving subcategories:', err);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.json(rows);
        }
    });

});


app.listen(4000, () => {
    console.log('running at port 4000')
})