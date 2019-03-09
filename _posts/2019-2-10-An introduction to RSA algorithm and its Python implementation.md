---
layout:     post
title:      An introduction to RSA algorithm and its Python implementation
subtitle:   RSA algorithm
date:       2019-2-10
author:     Jiayin Guo
header-img: img/post-bg-universe.jpg
catalog: true
tags:
    - Algorithm
---
<h3 id="1-introduction">1. Introduction</h3>

<p>This article explains the Miller-Rabin primality test in cryptography. It consists of three parts. The first part gives the math background for this algorithm and adaptations to make it practical to real world use. The second part gives a python impeletion.</p>

<h3 id="2-math-background-for-the-miller-rabin-primality-test">2. Math background for the Miller-Rabin primality test</h3>

<p>The main reference for this section is <a href="https://www.mathematik.uni-kl.de/~ederc/download/Cryptography.pdf">An Introduction to Cryptography</a></p>

<h4 id="1-fermats-primality-test">1.  Fermat’s primality test</h4>

<p>First let us recall the Fermat’s little Theorem.</p>



<h6 id="cfe"> </h6>

<div class="latex_thm" id="thm:1"><span class="latex_title">Theorem 1.</span><span class="latex_label"></span><p>(Fermat’s little Theorem).</p>

<p>Let p be a prime number, then <script type="math/tex" id="MathJax-Element-1">a^{p-1}=1</script>  for any <script type="math/tex" id="MathJax-Element-2">a\in  (\bZ/ p\bZ)^* </script>in unit of <script type="math/tex" id="MathJax-Element-3">\bZ/ p\bZ</script>. <br>
 </p></div>



<h6 id="defFwit"> </h6>

<div class="latex_def" id="def:2"><span class="latex_title">Definition 2.</span><span class="latex_label"></span><p><script type="math/tex" id="MathJax-Element-4">\textrm{ }</script></p>

<ol>
<li>For a general integer <script type="math/tex" id="MathJax-Element-5">n</script>,  <script type="math/tex" id="MathJax-Element-6">a\in  (\bZ/ n\bZ)^* </script> is called a <strong>Fermat witness (for the compositeness)</strong>  of <script type="math/tex" id="MathJax-Element-7">n</script> if <script type="math/tex" id="MathJax-Element-8">a^{n-1}\neq{1}</script> . <script type="math/tex" id="MathJax-Element-9">a</script> is  called a <strong>Fermat non-witness</strong> of <script type="math/tex" id="MathJax-Element-10">n</script> if <script type="math/tex" id="MathJax-Element-11">a^{n-1}=1</script>. Equivalently, <script type="math/tex" id="MathJax-Element-12">n</script> is a called <strong>pseudoprime with  Fermat non-witness</strong> <script type="math/tex" id="MathJax-Element-13">a</script>.</li>
<li>Let <script type="math/tex" id="MathJax-Element-14">F</script> be the set of Fermat witness of <script type="math/tex" id="MathJax-Element-15">n</script>,  <script type="math/tex" id="MathJax-Element-16">n</script> is called <strong>Carmichael number</strong> if <script type="math/tex" id="MathJax-Element-17">F</script> is empty and n is composite. </li>
</ol></div>

<p>It can be seen from <a class="latex_ref" href="#defFwit">Definition 2</a> clearly that if <script type="math/tex" id="MathJax-Element-18">n</script> is a pseudo prime number with every unit being a Fermat non-witness,  then <script type="math/tex" id="MathJax-Element-19">n</script> is either a prime number or Carmichael number. </p>

<p>Fermat’s little Theorem leads to an algorithm called Fermat’s primality test.  <br>
we have the following naive deterministic algorithm. </p>



<pre class="prettyprint"><code class=" hljs python"><span class="hljs-function"><span class="hljs-keyword">def</span> <span class="hljs-title">fun</span><span class="hljs-params">(n)</span>:</span>
    <span class="hljs-keyword">for</span> a <span class="hljs-keyword">in</span> set{<span class="hljs-number">1</span>,...,n-<span class="hljs-number">1</span>}
        <span class="hljs-keyword">if</span> a^(n-<span class="hljs-number">1</span>)!=<span class="hljs-number">1</span> mod n:
            <span class="hljs-keyword">return</span> false
    <span class="hljs-keyword">return</span> <span class="hljs-keyword">True</span>  </code></pre>

