# Prompt

1 - First we need to get some opening acts. There are two categories: similarity and popularity. Popularity you can get from the apoi. Similarity is a metric we define as how close a related artist's genre tags match Daft Punks genre tags. Return a list of similar artist sorted first by similarity. then popularity

```
Type in daft punk in the search bar, the request will be a post method to endpoint
https://accounts.spotify.com/api/token 
retrieve the token

After the token make another request to the endpoint 
https://api.spotify.com/v1/search?q=${artist}&type=artist
to get the artist information such as id and genre tags

After I got the information, I made another call to the endpoint
https://api.spotify.com/v1/artists/${artistId}/related-artists
to get a list of the artists that are similarity

I took the related-artist and separte them by matching genre tags to return an array of
[[], [], []] 0 index will given to me if all of the searched artist's tags match, then 1 less etc..

Afterwards we sort the array so that there it's it looks like
[[arist, matchingTags], [artist, matchingTags], etc...]

```

2 - We want to make sure the tour performs well. find the top 3 albums by popularity availble in the US for each artist. This should help the artists organize their song selection.

```
After I sorted out the list [[arist, matchingTags], [artist, matchingTags], etc...] I looped through them to make two more api calls for their albums then ablums&track

https://api.spotify.com/v1/artists/${simArr[i].id}/albums?album_type=album&market=US
To get a list of their albums id
Use promise.all[listOfApiCalls]

Then another endpoint to get their albums and tracks
https://api.spotify.com/v1/albums?ids=${getAlbums}&market=US
To get their albums track and sort by popularity and filter out the first three albums. After I retieveD their albums, I concat the string of the albumsid then repeat the process of promise API calls and then make the promise.all[listOfAblumsApiCalls]

```


3 - The artists claim they "dont understand Americans" and give up on organizing their own song selection for concert. Using the top 3 albums, create a 15 song setlist. Each album should contribute X number of songs to the setlist where X is proportional to that album's realtive popularity.

```
After I got their top 3 albums, for each artist I needed to figure out their ratio with

if they had 3 albums it would be =>
(popularity + popularity + popularity) / 15 = ratio
X = Math.round(popularity / ratio) returns the number of songs from each album

Randomly select tracks from each album up til X songs and push it into the songsList and append it to the HTML

* How it renders on the page
First Ul element will be the artist Searched for
- Id
- Genre tags

Artists Ul elements for artist: Search for artist: Artistname
- Matching tags
- Popularity
- Genre Tags
- ...List of songs

```

4 - Now tha tyou are familiar with the API and its data model, it is time to utilize this knowolege to evalue a market channel. For the following questins, assume that you have the ability to serve ads directly to users on the Spotify platform.

  ```
  *** Assuming this ad will be an ad for ease ***
  ```

  a) Explaing which endpoint(s) you would use to target a user and how you would determine if the add yield a positive ROI.

  ```
  There would have been another end point to look up for the certain tracks

  https://api.spotify.com/v1/tracks?ids={tracksID}&market=US
  This would have been the best endpoint because I found out the top 3 popular albums of an artist, and got 15 tracks from the 3 ablums. The addition endpoint to retrieve the tracks tells us how how popular the track is.

  We can serve the ads on that top album top few songs;
  ```
  b) Describe a lightweight test to validate this hypothesis.
  ```
  For the lightweight test, I would have 3 groups
  
  1) highest rated albums and track
  2) mid rated albums and track
  3) low rated albums and track

  We serve the same ad for ease on the tracks associated with their popularity to see which group ads will get the most clicks.

  hypothesis: Group 1 will have the most clicks on the ad because they have the most users playing those certain tracks;

  ```

  c) Assuming the test is successful, describe how you would scale the channel to better target users overtime. 
  
  ```
  Assuming the the hypothesis is correct, we now know that the highest rated albums and tracks yields the best ROI;

  Ways we can scale and better target users overtime.
  - Do some market research on what songs are normally enjoyed with ease products and serve the ads on those genres and popular songs

  - Only serve ads on the location of the spotify marketing channel that ease is located in to save cost on ads
    * if possible find out the user age, and if we can somehow know the user age, we can only serve the ads to the users that are 18+ (or the legal age) to further cut cost

  - If possible we can contact the artists and use some marketing budget to see if they can be an influencer for ease and have ease associated with the artist to piggyback off their reputation.

  - Scale it across similar channels like spotify
  ```
