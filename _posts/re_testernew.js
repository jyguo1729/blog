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
var labelMap={};
var text="/begin{thm}cd/label{abc}ceff/end{thm}ferferfer/begin{rem}cdceff/end{rem}";

var re = /[\s\S]*?\/label{(\w+)}[\s\S]*/;
var re2=/([\s\S]*?)\/label{(\w+)}([\s\S]*)/g;
text= text.replace(/\/begin{(\w+)}([\s\S]*?)\/end{\1}/g, function (wholeMatch, m1, m2) {
    if(!environmentMap[m1]) return wholeMatch;
	var label="";
  	if (m2.match(re)){
    	label=m2.match(re)[1];
      	m2=m2.replace(re2,function(wholeMatch, m1, m2,m3){
          return m1+m3;
        });
    }
  

    var result = '<div class="latex_' + m1 +'_label'+label+'"><span class="latex_title"></span>' + m2;
    if (m1 == "proof") {
      result += '<span class="latex_proofend" style="float:right">$2$</span>';
    }
    result+='</div>';
    return result;
});

console.log(text);
/*

*/
// expected output: Array ["T", "I"]