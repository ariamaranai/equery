onunhandledrejection = e => e.preventDefault();
{
  let { contextMenus, omnibox, runtime, tabs } = chrome;
  let f = async (_qs, id, index, url) => {
    let qs = _qs.normalize("NFKD").normalize("NFC").split(/[,、]/);
    let len = qs.length;
    let i = 0;
    while (i < len) {
      let q = qs[i].trim().replaceAll(" ", "+");
      if (q) {
        url =
          (id == 2 || id != 3 && id != 4 && q[0] > "぀") ? "https://db.netkeiba.com/horse/list.html?match=m&word=" + q :
          id == 3 ? "https://www.jbis.or.jp/horse/result/?sid=horse&match=exact&keyword=" + q :
          id == 4 ? "https://www.studbook.jp/users/ja/SearchBameiList?initial_forward=" + q.replace(/（.*/, "") :
          (
            id == 1 ? "https://www.equibase.com/favicon.ico#" :
            id == 5 ? "https://sporthorse-data.com/search/pedigree?keys=" :
            id == 7 ? "https://www.horsetelex.com/horses/search?name=" :
            id == 0 ? "https://www.pedigreequery.com/index.php?query_type=check&search_bar=horse&g=5&inbred=Standard&h=" :
                      "https://www.allbreedpedigree.com/index.php?query_type=check&search_bar=horse&g=5&inbred=Standard&h="
          ) + q.replace(/[^a-zA-Z+-]/g, "");
        await (index || i ? tabs.create({ url, index, active: len === 1 }) : tabs.update({ url }));
        ++i;
      }
    }
  }

  omnibox.onInputChanged.addListener((q, suggest) => {
    omnibox.setDefaultSuggestion({ description: q + " - pedigreequery" });
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
    let description;
    while (
      hosts[--i] = { content: description = q + hosts[i], description },
      i
    );
    return suggest(hosts);
  });

  omnibox.onInputEntered.addListener(q => {
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

  contextMenus.onClicked.addListener(({ menuItemId, selectionText }, { index }) =>
    ++index
      ? f(selectionText, menuItemId, index)
      : tabs.query({ active: !0, currentWindow: !0 }, tabs =>
          f(selectionText, menuItemId, tabs[0].id)
        )
  );

  runtime.onInstalled.addListener(() => {
    let i = 8;
    while (
      contextMenus.create({
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
}
