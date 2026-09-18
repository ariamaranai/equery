onunhandledrejection = e => e.preventDefault();

chrome.omnibox.onInputChanged.addListener((q, suggest, $0) => {
  chrome.omnibox.setDefaultSuggestion({ description: q + " - pedigreequery" });
  let hosts = [
    " - equibase",
    " - netkeiba",
    " - jbis",
    " - studbook",
    " - sporthorse",
    " - allpedigree",
    " - horsetelex"
  ];
  let i = 7;
  while (
    hosts[--i] = { content: $0 = q + hosts[i], description: $0 },
    i
  );
  return suggest(hosts);
});
chrome.runtime.onInstalled.addListener(() => {
  let i = 8;
  while (
    chrome.contextMenus.create({
      title: [
        "%s - horsetelex",
        "%s - allpedigree",
        "%s - sporthorse",
        "%s - studbook",
        "%s - jbis",
        "%s - netkeiba",
        "%s - equibase",
        "%s - pedigreequery"
      ][--i],
      id: "76543210"[i],
      contexts: ["selection"]
    }),
    i
  );
  return;
});

{
  let f = (_q, id, index, url) => {
    let q = _q.trim();
    if (id == 2 || id !== 3 && q[0] > "぀") {
      url = "https://db.netkeiba.com/horse/list.html?word=";
      let i = 0;
      while (i < q.length) {
        let c = q[i];
        url +=
            c === " " ? "+"
          : c < "{" ? c
          : c === "ー" ? "%a1%bc"
          : c === "Ⅱ" ? "II"
          : (c = c.charCodeAt()) > 12448 && c < 12535 ? "%a5%" + (c - 12288).toString(16)
          : c > 12352 && cc < 12436 ? "%a4%" + (cc - 12192).toString(16)
          : "";
        ++i;
      }
    } else {
      q = q.replaceAll(" ", "+");
      url =
        id == 3 ? "https://www.jbis.or.jp/horse/result/?sid=horse&keyword=" + q :
        id == 4 ? "https://www.studbook.jp/users/ja/SearchBameiList?initial_forward=" + q.replace(/（.*/, "") :
        (
          id == 1 ? "https://www.equibase.com/favicon.ico#" :
          id == 5 ? "https://sporthorse-data.com/search/pedigree?keys=" :
          id == 7 ? "https://www.horsetelex.com/horses/search?name=" :
          id == 0 ? "https://www.pedigreequery.com/index.php?query_type=check&search_bar=horse&g=5&inbred=Standard&h=" :
                    "https://www.allbreedpedigree.com/index.php?query_type=check&search_bar=horse&g=5&inbred=Standard&h="
        ) + q.normalize("NFD").replace(/[^a-zA-Z+-]/g, "");
    }
    return index ? chrome.tabs.create({ url, index }) : chrome.tabs.update({ url });
  }

  chrome.contextMenus.onClicked.addListener(({ menuItemId, selectionText }, { index }) =>
    ++index
      ? f(selectionText, menuItemId, index)
      : chrome.tabs.query({ active: !0, currentWindow: !0 }, tabs => f(selectionText, menuItemId, tabs[0].id))
  );

  chrome.omnibox.onInputEntered.addListener(q => {
    let index = q.indexOf(" - ");
    return index < 0
      ? f(q, 0)
      : f(
          q.slice(0, index),
          (q = q[index + 4]) === "q" ? 1 :
                           q === "e" ? 2 :
                           q === "b" ? 3 :
                           q === "t" ? 4 :
                           q === "p" ? 5 :
                           q === "l" ? 6 :
                           q === "o" ? 7 : 0
        );
  });
}
