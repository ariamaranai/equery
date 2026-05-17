{
  let f = (_q, id, index) => {
    let q = _q.trim();
    let url = "https://db.netkeiba.com/?pid=horse_list&word=";
    if (id != 1) {
      q = q.replaceAll(" ", "+");
      if (id == 2)
        url = "https://www.jbis.or.jp/horse/result/?sid=horse&keyword=" + q
      else
        url = (
          id == 3 
            ? "https://sporthorse-data.com/search/pedigree?keys="
            : id != 5
              ? id
                ? "https://www.allbreedpedigree.com/index.php?query_type=check&search_bar=horse&g=5&inbred=Standard&h="
                : "https://www.pedigreequery.com/index.php?query_type=check&search_bar=horse&g=5&inbred=Standard&h="
              : "https://www.horsetelex.com/horses/search?name="
        ) + q.normalize("NFD").replace(/[^a-zA-Z+-]/g, "")
    } else {
      let i = 0;
      while (i < q.length) {
        let cc = q.charCodeAt(i);
        url +=
            cc == 32 ? "+"
          : cc < 123 ? String.fromCharCode(cc)
          : cc > 12448 && cc < 12535 ? "%a5%" + (cc - 12288).toString(16)
          : cc > 12352 && cc < 12436 ? "%a4%" + (cc - 12192).toString(16)
          : cc == 12540 ? "%a1%bc"
          : cc == 8545 ? "II" : "";
        ++i;
      }
    }
    return index ? chrome.tabs.create({ url, index }) : chrome.tabs.update({ url });
  }
  chrome.contextMenus.onClicked.addListener(async (info, tab) =>
    f(info.selectionText, +info.menuItemId, tab.index + 1 || (await chrome.tabs.query({ active: !0, currentWindow: !0 }))[0].id + 1)
  );
  chrome.omnibox.onInputEntered.addListener(q => {
    let match = q.match(/ - (netkeiba|jbis|sporthorse|allpedigree|horsetelex)$/);
    return f(match ? q.slice(0, match.index) : q, match && { netkeiba: 1, jbis: 2, sporthorse: 3, allpedigree: 4, horsetelex: 5 }[match[1]]);
  });
}
chrome.omnibox.onInputChanged.addListener((q, suggest) => {
  chrome.omnibox.setDefaultSuggestion({ description: q + " - pedigreequery" });
  let s;
  let ss = [" - netkeiba"," - jbis"," - sporthorse"," - allpedigree"," - horsetelex"];
  let i = 5;
  while (
    ss[--i] = { content: s = q + ss[i], description: s },
    i
  );
  return suggest(ss);
});
chrome.runtime.onInstalled.addListener(() => {
  let i = 6;
  while (
    chrome.contextMenus.create({
      title: ["%s - horsetelex","%s - allpedigree","%s - sporthorse","%s - jbis","%s - netkeiba","%s - pedigreequery"][--i],
      id: "543210"[i],
      contexts: ["selection"]
    }),
    i
  );
  return 0;
});