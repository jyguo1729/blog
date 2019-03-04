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

$$
\newcommand{\pd}{\partial}
\newcommand{\bi}{\mathbb i}
\newcommand{\bC}{\mathbb C}
\newcommand{\bE}{\mathbb E}
\newcommand{\bF}{\mathbb F}
\newcommand{\bN}{\mathbb N}
\newcommand{\bP}{\mathbb P}
\newcommand{\bQ}{\mathbb Q}
\newcommand{\bR}{\mathbb R}
\newcommand{\bZ}{\mathbb Z}
\newcommand{\cA}{\mathcal A}
\newcommand{\cB}{\mathcal B}
\newcommand{\cC}{\mathcal C}
\newcommand{\cD}{\mathcal D}
\newcommand{\cE}{\mathcal E}
\newcommand{\cF}{\mathcal F}
\newcommand{\cM}{\mathcal M}
\newcommand{\cO}{\mathcal O}
\newcommand{\cP}{\mathcal P}
\newcommand{\cT}{\mathcal T}
\newcommand{\half}{\frac{1}{2}}
\newcommand{\cV}{\mathcal V}
\newcommand{\cW}{\mathcal W}
\newcommand{\bx}{\boldsymbol}
\newcommand{\ud}{\mathrm{d}}
\newcommand{\uD}{\mathrm{D}}
\newcommand{\fh}{\mathfrak{h}}
\newcommand{\fg}{\mathfrak{g}}
\newcommand{\ft}{\mathfrak{t}}
\newcommand{\fU}{\mathfrak{U}}
\newcommand{\sG}{\mathscr{G}}
\newcommand{\sA}{\mathscr{A}}
\newcommand{\sB}{\mathscr{B}}
\newcommand{\sC}{\mathscr{C}}
\newcommand{\sE}{\mathscr{E}}
\newcommand{\sH}{\mathscr{H}}
\newcommand{\sO}{\mathscr{O}}
\newcommand{\sM}{\mathscr{M}}
\newcommand{\sS}{\mathscr{S}}
\newcommand{\sU}{\mathscr{U}}
\newcommand{\rH}{\mathrm{H}}
\newcommand{\sR}{\mathscr{R}}
\newcommand{\sT}{\mathscr{T}}
\newcommand{\sD}{\mathscr{D}}
\newcommand{\loto}{\longrightarrow}
\newcommand{\lmto}{\longmapsto}
\newcommand{\gal}{\alpha}
\newcommand{\gbe}{\beta}
\newcommand{\gga}{\gamma}
\newcommand{\gde}{\delta}
\newcommand{\gep}{\epsilon}
\newcommand{\vp}{\varphi}
\newcommand{\pbs}{\bar\pd^*}
\newcommand{\pb}{\bar\pd}
\DeclareMathOperator{\ad}{ad}
\DeclareMathOperator{\Ad}{Ad}
\DeclareMathOperator{\Aut}{Aut}
\DeclareMathOperator{\End}{End}
\DeclareMathOperator{\Ker}{Ker}
\DeclareMathOperator{\Rank}{Rank}
\DeclareMathOperator{\Coker}{Coker}
\DeclareMathOperator{\im}{im}
\DeclareMathOperator{\Tr}{Tr}
\DeclareMathOperator{\D}{D}
\newcommand{\be}{\begin{equation}}
\newcommand{\ee}{\end{equation}}
\newcommand{\bes}{\begin{equation*}}
\newcommand{\ees}{\end{equation*}}
\newcommand{\bea}{\begin{eqnarray}}
\newcommand{\eea}{\end{eqnarray}}
\newcommand{\beas}{\begin{eqnarray*}}
\newcommand{\eeas}{\end{eqnarray*}}
\newcommand{\ben}{\begin{eqnarray*}}
\newcommand{\een}{\end{eqnarray*}}
\newcommand{\bst}{\begin{split}}
\newcommand{\est}{\end{split}}
\newcommand{\bp}{\begin{proof}}
\newcommand{\ep}{\end{proof}}
\newcommand{\bex}{\begin{exercise}}
\newcommand{\eex}{\end{exercise}}
\newcommand{\bz}{\bar z}
$$
This line shows the autonumbering error still need to be fixed.

## 0. Introduction

This article explains the Miller-Rabin primality test in cryptography. It consists of three parts. The first part gives the math background for this algorithm and adaptations to make it practical to real world use. The second part gives a python impeletion The third part discuss the design of the corresponding unit test to make sure the algorithm is correct.  

