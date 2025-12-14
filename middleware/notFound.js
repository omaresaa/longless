export const notFound = (req, res, next) => {
  res.status(404);

  if (req.accepts("html")) {
    res.render("404", { title: "404 - Page Not Found" });
    return;
  }

  if (req.accepts("json")) {
    res.json({ error: "Not Found" });
    return;
  }

  res.type("text").send("Not Found");
};
