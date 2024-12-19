(chrome => {
  let open = async (id, q, index) => {
    let props = {
      url: id
        ? (
          q = q.trim().replaceAll(" ", "+"),
          id == 1
            ? "https://www.jbis.or.jp/horse/result/?sid=horse&keyword=" + q
            : (q = q.normalize("NFD").replace(/[\u0300-\u036f]/g, ""), id == 3)
            ? "https://sporthorse-data.com/search/pedigree?keys=" + q
            : (id =
                id == 2
                  ? "https://www.pedigreequery.com/"
                  : "https://www.allbreedpedigree.com/") +
              ((await fetch(id + q + "2", { method: "HEAD" })).status == 200
              ? "index.php?query_type=check&search_bar=horse&h=" + q + "&g=5&inbred=Standard"
              : q.toLowerCase())
        )
        : (()=> {
            q = q.trim();
            let url = "https://db.netkeiba.com/?pid=horse_list&word=";
            for (let i = 0; i < q.length; ++i) {
              let c = q[i];
              let charCode = q.charCodeAt(i);
              url +=
                charCode == 32
                  ? "+"
                  : charCode < 123
                  ? c
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
    chrome.tabs[index
      ? (props.index = index, "create")
      : "update"
    ](props);
  }
  let searchFromContextMenus = (info, tab) => open(
    +info.menuItemId, info.selectionText, tab.index + 1
  );
  let searchFromOmnibox = async q => {
    let id = 0;
    if (q.slice(-7) == " - jbis") {
      q = q.slice(0, -7);
      id = 1;
    } else if (q.slice(-16) == " - pedigreequery") {
      q = q.slice(0, -16);
      id = 2;
    } else if (q.slice(-13) == " - sporthorse") {
      q = q.slice(0, -13);
      id = 3;
    } else if (q.slice(-14) == " - allpedigree") {
      q = q.slice(0, -14);
      id = 4;
    }
    open(id, q);
  };
  chrome.contextMenus.onClicked.addListener(searchFromContextMenus);
  chrome.omnibox.onInputEntered.addListener(searchFromOmnibox);
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
        title: ["netkeiba", "jbis", "pedigreequery", "sporthorse", "allpedigree"][i],
        contexts: ["selection"]
      });
  });
})(chrome);