---
layout:     post
title:      Cross reference problems in StackEdit
subtitle:   Cross reference
date:       2019-2-21
author:     Jiayin Guo
header-img: img/post-bg-universe.jpg
catalog: true
tags:
    - Web Front-end
---
<h3 id="1-introduction">1. Introduction</h3>

<p>In the previous post. We are left with some unsolved problems:</p>

<ul>
<li>Cross reference for theorem-like environment in StackEdit</li>
<li>LaTex style for theorem-like environment in StackEdit</li>
<li>Automatic numbering for theorem-like environment in StackEdit</li>
</ul>

<p>This post solved the first three problems. We find the following problem are still interesting and will try to solve them in the later post:</p>

<ul>
<li>One Markdown file being able to be rendered correctly on both StackEdit and GitHub Page</li>
<li>Automatic numbering for titles, sections and etc.</li>
</ul>

<p>Below is the effect of cross reference.</p>



<h6 id="b"> </h6>

<div class="latex_thm" id="thm:1"><span class="latex_title">Theorem 1.</span><span class="latex_label"></span><p>Let <script type="math/tex" id="MathJax-Element-1">(M^n,g)</script> be a complete <script type="math/tex" id="MathJax-Element-2">n</script>-dimensional Riemannian manifold of finite volume and with pinched negative sectional curvature <script type="math/tex" id="MathJax-Element-3">K</script>: there exits two constants <script type="math/tex" id="MathJax-Element-4">0<a<b</script> such that </p>

<p><script type="math/tex; mode=display" id="MathJax-Element-5">-b^2\leq K\leq -a^2.</script></p></div>

<p>We will give the proof of <a class="latex_ref" href="#b">Theorem 1</a> in  Section 2.</p>

<p>With the code given as below: <br>
<img src="https://lh3.googleusercontent.com/-NFX95wPk0D8/XHCL6F2qVvI/AAAAAAAA0JI/dcwZHRdJmsgfDq0Xcnry5WPhwNw8IAITgCLcBGAs/s0/2019-2-22.jpg" alt="enter image description here" title="2019-2-22.jpg"></p>

<p>It is implemented by the code attached at the end of this post. </p>

<p>We use pair of <code>\\begin{env}</code> and <code>\\end{env}</code> to indicate theorem-like environment the possible option of env can be <code>thm</code> for theorem, <code>lem</code> for lemma, etc. <br>
We use <code>\\label{tag}</code> inside of theorem-like environment to label this environment and use <code>\ref{some tag}</code> to refer , where<code>some tag</code> should be consist of word character only.  </p>

<p>The post consists of three parts. The first parts explains how Pagedown works. The second parts explains how Benweet and Vanabel’s treatment in this <a href="https://github.com/benweet/stackedit/issues/187">thread</a>. Third part explains what is my adaptations.</p>

<h3 id="2-how-pagedown-works">2. How Pagedown works</h3>

<p>The main reference is <a href="https://code.google.com/archive/p/pagedown/wikis/PageDown.wiki">Pagedown wiki</a> and its <a href="https://github.com/StackExchange/pagedown">source code</a>. We focus on how the a Markdown text can be translated into a HTML text.</p>

<p>There is a top object called <code>Markdown</code> with three constructors <code>Converter</code> , <code>HookCollection</code> and <code>Editor</code>.  </p>

<p>An<code>Editor</code> object <code>edit</code> use <code>getConverter()</code> method to get a <code>Converter</code> object and has <code>hooks</code> property, which is an  <code>HookCollection</code> object.  </p>

<p>An<code>Converter</code> object has <code>makeHtml(text)</code> method and  <code>hooks</code> property, which is also an  <code>HookCollection</code> object.</p>

<p>An <code>HookCollection</code> object has methods <code>chain(hookname,fun)</code>. For registers <code>fun</code> as the next plugin on the given hook <code>hookname</code>.</p>

<p>When we are editing on StackEdit,   the raw Markdown text is passed as a <code>string</code> variable <code>text</code> to <code>editor.getConverter().makeHtml(text)</code>. Its return value will be treated as input of <code>editor.hooks.onPreviewRefresh(text)</code>. </p>

