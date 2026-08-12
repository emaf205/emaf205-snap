'use strict';

const messageEl = document.getElementById('message');
const SUCCESS_MS = 650;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function setBadge(text, backgroundColor) {
  try {
    await chrome.action.setBadgeBackgroundColor({ color: backgroundColor });
    await chrome.action.setBadgeText({ text });
  } catch (error) {
    console.warn('EMAF205 SNAP badge:', error);
  }
}

async function clearBadge() {
  try {
    await chrome.action.setBadgeText({ text: '' });
  } catch (error) {
    console.warn('EMAF205 SNAP badge clear:', error);
  }
}

function showSuccess() {
  document.body.className = 'status success';
  messageEl.innerHTML = '<span class="mark" aria-hidden="true">✓</span><span>COPIED</span>';
}

function showError(error) {
  const text = error instanceof Error ? error.message : String(error);
  console.error('EMAF205 SNAP:', error);
  document.body.className = 'status error';
  messageEl.textContent = `Screenshot not copied: ${text}`;
}

async function waitForPopupFocus(timeoutMs = 1000) {
  if (document.hasFocus()) return;

  window.focus();
  document.body.focus({ preventScroll: true });

  const start = performance.now();
  while (!document.hasFocus() && performance.now() - start < timeoutMs) {
    await sleep(25);
  }

  if (!document.hasFocus()) {
    throw new Error('Chrome did not give the extension popup focus. Try again.');
  }
}

async function dataUrlToPngBlob(dataUrl) {
  if (typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image/png;base64,')) {
    throw new Error('Chrome returned an invalid screenshot.');
  }

  const response = await fetch(dataUrl);
  if (!response.ok) {
    throw new Error('Could not decode the screenshot.');
  }

  const blob = await response.blob();
  if (blob.type !== 'image/png' || blob.size === 0) {
    throw new Error('The captured image is not a valid PNG.');
  }

  return blob;
}

async function copyPngToClipboard(blob) {
  if (!navigator.clipboard || typeof navigator.clipboard.write !== 'function') {
    throw new Error('Clipboard image writing is not available in this Chrome version.');
  }
  if (typeof ClipboardItem === 'undefined') {
    throw new Error('ClipboardItem is not available in this Chrome version.');
  }
  if (typeof ClipboardItem.supports === 'function' && !ClipboardItem.supports('image/png')) {
    throw new Error('This Chrome build does not support PNG clipboard items.');
  }

  await waitForPopupFocus();
  await navigator.clipboard.write([
    new ClipboardItem({ 'image/png': blob })
  ]);
}

async function captureAndCopy() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab || !Number.isInteger(tab.windowId)) {
    throw new Error('No active Chrome tab was found.');
  }

  const dataUrl = await chrome.tabs.captureVisibleTab(tab.windowId, { format: 'png' });
  const pngBlob = await dataUrlToPngBlob(dataUrl);
  await copyPngToClipboard(pngBlob);
}

(async () => {
  try {
    await clearBadge();
    await captureAndCopy();
    showSuccess();
    await setBadge('✓', '#178a45');
    await sleep(SUCCESS_MS);
    await clearBadge();
    window.close();
  } catch (error) {
    await setBadge('!', '#b42318');
    showError(error);
  }
})();
