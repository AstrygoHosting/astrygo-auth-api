app.get("/usage", (_req, res) => {
  // simple demo values; wire these to real metrics later
  res.json({
    cpu: 22,
    bandwidthMB: 512,
    ts: Date.now(),
  });
});