<p>In makeHtml it will run though the pseudo code</p>



<pre class="prettyprint"><code class=" hljs mel">hooks=<span class="hljs-keyword">editor</span>.getConverter().hooks
<span class="hljs-keyword">text</span>=hooks.preConversion(<span class="hljs-keyword">text</span>)
do_something(<span class="hljs-keyword">text</span>)
<span class="hljs-keyword">text</span> = _RunBlockGamut(<span class="hljs-keyword">text</span>)
do_something(<span class="hljs-keyword">text</span>)
<span class="hljs-keyword">text</span> = pluginHooks.postConversion(<span class="hljs-keyword">text</span>)</code></pre>

<p>In <code>_RunBlockGamut(text)</code>, it will run though the code</p>



<pre class="prettyprint"><code class=" hljs livecodeserver"><span class="hljs-keyword">text</span> = hooks.preBlockGamut(<span class="hljs-keyword">text</span>, blockGamutHookCallback)
do_something()</code></pre>

<p>where in <code>blockGamutHookCallback()</code> it will run <code>_RunBlockGamut()</code>. Among this functions <code>preConversion()</code>,  <code>preBlockGamut()</code>, <code>postConversion()</code>, <code>onPreviewRefresh()</code> are hooks if not chained. </p>

<p>For hooking function except <code>preBlockGamut()</code> are equal to <code>identity=function(x){return x}</code>. </p>

<p><code>preBlockGamut()</code> is special. It has two arguments with the second argument being a callback function.  </p>

<p>To sum up,  the raw Markdown file <code>text</code> will go though the followings process before appears in browser:</p>



<pre class="prettyprint"><code class=" hljs r">text=preConversion(text)
<span class="hljs-keyword">...</span>
text =_RunBlockGamut(text)
<span class="hljs-keyword">...</span>
text, smaller_text=preBlockGamut(text)
//preBlockGamut decide to call _RunBlockGamut(smaller_text) or not.
<span class="hljs-keyword">...</span>
text=postConversion(text)
<span class="hljs-keyword">...</span>
text=onPreviewRefresh(text)</code></pre>

<p>The input of the <code>preConversion(text)</code> is the Markdown text. The output of the <code>postConversion(text)</code> is the cooked HTML text. <code>onPreviewRefresh(text)</code> do a final treatment for the cooked HTML text  <code>preBlockGamut(text)</code>treat the <code>_RunBlockGamut()</code> treated text and decided if some part of text <code>small_text</code>need to be treated by <code>_RunBlockGamut()</code> again. </p>

<h3 id="3-benweet-and-vanabels-treatment">3. Benweet and Vanabel’s treatment</h3>

<p>In this <a href="https://github.com/benweet/stackedit/issues/187">thread</a>, Benweet and Vanabel’s solve the following</p>

<ul>
<li>LaTex style for theorem-like environment in StackEdit</li>
<li>Automatic numbering for theorem-like environment in StackEdit  <br>
And Benweet implement a cross reference style like<code>\ref{thm:1}</code>. </li>
</ul>

<p>What they did is the following. (I delete some of their code to simplify the explanation)</p>

<p><code>preConversion</code> are chained with a function  to change \begin…\end to /begin…/end to avoid MathJax processing.</p>



