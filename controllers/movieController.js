const connection = require("../data/db.js")
const localPath = "http://127.0.0.1:3000";

//index
function index(req, res) {

    const sql = 'SELECT * FROM movies';

    connection.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: 'Database query failed' });
        res.json(results.map((movie) => {
            const imgPath = movie.image
            return {
                ...movie, image: `${localPath}/${imgPath}`
            }
        }));
    })
}

//show
function show(req, res) {
    const { id } = req.params;


    const movieSql = 'SELECT * FROM movies WHERE id = ?';

    const reviewSql = `
        SELECT *
        FROM reviews
        WHERE movie_id = ?
    `;

    connection.query(movieSql, [id], (err, movieResults) => {
        if (err) {
            return res.status(500).json({ error: 'Database query failed' });
        }

        if (movieResults.length === 0) {
            return res.status(404).json({ error: 'Movie not found' });
        }

        const imgPath = movieResults[0].image
        const movie = {
            ...movieResults[0], image: `${localPath}/${imgPath}`

        };

        connection.query(reviewSql, [id], (err, reviewResults) => {
            if (err) {
                return res.status(500).json({ error: 'Database query failed' });
            }

            // recensioni
            res.json({ movie, reviews: reviewResults });
        });
    });
}

// creazione recensione 

function createReview(req, res) {
    const { name, text, vote } = req.body;
    const { id } = req.params;


    if (!name || !text || !vote || !id) {
        return res.status(400).json({ error });
    }

    const sql = 'INSERT INTO reviews (name, text, vote, movie_id) VALUES (?, ?, ?, ?)';

    connection.query(sql, [name, text, parseInt(vote), id], (err, result) => {
        if (err) {
            console.error("Errore nell'inserimento della recensione:", err);
            return res.status(500).json({ error: 'Impossibile aggiungere la recensione al db' });
        }

        const selectSql = 'SELECT * FROM reviews WHERE id = ?';
        connection.query(selectSql, [result.insertId], (selectErr, newReviewResults) => {
            if (selectErr) {
                return res.status(201).json({ message: 'Recensione aggiunta ', reviewId: result.insertId });
            }

            res.status(201).json({ message: 'Recensione aggiunta ', review: newReviewResults[0] });
        });
    });
}
module.exports = {
    index,
    show,
    createReview
};