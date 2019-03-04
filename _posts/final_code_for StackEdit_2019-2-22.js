userCustom.onPagedownConfigure = function (editor) {
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
    var converter = editor.getConverter();
    // Save the preConversion callbacks stack
    var preConversion = converter.hooks.preConversion;
    converter.hooks.chain("preConversion",function (text) {
        
        
        // Change \begin...\end to /begin.../end to avoid MathJax processing
        var re=/\\\\begin{(\w+)}([\s\S]*?)\\\\end{\1}/g;
        var labelre=/\\\\begin{(\w+)}([\s\S]*?)\\\\label{(\w+)}([\s\S]*?)\\\\end{\1}/g;
        text=text.replace(labelre, function (wholeMatch, m1, m2 ,m3 ,m4) {
            labelMap[m3]=m1;

          return '######   {#'+m3+'}'+'\n'+'\\\\begin{' + m1 + '}' + m2 +'/label{'+m3+'}'+m4+'\\\\end{' + m1 + '}';
        });

        text = text.replace(re, function (wholeMatch, m1, m2) {
          if(!environmentMap[m1]) return wholeMatch;
          // At this stage we need to keep the same number of characters for accurate section parsing
          return '/begin{' + m1 + '}' + m2 + '/end{' + m1 + '}';
        });

        // Transform \title and \section into markdown title to take benefit of partial rendering
        
        text = text.replace(/\\(\w+){([^\r\n}]+)}/g, function (wholeMatch, m1, m2) {
            // At this stage we need to keep the same number of characters for accurate section parsing
            if (m1 == 'section') {
                // \section{} has to be replaced by 10 chars
                return '\n###     ' + m2 + '\n';
            }
            if (m1 == 'subsection') {
                // \subsection{} has to be replaced by 13 chars
                return '\n####       ' + m2 + '\n';
            }
            if (m1 == 'subsubsection') {
                // \subsubsection{} has to be replaced by 16 chars
                return '\n#####         ' + m2 + '\n';
            }
            if (m1 == 'title') {
                // \title{} has to be replaced by 8 chars
                return '\n##    ' + m2 + '\n';
            }
            return wholeMatch;
        });
        
        
        return text;
        
    });
    converter.hooks.chain("preBlockGamut", function (text, blockGamutHookCallback) {
        
        text = text.replace(/\\ref{(\w+)}/g, function (wholeMatch, m1) {
            
            return '<a class="latex_ref" href="">' + m1 + '</a>';
        });
        text = text.replace(/\\(author|date){([\s\S]*?)}/g, '<div class="latex_$1">$2</div>');
     
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
          

            var result = '<div class="latex_' + m1 +'"><span class="latex_title"></span>'+'<span class="latex_label">'+label+'</span>' + blockGamutHookCallback(m2);
            if (m1 == "proof") {
              result += '<span class="latex_proofend" style="float:right">$2$</span>';
            }
            result+='</div>';
            return result;
        });
        
        return text
    });
    var previewContentsElt = document.getElementById('preview-contents');
    editor.hooks.chain('onPreviewRefresh', function() {
        thmCounter.num = 0;
        excsCounter.num = 0;
        _.each(previewContentsElt.querySelectorAll('[class^="latex_"]'), function(elt) {
            var key = elt.className.match(/^latex_(\S+)/)[1];
            var environment = environmentMap[key];
            if(!environment) return;
            var title = environment.title;
            if(environment.counter) {
                environment.counter.num++;
                title += ' ' + environment.counter.num;
                elt.id = key + ':' + environment.counter.num;
            }
            elt.querySelector('.latex_title').innerHTML = title + '.';
            x=elt.querySelector('.latex_label').innerHTML;
            elt.querySelector('.latex_label').innerHTML="";
            labelMap[x]={num:environment.counter.num,name:environment.title,label:x};
        });
        
        _.each(previewContentsElt.querySelectorAll('[class^="latex_ref"]'), function(elt) {
            
            
            var label =labelMap[elt.innerHTML];
            if(!label) return;
            elt.getAttributeNode("href").value='#'+elt.innerHTML;
            //href="#' + m1 + ':' + m2 + '">'
            elt.innerHTML=label.name+' '+label.num;
        });
        
    });
};

userCustom.onReady = function () {
    var style = [
        '.latex_thm, .latex_lem, .latex_cor, .latex_defn, .latex_prop, .latex_rem {',
        '    font-style:italic;',
        '    display: block;',
        '    margin:15px 0;',
        '}',
        '.latex_prob, .latex_examp, .latex_excs, .latex_proof {',
        '    font-style:normal;',
        '    margin: 10px 0;',
        '    display: block;',
        '}',
        '.latex_title {',
        '    float:left;',
        '    font-weight:bold;',
        '    padding-right: 10px;',
        '}',
        '.latex_proofend {',
        '    float:right;',
        '}',
    ].join('\n');
    $("head").append($('<style type="text/css">').html(style));
};