<pre class="prettyprint"><code class=" hljs matlab"> <span class="hljs-transposed_variable">converter.</span><span class="hljs-transposed_variable">hooks.</span>preConversion = <span class="hljs-function"><span class="hljs-keyword">function</span> <span class="hljs-params">(text)</span> {</span>
            text = <span class="hljs-transposed_variable">text.</span>replace(/\\begin<span class="hljs-cell">{(\w+)}</span>(<span class="hljs-matrix">[\s\S]</span>*?)\\<span class="hljs-keyword">end</span><span class="hljs-cell">{\<span class="hljs-number">1</span>}</span>/g, <span class="hljs-function"><span class="hljs-keyword">function</span> <span class="hljs-params">(wholeMatch, m1, m2)</span> {</span>
                <span class="hljs-keyword">if</span>(!environmentMap<span class="hljs-matrix">[m1]</span>) <span class="hljs-keyword">return</span> wholeMatch;
                <span class="hljs-keyword">return</span> <span class="hljs-string">'/begin{'</span> + m1 + <span class="hljs-string">'}'</span> + m2 + <span class="hljs-string">'/end{'</span> + m1 + <span class="hljs-string">'}'</span>;
            });</code></pre>

<p><code>preBlockGamut</code> are chained with a function do the following</p>

<ul>
<li>put the inside of /begin{m1}…/end{m1} which is <code>m2</code> into a <code>&lt;div&gt;&lt;\div&gt;</code> container with class <code>latex_</code>+<code>environmentMap[m1]</code>(for instance <code>latex_thm</code> </li>
<li>add a <code>&lt;span&gt;&lt;/span&gt;</code> tag of class <code>latex_title</code>with empty value inside of the container.   </li>
<li>Use <code>_RunBlockGamut()</code> to treat <code>m2</code>, which is a smaller text.</li>
<li>Do a Benweet’s style cross reference by converting <code>\ref{ m}</code> to a hyperlink. </li>
</ul>



<pre class="prettyprint"><code class=" hljs javascript">converter.hooks.chain(<span class="hljs-string">"preBlockGamut"</span>, <span class="hljs-function"><span class="hljs-keyword">function</span> <span class="hljs-params">(text, blockGamutHookCallback)</span> {</span>
            text = text.replace(<span class="hljs-regexp">/\\ref{(\w+):(\d+)}/g</span>, <span class="hljs-function"><span class="hljs-keyword">function</span> <span class="hljs-params">(wholeMatch, m1, m2)</span> {</span>
                <span class="hljs-keyword">if</span>(!environmentMap[m1]) <span class="hljs-keyword">return</span> wholeMatch;
                <span class="hljs-keyword">return</span> <span class="hljs-string">'&lt;a class="latex_ref" href="#'</span> + m1 + <span class="hljs-string">':'</span> + m2 + <span class="hljs-string">'"&gt;'</span> + environmentMap[m1].title + <span class="hljs-string">' '</span> + m2 + <span class="hljs-string">'&lt;/a&gt;'</span>;
            });
            <span class="hljs-keyword">return</span> text.replace(<span class="hljs-regexp">/\/begin{(\w+)}([\s\S]*?)\/end{\1}/g</span>, <span class="hljs-function"><span class="hljs-keyword">function</span> <span class="hljs-params">(wholeMatch, m1, m2)</span> {</span>
                <span class="hljs-keyword">if</span>(!environmentMap[m1]) <span class="hljs-keyword">return</span> wholeMatch;
                <span class="hljs-keyword">var</span> result = <span class="hljs-string">'&lt;div class="latex_'</span> + m1 + <span class="hljs-string">'"&gt;&lt;span class="latex_title"&gt;&lt;/span&gt;'</span> + blockGamutHookCallback(m2);
                <span class="hljs-keyword">return</span> result + <span class="hljs-string">'&lt;/div&gt;'</span>;
            });</code></pre>

<p><code>onPreviewRefresh</code> are chained with a function do the following</p>

<ul>
<li>Set a counter <code>thmCounter.num</code> </li>
<li>For all container with class name of form <code>latex_thm</code>, set the value of <code>&lt;span&gt;&lt;/span&gt;</code> to be <code>Theorem</code> with its numbering<code>thmCounter.num</code>.</li>
<li>Set each reference with correct number using <code>thmCounter.num</code></li>
</ul>



<pre class="prettyprint"><code class=" hljs javascript">editor.hooks.chain(<span class="hljs-string">'onPreviewRefresh'</span>, <span class="hljs-function"><span class="hljs-keyword">function</span><span class="hljs-params">()</span> {</span>
            thmCounter.num = <span class="hljs-number">0</span>;
            excsCounter.num = <span class="hljs-number">0</span>;
            _.each(previewContentsElt.querySelectorAll(<span class="hljs-string">'[class^="latex_"]'</span>), <span class="hljs-function"><span class="hljs-keyword">function</span><span class="hljs-params">(elt)</span> {</span>
                <span class="hljs-keyword">var</span> key = elt.className.match(<span class="hljs-regexp">/^latex_(\S+)/</span>)[<span class="hljs-number">1</span>];
                <span class="hljs-keyword">var</span> environment = environmentMap[key];
                <span class="hljs-keyword">if</span>(!environment) <span class="hljs-keyword">return</span>;
                <span class="hljs-keyword">var</span> title = environment.title;
                <span class="hljs-keyword">if</span>(environment.counter) {
                    environment.counter.num++;
                    title += <span class="hljs-string">' '</span> + environment.counter.num;
                    elt.id = key + <span class="hljs-string">':'</span> + environment.counter.num;
                }
                elt.querySelector(<span class="hljs-string">'.latex_title'</span>).innerHTML = title + <span class="hljs-string">'.'</span>;
            });
        });</code></pre>

<p>After this three codes, They add some CSS style to make the theorem environments more looks like LaTex ones.</p>

<p>The division of code into three hooking function is for the following reasons.  </p>

<ul>
<li>Numbering of the theorems has to be implemented after <code>preBlockGamut()</code> since the input of <code>preBlockGamut()</code> may not be the whole text, as pointed out in the previous section.</li>
<li>LaTex style theorem environment has to be treated as early as possible. The ideal situation is that it is implemented at <code>preConversion</code> stage. But in order the inner text of theorem can still utilize some Markdown syntax, say lists or hyperlinks. The earliest stage that it can be implemented is at <code>preBlockGamut()</code>.</li>
</ul>

<h3 id="4-my-adaption">4. My adaption</h3>

<p>The purpose for me to make a adaption is that I want to have a more free cross reference style <code>\ref{ FTA}</code> rather than of a fixed format like <code>\ref{thm:index}</code>.  Then I need to solve the following problems. </p>

<p><code>\ref{thm:index}</code> already indicates which theorem type it will refer. <code>\ref{ FTA}</code> does not. So there is no need to implement a <code>\label{}</code> command inside of the theorem environment. </p>

<p><code>\ref{thm:index}</code> already indicated correct index of a theorem. <code>\ref{ FTA}</code> does not. I have to calculate the correct index of the referred theorem on the <code>onPreviewRefresh</code> stage.</p>

<p>The way I implement these two function is the following way.  <br>
On <code>preCOnversion()</code> stage, for each theorem environment, I detect the if there is command like <code>\label{ tag}</code>, generate a <code>h6</code> header atop of this theorem with value of  <code>tag</code> </p>

<p>On <code>preBlockGamut()</code> stage, I move the <code>tag</code> in a <code>span</code> tag with class <code>latex_label</code>.</p>

<p>On <code>onPreviewRefresh()</code> stage, when treating theorem environment, I exact  the value  <code>tag</code>of  <code>latex_label</code>, theorem type and index and put them into a global dictionary <code>labelmap</code>. I use this information to convert <code>\ref{tag }</code>into a correct theorem type and index, like here <a class="latex_ref" href="#b">Theorem 1</a>.</p>

<p>That’s it for this post. One may check code in the appendix.</p>

<h3 id="5-appendix">5. Appendix</h3>

<p>Add the following code in the UserCustom extension of <a href="https://stackedit.io/editor">StackEdit v4</a></p>



<pre class="prettyprint"><code class=" hljs javascript">userCustom.onPagedownConfigure = <span class="hljs-function"><span class="hljs-keyword">function</span> <span class="hljs-params">(editor)</span> {</span>
    <span class="hljs-keyword">var</span> thmCounter  = { num: <span class="hljs-number">0</span> };
    <span class="hljs-keyword">var</span> excsCounter = { num: <span class="hljs-number">0</span> };
    <span class="hljs-keyword">var</span> environmentMap = {
        thm:   { title: <span class="hljs-string">"Theorem"</span>    ,counter: thmCounter  },
        lem:   { title: <span class="hljs-string">"Lemma"</span>      ,counter: thmCounter  },
        cor:   { title: <span class="hljs-string">"Corollary"</span>  ,counter: thmCounter  },
        prop:  { title: <span class="hljs-string">"Property"</span>   ,counter: thmCounter  },
        defn:  { title: <span class="hljs-string">"Definition"</span> ,counter: thmCounter  },
        rem:   { title: <span class="hljs-string">"Remark"</span>     ,counter: thmCounter  },
        prob:  { title: <span class="hljs-string">"Problem"</span>    ,counter: excsCounter },
        excs:  { title: <span class="hljs-string">"Exercise"</span>   ,counter: excsCounter },
        examp: { title: <span class="hljs-string">"Example"</span>    ,counter: excsCounter },
        proof: { title: <span class="hljs-string">"Proof"</span> }
    };
    <span class="hljs-keyword">var</span> labelMap={};
    <span class="hljs-keyword">var</span> converter = editor.getConverter();
    <span class="hljs-comment">// Save the preConversion callbacks stack</span>
    <span class="hljs-keyword">var</span> preConversion = converter.hooks.preConversion;
    converter.hooks.chain(<span class="hljs-string">"preConversion"</span>,<span class="hljs-function"><span class="hljs-keyword">function</span> <span class="hljs-params">(text)</span> {</span>        
        <span class="hljs-comment">// Change \begin...\end to /begin.../end to avoid MathJax processing</span>
        <span class="hljs-keyword">var</span> re=<span class="hljs-regexp">/\\\\begin{(\w+)}([\s\S]*?)\\\\end{\1}/g</span>;
        <span class="hljs-keyword">var</span> labelre=<span class="hljs-regexp">/\\\\begin{(\w+)}([\s\S]*?)\\\\label{(\w+)}([\s\S]*?)\\\\end{\1}/g</span>;
        text=text.replace(labelre, <span class="hljs-function"><span class="hljs-keyword">function</span> <span class="hljs-params">(wholeMatch, m1, m2 ,m3 ,m4)</span> {</span>
            labelMap[m3]=m1;

          <span class="hljs-keyword">return</span> <span class="hljs-string">'######   {#'</span>+m3+<span class="hljs-string">'}'</span>+<span class="hljs-string">'\n'</span>+<span class="hljs-string">'\\\\begin{'</span> + m1 + <span class="hljs-string">'}'</span> + m2 +<span class="hljs-string">'/label{'</span>+m3+<span class="hljs-string">'}'</span>+m4+<span class="hljs-string">'\\\\end{'</span> + m1 + <span class="hljs-string">'}'</span>;
        });

        text = text.replace(re, <span class="hljs-function"><span class="hljs-keyword">function</span> <span class="hljs-params">(wholeMatch, m1, m2)</span> {</span>
          <span class="hljs-keyword">if</span>(!environmentMap[m1]) <span class="hljs-keyword">return</span> wholeMatch;
          <span class="hljs-comment">// At this stage we need to keep the same number of characters for accurate section parsing</span>
          <span class="hljs-keyword">return</span> <span class="hljs-string">'/begin{'</span> + m1 + <span class="hljs-string">'}'</span> + m2 + <span class="hljs-string">'/end{'</span> + m1 + <span class="hljs-string">'}'</span>;
        });

        <span class="hljs-comment">// Transform \title and \section into markdown title to take benefit of partial rendering</span>

        text = text.replace(<span class="hljs-regexp">/\\(\w+){([^\r\n}]+)}/g</span>, <span class="hljs-function"><span class="hljs-keyword">function</span> <span class="hljs-params">(wholeMatch, m1, m2)</span> {</span>
            <span class="hljs-comment">// At this stage we need to keep the same number of characters for accurate section parsing</span>
            <span class="hljs-keyword">if</span> (m1 == <span class="hljs-string">'section'</span>) {
                <span class="hljs-comment">// \section{} has to be replaced by 10 chars</span>
                <span class="hljs-keyword">return</span> <span class="hljs-string">'\n###     '</span> + m2 + <span class="hljs-string">'\n'</span>;
            }
            <span class="hljs-keyword">if</span> (m1 == <span class="hljs-string">'subsection'</span>) {
                <span class="hljs-comment">// \subsection{} has to be replaced by 13 chars</span>
                <span class="hljs-keyword">return</span> <span class="hljs-string">'\n####       '</span> + m2 + <span class="hljs-string">'\n'</span>;
            }
            <span class="hljs-keyword">if</span> (m1 == <span class="hljs-string">'subsubsection'</span>) {
                <span class="hljs-comment">// \subsubsection{} has to be replaced by 16 chars</span>
                <span class="hljs-keyword">return</span> <span class="hljs-string">'\n#####         '</span> + m2 + <span class="hljs-string">'\n'</span>;
            }
            <span class="hljs-keyword">if</span> (m1 == <span class="hljs-string">'title'</span>) {
                <span class="hljs-comment">// \title{} has to be replaced by 8 chars</span>
                <span class="hljs-keyword">return</span> <span class="hljs-string">'\n##    '</span> + m2 + <span class="hljs-string">'\n'</span>;
            }
            <span class="hljs-keyword">return</span> wholeMatch;
        });


        <span class="hljs-keyword">return</span> text;

    });
    converter.hooks.chain(<span class="hljs-string">"preBlockGamut"</span>, <span class="hljs-function"><span class="hljs-keyword">function</span> <span class="hljs-params">(text, blockGamutHookCallback)</span> {</span>

        text = text.replace(<span class="hljs-regexp">/\\ref{(\S+)}/g</span>, <span class="hljs-function"><span class="hljs-keyword">function</span> <span class="hljs-params">(wholeMatch, m1)</span> {</span>

            <span class="hljs-keyword">return</span> <span class="hljs-string">'&lt;a class="latex_ref" href=""&gt;'</span> + m1 + <span class="hljs-string">'&lt;/a&gt;'</span>;
        });
        text = text.replace(<span class="hljs-regexp">/\\(author|date){([\s\S]*?)}/g</span>, <span class="hljs-string">'&lt;div class="latex_$1"&gt;$2&lt;/div&gt;'</span>);

        <span class="hljs-keyword">var</span> re = <span class="hljs-regexp">/[\s\S]*?\/label{(\w+)}[\s\S]*/</span>;
        <span class="hljs-keyword">var</span> re2=<span class="hljs-regexp">/([\s\S]*?)\/label{(\w+)}([\s\S]*)/g</span>;
        text= text.replace(<span class="hljs-regexp">/\/begin{(\w+)}([\s\S]*?)\/end{\1}/g</span>, <span class="hljs-function"><span class="hljs-keyword">function</span> <span class="hljs-params">(wholeMatch, m1, m2)</span> {</span>
            <span class="hljs-keyword">if</span>(!environmentMap[m1]) <span class="hljs-keyword">return</span> wholeMatch;
            <span class="hljs-keyword">var</span> label=<span class="hljs-string">""</span>;
            <span class="hljs-keyword">if</span> (m2.match(re)){
                label=m2.match(re)[<span class="hljs-number">1</span>];
                m2=m2.replace(re2,<span class="hljs-function"><span class="hljs-keyword">function</span><span class="hljs-params">(wholeMatch, m1, m2,m3)</span>{</span>
                  <span class="hljs-keyword">return</span> m1+m3;
                });
            }


            <span class="hljs-keyword">var</span> result = <span class="hljs-string">'&lt;div class="latex_'</span> + m1 +<span class="hljs-string">'"&gt;&lt;span class="latex_title"&gt;&lt;/span&gt;'</span>+<span class="hljs-string">'&lt;span class="latex_label"&gt;'</span>+label+<span class="hljs-string">'&lt;/span&gt;'</span> + blockGamutHookCallback(m2);
            <span class="hljs-keyword">if</span> (m1 == <span class="hljs-string">"proof"</span>) {
              result += <span class="hljs-string">'&lt;span class="latex_proofend" style="float:right"&gt;$2$&lt;/span&gt;'</span>;
            }
            result+=<span class="hljs-string">'&lt;/div&gt;'</span>;
            <span class="hljs-keyword">return</span> result;
        });

        <span class="hljs-keyword">return</span> text
    });
    <span class="hljs-keyword">var</span> previewContentsElt = document.getElementById(<span class="hljs-string">'preview-contents'</span>);
    editor.hooks.chain(<span class="hljs-string">'onPreviewRefresh'</span>, <span class="hljs-function"><span class="hljs-keyword">function</span><span class="hljs-params">()</span> {</span>
        thmCounter.num = <span class="hljs-number">0</span>;
        excsCounter.num = <span class="hljs-number">0</span>;
        _.each(previewContentsElt.querySelectorAll(<span class="hljs-string">'[class^="latex_"]'</span>), <span class="hljs-function"><span class="hljs-keyword">function</span><span class="hljs-params">(elt)</span> {</span>
            <span class="hljs-keyword">var</span> key = elt.className.match(<span class="hljs-regexp">/^latex_(\S+)/</span>)[<span class="hljs-number">1</span>];
            <span class="hljs-keyword">var</span> environment = environmentMap[key];
            <span class="hljs-keyword">if</span>(!environment) <span class="hljs-keyword">return</span>;
            <span class="hljs-keyword">var</span> title = environment.title;
            <span class="hljs-keyword">if</span>(environment.counter) {
                environment.counter.num++;
                title += <span class="hljs-string">' '</span> + environment.counter.num;
                elt.id = key + <span class="hljs-string">':'</span> + environment.counter.num;
            }
            elt.querySelector(<span class="hljs-string">'.latex_title'</span>).innerHTML = title + <span class="hljs-string">'.'</span>;
            x=elt.querySelector(<span class="hljs-string">'.latex_label'</span>).innerHTML;
            elt.querySelector(<span class="hljs-string">'.latex_label'</span>).innerHTML=<span class="hljs-string">""</span>;
            labelMap[x]={num:environment.counter.num,name:environment.title,label:x};
        });

        _.each(previewContentsElt.querySelectorAll(<span class="hljs-string">'[class^="latex_ref"]'</span>), <span class="hljs-function"><span class="hljs-keyword">function</span><span class="hljs-params">(elt)</span> {</span>


            <span class="hljs-keyword">var</span> label =labelMap[elt.innerHTML];
            <span class="hljs-keyword">if</span>(!label) <span class="hljs-keyword">return</span>;
            elt.getAttributeNode(<span class="hljs-string">"href"</span>).value=<span class="hljs-string">'#'</span>+elt.innerHTML;
            <span class="hljs-comment">//href="#' + m1 + ':' + m2 + '"&gt;'</span>
            elt.innerHTML=label.name+<span class="hljs-string">' '</span>+label.num;
        });
    });
};
userCustom.onReady = <span class="hljs-function"><span class="hljs-keyword">function</span> <span class="hljs-params">()</span> {</span>
    <span class="hljs-keyword">var</span> style = [
        <span class="hljs-string">'.latex_thm, .latex_lem, .latex_cor, .latex_defn, .latex_prop, .latex_rem {'</span>,
        <span class="hljs-string">'    font-style:italic;'</span>,
        <span class="hljs-string">'    display: block;'</span>,
        <span class="hljs-string">'    margin:15px 0;'</span>,
        <span class="hljs-string">'}'</span>,
        <span class="hljs-string">'.latex_prob, .latex_examp, .latex_excs, .latex_proof {'</span>,
        <span class="hljs-string">'    font-style:normal;'</span>,
        <span class="hljs-string">'    margin: 10px 0;'</span>,
        <span class="hljs-string">'    display: block;'</span>,
        <span class="hljs-string">'}'</span>,
        <span class="hljs-string">'.latex_title {'</span>,
        <span class="hljs-string">'    float:left;'</span>,
        <span class="hljs-string">'    font-weight:bold;'</span>,
        <span class="hljs-string">'    padding-right: 10px;'</span>,
        <span class="hljs-string">'}'</span>,
        <span class="hljs-string">'.latex_proofend {'</span>,
        <span class="hljs-string">'    float:right;'</span>,
        <span class="hljs-string">'}'</span>,
    ].join(<span class="hljs-string">'\n'</span>);
    $(<span class="hljs-string">"head"</span>).append($(<span class="hljs-string">'&lt;style type="text/css"&gt;'</span>).html(style));
};</code></pre>