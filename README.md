# GAME_JAM_NAME GAME_JAM_NUMBER

Replace the relevant strings in the [String Variables](/string-vars.md) file with the relevant information.

Visit https://excaliburjs.com/REPO_NAME/ to play!

### Perquisites

- NodeJS 20.x
- Git

### Local Development

Updating your local copy with `git pull -r` to rebase your local commits on top of upstream, makes the `main` easy to follow and merges less difficult.

1. Clone the repo

        git clone https://github.com/excaliburjs/REPO_NAME.git

2. Navigate into the root directory `REPO_NAME` in your favorite command line tool

3. Run the install to download the tools:

        npm install

4. Build the project:

        npm run build

5. Run the game locally with parcel:

        npm start

6. Make your changes, commit directly to the 'main' branch, update your local copy with `git pull -r`, and then push to the remote repository.

#### Debugging tools

We have excalibur chrome extension https://chromewebstore.google.com/detail/excalibur-dev-tools/dinddaeielhddflijbbcmpefamfffekc