const express = require("express");

const STATUS_USER_ERROR = 422;

// This array of posts persists in memory across requests. Feel free
// to change this to a let binding if you need to reassign it.
const posts = [];
//let posts = [];

const server = express();
// to enable parsing of json bodies for post requests
server.use(express.json());

function idUnico() {
  // function closure
  let id = 0;
  return function () {
    id = id + 1;
    return id;
  };
}

const newId = idUnico(); // instancio la closure

// TODO: your code to handle requests

/**
 * `POST /posts`
 */
server.post("/posts", (req, res) => {
  const { author, title, contents } = req.body;
  if (!author || !title || !contents) {
    return res.status(STATUS_USER_ERROR).json({
      error: "No se recibieron los parámetros necesarios para crear el Post",
    });
  } else {
    const libro = {
      id: newId(),
      author,
      title,
      contents,
    };
    posts.push(libro);
    return res.json(libro);
  }
});

/**
 * POST /posts/author/:author`
 */
server.post("/posts/author/:author", (req, res) => {
  const { title, contents } = req.body;
  const author = req.params.author;
  if (!author || !title || !contents) {
    return res.status(STATUS_USER_ERROR).json({
      error: "No se recibieron los parámetros necesarios para crear el Post",
    });
  } else {
    const obj = {
      id: newId(),
      author,
      title,
      contents,
    };
    posts.push(obj);
    return res.json(obj);
  }
});

/**
 * GET /posts` //pendiente despues de perder 1hora
 */
server.get("/posts", (req, res) => {
  const term = req.query.term;
  if (term) {
    const result = posts.filter(
      (post) => post.title.includes(term) || post.contents.includes(term)
    );
    return res.json(result);
  } else {
    return res.json(posts);
  }
});
/**
 * GET /posts/:author
 */
server.get("/posts/:author", (req, res) => {
  const result = posts.filter((post) => post.author === req.params.author);
  if (result.length === 0) {
    return res
      .status(STATUS_USER_ERROR)
      .json({ error: "No existe ningun post del autor indicado" });
  } else {
    return res.json(result);
  }
});

/**
 * GET /posts/:author/:title
 */
server.get("/posts/:author/:title", (req, res) => {
  const result = posts.filter(
    (post) =>
      post.author === req.params.author && post.title === req.params.title
  );

  if (result.length === 0) {
    return res.status(STATUS_USER_ERROR).json({
      error: "No existe ningun post con dicho titulo y autor indicado",
    });
  } else {
    return res.json(result);
  }
});

/**
 * PUT /posts
 */
server.put("/posts", (req, res) => {
  const { id, title, contents } = req.body;
  if (id && title && contents) {
    let encontrado = posts.filter((post) => {
      if (post.id === id) {
        return post;
      }
    });
    if (encontrado.length > 0) {
      posts.map((item) => {
        if (item.id === id) {
          item.title = title;
          item.contents = contents;
          return res.json(item);
        }
      });
    } else {
      return res.status(STATUS_USER_ERROR).json({
        error: "No se encontro el post",
      });
    }
  } else {
    return res.status(STATUS_USER_ERROR).json({
      error:
        "No se recibieron los parámetros necesarios para modificar el Post",
    });
  }
});

/**
 * DELETE /posts
 */
server.delete("/posts", (req, res) => {
  const { id } = req.body;
  if (id) {
    if (posts.find((post) => post.id === id)) {
      posts.splice(
        posts.findIndex((post) => post.id === id),
        1
      );
      return res.json({ success: true });
    } else {
      return res.status(STATUS_USER_ERROR).json({ error: "Mensaje de error" });
    }
  } else {
    return res.status(STATUS_USER_ERROR).json({ error: "Mensaje de error" });
  }
});

/**return res.json(posts.filter((post) => post.author !== author));
 * DELETE /autor
 */
server.delete("/author", (req, res) => {
  const { author } = req.body;
  if (author) {
    if (posts.find((post) => post.author === author)) {
      const aux = posts.filter((post) => post.author === author);

      aux.map((item) => {
        let indice = posts.indexOf(item);
        posts.splice(indice, 1);
      });

      return res.json(aux);
    } else {
      return res
        .status(STATUS_USER_ERROR)
        .json({ error: "No existe el autor indicado" });
    }
  } else {
    return res.status(STATUS_USER_ERROR).json({ error: "Mensaje de error" });
  }
});

module.exports = { posts, server };
