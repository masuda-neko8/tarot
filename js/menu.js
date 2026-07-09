// ページ読み込み完了後にメニューを構築する
document.addEventListener('DOMContentLoaded', loadMenu);

/**
 * contents/menu.csv を読み込み、上下のメニューバーに反映する
 */
async function loadMenu() {
  const topEl = document.getElementById('menu-top');
  const bottomEl = document.getElementById('menu-bottom');

  try {
    const response = await fetch('contents/menu.csv');

    if (!response.ok) {
      throw new Error('menu.csvの読み込みに失敗しました');
    }

    const csvText = await response.text();
    const items = parseMenuCsv(csvText);
    const menuHtml = buildMenuHtml(items);

    if (topEl) topEl.innerHTML = menuHtml;
    if (bottomEl) bottomEl.innerHTML = menuHtml;

  } catch (err) {
    console.error('メニュー読み込みエラー:', err);
    const errorHtml = '<span class="menu-error">メニューを読み込めませんでした</span>';
    if (topEl) topEl.innerHTML = errorHtml;
    if (bottomEl) bottomEl.innerHTML = errorHtml;
  }
}

/**
 * CSVテキストを { label, href } の配列に変換する
 * 例: "Home,index.html" -> { label: "Home", href: "index.html" }
 */
function parseMenuCsv(csvText) {
  return csvText
    .trim()
    .split(/\r?\n/)
    .filter(line => line.trim() !== '')
    .map(line => {
      const [label, href] = line.split(',');
      return {
        label: label.trim(),
        href: href.trim()
      };
    });
}

/**
 * メニュー項目配列から、横一列のメニューHTMLを生成する。
 * 現在表示中のページと一致する項目は、リンクではなく
 * 「押せないボタン（色を変えたspan）」として表示する。
 */
function buildMenuHtml(items) {
  // 現在のページファイル名を取得（例: ".../guide.html" -> "guide.html"）
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  return items.map(item => {
    if (item.href === currentPage) {
      // 自分自身のページ：押せないボタンとして表示
      return `<span class="menu-item menu-current">${item.label}</span>`;
    } else {
      // 他のページ：通常のリンクとして表示
      return `<a class="menu-item" href="${item.href}">${item.label}</a>`;
    }
  }).join('');
}
