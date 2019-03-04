---
layout:     post
title:      Automatic hyperparameter optimization using Talos on a regression based on MLP model 
subtitle:   A data analysis project
date:       2019-2-28
author:     Jiayin Guo
header-img: img/post-bg-universe.jpg
catalog: true
tags:
    - Machine Learning
---
<h3 id="1-introduction">1. Introduction</h3>

<p>This post is on automatic hyperparameter optimization using Talos on a regression based on MLP model. It can been regarded as the metadata for the <a href="https://github.com/jyguo1729/MLP_crime_model">MLP_crime_model</a> data analysis report in my GitHub.</p>

<p><a href="https://github.com/autonomio/talos">Talos</a> is  an automatic hyperparameter optimization tool for machine learning. To demonstrate the usage of Talos, I choose the community crime data set provided by <a href="https://archive.ics.uci.edu/ml/datasets/Communities+and+Crime">UCI dataset repository for machine learning</a> and use the MLP model for regression task.</p>

<p>We use mean squared error as loss function and <script type="math/tex" id="MathJax-Element-1">1-r</script> s the metric for models, where <script type="math/tex" id="MathJax-Element-2">r</script> is the  correlation coefficient and get the best r_value as 0.78 in the experiment(Section 6) which is a improvement based on the initial MLP model with r_value 0.60.  </p>

<p>While explaining the the process of data science project some small tricks is included. Some further questions is asked at the end this post and will be solved in the further post, hopefully.</p>

<h3 id="2-experiment-setup">2. Experiment setup</h3>

<p>The data set has 1994 item and has 128 attributions with 127 being numeric type and one attribution <code>communityname</code> as string type. The <code>ViolentCrimePerPop</code> is the attribution we want to predict. In the data preparation section I did the following:</p>

<ul>
<li>Convert the original data set as DataFrame <code>data</code> indexed by <code>communityname</code></li>
<li>Separate <code>data</code> as data <code>x</code> and target <code>y</code> Normalize <code>x</code> and replace all <code>np.NaN</code> to 0. (added this after experiment 6)</li>
<li>Separate <code>x</code> and <code>y</code> as training data ,validation data and test data.</li>
</ul>

<p>Follows the tutorial of Talos we set the model, set the parameter space run the experiment in section 2, 3 and 4 in our report respectively. I set three dictionary or set <code>variablesbest_param_each_round</code> <br>
,<code>data_each_round</code> <br>
,<code>exp_nums</code> to store the experiment result in each round they will be used to generate the summary report at the summary section 6.</p>

<p>For the display part, I use section 5 to display the result of the current experiment. As <code>mse</code> is the loss function for each model. I use <code>r_value</code> <script type="math/tex" id="MathJax-Element-3">=1-r</script> as the metric for different models and plot the correlation graph for the best model by the metric in each round of experiment.  The reason for consider both <code>mse</code> and  <code>r_value</code>  is that they indicates different aspect of the fit of the model, it is worth to <a href="https://dsp.stackexchange.com/questions/9491/normalized-square-error-vs-pearson-correlation-as-similarity-measures-of-two-sig">note</a> that they are quite related when the predictions are ground truth are of same mean and variance.   I use <code>val_r_value</code>  r_value for validation data to select best model as one can expect validation data tends to have larger metric than training data.    </p>

<p>I use Section 6 to display the results of all experiments.</p>

<h3 id="3-experiment-process">3. Experiment process</h3>

<p><img src="https://lh3.googleusercontent.com/-IMm1ar-9qfA/XHhn9hFf03I/AAAAAAAA0J0/O6YGC-Qf0roQSyQbdH5r79Tn9w0shuCkwCLcBGAs/s0/exp_1.png" alt="enter image description here" title="exp_1.png"> <br>
In the first experiment,  I just test if this setup works well by setting one set of parameter in parameter space and get <code>val_r_value</code> equals 0.40, which corresponds to correlation coefficient as 0.60.</p>

<p><img src="https://lh3.googleusercontent.com/-CG8v5fh3oeg/XHh0BNckSmI/AAAAAAAA0KE/V2_7zff6ZislT_txUIDo0Q7ogl0hnZxFwCLcBGAs/s0/exp_3.png" alt="enter image description here" title="exp_3.png"></p>

<p>In experiment 2-6 I try to vary <code>first_neuron</code>, <code>first_activation</code>, <code>hidden_layer</code>,<code>hidden_neuron</code>, <code>batch_size</code>,<code>epochs</code>,<code>kernel_initializer</code>,<code>optimizers</code>,<code>activation</code>.</p>

<p>The best result appears in experiment 3 with <code>val_r_value</code> equals 0.27. <br>
We observe the following points.</p>

<ul>
<li>there is no special preference of individual <code>optimizers</code>,<code>kernel_initializer</code>,<code>first_activation</code>,<code>activation</code> but some combination gives good <code>val_r_value</code></li>
<li><code>batch_size</code>,<code>epochs</code> need to be bigger to stabilized <code>val_r_value</code>.</li>
<li><code>val_r_value</code> is highly sensitive to the hyperparameter.</li>
</ul>

<p><img src="https://lh3.googleusercontent.com/-bQT-rktEx4M/XHh3g_M6CZI/AAAAAAAA0KU/H_dymRJctVcU-4X0B_Sry6KeEEcQeRYDQCLcBGAs/s0/exp_7.png" alt="enter image description here" title="exp_7.png">  <br>
 In experiment 7 I tried to normalized the <code>x</code> and <code>y</code> and add one more hyper perimeter <code>lr</code> as learning rate for <code>SGD</code>, as the optimisers I tried has their recommended learning rates. We observe the following points.</p>

<ul>
<li><code>val_r_value</code> is lowered </li>
<li><code>val_r_value</code>  is not sensitive to the hyperparameter <code>lr</code></li>
</ul>

<p>So it seems normalize the data gives improvement <code>val_r_value</code> to 0.22.</p>

<p><img src="https://lh3.googleusercontent.com/-E3ANz2tGk7s/XHh6-NyRrAI/AAAAAAAA0Kk/ZimHQWBYuJMrXu03ENKmWUJ26iXhVopQACLcBGAs/s0/exp_11.png" alt="enter image description here" title="exp_11.png"></p>

<p>In experiment 8-11 I try to vary hyperparameters using the normalized data and add one more hyperparameter <code>dropout</code>. Finally improve  <code>val_r_value</code> to 0.20.</p>

<h3 id="4-problems-to-do">4. Problems to do</h3>

<ul>
<li>I did not compare MLP model with other model for regression.</li>
<li>In this data analysis, I do not use the cross validation technique. </li>
<li><p>From the final model we can see the over fit problems still exists.</p>

<p><img src="https://lh3.googleusercontent.com/s284jtyugN2xecM8Ra6-qMQyUH7XlOwYSjqnoUKe3AJ7qawxgUtfu1tzGpgP2VMnvowzlnkgzjOW_g=s300" alt="enter image description here" title="exp_10_test.png"><img src="https://lh3.googleusercontent.com/9Ux9dOKJgnpdVSrLdCcsYzDgq77kVMXK3IvCj7_bjZxcExT8Yx2czCnJySNBcteRgEhJrLvLdlNf0w=s300" alt="enter image description here" title="exp_10_val.png"><img src="https://lh3.googleusercontent.com/lzVluDrplpAx8pBUEbqTAmmVPmRHpuLCQ7FLr8IrU9Fcpgo-CLZVYuG_Ruzh-4HVAOaMewRAu7tflw=s300" alt="enter image description here" title="exp_10_train.png"></p></li>
</ul>