<p>The first problem of this algorithm is even if <code>fun(n)</code> is true, <script type="math/tex" id="MathJax-Element-20">n</script> is either a prime number or a Carmichael number. As shown in <a href="https://dms.umontreal.ca/~andrew/PDF/carmichael.pdf">here</a> , there is infinite number of Carmichael numbers. Prime numbers and Carmichael number can not be distinguished simply.</p>

<p>The second problem is the time complexity.  </p>

<h6 id="Fc"> </h6>

<div class="latex_prop" id="prop:3"><span class="latex_title">Propersition 3.</span><span class="latex_label"></span><p>The  Fermat’s primality test has time complexity <script type="math/tex" id="MathJax-Element-21">\tilde\sO(n)</script>.</p></div> 

<p>In fact, the first <script type="math/tex" id="MathJax-Element-22">n</script> comes from the times of loops. To do the modular exponential <script type="math/tex" id="MathJax-Element-23">a^{n-1} \mod n</script>. One may apply <a href="https://simple.wikipedia.org/wiki/Exponentiation_by_squaring">exponentiating by squaring algorithm</a> to reduce the task to compute product of two number less than <script type="math/tex" id="MathJax-Element-24">n</script>, this gives us a factor <script type="math/tex" id="MathJax-Element-25">\log n</script>. The product of two numbers with digits less than <script type="math/tex" id="MathJax-Element-26">\log n</script> can be treated by  <a href="https://en.wikipedia.org/wiki/Montgomery_modular_multiplication">Montgomery modular multiplication</a> with time complexity <script type="math/tex" id="MathJax-Element-27">\tilde\sO(\log n)</script>. So the time complexity of the loop body is <script type="math/tex" id="MathJax-Element-28">\tilde\sO(\log^2 n)</script>.</p>

<p>The first factor <script type="math/tex" id="MathJax-Element-29">n</script> gives a lot restriction to the time complexity and Fermat primality test an actual exponential time algorithm relative to <script type="math/tex" id="MathJax-Element-30">\log n</script>. <br>
 ######   {#mr}</p>

<div class="latex_rk" id="rk:4"><span class="latex_title">Remark 4.</span><span class="latex_label"></span><p>One may attempt to modify the Fermat’s primality test algorithm to be a probabilistic one selecting different numbers in <script type="math/tex" id="MathJax-Element-31">\{1,..,,n-1\}</script> randomly for k times. This algorithm has time complexity <script type="math/tex" id="MathJax-Element-32">\tilde\sO(k\cdot\log^2 n)</script>. </p></div>

<p>Let <script type="math/tex" id="MathJax-Element-33">N_F=\{\textrm{Fermat non-Witness of } n\}</script>. Let C be event that <script type="math/tex" id="MathJax-Element-34">n</script> is a composite, <script type="math/tex" id="MathJax-Element-35">T_k</script> be event that after the output running the “probabilistic” Fermat’s primality test is <code>True</code>, then <script type="math/tex; mode=display" id="MathJax-Element-36">P(T_k|C)\leq(\frac{|N_F|}n)^k.</script>Since <script type="math/tex" id="MathJax-Element-37">n</script> can be Carmelson number, the upper bound of <script type="math/tex" id="MathJax-Element-38">P(T_k|C)</script> can be 1. Hence this algorithm will is not probabilistic.</p>

<h4 id="2-miller-rabin-primality-test">2.  Miller-Rabin  primality test</h4>

<p>Miller-Rabin test is an probabilistic polynomial algorithm. It improves the Fermat’s primality test at the two problems mentioned in previous  section. It relied on the following proposition.</p>



