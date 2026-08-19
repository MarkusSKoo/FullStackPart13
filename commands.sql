CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author TEXT,
    url TEXT NOT NULL,
    title TEXT NOT NULL,
    likes INTEGER DEFAULT 0
);

INSERT INTO blogs (author, url, title, likes) values (
    'Matti luukkainen',
    'www.fullstackopen.fi',
    'Full Stack development',
    0
);

INSERT INTO blogs (author, url, title, likes) values (
    'Matti luukkainen',
    'www.debugging.org',
    'Debugging your full stack application',
    0
);