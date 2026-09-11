onunhandledrejection = e => e.preventDefault();

chrome.omnibox.onInputChanged.addListener((q, suggest, $0) => {
  chrome.omnibox.setDefaultSuggestion({ description: q + " - pedigreequery" });
  let hosts = [" - netkeiba"," - jbis"," - studbook"," - sporthorse"," - allpedigree"," - horsetelex"];
  let i = 6;
  while (
    hosts[--i] = { content: $0 = q + hosts[i], description: $0 },
    i
  );
  return suggest(hosts);
});
chrome.runtime.onInstalled.addListener(() => {
  let i = 7;
  while (
    chrome.contextMenus.create({
      title: ["%s - horsetelex","%s - allpedigree","%s - sporthorse","%s - studbook","%s - jbis","%s - netkeiba","%s - pedigreequery"][--i],
      id: "6543210"[i],
      contexts: ["selection"]
    }),
    i
  );
  return;
});

{
  let f = (_q, id, index, url) => {
    let q = _q.trim();
    if (id == 1) {
      url = "https://db.netkeiba.com/horse/list.html?word=";
      let i = 0;
      while (i < q.length) {
        let c = q[i];
        url +=
            c == " " ? "+"
          : c < "{" ? c
          : c == "ー" ? "%a1%bc"
          : c == "Ⅱ" ? "II"
          : (c = c.charCodeAt()) > 12448 && c < 12535 ? "%a5%" + (c - 12288).toString(16)
          : c > 12352 && cc < 12436 ? "%a4%" + (cc - 12192).toString(16)
          : "";
        ++i;
      }
    } else {
      q = q.replaceAll(" ", "+");
      if (id == 2)
        url = "https://www.jbis.or.jp/horse/result/?sid=horse&keyword=" + q;
      else if (id == 3)
        url = "https://www.studbook.jp/users/ja/SearchBameiList?initial_forward=" + q.replace(/（.*/, "");
      else
        url = (
          id == 4 ? "https://sporthorse-data.com/search/pedigree?keys=" :
          id == 6 ? "https://www.horsetelex.com/horses/search?name=" :
          id == 0 ? "https://www.pedigreequery.com/index.php?query_type=check&search_bar=horse&g=5&inbred=Standard&h=" :
                    "https://www.allbreedpedigree.com/index.php?query_type=check&search_bar=horse&g=5&inbred=Standard&h="
        ) + q.normalize("NFD").replace(/[^a-zA-Z+-]/g, "");
    }
    return index ? chrome.tabs.create({ url, index }) : chrome.tabs.update({ url });
  }

  chrome.contextMenus.onClicked.addListener(({ menuItemId, selectionText }, { index }) =>
    ++index
      ? chrome.tabs.query({ active: !0, currentWindow: !0 }, tabs => f(selectionText, menuItemId, tabs[0].id))
      : f(selectionText, menuItemId, index)
  );

  chrome.omnibox.onInputEntered.addListener(q => {
    let index = q.indexOf(" - ");
    return index < 0
      ? f(q, 0)
      : f(
          q.slice(0, index),
          (q = q[index + 4]) == "e" ? 1 :
                           q == "b" ? 2 :
                           q == "t" ? 3 :
                           q == "p" ? 4 :
                           q == "l" ? 5 :
                           q == "o" ? 6 : 0
        );
  });
}
