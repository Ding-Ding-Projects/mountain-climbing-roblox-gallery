const keys = ['schemaVersion','recordType','captureClass','captureId','imageSha256','imageBytes','sourceRevision','sourceScope','state','title','caption','alt','location','activity','stage','evidenceSubject','viewport','scale','theme','method','captureMode','capturedAt','receiptValidated','reviewRecordValidated','limitations','privacyReview','rightsReview','metadataReview'];
const plain = x => x !== null && typeof x === 'object' && Object.getPrototypeOf(x) === Object.prototype;
const text = (x, max = 1000) => typeof x === 'string' && x.trim().length > 0 && x.length <= max;
const closed = (x, list) => plain(x) && Object.keys(x).length === list.length && Object.keys(x).every(k => list.includes(k));
export function acceptedObservation(record) {
  if (!closed(record, keys) || record.schemaVersion !== 1 || record.recordType !== 'observation-review-record' || record.captureClass !== 'historical-observation') return false;
  if (!/^[a-z0-9][a-z0-9_-]{2,63}$/i.test(record.captureId || '') || !/^[a-f0-9]{64}$/i.test(record.imageSha256 || '') || !Number.isSafeInteger(record.imageBytes) || record.imageBytes < 1 || record.imageBytes > 25 * 1024 * 1024) return false;
  if (record.sourceRevision !== null && !/^[a-f0-9]{40,64}$/i.test(record.sourceRevision || '')) return false;
  if (!['sourceScope','state','title','caption','alt','location','activity','stage','method'].every(k => text(record[k]))) return false;
  if (!['Roblox scene','Project interface'].includes(record.evidenceSubject) || !['Edit','Play','Unknown'].includes(record.captureMode)) return false;
  if (record.evidenceSubject === 'Project interface' && record.captureMode !== 'Unknown') return false;
  if (!closed(record.viewport, ['width','height']) || !['width','height'].every(k => Number.isSafeInteger(record.viewport[k]) && record.viewport[k] > 0 && record.viewport[k] <= 20000)) return false;
  if (record.scale !== null || record.theme !== 'not-applicable' || record.capturedAt !== null || record.receiptValidated !== false || record.reviewRecordValidated !== true) return false;
  if (!Array.isArray(record.limitations) || record.limitations.length < 3 || record.limitations.length > 12 || !record.limitations.every(x => text(x,512)) || !record.limitations.some(x => /not.*acceptance evidence/i.test(x)) || !record.limitations.some(x => /capture time.*unavailable/i.test(x)) || !record.limitations.some(x => /source revision.*unavailable/i.test(x) || /source revision.*scope/i.test(x))) return false;
  if (!closed(record.privacyReview, ['result','pixelsReviewed','metadataReviewed','filenameReviewed','originalInspected','reviewer']) || record.privacyReview.result !== 'passed' || !['pixelsReviewed','metadataReviewed','filenameReviewed','originalInspected'].every(k => record.privacyReview[k] === true) || !text(record.privacyReview.reviewer,120)) return false;
  if (!closed(record.rightsReview, ['result','basis']) || record.rightsReview.result !== 'passed' || !text(record.rightsReview.basis)) return false;
  if (!closed(record.metadataReview, ['result','summary']) || record.metadataReview.result !== 'passed' || !text(record.metadataReview.summary)) return false;
  return true;
}

export function acceptedObservationItem(item) {
  if (item?.captureClass !== 'historical-observation' || item.receiptValidated !== false || item.reviewRecordValidated !== true || item.privacyReview !== 'passed' || !acceptedObservation(item.observationReview) || item.sha256 !== item.observationReview.imageSha256 || item.sourcePath !== null || item.captureContext !== null) return false;
  const record = item.observationReview;
  const mirrored = ['captureClass','captureId','sourceRevision','sourceScope','state','title','caption','alt','location','activity','stage','evidenceSubject','scale','theme','method','captureMode','capturedAt','receiptValidated','reviewRecordValidated','viewport','limitations','rightsReview','metadataReview'];
  return mirrored.every(key => JSON.stringify(item[key]) === JSON.stringify(record[key])) && item.privacyReviewer === record.privacyReview.reviewer;
}
