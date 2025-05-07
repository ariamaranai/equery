{
  let f = async (_q, id, index) => {
    let q = _q.trim();
    let url = id != 1
      ? (q = q.replaceAll(" ", "+"), id == 2)
        ? "https://www.jbis.or.jp/horse/result/?sid=horse&keyword=" + q
        : (q = q.normalize("NFD").replace(/[^a-zA-Z+-]/g, ""), id == 3)
          ? "https://sporthorse-data.com/search/pedigree?keys=" + q
          : id != 5
            ? (id = id ? "https://www.allbreedpedigree.com/" : "https://www.pedigreequery.com/") +
              ((await fetch(id + q + "2", { method: "HEAD" })).ok
                ? "index.php?query_type=check&search_bar=horse&h=" + q + "&g=5&inbred=Standard"
                : q.toLowerCase())
            : "https://www.horsetelex.com/horses/search?name=" + q
      : (()=> {
          let url = "https://db.netkeiba.com/?pid=horse_list&word=";
          let i = 0;
          while (i < q.length) {
            let charCode = q.charCodeAt(i);
            url +=
              charCode == 32
              ? "+"
              : charCode < 123
              ? q[i]
              : charCode > 12448 && charCode < 12535
              ? "%a5%" + (charCode - 12288).toString(16)
              : charCode > 12352 && charCode < 12436
              ? "%a4%" + (charCode - 12192).toString(16)
              : charCode == 12540
              ? "%a1%bc"
              : charCode == 8545
              ? "II"
              : "";
            ++i;
          }
          return url;
      })();
    index
      ? chrome.tabs.create({ url, index })
      : chrome.tabs.update({ url });
  }
  chrome.contextMenus.onClicked.addListener((info, tab) =>
    navigator.onLine && f(
      info.selectionText,
      +info.menuItemId,
      tab.index + 1
    )
  );
  chrome.omnibox.onInputEntered.addListener(q => {
    if (navigator.onLine) {
      let id = 0;
      f(
        q.slice(0,
            q.slice(-11) == " - netkeiba"
          ? (id = 1, -11)
          : q.slice(-7) == " - jbis"
          ? (id = 2, -7)
          : q.slice(-13) == " - sporthorse"
          ? (id = 3, -13)
          : q.slice(-14) == " - allpedigree"
          ? (id = 4, -14)
          : q.slice(-13) == " - horsetelex"
          ? (id = 5, -13)
          : q.length
        ),
        id
      )
    }
  });
}
chrome.omnibox.onInputChanged.addListener((q, suggest) => {
  chrome.omnibox.setDefaultSuggestion({
    description: q + " - pedigreequery"
  });
  let ss = [
    " - netkeiba",
    " - jbis",
    " - sporthorse",
    " - allpedigree",
    " - horsetelex"
  ];
  let i = 0;
  while (i < 5) {
    let s = q + ss[i];
    ss[i] = { content: s, description: s }; 
    ++i
  }
  suggest(ss);
});
chrome.runtime.onInstalled.addListener(() => {
  let i = 0;
  while (
    chrome.contextMenus.create({
      title: [
        "%s - pedigreequery",
        "%s - netkeiba",
        "%s - jbis",
        "%s - sporthorse",
        "%s - allpedigree",
        "%s - horsetelex"
      ][i],
      id: i + "",
      contexts: ["selection"]
    }),
    ++i < 6
  );
});