<div class="latex_prop" id="prop:5"><span class="latex_title">Propersition 5.</span><span class="latex_label"></span><p>Let <script type="math/tex" id="MathJax-Element-39">p</script> be a prime number. <script type="math/tex" id="MathJax-Element-40">x^2-1=0</script> has exactly two solutions <script type="math/tex" id="MathJax-Element-41">1</script>,<script type="math/tex" id="MathJax-Element-42">-1</script> for <script type="math/tex" id="MathJax-Element-43">x</script> in <script type="math/tex" id="MathJax-Element-44">\bZ/p\bZ</script>.</p></div>

<p>Based on this we have the following proposition for prime numbers.</p>

<div class="latex_prop" id="prop:6"><span class="latex_title">Propersition 6.</span><span class="latex_label"></span><p>Let p be a prime number, <script type="math/tex" id="MathJax-Element-45">a\in  (\bZ/ n \bZ)^* </script>.  Suppose <script type="math/tex" id="MathJax-Element-46">p-1=s\cdot2^t</script>, where <script type="math/tex" id="MathJax-Element-47">s</script> is an odd number, t is an integer. Then <br>
<script type="math/tex; mode=display" id="MathJax-Element-48">\begin{equation}
\begin{split}
&a^s=\pm1\textrm{  or}  \\ 
&a^{s2^k}=-1 \textrm{  for some }k\in\{1,\dots,t-1 \} 
\end{split}
\end{equation}</script></p></div>

<p>One may prove it by considering the minimal element of form <script type="math/tex" id="MathJax-Element-49">a^{s2^k}</script> satisfying <script type="math/tex" id="MathJax-Element-50">a^{s2^k}=1</script>.</p>

<p>This is leads to following definition analoging Fermat’s witness.</p>

<div class="latex_def" id="def:7"><span class="latex_title">Definition 7.</span><span class="latex_label"></span><p>For a general integer <script type="math/tex" id="MathJax-Element-51">n</script>,  <script type="math/tex" id="MathJax-Element-52">a\in  (\bZ/ n\bZ)^* </script> is called a <strong>Miller-Rabin witness (for the compositeness)</strong>  of <script type="math/tex" id="MathJax-Element-53">n</script>. Let <script type="math/tex" id="MathJax-Element-54">n-1=s2^{t}</script> if <br>
<script type="math/tex; mode=display" id="MathJax-Element-55">\begin{equation}
\begin{split}
a^s&=\pm1\textrm{  or}  \\ 
a^{s2^k}&=-1 \textrm{  for some }k\in\{1,\dots,t-1 \} 
\end{split}
\end{equation}</script> <br>
Otherwise <script type="math/tex" id="MathJax-Element-56">a</script> is  called a <strong>Miller-Rabin non-witness</strong> of <script type="math/tex" id="MathJax-Element-57">n</script>.</p></div>

<p>Correspondingly the following algorithm is designed to test if a number <script type="math/tex" id="MathJax-Element-58">a</script> is a Miller-Rabin non-witness of <script type="math/tex" id="MathJax-Element-59">n</script>. We may assume <script type="math/tex" id="MathJax-Element-60">a\in  \{1,\dots ,n-1\} </script>. </p>



<pre class="prettyprint"><code class=" hljs python"><span class="hljs-function"><span class="hljs-keyword">def</span> <span class="hljs-title">isMillerRabinNonWitness</span><span class="hljs-params">(a,n)</span>:</span>
        find s,t <span class="hljs-keyword">for</span> n-<span class="hljs-number">1</span>
        u=a^s mod n
        <span class="hljs-keyword">if</span> u==<span class="hljs-number">1</span> <span class="hljs-keyword">or</span> -<span class="hljs-number">1</span> mod n:
            <span class="hljs-keyword">return</span> <span class="hljs-keyword">False</span>
        loop t-<span class="hljs-number">1</span> times
            u=u*u mod n
            <span class="hljs-keyword">if</span> u=-<span class="hljs-number">1</span> mod n:
                <span class="hljs-keyword">return</span> <span class="hljs-keyword">False</span>
    <span class="hljs-keyword">return</span> <span class="hljs-keyword">True</span>  </code></pre>

