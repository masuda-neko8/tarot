// content表示エリアの取得
const contentEl = document.getElementById('content');

/**
 * 現在のHTMLファイル名（拡張子なし）を取得する関数
 */
function getBaseFileName() {
  const path = window.location.pathname;
  const fileName = path.split('/').pop();
  
  if (!fileName) {
    return 'index'; // 末尾が "/" の場合は "index"
  }
  
  const baseName = fileName.replace(/\.html?$/i, '');
  return baseName || 'index';
}

/**
 * 画像を自動的に設定する関数
 */
function loadTopImage() {
  const baseName = getBaseFileName(); // 例: "index" や "AAA"
  const imageEl = document.getElementById('top-image');

  if (imageEl) {
    // 画像のパスを組み立てる（例: "images/index.jpg"）
    imageEl.src = `images/${baseName}.jpg`;
    
    // パスが設定されたら画像を表示する
    imageEl.style.display = 'block'; 
  }
}

/**
 * Markdownファイルを読み込み、HTMLに整形して表示する
 */
async function loadMarkdown() {
  const baseName = getBaseFileName();
  const mdPath = `contents/${baseName}.md`;

  try {
    const response = await fetch(mdPath);
    if (!response.ok) {
      showError(`「${baseName}.md」が見つかりません。`);
      return;
    }
    const markdownText = await response.text();
    const html = marked.parse(markdownText);
    contentEl.innerHTML = html;
  } catch (err) {
    showError(`「${baseName}.md」が見つかりません。`);
    console.error('Markdown読み込みエラー:', err);
  }
}

function showError(message) {
  contentEl.innerHTML = `<p class="error">${message}</p>`;
}

// ページ読み込み完了後に実行
loadMarkdown();
loadTopImage(); // ★追加：画像読み込み関数を実行
