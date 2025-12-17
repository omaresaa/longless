export const notFound = (req, res, next) => {
  // Set the response status to 404 Not Found
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
