# NPM install performance

In a meeting looking at ways we could improve our Jenkins pipeline speed I made
a suggestion that we should require dependencies using standard npm install
via an npm repo instead of installing from git repos.

This suggestion was challenged on the grounds that npm repos shouldn't be faster
than git repos.

To gather some data to inform this idea I have built this repo as a timing test
that does a fairly simple benchmark of different ways of installing using npm.

## Running the test

__Dependencies__

- Install Docker
- `docker pull node`
- `npm install`

__Run the timing__
- `node time.js`

## Method

- Install a package via multiple methods and report the time taken
- Use fresh docker containers for each to ensure repeatable environment
- Mirror ssh creds into the container so git via ssh can be tested

## Results

| Method             | Command                                                                       | Time     |
|--------------------|-------------------------------------------------------------------------------|---------:|
| Npm repo           | `npm install -g express`                                                      |   2.148s |
| Github             | `npm install -g expressjs/express#4.16.3`                                     |   4.447s |
| Git repo           | `npm install -g git://github.com/expressjs/express#4.16.3`                    |   4.364s |
| Git repo via SSH   | `npm install -g git+ssh://git@github.com/expressjs/express#4.16.3`            |   9.675s |
| Large repo via SSH | `npm install -g git+ssh://git@github.com:getndazn/common-web-dazn.git#v0.2.3` |  18.683s |

The results above show that:

- NPM repos are the fastest installation method

- Git repos via SSH take 4.5 times longer than NPM repos in this case

- Both Git repos and Github based installation take roughly the same time

- The larger the repo history, the longer it takes

## Interpretation

If installing a version from a git repo NPM needs to first fetch the repo so
that it has the git index locally. It can then pull the repo to install the
version requested.

The larger the git index the longer the fetch will take. This explains why a repo
with a larger index takes longer to install as NPM has to wait longer for it's
index to fetch before it can pull the specific tag it needs.
