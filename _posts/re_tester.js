var thmCounter  = { num: 0 };
var excsCounter = { num: 0 };
var environmentMap = {
  thm:   { title: "Theorem"    ,counter: thmCounter  },
  lem:   { title: "Lemma"      ,counter: thmCounter  },
  cor:   { title: "Corollary"  ,counter: thmCounter  },
  prop:  { title: "Property"   ,counter: thmCounter  },
  defn:  { title: "Definition" ,counter: thmCounter  },
  rem:   { title: "Remark"     ,counter: thmCounter  },
  prob:  { title: "Problem"    ,counter: excsCounter },
  excs:  { title: "Exercise"   ,counter: excsCounter },
  examp: { title: "Example"    ,counter: excsCounter },
  proof: { title: "Proof" }
};
var text="\\\\begin{thm}som\\\\label{tag}ething\\\\end{thm}";
//var text="\\\\begin{thm}something\\\\end{thm}"
var re=/\\\\begin{(\w+)}([\s\S]*?)\\\\end{\1}/g;
var labelre=/\\\\begin{(\w+)}([\s\S]*?)\\\\label{(\w+)}([\s\S]*?)\\\\end{\1}/g;
text=text.replace(labelre, function (wholeMatch, m1, m2 ,m3 ,m4) {

  return '####  {#'+m3+'}'+'\n'+'\\\\begin{' + m1 + '}' + m2 +m4+'\\\\end{' + m1 + '}';
});

text = text.replace(re, function (wholeMatch, m1, m2) {
  if(!environmentMap[m1]) return wholeMatch;
  // At this stage we need to keep the same number of characters for accurate section parsing
  return '/begin{' + m1 + '}' + m2 + '/end{' + m1 + '}';
});
console.log(text);  