{
  let d = document;
  let form = d.createElement("form");
  let input = form.appendChild(document.createElement("input"));
  form.method = "POST";
  form.hidden = 1;
  form.action = "/profiles/Results.cfm?type=Horse";
  input.name = "horse_name";
  input.value =  decodeURIComponent(location.hash.slice(1)).replaceAll("+", " ");
  document.documentElement.replaceWith(form);
  form.submit();
}
