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

module.exports = {
    index,
    show
};