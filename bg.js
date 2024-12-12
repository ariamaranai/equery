(chrome => {
  let generateUrl = (id, q) => {
    if (id == 1) {
      return "https://www.jbis.or.jp/horse/result/?sid=horse&keyword=" + q;
    } else if (id == 3) {
      return "https://sporthorse-data.com/search/pedigree?keys=" + q;
    } else {
      let host =
        id == 2
          ? "https://www.allbreedpedigree.com/"
          : "https://www.pedigreequery.com/";
      return fetch(host + q + "2", { method: "HEAD" }).then(
        (r) =>
          host +
          (r.status == 200
            ? "index.php?query_type=check&search_bar=horse&h=" + q + "&g=5&inbred=Standard"
            : q)
      );
    }
  };
  let generateUrlForNetkeiba = q => {
    let _q = q.trim();
    let url = "https://db.netkeiba.com/?pid=horse_list&word=";
    for (let i = 0; i < _q.length; ++i) {
      let c = _q[i];
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
  };
  let open = (id, q, create_update) => chrome.tabs[create_update]({
    url: id
      ? generateUrl(id, q.trim().replaceAll(" ", "+"))
      : generateUrlForNetkeiba(q)
  });
  let searchFromContextMenus = info => open(
    +info.menuItemId, info.selectionText, "create"
  );
  let searchFromOmnibox = q => {
    let id = 0;
    if (q.slice(-7) == " - jbis") {
      q = q.slice(0, -7);
      id = 1;
    } else if (q.slice(-16) == " - pedigreequery") {
      q = q.slice(0, -16);
      id = 2;
    } else if (q.slice(0, -13) == "- sporthorse") {
      q = q.slice(0, -13);
      id = 3;
    } else if (q.slice(0, -14) == " - allpedigree") {
      q = q.slice(0, -14);
      id = 4;
    }
    open(id, q, "update");
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