<p>The time complexity of  checking <script type="math/tex" id="MathJax-Element-61">a</script> being Miller-Rabin non-witness is <script type="math/tex" id="MathJax-Element-62">\tilde\sO(\log ^2 n)</script>.</p>

<ul>
<li>Time complexity to get <script type="math/tex" id="MathJax-Element-63">s</script> is <script type="math/tex" id="MathJax-Element-64">\sO(\log n)</script>.</li>
<li>Time complexity to get <script type="math/tex" id="MathJax-Element-65">u</script> is <script type="math/tex" id="MathJax-Element-66">\tilde\sO(\log^2 n)</script>. [A similar analysis appears in <a class="latex_ref" href="#Fc">Propersition 3</a>]</li>
<li>Time complexity for the loop is <script type="math/tex" id="MathJax-Element-67">\tilde\sO(\log^2 n)</script>. [loop <script type="math/tex" id="MathJax-Element-68">\sO(\log n)</script> times, the loop body has time complexity <script type="math/tex" id="MathJax-Element-69">\tilde\sO(\log n)</script>] </li>
</ul>

<p>The Miller-Rabin primality probabilistic algorithm is designed as the following.</p>



<pre class="prettyprint"><code class=" hljs python"><span class="hljs-function"><span class="hljs-keyword">def</span> <span class="hljs-title">fun</span><span class="hljs-params">(n)</span>:</span>
    loop k times
        randomly choose different a <span class="hljs-keyword">in</span> {<span class="hljs-number">1</span>,..,,n-<span class="hljs-number">1</span>}
        <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> isMillerRabinNonWitness(a,n):
            <span class="hljs-keyword">return</span> <span class="hljs-keyword">False</span>
    <span class="hljs-keyword">return</span> <span class="hljs-keyword">True</span></code></pre>

<p>This is a probabilistic polynomial algorithm of time complexity <script type="math/tex" id="MathJax-Element-70"> \tilde\sO(k\cdot\log^2 n)</script> with respect <script type="math/tex" id="MathJax-Element-71">\log n</script>.  </p>

<p>we use the concept of precision in data science. The precision of  Miller-Rabin primality probabilistic algorithm.</p>

<div class="latex_def" id="def:8"><span class="latex_title">Definition 8.</span><span class="latex_label"></span><p>Let <script type="math/tex" id="MathJax-Element-72">C</script> be event that <script type="math/tex" id="MathJax-Element-73">n</script> is a composite, <script type="math/tex" id="MathJax-Element-74">P</script> be event that <script type="math/tex" id="MathJax-Element-75">n</script> is a prime. <script type="math/tex" id="MathJax-Element-76">T_k</script> be event that after the output running Miller-Rabin primality probabilistic algorithm is <code>True</code>. The <strong>precision</strong> of  Miller-Rabin primality probabilistic algorithm is defined as <script type="math/tex" id="MathJax-Element-77">P(P|T_k)</script>.</p></div>

<p>The Miller-Rabin primality probabilistic algorithm has good estimation for precision. <br>
Let <script type="math/tex" id="MathJax-Element-78">N=\{\textrm{Miller-Rabin non-Witness of } n\}</script>. L, then  <br>
<script type="math/tex; mode=display" id="MathJax-Element-79">P(T_k|C)\leq(\frac{|N|}n)^k,</script> <br>
and <br>
<script type="math/tex; mode=display" id="MathJax-Element-80">P(P|T_k)=1-P(T_k|C)\geq1-(\frac{|N|}n)^k.</script></p>

<p>Not like the case discussed in the remark 1.1, <script type="math/tex" id="MathJax-Element-81">|N|</script> has the following description.  </p>



<div class="latex_thm" id="thm:9"><span class="latex_title">Theorem 9.</span><span class="latex_label"></span><p>Let n be an integer, then <script type="math/tex" id="MathJax-Element-82">|N|\leq \phi(n)/4<n/4</script>, where <script type="math/tex" id="MathJax-Element-83">\phi(n)</script> is the Euler’s phi function.  </p></div>

