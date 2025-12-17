export const notFound = (req, res, next) => {
  res.status(404);

  if (req.accepts("html")) {
    res.renderPage("notFound");
    return;
  }

  if (req.accepts("json")) {
    res.json({ error: "Not Found" });
    return;
  }

  res.type("text").send("Not Found");
};
