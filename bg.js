{
  let open = async (q, id, index) => {
    let props = {
      url: id
        ? (
          q = q.trim().replaceAll(" ", "+"),
          id == 1
          ? "https://www.jbis.or.jp/horse/result/?sid=horse&keyword=" + q
            : (q = q.normalize("NFD").replace(/[`\u0300-\u036f]/g, ""), id == 3)
              ? "https://sporthorse-data.com/search/pedigree?keys=" + q
              : (id = id == 2 ? "https://www.pedigreequery.com/" : "https://www.allbreedpedigree.com/") +
                ((await fetch(id + q + "2", { method: "HEAD" })).status == 200
                  ? "index.php?query_type=check&search_bar=horse&h=" + q + "&g=5&inbred=Standard"
                  : q.toLowerCase())
        )
        : (()=> {
            q = q.trim();
            let url = "https://db.netkeiba.com/?pid=horse_list&word=";
            for (let i = 0; i < q.length; ++i) {
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
              }
            return url;
          })()
    };
    chrome.tabs[index ? (props.index = index, "create") : "update"](props);
  }
  let searchFromContextMenus = async (info, tab) => navigator.onLine && open(
    info.selectionText,
    +info.menuItemId,
    tab.index + 1 || (await chrome.tabs.query({ active: !0, currentWindow: !0 }))[0].index + 1
  );
  let searchFromOmnibox = q => {
    if (navigator.onLine) {
      let id = 0;
      open(q.slice(0,
          q.slice(-7) == " - jbis"
        ? (id = 1, -7)
        : q.slice(-16) == " - pedigreequery"
        ? (id = 2, -16)
        : q.slice(-13) == " - sporthorse"
        ? (id = 3, -13)
        : q.slice(-14) == " - allpedigree"
        ? (id = 4, -14)
        : q.length),
        id
      )
    }
  }
  chrome.contextMenus.onClicked.addListener(searchFromContextMenus);
  chrome.omnibox.onInputEntered.addListener(searchFromOmnibox);
}
chrome.omnibox.onInputChanged.addListener((q, suggest) => (
  chrome.omnibox.setDefaultSuggestion({
    description: q + " - netkeiba",
  }),
  suggest([" - jbis", " - pedigreequery", " - sporthorse", " - allpedigree"].map(v => {
    let s = q + v;
    return { content: s, description: s };
  }))
));
chrome.runtime.onInstalled.addListener(() => {
  for (let i = 0; i < 5; ++i)
    chrome.contextMenus.create({
      id: i + "",
      title: ["%s - netkeiba", "%s - jbis", "%s - pedigreequery", "%s - sporthorse", "%s - allpedigree"][i],
      contexts: ["selection"]
    });
});