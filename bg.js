{
  let open = async (_q, id, index) => {
    let q = _q.trim();
    let url = id != 1
      ? (q = q.replaceAll(" ", "+"), id == 2)
        ? "https://www.jbis.or.jp/horse/result/?sid=horse&keyword=" + q
        : (q = q.normalize("NFD").replace(/[^a-zA-Z+-]/g, ""), id == 3)
          ? "https://sporthorse-data.com/search/pedigree?keys=" + q
          : (id = id ? "https://www.allbreedpedigree.com/" : "https://www.pedigreequery.com/" ) +
            ((await fetch(id + q + "2", { method: "HEAD" })).status == 200
              ? "index.php?query_type=check&search_bar=horse&h=" + q + "&g=5&inbred=Standard"
              : q.toLowerCase())
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
    index ? chrome.tabs.create({ url, index }) : chrome.tabs.update({ url });
  }
  let searchFromContextMenus = async (info, tab) => navigator.onLine && open(
    info.selectionText,
    +info.menuItemId,
    tab.index + 1 || (await chrome.tabs.query({ active: !0, currentWindow: !0 }))[0].index + 1
  );
  let searchFromOmnibox = q => {
    if (navigator.onLine) {
      let id = 0;
      open(
        q.slice(0,
            q.slice(-11) == " - netkeiba"
          ? (id = 1, -11)
          : q.slice(-7) == " - jbis"
          ? (id = 2, -7)
          : q.slice(-13) == " - sporthorse"
          ? (id = 3, -13)
          : q.slice(-14) == " - allpedigree"
          ? (id = 4, -14)
          : q.length
        ),
        id
      )
    }
  }
  chrome.contextMenus.onClicked.addListener(searchFromContextMenus);
  chrome.omnibox.onInputEntered.addListener(searchFromOmnibox);
}
chrome.omnibox.onInputChanged.addListener((q, suggest) => (
  chrome.omnibox.setDefaultSuggestion({
    description: q + " - pedigreequery"
  }),
  suggest([" - netkeiba", " - jbis", " - sporthorse", " - allpedigree"].reduce((acc, val, idx) => {
    let s = q + val;
    acc[idx] = { content: s, description: s };
    return acc;
  }, [0, 0, 0, 0]))
));
chrome.runtime.onInstalled.addListener(() => {
  let i = 0;
  while(i < 5)
    chrome.contextMenus.create({
      title: ["%s - pedigreequery", "%s - netkeiba", "%s - jbis", "%s - sporthorse", "%s - allpedigree"][i],
      id: i++ + "",
      contexts: ["selection"]
    });
});