## 1. Math background for the Miller-Rabin primality test
The main reference for this section is [An Introduction to Cryptography](https://www.mathematik.uni-kl.de/~ederc/download/Cryptography.pdf)

### 1.1 Fermat's primality test
First let us recall the Fermat's little Theorem.

> **Theorem** (Fermat's little Theorem).
 Let p be a prime number, then $a^{p-1}=1$  for any $a\in  (\bZ/ p\bZ)^* $in unit of $\bZ/ p\bZ$.
 
######  {#defFwit}
>**Definition**.
>1. For a general integer $n$,  $a\in  (\bZ/ n\bZ)^* $ is called a **Fermat witness (for the compositeness)**  of $n$ if $a^{n-1}\neq{1}$ . $a$ is  called a **Fermat non-witness** of $n$ if $a^{n-1}=1$. Equivalently, $n$ is a called **pseudoprime with  Fermat non-witness** $a$.
2. Let $F$ be the set of Fermat witness of $n$,  $n$ is called **Carmichael number** if $F$ is empty and n is composite.

It can be seen from [def](#defFwit) cearly that if $n$ is a pseudo prim$\ref{vca}$e number with every unit being a Fermat non-witness,  then $n$ is either a prime number or Carmichael number. 

Fermat's little Theorem leads to an algorithm called Fermat's primality test. 
we have the following naive deterministic algorithm. 
```
def fun(n):
	for a in set{1,...,n-1}
		if a^(n-1)!=1 mod n:
			return false
	return True  
```
The first problem of this algorithm is even if `fun(n)` is true, $n$ is either a prime number or a Carmichael number. As shown in [here](https://dms.umontreal.ca/~andrew/PDF/carmichael.pdf) , there is infinite number of Carmichael numbers. Prime numbers and Carmichael number can not be distinguished simply.

The second problem is the time complexity.  The  Fermat’s primality test has time complexity $\tilde\sO(n)$. 

In fact, the first $n$ comes from the times of loops. To do the modular exponential $a^{n-1} \mod n$. One may apply [exponentiating by squaring algorithm](https://simple.wikipedia.org/wiki/Exponentiation_by_squaring) to reduce the task to compute product of two number less than $n$, this gives us a factor $\log n$. The product of two numbers with digits less than $\log n$ can be treated by  [FFT algorithm](https://en.wikipedia.org/wiki/Sch%C3%B6nhage%E2%80%93Strassen_algorithm) with time complexity $\sO(\log n\log\log n\log\log\log n)$. So the time complexity of the loop body is $\tilde\sO(\log^2 n)$.

The first factor $n$ gives a lot restriction to the time complexity and Fermat primality test an actual exponential time algorithm relative to $\log n$.
 >**Remark**
One may attempt to modify the Fermat's primality test algorithm to be a probabilistic one selecting different numbers in $\{1,..,,n-1\}$ randomly for k times. This algorithm has time complexity $\tilde\sO(k\cdot\log^2 n)$. 
Let $N_F=\{\textrm{Fermat non-Witness of } n\}$. Let C be event that $n$ is a composite, $T_k$ be event that after the output running the "probabilistic" Fermat’s primality test is `True`, then \\[P(T_k|C)\leq(\frac{|N_F|}n)^k.\\]Since $n$ can be Carmelson number, the upper bound of $P(T_k|C)$ can be 1. Hence this algorithm will is not probabilistic.


###  1.2 Miller-Rabin  primality test
Miller-Rabin test is an probabilistic polynomial algorithm. It improves the Fermat's primality test at the two problems mentioned in 1.1. It relied on the following proposition.


> **Proposition** .
Let $p$ be a prime number. $x^2-1=0$ has exactly two solutions $1$,$-1$ for $x$ in $\bZ/p\bZ$.

Based on this we have the following proposition for prime numbers.
>**Proposition**.
Let p be a prime number, $a\in  (\bZ/ n \bZ)^* $.  Suppose $p-1=s\cdot2^t$, where $s$ is an odd number, t is an integer. Then
\\[
\begin{equation}
\begin{split}
&a^s=\pm1\textrm{  or}  \\ 
&a^{s2^k}=-1 \textrm{  for some }k\in\{1,\dots,t-1 \} 
\end{split}
\end{equation}
\\]

One may prove it by considering the minimal element of form $a^{s2^k}$ satisfying $a^{s2^k}=1$.

This is leads to following definition analoging Fermat's witness.
>**Definition**.
 For a general integer $n$,  $a\in  (\bZ/ n\bZ)^* $ is called a **Miller-Rabin witness (for the compositeness)**  of $n$. Let $n-1=s2^{t}$ if
\\[
\begin{equation}
\begin{split}
a^s&=\pm1\textrm{  or}  \\ 
a^{s2^k}&=-1 \textrm{  for some }k\in\{1,\dots,t-1 \} 
\end{split}
\end{equation}
\\]

>Otherwise $a$ is  called a **Miller-Rabin non-witness** of $n$.

Correspondingly the following algorithm is designed to test if a number $a$ is a Miller-Rabin non-witness of $n$. We may assume $a\in  \{1,\dots ,n-1\} $. 
```
def isMillerRabinNonWitness(a,n):
		find s,t for n-1
		u=2^s
		if u==1 or -1 mod n:
			return False
		loop t-1 times
			u=u*u mod n
			if u=-1 mod n:
				return False
	return True  
```

The time complexity of  checking $a$ being Miller-Rabin non-witness is $\tilde\sO(\log ^2 n)$.

 - Time complexity to get $s$ is $\sO(\log n)$.
 - Time complexity to get $u$ is $\tilde\sO(\log^2 n)$. [A similar analysis appears in 1.1]
 - Time complexity for the loop is $\tilde\sO(\log^2 n)$. [loop $\sO(\log n)$ times, the loop body has time complexity $\tilde\sO(\log n)$] 

The Miller-Rabin primality probabilistic algorithm is designed as the following.
```
def fun(n):
	loop k times
		randomly choose different a in {1,..,,n-1}
		if isMillerRabinNonWitness(a,n)
			return False
	return True
```
This is a probabilistic polynomial algorithm of time complexity $ \tilde\sO(k\cdot\log^2 n)$ with respect $\log n$.  

we use the concept of precision in data science. The precision of  Miller-Rabin primality probabilistic algorithm.
>**Definition**
Let $C$ be event that $n$ is a composite, $P$ be event that $n$ is a prime. $T_k$ be event that after the output running Miller-Rabin primality probabilistic algorithm is `True`. The **precision** of  Miller-Rabin primality probabilistic algorithm is defined as $P(P|T_k)$.

The Miller-Rabin primality probabilistic algorithm has good estimation for precision.
Let $N=\{\textrm{Miller-Rabin non-iWitness of } n\}$. L, then 
\\[P(T_k|C)\leq(\frac{|N|}n)^k,\\]
and
\\[P(P|T_k)=1-P(T_k|C)\geq1-(\frac{|N|}n)^k.\\]

Not like the case discussed in the remark 1.1, $|N|$ has the following description.  
>**Theorem**.
Let n be an integer, then $|N|\leq \phi(n)/4<n/4$, where $\phi(n)$ is the Euler's phi function.  

Check [here]((https://www.mathematik.uni-kl.de/~ederc/download/Cryptography.pdf)) Theorem 9.11 for the proof.

Pick one estimation from  estimations based on [prime number theorem](https://en.wikipedia.org/wiki/Prime_number_theorem),
>**Theorem**.
Let $\pi(x)$ be the [prime-counting function](https://en.wikipedia.org/wiki/Prime-counting_function) that gives the number of primes less than or equal to x, then 
\\[\frac{1}{\log x+2}<\frac {\pi(x)}x<\frac{1}{\log x-4}.\\]

Check [here](https://www.jstor.org/stable/2371291?origin=crossref&seq=1#page_scan_tab_contents) for the proof.
By the Bayes formula, for a $m$ bit number $n$,let $N=2^m$, we have 

$$
\begin{equation}
\begin{split}
	P(P|T_k)&=\frac{P(T_k|P)P(P)}{P(T_k|P)P(P)+P(T_k|C)P(C)}\\
	&>\frac {\pi(N)/N}{\pi(N)/N+\frac1{4^k}(1-\pi(N)/N)}\\
	&=\frac{1}{1+\frac1{4^N}(N/\pi(N)-1)}\\
	&>\frac{1}{1+\frac1{4^k}(\log N+1)}\\
	&>1-\frac{m}{4^{k-1}}
\end{split}	
\end{equation}
$$

The last inequality  require $k>\log m$, the second last inequality used the theorem above. 

Though the Miller-Rabin primality probabilistic algorithm can not be used for determine a number being prime theoretically. As noted [here](https://stackoverflow.com/questions/4159333/rsa-and-prime-generator-algorithms/4160517#4160517) , the probability for a CPU has one error has a lower bound $1.8*10^{-24}$. So one may choose $k\geq43\log \log n$ to guarantee the precision of the algorithm is suitable for practical use. 

>**Remark**.
> It was show here that admitting the generalized Riemann hypothesis,  if $a$ is a Miller-Rabin witness of $n$, then $1\leq a\leq 2\log^2 n$. This leads to a deterministic Miller-Rabin primality algorithm with polynomial time complexity $\tilde\sO(\log^4 n)$， which can be used to verify primality in theory.

### 2 Python implementation of Miller-Rabin primality test