<p>Check <a href="%28https://www.mathematik.uni-kl.de/~ederc/download/Cryptography.pdf%29">here</a> Theorem 9.11 for the proof.</p>

<p>Pick one estimation from  estimations based on <a href="https://en.wikipedia.org/wiki/Prime_number_theorem">prime number theorem</a>.</p>



<div class="latex_thm" id="thm:10"><span class="latex_title">Theorem 10.</span><span class="latex_label"></span><p>Let <script type="math/tex" id="MathJax-Element-84">\pi(x)</script> be the <a href="https://en.wikipedia.org/wiki/Prime-counting_function">prime-counting function</a> that gives the number of primes less than or equal to x, then  <br>
<script type="math/tex; mode=display" id="MathJax-Element-85">\frac{1}{\log x+2}<\frac {\pi(x)}x<\frac{1}{\log x-4}.</script></p></div>

<p>Check <a href="https://www.jstor.org/stable/2371291?origin=crossref&amp;seq=1#page_scan_tab_contents">here</a> for the proof. <br>
By the Bayes formula, for a <script type="math/tex" id="MathJax-Element-86">m</script> bit number <script type="math/tex" id="MathJax-Element-87">n</script>,let <script type="math/tex" id="MathJax-Element-88">N=2^m</script>, we have </p>



<p><script type="math/tex; mode=display" id="MathJax-Element-89">
\begin{equation}
\begin{split}
	P(P|T_k)&=\frac{P(T_k|P)P(P)}{P(T_k|P)P(P)+P(T_k|C)P(C)}\\
	&>\frac {\pi(N)/N}{\pi(N)/N+\frac1{4^k}(1-\pi(N)/N)}\\
	&=\frac{1}{1+\frac1{4^N}(N/\pi(N)-1)}\\
	&>\frac{1}{1+\frac1{4^k}(\log N+1)}\\
	&>1-\frac{m}{4^{k-1}}
\end{split}	
\end{equation}
</script></p>

<p>The last inequality  require <script type="math/tex" id="MathJax-Element-90">k>\log m</script>, the second last inequality used the theorem above. </p>

<p>Though the Miller-Rabin primality probabilistic algorithm can not be used for determine a number being prime theoretically. As noted <a href="https://stackoverflow.com/questions/4159333/rsa-and-prime-generator-algorithms/4160517#4160517">here</a> , the probability for a CPU has one error has a lower bound <script type="math/tex" id="MathJax-Element-91">1.8*10^{-24}</script>. So one may choose <script type="math/tex" id="MathJax-Element-92">k\geq43\log \log n</script> to guarantee the precision of the algorithm is suitable for practical use. </p>



<div class="latex_rk" id="rk:11"><span class="latex_title">Remark 11.</span><span class="latex_label"></span><p>It was show here that admitting the generalized Riemann hypothesis,  if <script type="math/tex" id="MathJax-Element-93">a</script> is a Miller-Rabin witness of <script type="math/tex" id="MathJax-Element-94">n</script>, then <script type="math/tex" id="MathJax-Element-95">1\leq a\leq 2\log^2 n</script>. This leads to a deterministic Miller-Rabin primality algorithm with polynomial time complexity <script type="math/tex" id="MathJax-Element-96">\tilde\sO(\log^4 n)</script>， which can be used to verify primality in theory.</p></div>

<h3 id="3-python-implementation-of-miller-rabin-primality-test">3.  Python implementation of Miller-Rabin primality test</h3>

<p>In the implementation of the  algorithm, I customized a <a href="">unit test module</a>  to verify my coding. Generally it will verify if each function in the algorithm will run correctly by testing their result on some customized data. </p>

<p>We use the python code at the end of this section to implement the Miller Rabin test. <br>
During the process of coding, it worth to note that the following code <br>
<code>u=pow(a,s,n)</code> instead of <code>u=a**s%n</code> give the improvement of  running speed. <br>
For the algorithm using <code>u=a**s%n</code> it took 0.001s to get a 19 bits prime. For algorithm using <code>u=pow(a,s,n)</code>  it took 4s to get a 19 bits prime.  </p>

