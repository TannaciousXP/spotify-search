# Prompt

1 - First we need to get some opening acts. There are two categories: similarity and popularity. Popularity you can get from the apoi. Similarity is a metric we define as how close a related artist's genre tags match Daft Punks genre tags. Return a list of similar artist sorted first by similarity. then popularity

```
Type in daft punk in the search bar, the request will be a post method to endpoint
https://accounts.spotify.com/api/token 
retrieve the token

After the token make another request to the endpoint 
https://api.spotify.com/v1/search?q=${artist}&type=artist
to get the artist information such as id and genre tags

After we get the information, we make another call to the endpoint
https://api.spotify.com/v1/artists/${artistId}/related-artists
to get a list of the artist that are similarity

We take the related-artist and separte them by matching genre tags to return an array of
[[], [], []] 0 index will give us if all of the search artist tags match, then 1 less etc..

```

2 - We want to make sure the tour performs well. find the top 3 albums by popularity availble in the US for each artist. This should help the artists organize their song selection.

```
After we make sorted out the list [[], [], []] we should loop through them to make two more api calls for their albums

https://api.spotify.com/v1/artists/${simArr[i].id}/albums?album_type=album&market=US
To get a list of their albums id

https://api.spotify.com/v1/albums?ids=${getAlbums}&market=US
To get their albums track and sort by popularity and filter out the first three albums

```


3 - The artists claim they "dont understand Americans" and give up on organizing their own song selection for concert. Using the top 3 albums, create a 15 song setlist. Each album should contribute X number of songs to the setlist where X is proportional to that album's realtive popularity.

```
After we get their top 3 albums, for each artist we need to figure out their ratio with
(popularity + popularity + popularity) / 15 = ratio
X = Math.round(popularity / ratio) returns the number of songs from each album

Do Math.random to select tracks from each album;
```

4 - Now tha tyou are familiar with the APOI and its data model, it is time to utilize this knowolege to evalue a market channel. For the following questins, assume that you have the ability to serve ads directly to users on the Spotify platform.  
  
  a) Explaing which endpoint(s) you would use to target a user and how you would dtermine if the add yield a positive ROI.  
  b) Describe a lightweight test to validate this hypothesis.
  c) Assuming the test is successful, describe how you owuld scale the channel to better target users overtime. 

