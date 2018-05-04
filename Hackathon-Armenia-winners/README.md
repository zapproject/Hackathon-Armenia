# Oracle BM
A source validation mechanism for blockchain oracle

## Introduction

### Oracle?
In ancient Greece people believed that there were people, oracles, who could
communicate with gods and bring information about future. After the invenion of
the blockchain technologies, the word oracle got one other meaning.
Since blockchains do not have access to information from ouside the chain, they
rely on oracles to provide them with data.

### The problem
Since the ideal
decentralized oracle has not been found yet, many blockchains use centralized
oracles. But what if the centralized oracle's source is compromised? Then all
the benefits of having a decentralized blockchain will be lost. That's why it is
so important to find a decentralized oracle, or a decentralized way to validate
the sources of the oracle.

### How we solve the problem
In the Yerevan's Blockhain hackathon we developed a method to validate data from different sources. The main idea is that people bid some amount of money and vote for the correct data, or provide their own data. After the voting is done the source with biggest number of votes is considered as validated and people who voted for it are considered winners. The winners get some profit, that comes from people's bids who lost. The percentage of winning money depends on other bids also. The percentage is higher if the bid is closer to the mean of all bids. More information about the method can be found below. Since most of the time the decision between true and false data will be trivial, the risk of losing money is low, hence after winning the percentage of money won will not be high.

## Let's dive into math
Now let's see how all this is organized.

Assume we have sources __A__, __B__, __C__ and __D__ with data shown in the table:

| Source | A | B | C | D |
| -------| - | - | - | - |
| Data   | a | b | c | d |

 Now we want to validate the sources. We put these sources with the data they provide in voting. After the voting we have the following picture

 | User | Amount bidded | Voted for |
 | ---- | ------------- | ---- |
 | 1    | 12            | a    |
 | 2    | 1             | a    |
 | 3    | 10            | b    |
 | 4    | 15            | c    |
 | 5    | 120           | a    |
 | 6    | 0.1           | e    |
 | 7    | 120000        | e    |
 | 8    | 17            | a    |

 At first, we count the votes, if the user voted for a data that doesn't exist in the sources we add the data to the sources. e.g the user __6__ and __7__ voted for __e__, but there doesn't exist source with data __e__. Hence, the new sources will look like

| Source | A | B | C | D | 6, 7 |
| -------| - | - | - | - | ---- |
| Data   | a | b | c | d | e    |

If data exists in the sources, we increase the counting, so that we can find the source with the highest value. If more than one data has the same amount of voting as another data, both of them are considered winners. 
Now, that we have the validated data and the winners we need to grant them prizes. For that

1. We count the mean of bidded money

![equation](http://chart.apis.google.com/chart?cht=tx&chl=%5Cbar%7BX%7D%20%3D%20%5Cfrac%7B%20%5Csum_i%5En%20X_%7Bi%7D%20%7D%7Bn%7D)

2. Then we find variences of the amounts of bidded from the mean. Here we can ignore the money bidded from users who lost

![equation](http://chart.apis.google.com/chart?cht=tx&chl=%5Csigma%20_%7Bi%7D%20%3D%20%7C%20X_%7Bi%7D%20-%20%5Cbar%7BX%7D%20%7C)

3. We want people who bidded closer to average receive more percent from the prize. This is done to keep equality, so it is not possible for some reach guy to come, put a huge amount of money on right answer and receive the majority of money. For that we reverse the variences, but add 1 in denumerator to eliminate the 0 case.

![equation](http://chart.apis.google.com/chart?cht=tx&chl=%5Cdelta%20_%7Bi%7D%20%3D%20%5Cfrac%7Bq%7D%7B1%20%2B%20%5Csigma%20_%7Bi%7D%20%7D)

4. Now let's convert the amounts we got to interval __[0,1]__ so we can see what percent of the prize each winner will get

![equation](http://chart.apis.google.com/chart?cht=tx&chl=%5Cxi%20_%7Bi%7D%20%3D%20%5Cfrac%7B%5Cdelta_%7Bi%7D%7D%7B%20%20%5Csum_k%5En%20%5Cdelta_%7Bk%7D%20%20%7D)

5. Now to get total amount of the prize we sum up all the money people lost

![equation](http://chart.apis.google.com/chart?cht=tx&chl=%5Ctextrm%7BTotal%20Prize%7D%20%5Cquad%20%20%5CTheta%20%20%3D%20%20%5Csum_i%5En%20%20%5Ctheta%20_%7Bi%7D)
    Where   ![equation](http://chart.apis.google.com/chart?cht=tx&chl=%5Ctheta%20_%7Bi%7D) is the amount that i th user lost. If the user won, it is equal to 0

6. Now it is easy to find the money each winner will get, by

![equation](http://chart.apis.google.com/chart?cht=tx&chl=%5Comega_%7Bi%7D%20%20%3D%20%20%5CTheta%20%20%20%5Cxi%20_%7Bi%7D)

## Demonstration
The code in this repository does all the steps described above and shows the results in nice and beutiful way.
The proof of work demo is available [here](https://fathomless-headland-28312.herokuapp.com/). 
Alternatively, you can download and run it on your own machine.
To run the code, clone or download this repository
```
$ git clone https://github.com/KarlosMuradyan/Hackathon-Armenia.git
$ cd Hackathon-Armenia
```
Make sure you have `node` and `npm` installed and install the dependecies by typing
```
$ npm install
```
After this you can start the server by typing
```
$ npm start
```
Which will start on the server on `port 3000`. If you want to start on other port provide it with enviromental variable
```
$ PORT=<desired port> npm start
```
Now navigate to `localhost:3000` or `localhost:<provided port>` on your browser. Fill the data and click on submit button. The results will be shown in same page.

## Want to contribute?

Any advice, suggestion, crticism or contribution is welcomed. Feel free to contact us with any issue.

## Authors

The idea is completely developed by team Triengine consisted by __Grigor Bezirganyan__ and __Karlos Muradyan__