<p>This is because though <code>a**s</code> is implemented in python with <script type="math/tex" id="MathJax-Element-97">\sO(\log s)</script> times multiplication but the digit of <script type="math/tex" id="MathJax-Element-98">a</script> increase to <script type="math/tex" id="MathJax-Element-99">\log^2 n</script> digits, which has time complexity <script type="math/tex" id="MathJax-Element-100">\tilde\sO(\log^2 n)</script> with FFT. <code>pow(a,s,n)</code> is implemented with a combination of Montgomery modular multiplication and exponential by square and has a prefered time complexity <script type="math/tex" id="MathJax-Element-101">\tilde\sO(\log n)</script>.</p>

<p>It tooks 1.3s for <code>generate_prime()</code> to get a prime of 1024 bits and 27s for <code>generate_prime()</code> to get a prime of 2048 bits.</p>



<pre class="prettyprint"><code class=" hljs python">
<span class="hljs-keyword">from</span> random <span class="hljs-keyword">import</span> randrange,getrandbits
<span class="hljs-keyword">from</span> math <span class="hljs-keyword">import</span> log,ceil

<span class="hljs-function"><span class="hljs-keyword">def</span> <span class="hljs-title">nbit_odd</span><span class="hljs-params">(n)</span>:</span>
    <span class="hljs-keyword">if</span> n==<span class="hljs-number">1</span>:
        <span class="hljs-keyword">return</span> <span class="hljs-number">1</span>
    <span class="hljs-keyword">return</span> randrange(<span class="hljs-number">2</span>**(n-<span class="hljs-number">1</span>)+<span class="hljs-number">1</span>,<span class="hljs-number">2</span>**(n),<span class="hljs-number">2</span>)

<span class="hljs-function"><span class="hljs-keyword">def</span> <span class="hljs-title">is_MRnonwitness</span><span class="hljs-params">(a,n)</span>:</span>
    <span class="hljs-keyword">if</span> a==<span class="hljs-number">0</span>:
        <span class="hljs-keyword">return</span> <span class="hljs-keyword">True</span>
    s=n-<span class="hljs-number">1</span>
    t=<span class="hljs-number">0</span>
    <span class="hljs-keyword">while</span> s&amp;<span class="hljs-number">1</span>==<span class="hljs-number">0</span>: 
        s=s&gt;&gt;<span class="hljs-number">1</span>
        t+=<span class="hljs-number">1</span>
    u=pow(a,s,n) 
    <span class="hljs-keyword">if</span> u-<span class="hljs-number">1</span>==<span class="hljs-number">0</span> <span class="hljs-keyword">or</span> u+<span class="hljs-number">1</span>==n:
        <span class="hljs-keyword">return</span> <span class="hljs-keyword">True</span>
    <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> range(t-<span class="hljs-number">1</span>):
        u=pow(u,<span class="hljs-number">2</span>,n)
        <span class="hljs-keyword">if</span> u+<span class="hljs-number">1</span>==n:
            <span class="hljs-keyword">return</span> <span class="hljs-keyword">True</span>
    <span class="hljs-keyword">return</span> <span class="hljs-keyword">False</span>

<span class="hljs-function"><span class="hljs-keyword">def</span> <span class="hljs-title">generate_prime</span><span class="hljs-params">(n)</span>:</span> <span class="hljs-comment"># assert n&gt;1</span>
    <span class="hljs-keyword">assert</span> n&gt;<span class="hljs-number">1</span>
    k=ceil(<span class="hljs-number">43</span>*log(log(n)))
    <span class="hljs-keyword">while</span> <span class="hljs-keyword">True</span>:
        m=nbit_odd(n)
        find=<span class="hljs-keyword">True</span>
        <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> range(k):
            a=getrandbits(n)%m
            <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> is_MRnonwitness(a,m):
                find=<span class="hljs-keyword">False</span>
                <span class="hljs-keyword">break</span>
        <span class="hljs-keyword">if</span> find:  
            <span class="hljs-keyword">return</span> m</code></pre>