const CHANNEL = 'mia-preview-refresh';

export function broadcastPreviewRefresh() {
  try {
    const ch = new BroadcastChannel(CHANNEL);
    ch.postMessage('refresh');
    ch.close();
  } catch {
    // BroadcastChannel desteklenmiyor (eski tarayıcı) — sessizce geç
  }
}

export function listenPreviewRefresh(onRefresh: () => void): () => void {
  try {
    const ch = new BroadcastChannel(CHANNEL);
    ch.onmessage = () => onRefresh();
    return () => ch.close();
  } catch {
    return () => {};
  }
}
