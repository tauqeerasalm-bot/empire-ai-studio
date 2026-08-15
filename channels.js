// =============================================
// CHANNELS (info only — automation coming soon)
// =============================================
function saveChannel(platform) {
  const input = document.getElementById(`${platform}Channel`);
  const msg = document.getElementById(`${platform}ChannelMsg`);
  const value = input.value.trim();
  if (!value) { msg.textContent = '⚠️ Enter a channel name or link!'; return; }
  try {
    localStorage.setItem(`channel_${platform}`, value);
    msg.textContent = '✅ Saved!';
  } catch (e) {
    msg.textContent = '❌ Failed to save.';
  }
}

function loadChannels() {
  ['yt', 'tt', 'fb', 'ig'].forEach(platform => {
    const saved = localStorage.getItem(`channel_${platform}`);
    const input = document.getElementById(`${platform}Channel`);
    if (saved && input) input.value = saved;
  });
}

document.addEventListener('DOMContentLoaded', loadChannels);
                                   
