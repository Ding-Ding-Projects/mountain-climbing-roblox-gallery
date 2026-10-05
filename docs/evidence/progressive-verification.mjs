export async function verifyProgressively(items, verify, { onVerifiedBatch, onProgress, concurrency = 6, batchDelay = 100 } = {}) {
  if (!Array.isArray(items) || typeof verify !== 'function' || typeof onVerifiedBatch !== 'function' || typeof onProgress !== 'function' || !Number.isInteger(concurrency) || concurrency < 1 || concurrency > 6 || !Number.isInteger(batchDelay) || batchDelay < 0 || batchDelay > 1000) throw new Error('Invalid bounded verification configuration.');
  for (const item of items) item._verified = false;
  let cursor = 0, checked = 0, verified = 0, first = true, timer = null;
  let pending = [];
  const progress = () => ({ checked, verified, total: items.length, failed: checked - verified, complete: checked === items.length });
  function flush() {
    if (timer !== null) { clearTimeout(timer); timer = null; }
    if (!pending.length) return;
    const batch = pending; pending = [];
    onVerifiedBatch(batch, progress());
  }
  onProgress(progress());
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (cursor < items.length) {
      const item = items[cursor++];
      let accepted = false;
      try { accepted = await verify(item) === true; } catch { accepted = false; }
      item._verified = accepted; checked++;
      if (accepted) {
        verified++; pending.push(item);
        if (first) { first = false; flush(); }
        else if (pending.length >= 24) flush();
        else if (timer === null) timer = setTimeout(flush, batchDelay);
      }
      onProgress(progress());
    }
  }));
  flush();
  return progress();
}
