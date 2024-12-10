{
let f =async (a, b, c)=>
  navigator.onLine && chrome.tabs[
    typeof a == "object" ?
      (b = +a.menuItemId, a = a.selectionText, "create") :
      (b = [" - pedigreequery"," - jbis"," - sporthorse"," - allpedigree"].indexOf(
        a.slice(c = a.lastIndexOf("-") - 1)) >= 0 && (a = a.slice(0, c)), "update")
  ]({
    url: b >= 0 ? (
      a = a.trim().toLowerCase().replaceAll(" ", "+"),
      !b || b > 2 ?
        (b = b ? "https://www.allbreedpedigree.com/" : "https://www.pedigreequery.com/") +
        ((await fetch (b + a + "2", {method: "HEAD"})).status < 201 ? "index.php?query_type=check&search_bar=horse&h=" + a + "&g=5&inbred=Standard" : a) :
      (b < 2 ? "https://www.jbis.or.jp/horse/result/?sid=horse&keyword=" : "https://sporthorse-data.com/search/pedigree?keys=") + a
    ) : (()=> {
      c = ""
      let  i = (a = a.trim()).length
      while (c = ((b = a[--i]) < "{" ? b : b > "=" && b < "ヷ" ? "%a5%" + (b.charCodeAt() - 12288).toString(16) : b == "" ? "+" : b == "ー" ? "%a1%bc" : b == "の" ? "%a4%ce" : b == "Ⅱ" ? "II": "")  + c, i);
      return "https://db.netkeiba.com/?pid=horse_list&word=" + c
    })()
  })
chrome.contextMenus.onClicked.addListener(f)
chrome.omnibox.onInputEntered.addListener(f)
}
chrome.omnibox.onInputChanged.addListener((t, s)=> (
  chrome.omnibox.setDefaultSuggestion({description: t + " - netkeiba"}),
  s([" - pedigreequery"," - jbis"," - sporthorse"," - allpedigree"].map(v => {
    let k = t + v
    return {content: k, description: k}
  })
)))
chrome.runtime.onInstalled.addListener(()=> (
  chrome.contextMenus.create({id: "-1", title: "netkeiba", contexts: ["selection"]}),
  chrome.contextMenus.create({id: "0", title: "pedigreequery", contexts: ["selection"]}),
  chrome.contextMenus.create({id: "1", title: "jbis", contexts: ["selection"]}),
  chrome.contextMenus.create({id: "2", title: "sporthorse", contexts: ["selection"]}),
  chrome.contextMenus.create({id: "3", title: "allpedigree", contexts: ["selection"]})
))